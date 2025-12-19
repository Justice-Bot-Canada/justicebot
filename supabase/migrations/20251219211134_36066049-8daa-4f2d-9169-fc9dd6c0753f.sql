-- Fix profiles_public* views so they cannot expose PII and cannot be modified by anon/authenticated.
-- Previous migration attempt failed because CREATE OR REPLACE cannot remove columns from an existing view.

-- Drop and recreate views with a safe column set
DROP VIEW IF EXISTS public.profiles_public_view;
DROP VIEW IF EXISTS public.profiles_public;

-- 1) Public-safe view: only non-sensitive fields
CREATE VIEW public.profiles_public
AS
  SELECT
    p.id,
    p.display_name,
    p.avatar_url
  FROM public.profiles p;

ALTER VIEW public.profiles_public SET (security_barrier = true);

REVOKE ALL ON public.profiles_public FROM anon;
REVOKE ALL ON public.profiles_public FROM authenticated;
GRANT SELECT ON public.profiles_public TO anon;
GRANT SELECT ON public.profiles_public TO authenticated;

-- 2) Owner-scoped view: only your own profile fields (still non-sensitive)
CREATE VIEW public.profiles_public_view
AS
  SELECT
    p.user_id,
    p.display_name,
    p.avatar_url
  FROM public.profiles p
  WHERE p.user_id = (SELECT auth.uid());

ALTER VIEW public.profiles_public_view SET (security_barrier = true);

REVOKE ALL ON public.profiles_public_view FROM anon;
REVOKE ALL ON public.profiles_public_view FROM authenticated;
GRANT SELECT ON public.profiles_public_view TO authenticated;

-- Underlying public.profiles table RLS still applies to any row access.