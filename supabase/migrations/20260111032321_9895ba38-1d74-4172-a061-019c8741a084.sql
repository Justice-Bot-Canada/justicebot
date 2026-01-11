-- Fix RLS policies for Stripe-related tables
-- These tables need service_role access for webhook operations

-- Add INSERT/UPDATE/DELETE policies for entitlements (used by Stripe webhooks)
CREATE POLICY "service_role_full_access_entitlements" ON public.entitlements
FOR ALL USING (auth.role() = 'service_role');

-- Add INSERT/UPDATE/DELETE policies for orders (used by Stripe webhooks)
CREATE POLICY "service_role_full_access_orders" ON public.orders
FOR ALL USING (auth.role() = 'service_role');

-- Add INSERT/UPDATE policies for stripe_customers (used by Stripe webhooks)
CREATE POLICY "service_role_full_access_stripe_customers" ON public.stripe_customers
FOR ALL USING (auth.role() = 'service_role');

-- Add INSERT/UPDATE policies for stripe_webhook_events (used by Stripe webhooks)
CREATE POLICY "service_role_full_access_webhook_events" ON public.stripe_webhook_events
FOR ALL USING (auth.role() = 'service_role');

-- Fix function search_path issues
ALTER FUNCTION public.has_active_entitlement(text) SET search_path = public;
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = public;