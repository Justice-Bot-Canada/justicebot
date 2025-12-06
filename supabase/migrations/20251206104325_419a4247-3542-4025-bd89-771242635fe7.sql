-- Drop and recreate increment_form_usage with correct parameter and search_path
DROP FUNCTION IF EXISTS public.increment_form_usage(uuid);

CREATE FUNCTION public.increment_form_usage(form_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.forms 
  SET usage_count = COALESCE(usage_count, 0) + 1 
  WHERE id = form_id_input;
END;
$$;