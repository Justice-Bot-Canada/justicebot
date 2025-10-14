-- Drop the public_feedback view since user_feedback table already has proper RLS
-- This prevents bypassing RLS policies through the view
DROP VIEW IF EXISTS public.public_feedback;

-- Optionally recreate as a secure view with RLS if needed
-- CREATE VIEW public.public_feedback WITH (security_barrier = true) AS
-- SELECT id, subject, message, feedback_type, rating, created_at
-- FROM public.user_feedback
-- WHERE is_public = true;

-- Enable RLS on the view if it's recreated
-- ALTER VIEW public.public_feedback SET (security_barrier = true);