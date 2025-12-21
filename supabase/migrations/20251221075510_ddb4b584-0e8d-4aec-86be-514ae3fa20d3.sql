-- Fix the security_invoker setting on admins_public_meta view
-- This ensures the view respects the caller's permissions, not the definer's

DROP VIEW IF EXISTS public.admins_public_meta;

CREATE VIEW public.admins_public_meta 
WITH (security_invoker = true)
AS
SELECT user_id, granted_at, revoked_at
FROM public.admins
WHERE is_admin();

-- Restore permissions
REVOKE ALL ON public.admins_public_meta FROM anon;
GRANT SELECT ON public.admins_public_meta TO authenticated;

COMMENT ON VIEW public.admins_public_meta IS 'Admin metadata visible only to admins via is_admin() filter. Uses security_invoker for proper RLS enforcement.';