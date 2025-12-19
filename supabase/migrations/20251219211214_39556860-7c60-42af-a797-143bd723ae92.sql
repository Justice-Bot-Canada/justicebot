-- Fix linter: avoid SECURITY DEFINER views by forcing SECURITY INVOKER behavior
-- (Supabase linter 0010_security_definer_view)

ALTER VIEW public.profiles_public SET (security_invoker = true);
ALTER VIEW public.profiles_public_view SET (security_invoker = true);

-- Keep security barrier enabled
ALTER VIEW public.profiles_public SET (security_barrier = true);
ALTER VIEW public.profiles_public_view SET (security_barrier = true);