import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CANCEL-PAYPAL-SUBSCRIPTION] ${step}${detailsStr}`);
};

async function getPayPalAccessToken(): Promise<string> {
  const paypalClientId = Deno.env.get("PAYPAL_CLIENT_ID_LIVE") || Deno.env.get("PAYPAL_CLIENT_ID");
  const paypalClientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET_LIVE") || Deno.env.get("PAYPAL_CLIENT_SECRET");
  const apiBase = Deno.env.get("PAYPAL_API_BASE") || "https://api-m.paypal.com";

  logStep("Getting PayPal access token", { apiBase });

  const authResponse = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!authResponse.ok) {
    const error = await authResponse.text();
    logStep("Failed to get PayPal token", { error });
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

    const { subscriptionId, reason } = await req.json();
    
    if (!subscriptionId) {
      throw new Error("Subscription ID is required");
    }

    logStep("Cancelling subscription", { subscriptionId, reason });

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    const apiBase = Deno.env.get("PAYPAL_API_BASE") || "https://api-m.paypal.com";

    // Cancel the subscription in PayPal
    const cancelResponse = await fetch(
      `${apiBase}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          reason: reason || "User requested cancellation"
        }),
      }
    );

    if (!cancelResponse.ok) {
      const errorText = await cancelResponse.text();
      logStep("PayPal cancellation failed", { status: cancelResponse.status, error: errorText });
      throw new Error(`Failed to cancel subscription: ${errorText}`);
    }

    logStep("PayPal subscription cancelled successfully");

    // Remove entitlements from database
    const { error: deleteError } = await supabaseClient
      .from("entitlements")
      .delete()
      .eq("user_id", user.id)
      .in("product_id", ["monthly_subscription", "yearly_subscription"]);

    if (deleteError) {
      logStep("Warning: Failed to remove entitlements", { error: deleteError });
    }

    // Update payment record
    await supabaseClient
      .from("payments")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("payment_id", subscriptionId);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Subscription cancelled successfully"
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
