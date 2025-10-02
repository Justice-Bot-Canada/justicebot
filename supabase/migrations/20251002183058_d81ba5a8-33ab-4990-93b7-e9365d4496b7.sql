-- Backfill missing profiles for existing users
INSERT INTO public.profiles (user_id, display_name, first_name, last_name)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'display_name', u.raw_user_meta_data->>'first_name', 'User') as display_name,
  u.raw_user_meta_data->>'first_name' as first_name,
  u.raw_user_meta_data->>'last_name' as last_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL;

-- Also update existing profiles that might have null display names
UPDATE public.profiles p
SET 
  display_name = COALESCE(p.display_name, p.first_name, u.email, 'User'),
  first_name = COALESCE(p.first_name, u.raw_user_meta_data->>'first_name'),
  last_name = COALESCE(p.last_name, u.raw_user_meta_data->>'last_name')
FROM auth.users u
WHERE p.user_id = u.id
  AND (p.display_name IS NULL OR p.first_name IS NULL);