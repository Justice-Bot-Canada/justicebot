-- Fix RLS policy gaps and function security issues

-- 1. Add missing RLS policy for entitlements table (if needed)
CREATE POLICY "Users can view their own entitlements" 
ON public.entitlements 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Fix function search paths for security
-- Update existing functions to have proper search_path
CREATE OR REPLACE FUNCTION public.evidence_tsvector_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  new.content_tsvector := to_tsvector('english', coalesce(new.title,'') || ' ' || coalesce(new.content,''));
  return new;
end
$function$;

-- Update existing update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3. Enable leaked password protection (this is an auth setting, not SQL)
-- This needs to be enabled in the Auth settings in Supabase dashboard

-- 4. Ensure all tables with RLS enabled have proper policies
-- Check if any tables are missing policies and add basic access controls

-- Add basic admin policy for entitlements if needed
CREATE POLICY "Admins can manage entitlements" 
ON public.entitlements 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));