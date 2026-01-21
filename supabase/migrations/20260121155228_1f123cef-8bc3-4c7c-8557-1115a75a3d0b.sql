-- =====================================================
-- Security Hardening Migration (Fixed)
-- Fixes: active_entitlements RLS, user_feedback policies,
-- legal_pathways protection, storage signed URLs
-- =====================================================

-- 1. Fix active_entitlements view - recreate with security_invoker
-- This ensures the view respects RLS on underlying entitlements table
DROP VIEW IF EXISTS public.active_entitlements;

CREATE VIEW public.active_entitlements 
WITH (security_invoker = true) AS
SELECT 
  user_id,
  product_id,
  access_level,
  source,
  starts_at,
  ends_at,
  ((ends_at IS NULL) OR (ends_at > now())) AS is_active
FROM public.entitlements
WHERE user_id = auth.uid() OR is_admin();

-- 2. Fix user_feedback policies - prevent anonymous enumeration
-- Drop the overly permissive policy that allows NULL user_id
DROP POLICY IF EXISTS "Users can create feedback" ON public.user_feedback;

-- Require authentication for feedback OR enforce service_role for anonymous submissions
-- Anonymous feedback can only come through submit-feedback edge function with Turnstile
CREATE POLICY "Authenticated users can create feedback" ON public.user_feedback
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Admin can view all feedback for review
DROP POLICY IF EXISTS "admin full access" ON public.user_feedback;
CREATE POLICY "admin full access" ON public.user_feedback
FOR ALL USING (is_admin())
WITH CHECK (is_admin());

-- 3. Tighten legal_pathways - add TO authenticated to make it explicit
DROP POLICY IF EXISTS "Users can create pathways" ON public.legal_pathways;
CREATE POLICY "Users can create pathways" ON public.legal_pathways
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Also restrict the System policy if it exists
DROP POLICY IF EXISTS "System can create pathways" ON public.legal_pathways;

-- 4. Fix security_audit_log - restrict insert to service role only
DROP POLICY IF EXISTS "Users can insert their own audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.security_audit_log;

-- Only service role should insert audit logs (edge functions use service role)
CREATE POLICY "Service role can insert audit logs" ON public.security_audit_log
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- 5. Create rate_limits table for application-level rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_updated ON public.rate_limits(updated_at);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can access rate limits
CREATE POLICY "Service role manages rate limits" ON public.rate_limits
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 6. Create cleanup function for old rate limit entries (run daily)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE updated_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Grant execute to service role
GRANT EXECUTE ON FUNCTION public.cleanup_old_rate_limits() TO service_role;