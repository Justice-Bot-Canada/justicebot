import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const OrganizeEvidenceSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  description: z.string().trim().max(1000).optional(),
  ocrText: z.string().max(50000).optional(),
  caseType: z.string().trim().max(100).optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    
    // Validate input
    const validation = OrganizeEvidenceSchema.safeParse(requestBody);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request data',
          details: validation.error.issues.map(i => i.message).join(', ')
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { fileName, description, ocrText, caseType } = validation.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are an evidence organization assistant for legal cases.
Analyze evidence documents and suggest appropriate tags, categories, and organization.
Help users efficiently categorize their evidence for legal proceedings.`;

    const prompt = `Analyze this evidence and suggest organization:

File Name: ${fileName}
Description: ${description || 'No description provided'}
Case Type: ${caseType || 'General'}
${ocrText ? `Document Content Preview: ${ocrText.substring(0, 500)}...` : ''}

Suggest:
- Category (emails, photos, contracts, receipts, medical, police-reports, correspondence, witness-statements, other)
- Tags (array of relevant keywords)
- Priority (low/medium/high/critical)
- Recommended order/sequence for presentation
- Brief relevance summary`;

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
            name: "organize_evidence",
            description: "Suggest organization for evidence document",
            parameters: {
              type: "object",
              properties: {
                category: { 
                  type: "string", 
                  enum: ["emails", "photos", "contracts", "receipts", "medical", "police-reports", "correspondence", "witness-statements", "other"]
                },
                tags: { type: "array", items: { type: "string" } },
                priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
                orderSuggestion: { type: "number" },
                relevanceSummary: { type: "string" }
              },
              required: ["category", "tags", "priority", "relevanceSummary"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "organize_evidence" } }
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
    const suggestions = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error organizing evidence:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
