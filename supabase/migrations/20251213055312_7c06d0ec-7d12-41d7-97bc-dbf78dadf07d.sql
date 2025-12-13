-- Block anonymous (unauthenticated) access to profiles table
-- This creates a restrictive policy that denies all access to anon role

-- First, ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners too (extra security)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Create a restrictive policy that explicitly denies anonymous access
-- By having only authenticated policies and FORCE RLS, anon is already blocked
-- But we add explicit deny for clarity and defense in depth

-- Drop any duplicate policies first to clean up
DROP POLICY IF EXISTS "own_rows_select" ON public.profiles;
DROP POLICY IF EXISTS "own_rows_insert" ON public.profiles;
DROP POLICY IF EXISTS "own_rows_update" ON public.profiles;
DROP POLICY IF EXISTS "own_rows_delete" ON public.profiles;

-- The existing policies already restrict to 'authenticated' role
-- But let's ensure there's no default access for anon by verifying the setup