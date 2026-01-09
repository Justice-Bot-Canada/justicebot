-- Add missing columns to case_deadlines table
ALTER TABLE public.case_deadlines ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false;
ALTER TABLE public.case_deadlines ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users;

-- Add missing column to document_templates
ALTER TABLE public.document_templates ADD COLUMN IF NOT EXISTS tags text[];

-- Add missing columns to support_tickets
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS name text;

-- Add missing columns to support_messages
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS sender_name text;
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS message text;

-- Rename content to message if needed (make message alias content)
UPDATE public.support_messages SET message = content WHERE message IS NULL AND content IS NOT NULL;

-- Add missing column to notifications
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS action_url text;

-- Add missing column to profiles for onboarding
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Add missing columns to payments
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_id text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS plan_type text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS captured_at timestamp with time zone;

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  event_type text NOT NULL,
  event_data jsonb,
  page_url text,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own analytics" ON public.analytics_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Create user_credits table for referral program
CREATE TABLE IF NOT EXISTS public.user_credits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users UNIQUE,
  amount integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their credits" ON public.user_credits FOR SELECT USING (auth.uid() = user_id);

-- Add columns to cases for flow tracking
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS flow_step text;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS triage_complete boolean DEFAULT false;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS timeline_viewed boolean DEFAULT false;

-- Add selected_province to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS selected_province text;

-- Add location to testimonials
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS location text;