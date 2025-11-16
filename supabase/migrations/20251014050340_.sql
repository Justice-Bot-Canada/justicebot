-- Create user_agreements table to track legal agreements for Canadian compliance
CREATE TABLE IF NOT EXISTS public.user_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agreed_to_terms BOOLEAN NOT NULL DEFAULT false,
  agreed_to_privacy BOOLEAN NOT NULL DEFAULT false,
  agreed_to_disclaimer BOOLEAN NOT NULL DEFAULT false,
  agreed_to_liability BOOLEAN NOT NULL DEFAULT false,
  agreement_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_agreements
ALTER TABLE public.user_agreements ENABLE ROW LEVEL SECURITY;

-- Users can only view their own agreements
CREATE POLICY "Users can view their own agreements"
ON public.user_agreements
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all agreements for compliance audits
CREATE POLICY "Admins can view all agreements"
ON public.user_agreements
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert agreements during signup
CREATE POLICY "System can insert agreements"
ON public.user_agreements
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_agreements_user_id ON public.user_agreements(user_id);

-- Add trigger to automatically create agreement record when user signs up
CREATE OR REPLACE FUNCTION public.handle_user_agreement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_agreements (
    user_id,
    agreed_to_terms,
    agreed_to_privacy,
    agreed_to_disclaimer,
    agreed_to_liability,
    agreement_date
  )
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'agreed_to_terms')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'agreed_to_privacy')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'agreed_to_disclaimer')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'agreed_to_liability')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'agreement_date')::timestamp with time zone, now())
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_agreement ON auth.users;
CREATE TRIGGER on_auth_user_agreement
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_agreement();;
