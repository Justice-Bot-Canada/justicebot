import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-STRIPE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Missing sessionId");
    logStep("Verifying session", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer']
    });
    logStep("Session retrieved", { 
      status: session.payment_status, 
      mode: session.mode,
      customerId: session.customer,
      metadata: session.metadata
    });

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Payment not completed' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get user_id from session metadata or find by email
    let userId = session.metadata?.user_id;
    const customerEmail = session.customer_details?.email;
    
    if (userId === 'guest' && customerEmail) {
      // Try to find user by email
      const { data: authUser } = await supabaseAdmin.auth.admin.listUsers();
      const matchedUser = authUser.users.find(u => u.email === customerEmail);
      if (matchedUser) {
        userId = matchedUser.id;
        logStep("Found user by email", { userId, email: customerEmail });
      }
    }

    // Determine product from metadata
    const product = session.metadata?.product || 'form_unlock';
    const planKey = session.metadata?.plan_key || product;
    
    // Check if entitlement already exists (idempotency)
    if (userId && userId !== 'guest') {
      const { data: existing } = await supabaseAdmin
        .from('entitlements')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', planKey)
        .maybeSingle();

      if (existing) {
        logStep("Entitlement already exists", { userId, product: planKey });
        return new Response(JSON.stringify({ 
          success: true, 
          alreadyUnlocked: true,
          product: planKey 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Create entitlement record
      const { error: entitlementError } = await supabaseAdmin
        .from('entitlements')
        .insert({
          user_id: userId,
          product_id: planKey,
          source: 'stripe',
          feature: product,
          granted_at: new Date().toISOString(),
        });

      if (entitlementError) {
        logStep("Failed to create entitlement", { error: entitlementError.message });
        // Don't fail the request - payment succeeded
      } else {
        logStep("Entitlement created", { userId, product: planKey });
      }
    }

    // Also record in payments table for audit
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .upsert({
        payment_id: sessionId,
        user_id: userId || 'guest',
        amount: (session.amount_total || 599) / 100,
        amount_cents: session.amount_total || 599,
        currency: session.currency || 'cad',
        status: 'completed',
        payment_provider: 'stripe',
        provider: 'stripe',
        provider_txn_id: paymentIntent?.id,
        plan_type: planKey,
        captured_at: new Date().toISOString(),
        metadata: session.metadata,
      }, { onConflict: 'payment_id' });

    if (paymentError) {
      logStep("Failed to record payment", { error: paymentError.message });
    } else {
      logStep("Payment recorded");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      product: planKey,
      userId: userId !== 'guest' ? userId : null
    }), {
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
