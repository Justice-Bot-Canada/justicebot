-- Add remaining missing columns to testimonials
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS outcome text;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Add remaining columns to programs
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS max_referrals integer;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS referral_count integer DEFAULT 0;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Add is_paid to cases
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS is_paid boolean DEFAULT false;

-- Add case_id to entitlements (for per-case unlocks)
ALTER TABLE public.entitlements ADD COLUMN IF NOT EXISTS case_id uuid REFERENCES public.cases(id);

-- Add metrics column to analytics_events
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS metrics jsonb;

-- Create increment_program_referral function
CREATE OR REPLACE FUNCTION public.increment_program_referral(p_program_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.programs
  SET referral_count = COALESCE(referral_count, 0) + 1
  WHERE slug = p_program_slug;
END;
$$;