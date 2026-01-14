-- Add missing columns to payments table for proper tracking
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS case_id uuid REFERENCES public.cases(id),
ADD COLUMN IF NOT EXISTS product_id text,
ADD COLUMN IF NOT EXISTS entitlement_key text,
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text UNIQUE,
ADD COLUMN IF NOT EXISTS amount_cents integer,
ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- Add paid_at to cases table
ALTER TABLE public.cases 
ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_checkout_session ON public.payments(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_case ON public.payments(user_id, case_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_product ON public.entitlements(user_id, product_id);

-- Update RLS: Ensure payments/entitlements are read-only for users (webhook writes with service role)
-- Users can read their own payments
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT 
USING (auth.uid() = user_id);

-- Users can read their own entitlements (already exists in active_entitlements view but add base table policy)
DROP POLICY IF EXISTS "Users can read their own entitlements" ON public.entitlements;
CREATE POLICY "Users can read their own entitlements" 
ON public.entitlements FOR SELECT 
USING (auth.uid() = user_id);