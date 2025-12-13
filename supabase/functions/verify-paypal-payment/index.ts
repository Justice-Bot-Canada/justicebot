import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const VerifyPaymentSchema = z.object({
  paymentId: z.string().min(1).max(255),
  payerId: z.string().min(1).max(255).optional(),
  formId: z.string().uuid().optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID') || Deno.env.get('PAYPAL_CLIENT_ID_LIVE');
  const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET') || Deno.env.get('PAYPAL_CLIENT_SECRET_LIVE');

  if (!paypalClientId || !paypalClientSecret) {
    console.error('PayPal credentials not configured');
    return new Response(JSON.stringify({ error: 'Payment service unavailable' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Auto-detect PayPal environment based on credentials
  const isProduction = paypalClientId && !paypalClientId.startsWith('sb-') && !paypalClientId.startsWith('AZ');
  const PAYPAL_BASE_URL = isProduction ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

  console.log('PayPal environment:', isProduction ? 'PRODUCTION' : 'SANDBOX');

  try {
    // Validate input
    const requestBody = await req.json();
    const validation = VerifyPaymentSchema.safeParse(requestBody);
    
    if (!validation.success) {
      console.error('[SECURITY] Validation failed:', validation.error.issues);
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { paymentId, payerId, formId } = validation.data;
    
    console.log('Verifying PayPal payment:', { paymentId, payerId, formId });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      console.error('User authentication failed:', userError);
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User authenticated:', userData.user.id);

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(paypalClientId, paypalClientSecret, PAYPAL_BASE_URL);
    
    // Get order details
    const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Failed to get order details:', errorText);
      return new Response(JSON.stringify({ error: 'Payment not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let orderData = await orderResponse.json();
    console.log('Order status:', orderData.status);

    // If order is not completed, try to capture it
    if (orderData.status !== 'COMPLETED') {
      console.log('Attempting to capture payment...');
      const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${paymentId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!captureResponse.ok) {
        const errorData = await captureResponse.text();
        console.error('PayPal capture failed:', errorData);
        return new Response(JSON.stringify({ error: 'Payment capture failed' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      orderData = await captureResponse.json();
      console.log('Payment captured, new status:', orderData.status);
    }

    const isSuccessful = orderData.status === 'COMPLETED';
    
    if (!isSuccessful) {
      console.error('Payment not completed:', orderData.status);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Payment not completed',
        paymentStatus: orderData.status 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract amount from order
    const amount = parseFloat(orderData.purchase_units?.[0]?.amount?.value || '29.99');
    const currency = orderData.purchase_units?.[0]?.amount?.currency_code || 'CAD';

    // Determine product type
    const planType = formId ? 'form_purchase' : 'premium_access';
    const productId = formId ? `form_${formId}` : 'premium_access';

    console.log('Creating payment record:', { amount, currency, planType, productId });

    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('payment_id', paymentId)
      .maybeSingle();

    if (existingPayment) {
      console.log('Payment already processed:', existingPayment.id);
      
      // Still ensure entitlement exists
      await supabase
        .from('entitlements')
        .upsert({
          user_id: userData.user.id,
          product_id: productId,
          granted_at: new Date().toISOString()
        }, { onConflict: 'user_id,product_id' });

      return new Response(JSON.stringify({ 
        success: true,
        paymentStatus: 'COMPLETED',
        message: 'Payment already processed'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create payment record
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userData.user.id,
        payment_id: paymentId,
        amount: amount,
        currency: currency,
        status: 'completed',
        plan_type: planType,
        form_id: formId || null,
        payment_provider: 'paypal',
        payer_id: payerId || orderData.payer?.payer_id,
        captured_at: new Date().toISOString(),
        paypal_response: orderData
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      // Don't fail - still try to grant entitlement
    } else {
      console.log('Payment record created:', paymentRecord.id);
    }

    // Grant entitlement
    const { error: entitlementError } = await supabase
      .from('entitlements')
      .upsert({
        user_id: userData.user.id,
        product_id: productId,
        granted_at: new Date().toISOString()
      }, { onConflict: 'user_id,product_id' });

    if (entitlementError) {
      console.error('Error granting entitlement:', entitlementError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to grant access' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Entitlement granted:', { userId: userData.user.id, productId });

    // Create audit log
    await supabase
      .from('payment_audit')
      .insert({
        payment_id: paymentId,
        user_id: userData.user.id,
        event_type: 'payment_completed',
        metadata: {
          amount,
          currency,
          plan_type: planType,
          product_id: productId,
          payer_id: payerId,
          form_id: formId
        }
      });

    console.log('Payment verification complete');

    return new Response(JSON.stringify({ 
      success: true,
      paymentStatus: 'COMPLETED',
      productId: productId,
      message: 'Payment verified and access granted'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[ERROR] Payment verification failed:', error);
    return new Response(JSON.stringify({ error: 'Payment verification failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getPayPalAccessToken(clientId: string, clientSecret: string, baseUrl: string): Promise<string> {
  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PayPal auth failed:', errorText);
    throw new Error(`PayPal authentication failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}
