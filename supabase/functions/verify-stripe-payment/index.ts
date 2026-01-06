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

    const body = await req.json().catch(() => ({}));
    const sessionId = body?.sessionId || body?.session_id;
    if (!sessionId) throw new Error("Missing sessionId");
    logStep("Verifying session", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer']
    });

    // Validate the paid status early
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

    // Validate the correct price for unlocks
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 10 });
    const allowedPriceIds = new Set([
      'price_1SYLdJL0pLShFbLttpxYfuas', // $5.99 unlock (legacy)
      'price_1SmUwAL0pLShFbLtIK429fdX', // $39 Court-Ready Document Pack
    ]);
    const matchedPrice = lineItems.data.some((li) => {
      const price = (li.price as Stripe.Price | null);
      return !!price?.id && allowedPriceIds.has(price.id);
    });

    if (!matchedPrice) {
      logStep('Price mismatch', { lineItems: lineItems.data.map(li => ({ price: (li.price as any)?.id, description: li.description })) });
      return new Response(JSON.stringify({
        success: false,
        error: 'Incorrect product purchased'
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

    // Determine product and case from metadata
    const product = session.metadata?.product || 'form_unlock';
    const rawPlanKey = session.metadata?.plan_key;
    const planKey = (!rawPlanKey || rawPlanKey === 'unknown') ? product : rawPlanKey;
    const caseId = session.metadata?.case_id || null;
    
    // Check if entitlement already exists (idempotency) - scoped by case_id if present
    if (userId && userId !== 'guest') {
      let existingQuery = supabaseAdmin
        .from('entitlements')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', planKey);
      
      // If case_id present, scope check to that case
      if (caseId) {
        existingQuery = existingQuery.eq('case_id', caseId);
      }

      const { data: existing } = await existingQuery.maybeSingle();

      if (existing) {
        logStep("Entitlement already exists", { userId, product: planKey, caseId });
        return new Response(JSON.stringify({ 
          success: true, 
          alreadyUnlocked: true,
          product: planKey,
          caseId
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Create entitlement record - scoped to case_id
      const { error: entitlementError } = await supabaseAdmin
        .from('entitlements')
        .insert({
          user_id: userId,
          product_id: planKey,
          case_id: caseId,
          source: 'stripe',
          feature: product,
          scope: caseId ? 'case' : 'global',
          granted_at: new Date().toISOString(),
        });

      if (entitlementError) {
        logStep("Failed to create entitlement", { error: entitlementError.message });
        // Don't fail the request - payment succeeded
      } else {
        logStep("Entitlement created", { userId, product: planKey, caseId, scope: caseId ? 'case' : 'global' });
      }

      // Also update the case record to mark it as paid
      if (caseId) {
        const { error: caseError } = await supabaseAdmin
          .from('cases')
          .update({ 
            is_paid: true,
            plan: planKey,
            updated_at: new Date().toISOString()
          })
          .eq('id', caseId)
          .eq('user_id', userId);

        if (caseError) {
          logStep("Failed to update case", { error: caseError.message });
        } else {
          logStep("Case marked as paid", { caseId });
        }
      }
    }

    // Also record in payments table for audit
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .upsert({
        payment_id: sessionId,
        user_id: userId || 'guest',
        case_id: caseId,
        amount: (session.amount_total || 3900) / 100,
        amount_cents: session.amount_total || 3900,
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
      logStep("Payment recorded", { caseId });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      product: planKey,
      caseId,
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
