
-- Drop the dependent function first
DROP FUNCTION IF EXISTS public.search_profiles_directory(text, integer, integer);

-- Fix Security Definer Views by recreating them with SECURITY INVOKER
-- This ensures RLS is evaluated as the querying user, not the view creator

-- Drop and recreate profiles_public view
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public 
WITH (security_invoker = true)
AS 
SELECT id, display_name, avatar_url
FROM profiles p
WHERE (is_admin() OR (user_id = auth.uid()));

-- Drop and recreate profiles_public_view
DROP VIEW IF EXISTS public.profiles_public_view;
CREATE VIEW public.profiles_public_view
WITH (security_invoker = true)
AS
SELECT user_id, display_name, avatar_url
FROM profiles p
WHERE (user_id = auth.uid());

-- Drop and recreate admins_public_meta view
DROP VIEW IF EXISTS public.admins_public_meta;
CREATE VIEW public.admins_public_meta
WITH (security_invoker = true)
AS
SELECT user_id, granted_at, revoked_at
FROM admins
WHERE is_admin();

-- Drop and recreate legal_pathways_admin_view
DROP VIEW IF EXISTS public.legal_pathways_admin_view;
CREATE VIEW public.legal_pathways_admin_view
WITH (security_invoker = true)
AS
SELECT id, case_id, pathway_type, confidence_score, relevant_laws, next_steps, created_at
FROM legal_pathways
WHERE is_admin();

-- Drop and recreate profiles_directory - restrict to authenticated users only
DROP VIEW IF EXISTS public.profiles_directory;
CREATE VIEW public.profiles_directory
WITH (security_invoker = true)
AS
SELECT id, display_name, avatar_url, left(COALESCE(bio, ''::text), 160) AS bio_preview
FROM profiles
WHERE (onboarding_completed IS TRUE AND display_name IS NOT NULL AND display_name <> ''::text)
  AND (user_id = auth.uid() OR is_admin());

-- Recreate the search function with SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.search_profiles_directory(
  p_query text DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(id uuid, display_name text, avatar_url text, bio_preview text)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT *
  FROM public.profiles_directory
  WHERE p_query IS NULL
     OR display_name ILIKE '%' || p_query || '%'
     OR bio_preview ILIKE '%' || p_query || '%'
  ORDER BY display_name ASC
  LIMIT GREATEST(LEAST(p_limit, 50), 1)
  OFFSET GREATEST(p_offset, 0);
$$;

-- Drop and recreate my_payments view
DROP VIEW IF EXISTS public.my_payments;
CREATE VIEW public.my_payments
WITH (security_invoker = true)
AS
SELECT id, user_id, amount, currency, status, created_at
FROM payments
WHERE (user_id = auth.uid());

-- Drop and recreate legal_pathways_monthly_analytics view (admin only)
DROP VIEW IF EXISTS public.legal_pathways_monthly_analytics;
CREATE VIEW public.legal_pathways_monthly_analytics
WITH (security_invoker = true)
AS
WITH lp AS (
  SELECT lp.case_id, lp.pathway_type,
    (date_trunc('month', lp.created_at))::date AS month_start,
    c.user_id, (c.merit_score)::numeric AS merit_score
  FROM legal_pathways lp
  JOIN cases c ON c.id = lp.case_id
),
base AS (
  SELECT lp.month_start, lp.pathway_type,
    count(DISTINCT lp.case_id) AS total_cases,
    round(avg(lp.merit_score), 1) AS avg_merit_score
  FROM lp GROUP BY lp.month_start, lp.pathway_type
),
completed_docs AS (
  SELECT lp.month_start, lp.pathway_type, count(*) AS completed_documents
  FROM lp JOIN documents d ON d.case_id = lp.case_id 
    AND (date_trunc('month', d.created_at))::date = lp.month_start
  GROUP BY lp.month_start, lp.pathway_type
),
active_users AS (
  SELECT lp.month_start, lp.pathway_type, count(DISTINCT lp.user_id) AS active_users
  FROM lp GROUP BY lp.month_start, lp.pathway_type
),
conversions AS (
  SELECT lp.month_start, lp.pathway_type, count(DISTINCT lp.user_id) AS users_converted
  FROM lp JOIN documents d ON d.case_id = lp.case_id 
    AND (date_trunc('month', d.created_at))::date = lp.month_start
  GROUP BY lp.month_start, lp.pathway_type
),
revenue AS (
  SELECT lp.month_start, lp.pathway_type, sum(p.amount) AS total_revenue
  FROM lp JOIN payments p ON p.case_id = lp.case_id 
    AND (date_trunc('month', p.created_at))::date = lp.month_start 
    AND p.status = 'completed'
  GROUP BY lp.month_start, lp.pathway_type
)
SELECT to_char(b.month_start::timestamp with time zone, 'YYYY-MM') AS month,
  b.pathway_type, b.total_cases,
  COALESCE(cd.completed_documents, 0) AS completed_documents,
  COALESCE(au.active_users, 0) AS active_users,
  CASE WHEN COALESCE(au.active_users, 0) > 0 
    THEN round((COALESCE(cv.users_converted, 0)::numeric / au.active_users::numeric) * 100, 1)
    ELSE 0 END AS conversion_rate_pct,
  b.avg_merit_score,
  COALESCE(rv.total_revenue, 0) AS total_revenue
FROM base b
LEFT JOIN completed_docs cd ON cd.month_start = b.month_start AND cd.pathway_type = b.pathway_type
LEFT JOIN active_users au ON au.month_start = b.month_start AND au.pathway_type = b.pathway_type
LEFT JOIN conversions cv ON cv.month_start = b.month_start AND cv.pathway_type = b.pathway_type
LEFT JOIN revenue rv ON rv.month_start = b.month_start AND rv.pathway_type = b.pathway_type
WHERE is_admin()
ORDER BY b.month_start DESC, b.pathway_type;
