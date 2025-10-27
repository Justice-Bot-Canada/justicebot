import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://justice-bot.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-PAYPAL-SUBSCRIPTION] ${step}${detailsStr}`);
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

    // Check if user has active subscription in entitlements
    const { data: entitlements, error: entError } = await supabaseClient
      .from("entitlements")
      .select("*")
      .eq("user_id", user.id)
      .in("product_id", ["monthly_subscription", "yearly_subscription"]);

    if (entError) {
      logStep("Error checking entitlements", { error: entError });
      throw entError;
    }

    if (!entitlements || entitlements.length === 0) {
      logStep("No active subscription found");
      return new Response(
        JSON.stringify({ 
          hasSubscription: false,
          subscriptionType: null 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // User has subscription
    const subscription = entitlements[0];
    logStep("Active subscription found", { productId: subscription.product_id });

    return new Response(
      JSON.stringify({ 
        hasSubscription: true,
        subscriptionType: subscription.product_id,
        grantedAt: subscription.granted_at
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
