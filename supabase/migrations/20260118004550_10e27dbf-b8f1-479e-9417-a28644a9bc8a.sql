-- Increase file size limit for evidence bucket to 100MB for large legal documents
UPDATE storage.buckets 
SET file_size_limit = 104857600 -- 100MB
WHERE id = 'evidence';

-- Fix evidence storage INSERT policy - needs WITH CHECK condition
DROP POLICY IF EXISTS "Users can upload their own evidence files" ON storage.objects;

CREATE POLICY "Users can upload to evidence bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'evidence' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Also fix the other evidence owner insert policy that has no check
DROP POLICY IF EXISTS "evidence_owner_write" ON storage.objects;

CREATE POLICY "evidence_owner_write"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'evidence'
  AND (storage.foldername(name))[1] = auth.uid()::text
);