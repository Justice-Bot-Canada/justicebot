-- Create profiles table if it doesn't exist (for tracking user signup order)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  signup_number BIGINT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create a sequence for signup numbers
CREATE SEQUENCE IF NOT EXISTS public.signup_number_seq START 1;

-- Function to handle new user signup and assign number
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created_signup ON auth.users;
CREATE TRIGGER on_auth_user_created_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();

-- Function to check if user qualifies for free tier (first 500 users)
CREATE OR REPLACE FUNCTION public.check_free_tier_eligibility()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_signup_number BIGINT;
  has_paid_entitlement BOOLEAN;
BEGIN
  -- Get the user's signup number
  SELECT signup_number INTO user_signup_number
  FROM public.profiles
  WHERE id = auth.uid();

  -- Check if user has any paid entitlements (if they paid, they're not using free tier)
  SELECT EXISTS (
    SELECT 1 FROM public.entitlements
    WHERE user_id = auth.uid()
  ) INTO has_paid_entitlement;

  -- Return true if user is in first 500 and doesn't have paid entitlements
  RETURN (user_signup_number IS NOT NULL AND user_signup_number <= 500 AND NOT has_paid_entitlement);
END;
$$;