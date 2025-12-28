-- Pathway routing rules table
CREATE TABLE public.pathway_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Matching conditions (all must match if specified)
  issue_keywords TEXT[] NOT NULL DEFAULT '{}',
  province TEXT,  -- NULL = any province
  category TEXT,  -- housing, employment, discrimination, money, family, criminal
  amount_min INTEGER,  -- for money disputes
  amount_max INTEGER,
  
  -- Output routing
  tribunal TEXT NOT NULL,  -- LTB, HRTO, SMALL_CLAIMS, FAMILY, SUPERIOR, LABOUR, CAS, CRIMINAL
  pathway_id TEXT NOT NULL,  -- ltb-journey, hrto-journey, etc.
  
  -- Recommended forms (array of form codes)
  recommended_forms TEXT[] NOT NULL DEFAULT '{}',
  
  -- Metadata
  timeframe TEXT,  -- "2-6 months"
  filing_fee TEXT,  -- "$53" or "Free"
  success_rate INTEGER,  -- 0-100
  
  -- Reasoning for transparency
  reasoning TEXT NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient matching
CREATE INDEX idx_pathway_rules_category ON public.pathway_rules(category) WHERE is_active = true;
CREATE INDEX idx_pathway_rules_province ON public.pathway_rules(province) WHERE is_active = true;
CREATE INDEX idx_pathway_rules_keywords ON public.pathway_rules USING GIN(issue_keywords);

-- RLS: public read, admin write
ALTER TABLE public.pathway_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pathway_rules_public_read" ON public.pathway_rules
  FOR SELECT USING (true);

