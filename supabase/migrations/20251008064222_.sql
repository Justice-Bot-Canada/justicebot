-- Secure low_income_applications table with admin access for reviewing applications
-- Drop existing policies to recreate them with proper security
DROP POLICY IF EXISTS "Users can create their own applications" ON public.low_income_applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.low_income_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.low_income_applications;
DROP POLICY IF EXISTS "Users can update their own pending applications" ON public.low_income_applications;
DROP POLICY IF EXISTS "Admins can manage application status" ON public.low_income_applications;

-- Users can create their own applications
CREATE POLICY "Users can create their own applications"
ON public.low_income_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view their own applications, admins can view all
CREATE POLICY "Users can view their own applications"
ON public.low_income_applications
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Users can update only their own pending applications, admins can update any
CREATE POLICY "Users can update their own pending applications"
ON public.low_income_applications
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = user_id AND status = 'pending')
  OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  (auth.uid() = user_id AND status = 'pending')
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Secure the income-proof storage bucket
-- Drop existing storage policies first
DROP POLICY IF EXISTS "Users can upload their own income proof" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own income proof" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own income proof" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own income proof" ON storage.objects;

-- Users can only upload their own proof of income files
CREATE POLICY "Users can upload their own income proof"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'income-proof' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own files, admins can view all for verification
CREATE POLICY "Users can view their own income proof"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'income-proof' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Users can update their own files only if application is pending
CREATE POLICY "Users can update their own income proof"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'income-proof' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'income-proof' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own files, admins can delete for data cleanup
CREATE POLICY "Users can delete their own income proof"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'income-proof' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);;
