import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://justice-bot.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYPAL-SUBSCRIPTION] ${step}${detailsStr}`);
};

async function getPayPalAccessToken(): Promise<string> {
  const paypalClientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const paypalClientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");

  const authResponse = await fetch(
    "https://api-m.paypal.com/v1/oauth2/token",
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
    throw new Error("Failed to get PayPal access token");
  }

  const { access_token } = await authResponse.json();
  return access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    logStep("User authenticated", { userId: user.id });

    const { subscriptionId } = await req.json();
    if (!subscriptionId) throw new Error("Subscription ID is required");

    logStep("Verifying subscription", { subscriptionId });

    const accessToken = await getPayPalAccessToken();

    // Get subscription details from PayPal
    const subscriptionResponse = await fetch(
      `https://api-m.paypal.com/v1/billing/subscriptions/${subscriptionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!subscriptionResponse.ok) {
      throw new Error("Failed to verify subscription with PayPal");
    }

    const subscription = await subscriptionResponse.json();
    logStep("Subscription retrieved", { status: subscription.status });

    if (subscription.status !== "ACTIVE") {
      throw new Error(`Subscription is not active. Status: ${subscription.status}`);
    }

    // Determine product type based on plan
    const planId = subscription.plan_id;
    let productId = "monthly_subscription";
    
    // You'll need to set these plan IDs in your frontend or config
    if (planId.includes("yearly") || planId.includes("annual")) {
      productId = "yearly_subscription";
    }

    logStep("Granting entitlement", { productId });

    // Grant entitlement
    const { error: entitlementError } = await supabaseClient
      .from("entitlements")
      .upsert({
        user_id: user.id,
        product_id: productId,
        granted_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,product_id"
      });

    if (entitlementError) {
      logStep("Error granting entitlement", { error: entitlementError });
      throw entitlementError;
    }

    logStep("Entitlement granted successfully");

    return new Response(
      JSON.stringify({ 
        success: true,
        subscriptionType: productId,
        status: subscription.status
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
