import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { logAuditEvent, createAuditClient, hashEmail } from "../_shared/auditLog.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const GenerateDocumentSchema = z.object({
  case_id: z.string().uuid("Invalid case ID format"),
  doc_type: z.string().trim().min(1).max(100),
  user_email: z.string().email().optional(),
  user_name: z.string().trim().max(100).optional(),
  form_data: z.record(z.unknown()).optional().default({})
});

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const requestBody = await req.json();
    
    // Validate input
    const validation = GenerateDocumentSchema.safeParse(requestBody);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request data',
          details: validation.error.issues.map(i => i.message).join(', ')
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const { case_id, doc_type, user_email, user_name, form_data } = validation.data;

    console.log('Generating document:', { case_id, doc_type });

    // Get case details
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', case_id)
      .single();

    if (caseError || !caseData) {
      throw new Error('Case not found');
    }

    // Generate document content (placeholder - integrate your actual doc generation)
    const documentContent = generateDocumentContent(doc_type, form_data, caseData);
    
    // Convert to buffer for storage
    const buffer = new TextEncoder().encode(documentContent);
    const fileName = `${doc_type}-${Date.now()}.txt`;
    const storagePath = `${case_id}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('docs')
      .upload(storagePath, buffer, {
        contentType: 'text/plain',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('Document uploaded to storage:', storagePath);

    // Create signed URL (valid for 7 days)
    const { data: signedUrlData } = await supabase.storage
      .from('docs')
      .createSignedUrl(storagePath, 7 * 24 * 60 * 60);

    const signedUrl = signedUrlData?.signedUrl;

    // Record in database
    const { data: docRecord, error: docError } = await supabase
      .from('documents')
      .insert({
        case_id,
        user_id: caseData.user_id,
        form_key: doc_type,
        path: storagePath,
        mime: 'text/plain'
      })
      .select()
      .single();

    if (docError) {
      console.error('Database error:', docError);
    }

    // SOC2 Audit Log: Document generation success
    const auditClient = createAuditClient();
    await logAuditEvent(auditClient, {
      action: 'document.generated',
      resource_type: 'document',
      resource_id: docRecord?.id || case_id,
      user_id: caseData.user_id,
      metadata: {
        doc_type,
        case_id,
        storage_path: storagePath,
        email_hash: user_email ? await hashEmail(user_email) : null,
      }
    }, req);

    // Queue email notification with download link
    if (user_email) {
      await supabase
        .from('email_queue')
        .insert({
          email: user_email,
          template: 'doc_ready',
          vars: {
            case_id,
            doc_type,
            download_link: signedUrl,
            user_name: user_name || 'there',
          },
        });

      const emailHash = user_email ? await crypto.subtle.digest('SHA-256', new TextEncoder().encode(user_email))
        .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8)) : 'none';
      console.log('Email queued successfully', { emailHash, template: 'doc_ready', docType: doc_type });
    }

    // Send immediate Brevo email if API key is configured
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    if (brevoApiKey && user_email) {
      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            to: [{ email: user_email, name: user_name || 'User' }],
            sender: { email: 'noreply@justice-bot.com', name: 'Justice-Bot' },
            subject: `Your ${doc_type} Document is Ready`,
            htmlContent: `
              <h1>Your Document is Ready!</h1>
              <p>Hi ${user_name || 'there'},</p>
              <p>Your ${doc_type} document has been generated and is ready for download.</p>
              <p><a href="${signedUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Document</a></p>
              <p>This link is valid for 7 days.</p>
              <p><small>Case ID: ${case_id}</small></p>
            `,
          }),
        });
        console.log('Brevo email sent successfully');
      } catch (brevoError) {
        console.error('Brevo email error:', brevoError);
        // Don't fail the entire request if email fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        document_id: docRecord?.id,
        download_url: signedUrl,
        storage_path: storagePath,
        message: 'Document generated and email sent'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Document generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Placeholder document generation - replace with your actual logic
function generateDocumentContent(docType: string, formData: any, caseData: any): string {
  const timestamp = new Date().toISOString();
  
  return `
JUSTICE-BOT LEGAL DOCUMENT
========================================
Document Type: ${docType}
Case ID: ${caseData.id}
Generated: ${timestamp}

Case Details:
- Province: ${caseData.province}
- Status: ${caseData.status}
- Venue: ${caseData.venue || 'N/A'}

Form Data:
${JSON.stringify(formData, null, 2)}

========================================
This is a placeholder document.
Replace this function with your actual document generation logic.

For DOCX generation, consider using:
- https://deno.land/x/docx for .docx files
- https://deno.land/x/pdf for PDF files
========================================
  `.trim();
}