CREATE POLICY "pathway_rules_admin_write" ON public.pathway_rules
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Pathway routing results (store user routing decisions)
CREATE TABLE public.pathway_routing_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  
  -- Input facts
  facts JSONB NOT NULL,  -- { description, category, province, amount, keywords }
  
  -- Matched rules and scores
  matched_rules JSONB NOT NULL,  -- [{ rule_id, score, reasoning }]
  
  -- Final recommendation
  recommended_tribunal TEXT NOT NULL,
  recommended_pathway TEXT NOT NULL,
  recommended_forms TEXT[] NOT NULL DEFAULT '{}',
  confidence_score INTEGER NOT NULL,  -- 0-100
  reasoning TEXT[] NOT NULL DEFAULT '{}',
  
  -- Alternatives
  alternative_pathways JSONB,  -- [{ tribunal, pathway, confidence, reasoning }]
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for user lookups
CREATE INDEX idx_routing_results_user ON public.pathway_routing_results(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_routing_results_case ON public.pathway_routing_results(case_id) WHERE case_id IS NOT NULL;

-- RLS: own rows only
ALTER TABLE public.pathway_routing_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "routing_results_own_rows" ON public.pathway_routing_results
  FOR ALL USING (user_id = auth.uid() OR is_admin())
  WITH CHECK (user_id = auth.uid() OR is_admin());

CREATE POLICY "routing_results_anon_insert" ON public.pathway_routing_results
  FOR INSERT WITH CHECK (user_id IS NULL);

-- Seed initial pathway rules for Ontario
INSERT INTO public.pathway_rules (rule_name, priority, category, issue_keywords, province, tribunal, pathway_id, recommended_forms, timeframe, filing_fee, success_rate, reasoning)
VALUES
  -- LTB Rules
  ('LTB Eviction Notice', 10, 'housing', ARRAY['eviction', 'N4', 'N5', 'N12', 'N13', 'notice to end'], 'ON', 'LTB', 'ltb-journey', ARRAY['T2', 'T6'], '2-4 months', '$53', 65, 'Landlord-tenant disputes in Ontario are handled by the Landlord and Tenant Board'),
  ('LTB Maintenance Issues', 10, 'housing', ARRAY['repair', 'maintenance', 'mold', 'heat', 'water', 'pest', 'cockroach', 'bedbug', 'broken'], 'ON', 'LTB', 'ltb-journey', ARRAY['T6'], '2-4 months', '$53', 72, 'Maintenance issues are addressed through T6 application for rent abatement'),
  ('LTB Harassment', 10, 'housing', ARRAY['harassment', 'threaten', 'intimidate', 'entry', 'privacy', 'landlord entering'], 'ON', 'LTB', 'ltb-journey', ARRAY['T2'], '2-4 months', '$53', 68, 'Tenant harassment is addressed through T2 application'),
  ('LTB Rent Increase', 10, 'housing', ARRAY['rent increase', 'above guideline', 'AGI', 'illegal rent'], 'ON', 'LTB', 'ltb-journey', ARRAY['T1'], '2-3 months', '$53', 75, 'Rent disputes are handled by the LTB'),
  
  -- HRTO Rules
  ('HRTO Employment Discrimination', 10, 'discrimination', ARRAY['fired', 'terminated', 'job', 'workplace', 'employer', 'disability accommodation'], 'ON', 'HRTO', 'hrto-journey', ARRAY['Form 1'], '8-18 months', 'Free', 55, 'Employment discrimination claims go to Human Rights Tribunal of Ontario'),
  ('HRTO Housing Discrimination', 10, 'housing', ARRAY['discrimination', 'race', 'disability', 'family status', 'refused rental', 'evict because'], 'ON', 'HRTO', 'hrto-journey', ARRAY['Form 1'], '8-18 months', 'Free', 52, 'Discrimination in housing is handled by HRTO, not LTB'),
  ('HRTO Service Discrimination', 10, 'discrimination', ARRAY['denied service', 'refused service', 'store', 'restaurant', 'hospital', 'accessibility'], 'ON', 'HRTO', 'hrto-journey', ARRAY['Form 1'], '8-18 months', 'Free', 50, 'Discrimination in services is handled by HRTO'),
  
  -- Small Claims
  ('Small Claims Under 35k', 10, 'money', ARRAY['owe', 'debt', 'money', 'contract', 'damage', 'refund', 'deposit'], 'ON', 'SMALL_CLAIMS', 'small-claims-journey', ARRAY['Plaintiffs Claim'], '3-6 months', '$102-$273', 60, 'Claims under $35,000 go to Small Claims Court'),
  
  -- Superior Court
  ('Superior Court Over 35k', 10, 'money', ARRAY['owe', 'debt', 'money', 'contract', 'damage'], 'ON', 'SUPERIOR', 'superior-court-journey', ARRAY['Statement of Claim'], '12-24 months', '$229+', 55, 'Claims over $35,000 go to Superior Court of Justice'),
  
  -- Family
  ('Family Custody Access', 10, 'family', ARRAY['custody', 'access', 'visitation', 'child', 'children', 'parenting'], 'ON', 'FAMILY', 'family-journey', ARRAY['Form 8'], '6-18 months', '$202', 50, 'Custody and access disputes go to Family Court'),
  ('Family Support', 10, 'family', ARRAY['support', 'child support', 'spousal support', 'alimony'], 'ON', 'FAMILY', 'family-journey', ARRAY['Form 8'], '4-12 months', '$202', 65, 'Support claims go to Family Court'),
  ('Family CAS', 10, 'family', ARRAY['CAS', 'childrens aid', 'child protection', 'apprehension'], 'ON', 'CAS', 'cas-journey', ARRAY['Answer'], '1-6 months', 'Free', 40, 'CAS involvement requires specialized family court process'),
  
  -- Labour
  ('Labour ESA Claim', 10, 'employment', ARRAY['wage', 'vacation', 'overtime', 'terminated', 'wrongful dismissal', 'hours'], 'ON', 'LABOUR', 'labour-board-journey', ARRAY['ESA Claim'], '3-6 months', 'Free', 70, 'Employment standards violations go to Ministry of Labour'),
  ('Labour Safety', 10, 'employment', ARRAY['unsafe', 'injury', 'WSIB', 'workers comp', 'accident'], 'ON', 'LABOUR', 'labour-board-journey', ARRAY['WSIB Form 6'], '1-6 months', 'Free', 65, 'Workplace injuries are handled through WSIB'),
  
  -- Criminal
  ('Criminal Charge', 10, 'criminal', ARRAY['charged', 'arrest', 'police', 'assault', 'theft', 'fraud', 'DUI', 'impaired'], 'ON', 'CRIMINAL', 'criminal-journey', ARRAY[]::TEXT[], '3-18 months', 'N/A', 45, 'Criminal charges proceed through criminal court'),
  ('Police Complaint', 10, 'criminal', ARRAY['police misconduct', 'excessive force', 'OIPRD', 'police complaint'], 'ON', 'OIPRD', 'police-accountability-journey', ARRAY['OIPRD Complaint'], '6-18 months', 'Free', 35, 'Police misconduct complaints go to OIPRD');

-- Trigger for updated_at
CREATE TRIGGER set_pathway_rules_updated_at
  BEFORE UPDATE ON public.pathway_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();