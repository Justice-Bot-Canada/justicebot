-- Fix security definer view by enabling security invoker
ALTER VIEW public.public_feedback SET (security_invoker = on);;
