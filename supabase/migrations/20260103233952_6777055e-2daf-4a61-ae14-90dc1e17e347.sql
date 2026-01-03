-- Fix assert_profile_user_id() function - add SET search_path to prevent search path injection
CREATE OR REPLACE FUNCTION public.assert_profile_user_id()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
begin
  if new.user_id is null then
    raise exception 'profiles.user_id cannot be NULL';
  end if;
  return new;
end;
$function$;