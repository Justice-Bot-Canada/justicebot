-- Add case_type to testimonials
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS case_type text;

-- Create tutorial_videos table
CREATE TABLE IF NOT EXISTS public.tutorial_videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  category text,
  duration_seconds integer,
  is_premium boolean DEFAULT false,
  view_count integer DEFAULT 0,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.tutorial_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tutorial videos are publicly viewable" ON public.tutorial_videos FOR SELECT USING (true);

-- Create programs table
CREATE TABLE IF NOT EXISTS public.programs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  organization text,
  logo_url text,
  primary_color text,
  secondary_color text,
  welcome_message text,
  disclaimer_text text,
  contact_email text,
  contact_phone text,
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active programs are publicly viewable" ON public.programs FOR SELECT USING (is_active = true);

-- Add triage column to cases
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS triage jsonb;

-- Add credit_amount to referrals
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS credit_amount integer;

-- Add uses_count and total_credits_earned to referral_codes (computed columns)
ALTER TABLE public.referral_codes ADD COLUMN IF NOT EXISTS uses_count integer DEFAULT 0;
ALTER TABLE public.referral_codes ADD COLUMN IF NOT EXISTS total_credits_earned integer DEFAULT 0;

-- Create check_free_tier_eligibility function
CREATE OR REPLACE FUNCTION public.check_free_tier_eligibility(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.entitlements e
    WHERE e.user_id = p_user_id
    AND (e.ends_at IS NULL OR e.ends_at > now())
  );
$$;

-- Create get_all_users_admin function for admin dashboard
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', u.id,
      'email', u.email,
      'created_at', u.created_at,
      'last_sign_in_at', u.last_sign_in_at
    )
  ) INTO result
  FROM auth.users u
  LIMIT 100;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;