
-- Fix profiles_public view to require authentication
-- The current view exposes user display_name and avatar to everyone

-- Drop and recreate profiles_public with proper security (only show if user consented or is self)
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public AS
SELECT 
    id,
    display_name,
    avatar_url
FROM profiles p
WHERE is_admin() OR user_id = auth.uid();

COMMENT ON VIEW public.profiles_public IS 'Secure view: only shows own profile or all if admin';

-- profiles_public_view is already secure (has WHERE user_id = auth.uid())
-- Just add a comment to clarify
COMMENT ON VIEW public.profiles_public_view IS 'Secure view: only shows the authenticated users own profile';
