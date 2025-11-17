import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')!;
const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')!;

// Auto-detect PayPal environment based on credentials
const isProduction = paypalClientId && !paypalClientId.startsWith('sb-') && !paypalClientId.startsWith('AZ');
const PAYPAL_BASE_URL = isProduction ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

// Server-side price validation
const VALID_PRICES: Record<string, number> = {
  'premium_monthly': 19.99,
  'Premium Monthly': 19.99,
  'premium_yearly': 99.99,
  'Premium Yearly': 99.99,
  'low_income': 2.99,
  'Low-Income': 2.99,
  'Low Income': 2.99,
  'one_time_document': 9.99,
  'One-Time Document': 9.99
};

// Input validation schema
const PaymentRequestSchema = z.object({
  planType: z.string().min(1).max(100),
  amount: z.string().regex(/^\d+\.?\d{0,2}$/),
  caseId: z.string().uuid().optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate input
    const requestBody = await req.json();
    const validation = PaymentRequestSchema.safeParse(requestBody);
    
    if (!validation.success) {
      console.error('[SECURITY] Validation failed:', {
        errors: validation.error.issues,
        userId: userData?.user?.id
      });
      return new Response(JSON.stringify({ 
        error: 'Invalid request'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { planType, amount, caseId } = validation.data;

    // Validate price matches plan type
    const expectedAmount = VALID_PRICES[planType];
    if (!expectedAmount) {
      console.error('[SECURITY] Invalid plan type:', {
        planType,
        userId: userData.user.id
      });
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const submittedAmount = parseFloat(amount);
    if (Math.abs(submittedAmount - expectedAmount) > 0.01) {
      console.error('[SECURITY] Price manipulation attempt:', {
        planType,
        expected: expectedAmount,
        received: submittedAmount,
        userId: userData.user.id
      });
      return new Response(JSON.stringify({ 
        error: 'Invalid request'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If caseId provided, verify user owns the case
    if (caseId) {
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('user_id')
        .eq('id', caseId)
        .single();
      
      if (caseError || !caseData || caseData.user_id !== userData.user.id) {
        console.error('[SECURITY] Case access denied:', {
          caseId,
          userId: userData.user.id,
          error: caseError?.message
        });
        return new Response(JSON.stringify({ error: 'Access denied' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Create PayPal payment
    const paymentData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'CAD',
          value: amount
        },
        description: `Justice Bot - ${planType} Plan`,
        custom_id: caseId || userData.user.id,
        reference_id: `${planType}_${Date.now()}`
      }],
      application_context: {
        return_url: `${req.headers.get('origin')}/thank-you?product=${encodeURIComponent(planType)}`,
        cancel_url: `${req.headers.get('origin')}/payment-cancel`,
        brand_name: 'Justice Bot',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    };

    const paymentResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.text();
      console.error('PayPal API Error:', { status: paymentResponse.status, errorData, url: PAYPAL_BASE_URL });
      throw new Error(`PayPal payment creation failed: ${paymentResponse.status}. ${errorData.substring(0, 200)}`);
    }

    const payment = await paymentResponse.json();
    console.log('PayPal payment created:', payment.id);

    // Store payment record in database
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        user_id: userData.user.id,
        case_id: caseId,
        payment_provider: 'paypal',
        payment_id: payment.id,
        amount: parseFloat(amount),
        currency: 'CAD',
        plan_type: planType,
        status: 'pending'
      });

    if (insertError) {
      console.error('Error storing payment:', insertError);
      // Don't throw - payment was created successfully
    } else {
      // Create payment audit log
      await supabase
        .from('payment_audit')
        .insert({
          payment_id: payment.id,
          user_id: userData.user.id,
          event_type: 'created',
          metadata: {
            amount: parseFloat(amount),
            currency: 'CAD',
            plan_type: planType,
            case_id: caseId
          }
        });
    }

    // Find the approval URL
    const approvalUrl = payment.links?.find((link: any) => link.rel === 'approve')?.href;
    
    if (!approvalUrl) {
      throw new Error('No approval URL found in PayPal response');
    }

    return new Response(JSON.stringify({ 
      paymentId: payment.id,
      approvalUrl: approvalUrl 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[ERROR] Payment creation failed:', {
      error: (error as Error).message,
      stack: (error as Error).stack
    });
    return new Response(JSON.stringify({ error: 'Payment processing failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

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
    const errorData = await response.text();
    console.error('PayPal Auth Error:', { 
      status: response.status, 
      error: errorData,
      clientIdPrefix: paypalClientId?.substring(0, 6),
      environment: isProduction ? 'PRODUCTION' : 'SANDBOX',
      url: PAYPAL_BASE_URL
    });
    throw new Error(`PayPal auth failed (${response.status}). Check credentials match environment (${isProduction ? 'PRODUCTION' : 'SANDBOX'}). ${errorData.substring(0, 100)}`);
  }

  const data = await response.json();
  return data.access_token;
}