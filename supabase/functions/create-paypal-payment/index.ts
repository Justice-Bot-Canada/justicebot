import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')!;
const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')!;

// Auto-detect PayPal environment based on credentials
// Sandbox IDs start with 'AZ' or 'sb-', production IDs start with 'A' followed by other characters
const isProduction = paypalClientId && !paypalClientId.startsWith('sb-') && !paypalClientId.startsWith('AZ');
const PAYPAL_BASE_URL = isProduction ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

console.log(`PayPal Mode: ${isProduction ? 'PRODUCTION' : 'SANDBOX'}, URL: ${PAYPAL_BASE_URL}`);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planType, amount, caseId } = await req.json();
    
    console.log('Creating PayPal payment:', { planType, amount, caseId, environment: isProduction ? 'PRODUCTION' : 'SANDBOX' });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error('User not authenticated');

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Create PayPal payment
    const paymentData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'CAD',
          value: amount
        },
        description: `Justice Bot - ${planType} Plan`,
        custom_id: caseId || userData.user.id,
        reference_id: `${planType}_${Date.now()}`
      }],
      application_context: {
        return_url: `${req.headers.get('origin')}/payment-success`,
        cancel_url: `${req.headers.get('origin')}/payment-cancel`,
        brand_name: 'Justice Bot',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    };

    const paymentResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.text();
      console.error('PayPal API Error:', { status: paymentResponse.status, errorData, url: PAYPAL_BASE_URL });
      throw new Error(`PayPal payment creation failed: ${paymentResponse.status}. ${errorData.substring(0, 200)}`);
    }

    const payment = await paymentResponse.json();
    console.log('PayPal payment created:', payment.id);

    // Store payment record in database
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        user_id: userData.user.id,
        case_id: caseId,
        payment_provider: 'paypal',
        payment_id: payment.id,
        amount: parseFloat(amount),
        currency: 'CAD',
        plan_type: planType,
        status: 'pending'
      });

    if (insertError) {
      console.error('Error storing payment:', insertError);
      // Don't throw - payment was created successfully
    } else {
      // Create payment audit log
      await supabase
        .from('payment_audit')
        .insert({
          payment_id: payment.id,
          user_id: userData.user.id,
          event_type: 'created',
          metadata: {
            amount: parseFloat(amount),
            currency: 'CAD',
            plan_type: planType,
            case_id: caseId
          }
        });
    }

    // Find the approval URL
    const approvalUrl = payment.links?.find((link: any) => link.rel === 'approve')?.href;
    
    if (!approvalUrl) {
      throw new Error('No approval URL found in PayPal response');
    }

    return new Response(JSON.stringify({ 
      paymentId: payment.id,
      approvalUrl: approvalUrl 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-paypal-payment function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getPayPalAccessToken(): Promise<string> {
  const auth = btoa(`${paypalClientId}:${paypalClientSecret}`);
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('PayPal Auth Error:', { 
      status: response.status, 
      error: errorData,
      clientIdPrefix: paypalClientId?.substring(0, 6),
      environment: isProduction ? 'PRODUCTION' : 'SANDBOX',
      url: PAYPAL_BASE_URL
    });
    throw new Error(`PayPal auth failed (${response.status}). Check credentials match environment (${isProduction ? 'PRODUCTION' : 'SANDBOX'}). ${errorData.substring(0, 100)}`);
  }

  const data = await response.json();
  return data.access_token;
}