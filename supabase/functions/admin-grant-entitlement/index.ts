import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { logAuditEvent } from "../_shared/auditLog.ts";

const logStep = (step: string, details?: unknown) => {
  console.log(`[ADMIN-GRANT-ENTITLEMENT] ${step}`, details ? JSON.stringify(details) : "");
};

serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting admin entitlement grant");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Create client with user's auth to verify they're an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the requesting user
    const { data: { user: adminUser }, error: authError } = await userClient.auth.getUser();
    if (authError || !adminUser) {
      throw new Error("Unauthorized: Invalid session");
    }
    logStep("Admin user authenticated", { adminId: adminUser.id });

    // Verify admin role using RPC
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
      _user_id: adminUser.id,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      throw new Error("Unauthorized: Admin role required");
    }
    logStep("Admin role verified");

    // Parse request body
    const { email, product_id, ends_at, note, action = 'grant' } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }
    if (!product_id) {
      throw new Error("Product ID is required");
    }
    if (!['grant', 'revoke', 'extend'].includes(action)) {
      throw new Error("Invalid action");
    }

    logStep("Request parsed", { email, product_id, action });

    // Look up user by email using admin API
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      throw new Error("Failed to lookup users: " + userError.message);
    }

    const targetUser = userData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: "User not found for email: " + email }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetUserId = targetUser.id;
    logStep("Target user found", { targetUserId });

    // Calculate ends_at for different plans
    let calculatedEndsAt: string | null = ends_at || null;
    if (!calculatedEndsAt && action === 'grant') {
      const now = new Date();
      if (product_id.includes('yearly') || product_id.includes('annual')) {
        now.setFullYear(now.getFullYear() + 1);
        calculatedEndsAt = now.toISOString();
      } else if (product_id.includes('monthly')) {
        now.setMonth(now.getMonth() + 1);
        calculatedEndsAt = now.toISOString();
      } else if (product_id.includes('low_income') || product_id.includes('low-income')) {
        now.setMonth(now.getMonth() + 1);
        calculatedEndsAt = now.toISOString();
      }
      // lifetime/one-time have no ends_at
    }

    if (action === 'revoke') {
      // Delete entitlement
      const { error: deleteError } = await supabaseAdmin
        .from('entitlements')
        .delete()
        .eq('user_id', targetUserId)
        .eq('product_id', product_id);

      if (deleteError) {
        throw new Error("Failed to revoke entitlement: " + deleteError.message);
      }
      logStep("Entitlement revoked");
    } else {
      // Grant or extend entitlement
      const { error: upsertError } = await supabaseAdmin
        .from('entitlements')
        .upsert({
          user_id: targetUserId,
          product_id: product_id,
          access_level: 'premium',
          source: 'admin',
          starts_at: new Date().toISOString(),
          ends_at: calculatedEndsAt,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,product_id'
        });

      if (upsertError) {
        throw new Error("Failed to grant entitlement: " + upsertError.message);
      }
      logStep("Entitlement granted/extended");
    }

    // Write audit log (entitlement_audit table)
    const { error: auditError } = await supabaseAdmin
      .from('entitlement_audit')
      .insert({
        acted_by: adminUser.id,
        acted_on: targetUserId,
        action: action,
        product_id: product_id,
        ends_at: calculatedEndsAt,
        note: note || null,
      });

    if (auditError) {
      console.error("Failed to write audit log:", auditError);
      // Don't fail the request for audit errors
    }
    logStep("Audit log written");

    // SOC2 Security Audit Log
    await logAuditEvent(supabaseAdmin, {
      action: action === 'revoke' ? 'admin.revoke_access' : 'admin.grant_access',
      resource_type: 'entitlement',
      resource_id: product_id,
      user_id: adminUser.id,
      metadata: {
        target_user_id: targetUserId,
        target_email: targetUser.email,
        product_id,
        ends_at: calculatedEndsAt,
        note,
      }
    }, req);

    return new Response(
      JSON.stringify({
        success: true,
        action,
        user_id: targetUserId,
        email: targetUser.email,
        product_id,
        ends_at: calculatedEndsAt,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    logStep("Error", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
