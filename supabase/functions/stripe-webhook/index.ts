import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!stripeKey) {
    logStep("ERROR", { message: "STRIPE_SECRET_KEY not set" });
    return new Response("Server configuration error", { status: 500 });
  }

  if (!webhookSecret) {
    logStep("ERROR", { message: "STRIPE_WEBHOOK_SECRET not set" });
    return new Response("Server configuration error", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  
  // Get raw body for signature verification
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    logStep("ERROR", { message: "No Stripe signature header" });
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    logStep("Event verified", { type: event.type, id: event.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logStep("Signature verification failed", { message });
    return new Response(`Webhook signature verification failed: ${message}`, { status: 400 });
  }

  // Create Supabase admin client
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    logStep("Processing checkout.session.completed", { 
      sessionId: session.id,
      paymentStatus: session.payment_status,
      mode: session.mode,
      metadata: session.metadata
    });

    // Only process if payment is complete
    if (session.payment_status !== "paid") {
      logStep("Payment not yet complete", { status: session.payment_status });
      return new Response(JSON.stringify({ received: true, processed: false }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userId = session.metadata?.user_id;
    const caseId = session.metadata?.case_id;
    const product = session.metadata?.product || "court_ready_pack";
    const planKey = session.metadata?.plan_key || product;

    if (!userId || userId === "guest") {
      logStep("ERROR", { message: "No valid user_id in metadata - auth required before checkout" });
      return new Response(JSON.stringify({ received: true, error: "no_user" }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check for duplicate (idempotency)
    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("id")
      .eq("payment_id", session.id)
      .maybeSingle();

    if (existingPayment) {
      logStep("Payment already processed", { sessionId: session.id });
      return new Response(JSON.stringify({ received: true, duplicate: true }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 1. Record payment in payments table
    const paymentIntent = session.payment_intent as string | Stripe.PaymentIntent | null;
    const paymentIntentId = typeof paymentIntent === 'string' ? paymentIntent : paymentIntent?.id;
    
    const { error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        payment_id: session.id,
        user_id: userId,
        case_id: caseId || null,
        amount: (session.amount_total || 3900) / 100,
        amount_cents: session.amount_total || 3900,
        currency: session.currency || "cad",
        status: "completed",
        payment_provider: "stripe",
        provider: "stripe",
        provider_txn_id: paymentIntentId,
        plan_type: planKey,
        captured_at: new Date().toISOString(),
        metadata: session.metadata,
      });

    if (paymentError) {
      logStep("Failed to record payment", { error: paymentError.message });
    } else {
      logStep("Payment recorded", { sessionId: session.id, userId, caseId });
    }

    // 2. Create entitlement (case-scoped if case_id present)
    const entitlementData: Record<string, unknown> = {
      user_id: userId,
      product_id: planKey,
      source: "stripe_webhook",
      feature: product,
      scope: caseId ? "case" : "global",
      granted_at: new Date().toISOString(),
    };
    
    if (caseId) {
      entitlementData.case_id = caseId;
    }

    const { error: entitlementError } = await supabaseAdmin
      .from("entitlements")
      .insert(entitlementData);

    if (entitlementError) {
      // May be duplicate - not a critical error
      logStep("Entitlement insert result", { error: entitlementError.message });
    } else {
      logStep("Entitlement created", { userId, product: planKey, caseId, scope: caseId ? "case" : "global" });
    }

    // 3. Update case to mark as paid
    if (caseId) {
      const { error: caseError } = await supabaseAdmin
        .from("cases")
        .update({ 
          is_paid: true,
          plan: planKey,
          flow_step: "evidence", // Move to next step
          updated_at: new Date().toISOString()
        })
        .eq("id", caseId)
        .eq("user_id", userId);

      if (caseError) {
        logStep("Failed to update case", { error: caseError.message });
      } else {
        logStep("Case marked as paid", { caseId });
      }
    }

    logStep("Checkout completed successfully", { userId, caseId, product: planKey });
    
    return new Response(JSON.stringify({ received: true, success: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Handle other events we care about
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    logStep("Payment failed", { 
      paymentIntentId: paymentIntent.id,
      error: paymentIntent.last_payment_error?.message
    });
  }

  // Acknowledge receipt of other events
  return new Response(JSON.stringify({ received: true }), { 
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});
