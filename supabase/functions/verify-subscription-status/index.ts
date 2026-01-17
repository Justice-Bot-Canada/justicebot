import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// Secure CORS - only allow production, localhost, and Lovable preview
const ALLOWED_ORIGINS = ['https://justice-bot.com', 'https://www.justice-bot.com', 'http://localhost:8080', 'http://localhost:5173'];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.lovableproject.com')) return true;
  return false;
}

const getCorsHeaders = (origin?: string | null) => ({
  'Access-Control-Allow-Origin': origin && isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
});

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [VERIFY-SUBSCRIPTION] ${step}`, details ? JSON.stringify(details) : '');
};

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('Origin'));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Function started');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    logStep('User authenticated', { userId: user.id, email: user.email });

    // Check entitlements directly in the database (Stripe is source of truth via webhook)
    const { data: entitlements, error: entError } = await supabaseClient
      .from('entitlements')
      .select('*')
      .eq('user_id', user.id)
      .or('ends_at.is.null,ends_at.gt.now()');

    if (entError) {
      logStep('Entitlement query error', { error: entError });
      throw new Error('Failed to check subscription status');
    }

    const hasActiveSubscription = entitlements && entitlements.length > 0;
    
    logStep('Subscription status checked', { 
      hasActiveSubscription,
      entitlementCount: entitlements?.length || 0
    });

    if (hasActiveSubscription) {
      const primaryEntitlement = entitlements[0];
      
      return new Response(
        JSON.stringify({ 
          success: true,
          status: 'ACTIVE',
          productId: primaryEntitlement.product_id,
          accessLevel: primaryEntitlement.access_level,
          endsAt: primaryEntitlement.ends_at,
          source: primaryEntitlement.source
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      logStep('No active subscription found');
      
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'INACTIVE',
          message: 'No active subscription found'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

  } catch (error) {
    logStep('ERROR', { message: error.message, stack: error.stack });
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
