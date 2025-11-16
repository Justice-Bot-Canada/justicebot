-- Fix make_user_admin to properly grant admin access to both tables
CREATE OR REPLACE FUNCTION public.make_user_admin(p_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  v_user auth.users%ROWTYPE;
  v_granter uuid;
BEGIN
  SELECT * INTO v_user FROM auth.users WHERE email = p_email LIMIT 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No auth.users row found for %', p_email;
  END IF;

  v_granter := auth.uid();

  -- Insert into user_roles (critical for RLS policies)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user.id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Insert into admins table (for tracking)
  INSERT INTO public.admins (user_id, email, granted_by, granted_at, revoked_at, notes)
  VALUES (v_user.id, v_user.email, v_granter, now(), NULL, 'Granted via make_user_admin')
  ON CONFLICT (user_id) DO UPDATE
    SET email = EXCLUDED.email,
        granted_by = EXCLUDED.granted_by,
        granted_at = now(),
        revoked_at = NULL,
        notes = 'Re-granted via make_user_admin';
END;
$function$;;
