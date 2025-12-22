-- Fix security issues across multiple tables

-- 1. Remove overly permissive support_tickets insert policy
DROP POLICY IF EXISTS "support_tickets_insert_service" ON public.support_tickets;

-- 2. Add missing delete policy for user_feedback (only owner or admin can delete)
CREATE POLICY "user_feedback_delete_authenticated"
ON public.user_feedback
FOR DELETE
TO authenticated
USING (user_id = auth.uid() OR is_admin());

-- 3. Add deny anon access to user_feedback
DROP POLICY IF EXISTS "deny_anon_access_user_feedback" ON public.user_feedback;
CREATE POLICY "deny_anon_access_user_feedback"
ON public.user_feedback
FOR ALL
TO anon
USING (false);

-- 4. Add deny anon access to support_tickets
DROP POLICY IF EXISTS "deny_anon_access_support_tickets" ON public.support_tickets;
CREATE POLICY "deny_anon_access_support_tickets"
ON public.support_tickets
FOR ALL
TO anon
USING (false);

-- 5. Add deny anon access to low_income_applications
DROP POLICY IF EXISTS "deny_anon_access_lia" ON public.low_income_applications;
CREATE POLICY "deny_anon_access_lia"
ON public.low_income_applications
FOR ALL
TO anon
USING (false);

-- 6. Remove duplicate/redundant support_tickets policies to reduce complexity
DROP POLICY IF EXISTS "support_tickets_delete" ON public.support_tickets;
DROP POLICY IF EXISTS "support_tickets_select" ON public.support_tickets;
DROP POLICY IF EXISTS "support_tickets_update" ON public.support_tickets;
DROP POLICY IF EXISTS "support_tickets_insert_own" ON public.support_tickets;

-- 7. Remove duplicate user_feedback policies to consolidate
DROP POLICY IF EXISTS "own_rows_delete" ON public.user_feedback;
DROP POLICY IF EXISTS "own_rows_insert" ON public.user_feedback;
DROP POLICY IF EXISTS "own_rows_select" ON public.user_feedback;
DROP POLICY IF EXISTS "own_rows_update" ON public.user_feedback;