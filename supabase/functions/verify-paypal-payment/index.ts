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

const PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com'; // Use 'https://api-m.paypal.com' for production

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentId, payerId } = await req.json();
    
    console.log('Verifying PayPal payment:', { paymentId, payerId });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error('User not authenticated');

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Capture the payment
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${paymentId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!captureResponse.ok) {
      const errorData = await captureResponse.text();
      console.error('PayPal Capture Error:', errorData);
      throw new Error(`PayPal capture failed: ${captureResponse.status}`);
    }

    const captureData = await captureResponse.json();
    console.log('PayPal payment captured:', captureData);

    // Check if payment was successful
    const isSuccessful = captureData.status === 'COMPLETED';
    
    // Update payment record in database
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: isSuccessful ? 'completed' : 'failed',
        payer_id: payerId,
        captured_at: new Date().toISOString(),
        paypal_response: captureData
      })
      .eq('payment_id', paymentId)
      .eq('user_id', userData.user.id);

    if (updateError) {
      console.error('Error updating payment:', updateError);
    }

    // If payment successful, grant premium access
    if (isSuccessful) {
      // Get the payment details to determine plan type
      const { data: paymentData } = await supabase
        .from('payments')
        .select('plan_type, case_id')
        .eq('payment_id', paymentId)
        .eq('user_id', userData.user.id)
        .single();

      if (paymentData) {
        // Grant entitlement
        const { error: entitlementError } = await supabase
          .from('entitlements')
          .insert({
            user_id: userData.user.id,
            product_id: paymentData.plan_type,
            granted_at: new Date().toISOString()
          });

        if (entitlementError) {
          console.error('Error granting entitlement:', entitlementError);
        } else {
          console.log('Premium access granted for user:', userData.user.id);
        }

        // Create payment audit log
        await supabase
          .from('payment_audit')
          .insert({
            payment_id: paymentId,
            user_id: userData.user.id,
            event_type: isSuccessful ? 'completed' : 'failed',
            metadata: {
              amount: paymentData?.amount || 0,
              plan_type: paymentData.plan_type,
              payer_id: payerId,
              transaction_id: captureData.id
            }
          });
      }
    }

    return new Response(JSON.stringify({ 
      success: isSuccessful,
      paymentStatus: captureData.status,
      transactionId: captureData.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in verify-paypal-payment function:', error);
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
    throw new Error(`PayPal authentication failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}