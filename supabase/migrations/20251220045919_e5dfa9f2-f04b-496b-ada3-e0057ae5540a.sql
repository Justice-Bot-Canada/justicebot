-- Fix check_free_tier_eligibility to query by user_id instead of id
CREATE OR REPLACE FUNCTION public.check_free_tier_eligibility()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_signup_number BIGINT;
  has_paid_entitlement BOOLEAN;
BEGIN
  -- Get the user's signup number (query by user_id, not id)
  SELECT signup_number INTO user_signup_number
  FROM public.profiles
  WHERE user_id = auth.uid();

  -- Check if user has any paid entitlements
  SELECT EXISTS (
    SELECT 1 FROM public.entitlements
    WHERE user_id = auth.uid()
  ) INTO has_paid_entitlement;

  -- Return true if user is in first 200 and doesn't have paid entitlements
  RETURN (user_signup_number IS NOT NULL AND user_signup_number <= 200 AND NOT has_paid_entitlement);
END;
$function$;