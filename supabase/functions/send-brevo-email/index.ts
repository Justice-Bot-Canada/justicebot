import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  toName?: string;
  subject: string;
  htmlContent?: string;
  templateId?: number;
  params?: Record<string, any>;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    
    if (!brevoApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'BREVO_API_KEY not configured',
          message: 'Please add your Brevo API key to Supabase secrets'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const { to, toName, subject, htmlContent, templateId, params }: EmailRequest = await req.json();

    if (!to) {
      return new Response(
        JSON.stringify({ error: 'Recipient email is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Create safe email hash for logging (PIPEDA compliance)
    const emailHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(to))
      .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8));
    console.log('Sending email via Brevo', { emailHash, hasTemplate: !!templateId });

    const emailPayload: any = {
      to: [{ email: to, name: toName || 'User' }],
      sender: { 
        email: 'noreply@justice-bot.com', 
        name: 'Justice-Bot' 
      },
    };

    // Use template or HTML content
    if (templateId) {
      emailPayload.templateId = templateId;
      emailPayload.params = params || {};
    } else {
      emailPayload.subject = subject || 'Message from Justice-Bot';
      emailPayload.htmlContent = htmlContent || '<p>You have a new message.</p>';
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(emailPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    console.log('Brevo email sent successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: data.messageId,
        message: 'Email sent successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Brevo email error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
