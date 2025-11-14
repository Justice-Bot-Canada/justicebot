import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    
    const supabase = createClient(supabaseUrl, serviceKey);
    const resend = resendKey ? new Resend(resendKey) : null;

    // Fetch pending emails (limit to 10 per run)
    const { data: emails, error: fetchError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'queued')
      .limit(10);

    if (fetchError) {
      console.error('Error fetching email queue:', fetchError);
      throw fetchError;
    }

    if (!emails || emails.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No emails in queue' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${emails.length} emails`);

    let processed = 0;
    let failed = 0;

    for (const emailRecord of emails) {
      try {
        const { email, template, vars } = emailRecord;
        
        // Generate email content based on template
        let subject = '';
        let html = '';

        switch (template) {
          case 'welcome':
            subject = 'Welcome to Justice-Bot 🤖';
            html = `
              <h1>Welcome ${vars?.name || 'there'}!</h1>
              <p>We're excited to help you navigate your legal journey.</p>
              <p>Your next step: <a href="https://justice-bot.com/journey">Start Your Case</a></p>
            `;
            break;
          
          case 'paid_receipt':
            subject = 'Payment Received - Your Documents Are Ready';
            html = `
              <h1>Thank you for your payment!</h1>
              <p>Amount: $${(vars?.amount_cents / 100).toFixed(2)} ${vars?.currency || 'CAD'}</p>
              <p>Transaction ID: ${vars?.transaction_id}</p>
              <p><a href="https://justice-bot.com/dashboard">View Your Documents</a></p>
            `;
            break;
          
          case 'doc_ready':
            subject = 'Your Legal Documents Are Ready';
            html = `
              <h1>Your documents have been generated!</h1>
              <p><a href="https://justice-bot.com/dashboard">Download Now</a></p>
            `;
            break;
          
          case 'upgrade_nudge':
            subject = 'Unlock Full Access to Justice-Bot';
            html = `
              <h1>Ready to take the next step?</h1>
              <p>Upgrade to get unlimited access to all features.</p>
              <p><a href="https://justice-bot.com/pricing">View Plans</a></p>
            `;
            break;
          
          default:
            subject = 'Update from Justice-Bot';
            html = '<p>You have a new notification.</p>';
        }

        // Send email via Resend if available
        if (resend) {
          await resend.emails.send({
            from: 'Justice-Bot <noreply@justice-bot.com>',
            to: [email],
            subject,
            html,
          });
        } else {
          console.log('Resend not configured, skipping email send');
        }

        // Mark as sent
        await supabase
          .from('email_queue')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', emailRecord.id);

        processed++;
        const emailHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email))
          .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8));
        console.log('Email sent successfully', { emailHash, template });

      } catch (error: any) {
        console.error('Failed to send email:', { template: emailRecord.template, error: error.message });
        
        // Mark as failed
        await supabase
          .from('email_queue')
          .update({
            status: 'failed',
            error: error.message,
          })
          .eq('id', emailRecord.id);

        failed++;
      }
    }

    return new Response(
      JSON.stringify({ 
        processed,
        failed,
        message: `Processed ${processed} emails, ${failed} failed` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Process email queue error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
