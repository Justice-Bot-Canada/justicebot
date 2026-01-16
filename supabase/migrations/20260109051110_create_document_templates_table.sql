-- Baseline: document_templates table so later ALTERs don't fail
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,

  -- core template identity
  key text UNIQUE,
  title text NOT NULL DEFAULT 'Untitled Template',
  description text,

  -- template payload
  content text,
  form_key text,
  province text,
  category text,

  -- metadata
  tags text[],

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS document_templates_user_id_idx
  ON public.document_templates(user_id);

ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Safe default policy (owner can manage their own templates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'document_templates'
      AND policyname = 'Users can manage their own document templates'
  ) THEN
    CREATE POLICY "Users can manage their own document templates"
    ON public.document_templates
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
