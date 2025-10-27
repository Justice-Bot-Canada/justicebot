import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define allowed form prices (in cents) - server-side source of truth
const FORM_PRICES: Record<string, number> = {
  'basic_form': 599,      // $5.99
  'standard_form': 999,   // $9.99
  'premium_form': 1999,   // $19.99
  'tribunal_package': 4999, // $49.99
};

const FormPaymentSchema = z.object({
  formId: z.string().min(1).max(100),
  amount: z.number().int().positive().max(100000), // max $1000
  currency: z.string().length(3).optional().default('CAD'),
});

interface FormPaymentRequest {
  formId: string;
  amount: number;
  currency?: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-FORM-PAYMENT] ${step}${detailsStr}`);
};

async function getPayPalAccessToken(): Promise<string> {
  const paypalClientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const paypalClientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");

  const authResponse = await fetch(
    "https://api-m.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    }
  );

  if (!authResponse.ok) {
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
      logStep("Validation error", { errors: validationResult.error.errors });
      throw new Error(`Invalid request: ${validationResult.error.errors.map(e => e.message).join(', ')}`);
    }

    const { formId, amount, currency } = validationResult.data;
    
    // CRITICAL: Verify amount matches server-side price
    const expectedAmount = FORM_PRICES[formId];
    if (!expectedAmount) {
      logStep("Invalid form ID", { formId });
      throw new Error("Invalid form ID");
    }
    
    if (amount !== expectedAmount) {
      logStep("Price manipulation detected", { 
        providedAmount: amount, 
        expectedAmount,
        formId,
        userId: user.id 
      });
      throw new Error("Invalid payment amount");
    }

    logStep("Creating form payment", { formId, amount, currency });

    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const orderResponse = await fetch(
      "https://api-m.paypal.com/v2/checkout/orders",
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
              description: `Legal Form Access - ${formId}`,
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

    // Save payment record
    const { error: paymentError } = await supabaseClient
      .from("payments")
      .insert({
        user_id: user.id,
        payment_id: order.id,
        amount: amount / 100,
        currency,
        status: "pending",
        plan_type: `form_${formId}`,
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
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
