-- Fix is_admin() function to use SECURITY DEFINER to prevent infinite recursion
-- The current issue: is_admin() queries app_admins, but app_admins has RLS that calls is_admin()

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_admins a
    WHERE a.user_id = auth.uid()
  );
$$;