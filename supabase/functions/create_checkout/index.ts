import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE_CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Parse request body
    const { 
      priceId, 
      successUrl,
      cancelUrl,
      mode = 'payment', // 'subscription' or 'payment'
      metadata = {}
    } = await req.json();

    if (!priceId) {
      return new Response(JSON.stringify({ error: "priceId is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Request body", { priceId, mode });

    // Create Supabase client for auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // CRITICAL: Authentication is REQUIRED
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No auth header - authentication required");
      return new Response(JSON.stringify({ 
        error: "Authentication required before checkout" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !authData.user) {
      logStep("ERROR: Invalid auth token", { error: authError?.message });
      return new Response(JSON.stringify({ 
        error: "Invalid authentication. Please log in again." 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = authData.user;
    const userEmail = user.email;
    
    if (!userEmail) {
      logStep("ERROR: User has no email");
      return new Response(JSON.stringify({ 
        error: "User email required for checkout" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("User authenticated", { userId: user.id, email: userEmail });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Create Supabase admin client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if Stripe customer exists in our database
    let stripeCustomerId: string | undefined;
    
    const { data: existingCustomer } = await supabaseAdmin
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingCustomer?.stripe_customer_id) {
      stripeCustomerId = existingCustomer.stripe_customer_id;
      logStep("Found existing Stripe customer in DB", { stripeCustomerId });
    } else {
      // Check Stripe directly by email
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      
      if (customers.data.length > 0) {
        stripeCustomerId = customers.data[0].id;
        logStep("Found existing Stripe customer by email", { stripeCustomerId });
        
        // Save to our database
        await supabaseAdmin
          .from("stripe_customers")
          .upsert({
            user_id: user.id,
            stripe_customer_id: stripeCustomerId,
            created_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
      } else {
        // Create new Stripe customer
        const newCustomer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            user_id: user.id,
          },
        });
        stripeCustomerId = newCustomer.id;
        logStep("Created new Stripe customer", { stripeCustomerId });

        // Save to our database
        await supabaseAdmin
          .from("stripe_customers")
          .insert({
            user_id: user.id,
            stripe_customer_id: stripeCustomerId,
            created_at: new Date().toISOString(),
          });
      }
    }

    const origin = req.headers.get("origin") || "https://justice-bot.com";
    const finalSuccessUrl = successUrl || `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${origin}/pricing`;

    // Build session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode as 'subscription' | 'payment',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      client_reference_id: user.id, // Critical for mapping payment to user
      metadata: {
        user_id: user.id,
        price_id: priceId,
        product_type: mode,
        ...metadata
      },
    };

    // Add subscription-specific options
    if (mode === 'subscription') {
      sessionParams.subscription_data = {
        metadata: {
          user_id: user.id,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, url: session.url, mode });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
