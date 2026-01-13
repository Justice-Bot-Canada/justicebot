import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE_WEBHOOK] ${step}${detailsStr}`);
};

// Calculate ends_at based on product_type
function calculateEndsAt(productType: string): string | null {
  const now = new Date();
  switch (productType) {
    case "monthly":
      now.setDate(now.getDate() + 30);
      return now.toISOString();
    case "yearly":
      now.setDate(now.getDate() + 365);
      return now.toISOString();
    case "low_income":
      now.setFullYear(now.getFullYear() + 5); // 5 year access
      return now.toISOString();
    case "one_time":
    default:
      return null; // Permanent access
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!stripeKey || !webhookSecret) {
    logStep("ERROR: Missing env vars");
    return new Response("Server configuration error", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  
  // Get raw body for signature verification
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    logStep("ERROR: No signature");
    return new Response("No signature", { status: 400 });
  }

  // Verify Stripe signature
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    logStep("Event verified", { type: event.type, id: event.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logStep("Signature failed", { message });
    return new Response(`Signature verification failed: ${message}`, { status: 400 });
  }

  // Supabase admin client (service role for writes)
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // ============== IDEMPOTENCY: Store event, skip if already processed ==============
  const { data: existingEvent } = await supabaseAdmin
    .from("stripe_webhook_events")
    .select("id, processed_at")
    .eq("stripe_event_id", event.id)
    .maybeSingle();

  if (existingEvent?.processed_at) {
    logStep("Event already processed", { eventId: event.id });
    return new Response(JSON.stringify({ received: true, duplicate: true }), { 
      status: 200, headers: { "Content-Type": "application/json" }
    });
  }

  // Insert/update event record
  await supabaseAdmin
    .from("stripe_webhook_events")
    .upsert({
      stripe_event_id: event.id,
      type: event.type,
      livemode: event.livemode,
      payload: event.data.object,
      received_at: new Date().toISOString(),
    }, { onConflict: "stripe_event_id" });

  let processingError: string | null = null;

  try {
    // ============== checkout.session.completed ==============
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      logStep("Processing checkout.session.completed", { 
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata: session.metadata
      });

      if (session.payment_status !== "paid") {
        logStep("Payment not complete", { status: session.payment_status });
        return new Response(JSON.stringify({ received: true }), { 
          status: 200, headers: { "Content-Type": "application/json" }
        });
      }

      // Extract metadata - source of truth
      const userId = session.metadata?.user_id || session.client_reference_id;
      const priceId = session.metadata?.price_id;
      const productType = session.metadata?.product_type || "one_time";
      // NEW: Support entitlement_key for specific product entitlements
      const entitlementKey = session.metadata?.entitlement_key || session.metadata?.product_id || priceId;
      const caseId = session.metadata?.case_id || null;
      const productName = session.metadata?.product_name || "Justice-Bot Product";

      if (!userId) {
        logStep("ERROR: No user_id in metadata");
        processingError = "no_user_id";
        throw new Error("No user_id in metadata");
      }

      // Get IDs
      const paymentIntentId = typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent?.id;
      const subscriptionId = typeof session.subscription === 'string' 
        ? session.subscription 
        : session.subscription?.id;

      // 1. Create/update order (idempotent)
      const { error: orderError } = await supabaseAdmin
        .from("orders")
        .upsert({
          user_id: userId,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId || null,
          stripe_subscription_id: subscriptionId || null,
          price_id: priceId || null,
          amount_total: session.amount_total || 0,
          currency: session.currency || "cad",
          status: "paid",
          paid_at: new Date().toISOString(),
        }, { onConflict: "stripe_checkout_session_id" });

      if (orderError) {
        logStep("Order error", { error: orderError.message });
      } else {
        logStep("Order recorded", { sessionId: session.id, productName });
      }

      // 2. Grant entitlement - THE ONLY PLACE THIS HAPPENS
      const endsAt = calculateEndsAt(productType);
      // Use entitlement_key for product-specific access
      const productId = entitlementKey || priceId || productType;

      const entitlementData: Record<string, any> = {
        user_id: userId,
        product_id: productId,
        access_level: productType === "low_income" ? "low_income" : "full",
        source: "stripe",
        starts_at: new Date().toISOString(),
        ends_at: endsAt,
        updated_at: new Date().toISOString(),
      };

      // If case_id is provided, scope entitlement to that case
      if (caseId) {
        entitlementData.case_id = caseId;
      }

      const { error: entitlementError } = await supabaseAdmin
        .from("entitlements")
        .upsert(entitlementData, { onConflict: "user_id,product_id" });

      if (entitlementError) {
        logStep("Entitlement error", { error: entitlementError.message });
        processingError = entitlementError.message;
      } else {
        logStep("ENTITLEMENT GRANTED", { 
          userId, 
          productId, 
          productType, 
          entitlementKey, 
          caseId, 
          endsAt,
          amountPaid: session.amount_total,
          currency: session.currency,
        });
      }

      // 3. If case_id is provided, mark the case as paid
      if (caseId) {
        const { error: caseError } = await supabaseAdmin
          .from("cases")
          .update({
            is_paid: true,
            flow_step: "documents_ready",
            updated_at: new Date().toISOString(),
          })
          .eq("id", caseId)
          .eq("user_id", userId);

        if (caseError) {
          logStep("Case update error", { error: caseError.message });
        } else {
          logStep("Case marked as paid", { caseId });
        }
      }

      // 4. Record in payments table for audit trail
      await supabaseAdmin
        .from("payments")
        .insert({
          user_id: userId,
          amount: (session.amount_total || 0) / 100, // Convert cents to dollars
          currency: session.currency || "cad",
          status: "completed",
          payment_intent_id: paymentIntentId,
          payment_provider: "stripe",
          plan_type: productId,
        });

      // 5. Store stripe_customer mapping
      if (session.customer) {
        const stripeCustomerId = typeof session.customer === 'string' 
          ? session.customer 
          : session.customer.id;
        
        await supabaseAdmin
          .from("stripe_customers")
          .upsert({
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            created_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
      }
    }

    // ============== invoice.payment_succeeded ==============
    else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      
      logStep("Processing invoice.payment_succeeded", {
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription
      });

      const stripeCustomerId = typeof invoice.customer === 'string' 
        ? invoice.customer 
        : invoice.customer?.id;
      
      if (stripeCustomerId) {
        const { data: customerData } = await supabaseAdmin
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", stripeCustomerId)
          .maybeSingle();

        if (customerData?.user_id) {
          const subscriptionId = typeof invoice.subscription === 'string' 
            ? invoice.subscription 
            : invoice.subscription?.id;
          
          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const endsAt = new Date(subscription.current_period_end * 1000).toISOString();
            const priceId = subscription.items.data[0]?.price.id;
            const productType = subscription.metadata?.product_type || "monthly";

            const { error: entitlementError } = await supabaseAdmin
              .from("entitlements")
              .upsert({
                user_id: customerData.user_id,
                product_id: priceId || "subscription",
                access_level: "full",
                source: "stripe",
                starts_at: new Date().toISOString(),
                ends_at: endsAt,
                updated_at: new Date().toISOString(),
              }, { onConflict: "user_id,product_id" });

            if (entitlementError) {
              logStep("Entitlement renewal error", { error: entitlementError.message });
            } else {
              logStep("ENTITLEMENT RENEWED", { userId: customerData.user_id, endsAt });
            }
          }
        }
      }
    }

    // ============== customer.subscription.updated ==============
    else if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      
      logStep("Processing subscription.updated", {
        subscriptionId: subscription.id,
        status: subscription.status
      });

      const stripeCustomerId = typeof subscription.customer === 'string' 
        ? subscription.customer 
        : subscription.customer?.id;

      if (stripeCustomerId) {
        const { data: customerData } = await supabaseAdmin
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", stripeCustomerId)
          .maybeSingle();

        if (customerData?.user_id) {
          const priceId = subscription.items.data[0]?.price.id;

          if (subscription.status === "active" || subscription.status === "trialing") {
            const endsAt = new Date(subscription.current_period_end * 1000).toISOString();
            
            await supabaseAdmin
              .from("entitlements")
              .upsert({
                user_id: customerData.user_id,
                product_id: priceId || "subscription",
                access_level: "full",
                source: "stripe",
                starts_at: new Date().toISOString(),
                ends_at: endsAt,
                updated_at: new Date().toISOString(),
              }, { onConflict: "user_id,product_id" });

            logStep("ENTITLEMENT UPDATED", { userId: customerData.user_id, status: subscription.status, endsAt });
          }
        }
      }
    }

    // ============== customer.subscription.deleted ==============
    else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      
      logStep("Processing subscription.deleted", { subscriptionId: subscription.id });

      const stripeCustomerId = typeof subscription.customer === 'string' 
        ? subscription.customer 
        : subscription.customer?.id;

      if (stripeCustomerId) {
        const { data: customerData } = await supabaseAdmin
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", stripeCustomerId)
          .maybeSingle();

        if (customerData?.user_id) {
          const priceId = subscription.items.data[0]?.price.id;

          // REVOKE ACCESS: Set ends_at to now
          const { error } = await supabaseAdmin
            .from("entitlements")
            .update({
              ends_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", customerData.user_id)
            .eq("product_id", priceId || "subscription");

          if (error) {
            logStep("Revoke error", { error: error.message });
          } else {
            logStep("ENTITLEMENT REVOKED", { userId: customerData.user_id });
          }
        }
      }
    }

    // Mark event as processed
    await supabaseAdmin
      .from("stripe_webhook_events")
      .update({ 
        processed_at: new Date().toISOString(),
        processing_error: processingError
      })
      .eq("stripe_event_id", event.id);

    logStep("Event processing complete", { eventId: event.id });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logStep("ERROR", { eventId: event.id, error: errorMessage });
    
    await supabaseAdmin
      .from("stripe_webhook_events")
      .update({ processing_error: errorMessage })
      .eq("stripe_event_id", event.id);
  }

  // Always return 200 to acknowledge receipt
  return new Response(JSON.stringify({ received: true }), { 
    status: 200, headers: { "Content-Type": "application/json" }
  });
});
