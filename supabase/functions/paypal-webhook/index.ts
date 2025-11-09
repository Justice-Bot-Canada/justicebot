import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

// Webhooks don't need CORS - they're server-to-server
const corsHeaders = {
  'Access-Control-Allow-Headers': 'paypal-transmission-id, paypal-transmission-time, paypal-transmission-sig, paypal-cert-url, paypal-auth-algo',
};

async function verifyWebhookSignature(req: Request, body: string): Promise<boolean> {
  const transmissionId = req.headers.get('paypal-transmission-id');
  const transmissionTime = req.headers.get('paypal-transmission-time');
  const transmissionSig = req.headers.get('paypal-transmission-sig');
  const certUrl = req.headers.get('paypal-cert-url');
  const webhookId = Deno.env.get('PAYPAL_WEBHOOK_ID');

  console.log('Verifying webhook signature:', { transmissionId, transmissionTime, webhookId });

  if (!transmissionId || !transmissionTime || !transmissionSig || !webhookId) {
    console.error('Missing webhook verification headers');
    return false;
  }

  // For production, implement full PayPal signature verification:
  // 1. Download PayPal cert from certUrl
  // 2. Construct verification string: transmissionId|transmissionTime|webhookId|crc32(body)
  // 3. Verify signature using PayPal's public key
  // See: https://developer.paypal.com/docs/api-basics/notifications/webhooks/notification-messages/#link-verifywebhooksignature
  
  // For now, verify basic headers are present (replace with full verification in production)
  return true; // TODO: Implement full signature verification
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();
    
    // Verify PayPal webhook signature
    const isValid = await verifyWebhookSignature(req, bodyText);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = JSON.parse(bodyText);
    console.log('PayPal webhook received:', body);

    // Extract payment info from PayPal webhook
    const eventType = body?.event_type;
    const resource = body?.resource;
    
    // Get case_id from custom field (you'll set this when creating PayPal payment)
    const caseId = resource?.custom_id || resource?.invoice_id;
    const providerTxnId = resource?.id;
    const amountCents = Math.round(Number(resource?.amount?.value || 0) * 100);
    const currency = resource?.amount?.currency_code || 'CAD';
    const payerEmail = resource?.payer?.email_address;
    
    // Determine payment status
    let status = 'pending';
    if (eventType?.includes('PAYMENT.CAPTURE.COMPLETED')) {
      status = 'completed';
    } else if (eventType?.includes('PAYMENT.CAPTURE.DENIED')) {
      status = 'failed';
    }

    console.log('Processing payment:', { caseId, providerTxnId, status, amountCents });

    // 1) Record payment in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        case_id: caseId,
        payment_provider: 'paypal',
        provider_txn_id: providerTxnId,
        amount: amountCents / 100, // Store as decimal
        amount_cents: amountCents,
        currency: currency,
        status: status,
        raw: body,
        payer_id: resource?.payer?.payer_id,
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
      throw paymentError;
    }

    // 2) If payment successful, mark case as paid
    if (status === 'completed' && caseId) {
      const { error: caseError } = await supabase
        .from('cases')
        .update({
          is_paid: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseId);

      if (caseError) {
        console.error('Error updating case:', caseError);
      }

      // 3) Queue welcome/receipt email
      const { error: emailError } = await supabase
        .from('email_queue')
        .insert({
          email: payerEmail,
          template: 'paid_receipt',
          vars: {
            case_id: caseId,
            amount_cents: amountCents,
            currency: currency,
            transaction_id: providerTxnId,
          },
        });

      if (emailError) {
        console.error('Error queueing email:', emailError);
      }

      // 4) Trigger document generation
      try {
        const { data: caseDetails } = await supabase
          .from('cases')
          .select('user_id, venue')
          .eq('id', caseId)
          .single();

        if (caseDetails) {
          // Call document generation function
          await supabase.functions.invoke('generate-document', {
            body: {
              case_id: caseId,
              doc_type: caseDetails.venue || 'general',
              user_email: payerEmail,
              user_name: resource?.payer?.name?.given_name,
              form_data: {}, // Add relevant form data here
            }
          });
          console.log('Document generation triggered');
        }
      } catch (docError) {
        console.error('Document generation error:', docError);
        // Don't fail the webhook if doc generation fails
      }

      // 5) Create payment audit entry
      await supabase
        .from('payment_audit')
        .insert({
          payment_id: providerTxnId,
          event_type: 'payment_completed',
          user_id: payment.user_id,
          metadata: { webhook_event: eventType },
        });

      console.log('Payment processed successfully');
    }

    return new Response(
      JSON.stringify({ success: true, payment_id: payment.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('PayPal webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
