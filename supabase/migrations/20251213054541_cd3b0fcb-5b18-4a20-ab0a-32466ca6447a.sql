-- Schedule email queue processing every 5 minutes
SELECT cron.schedule(
  'process-email-queue',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/process-email-queue',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrenF1emp0ZXdxaGNpc3Zoc3ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTYwODEsImV4cCI6MjA3NDE3MjA4MX0.g2NbpEw7MXx1p7ipGhtEVfkbtEwfd9Ebuw2nO44F584"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);