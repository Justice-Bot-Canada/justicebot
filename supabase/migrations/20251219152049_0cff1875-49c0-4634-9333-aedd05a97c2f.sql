
-- Drop the insecure view that exposes low-income applicant data
-- This view has no RLS and could reveal which users are low-income applicants
DROP VIEW IF EXISTS public.low_income_applications_safe;
