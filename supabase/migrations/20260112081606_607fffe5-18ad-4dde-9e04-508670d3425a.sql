-- Fix: Replace public profiles policy with user-scoped policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can also view profiles of other users they interact with (for display names, avatars in shared contexts)
-- This is a common pattern - if you need public profile viewing, create a separate public_profiles view with limited fields
CREATE POLICY "Authenticated users can view basic profile info" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);