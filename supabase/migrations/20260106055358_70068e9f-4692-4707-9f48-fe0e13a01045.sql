-- Programs table for government/agency pilots
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  organization TEXT,
  contact_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  disable_pricing BOOLEAN NOT NULL DEFAULT true,
  disable_ai_beyond_procedural BOOLEAN NOT NULL DEFAULT false,
  show_no_legal_advice_banner BOOLEAN NOT NULL DEFAULT true,
  cohort_batch TEXT,
  max_referrals INTEGER,
  referral_count INTEGER NOT NULL DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add program-related fields to cases table
ALTER TABLE public.cases 
  ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES public.programs(id),
  ADD COLUMN IF NOT EXISTS referral_source TEXT,
  ADD COLUMN IF NOT EXISTS cohort_batch TEXT,
  ADD COLUMN IF NOT EXISTS program_referral_code TEXT;

-- Enable RLS on programs table
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Programs are readable by authenticated users (for landing page validation)
CREATE POLICY "Programs are readable by authenticated users"
  ON public.programs
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Only admins can manage programs
CREATE POLICY "Admins can manage programs"
  ON public.programs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Allow anon users to read active programs (for landing pages)
CREATE POLICY "Active programs readable by anyone"
  ON public.programs
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Index for fast slug lookups
CREATE INDEX idx_programs_slug ON public.programs(slug);
CREATE INDEX idx_cases_program_id ON public.cases(program_id);

-- Trigger to update updated_at
CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment referral count
CREATE OR REPLACE FUNCTION public.increment_program_referral(p_program_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.programs 
  SET referral_count = referral_count + 1
  WHERE id = p_program_id;
END;
$$;

-- Function to get program stats (admin only)
CREATE OR REPLACE FUNCTION public.get_program_stats(p_program_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can view program stats';
  END IF;

  SELECT json_build_object(
    'total_cases', COUNT(*),
    'intake_started', COUNT(*) FILTER (WHERE flow_step = 'welcome' OR flow_step = 'triage'),
    'docs_ready', COUNT(*) FILTER (WHERE flow_step IN ('evidence', 'forms', 'timeline')),
    'completed', COUNT(*) FILTER (WHERE status = 'completed' OR flow_step = 'completed'),
    'avg_merit_score', ROUND(AVG(merit_score)),
    'triage_complete_count', COUNT(*) FILTER (WHERE triage_complete = true),
    'referral_sources', (
      SELECT json_agg(DISTINCT referral_source) 
      FROM public.cases 
      WHERE program_id = p_program_id AND referral_source IS NOT NULL
    ),
    'cohort_batches', (
      SELECT json_agg(DISTINCT cohort_batch) 
      FROM public.cases 
      WHERE program_id = p_program_id AND cohort_batch IS NOT NULL
    )
  ) INTO result
  FROM public.cases
  WHERE program_id = p_program_id;

  RETURN result;
END;
$$;

-- Function to export program summary (admin only)
CREATE OR REPLACE FUNCTION public.export_program_summary(p_program_id UUID)
RETURNS TABLE(
  total_referrals BIGINT,
  intake_started BIGINT,
  docs_ready BIGINT,
  completed BIGINT,
  completion_rate NUMERIC,
  doc_readiness_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_total BIGINT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can export program data';
  END IF;

  SELECT COUNT(*) INTO v_total FROM public.cases WHERE program_id = p_program_id;

  RETURN QUERY
  SELECT 
    v_total as total_referrals,
    COUNT(*) FILTER (WHERE c.flow_step IN ('welcome', 'triage')) as intake_started,
    COUNT(*) FILTER (WHERE c.flow_step IN ('evidence', 'forms', 'timeline')) as docs_ready,
    COUNT(*) FILTER (WHERE c.status = 'completed' OR c.flow_step = 'completed') as completed,
    CASE WHEN v_total > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE c.status = 'completed' OR c.flow_step = 'completed')::NUMERIC / v_total) * 100, 1)
      ELSE 0 
    END as completion_rate,
    CASE WHEN v_total > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE c.flow_step IN ('evidence', 'forms', 'timeline'))::NUMERIC / v_total) * 100, 1)
      ELSE 0 
    END as doc_readiness_rate
  FROM public.cases c
  WHERE c.program_id = p_program_id;
END;
$$;