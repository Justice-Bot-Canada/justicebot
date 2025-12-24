-- =============================================
-- SECURITY FIX: Complete RLS fixes (part 2)
-- =============================================

-- 1. Add deny policy for anon on profiles (drop first if exists)
DROP POLICY IF EXISTS "deny_anon_profiles" ON public.profiles;
CREATE POLICY "deny_anon_profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- 2. Ensure user_roles table is properly secured
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_modify" ON public.user_roles;
DROP POLICY IF EXISTS "deny_anon_user_roles" ON public.user_roles;

-- Deny anonymous access to roles
CREATE POLICY "deny_anon_user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- Users can only view their own roles
CREATE POLICY "user_roles_select_own"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only admins can modify roles
CREATE POLICY "user_roles_admin_modify"
ON public.user_roles
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());