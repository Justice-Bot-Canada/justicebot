import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { getCorsHeaders } from "../_shared/cors.ts";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE_CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Parse request body
    const { 
      priceId, 
      productType = "one_time", // one_time | monthly | yearly | low_income
      productId,      // e.g. 'book_docs_39'
      entitlementKey, // e.g. 'book_docs_generator'
      caseId,         // optional: case-scoped access
      productName,    // for display
      successUrl,
      cancelUrl,
    } = await req.json();

    if (!priceId) {
      return new Response(JSON.stringify({ error: "priceId is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Request params", { priceId, productType, productId, entitlementKey, caseId });

    // Create Supabase client for auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // REQUIRED: User must be authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No auth header");
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !authData.user) {
      logStep("ERROR: Invalid auth", { error: authError?.message });
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = authData.user;
    const userId = user.id;
    const userEmail = user.email;
    
    if (!userEmail) {
      return new Response(JSON.stringify({ error: "User email required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("User authenticated", { userId, email: userEmail });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Admin client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Ensure Stripe customer exists
    let stripeCustomerId: string;
    
    const { data: existingCustomer } = await supabaseAdmin
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingCustomer?.stripe_customer_id) {
      stripeCustomerId = existingCustomer.stripe_customer_id;
      logStep("Found existing customer", { stripeCustomerId });
    } else {
      // Check Stripe by email
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      
      if (customers.data.length > 0) {
        stripeCustomerId = customers.data[0].id;
        logStep("Found customer by email", { stripeCustomerId });
      } else {
        // Create new customer
        const newCustomer = await stripe.customers.create({
          email: userEmail,
          metadata: { user_id: userId },
        });
        stripeCustomerId = newCustomer.id;
        logStep("Created new customer", { stripeCustomerId });
      }

      // Save to stripe_customers
      await supabaseAdmin
        .from("stripe_customers")
        .upsert({
          user_id: userId,
          stripe_customer_id: stripeCustomerId,
          created_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
    }

    // Get the price to determine amount
    const price = await stripe.prices.retrieve(priceId);
    const amountCents = price.unit_amount || 3900;
    const currency = price.currency || "cad";

    // Determine final values for metadata
    const finalProductId = productId || entitlementKey || priceId;
    const finalEntitlementKey = entitlementKey || productId || priceId;
    const finalProductName = productName || "Justice-Bot Product";

    // ============ STEP 1: Create payment row BEFORE redirecting to Stripe ============
    const { data: paymentRow, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: userId,
        case_id: caseId || null,
        product_id: finalProductId,
        entitlement_key: finalEntitlementKey,
        amount: amountCents / 100, // Store in dollars for legacy compatibility
        amount_cents: amountCents,
        currency: currency,
        status: "created", // Will be updated to 'paid' by webhook
        payment_provider: "stripe",
        plan_type: productType,
      })
      .select()
      .single();

    if (paymentError) {
      logStep("Payment row creation failed", { error: paymentError.message });
      // Continue anyway - webhook can still process without pre-created row
    } else {
      logStep("Payment row created", { paymentId: paymentRow.id });
    }

    // Determine checkout mode based on productType
    const mode = (productType === "monthly" || productType === "yearly") ? "subscription" : "payment";

    const requestOrigin = req.headers.get("origin") || "https://justice-bot.com";
    const finalSuccessUrl = successUrl || `${requestOrigin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${requestOrigin}/pricing`;

    // ============ STEP 2: Create Stripe Checkout Session ============
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode as "subscription" | "payment",
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        price_id: priceId,
        product_type: productType,
        product_id: finalProductId,
        entitlement_key: finalEntitlementKey,
        case_id: caseId || "",
        product_name: finalProductName,
        payment_id: paymentRow?.id || "",
      },
    };

    // Add subscription metadata if applicable
    if (mode === "subscription") {
      sessionParams.subscription_data = {
        metadata: {
          user_id: userId,
          product_type: productType,
          product_id: finalProductId,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    logStep("Checkout session created", { sessionId: session.id, mode });

    // ============ STEP 3: Update payment row with session ID ============
    if (paymentRow?.id) {
      await supabaseAdmin
        .from("payments")
        .update({
          stripe_checkout_session_id: session.id,
        })
        .eq("id", paymentRow.id);
      
      logStep("Payment row updated with session ID", { paymentId: paymentRow.id, sessionId: session.id });
    }

    // Return ONLY the URL - frontend just redirects
    return new Response(JSON.stringify({ url: session.url }), {
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
