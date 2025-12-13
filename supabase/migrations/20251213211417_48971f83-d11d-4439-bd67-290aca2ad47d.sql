-- Schedule daily CanLII case law sweep at 6am UTC (1am EST)
SELECT cron.schedule(
  'sweep-canlii-updates',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/sweep-canlii-updates',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'::jsonb
  );
  $$
);