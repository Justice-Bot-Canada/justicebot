-- Fix 1: Restrict profiles table to only allow users to see their own profile
-- Drop overly permissive policies if they exist
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are publicly viewable" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;

-- Create proper RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());

-- Fix 2: Tighten analytics_events to prevent reading other users' anonymous events
DROP POLICY IF EXISTS "analytics_select_own_or_admin" ON public.analytics_events;

CREATE POLICY "analytics_select_own_only"
ON public.analytics_events
FOR SELECT
USING (
  public.is_admin() 
  OR (user_id IS NOT NULL AND user_id = auth.uid())
);

-- Fix 3: Restrict admins_public_meta view to admins only
-- First drop any existing permissive policies
DROP POLICY IF EXISTS "admins_public_meta_public_read" ON public.admins_public_meta;

-- Since admins_public_meta is a VIEW, we need to handle it differently
-- Views inherit from base table policies, but we can add RLS if it's a security barrier view
-- The safest approach is to restrict access via a function or by modifying the view

-- Create a secure function to get admin meta (admin-only)
CREATE OR REPLACE FUNCTION public.get_admins_meta_secure()
RETURNS TABLE(user_id uuid, granted_at timestamp with time zone, revoked_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied - admin only';
  END IF;
  
  RETURN QUERY SELECT apm.user_id, apm.granted_at, apm.revoked_at 
  FROM public.admins_public_meta apm;
END;
$$;

-- Drop the public view and recreate as admin-only
DROP VIEW IF EXISTS public.admins_public_meta;

CREATE VIEW public.admins_public_meta 
WITH (security_invoker = true)
AS
SELECT 
  user_id,
  granted_at,
  revoked_at
FROM public.admins
WHERE public.is_admin();