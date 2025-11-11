import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { filePath, fileType } = await req.json();

    if (!filePath) {
      throw new Error('File path is required');
    }

    console.log('Extracting OCR from:', filePath, 'Type:', fileType);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('evidence')
      .download(filePath);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    let extractedText = '';

    // Handle PDFs - extract text directly
    if (fileType === 'application/pdf') {
      try {
        // For PDFs, we'll use pdfjs or send to AI for extraction
        const arrayBuffer = await fileData.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        // Use Lovable AI to extract text from PDF
        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
        if (LOVABLE_API_KEY) {
          const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'system',
                  content: 'Extract all text content from the provided document. Return only the extracted text, preserving structure and formatting where possible.'
                },
                {
                  role: 'user',
                  content: `Extract text from this PDF document (base64): ${base64.substring(0, 50000)}...`
                }
              ],
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            extractedText = aiData.choices?.[0]?.message?.content || '';
          }
        }
      } catch (error) {
        console.error('PDF extraction error:', error);
        extractedText = '[PDF text extraction failed - file may contain scanned images]';
      }
    }

    // Handle images - use AI vision
    if (fileType?.startsWith('image/')) {
      try {
        const arrayBuffer = await fileData.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
        if (LOVABLE_API_KEY) {
          const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text: 'Extract all visible text from this image. Include any text from forms, documents, receipts, signs, or handwriting. Return only the extracted text.'
                    },
                    {
                      type: 'image_url',
                      image_url: {
                        url: `data:${fileType};base64,${base64}`
                      }
                    }
                  ]
                }
              ],
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            extractedText = aiData.choices?.[0]?.message?.content || '';
          } else if (aiResponse.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          } else if (aiResponse.status === 402) {
            throw new Error('AI service credits exhausted. Please add credits to continue.');
          }
        }
      } catch (error) {
        console.error('Image OCR error:', error);
        throw error;
      }
    }

    // For other file types
    if (!extractedText && !fileType?.startsWith('image/') && fileType !== 'application/pdf') {
      extractedText = '[Text extraction not supported for this file type]';
    }

    console.log(`Extracted ${extractedText.length} characters of text`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        text: extractedText,
        length: extractedText.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('OCR extraction error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
