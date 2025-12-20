
-- Fix overly permissive payments_admin_all policy
-- Replace "USING condition: true" with proper is_admin() check

DROP POLICY IF EXISTS "payments_admin_all" ON public.payments;

-- Create proper admin policies with is_admin() check
CREATE POLICY "payments_admin_select"
ON public.payments
FOR SELECT
USING (is_admin());

CREATE POLICY "payments_admin_insert"
ON public.payments
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "payments_admin_update"
ON public.payments
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "payments_admin_delete"
ON public.payments
FOR DELETE
USING (is_admin());
