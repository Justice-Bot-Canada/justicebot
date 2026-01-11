-- Create final batch of missing tables and columns

-- 1. programs table
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  organization TEXT,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. tutorial_videos table
CREATE TABLE IF NOT EXISTS public.tutorial_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  duration_seconds INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing columns to referral_codes
ALTER TABLE public.referral_codes ADD COLUMN IF NOT EXISTS uses_count INTEGER DEFAULT 0;
ALTER TABLE public.referral_codes ADD COLUMN IF NOT EXISTS total_credits_earned INTEGER DEFAULT 0;

-- Add missing columns to testimonials
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS case_type TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS story TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS outcome TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS date_added TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add missing columns to analytics_events
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS metrics JSONB;

-- Add triage column to cases
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS triage JSONB;

-- Add missing columns to timeline_events
ALTER TABLE public.timeline_events ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.timeline_events ADD COLUMN IF NOT EXISTS is_auto BOOLEAN DEFAULT false;
ALTER TABLE public.timeline_events ADD COLUMN IF NOT EXISTS source TEXT;

-- Enable RLS on new tables
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_videos ENABLE ROW LEVEL SECURITY;

-- RLS for programs (public read)
CREATE POLICY "Programs are publicly viewable" ON public.programs
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage programs" ON public.programs
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS for tutorial_videos (public read)
CREATE POLICY "Tutorial videos are publicly viewable" ON public.tutorial_videos
FOR SELECT USING (true);

CREATE POLICY "Admins can manage tutorials" ON public.tutorial_videos
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create admin helper functions
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE(id UUID, email TEXT, created_at TIMESTAMPTZ, last_sign_in_at TIMESTAMPTZ)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, email::TEXT, created_at, last_sign_in_at
  FROM auth.users
  WHERE public.has_role(auth.uid(), 'admin');
$$;

CREATE OR REPLACE FUNCTION public.get_all_admins()
RETURNS TABLE(user_id UUID, role TEXT, created_at TIMESTAMPTZ)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, role::TEXT, created_at
  FROM public.user_roles
  WHERE role = 'admin'
  AND public.has_role(auth.uid(), 'admin');
$$;

CREATE OR REPLACE FUNCTION public.grant_admin_role(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can grant admin role';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_admin_role(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can revoke admin role';
  END IF;
  
  DELETE FROM public.user_roles
  WHERE user_id = target_user_id AND role = 'admin';
END;
$$;

CREATE OR REPLACE FUNCTION public.get_program_stats(program_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_users', 0,
    'total_cases', 0,
    'total_forms', 0
  ) INTO result;
  
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.export_program_summary(program_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'program_id', program_id,
    'exported_at', now()
  ) INTO result;
  
  RETURN result;
END;
$$;