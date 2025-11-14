import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caseDetails, evidenceList, jurisdiction } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are a legal case strength analyzer specializing in Canadian law.
Analyze case details and provide objective probability assessments.
Base your analysis on legal precedent, evidence strength, and applicable law.
DO NOT provide legal advice, only analytical assessments.
Always include disclaimers that this is not legal advice.`;

    const prompt = `Analyze the following case and provide a strength assessment:

Jurisdiction: ${jurisdiction || 'Ontario, Canada'}
Case Details: ${JSON.stringify(caseDetails)}
Available Evidence: ${JSON.stringify(evidenceList)}

Provide analysis in JSON format with:
- strengthScore (0-100): Overall case strength
- successProbability (low/medium/high): Likelihood of favorable outcome
- strengths (array): Key strengths of the case
- weaknesses (array): Potential weaknesses or challenges
- recommendations (array): Steps to strengthen the case
- legalBasis (string): Applicable laws and precedents
- riskFactors (array): Potential risks or concerns
- estimatedTimeline (string): Typical timeline for this type of case

Remember: This is educational analysis, not legal advice.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "analyze_case_strength",
            description: "Analyze legal case strength and provide assessment",
            parameters: {
              type: "object",
              properties: {
                strengthScore: { type: "number", minimum: 0, maximum: 100 },
                successProbability: { type: "string", enum: ["low", "medium", "high"] },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                legalBasis: { type: "string" },
                riskFactors: { type: "array", items: { type: "string" } },
                estimatedTimeline: { type: "string" }
              },
              required: ["strengthScore", "successProbability", "strengths", "weaknesses", "recommendations"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "analyze_case_strength" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error analyzing case strength:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
