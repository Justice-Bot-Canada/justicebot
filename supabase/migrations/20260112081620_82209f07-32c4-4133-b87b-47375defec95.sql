-- Remove the overly permissive policy and keep only the user-scoped one
DROP POLICY IF EXISTS "Authenticated users can view basic profile info" ON public.profiles;