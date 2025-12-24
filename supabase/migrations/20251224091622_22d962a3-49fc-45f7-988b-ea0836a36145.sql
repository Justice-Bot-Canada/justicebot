-- Restrict make_user_admin function to service_role only
REVOKE EXECUTE ON FUNCTION public.make_user_admin(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.make_user_admin(text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.make_user_admin(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.make_user_admin(text) TO service_role;