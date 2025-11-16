-- Fix critical payments RLS policy that allows unauthorized modifications
-- Drop the dangerous "System can update payments" policy
DROP POLICY IF EXISTS "System can update payments" ON public.payments;

-- Only admins can update payments (for support/reconciliation)
CREATE POLICY "Admins can update all payments"
ON public.payments
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- Users can only view their own payments, not update them
-- Updates should only come from webhooks/edge functions using service role