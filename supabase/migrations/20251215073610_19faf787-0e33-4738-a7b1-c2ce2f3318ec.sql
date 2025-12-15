-- Force RLS on profiles table to prevent any bypass
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Add explicit deny policy for anonymous users if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'deny_anon_access_profiles'
  ) THEN
    CREATE POLICY "deny_anon_access_profiles"
    ON public.profiles
    AS RESTRICTIVE
    FOR ALL
    TO anon
    USING (false);
  END IF;
END $$;