
-- Fix security definer issue on views by recreating them with SECURITY INVOKER

-- Fix profiles_public view
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public 
WITH (security_invoker = true)
AS
SELECT 
    id,
    display_name,
    avatar_url
FROM profiles p
WHERE is_admin() OR user_id = auth.uid();

-- Fix profiles_public_view 
DROP VIEW IF EXISTS public.profiles_public_view;
CREATE VIEW public.profiles_public_view
WITH (security_invoker = true)
AS
SELECT 
    user_id,
    display_name,
    avatar_url
FROM profiles p
WHERE user_id = auth.uid();

-- Also fix admins_public_meta and legal_pathways_admin_view if they have security definer issues
DROP VIEW IF EXISTS public.admins_public_meta;
CREATE VIEW public.admins_public_meta
WITH (security_invoker = true)
AS
SELECT 
    user_id,
    granted_at,
    revoked_at
FROM admins
WHERE is_admin();

DROP VIEW IF EXISTS public.legal_pathways_admin_view;
CREATE VIEW public.legal_pathways_admin_view
WITH (security_invoker = true)
AS
SELECT 
    id,
    case_id,
    pathway_type,
    confidence_score,
    relevant_laws,
    next_steps,
    created_at
FROM legal_pathways
WHERE is_admin();
