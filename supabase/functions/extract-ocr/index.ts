import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
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

    // Helper function to convert ArrayBuffer to base64 (handles large files)
    function arrayBufferToBase64(buffer: ArrayBuffer): string {
      const bytes = new Uint8Array(buffer);
      const CHUNK_SIZE = 32768; // Process in 32KB chunks to avoid stack overflow
      let binary = '';
      for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
        const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      return btoa(binary);
    }

    // Handle PDFs - extract text directly
    if (fileType === 'application/pdf') {
      try {
        const arrayBuffer = await fileData.arrayBuffer();
        const fileSizeMB = arrayBuffer.byteLength / (1024 * 1024);
        
        // Increased limit to 100MB - large legal documents are common
        // For files > 50MB, we'll process first 50MB to avoid AI timeout
        const MAX_SIZE = 100 * 1024 * 1024;
        const AI_PROCESSING_LIMIT = 50 * 1024 * 1024;
        
        if (arrayBuffer.byteLength > MAX_SIZE) {
          throw new Error(`PDF too large (${Math.round(fileSizeMB)}MB). Maximum size is 100MB.`);
        }
        
        // For large files, only process first portion for AI extraction
        const processBuffer = arrayBuffer.byteLength > AI_PROCESSING_LIMIT 
          ? arrayBuffer.slice(0, AI_PROCESSING_LIMIT)
          : arrayBuffer;
        
        const isPartialExtraction = arrayBuffer.byteLength > AI_PROCESSING_LIMIT;
        if (isPartialExtraction) {
          console.log(`Large PDF (${Math.round(fileSizeMB)}MB) - processing first 50MB for text extraction`);
        }
        
        const base64 = arrayBufferToBase64(processBuffer);
        console.log(`PDF converted to base64: ${base64.length} characters (partial: ${isPartialExtraction})`);
        
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
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text: 'Extract all text content from this PDF document. Return only the extracted text, preserving structure and formatting where possible. Include all pages.'
                    },
                    {
                      type: 'image_url',
                      image_url: {
                        url: `data:application/pdf;base64,${base64}`
                      }
                    }
                  ]
                }
              ],
              max_tokens: 16000,
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            extractedText = aiData.choices?.[0]?.message?.content || '';
            if (isPartialExtraction) {
              extractedText = `[Note: This is a large document (${Math.round(fileSizeMB)}MB). Text extracted from first portion.]\n\n${extractedText}`;
            }
            console.log(`PDF text extracted: ${extractedText.length} characters`);
          } else if (aiResponse.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          } else if (aiResponse.status === 402) {
            throw new Error('AI service credits exhausted. Please add credits to continue.');
          } else {
            const errorText = await aiResponse.text();
            console.error('AI extraction failed:', aiResponse.status, errorText);
            throw new Error(`AI extraction failed: ${aiResponse.status}`);
          }
        }
      } catch (error) {
        console.error('PDF extraction error:', error);
        if (error instanceof Error && error.message.includes('too large')) {
          throw error;
        }
        extractedText = '[PDF text extraction failed - file may contain scanned images]';
      }
    }

    // Handle images - use AI vision
    if (fileType?.startsWith('image/')) {
      try {
        const arrayBuffer = await fileData.arrayBuffer();
        
        // Increased limit to 50MB for high-res scanned documents
        const MAX_SIZE = 50 * 1024 * 1024;
        if (arrayBuffer.byteLength > MAX_SIZE) {
          throw new Error(`Image too large (${Math.round(arrayBuffer.byteLength / 1024 / 1024)}MB). Maximum size is 50MB.`);
        }
        
        const base64 = arrayBufferToBase64(arrayBuffer);
        console.log(`Image converted to base64: ${base64.length} characters`);
        
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
              max_tokens: 8000,
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            extractedText = aiData.choices?.[0]?.message?.content || '';
            console.log(`Image text extracted: ${extractedText.length} characters`);
          } else if (aiResponse.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          } else if (aiResponse.status === 402) {
            throw new Error('AI service credits exhausted. Please add credits to continue.');
          } else {
            const errorText = await aiResponse.text();
            console.error('AI OCR failed:', aiResponse.status, errorText);
            throw new Error(`AI OCR failed: ${aiResponse.status}`);
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
