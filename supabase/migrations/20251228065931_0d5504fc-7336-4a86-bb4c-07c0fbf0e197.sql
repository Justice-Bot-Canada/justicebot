-- Legal Sources Registry
CREATE TABLE IF NOT EXISTS public.legal_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'CA',
  jurisdiction TEXT,
  court_level TEXT,
  base_url TEXT NOT NULL,
  listing_url TEXT,
  listing_selector TEXT,
  doc_selector TEXT,
  rate_limit_ms INTEGER DEFAULT 2000,
  last_sweep_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Legal Documents (case law)
CREATE TABLE IF NOT EXISTS public.legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.legal_sources(id) ON DELETE SET NULL,
  external_id TEXT,
  citation TEXT,
  title TEXT NOT NULL,
  court TEXT,
  decision_date DATE,
  url TEXT NOT NULL UNIQUE,
  content_hash TEXT,
  content_text TEXT,
  content_html TEXT,
  summary TEXT,
  keywords TEXT[],
  judges TEXT[],
  parties JSONB,
  metadata JSONB DEFAULT '{}',
  is_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sweep Runs (audit trail)
CREATE TABLE IF NOT EXISTS public.legal_sweep_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.legal_sources(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running',
  docs_found INTEGER DEFAULT 0,
  docs_new INTEGER DEFAULT 0,
  docs_updated INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}'
);

-- Sweep Queue (pending documents to fetch)
CREATE TABLE IF NOT EXISTS public.legal_sweep_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.legal_sources(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  error TEXT,
  status TEXT DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_id, url)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_legal_docs_source ON public.legal_documents(source_id);
CREATE INDEX IF NOT EXISTS idx_legal_docs_court ON public.legal_documents(court);
CREATE INDEX IF NOT EXISTS idx_legal_docs_date ON public.legal_documents(decision_date DESC);
CREATE INDEX IF NOT EXISTS idx_legal_docs_citation ON public.legal_documents(citation);
CREATE INDEX IF NOT EXISTS idx_legal_docs_hash ON public.legal_documents(content_hash);
CREATE INDEX IF NOT EXISTS idx_legal_queue_status ON public.legal_sweep_queue(status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_legal_sweep_runs_source ON public.legal_sweep_runs(source_id, started_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_legal_docs_fts ON public.legal_documents 
  USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content_text, '')));

-- Trigram index for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_legal_docs_title_trgm ON public.legal_documents USING GIN(title gin_trgm_ops);

-- Insert default Canadian sources
INSERT INTO public.legal_sources (code, name, country, jurisdiction, court_level, base_url, listing_url, rate_limit_ms) VALUES
('SCC', 'Supreme Court of Canada', 'CA', 'Federal', 'Supreme', 'https://scc-csc.ca', 'https://scc-csc.ca/case-dossier/info/dock-regi-eng.aspx', 3000),
('FCA', 'Federal Court of Appeal', 'CA', 'Federal', 'Appeal', 'https://decisions.fca-caf.ca', 'https://decisions.fca-caf.ca/fca-caf/en/nav.do', 2000),
('FC', 'Federal Court', 'CA', 'Federal', 'Trial', 'https://decisions.fct-cf.gc.ca', 'https://decisions.fct-cf.gc.ca/fc-cf/en/nav.do', 2000)
ON CONFLICT (code) DO NOTHING;

-- RLS disabled by default (service-role only access)
ALTER TABLE public.legal_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_sweep_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_sweep_queue ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "legal_sources_admin" ON public.legal_sources FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "legal_documents_admin" ON public.legal_documents FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "legal_sweep_runs_admin" ON public.legal_sweep_runs FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "legal_sweep_queue_admin" ON public.legal_sweep_queue FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Public read for legal documents (case law is public)
CREATE POLICY "legal_documents_public_read" ON public.legal_documents FOR SELECT USING (true);
CREATE POLICY "legal_sources_public_read" ON public.legal_sources FOR SELECT USING (true);