-- Force RLS to prevent any bypass
ALTER TABLE public.admins FORCE ROW LEVEL SECURITY;

-- Add explicit deny policy for anonymous users as defense in depth
CREATE POLICY "deny_anon_access_admins"
ON public.admins
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);