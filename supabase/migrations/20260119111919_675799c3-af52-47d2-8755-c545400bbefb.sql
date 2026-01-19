-- =====================================================
-- JUSTICE-BOT ARCHITECTURE MIGRATION
-- DB-driven forms, merit scoring, sweep logs, access
-- =====================================================

-- 1. Add versioning columns to forms table
ALTER TABLE public.forms 
ADD COLUMN IF NOT EXISTS province text DEFAULT 'ON',
ADD COLUMN IF NOT EXISTS jurisdiction text,
ADD COLUMN IF NOT EXISTS version_date date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'pending')),
ADD COLUMN IF NOT EXISTS source_url text,
ADD COLUMN IF NOT EXISTS checksum text,
ADD COLUMN IF NOT EXISTS last_verified_at timestamptz DEFAULT now();

-- Update jurisdiction from tribunal_type for existing forms
UPDATE public.forms 
SET jurisdiction = CASE 
  WHEN tribunal_type ILIKE '%landlord%' OR tribunal_type = 'LTB' THEN 'LTB'
  WHEN tribunal_type ILIKE '%human rights%' OR tribunal_type = 'HRTO' THEN 'HRTO'
  WHEN tribunal_type ILIKE '%small claims%' THEN 'COURT'
  WHEN tribunal_type ILIKE '%family%' THEN 'COURT'
  ELSE 'COURT'
END
WHERE jurisdiction IS NULL;

-- Create index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_forms_province_jurisdiction ON public.forms(province, jurisdiction);
CREATE INDEX IF NOT EXISTS idx_forms_status ON public.forms(status);

-- 2. Create case_merit table for persistent merit scores
CREATE TABLE IF NOT EXISTS public.case_merit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  score_total integer NOT NULL CHECK (score_total >= 0 AND score_total <= 100),
  components jsonb NOT NULL DEFAULT '{"evidence": 0, "legal": 0, "timeline": 0, "pattern": 0, "risk": 0}'::jsonb,
  reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  strengths text[] DEFAULT '{}',
  weaknesses text[] DEFAULT '{}',
  gaps text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(case_id)
);

-- Enable RLS on case_merit
ALTER TABLE public.case_merit ENABLE ROW LEVEL SECURITY;

-- RLS policies for case_merit
CREATE POLICY "Users can view merit for their cases"
ON public.case_merit FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE cases.id = case_merit.case_id 
    AND cases.user_id = auth.uid()
  )
);

CREATE POLICY "admin full access case_merit"
ON public.case_merit FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Service role needs full access for edge functions
CREATE POLICY "service_role_case_merit"
ON public.case_merit FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3. Create sweep_runs table for form verification logging
CREATE TABLE IF NOT EXISTS public.sweep_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'fail')),
  forms_checked integer DEFAULT 0,
  forms_changed integer DEFAULT 0,
  forms_deprecated integer DEFAULT 0,
  errors jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on sweep_runs
ALTER TABLE public.sweep_runs ENABLE ROW LEVEL SECURITY;

-- Only admins can view sweep runs
CREATE POLICY "admin_view_sweep_runs"
ON public.sweep_runs FOR SELECT
USING (is_admin());

CREATE POLICY "service_role_sweep_runs"
ON public.sweep_runs FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4. Create user_access table for paywall state
CREATE TABLE IF NOT EXISTS public.user_access (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'one_time', 'monthly', 'yearly', 'low_income', 'program')),
  access_unlocked boolean NOT NULL DEFAULT false,
  access_expires_at timestamptz,
  purchased_form_ids text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on user_access
ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;

-- Users can read their own access
CREATE POLICY "Users can view own access"
ON public.user_access FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "admin full access user_access"
ON public.user_access FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "service_role_user_access"
ON public.user_access FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 5. Create pathway_rules table if not exists (for deterministic routing)
CREATE TABLE IF NOT EXISTS public.pathway_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name text NOT NULL,
  province text,
  category text NOT NULL,
  tribunal text NOT NULL,
  pathway_id text NOT NULL,
  issue_keywords text[] NOT NULL DEFAULT '{}',
  recommended_forms text[] DEFAULT '{}',
  amount_min numeric,
  amount_max numeric,
  priority integer DEFAULT 100,
  timeframe text,
  filing_fee text,
  success_rate integer,
  reasoning text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on pathway_rules
ALTER TABLE public.pathway_rules ENABLE ROW LEVEL SECURITY;

-- Pathway rules are public read
CREATE POLICY "pathway_rules_public_read"
ON public.pathway_rules FOR SELECT
USING (true);

CREATE POLICY "admin full access pathway_rules"
ON public.pathway_rules FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 6. Create funnel_events table for analytics tracking
CREATE TABLE IF NOT EXISTS public.funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_funnel_events_type ON public.funnel_events(event_type);
CREATE INDEX IF NOT EXISTS idx_funnel_events_created ON public.funnel_events(created_at);
CREATE INDEX IF NOT EXISTS idx_funnel_events_user ON public.funnel_events(user_id);

-- Enable RLS on funnel_events
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

-- Allow inserts for logged-in users
CREATE POLICY "Users can insert own funnel events"
ON public.funnel_events FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "admin_view_funnel_events"
ON public.funnel_events FOR SELECT
USING (is_admin());

CREATE POLICY "service_role_funnel_events"
ON public.funnel_events FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 7. Create trigger to update case_merit.updated_at
CREATE OR REPLACE FUNCTION update_case_merit_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS case_merit_updated_at ON public.case_merit;
CREATE TRIGGER case_merit_updated_at
  BEFORE UPDATE ON public.case_merit
  FOR EACH ROW EXECUTE FUNCTION update_case_merit_timestamp();

-- 8. Create trigger to update user_access.updated_at
DROP TRIGGER IF EXISTS user_access_updated_at ON public.user_access;
CREATE TRIGGER user_access_updated_at
  BEFORE UPDATE ON public.user_access
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();