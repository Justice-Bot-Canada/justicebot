-- Fix remaining security issues (excluding views which already have security checks)

-- 1. Fix leads table - add deny anon read and restrict authenticated read to admins
DROP POLICY IF EXISTS "leads_owner_read" ON public.leads;

CREATE POLICY "leads_admin_read"
ON public.leads
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "deny_anon_read_leads"
ON public.leads
FOR SELECT
TO anon
USING (false);

-- 2. Add RLS policies to payment_audit table for inserts and anon denial
CREATE POLICY "payment_audit_insert_service"
ON public.payment_audit
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR is_admin());

CREATE POLICY "deny_anon_access_payment_audit"
ON public.payment_audit
FOR ALL
TO anon
USING (false);

-- 3. Restrict api_usage service write policy
DROP POLICY IF EXISTS "service can write" ON public.api_usage;

CREATE POLICY "api_usage_service_write"
ON public.api_usage
FOR INSERT
TO authenticated
WITH CHECK (is_admin() OR user_id = auth.uid());