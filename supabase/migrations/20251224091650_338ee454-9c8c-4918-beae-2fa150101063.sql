-- Clean up duplicate RLS policies on cases table
-- Keep only the comprehensive p_cases_* policies that include admin access

DROP POLICY IF EXISTS "Users can create their own cases" ON public.cases;
DROP POLICY IF EXISTS "Users can delete their own cases" ON public.cases;
DROP POLICY IF EXISTS "Users can update their own cases" ON public.cases;
DROP POLICY IF EXISTS "Users can view their own cases" ON public.cases;
DROP POLICY IF EXISTS "own_rows_delete" ON public.cases;
DROP POLICY IF EXISTS "own_rows_insert" ON public.cases;
DROP POLICY IF EXISTS "own_rows_select" ON public.cases;
DROP POLICY IF EXISTS "own_rows_update" ON public.cases;

-- Clean up duplicate RLS policies on profiles table  
-- Keep only the authenticated user policies

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Rename to clearer names for profiles
ALTER POLICY "profiles_delete_owner" ON public.profiles RENAME TO "profiles_users_delete_own";
ALTER POLICY "profiles_insert_owner" ON public.profiles RENAME TO "profiles_users_insert_own";
ALTER POLICY "profiles_select_owner" ON public.profiles RENAME TO "profiles_users_select_own";
ALTER POLICY "profiles_update_owner" ON public.profiles RENAME TO "profiles_users_update_own";

-- Add admin view policy for profiles (authenticated only)
CREATE POLICY "profiles_admins_select_all" ON public.profiles
FOR SELECT TO authenticated
USING (is_admin());