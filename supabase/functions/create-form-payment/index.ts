import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Standard form price - $29.99 CAD
const STANDARD_FORM_PRICE_CENTS = 2999;

const FormPaymentSchema = z.object({
  formId: z.string().uuid(),
  paymentId: z.string().optional(),
  promoCode: z.string().optional(),
});

// Valid promo codes with discount percentages
const VALID_PROMO_CODES: Record<string, number> = {
  "LAUNCH50": 0.5,
  "FIRST50": 0.5,
  "DEMO2024": 0.5,
  "TRIAGE50": 0.5, // Time-limited offer after triage completion
  "COMEBACK7": 0.5, // 7-day comeback offer for inactive users
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-FORM-PAYMENT] ${step}${detailsStr}`);
};

// Auto-detect PayPal environment + credentials (supports both sandbox + live)
const paypalClientId = Deno.env.get("PAYPAL_CLIENT_ID_LIVE") ?? Deno.env.get("PAYPAL_CLIENT_ID") ?? "";
const paypalClientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET_LIVE") ?? Deno.env.get("PAYPAL_CLIENT_SECRET") ?? "";
const isProduction = paypalClientId && !paypalClientId.startsWith("sb-") && !paypalClientId.startsWith("AZ");
const PAYPAL_BASE_URL = Deno.env.get("PAYPAL_API_BASE") ?? (isProduction ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com");

async function getPayPalAccessToken(): Promise<string> {
  if (!paypalClientId || !paypalClientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const authResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!authResponse.ok) {
    const errorText = await authResponse.text();
    logStep("PayPal auth failed", {
      status: authResponse.status,
      environment: isProduction ? "PRODUCTION" : "SANDBOX",
      baseUrl: PAYPAL_BASE_URL,
      error: errorText.substring(0, 200),
    });
    throw new Error("Failed to get PayPal access token");
  }

  const { access_token } = await authResponse.json();
  return access_token;
}


serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    logStep("User authenticated", { userId: user.id });

    const requestBody = await req.json();
    
    // Validate input with Zod
    const validationResult = FormPaymentSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('[SECURITY] Validation failed:', {
        errors: validationResult.error.errors,
        userId: user.id
      });
      throw new Error('Invalid request');
    }

    const { formId, promoCode } = validationResult.data;
    
    // Fetch form from database to get actual price
    const { data: form, error: formError } = await supabaseClient
      .from('forms')
      .select('id, title, price_cents')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      console.error('[SECURITY] Invalid form ID:', { formId, userId: user.id });
      throw new Error('Form not found');
    }

    let amount = form.price_cents || STANDARD_FORM_PRICE_CENTS;
    let discountApplied = false;
    let discountLabel = '';
    
    // Apply promo code discount if valid
    if (promoCode && VALID_PROMO_CODES[promoCode.toUpperCase()]) {
      const discount = VALID_PROMO_CODES[promoCode.toUpperCase()];
      amount = Math.round(amount * (1 - discount));
      discountApplied = true;
      discountLabel = `${discount * 100}% off with ${promoCode.toUpperCase()}`;
      logStep("Promo code applied", { promoCode, discount, originalAmount: form.price_cents, newAmount: amount });
    }
    
    const currency = 'CAD';

    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const orderResponse = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: (amount / 100).toFixed(2), // Convert cents to dollars
              },
              description: discountApplied 
                ? `Legal Form Access - ${form.title} (${discountLabel})`
                : `Legal Form Access - ${form.title}`,
            },
          ],
          application_context: {
            brand_name: "Justice-Bot",
            return_url: `${req.headers.get("origin")}/payment-success?formId=${formId}`,
            cancel_url: `${req.headers.get("origin")}/payment-cancel`,
          },
        }),
      }
    );

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      logStep("PayPal order creation failed", { error });
      throw new Error(`Failed to create order: ${error}`);
    }

    const order = await orderResponse.json();
    logStep("PayPal order created", { orderId: order.id });

    // Save payment record with form_id
    const { error: paymentError } = await supabaseClient
      .from("payments")
      .insert({
        user_id: user.id,
        payment_id: order.id,
        form_id: formId,
        amount: amount / 100,
        amount_cents: amount,
        currency,
        status: "pending",
        plan_type: 'form_purchase',
        payment_provider: "paypal",
      });

    if (paymentError) {
      logStep("Error saving payment record", { error: paymentError });
      throw paymentError;
    }

    // Find approval URL
    const approvalUrl = order.links.find((link: any) => link.rel === "approve")?.href;

    if (!approvalUrl) {
      throw new Error("No approval URL found in PayPal response");
    }

    return new Response(
      JSON.stringify({ 
        url: approvalUrl,
        approvalUrl,
        orderId: order.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[ERROR] Form payment creation failed:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response(
      JSON.stringify({ error: 'Payment processing failed' }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
