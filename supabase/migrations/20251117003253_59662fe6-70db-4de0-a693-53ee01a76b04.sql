-- Add signup_number column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS signup_number BIGINT;

-- Create sequence for signup numbers
CREATE SEQUENCE IF NOT EXISTS signup_number_seq START 1;

-- Update existing users with sequential signup numbers
UPDATE public.profiles 
SET signup_number = nextval('signup_number_seq')
WHERE signup_number IS NULL;

-- Update the check_free_tier_eligibility function to use 200 instead of 500
CREATE OR REPLACE FUNCTION public.check_free_tier_eligibility()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_signup_number BIGINT;
  has_paid_entitlement BOOLEAN;
BEGIN
  -- Get the user's signup number
  SELECT signup_number INTO user_signup_number
  FROM public.profiles
  WHERE id = auth.uid();

  -- Check if user has any paid entitlements
  SELECT EXISTS (
    SELECT 1 FROM public.entitlements
    WHERE user_id = auth.uid()
  ) INTO has_paid_entitlement;

  -- Return true if user is in first 200 and doesn't have paid entitlements
  RETURN (user_signup_number IS NOT NULL AND user_signup_number <= 200 AND NOT has_paid_entitlement);
END;
$$;

-- Update handle_new_user_signup trigger to assign signup numbers
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, signup_number)
  VALUES (
    NEW.id,
    NEW.email,
    nextval('signup_number_seq')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_signup ON auth.users;
CREATE TRIGGER on_auth_user_created_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();