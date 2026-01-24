-- Create or replace free tier eligibility function (prevents client 404 on /rpc/check_free_tier_eligibility)
-- Assumption: early-access free tier is determined by profiles.signup_number (lower is earlier).
-- If signup_number is missing for the user, default to false.

CREATE OR REPLACE FUNCTION public.check_free_tier_eligibility(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_signup_number integer;
BEGIN
  -- Fetch user's signup number
  SELECT signup_number
  INTO v_signup_number
  FROM public.profiles
  WHERE user_id = p_user_id
  LIMIT 1;

  -- If no profile or no signup number, not eligible
  IF v_signup_number IS NULL THEN
    RETURN false;
  END IF;

  -- Early-access threshold (update if your business rule differs)
  RETURN v_signup_number <= 1000;
END;
$$;

-- Allow authenticated users to execute this function
GRANT EXECUTE ON FUNCTION public.check_free_tier_eligibility(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_free_tier_eligibility(uuid) TO anon;
