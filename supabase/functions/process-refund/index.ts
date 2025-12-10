import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
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
const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')!;
const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')!;

// Auto-detect PayPal environment
const isProduction = paypalClientId && !paypalClientId.startsWith('sb-') && !paypalClientId.startsWith('AZ');
const PAYPAL_BASE_URL = isProduction ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[PROCESS-REFUND] ${step}`, details ? JSON.stringify(details) : '');
};

async function getPayPalAccessToken(): Promise<string> {
  const auth = btoa(`${paypalClientId}:${paypalClientSecret}`);
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`PayPal authentication failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Function started');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      .eq('payment_id', paymentId)
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
    if (payment.status !== 'completed') {
      return new Response(JSON.stringify({ error: 'Payment is not eligible for refund' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check 7-day window for full refund
    const paymentDate = new Date(payment.captured_at || payment.created_at);
    const daysSincePurchase = Math.floor((Date.now() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
    const isWithin7Days = daysSincePurchase <= 7;
    
    logStep('Refund eligibility check', { daysSincePurchase, isWithin7Days, paymentDate: paymentDate.toISOString() });

    // Get PayPal capture ID from the stored response
    let captureId: string | null = null;
    if (payment.paypal_response) {
      const paypalResponse = payment.paypal_response as Record<string, unknown>;
      const purchaseUnits = paypalResponse.purchase_units as Array<Record<string, unknown>> | undefined;
      if (purchaseUnits && purchaseUnits[0]) {
        const captures = (purchaseUnits[0].payments as Record<string, unknown>)?.captures as Array<Record<string, string>> | undefined;
        if (captures && captures[0]) {
          captureId = captures[0].id;
        }
      }
    }

    if (!captureId) {
      // Try to get capture ID from the payment_id itself (for orders that were auto-captured)
      captureId = paymentId;
      logStep('Using payment_id as capture_id', { captureId });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    logStep('PayPal access token obtained');

    // Calculate refund amount
    let refundAmount = amount || payment.amount;
    
    // If after 7 days, calculate prorated refund for subscriptions
    if (!isWithin7Days && payment.plan_type === 'monthly') {
      // Prorated: remaining days in month
      const daysInMonth = 30;
      const remainingDays = Math.max(0, daysInMonth - daysSincePurchase);
      refundAmount = Number((payment.amount * (remainingDays / daysInMonth)).toFixed(2));
      logStep('Calculated prorated refund', { remainingDays, refundAmount });
    }

    // Process refund via PayPal
    const refundPayload: Record<string, unknown> = {
      note_to_payer: `Refund for Justice-Bot ${payment.plan_type}. ${reason ? `Reason: ${reason}` : ''}`,
    };

    // Only include amount for partial refunds
    if (refundAmount < payment.amount) {
      refundPayload.amount = {
        value: refundAmount.toFixed(2),
        currency_code: payment.currency || 'CAD',
      };
    }

    const refundResponse = await fetch(`${PAYPAL_BASE_URL}/v2/payments/captures/${captureId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(refundPayload),
    });

    const refundData = await refundResponse.json();
    logStep('PayPal refund response', { status: refundResponse.status, data: refundData });

    if (!refundResponse.ok) {
      // Log detailed error for debugging
      console.error('[PROCESS-REFUND] PayPal refund failed:', refundData);
      
      // Check for already refunded
      if (refundData.details?.[0]?.issue === 'CAPTURE_FULLY_REFUNDED') {
        return new Response(JSON.stringify({ error: 'This payment has already been refunded' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ 
        error: 'Refund processing failed',
        details: refundData.message || 'PayPal API error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update payment record
    await supabase
      .from('payments')
      .update({
        status: refundAmount >= payment.amount ? 'refunded' : 'partially_refunded',
        updated_at: new Date().toISOString(),
        metadata: {
          ...(payment.metadata as Record<string, unknown> || {}),
          refund_id: refundData.id,
          refund_amount: refundAmount,
          refund_reason: reason,
          refund_date: new Date().toISOString(),
          refund_type: isWithin7Days ? '7_day_guarantee' : 'prorated',
        }
      })
      .eq('id', payment.id);

    // Remove entitlement if full refund
    if (refundAmount >= payment.amount) {
      const productId = payment.form_id 
        ? `form_${payment.form_id}`
        : payment.plan_type;

      await supabase
        .from('entitlements')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('product_id', productId);

      logStep('Entitlement removed', { productId });
    }

    // Create audit log
    await supabase
      .from('payment_audit')
      .insert({
        payment_id: paymentId,
        user_id: userData.user.id,
        event_type: 'refund',
        metadata: {
          refund_id: refundData.id,
          refund_amount: refundAmount,
          original_amount: payment.amount,
          reason,
          refund_type: isWithin7Days ? '7_day_guarantee' : 'prorated',
          days_since_purchase: daysSincePurchase,
        }
      });

    logStep('Refund completed successfully', { refundId: refundData.id, refundAmount });

    return new Response(JSON.stringify({ 
      success: true,
      refundId: refundData.id,
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
    return new Response(JSON.stringify({ error: 'Refund processing failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
