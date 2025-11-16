-- Fix my_payments view security issue
-- The view currently selects from payments table but doesn't use security_invoker
-- This means it might bypass RLS in some contexts

-- Drop and recreate my_payments view with security_invoker
DROP VIEW IF EXISTS public.my_payments;

CREATE VIEW public.my_payments
WITH (security_invoker = on)
AS
SELECT 
  id,
  user_id,
  form_id,
  case_id,
  amount_cents,
  currency,
  status,
  provider,
  provider_order_id,
  created_at,
  updated_at,
  captured_at
FROM public.payments;

-- Grant appropriate permissions
GRANT SELECT ON public.my_payments TO authenticated;

-- Note: payments_public already uses a SECURITY DEFINER function payments_public_rows()
-- which properly filters by auth.uid(), so it's already secure;
