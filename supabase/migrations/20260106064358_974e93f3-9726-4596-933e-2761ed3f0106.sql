-- Update get_program_stats to allow program members access
CREATE OR REPLACE FUNCTION public.get_program_stats(p_program_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Allow admins OR program members
  IF NOT public.is_admin() AND NOT public.is_program_member(p_program_id) THEN
    RAISE EXCEPTION 'Access denied: not admin or program member';
  END IF;

  SELECT json_build_object(
    'total_cases', COUNT(*),
    'intake_started', COUNT(*) FILTER (WHERE flow_step = 'welcome' OR flow_step = 'triage'),
    'docs_ready', COUNT(*) FILTER (WHERE flow_step IN ('evidence', 'forms', 'timeline')),
    'completed', COUNT(*) FILTER (WHERE status = 'completed' OR flow_step = 'completed'),
    'avg_merit_score', ROUND(AVG(merit_score)),
    'triage_complete_count', COUNT(*) FILTER (WHERE triage_complete = true),
    'referral_sources', (
      SELECT json_agg(DISTINCT referral_source) 
      FROM public.cases 
      WHERE program_id = p_program_id AND referral_source IS NOT NULL
    ),
    'cohort_batches', (
      SELECT json_agg(DISTINCT cohort_batch) 
      FROM public.cases 
      WHERE program_id = p_program_id AND cohort_batch IS NOT NULL
    )
  ) INTO result
  FROM public.cases
  WHERE program_id = p_program_id;

  RETURN result;
END;
$$;

-- Update export_program_summary to allow program members access
CREATE OR REPLACE FUNCTION public.export_program_summary(p_program_id uuid)
RETURNS TABLE(total_referrals bigint, intake_started bigint, docs_ready bigint, completed bigint, completion_rate numeric, doc_readiness_rate numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total BIGINT;
BEGIN
  -- Allow admins OR program members
  IF NOT public.is_admin() AND NOT public.is_program_member(p_program_id) THEN
    RAISE EXCEPTION 'Access denied: not admin or program member';
  END IF;

  SELECT COUNT(*) INTO v_total FROM public.cases WHERE program_id = p_program_id;

  RETURN QUERY
  SELECT 
    v_total as total_referrals,
    COUNT(*) FILTER (WHERE c.flow_step IN ('welcome', 'triage')) as intake_started,
    COUNT(*) FILTER (WHERE c.flow_step IN ('evidence', 'forms', 'timeline')) as docs_ready,
    COUNT(*) FILTER (WHERE c.status = 'completed' OR c.flow_step = 'completed') as completed,
    CASE WHEN v_total > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE c.status = 'completed' OR c.flow_step = 'completed')::NUMERIC / v_total) * 100, 1)
      ELSE 0 
    END as completion_rate,
    CASE WHEN v_total > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE c.flow_step IN ('evidence', 'forms', 'timeline'))::NUMERIC / v_total) * 100, 1)
      ELSE 0 
    END as doc_readiness_rate
  FROM public.cases c
  WHERE c.program_id = p_program_id;
END;
$$;