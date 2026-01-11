-- Create entitlement audit log table
CREATE TABLE IF NOT EXISTS public.entitlement_audit (
  id BIGSERIAL PRIMARY KEY,
  acted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  acted_on UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('grant', 'revoke', 'extend')),
  product_id TEXT NOT NULL,
  ends_at TIMESTAMPTZ NULL,
  note TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.entitlement_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read entitlement audit"
ON public.entitlement_audit
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- No direct inserts from client - only via service role in edge function
CREATE POLICY "No direct inserts"
ON public.entitlement_audit
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_entitlement_audit_acted_on ON public.entitlement_audit(acted_on);
CREATE INDEX IF NOT EXISTS idx_entitlement_audit_created_at ON public.entitlement_audit(created_at DESC);