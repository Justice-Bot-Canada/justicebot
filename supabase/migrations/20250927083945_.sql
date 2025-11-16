-- Fix remaining function search path issue
-- Update increment_form_usage function to have proper search_path
CREATE OR REPLACE FUNCTION public.increment_form_usage(form_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.forms 
  SET usage_count = usage_count + 1
  WHERE id = form_id;
END;
$function$;;
