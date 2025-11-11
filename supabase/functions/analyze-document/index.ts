import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://justice-bot.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const DocumentAnalysisSchema = z.object({
  fileContent: z.string().min(1).max(100000),
  fileName: z.string().min(1).max(255),
  caseId: z.string().uuid().optional()
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate input
    const requestBody = await req.json();
    const validation = DocumentAnalysisSchema.safeParse(requestBody);
    
    if (!validation.success) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request data',
        details: validation.error.issues 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { fileContent, fileName, caseId } = validation.data;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing document:", fileName);

    const systemPrompt = `You are a legal document analyzer specializing in Canadian law. Analyze documents and extract structured metadata.

Return a JSON object with these fields:
{
  "doc_type": "photo|receipt|email|letter|report|agreement|notice|other",
  "category": "PestControl|Rent|Accommodation|Safety|Discrimination|Maintenance|Notice|Communication|Financial|Other",
  "parties": {"landlord": "name", "tenant": "name", "other": ["names"]},
  "dates": {"captured": "YYYY-MM-DD", "incident": "YYYY-MM-DD", "deadline": "YYYY-MM-DD"},
  "extracted_summary": "Brief 1-2 sentence summary",
  "evidence_value": "high|medium|low",
  "legal_issues": ["issue1", "issue2"],
  "suggested_forms": ["T2", "T6", "HRTO_F1", etc],
  "section_mappings": {"form_type": "section_key"},
  "confidence": 0.85
}

Be precise and concise. All fields should be populated even if empty.`;

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
          { 
            role: "user", 
            content: `Analyze this document and return structured JSON:\n\nFile: ${fileName}\n\nContent:\n${fileContent.substring(0, 50000)}` 
          },
        ],
        response_format: { type: "json_object" }
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
        return new Response(JSON.stringify({ error: "AI service requires payment. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const analysisContent = data.choices?.[0]?.message?.content;
    
    let metadata;
    try {
      metadata = JSON.parse(analysisContent);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e);
      metadata = {
        doc_type: "other",
        category: "Other",
        extracted_summary: analysisContent,
        confidence: 0.5
      };
    }

    console.log("Document analysis complete, metadata extracted");

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis: analysisContent,
        metadata,
        fileName,
        caseId
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Document analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
