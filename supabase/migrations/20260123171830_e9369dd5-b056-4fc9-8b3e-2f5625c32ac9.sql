-- Enable FORCE RLS to prevent any bypass for profiles table
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Enable FORCE RLS to prevent any bypass for low_income_applications table  
ALTER TABLE public.low_income_applications FORCE ROW LEVEL SECURITY;

-- Add explicit deny policy for anonymous users on profiles
CREATE POLICY "deny_anon_access_profiles"
  ON public.profiles
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- Add explicit deny policy for anonymous users on low_income_applications
CREATE POLICY "deny_anon_access_low_income_applications"
  ON public.low_income_applications
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);