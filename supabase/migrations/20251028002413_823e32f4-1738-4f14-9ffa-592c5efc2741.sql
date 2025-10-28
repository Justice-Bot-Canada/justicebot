-- Allow anyone to view document templates (public access)
DROP POLICY IF EXISTS "Templates are viewable by authenticated users" ON public.document_templates;

CREATE POLICY "Templates are publicly viewable"
  ON public.document_templates
  FOR SELECT
  USING (true);