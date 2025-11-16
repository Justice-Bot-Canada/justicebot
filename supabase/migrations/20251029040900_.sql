-- Add RLS policies for legal-docs storage bucket

-- Policy for authenticated users to read their own legal docs
CREATE POLICY "Users can read their own legal docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'legal-docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for admins to access all legal docs
CREATE POLICY "Admins can access all legal docs"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'legal-docs' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy for users to upload their own legal docs
CREATE POLICY "Users can upload their own legal docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'legal-docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to update their own legal docs
CREATE POLICY "Users can update their own legal docs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'legal-docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to delete their own legal docs
CREATE POLICY "Users can delete their own legal docs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'legal-docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);;
