-- Fix critical security issues in payments table RLS

-- Drop the dangerous policy that allows any authenticated user to update any payment
DROP POLICY IF EXISTS "System can update payments" ON public.payments;

-- Payments should only be updated by service role (webhooks, edge functions)
-- Service role bypasses RLS automatically, so no policy needed for normal updates

-- Add policy for admins to update payments for troubleshooting
CREATE POLICY "Admins can update payments"
ON public.payments
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Add audit logging comment
COMMENT ON TABLE public.payments IS 'Payment updates should only occur via service role (webhooks) or admin users. Regular users cannot modify payment records.';