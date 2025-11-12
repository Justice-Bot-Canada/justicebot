-- Security fix: Add validation to analytics_events RLS policy
-- This prevents abuse by limiting event types and data size

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;

-- Create validated policy for authenticated users
CREATE POLICY "authenticated_users_insert_analytics"
ON public.analytics_events
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  event_type IS NOT NULL AND
  length(event_type) <= 100 AND
  length(metrics::text) <= 5000
);

-- Create limited policy for anonymous users
-- Only allow specific event types with size limits
CREATE POLICY "anonymous_limited_analytics"
ON public.analytics_events
FOR INSERT
TO anon
WITH CHECK (
  event_type IN ('page_load', 'page_view', 'button_click', 'form_start', 'lead_captured') AND
  length(event_type) <= 100 AND
  length(metrics::text) <= 2000 AND
  user_id IS NULL
);