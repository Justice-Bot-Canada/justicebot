-- Create table to track referral outreach emails (PIPEDA-compliant)
CREATE TABLE public.referral_outreach_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT NOT NULL,
  contact_name TEXT,
  email_hash TEXT NOT NULL, -- Hashed for privacy
  organization_type TEXT DEFAULT 'unknown',
  notes TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referral_outreach_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view outreach logs
CREATE POLICY "Admins can view referral outreach logs"
ON public.referral_outreach_log
FOR SELECT
USING (public.is_admin());

-- Service role can insert (edge function uses service key)
CREATE POLICY "Service role can insert outreach logs"
ON public.referral_outreach_log
FOR INSERT
WITH CHECK (true);

-- Add index for analytics
CREATE INDEX idx_referral_outreach_org_type ON public.referral_outreach_log(organization_type);
CREATE INDEX idx_referral_outreach_sent_at ON public.referral_outreach_log(sent_at);