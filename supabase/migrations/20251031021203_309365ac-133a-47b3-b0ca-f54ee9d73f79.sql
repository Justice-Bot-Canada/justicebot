-- Fix search_path for update_evidence_search_vector function
-- This addresses the Supabase linter warning about function_search_path_mutable

CREATE OR REPLACE FUNCTION public.update_evidence_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.file_name, '') || ' ' || 
    COALESCE(NEW.description, '')
  );
  RETURN NEW;
END;
$function$;