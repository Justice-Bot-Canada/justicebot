-- Fix SECURITY DEFINER views by recreating with SECURITY INVOKER
-- Drop and recreate active_entitlements view
DROP VIEW IF EXISTS public.active_entitlements;
CREATE VIEW public.active_entitlements 
WITH (security_invoker = on)
AS SELECT 
    user_id,
    product_id,
    access_level,
    source,
    starts_at,
    ends_at,
    (ends_at IS NULL OR ends_at > now()) AS is_active
FROM public.entitlements;

-- Drop and recreate my_active_entitlements view  
DROP VIEW IF EXISTS public.my_active_entitlements;
CREATE VIEW public.my_active_entitlements
WITH (security_invoker = on)
AS SELECT 
    product_id,
    access_level,
    source,
    starts_at,
    ends_at
FROM public.entitlements
WHERE user_id = auth.uid() 
  AND (ends_at IS NULL OR ends_at > now());

-- Fix increment_form_usage function search_path (the one missing it)
CREATE OR REPLACE FUNCTION public.increment_form_usage(form_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.forms
  SET usage_count = usage_count + 1
  WHERE id = form_id;
END;
$$;