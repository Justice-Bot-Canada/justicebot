-- Create admin_grant product
INSERT INTO public.products (id, name, active)
VALUES ('admin_grant_premium', 'Admin Grant Premium', true)
ON CONFLICT (id) DO NOTHING;

-- Grant premium entitlement to terri.bertin57@gmail.com
INSERT INTO public.entitlements (user_id, product_id, access_level, source, starts_at)
VALUES (
  '9580a5d2-ddf4-4a5b-b8d5-f292ccf5794b',
  'admin_grant_premium',
  'premium',
  'admin_grant',
  now()
)
ON CONFLICT (user_id, product_id) DO UPDATE SET
  access_level = 'premium',
  source = 'admin_grant',
  starts_at = now(),
  ends_at = NULL;