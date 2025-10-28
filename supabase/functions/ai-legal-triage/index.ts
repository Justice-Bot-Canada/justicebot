import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("AI Triage request received, processing with Lovable AI");

    const systemPrompt = `You are Justice-Bot, an expert AI legal assistant specializing in Canadian law, particularly Ontario tribunals and courts.

Your role is to:
1. Assess the user's legal situation with empathy and clarity
2. Identify the correct legal pathway (HRTO, LTB, Small Claims, Family Court, etc.)
3. Determine urgency and deadlines
4. Provide a clear case strength assessment (1-10 scale)
5. Suggest immediate next steps
6. Identify if they qualify for low-income assistance

Key tribunals you help with:
- Human Rights Tribunal of Ontario (HRTO)
- Landlord and Tenant Board (LTB)
- Small Claims Court
- Family Court
- Superior Court
- Labour Board
- Immigration matters

Always:
- Ask clarifying questions to understand the full situation
- Provide specific form names and deadlines
- Explain legal concepts in plain language
- Assess merit score realistically
- Suggest whether they need premium features (forms, analysis, tracking)
- Flag urgent cases (deadlines < 30 days)

Format your responses clearly with sections:
- Case Type
- Urgency Level
- Merit Score (1-10)
- Recommended Pathway
- Next Steps
- Forms Needed`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in ai-legal-triage:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
