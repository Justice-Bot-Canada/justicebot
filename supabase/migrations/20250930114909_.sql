-- Create admin function to get all users with their data
CREATE OR REPLACE FUNCTION get_all_users_admin()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  email_confirmed_at timestamptz,
  display_name text,
  cases_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied - admin only';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    u.email_confirmed_at,
    COALESCE(p.display_name, p.first_name, 'User') as display_name,
    COUNT(c.id) as cases_count
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.user_id
  LEFT JOIN public.cases c ON u.id = c.user_id
  GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at, u.email_confirmed_at, p.display_name, p.first_name
  ORDER BY u.created_at DESC;
END;
$$;;
