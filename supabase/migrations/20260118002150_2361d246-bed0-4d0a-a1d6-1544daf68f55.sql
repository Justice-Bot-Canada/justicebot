-- Allow anonymous users to insert analytics events (for page tracking before login)
CREATE POLICY "Allow anonymous analytics inserts" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);

-- Note: This allows anyone to insert analytics events, which is intentional for tracking