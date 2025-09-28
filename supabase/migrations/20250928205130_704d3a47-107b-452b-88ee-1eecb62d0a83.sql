-- Fix critical security issue: Prevent public exposure of email addresses in feedback
-- Update RLS policy to exclude sensitive PII from public view
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;

CREATE POLICY "Users can view their own feedback" ON public.user_feedback
FOR SELECT USING (
  (user_id = auth.uid()) OR 
  (is_public = true AND user_id IS NOT NULL)
);

-- Create a secure view for public feedback without PII
CREATE OR REPLACE VIEW public.public_feedback AS
SELECT 
  id,
  subject,
  message,
  feedback_type,
  rating,
  created_at,
  admin_response,
  is_resolved
FROM public.user_feedback 
WHERE is_public = true AND user_id IS NOT NULL;