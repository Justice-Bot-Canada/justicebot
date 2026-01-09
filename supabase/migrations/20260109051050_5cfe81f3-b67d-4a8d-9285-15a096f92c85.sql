-- Add missing columns to case_events
ALTER TABLE public.case_events ADD COLUMN IF NOT EXISTS status text DEFAULT 'scheduled';

-- Add missing columns to forms table
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS pdf_url text;
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS purchasable boolean DEFAULT false;

-- Create document_templates table
CREATE TABLE IF NOT EXISTS public.document_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  template_type text NOT NULL,
  file_path text,
  preview_content text,
  download_count integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  province text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Document templates are publicly viewable" ON public.document_templates FOR SELECT USING (true);

-- Create evidence_analysis table
CREATE TABLE IF NOT EXISTS public.evidence_analysis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evidence_id uuid NOT NULL REFERENCES public.evidence(id) ON DELETE CASCADE,
  analysis_data jsonb,
  summary text,
  relevance_score integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.evidence_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view analysis for their evidence" ON public.evidence_analysis FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM evidence e
    JOIN cases c ON c.id = e.case_id
    WHERE e.id = evidence_analysis.evidence_id AND c.user_id = auth.uid()
  )
);

-- Create evidence_metadata table
CREATE TABLE IF NOT EXISTS public.evidence_metadata (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evidence_id uuid NOT NULL REFERENCES public.evidence(id) ON DELETE CASCADE,
  key text NOT NULL,
  value text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.evidence_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage metadata for their evidence" ON public.evidence_metadata FOR ALL USING (
  EXISTS (
    SELECT 1 FROM evidence e
    JOIN cases c ON c.id = e.case_id
    WHERE e.id = evidence_metadata.evidence_id AND c.user_id = auth.uid()
  )
);

-- Create user_feedback table
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  rating integer,
  feedback_type text,
  message text,
  page_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create feedback" ON public.user_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own feedback" ON public.user_feedback FOR SELECT USING (auth.uid() = user_id);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users,
  form_id uuid REFERENCES public.forms(id),
  amount integer NOT NULL,
  currency text DEFAULT 'cad',
  status text DEFAULT 'pending',
  stripe_payment_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users,
  subject text NOT NULL,
  description text,
  status text DEFAULT 'open',
  priority text DEFAULT 'medium',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create support_messages table
CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users,
  sender_type text NOT NULL DEFAULT 'user',
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages for their tickets" ON public.support_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = support_messages.ticket_id AND support_tickets.user_id = auth.uid())
);
CREATE POLICY "Users can create messages for their tickets" ON public.support_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = support_messages.ticket_id AND support_tickets.user_id = auth.uid())
);

-- Create referral_codes table
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users,
  code text NOT NULL UNIQUE,
  uses integer DEFAULT 0,
  max_uses integer,
  discount_percent integer DEFAULT 10,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own referral codes" ON public.referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create referral codes" ON public.referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid NOT NULL REFERENCES auth.users,
  referred_id uuid REFERENCES auth.users,
  referral_code_id uuid REFERENCES public.referral_codes(id),
  status text DEFAULT 'pending',
  reward_amount integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users,
  title text NOT NULL,
  message text,
  type text DEFAULT 'info',
  read boolean DEFAULT false,
  link text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create saved_documents table
CREATE TABLE IF NOT EXISTS public.saved_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users,
  case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL,
  title text NOT NULL,
  document_type text,
  content text,
  file_path text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.saved_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their saved documents" ON public.saved_documents FOR ALL USING (auth.uid() = user_id);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users UNIQUE,
  email_notifications boolean DEFAULT true,
  deadline_reminders boolean DEFAULT true,
  marketing_emails boolean DEFAULT false,
  theme text DEFAULT 'light',
  language text DEFAULT 'en',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  name text NOT NULL,
  role text,
  content text NOT NULL,
  rating integer DEFAULT 5,
  is_approved boolean DEFAULT false,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved testimonials are public" ON public.testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);