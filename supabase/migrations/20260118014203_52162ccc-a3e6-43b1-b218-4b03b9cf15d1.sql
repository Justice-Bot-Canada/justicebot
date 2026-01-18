-- Fix the overly permissive audit log INSERT policy
-- Only allow inserts if user is inserting their own user_id or is admin
DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.security_audit_log;

CREATE POLICY "Users can insert their own audit logs"
ON public.security_audit_log FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() OR public.is_admin()
);