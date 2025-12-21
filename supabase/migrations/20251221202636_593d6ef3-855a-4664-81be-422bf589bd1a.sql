
-- =====================================================
-- SECURITY FIX: Tighten RLS policies for sensitive tables
-- =====================================================

-- 1. FIX PAYMENTS TABLE - Change admin policies from 'public' to 'authenticated' role only
-- Drop the overly permissive policies that apply to 'public' role
DROP POLICY IF EXISTS "payments_admin_delete" ON public.payments;
DROP POLICY IF EXISTS "payments_admin_insert" ON public.payments;
DROP POLICY IF EXISTS "payments_admin_select" ON public.payments;
DROP POLICY IF EXISTS "payments_admin_update" ON public.payments;

-- Recreate admin policies scoped to 'authenticated' role only
CREATE POLICY "payments_admin_select_auth"
  ON public.payments FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "payments_admin_insert_auth"
  ON public.payments FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "payments_admin_update_auth"
  ON public.payments FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "payments_admin_delete_auth"
  ON public.payments FOR DELETE TO authenticated
  USING (is_admin());

-- Add explicit deny for anonymous users on payments
CREATE POLICY "deny_anon_access_payments"
  ON public.payments AS RESTRICTIVE FOR ALL TO anon
  USING (false);

-- 2. FIX PROFILES TABLE - Add admin access for legitimate admin operations
-- Admin should be able to view profiles for user management
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT TO authenticated
  USING (is_admin());

-- 3. FIX ANALYTICS_EVENTS TABLE - Ensure users can ONLY see their own data
-- Drop duplicate/overlapping select policies
DROP POLICY IF EXISTS "analytics_select_self_or_admin" ON public.analytics_events;
DROP POLICY IF EXISTS "p_analytics_events_select" ON public.analytics_events;

-- Create a single clear policy: users see only their own, admins see all
CREATE POLICY "analytics_select_own_or_admin"
  ON public.analytics_events FOR SELECT TO authenticated
  USING (
    is_admin() OR (user_id IS NOT NULL AND user_id = auth.uid())
  );

-- Ensure anonymous users cannot read analytics data
CREATE POLICY "deny_anon_read_analytics"
  ON public.analytics_events AS RESTRICTIVE FOR SELECT TO anon
  USING (false);
