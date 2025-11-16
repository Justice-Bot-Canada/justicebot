-- Fix the get_all_users_admin function to handle edge cases better
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
 RETURNS TABLE(
   id uuid,
   email text,
   created_at timestamp with time zone,
   last_sign_in_at timestamp with time zone,
   email_confirmed_at timestamp with time zone,
   display_name text,
   cases_count bigint
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user has admin role
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied - admin only. User ID: %, has admin role: %', 
      auth.uid(), 
      has_role(auth.uid(), 'admin'::app_role);
  END IF;

  RETURN QUERY
  SELECT 
    u.id::uuid,
    u.email::text,
    u.created_at::timestamp with time zone,
    u.last_sign_in_at::timestamp with time zone,
    u.email_confirmed_at::timestamp with time zone,
    COALESCE(p.display_name, p.first_name, 'User')::text as display_name,
    COUNT(c.id)::bigint as cases_count
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.user_id
  LEFT JOIN public.cases c ON u.id = c.user_id
  GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at, u.email_confirmed_at, p.display_name, p.first_name
  ORDER BY u.created_at DESC;
END;
$function$;;
