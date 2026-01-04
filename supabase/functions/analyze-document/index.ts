import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const requestBody = await req.json();
    const { fileContent, fileName, caseId, filePath, fileType } = requestBody;

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'fileName is required' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing document:", fileName, "type:", fileType || "text");

    let contentForAnalysis = fileContent || '';
    let isImage = false;
    let base64Image = '';

    // If filePath is provided (for binary files), download and process
    if (filePath && !fileContent) {
      console.log("Downloading file from storage:", filePath);
      
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('evidence')
        .download(filePath);

      if (downloadError) {
        console.error("Download error:", downloadError);
        throw new Error(`Failed to download file: ${downloadError.message}`);
      }

      if (fileType?.startsWith('image/')) {
        // For images, convert to base64 for vision analysis
        isImage = true;
        const arrayBuffer = await fileData.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64Image = btoa(binary);
        console.log("Image converted to base64, length:", base64Image.length);
      } else if (fileType === 'application/pdf') {
        // For PDFs, we'll describe what we have
        contentForAnalysis = `[PDF Document: ${fileName}]\nThis is a PDF file that requires visual analysis.`;
        
        // Try to extract with vision if possible
        const arrayBuffer = await fileData.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64Image = btoa(binary);
        isImage = true; // Treat as image for vision model
        console.log("PDF converted to base64 for vision analysis");
      } else {
        // For other files, try to read as text
        try {
          contentForAnalysis = await fileData.text();
        } catch {
          contentForAnalysis = `[Binary file: ${fileName}]`;
        }
      }
    }

    const systemPrompt = `You are a legal document analyzer specializing in Canadian law. Analyze documents and extract structured metadata.

Return a JSON object with these fields:
{
  "doc_type": "photo|receipt|email|letter|report|agreement|notice|other",
  "category": "PestControl|Rent|Accommodation|Safety|Discrimination|Maintenance|Notice|Communication|Financial|Other",
  "parties": {"landlord": "name", "tenant": "name", "other": ["names"]},
  "dates": {"captured": "YYYY-MM-DD", "incident": "YYYY-MM-DD", "deadline": "YYYY-MM-DD"},
  "extracted_summary": "Brief 1-2 sentence summary of the document content and what it shows",
  "evidence_value": "high|medium|low",
  "legal_issues": ["issue1", "issue2"],
  "suggested_forms": ["T2", "T6", "HRTO_F1", etc],
  "section_mappings": {"form_type": "section_key"},
  "confidence": 0.85
}

Be precise and concise. All fields should be populated even if empty.`;

    let response;

    if (isImage && base64Image) {
      // Use vision model for images and PDFs
      console.log("Using vision model for image/PDF analysis");
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content: [
                {
                  type: "text",
                  text: `Analyze this document (${fileName}) and return structured JSON with metadata. Extract all visible text, identify parties, dates, and assess its evidence value for a legal case.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${fileType || 'image/png'};base64,${base64Image}`
                  }
                }
              ]
            },
          ],
        }),
      });
    } else {
      // Use text model for text content
      console.log("Using text model for document analysis");
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content: `Analyze this document and return structured JSON:\n\nFile: ${fileName}\n\nContent:\n${(contentForAnalysis || '').substring(0, 50000)}` 
            },
          ],
          response_format: { type: "json_object" }
        }),
      });
    }

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit hit");
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI service requires payment. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error", details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const analysisContent = data.choices?.[0]?.message?.content;
    
    console.log("AI response received, length:", analysisContent?.length || 0);

    let metadata;
    try {
      // Try to extract JSON from the response
      let jsonStr = analysisContent;
      
      // Handle markdown code blocks
      if (jsonStr.includes('```json')) {
        const match = jsonStr.match(/```json\n?([\s\S]*?)\n?```/);
        if (match) jsonStr = match[1];
      } else if (jsonStr.includes('```')) {
        const match = jsonStr.match(/```\n?([\s\S]*?)\n?```/);
        if (match) jsonStr = match[1];
      }
      
      metadata = JSON.parse(jsonStr.trim());
      console.log("Metadata parsed successfully:", Object.keys(metadata));
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e, "Content:", analysisContent?.substring(0, 500));
      metadata = {
        doc_type: "other",
        category: "Other",
        extracted_summary: analysisContent || "Unable to analyze document",
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