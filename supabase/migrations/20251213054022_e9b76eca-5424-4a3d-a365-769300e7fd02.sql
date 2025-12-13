-- Add policies for site_settings (admin-only access)
CREATE POLICY "site_settings_admin_select" ON public.site_settings
FOR SELECT USING (is_admin());

CREATE POLICY "site_settings_admin_insert" ON public.site_settings
FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "site_settings_admin_update" ON public.site_settings
FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "site_settings_admin_delete" ON public.site_settings
FOR DELETE USING (is_admin());

-- email_queue should be service-only (no direct user access needed)
-- But we need at least one policy to satisfy RLS
CREATE POLICY "email_queue_service_all" ON public.email_queue
FOR ALL USING (is_admin()) WITH CHECK (is_admin());