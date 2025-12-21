-- =====================================================
-- FIX: Drop broken triggers that call non-existent realtime.send()
-- =====================================================

-- Drop the broken triggers on leads table
DROP TRIGGER IF EXISTS leads_broadcast_trigger ON public.leads;
DROP TRIGGER IF EXISTS trg_enqueue_lead_to_zapier ON public.leads;
DROP TRIGGER IF EXISTS trg_leads_broadcast ON public.leads;

-- Drop the broken functions that use realtime.send()
DROP FUNCTION IF EXISTS public.leads_broadcast_trigger();
DROP FUNCTION IF EXISTS public.enqueue_lead_to_zapier();

-- Keep notify_pipedream_leads as it uses net.http_post which may work
-- but disable it if not needed (can be re-enabled later)
-- DROP TRIGGER IF EXISTS trg_notify_pipedream_leads ON public.leads;