import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Auto-detect PayPal environment
const paypalClientId = Deno.env.get("PAYPAL_CLIENT_ID") ?? "";
const paypalClientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET") ?? "";
const isProduction = paypalClientId && !paypalClientId.startsWith('sb-') && !paypalClientId.startsWith('AZ');
const PAYPAL_BASE_URL = isProduction ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

console.log(`PayPal Subscription Mode: ${isProduction ? 'PRODUCTION' : 'SANDBOX'}, URL: ${PAYPAL_BASE_URL}`);

interface SubscriptionRequest {
  planId: string; // PayPal plan ID (monthly or yearly)
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYPAL-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { planId }: SubscriptionRequest = await req.json();
    if (!planId) throw new Error("Plan ID is required");

    logStep("Creating PayPal subscription", { planId, environment: isProduction ? 'PRODUCTION' : 'SANDBOX' });

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error("PayPal credentials not configured");
    }

    // Get PayPal access token
    const authResponse = await fetch(
      `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
        },
        body: "grant_type=client_credentials",
      }
    );

    if (!authResponse.ok) {
      const errorData = await authResponse.text();
      logStep("PayPal Auth Error", { status: authResponse.status, error: errorData });
      throw new Error(`PayPal authentication failed (${authResponse.status}). Check credentials match ${isProduction ? 'PRODUCTION' : 'SANDBOX'} environment.`);
    }

    const { access_token } = await authResponse.json();
    logStep("PayPal access token obtained");

    // Create subscription
    const subscriptionResponse = await fetch(
      `${PAYPAL_BASE_URL}/v1/billing/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          plan_id: planId,
          application_context: {
            brand_name: "Justice-Bot",
            user_action: "SUBSCRIBE_NOW",
            return_url: `${req.headers.get("origin")}/payment-success`,
            cancel_url: `${req.headers.get("origin")}/payment-cancel`,
          },
        }),
      }
    );

    if (!subscriptionResponse.ok) {
      const error = await subscriptionResponse.text();
      logStep("PayPal subscription creation failed", { status: subscriptionResponse.status, error });
      throw new Error(`Failed to create subscription (${subscriptionResponse.status}): ${error.substring(0, 200)}`);
    }

    const subscription = await subscriptionResponse.json();
    logStep("PayPal subscription created", { subscriptionId: subscription.id });

    // Find approval URL
    const approvalUrl = subscription.links.find((link: any) => link.rel === "approve")?.href;

    if (!approvalUrl) {
      throw new Error("No approval URL found in PayPal response");
    }

    return new Response(
      JSON.stringify({ 
        approvalUrl,
        subscriptionId: subscription.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
