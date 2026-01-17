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

// GA4 Measurement Protocol: Generate stable client_id from identifiers
function stableClientId(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  const a = Math.abs(h) + 100000;
  const b = (Math.abs(h * 7) % 1000000) + 100000;
  return `${a}.${b}`;
}

// GA4 Measurement Protocol: Send any event
async function ga4SendEvent(eventName: string, params: Record<string, unknown>, clientIdSeed: string) {
  const measurementId = Deno.env.get("GA4_MEASUREMENT_ID");
  const apiSecret = Deno.env.get("GA4_API_SECRET");

  if (!measurementId || !apiSecret) {
    logStep("GA4 Measurement Protocol not configured - skipping event", { eventName });
    return;
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
    measurementId,
  )}&api_secret=${encodeURIComponent(apiSecret)}`;

  const client_id = stableClientId(clientIdSeed);

  const payload = {
    client_id,
    events: [
      {
        name: eventName,
        params: {
          ...params,
          engagement_time_msec: 1,
        },
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    // GA often returns 204 No Content on success
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      logStep("GA4 send failed", { status: res.status, body: text, eventName });
    } else {
      logStep(`✅ GA4 ${eventName} event sent`, { client_id, params });
    }
  } catch (error) {
    logStep("GA4 send error", { error: error.message, eventName });
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!stripeKey || !webhookSecret) {
    logStep("ERROR: Missing env vars", { hasStripeKey: !!stripeKey, hasWebhookSecret: !!webhookSecret });
    return new Response("Server configuration error", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  
  // Get raw body for signature verification - CRITICAL: must use .text() not .json()
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    logStep("ERROR: No stripe-signature header");
    return new Response("Missing signature", { status: 400 });
  }

  // Verify Stripe signature
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
    logStep("Event verified", { type: event.type, id: event.id, livemode: event.livemode });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logStep("Signature verification FAILED", { message });
    return new Response(`Webhook signature verification failed: ${message}`, { status: 400 });
  }

  // Supabase admin client (service role bypasses RLS)
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // ============== IDEMPOTENCY: Check if event already processed ==============
  const { data: existingEvent } = await supabaseAdmin
    .from("stripe_webhook_events")
    .select("id, processed_at")
    .eq("stripe_event_id", event.id)
    .maybeSingle();

  if (existingEvent?.processed_at) {
    logStep("Event already processed - skipping", { eventId: event.id });
    return new Response(JSON.stringify({ received: true, duplicate: true }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" }
    });
  }

  // Insert event record first (idempotency key)
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
        amountTotal: session.amount_total,
        currency: session.currency,
        metadata: session.metadata
      });

      // CRITICAL: Only process if payment is actually completed
      if (session.payment_status !== "paid") {
        logStep("Payment not complete - waiting for payment", { status: session.payment_status });
        return new Response(JSON.stringify({ received: true, pending: true }), { 
          status: 200, 
          headers: { "Content-Type": "application/json" }
        });
      }

      // Extract metadata - this is the source of truth
      const md = session.metadata || {};
      const userId = md.user_id || session.client_reference_id;
      const priceId = md.price_id;
      const productType = md.product_type || "one_time";
      const productId = md.product_id || priceId;
      const entitlementKey = md.entitlement_key || productId;
      const caseId = md.case_id || null;
      const productName = md.product_name || "Justice-Bot Product";
      const paymentIdFromMeta = md.payment_id;
      const clientId = md.ga_client_id || session.id; // Use GA client_id if passed, fallback to session.id

      if (!userId) {
        processingError = "no_user_id_in_metadata";
        logStep("ERROR: No user_id found", { metadata: md, clientRefId: session.client_reference_id });
        throw new Error("No user_id in session metadata");
      }

      // Get payment identifiers
      const stripeCheckoutSessionId = session.id;
      const stripePaymentIntentId = typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent?.id || null;
      const subscriptionId = typeof session.subscription === 'string' 
        ? session.subscription 
        : session.subscription?.id || null;

      logStep("Extracted data", { 
        userId, 
        productId, 
        entitlementKey, 
        caseId, 
        stripePaymentIntentId,
        productType 
      });

      // ============ STEP 1: Update or create payment row ============
      let paymentId = paymentIdFromMeta;
      
      // Try to update existing payment row first (created by create_checkout)
      const { data: updatedPayment, error: updateError } = await supabaseAdmin
        .from("payments")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          stripe_checkout_session_id: stripeCheckoutSessionId,
          payment_intent_id: stripePaymentIntentId,
        })
        .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
        .select()
        .maybeSingle();

      if (updatedPayment) {
        paymentId = updatedPayment.id;
        logStep("Payment row updated to PAID", { paymentId, sessionId: stripeCheckoutSessionId });
      } else if (updateError || !updatedPayment) {
        // No existing row - create one (fallback for edge cases)
        const { data: newPayment, error: insertError } = await supabaseAdmin
          .from("payments")
          .insert({
            user_id: userId,
            case_id: caseId || null,
            product_id: productId,
            entitlement_key: entitlementKey,
            amount: (session.amount_total || 0) / 100,
            amount_cents: session.amount_total || 0,
            currency: session.currency || "cad",
            status: "paid",
            paid_at: new Date().toISOString(),
            stripe_checkout_session_id: stripeCheckoutSessionId,
            payment_intent_id: stripePaymentIntentId,
            payment_provider: "stripe",
            plan_type: productType,
          })
          .select()
          .single();

        if (insertError) {
          logStep("Payment insert error", { error: insertError.message });
        } else {
          paymentId = newPayment.id;
          logStep("Payment row created (fallback)", { paymentId });
        }
      }

      // ============ STEP 2: Create order record ============
      const { error: orderError } = await supabaseAdmin
        .from("orders")
        .upsert({
          user_id: userId,
          stripe_checkout_session_id: stripeCheckoutSessionId,
          stripe_payment_intent_id: stripePaymentIntentId,
          stripe_subscription_id: subscriptionId,
          price_id: priceId,
          amount_total: session.amount_total || 0,
          currency: session.currency || "cad",
          status: "paid",
          paid_at: new Date().toISOString(),
        }, { onConflict: "stripe_checkout_session_id" });

      if (orderError) {
        logStep("Order record error", { error: orderError.message });
      } else {
        logStep("Order recorded", { sessionId: stripeCheckoutSessionId, amount: session.amount_total });
      }

      // ============ STEP 3: Grant entitlement (THE PAYWALL TRUTH) ============
      const endsAt = calculateEndsAt(productType);

      const entitlementData: Record<string, any> = {
        user_id: userId,
        product_id: entitlementKey, // Use entitlement_key as product_id
        access_level: productType === "low_income" ? "low_income" : "full",
        source: "stripe",
        starts_at: new Date().toISOString(),
        ends_at: endsAt,
        updated_at: new Date().toISOString(),
      };

      // Scope to case if provided
      if (caseId) {
        entitlementData.case_id = caseId;
      }

      const { error: entitlementError } = await supabaseAdmin
        .from("entitlements")
        .upsert(entitlementData, { onConflict: "user_id,product_id" });

      if (entitlementError) {
        processingError = entitlementError.message;
        logStep("ENTITLEMENT ERROR", { error: entitlementError.message });
      } else {
        logStep("✅ ENTITLEMENT GRANTED", { 
          userId, 
          entitlementKey,
          productType, 
          caseId, 
          endsAt,
          amountPaid: session.amount_total,
          currency: session.currency,
          productName,
        });

        // ============ STEP 3b: Send GA4 purchase event AFTER entitlement granted ============
        const transactionId = stripePaymentIntentId || stripeCheckoutSessionId;
        const value = (session.amount_total || 0) / 100;
        const currency = (session.currency || "cad").toUpperCase();
        
        // Stable client seed using salt + user identifiers
        const seedSalt = Deno.env.get("GA4_CLIENT_ID_SALT") ?? "";
        const clientSeed = `${seedSalt}|${userId || ""}|${session.customer_email || ""}|${transactionId}`;
        
        // Determine item info from metadata
        const itemName = productName || "Monthly Justice-Bot Access";
        const itemId = priceId || entitlementKey || "monthly_access";

        // Fire purchase ONLY on confirmed success (Stripe + Supabase both done)
        await ga4SendEvent(
          "purchase",
          {
            transaction_id: transactionId,
            value,
            currency,
            items: [
              {
                item_id: itemId,
                item_name: itemName,
                item_category: productType === "monthly" || productType === "yearly" ? "subscription" : "one_time",
                price: value,
                quantity: 1,
              },
            ],
          },
          clientSeed,
        );

        // Also fire access_unlocked event for internal tracking
        await ga4SendEvent(
          "access_unlocked",
          { method: "stripe", transaction_id: transactionId, product_type: productType },
          clientSeed,
        );
      }

      // ============ STEP 4: Mark case as paid (if case_id provided) ============
      if (caseId) {
        const { error: caseError } = await supabaseAdmin
          .from("cases")
          .update({
            is_paid: true,
            paid_at: new Date().toISOString(),
            flow_step: "documents_ready",
            updated_at: new Date().toISOString(),
          })
          .eq("id", caseId)
          .eq("user_id", userId);

        if (caseError) {
          logStep("Case update error", { error: caseError.message, caseId });
        } else {
          logStep("✅ Case marked as PAID", { caseId });
        }
      }

      // ============ STEP 5: Store stripe_customer mapping ============
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

      logStep("checkout.session.completed processing COMPLETE", { 
        userId, 
        entitlementKey, 
        amount: session.amount_total,
        caseId 
      });
    }

    // ============== charge.refunded ==============
    else if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      
      logStep("Processing charge.refunded", { chargeId: charge.id, paymentIntent: charge.payment_intent });

      const paymentIntentId = typeof charge.payment_intent === 'string' 
        ? charge.payment_intent 
        : charge.payment_intent?.id;

      if (paymentIntentId) {
        // Mark payment as refunded
        const { data: refundedPayment } = await supabaseAdmin
          .from("payments")
          .update({
            status: "refunded",
          })
          .eq("payment_intent_id", paymentIntentId)
          .select()
          .maybeSingle();

        if (refundedPayment) {
          logStep("Payment marked as refunded", { paymentId: refundedPayment.id });

          // Optionally revoke entitlement
          if (refundedPayment.entitlement_key && refundedPayment.user_id) {
            await supabaseAdmin
              .from("entitlements")
              .update({
                ends_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", refundedPayment.user_id)
              .eq("product_id", refundedPayment.entitlement_key);

            logStep("Entitlement revoked due to refund", { 
              userId: refundedPayment.user_id, 
              entitlementKey: refundedPayment.entitlement_key 
            });
          }
        }
      }
    }

    // ============== invoice.payment_succeeded (subscription renewals) ==============
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

            logStep("✅ Subscription entitlement renewed", { userId: customerData.user_id, endsAt });
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

          // Revoke: set ends_at to now
          await supabaseAdmin
            .from("entitlements")
            .update({
              ends_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", customerData.user_id)
            .eq("product_id", priceId || "subscription");

          logStep("Subscription entitlement revoked", { userId: customerData.user_id });
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

    logStep("Event processing complete", { eventId: event.id, type: event.type });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logStep("PROCESSING ERROR", { eventId: event.id, error: errorMessage });
    
    await supabaseAdmin
      .from("stripe_webhook_events")
      .update({ processing_error: errorMessage })
      .eq("stripe_event_id", event.id);
  }

  // Always return 200 to acknowledge receipt (Stripe retries on non-2xx)
  return new Response(JSON.stringify({ received: true }), { 
    status: 200, 
    headers: { "Content-Type": "application/json" }
  });
});
