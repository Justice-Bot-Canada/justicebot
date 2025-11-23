-- Remove incorrect RLS policies that use 'id' instead of 'user_id'
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Ensure correct policies exist (these should already be there from previous migration)
-- The correct policies use 'user_id' not 'id' for matching auth.uid()