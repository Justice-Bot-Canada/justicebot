-- Add unique constraint on orders.stripe_checkout_session_id for idempotency
ALTER TABLE public.orders 
ADD CONSTRAINT orders_stripe_checkout_session_id_unique 
UNIQUE (stripe_checkout_session_id);

-- Add unique constraint on entitlements (user_id, product_id) for upsert
ALTER TABLE public.entitlements 
DROP CONSTRAINT IF EXISTS entitlements_pkey;

ALTER TABLE public.entitlements
ADD PRIMARY KEY (user_id, product_id);

-- Add unique constraint on stripe_webhook_events.stripe_event_id for idempotency
ALTER TABLE public.stripe_webhook_events
ADD CONSTRAINT stripe_webhook_events_event_id_unique
UNIQUE (stripe_event_id);

-- RLS: Users can only SELECT their own entitlements
DROP POLICY IF EXISTS "Users can view own entitlements" ON public.entitlements;
CREATE POLICY "Users can view own entitlements" 
ON public.entitlements 
FOR SELECT 
USING (auth.uid() = user_id);

-- RLS: Users can view their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- RLS: Users can view their own stripe_customers
DROP POLICY IF EXISTS "Users can view own stripe_customers" ON public.stripe_customers;
CREATE POLICY "Users can view own stripe_customers" 
ON public.stripe_customers 
FOR SELECT 
USING (auth.uid() = user_id);