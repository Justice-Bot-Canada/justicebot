import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const PrefillFormSchema = z.object({
  triageData: z.string().trim().min(10).max(10000),
  formFields: z.array(z.record(z.unknown())).min(1),
  userProfile: z.record(z.unknown()).optional()
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    
    // Validate input
    const validation = PrefillFormSchema.safeParse(requestBody);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request data',
          details: validation.error.issues.map(i => i.message).join(', ')
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const { triageData, formFields, userProfile } = validation.data;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a legal form pre-filling assistant. Extract relevant information from the user's triage description and map it to the provided form fields.

    Return a JSON object with field IDs as keys and extracted values as values. Only include fields where you have confident information from the triage data.
    
    Rules:
    - Extract names, addresses, dates, and descriptions accurately
    - For select fields, choose the most appropriate option from the provided list
    - Leave fields empty if information is not clearly provided
    - Format dates as YYYY-MM-DD
    - Be conservative - only fill what you're confident about`;

    const userPrompt = `Triage Information:
${triageData}

User Profile:
${userProfile ? JSON.stringify(userProfile, null, 2) : 'No profile information available'}

Form Fields to fill:
${JSON.stringify(formFields, null, 2)}

Extract and map the information to fill these form fields appropriately.`;

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
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "prefill_form",
            description: "Pre-fill form fields with extracted information",
            parameters: {
              type: "object",
              properties: {
                field_values: {
                  type: "object",
                  description: "Object with field IDs as keys and extracted values",
                  additionalProperties: true
                }
              },
              required: ["field_values"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "prefill_form" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "AI service rate limit exceeded. Please try again in a moment." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI service quota exceeded. Please contact support." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const prefilledData = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ 
      success: true,
      prefilled_data: prefilledData.field_values 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Prefill form error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
