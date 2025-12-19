-- Fix functions missing search_path to prevent search path injection attacks

-- 1. Fix _request_context()
CREATE OR REPLACE FUNCTION public._request_context()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE ctx jsonb := '{}'::jsonb;
BEGIN
  BEGIN
    ctx := jsonb_build_object(
      'ip', current_setting('request.headers.x-real-ip', true),
      'user_agent', current_setting('request.headers.user-agent', true)
    );
  EXCEPTION WHEN others THEN
    ctx := '{}'::jsonb;
  END;
  RETURN ctx;
END;
$function$;

-- 2. Fix admin_list_profiles_guard()
CREATE OR REPLACE FUNCTION public.admin_list_profiles_guard(p_search text DEFAULT NULL::text, p_limit integer DEFAULT 100, p_offset integer DEFAULT 0)
 RETURNS SETOF profiles
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'insufficient_privilege';
  END IF;
  RETURN QUERY
  SELECT *
  FROM public.profiles
  WHERE (
    p_search IS NULL OR
    display_name ILIKE '%' || p_search || '%' OR
    first_name ILIKE '%' || p_search || '%' OR
    last_name ILIKE '%' || p_search || '%'
  )
  ORDER BY created_at DESC
  LIMIT GREATEST(LEAST(p_limit, 500), 1)
  OFFSET GREATEST(p_offset, 0);
END;
$function$;

-- 3. Fix admins_mutation_audit()
CREATE OR REPLACE FUNCTION public.admins_mutation_audit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM public.log_admins_access('admins_' || lower(TG_OP), true, to_jsonb(COALESCE(NEW, OLD)) - 'email');
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- 4. Fix log_admins_access()
CREATE OR REPLACE FUNCTION public.log_admins_access(p_action text, p_success boolean, p_details jsonb DEFAULT '{}'::jsonb)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  INSERT INTO public.admins_access_audit(accessed_by, action, success, ip, user_agent, details)
  VALUES ((SELECT auth.uid()), p_action, p_success,
          COALESCE((_request_context()->>'ip')::text, NULL),
          COALESCE((_request_context()->>'user_agent')::text, NULL),
          p_details);
$function$;