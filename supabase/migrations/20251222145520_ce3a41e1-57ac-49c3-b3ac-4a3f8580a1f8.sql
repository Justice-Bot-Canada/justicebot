-- Fix storage security issues

-- 1. Remove overly permissive service write policy on docs bucket
DROP POLICY IF EXISTS "docs_service_write" ON storage.objects;

-- 2. Add proper authenticated-only insert for docs bucket 
CREATE POLICY "docs_owner_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'docs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Remove public access to legal-docs (should be owner-only)
DROP POLICY IF EXISTS "Legal documents are publicly accessible" ON storage.objects;

-- 4. Add admin read access to income-proof for reviewing applications
CREATE POLICY "income_proof_admin_read"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'income-proof'
  AND is_admin()
);

-- 5. Ensure court-forms bucket (public forms) has proper policies
-- Court forms should be publicly readable but only admin writable
CREATE POLICY "court_forms_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'court-forms');

CREATE POLICY "court_forms_admin_write"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'court-forms' AND is_admin());

CREATE POLICY "court_forms_admin_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'court-forms' AND is_admin())
WITH CHECK (bucket_id = 'court-forms' AND is_admin());

CREATE POLICY "court_forms_admin_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'court-forms' AND is_admin());