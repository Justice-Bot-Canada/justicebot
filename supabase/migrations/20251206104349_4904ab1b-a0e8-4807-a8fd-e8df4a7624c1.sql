-- Fix user_has_role function to set search_path
CREATE OR REPLACE FUNCTION public.user_has_role(target_role text)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT (
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' -> 'roles') ? target_role
  );
$$;