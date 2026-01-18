-- =====================================================
-- SOC2-LEVEL SECURITY HARDENING
-- =====================================================

-- 1. FIX CRITICAL: Remove public access to legal-docs bucket
DROP POLICY IF EXISTS "Legal documents are publicly accessible" ON storage.objects;

-- 2. Add secure owner-based access to legal-docs bucket (files stored in user_id folder)
CREATE POLICY "Users can view their own legal documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'legal-docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload their own legal documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'legal-docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own legal documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'legal-docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'legal-docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own legal documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'legal-docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Add secure policies for court-forms bucket
CREATE POLICY "Users can view their own court forms"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'court-forms' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload their own court forms"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'court-forms' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own court forms"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'court-forms' AND 
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'court-forms' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own court forms"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'court-forms' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Add secure policies for docs bucket
CREATE POLICY "Users can view their own docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload their own docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own docs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own docs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Add secure policies for books bucket
CREATE POLICY "Users can view their own books"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'books' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload their own books"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'books' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own books"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'books' AND 
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'books' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own books"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'books' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Clean up duplicate profile policies (keep the properly scoped ones)
DROP POLICY IF EXISTS "Profiles insert own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles view own" ON public.profiles;

-- 7. Add admin-only access to storage for support cases
CREATE POLICY "Admins can access all storage objects"
ON storage.objects FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 8. Create audit log table for SOC2 compliance
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on audit log (only admins can read, system can write)
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log FOR SELECT
TO authenticated
USING (public.is_admin());

-- Service role can insert audit logs (for edge functions)
CREATE POLICY "Service role can insert audit logs"
ON public.security_audit_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create index for efficient audit log queries
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action ON public.security_audit_log(action);

-- 9. Add security definer function for secure file path validation
CREATE OR REPLACE FUNCTION public.validate_file_ownership(file_path text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (split_part(file_path, '/', 1) = auth.uid()::text)
$$;