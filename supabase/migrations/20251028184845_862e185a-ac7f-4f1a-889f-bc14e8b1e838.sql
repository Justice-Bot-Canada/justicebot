-- Create evidence metadata table for AI-extracted information
CREATE TABLE IF NOT EXISTS public.evidence_metadata (
  evidence_id uuid PRIMARY KEY REFERENCES public.evidence(id) ON DELETE CASCADE,
  doc_type text,
  category text,
  parties jsonb DEFAULT '{}',
  dates jsonb DEFAULT '{}',
  extracted_text text,
  flags jsonb DEFAULT '{}',
  confidence_score numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create evidence_links table to connect evidence to forms
CREATE TABLE IF NOT EXISTS public.evidence_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id uuid REFERENCES public.evidence(id) ON DELETE CASCADE,
  form_id uuid REFERENCES public.forms(id) ON DELETE CASCADE,
  section_key text,
  note text,
  confidence numeric,
  created_at timestamptz DEFAULT now()
);

-- Create exhibits table for tribunal-ready exhibit books
CREATE TABLE IF NOT EXISTS public.exhibits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  evidence_id uuid REFERENCES public.evidence(id) ON DELETE CASCADE,
  label text NOT NULL,
  page_start integer,
  page_end integer,
  order_index integer,
  created_at timestamptz DEFAULT now()
);

-- Add search column to evidence for full-text search
ALTER TABLE public.evidence 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION public.update_evidence_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.file_name, '') || ' ' || 
    COALESCE(NEW.description, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
DROP TRIGGER IF EXISTS evidence_search_vector_update ON public.evidence;
CREATE TRIGGER evidence_search_vector_update
  BEFORE INSERT OR UPDATE ON public.evidence
  FOR EACH ROW
  EXECUTE FUNCTION public.update_evidence_search_vector();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_evidence_metadata_category ON public.evidence_metadata(category);
CREATE INDEX IF NOT EXISTS idx_evidence_metadata_doc_type ON public.evidence_metadata(doc_type);
CREATE INDEX IF NOT EXISTS idx_evidence_links_evidence_id ON public.evidence_links(evidence_id);
CREATE INDEX IF NOT EXISTS idx_evidence_links_form_id ON public.evidence_links(form_id);
CREATE INDEX IF NOT EXISTS idx_exhibits_case_id ON public.exhibits(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_search_vector ON public.evidence USING gin(search_vector);

-- Enable RLS
ALTER TABLE public.evidence_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for evidence_metadata
CREATE POLICY "Users can view metadata for their evidence"
  ON public.evidence_metadata FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.evidence e
      JOIN public.cases c ON e.case_id = c.id
      WHERE e.id = evidence_metadata.evidence_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update metadata for their evidence"
  ON public.evidence_metadata FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.evidence e
      JOIN public.cases c ON e.case_id = c.id
      WHERE e.id = evidence_metadata.evidence_id
      AND c.user_id = auth.uid()
    )
  );

-- RLS Policies for evidence_links
CREATE POLICY "Users can view links for their evidence"
  ON public.evidence_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.evidence e
      JOIN public.cases c ON e.case_id = c.id
      WHERE e.id = evidence_links.evidence_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage links for their evidence"
  ON public.evidence_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.evidence e
      JOIN public.cases c ON e.case_id = c.id
      WHERE e.id = evidence_links.evidence_id
      AND c.user_id = auth.uid()
    )
  );

-- RLS Policies for exhibits
CREATE POLICY "Users can view exhibits for their cases"
  ON public.exhibits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = exhibits.case_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage exhibits for their cases"
  ON public.exhibits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = exhibits.case_id
      AND c.user_id = auth.uid()
    )
  );

-- Admin bypass policies
CREATE POLICY "admin_bypass_evidence_metadata" ON public.evidence_metadata FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_bypass_evidence_links" ON public.evidence_links FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_bypass_exhibits" ON public.exhibits FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());