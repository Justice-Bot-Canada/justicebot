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

  // Create Supabase admin client (service role for writes)
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // ============== IDEMPOTENCY CHECK ==============
  // Store event in stripe_webhook_events - if already exists, skip processing
  const { data: existingEvent, error: eventCheckError } = await supabaseAdmin
    .from("stripe_webhook_events")
    .select("id, processed_at")
    .eq("stripe_event_id", event.id)
    .maybeSingle();

  if (eventCheckError) {
    logStep("ERROR checking event idempotency", { error: eventCheckError.message });
  }

  if (existingEvent?.processed_at) {
    logStep("Event already processed (idempotent skip)", { eventId: event.id });
    return new Response(JSON.stringify({ received: true, duplicate: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Insert event record (or update if exists but not processed)
  const { error: eventInsertError } = await supabaseAdmin
    .from("stripe_webhook_events")
    .upsert({
      stripe_event_id: event.id,
      type: event.type,
      livemode: event.livemode,
      payload: event.data.object,
      received_at: new Date().toISOString(),
    }, { onConflict: "stripe_event_id" });

  if (eventInsertError) {
    logStep("ERROR inserting event record", { error: eventInsertError.message });
  }

  let processingError: string | null = null;

  try {
    // ============== CHECKOUT.SESSION.COMPLETED ==============
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

      const userId = session.metadata?.user_id || session.client_reference_id;
      const caseId = session.metadata?.case_id;
      const product = session.metadata?.product || session.metadata?.plan_key || "court_ready_pack";
      const priceId = session.metadata?.price_id;

      if (!userId || userId === "guest") {
        logStep("ERROR", { message: "No valid user_id in metadata - auth required before checkout" });
        processingError = "no_user_id";
        throw new Error("No valid user_id");
      }

      // Get payment intent and subscription IDs
      const paymentIntent = session.payment_intent;
      const paymentIntentId = typeof paymentIntent === 'string' ? paymentIntent : paymentIntent?.id;
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

      // 1. Record order (idempotent via unique constraint on stripe_checkout_session_id)
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
        logStep("Order upsert error (may be constraint)", { error: orderError.message });
      } else {
        logStep("Order recorded", { sessionId: session.id, userId });
      }

      // 2. Create/update entitlement
      // Calculate ends_at based on mode
      let endsAt: string | null = null;
      if (session.mode === "subscription" && subscriptionId) {
        // For subscriptions, we'll update ends_at when we get subscription events
        // For now, set a default of 30 days
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        endsAt = endDate.toISOString();
      }
      // One-time payments: ends_at stays null (permanent access)

      const { error: entitlementError } = await supabaseAdmin
        .from("entitlements")
        .upsert({
          user_id: userId,
          product_id: product,
          access_level: "full",
          source: "stripe",
          starts_at: new Date().toISOString(),
          ends_at: endsAt,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id,product_id" });

      if (entitlementError) {
        logStep("Entitlement upsert error", { error: entitlementError.message });
        processingError = entitlementError.message;
      } else {
        logStep("Entitlement granted", { userId, product, endsAt });
      }

      // 3. Store stripe_customer mapping if we have customer info
      if (session.customer) {
        const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
        const { error: customerError } = await supabaseAdmin
          .from("stripe_customers")
          .upsert({
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            created_at: new Date().toISOString(),
          }, { onConflict: "user_id" });

        if (customerError) {
          logStep("Customer mapping error", { error: customerError.message });
        } else {
          logStep("Customer mapped", { userId, stripeCustomerId });
        }
      }

      // 4. Update case if case_id provided
      if (caseId) {
        const { error: caseError } = await supabaseAdmin
          .from("cases")
          .update({ 
            status: "paid",
            updated_at: new Date().toISOString()
          })
          .eq("id", caseId)
          .eq("user_id", userId);

        if (caseError) {
          logStep("Case update error", { error: caseError.message });
        } else {
          logStep("Case marked paid", { caseId });
        }
      }

      logStep("checkout.session.completed SUCCESS", { userId, product });
    }

    // ============== INVOICE.PAYMENT_SUCCEEDED ==============
    else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      
      logStep("Processing invoice.payment_succeeded", {
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription,
        customerId: invoice.customer
      });

      // Get user_id from stripe_customers table
      const stripeCustomerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      
      if (stripeCustomerId) {
        const { data: customerData } = await supabaseAdmin
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", stripeCustomerId)
          .maybeSingle();

        if (customerData?.user_id) {
          // Extend subscription entitlement
          const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
          
          if (subscriptionId) {
            // Fetch subscription to get current_period_end
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const endsAt = new Date(subscription.current_period_end * 1000).toISOString();
            const productId = typeof subscription.items.data[0]?.price.product === 'string' 
              ? subscription.items.data[0].price.product 
              : subscription.items.data[0]?.price.product?.id || "subscription";

            const { error: entitlementError } = await supabaseAdmin
              .from("entitlements")
              .upsert({
                user_id: customerData.user_id,
                product_id: productId,
                access_level: "full",
                source: "stripe",
                starts_at: new Date().toISOString(),
                ends_at: endsAt,
                updated_at: new Date().toISOString(),
              }, { onConflict: "user_id,product_id" });

            if (entitlementError) {
              logStep("Entitlement renewal error", { error: entitlementError.message });
              processingError = entitlementError.message;
            } else {
              logStep("Entitlement renewed", { userId: customerData.user_id, endsAt });
            }
          }
        }
      }
    }

    // ============== CUSTOMER.SUBSCRIPTION.UPDATED ==============
    else if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      
      logStep("Processing customer.subscription.updated", {
        subscriptionId: subscription.id,
        status: subscription.status,
        customerId: subscription.customer
      });

      const stripeCustomerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;

      if (stripeCustomerId) {
        const { data: customerData } = await supabaseAdmin
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", stripeCustomerId)
          .maybeSingle();

        if (customerData?.user_id) {
          const productId = typeof subscription.items.data[0]?.price.product === 'string' 
            ? subscription.items.data[0].price.product 
            : subscription.items.data[0]?.price.product?.id || "subscription";

          if (subscription.status === "active" || subscription.status === "trialing") {
            const endsAt = new Date(subscription.current_period_end * 1000).toISOString();
            
            const { error: entitlementError } = await supabaseAdmin
              .from("entitlements")
              .upsert({
                user_id: customerData.user_id,
                product_id: productId,
                access_level: "full",
                source: "stripe",
                starts_at: new Date().toISOString(),
                ends_at: endsAt,
                updated_at: new Date().toISOString(),
              }, { onConflict: "user_id,product_id" });

            if (entitlementError) {
              logStep("Subscription update entitlement error", { error: entitlementError.message });
            } else {
              logStep("Subscription entitlement updated", { userId: customerData.user_id, status: subscription.status, endsAt });
            }
          } else if (subscription.status === "past_due" || subscription.status === "unpaid") {
            // Mark as expiring soon but don't revoke immediately
            logStep("Subscription past due", { userId: customerData.user_id, status: subscription.status });
          }
        }
      }
    }

    // ============== CUSTOMER.SUBSCRIPTION.DELETED ==============
    else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      
      logStep("Processing customer.subscription.deleted", {
        subscriptionId: subscription.id,
        customerId: subscription.customer
      });

      const stripeCustomerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;

      if (stripeCustomerId) {
        const { data: customerData } = await supabaseAdmin
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", stripeCustomerId)
          .maybeSingle();

        if (customerData?.user_id) {
          const productId = typeof subscription.items.data[0]?.price.product === 'string' 
            ? subscription.items.data[0].price.product 
            : subscription.items.data[0]?.price.product?.id || "subscription";

          // Set ends_at to now to revoke access
          const { error: entitlementError } = await supabaseAdmin
            .from("entitlements")
            .update({
              ends_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", customerData.user_id)
            .eq("product_id", productId);

          if (entitlementError) {
            logStep("Subscription delete entitlement error", { error: entitlementError.message });
            processingError = entitlementError.message;
          } else {
            logStep("Subscription entitlement revoked", { userId: customerData.user_id, productId });
          }
        }
      }
    }

    // ============== PAYMENT_INTENT.PAYMENT_FAILED ==============
    else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logStep("Payment failed", { 
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message
      });
    }

    // Mark event as processed
    await supabaseAdmin
      .from("stripe_webhook_events")
      .update({ 
        processed_at: new Date().toISOString(),
        processing_error: processingError
      })
      .eq("stripe_event_id", event.id);

    logStep("Event processing complete", { eventId: event.id, type: event.type });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logStep("ERROR processing event", { eventId: event.id, error: errorMessage });
    
    // Record the error but still return 200 to prevent Stripe retries for bad data
    await supabaseAdmin
      .from("stripe_webhook_events")
      .update({ 
        processing_error: errorMessage
      })
      .eq("stripe_event_id", event.id);
  }

  // Always return 200 to acknowledge receipt
  return new Response(JSON.stringify({ received: true }), { 
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});
