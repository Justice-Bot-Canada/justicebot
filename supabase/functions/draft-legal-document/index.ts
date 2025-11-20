import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const DraftDocumentSchema = z.object({
  documentType: z.string().trim().min(1).max(50),
  caseDetails: z.record(z.unknown()).optional().default({}),
  recipientInfo: z.record(z.unknown()).optional(),
  additionalDetails: z.string().trim().max(5000).optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    
    // Validate input
    const validation = DraftDocumentSchema.safeParse(requestBody);
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
    
    const { documentType, caseDetails, recipientInfo, additionalDetails } = validation.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are a professional legal document drafting assistant for Canadian law. 
Draft clear, professional legal documents following proper Canadian legal formatting and language.
Include all necessary sections, proper legal terminology, and appropriate tone.
DO NOT provide legal advice, only draft documents based on provided information.`;

    const documentPrompts: Record<string, string> = {
      'demand-letter': 'Draft a formal demand letter clearly stating the issue, damages, and remedy sought.',
      'affidavit': 'Draft a sworn affidavit with proper attestation language and numbered paragraphs.',
      'notice-application': 'Draft a notice of application including grounds, evidence, and relief sought.',
      'statement-claim': 'Draft a statement of claim with parties, facts, claims, and relief requested.',
      'response': 'Draft a response to legal documents addressing each point raised.',
      'settlement-offer': 'Draft a settlement offer letter outlining terms and conditions.'
    };

    const prompt = `${documentPrompts[documentType] || 'Draft a professional legal document'}

Document Type: ${documentType}
Case Details: ${JSON.stringify(caseDetails)}
${recipientInfo ? `Recipient: ${JSON.stringify(recipientInfo)}` : ''}
${additionalDetails ? `Additional Context: ${additionalDetails}` : ''}

Provide a complete, ready-to-use document formatted with proper sections and professional language.`;

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
    const draftedDocument = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ document: draftedDocument }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error drafting document:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
