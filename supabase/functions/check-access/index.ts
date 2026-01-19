import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * PAYWALL MIDDLEWARE - Server-side access enforcement
 * 
 * Validates:
 * - User is authenticated
 * - User has access_unlocked = true OR
 * - User has purchased the specific form OR
 * - User has active subscription entitlement
 * 
 * Returns:
 * - 200 + { access: true } if allowed
 * - 402 PAYMENT_REQUIRED if locked
 * - 401 UNAUTHORIZED if not authenticated
 */

interface AccessRequest {
  action: 'generate' | 'download' | 'preview' | 'check';
  formId?: string;
  formCode?: string;
  caseId?: string;
}

interface AccessResponse {
  access: boolean;
  tier?: string;
  reason?: string;
  expires_at?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: 'UNAUTHORIZED',
        code: 'NO_AUTH_HEADER',
        message: 'Authentication required'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ 
        error: 'UNAUTHORIZED',
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = userData.user.id;
    const body: AccessRequest = await req.json();
    const { action, formId, formCode, caseId } = body;

    console.log(`Access check: user=${userId}, action=${action}, formId=${formId}`);

    // 1. Check if user is admin (full access)
    const { data: isAdminData } = await supabase.rpc('is_admin');
    if (isAdminData === true) {
      return new Response(JSON.stringify({ 
        access: true, 
        tier: 'admin',
        reason: 'Admin access'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Check user_access table
    const { data: userAccess } = await supabase
      .from('user_access')
      .select('*')
      .eq('user_id', userId)
      .single();

    // If user has access_unlocked = true and not expired
    if (userAccess?.access_unlocked) {
      const expiresAt = userAccess.access_expires_at ? new Date(userAccess.access_expires_at) : null;
      if (!expiresAt || expiresAt > new Date()) {
        return new Response(JSON.stringify({ 
          access: true, 
          tier: userAccess.tier,
          expires_at: userAccess.access_expires_at,
          reason: 'Subscription active'
        } as AccessResponse), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // 3. Check entitlements table for active premium access
    const { data: entitlements } = await supabase
      .from('entitlements')
      .select('*')
      .eq('user_id', userId)
      .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`);

    const hasPremiumAccess = entitlements?.some(e => 
      e.product_id === 'premium_access' || 
      e.access_level === 'premium' ||
      e.product_id.startsWith('price_')
    );

    if (hasPremiumAccess) {
      const premiumEntitlement = entitlements?.find(e => 
        e.product_id === 'premium_access' || e.access_level === 'premium'
      );
      return new Response(JSON.stringify({ 
        access: true, 
        tier: 'premium',
        expires_at: premiumEntitlement?.ends_at,
        reason: 'Premium entitlement active'
      } as AccessResponse), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Check if specific form was purchased
    if (formId || formCode) {
      const formPurchased = entitlements?.some(e => 
        e.product_id === formId || 
        e.product_id === formCode ||
        e.product_id === `form_${formId}` ||
        e.product_id === `form_${formCode}`
      );

      // Also check purchased_form_ids in user_access
      const formInPurchased = userAccess?.purchased_form_ids?.includes(formId || formCode || '');

      if (formPurchased || formInPurchased) {
        return new Response(JSON.stringify({ 
          access: true, 
          tier: 'one_time',
          reason: 'Form purchased'
        } as AccessResponse), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // 5. Check free tier eligibility
    const { data: freeEligible } = await supabase.rpc('check_free_tier_eligibility', { 
      p_user_id: userId 
    });

    if (freeEligible) {
      return new Response(JSON.stringify({ 
        access: true, 
        tier: 'free',
        reason: 'Free tier eligible'
      } as AccessResponse), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 6. Check if form is free (price_cents = 0)
    if (formId || formCode) {
      const { data: form } = await supabase
        .from('forms')
        .select('price_cents, purchasable')
        .or(`id.eq.${formId},form_code.eq.${formCode}`)
        .single();

      if (form && (form.price_cents === 0 || !form.purchasable)) {
        return new Response(JSON.stringify({ 
          access: true, 
          tier: 'free_form',
          reason: 'Form is free'
        } as AccessResponse), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // PAYWALL: Access denied
    console.log(`Access denied for user ${userId}: action=${action}, formId=${formId}`);
    
    return new Response(JSON.stringify({ 
      error: 'PAYMENT_REQUIRED',
      code: 'PAYWALL_LOCKED',
      message: 'Payment required to access this feature',
      access: false,
      upgrade_url: '/pricing'
    }), {
      status: 402,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Access check error:', error);
    return new Response(JSON.stringify({ 
      error: 'SERVER_ERROR',
      message: error instanceof Error ? error.message : 'Access check failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
