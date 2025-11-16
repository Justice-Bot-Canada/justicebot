-- Add new tables for lead capture and email automation

-- 1) Leads table for capturing pre-auth or post-auth leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  source TEXT,
  journey TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2) Email queue for automation
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  template TEXT NOT NULL,
  vars JSONB,
  status TEXT DEFAULT 'queued',
  sent_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3) Add missing fields to existing cases table
ALTER TABLE public.cases 
  ADD COLUMN IF NOT EXISTS venue TEXT,
  ADD COLUMN IF NOT EXISTS triage JSONB,
  ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS plan TEXT,
  ADD COLUMN IF NOT EXISTS owner UUID;

-- 4) Add missing fields to payments table
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS provider_txn_id TEXT,
  ADD COLUMN IF NOT EXISTS raw JSONB;

-- 5) SEO pages table (fixing earlier migration)
CREATE TABLE IF NOT EXISTS public.seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_description TEXT,
  h1 TEXT NOT NULL,
  content TEXT NOT NULL,
  faq JSONB,
  cta_text TEXT,
  cta_link TEXT,
  views INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  topic TEXT,
  location TEXT,
  form_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6) Upsell prompts table
CREATE TABLE IF NOT EXISTS public.upsell_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  prompt_type TEXT NOT NULL,
  shown_at TIMESTAMPTZ DEFAULT now(),
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upsell_prompts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "leads_insert_public"
ON public.leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "leads_owner_read"
ON public.leads FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "leads_admin_all"
ON public.leads FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies for email_queue (service role only for writes)
CREATE POLICY "email_queue_admin_all"
ON public.email_queue FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies for SEO pages
CREATE POLICY "seo_pages_public_read"
ON public.seo_pages FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "seo_pages_admin_write"
ON public.seo_pages FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies for upsell prompts
CREATE POLICY "upsell_prompts_owner_all"
ON public.upsell_prompts FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "upsell_prompts_admin_all"
ON public.upsell_prompts FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Storage bucket for generated docs (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('docs', 'docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for docs bucket
CREATE POLICY "docs_owner_read"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'docs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "docs_service_write"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'docs');

CREATE POLICY "docs_admin_all"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'docs' AND is_admin())
WITH CHECK (bucket_id = 'docs' AND is_admin());;
