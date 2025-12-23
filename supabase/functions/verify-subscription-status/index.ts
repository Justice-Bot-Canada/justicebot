import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// Secure CORS - only allow production, localhost, and Lovable preview
const ALLOWED_ORIGINS = ['https://justice-bot.com', 'https://www.justice-bot.com', 'http://localhost:8080', 'http://localhost:5173'];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.lovableproject.com')) return true;
  return false;
}

const getCorsHeaders = (origin?: string | null) => ({
  'Access-Control-Allow-Origin': origin && isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
});

const PRODUCT_IDS = {
  'low-income': 'prod_justice_low_income',
  'monthly': 'prod_justice_monthly',
  'yearly': 'prod_justice_yearly',
};

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [VERIFY-SUBSCRIPTION] ${step}`, details ? JSON.stringify(details) : '');
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

  const response = await fetch(`${baseURL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('PayPal authentication failed');
  }

  const data = await response.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('Origin'));
  
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

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      throw new Error('No subscription ID provided');
    }

    logStep('Verifying subscription', { subscriptionId });

    const accessToken = await getPayPalAccessToken();
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const isProd = clientId?.startsWith('A');
    const baseURL = isProd 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${baseURL}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      logStep('PayPal API error', { status: response.status, error: errorText });
      throw new Error(`PayPal verification failed: ${errorText}`);
    }

    const subscription = await response.json();
    logStep('Subscription retrieved', { 
      status: subscription.status,
      planId: subscription.plan_id 
    });

    if (subscription.status === 'ACTIVE') {
      // Determine product ID based on plan
      let productId = PRODUCT_IDS['monthly']; // default
      
      const planId = subscription.plan_id;
      if (planId.includes('MZPQD7A')) {
        productId = PRODUCT_IDS['low-income'];
      } else if (planId.includes('MZPQA2A')) {
        productId = PRODUCT_IDS['yearly'];
      }

      logStep('Granting entitlement', { productId });

      // Grant entitlement
      const { error: entitlementError } = await supabaseClient
        .from('entitlements')
        .upsert({
          user_id: user.id,
          product_id: productId,
          subscription_id: subscriptionId,
          status: 'active',
          current_period_end: new Date(subscription.billing_info.next_billing_time).toISOString()
        }, {
          onConflict: 'user_id,product_id'
        });

      if (entitlementError) {
        logStep('Entitlement error', { error: entitlementError });
        throw entitlementError;
      }

      // Update payment audit
      await supabaseClient
        .from('payment_audit')
        .update({
          status: 'completed',
          metadata: { 
            subscription_status: subscription.status,
            verified_at: new Date().toISOString()
          }
        })
        .eq('payment_id', subscriptionId)
        .eq('user_id', user.id);

      logStep('Subscription verified and entitlement granted');

      return new Response(
        JSON.stringify({ 
          success: true,
          status: subscription.status,
          productId,
          nextBillingDate: subscription.billing_info.next_billing_time
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      logStep('Subscription not active', { status: subscription.status });
      
      return new Response(
        JSON.stringify({ 
          success: false,
          status: subscription.status,
          message: 'Subscription is not active'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

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
