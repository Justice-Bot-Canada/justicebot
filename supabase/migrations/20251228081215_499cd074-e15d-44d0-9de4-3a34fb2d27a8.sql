-- Ensure profiles table has complete RLS protection

-- Drop any potentially misconfigured policies and recreate clean ones
DROP POLICY IF EXISTS "deny_anon_profiles" ON public.profiles;
DROP POLICY IF EXISTS "deny_anon_access_profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_users_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_users_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_users_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_users_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- RESTRICTIVE policy: Block ALL anonymous access (applies to all commands)
CREATE POLICY "deny_all_anon_access"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Authenticated users can only SELECT their own profile
CREATE POLICY "users_select_own_profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Authenticated users can only INSERT their own profile
CREATE POLICY "users_insert_own_profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Authenticated users can only UPDATE their own profile
CREATE POLICY "users_update_own_profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Authenticated users can only DELETE their own profile
CREATE POLICY "users_delete_own_profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "admins_select_all_profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_admin());