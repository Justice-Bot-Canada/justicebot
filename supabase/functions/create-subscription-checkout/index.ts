import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PayPal Plan IDs mapping
const PAYPAL_PLANS = {
  'low-income': 'P-4A916419HL912234KMZPQD7A', // $25.99/year
  'monthly': 'P-65N66936TL6425845MZPQB6I',     // $19.99/month
  'yearly': 'P-3HB097560N643323BMZPQA2A',      // $99.99/year
};

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [CREATE-SUBSCRIPTION-CHECKOUT] ${step}`, details ? JSON.stringify(details) : '');
};

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = btoa(`${clientId}:${clientSecret}`);
  const isProd = clientId.startsWith('A');
  const baseURL = isProd 
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  logStep('Fetching PayPal access token', { environment: isProd ? 'production' : 'sandbox' });

  const response = await fetch(`${baseURL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorText = await response.text();
    logStep('PayPal token error', { status: response.status, error: errorText });
    throw new Error(`PayPal authentication failed: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Function started');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    logStep('User authenticated', { userId: user.id, email: user.email });

    const { planType } = await req.json();

    if (!planType || !PAYPAL_PLANS[planType as keyof typeof PAYPAL_PLANS]) {
      throw new Error(`Invalid plan type: ${planType}`);
    }

    const planId = PAYPAL_PLANS[planType as keyof typeof PAYPAL_PLANS];
    logStep('Creating subscription', { planType, planId });

    const accessToken = await getPayPalAccessToken();
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const isProd = clientId?.startsWith('A');
    const baseURL = isProd 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const origin = req.headers.get('origin') || 'https://justice-bot.com';
    const returnUrl = `${origin}/subscription-success?subscription_id={subscription_id}&plan=${planType}`;
    const cancelUrl = `${origin}/pricing?canceled=true`;

    const subscriptionData = {
      plan_id: planId,
      application_context: {
        brand_name: 'Justice-Bot',
        locale: 'en-CA',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
      subscriber: {
        email_address: user.email,
      }
    };

    logStep('Calling PayPal API', { url: `${baseURL}/v1/billing/subscriptions` });

    const response = await fetch(`${baseURL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logStep('PayPal API error', { status: response.status, error: errorText });
      throw new Error(`PayPal subscription creation failed: ${errorText}`);
    }

    const subscription = await response.json();
    logStep('Subscription created', { subscriptionId: subscription.id });

    // Store pending subscription in database
    const { error: dbError } = await supabaseClient
      .from('payment_audit')
      .insert({
        user_id: user.id,
        payment_provider: 'paypal',
        payment_type: 'subscription',
        payment_id: subscription.id,
        amount: planType === 'low-income' ? 25.99 : planType === 'monthly' ? 19.99 : 99.99,
        currency: 'CAD',
        status: 'pending',
        metadata: { plan_type: planType, plan_id: planId }
      });

    if (dbError) {
      logStep('Database error', { error: dbError });
    }

    // Extract approval URL
    const approvalLink = subscription.links.find((link: any) => link.rel === 'approve');
    
    if (!approvalLink) {
      throw new Error('No approval link found in PayPal response');
    }

    logStep('Returning approval URL', { url: approvalLink.href });

    return new Response(
      JSON.stringify({ 
        approvalUrl: approvalLink.href,
        subscriptionId: subscription.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    logStep('ERROR', { message: error.message, stack: error.stack });
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
