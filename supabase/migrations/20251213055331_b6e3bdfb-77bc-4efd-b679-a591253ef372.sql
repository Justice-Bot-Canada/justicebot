-- Secure low_income_applications table from anonymous access
-- This table contains highly sensitive financial/personal data

-- Ensure RLS is enabled and forced
ALTER TABLE public.low_income_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.low_income_applications FORCE ROW LEVEL SECURITY;

-- Clean up duplicate policies
DROP POLICY IF EXISTS "own_rows_select" ON public.low_income_applications;
DROP POLICY IF EXISTS "own_rows_insert" ON public.low_income_applications;
DROP POLICY IF EXISTS "own_rows_update" ON public.low_income_applications;
DROP POLICY IF EXISTS "own_rows_delete" ON public.low_income_applications;
DROP POLICY IF EXISTS "applications_insert_self_or_admin" ON public.low_income_applications;
DROP POLICY IF EXISTS "applications_select_self_or_admin" ON public.low_income_applications;
DROP POLICY IF EXISTS "applications_update_self_or_admin" ON public.low_income_applications;
DROP POLICY IF EXISTS "lia_insert_self_or_admin" ON public.low_income_applications;