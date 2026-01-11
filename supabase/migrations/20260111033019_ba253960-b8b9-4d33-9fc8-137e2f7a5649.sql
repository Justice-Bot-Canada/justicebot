-- =============================================
-- FIX 1: Add missing columns to 'cases' table
-- =============================================
ALTER TABLE public.cases 
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES public.programs(id),
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS cohort_batch TEXT,
ADD COLUMN IF NOT EXISTS program_referral_code TEXT;

-- =============================================
-- FIX 2: Add missing columns to 'programs' table
-- =============================================
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS disable_pricing BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS disable_ai_beyond_procedural BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_no_legal_advice_banner BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS cohort_batch TEXT,
ADD COLUMN IF NOT EXISTS max_referrals INTEGER,
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS primary_color TEXT,
ADD COLUMN IF NOT EXISTS secondary_color TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- =============================================
-- FIX 3: Add missing columns to 'testimonials' table
-- =============================================
ALTER TABLE public.testimonials 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- =============================================
-- FIX 4: Add missing columns to 'timeline_events' table
-- =============================================
ALTER TABLE public.timeline_events 
ADD COLUMN IF NOT EXISTS event_time TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS importance TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS notes TEXT;

-- =============================================
-- FIX 5: Add missing columns to 'entitlements' table
-- =============================================
ALTER TABLE public.entitlements 
ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES public.cases(id);

-- =============================================
-- FIX 6: Create evidence_links table if not exists
-- =============================================
CREATE TABLE IF NOT EXISTS public.evidence_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evidence_id UUID NOT NULL REFERENCES public.evidence(id) ON DELETE CASCADE,
  form_id TEXT NOT NULL,
  section_key TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.evidence_links ENABLE ROW LEVEL SECURITY;

-- RLS policies for evidence_links
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'evidence_links' AND policyname = 'Users can view their own evidence links') THEN
    CREATE POLICY "Users can view their own evidence links" 
      ON public.evidence_links FOR SELECT 
      USING (
        EXISTS (
          SELECT 1 FROM public.evidence e 
          JOIN public.cases c ON c.id = e.case_id 
          WHERE e.id = evidence_links.evidence_id AND c.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- =============================================
-- FIX 7: Add missing columns to 'evidence_metadata' table
-- =============================================
ALTER TABLE public.evidence_metadata 
ADD COLUMN IF NOT EXISTS doc_type TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS parties JSONB,
ADD COLUMN IF NOT EXISTS dates JSONB,
ADD COLUMN IF NOT EXISTS extracted_text TEXT,
ADD COLUMN IF NOT EXISTS confidence_score NUMERIC,
ADD COLUMN IF NOT EXISTS flags JSONB;

-- =============================================
-- FIX 8: Create increment_program_referral function
-- =============================================
CREATE OR REPLACE FUNCTION public.increment_program_referral(p_program_slug TEXT)
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

-- =============================================
-- FIX 9: Update get_program_stats to accept program_slug (not p_program_id)
-- =============================================
DROP FUNCTION IF EXISTS public.get_program_stats(text);
CREATE OR REPLACE FUNCTION public.get_program_stats(program_slug text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  program_record RECORD;
BEGIN
  -- Get program by slug
  SELECT id INTO program_record FROM public.programs WHERE slug = program_slug;
  
  IF program_record IS NULL THEN
    RETURN jsonb_build_object('error', 'Program not found');
  END IF;

  SELECT jsonb_build_object(
    'total_cases', COALESCE((SELECT COUNT(*) FROM public.cases WHERE program_id = program_record.id), 0),
    'intake_started', COALESCE((SELECT COUNT(*) FROM public.cases WHERE program_id = program_record.id AND flow_step IS NOT NULL), 0),
    'docs_ready', COALESCE((SELECT COUNT(*) FROM public.cases WHERE program_id = program_record.id AND status = 'documents_ready'), 0),
    'completed', COALESCE((SELECT COUNT(*) FROM public.cases WHERE program_id = program_record.id AND status = 'completed'), 0),
    'avg_merit_score', (SELECT AVG(merit_score) FROM public.cases WHERE program_id = program_record.id AND merit_score IS NOT NULL),
    'triage_complete_count', COALESCE((SELECT COUNT(*) FROM public.cases WHERE program_id = program_record.id AND triage_complete = true), 0),
    'referral_sources', (SELECT array_agg(DISTINCT referral_source) FROM public.cases WHERE program_id = program_record.id AND referral_source IS NOT NULL),
    'cohort_batches', (SELECT array_agg(DISTINCT cohort_batch) FROM public.cases WHERE program_id = program_record.id AND cohort_batch IS NOT NULL)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- =============================================
-- FIX 10: Update export_program_summary to use program_id (not p_program_id)
-- =============================================
DROP FUNCTION IF EXISTS public.export_program_summary(uuid);
CREATE OR REPLACE FUNCTION public.export_program_summary(program_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_referrals', COALESCE((SELECT COUNT(*) FROM public.cases WHERE cases.program_id = export_program_summary.program_id), 0),
    'intake_started', COALESCE((SELECT COUNT(*) FROM public.cases WHERE cases.program_id = export_program_summary.program_id AND flow_step IS NOT NULL), 0),
    'docs_ready', COALESCE((SELECT COUNT(*) FROM public.cases WHERE cases.program_id = export_program_summary.program_id AND status = 'documents_ready'), 0),
    'completed', COALESCE((SELECT COUNT(*) FROM public.cases WHERE cases.program_id = export_program_summary.program_id AND status = 'completed'), 0),
    'completion_rate', CASE 
      WHEN (SELECT COUNT(*) FROM public.cases WHERE cases.program_id = export_program_summary.program_id) > 0 
      THEN ROUND((SELECT COUNT(*) FROM public.cases WHERE cases.program_id = export_program_summary.program_id AND status = 'completed')::numeric / 
           (SELECT COUNT(*) FROM public.cases WHERE cases.program_id = export_program_summary.program_id) * 100, 1)
      ELSE 0 
    END,
    'doc_readiness_rate', CASE 
      WHEN (SELECT COUNT(*) FROM public.cases WHERE cases.program_id = export_program_summary.program_id) > 0 
      THEN ROUND((SELECT COUNT(*) FROM public.cases WHERE cases.program_id = export_program_summary.program_id AND status = 'documents_ready')::numeric / 
           (SELECT COUNT(*) FROM public.cases WHERE cases.program_id = export_program_summary.program_id) * 100, 1)
      ELSE 0 
    END
  ) INTO result;
  
  RETURN result;
END;
$$;