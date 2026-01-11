-- Create remaining missing tables and columns

-- 1. notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. referral_codes table
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referee_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. user_credits table
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. case_notes table
CREATE TABLE IF NOT EXISTS public.case_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing columns to cases table
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS flow_step TEXT;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS triage_complete BOOLEAN DEFAULT false;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS timeline_viewed BOOLEAN DEFAULT false;

-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS selected_province TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Add missing columns to payments table
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS plan_type TEXT;

-- Enable RLS on all new tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_notes ENABLE ROW LEVEL SECURITY;

-- RLS for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON public.notifications
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service role can manage notifications" ON public.notifications
FOR ALL USING (auth.role() = 'service_role');

-- RLS for referral_codes
CREATE POLICY "Users can view their referral codes" ON public.referral_codes
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their referral codes" ON public.referral_codes
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS for referrals
CREATE POLICY "Users can view their referrals" ON public.referrals
FOR SELECT USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE POLICY "Service role can manage referrals" ON public.referrals
FOR ALL USING (auth.role() = 'service_role');

-- RLS for user_credits
CREATE POLICY "Users can view their credits" ON public.user_credits
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage credits" ON public.user_credits
FOR ALL USING (auth.role() = 'service_role');

-- RLS for analytics_events (service role only)
CREATE POLICY "Service role can manage analytics" ON public.analytics_events
FOR ALL USING (auth.role() = 'service_role');

-- RLS for testimonials (public read for approved, admin write)
CREATE POLICY "Approved testimonials are public" ON public.testimonials
FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create testimonials" ON public.testimonials
FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS for case_notes
CREATE POLICY "Users can view notes for their cases" ON public.case_notes
FOR SELECT USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_notes.case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can manage notes for their cases" ON public.case_notes
FOR ALL USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_notes.case_id AND cases.user_id = auth.uid()));

-- Create check_free_tier_eligibility function
CREATE OR REPLACE FUNCTION public.check_free_tier_eligibility(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.form_usage 
    WHERE user_id = p_user_id 
    AND completion_status = 'completed'
    LIMIT 1
  );
$$;