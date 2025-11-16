-- Function to grant admin role to a user (admin-only)
CREATE OR REPLACE FUNCTION public.grant_admin_role(target_user_id UUID, admin_notes TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can grant admin role';
  END IF;

  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Also add to admins table for tracking
  INSERT INTO public.admins (user_id, email, granted_by, granted_at, notes)
  SELECT 
    target_user_id,
    u.email,
    auth.uid(),
    now(),
    admin_notes
  FROM auth.users u
  WHERE u.id = target_user_id
  ON CONFLICT (user_id) DO UPDATE
    SET granted_by = auth.uid(),
        granted_at = now(),
        notes = admin_notes,
        revoked_at = NULL;
END;
$$;

-- Function to revoke admin role from a user (admin-only)
CREATE OR REPLACE FUNCTION public.revoke_admin_role(target_user_id UUID, revoke_reason TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can revoke admin role';
  END IF;

  -- Prevent revoking your own admin access
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot revoke your own admin access';
  END IF;

  -- Remove from user_roles
  DELETE FROM public.user_roles 
  WHERE user_id = target_user_id AND role = 'admin'::app_role;

  -- Mark as revoked in admins table
  UPDATE public.admins
  SET revoked_at = now(),
      notes = COALESCE(notes || ' | ', '') || 'Revoked: ' || COALESCE(revoke_reason, 'No reason provided')
  WHERE user_id = target_user_id;
END;
$$;

-- Function to get all admins (admin-only)
CREATE OR REPLACE FUNCTION public.get_all_admins()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  granted_by UUID,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  notes TEXT,
  is_active BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    a.user_id,
    a.email,
    a.granted_by,
    a.granted_at,
    a.revoked_at,
    a.notes,
    (a.revoked_at IS NULL) as is_active
  FROM public.admins a
  WHERE is_admin()
  ORDER BY a.granted_at DESC;
$$;

-- Function to get comprehensive analytics (admin-only)
CREATE OR REPLACE FUNCTION public.get_platform_analytics(
  start_date TIMESTAMPTZ DEFAULT NULL,
  end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  start_ts TIMESTAMPTZ;
  end_ts TIMESTAMPTZ;
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can access analytics';
  END IF;

  -- Set default date range if not provided
  start_ts := COALESCE(start_date, NOW() - INTERVAL '30 days');
  end_ts := COALESCE(end_date, NOW());

  SELECT json_build_object(
    'user_metrics', (
      SELECT json_build_object(
        'total_users', COUNT(*),
        'verified_users', COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL),
        'active_users_30d', COUNT(*) FILTER (WHERE last_sign_in_at >= NOW() - INTERVAL '30 days')
      )
      FROM auth.users
      WHERE created_at <= end_ts
    ),
    'case_metrics', (
      SELECT json_build_object(
        'total_cases', COUNT(*),
        'active_cases', COUNT(*) FILTER (WHERE status IN ('active', 'pending')),
        'completed_cases', COUNT(*) FILTER (WHERE status = 'completed'),
        'average_merit_score', ROUND(AVG(merit_score))
      )
      FROM cases
      WHERE created_at BETWEEN start_ts AND end_ts
    ),
    'revenue_metrics', (
      SELECT json_build_object(
        'total_revenue', COALESCE(SUM(amount), 0),
        'completed_payments', COUNT(*) FILTER (WHERE status = 'completed'),
        'pending_payments', COUNT(*) FILTER (WHERE status = 'pending')
      )
      FROM payments
      WHERE created_at BETWEEN start_ts AND end_ts
    ),
    'engagement_metrics', (
      SELECT json_build_object(
        'total_events', COUNT(*),
        'unique_sessions', COUNT(DISTINCT session_id),
        'page_loads', COUNT(*) FILTER (WHERE event_type = 'page_load')
      )
      FROM analytics_events
      WHERE created_at BETWEEN start_ts AND end_ts
    )
  ) INTO result;

  RETURN result;
END;
$$;;
