-- Fix functions missing SET search_path parameter to prevent search path injection attacks

-- Fix is_admin() function - add SET search_path
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = (SELECT auth.uid())
      AND ur.role = 'admin'
  );
$function$;

-- Fix can_access_case_event() - should include 'public' in search_path for proper function resolution
CREATE OR REPLACE FUNCTION public.can_access_case_event(p_case_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_user uuid;
  v_allowed boolean;
BEGIN
  -- Get current user from auth context
  v_user := (SELECT auth.uid());

  -- If no user in context, deny
  IF v_user IS NULL THEN
    RETURN false;
  END IF;

  -- Check ownership or org membership via join
  SELECT EXISTS (
    SELECT 1
    FROM public.case_events AS ce
    WHERE ce.id = p_case_id
      AND (
        ce.user_id = v_user
        OR EXISTS (
          SELECT 1
          FROM public.org_members AS om
          WHERE om.user_id = v_user
            AND om.org_id = ce.org_id
        )
      )
  ) INTO v_allowed;

  RETURN COALESCE(v_allowed, false);
END;
$function$;