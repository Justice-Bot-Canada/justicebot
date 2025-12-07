-- Create function to send welcome email on new user signup
CREATE OR REPLACE FUNCTION public.send_welcome_email_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  payload jsonb;
  resp jsonb;
  func_url text;
BEGIN
  -- Build the payload
  payload := jsonb_build_object(
    'userId', NEW.id,
    'email', NEW.email,
    'name', COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'display_name', '')
  );

  -- Get the function URL (uses project ref)
  func_url := 'https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/send-welcome-email';

  -- Make HTTP request to edge function
  SELECT net.http_post(
    url := func_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key', true)
    ),
    body := payload
  ) INTO resp;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block signup
    RAISE WARNING 'Failed to send welcome email: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users for new signups
DROP TRIGGER IF EXISTS on_auth_user_created_send_welcome ON auth.users;
CREATE TRIGGER on_auth_user_created_send_welcome
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email_on_signup();