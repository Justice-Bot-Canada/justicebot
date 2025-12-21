-- Fix Security Issues for Views and Tables

-- 1. Fix admins_public_meta - Need to update the function first, then recreate the view
-- Drop the dependent function first
DROP FUNCTION IF EXISTS public.get_admins_public_meta();

-- Now we can drop and recreate the view with security
DROP VIEW IF EXISTS public.admins_public_meta;

-- Recreate with admin-only access filter
CREATE OR REPLACE VIEW public.admins_public_meta AS
SELECT user_id, granted_at, revoked_at
FROM public.admins
WHERE is_admin();

-- Recreate the function that depends on the view
CREATE OR REPLACE FUNCTION public.get_admins_public_meta()
RETURNS TABLE(user_id uuid, granted_at timestamp with time zone, revoked_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  PERFORM public.log_admins_access('read_public_meta', true, NULL);
  RETURN QUERY SELECT apm.user_id, apm.granted_at, apm.revoked_at FROM public.admins_public_meta apm;
END;
$$;

-- Revoke anon access to the view
REVOKE ALL ON public.admins_public_meta FROM anon;
GRANT SELECT ON public.admins_public_meta TO authenticated;

COMMENT ON VIEW public.admins_public_meta IS 'Admin metadata visible only to admins via is_admin() filter';

-- 2. Fix my_payments view - already has auth.uid() filter, just revoke anon access
REVOKE ALL ON public.my_payments FROM anon;
GRANT SELECT ON public.my_payments TO authenticated;

COMMENT ON VIEW public.my_payments IS 'User can only see their own payments due to auth.uid() filter';

-- 3. legal_pathways_monthly_analytics - already has is_admin() filter, revoke anon for extra safety
REVOKE ALL ON public.legal_pathways_monthly_analytics FROM anon;
GRANT SELECT ON public.legal_pathways_monthly_analytics TO authenticated;

COMMENT ON VIEW public.legal_pathways_monthly_analytics IS 'Business analytics - admin only via is_admin() filter';

-- 4. profiles_public view - intentionally public for display names, but should not expose all profiles
-- Revoke anon access - require authentication to look up public profile info
REVOKE ALL ON public.profiles_public FROM anon;
GRANT SELECT ON public.profiles_public TO authenticated;

-- 5. Also secure profiles_public_view if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'profiles_public_view') THEN
    EXECUTE 'REVOKE ALL ON public.profiles_public_view FROM anon';
    EXECUTE 'GRANT SELECT ON public.profiles_public_view TO authenticated';
  END IF;
END $$;

-- 6. legal_pathways_admin_view - should be admin only
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'legal_pathways_admin_view') THEN
    EXECUTE 'REVOKE ALL ON public.legal_pathways_admin_view FROM anon';
    EXECUTE 'GRANT SELECT ON public.legal_pathways_admin_view TO authenticated';
  END IF;
END $$;