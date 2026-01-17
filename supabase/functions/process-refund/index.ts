import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const RefundRequestSchema = z.object({
  paymentId: z.string().min(1).max(255),
  reason: z.enum(['not_satisfied', 'technical_issue', 'duplicate', 'other']).optional(),
  amount: z.number().positive().optional(), // For partial refunds
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[PROCESS-REFUND] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Function started');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-08-27.basil" });

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    logStep('User authenticated', { userId: userData.user.id });

    // Validate input
    const requestBody = await req.json();
    const validation = RefundRequestSchema.safeParse(requestBody);
    
    if (!validation.success) {
      logStep('Validation failed', { errors: validation.error.issues });
      return new Response(JSON.stringify({ 
        error: 'Invalid request',
        details: validation.error.issues
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { paymentId, reason, amount } = validation.data;
    logStep('Processing refund request', { paymentId, reason, amount });

    // Get the payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', userData.user.id)
      .single();

    if (paymentError || !payment) {
      logStep('Payment not found', { paymentId, userId: userData.user.id });
      return new Response(JSON.stringify({ error: 'Payment not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if payment is eligible for refund
    if (payment.status !== 'paid') {
      return new Response(JSON.stringify({ error: 'Payment is not eligible for refund' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check 7-day window for full refund
    const paymentDate = new Date(payment.paid_at || payment.created_at);
    const daysSincePurchase = Math.floor((Date.now() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
    const isWithin7Days = daysSincePurchase <= 7;
    
    logStep('Refund eligibility check', { daysSincePurchase, isWithin7Days, paymentDate: paymentDate.toISOString() });

    // Get Stripe payment intent ID
    const paymentIntentId = payment.payment_intent_id || payment.stripe_payment_intent_id;
    
    if (!paymentIntentId) {
      logStep('No payment intent ID found', { payment });
      return new Response(JSON.stringify({ error: 'Cannot process refund - missing payment reference' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate refund amount
    let refundAmount = amount || payment.amount;
    
    // If after 7 days, calculate prorated refund for subscriptions
    if (!isWithin7Days && payment.plan_type === 'monthly') {
      const daysInMonth = 30;
      const remainingDays = Math.max(0, daysInMonth - daysSincePurchase);
      refundAmount = Number((payment.amount * (remainingDays / daysInMonth)).toFixed(2));
      logStep('Calculated prorated refund', { remainingDays, refundAmount });
    }

    // Process refund via Stripe
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
      reason: reason === 'duplicate' ? 'duplicate' : reason === 'fraudulent' ? 'fraudulent' : 'requested_by_customer',
    };

    // Only include amount for partial refunds (in cents)
    if (refundAmount < payment.amount) {
      refundParams.amount = Math.round(refundAmount * 100);
    }

    logStep('Creating Stripe refund', { refundParams });

    const refund = await stripe.refunds.create(refundParams);
    
    logStep('Stripe refund created', { refundId: refund.id, status: refund.status });

    // Update payment record
    await supabase
      .from('payments')
      .update({
        status: refundAmount >= payment.amount ? 'refunded' : 'partially_refunded',
      })
      .eq('id', payment.id);

    // Remove entitlement if full refund
    if (refundAmount >= payment.amount) {
      const productId = payment.entitlement_key || payment.product_id;

      if (productId) {
        await supabase
          .from('entitlements')
          .update({
            ends_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userData.user.id)
          .eq('product_id', productId);

        logStep('Entitlement revoked', { productId });
      }
    }

    logStep('Refund completed successfully', { refundId: refund.id, refundAmount });

    return new Response(JSON.stringify({ 
      success: true,
      refundId: refund.id,
      refundAmount,
      refundType: isWithin7Days ? '7_day_guarantee' : 'prorated',
      message: isWithin7Days 
        ? 'Full refund processed under 7-day guarantee' 
        : `Prorated refund of $${refundAmount.toFixed(2)} CAD processed`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[PROCESS-REFUND] Error:', error);
    return new Response(JSON.stringify({ error: 'Refund processing failed', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
