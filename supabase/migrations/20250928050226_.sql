-- Fix critical security vulnerability: Restrict profile access
-- Remove the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a secure policy that allows users to view their own profiles only
-- This protects sensitive data like phone numbers while allowing self-access
CREATE POLICY "Users can view their own profiles only"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Optionally, create a separate policy for public display information only
-- This allows viewing of non-sensitive profile data for legitimate app functionality
CREATE POLICY "Public display names only"
ON public.profiles
FOR SELECT
USING (
  -- Only allow access to display_name and avatar_url for app functionality
  -- This would need to be implemented with column-level security or view
  auth.uid() IS NOT NULL
);

-- For now, we'll use the most secure approach: only own profile access
-- Remove the public display policy for maximum security
DROP POLICY IF EXISTS "Public display names only" ON public.profiles;;
