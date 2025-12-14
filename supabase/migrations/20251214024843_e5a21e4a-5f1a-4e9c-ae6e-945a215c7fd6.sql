-- Add explicit denial policies for anonymous access to sensitive tables
-- This prevents potential data leaks if RLS is bypassed

-- Profiles table: explicitly deny anonymous access
CREATE POLICY "deny_anon_access_profiles" 
ON public.profiles 
FOR ALL 
TO anon 
USING (false);

-- Cases table: explicitly deny anonymous access
CREATE POLICY "deny_anon_access_cases" 
ON public.cases 
FOR ALL 
TO anon 
USING (false);

-- Low income applications: explicitly deny anonymous access (contains financial PII)
CREATE POLICY "deny_anon_access_low_income" 
ON public.low_income_applications 
FOR ALL 
TO anon 
USING (false);

-- Evidence table: explicitly deny anonymous access
CREATE POLICY "deny_anon_access_evidence" 
ON public.evidence 
FOR ALL 
TO anon 
USING (false);

-- Documents table: explicitly deny anonymous access
CREATE POLICY "deny_anon_access_documents" 
ON public.documents 
FOR ALL 
TO anon 
USING (false);