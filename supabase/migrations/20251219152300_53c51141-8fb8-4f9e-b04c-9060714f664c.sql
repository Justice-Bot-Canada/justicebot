
-- Fix Security Definer View issue
-- First drop dependent function, then recreate views with security_invoker = true

-- Drop the dependent function first
DROP FUNCTION IF EXISTS public.get_admins_public_meta();

-- 1. Drop and recreate admins_public_meta with security_invoker
DROP VIEW IF EXISTS public.admins_public_meta CASCADE;
CREATE VIEW public.admins_public_meta 
WITH (security_invoker = true)
AS SELECT user_id, granted_at, revoked_at FROM public.admins;

-- Recreate the function that depends on the view
CREATE OR REPLACE FUNCTION public.get_admins_public_meta()
RETURNS SETOF public.admins_public_meta
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_admins_access('read_public_meta', true, NULL);
  RETURN QUERY SELECT * FROM public.admins_public_meta;
END;
$$;

-- 2. Drop and recreate profiles_public with security_invoker
DROP VIEW IF EXISTS public.profiles_public CASCADE;
CREATE VIEW public.profiles_public 
WITH (security_invoker = true)
AS SELECT 
  id, user_id, display_name, first_name, last_name, 
  avatar_url, bio, created_at, updated_at
FROM public.profiles;

-- 3. Drop and recreate profiles_public_view with security_invoker
DROP VIEW IF EXISTS public.profiles_public_view CASCADE;
CREATE VIEW public.profiles_public_view 
WITH (security_invoker = true)
AS SELECT user_id, display_name, avatar_url
FROM public.profiles
WHERE user_id = (SELECT auth.uid());

-- 4. Drop and recreate my_payments with security_invoker
DROP VIEW IF EXISTS public.my_payments CASCADE;
CREATE VIEW public.my_payments 
WITH (security_invoker = true)
AS SELECT id, user_id, amount, currency, status, created_at
FROM public.payments
WHERE user_id = (SELECT auth.uid());

-- 5. Drop and recreate legal_pathways_admin_view with security_invoker
DROP VIEW IF EXISTS public.legal_pathways_admin_view CASCADE;
CREATE VIEW public.legal_pathways_admin_view 
WITH (security_invoker = true)
AS SELECT id, case_id, pathway_type, confidence_score, relevant_laws, next_steps, created_at
FROM public.legal_pathways
WHERE is_admin();

-- 6. Drop and recreate legal_pathways_monthly_analytics with security_invoker
DROP VIEW IF EXISTS public.legal_pathways_monthly_analytics CASCADE;
CREATE VIEW public.legal_pathways_monthly_analytics 
WITH (security_invoker = true)
AS
WITH lp AS (
  SELECT 
    lp.case_id,
    lp.pathway_type,
    (date_trunc('month', lp.created_at))::date AS month_start,
    c.user_id,
    c.merit_score::numeric AS merit_score
  FROM public.legal_pathways lp
  JOIN public.cases c ON c.id = lp.case_id
),
base AS (
  SELECT 
    month_start,
    pathway_type,
    count(DISTINCT case_id) AS total_cases,
    round(avg(merit_score), 1) AS avg_merit_score
  FROM lp
  GROUP BY month_start, pathway_type
),
completed_docs AS (
  SELECT 
    lp.month_start,
    lp.pathway_type,
    count(*) AS completed_documents
  FROM lp
  JOIN public.documents d ON d.case_id = lp.case_id 
    AND (date_trunc('month', d.created_at))::date = lp.month_start
  GROUP BY lp.month_start, lp.pathway_type
),
active_users AS (
  SELECT month_start, pathway_type, count(DISTINCT user_id) AS active_users
  FROM lp GROUP BY month_start, pathway_type
),
conversions AS (
  SELECT 
    lp.month_start,
    lp.pathway_type,
    count(DISTINCT lp.user_id) AS users_converted
  FROM lp
  JOIN public.documents d ON d.case_id = lp.case_id 
    AND (date_trunc('month', d.created_at))::date = lp.month_start
  GROUP BY lp.month_start, lp.pathway_type
),
revenue AS (
  SELECT 
    lp.month_start,
    lp.pathway_type,
    sum(p.amount) AS total_revenue
  FROM lp
  JOIN public.payments p ON p.case_id = lp.case_id 
    AND (date_trunc('month', p.created_at))::date = lp.month_start 
    AND p.status = 'completed'
  GROUP BY lp.month_start, lp.pathway_type
)
SELECT 
  to_char(b.month_start::timestamptz, 'YYYY-MM') AS month,
  b.pathway_type,
  b.total_cases,
  COALESCE(cd.completed_documents, 0) AS completed_documents,
  COALESCE(au.active_users, 0) AS active_users,
  CASE 
    WHEN COALESCE(au.active_users, 0) > 0 
    THEN round((COALESCE(cv.users_converted, 0)::numeric / au.active_users::numeric) * 100, 1)
    ELSE 0
  END AS conversion_rate_pct,
  b.avg_merit_score,
  COALESCE(rv.total_revenue, 0) AS total_revenue
FROM base b
LEFT JOIN completed_docs cd ON cd.month_start = b.month_start AND cd.pathway_type = b.pathway_type
LEFT JOIN active_users au ON au.month_start = b.month_start AND au.pathway_type = b.pathway_type
LEFT JOIN conversions cv ON cv.month_start = b.month_start AND cv.pathway_type = b.pathway_type
LEFT JOIN revenue rv ON rv.month_start = b.month_start AND rv.pathway_type = b.pathway_type
WHERE is_admin()
ORDER BY b.month_start DESC, b.pathway_type;

-- Grant appropriate permissions
GRANT SELECT ON public.admins_public_meta TO authenticated;
GRANT SELECT ON public.profiles_public TO authenticated;
GRANT SELECT ON public.profiles_public_view TO authenticated;
GRANT SELECT ON public.my_payments TO authenticated;
GRANT SELECT ON public.legal_pathways_admin_view TO authenticated;
GRANT SELECT ON public.legal_pathways_monthly_analytics TO authenticated;
