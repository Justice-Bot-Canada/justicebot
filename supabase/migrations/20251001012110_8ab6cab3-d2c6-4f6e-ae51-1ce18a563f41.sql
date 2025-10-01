-- Tutorial Videos Table
CREATE TABLE public.tutorial_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  pathway_type TEXT NOT NULL,
  step_number INTEGER,
  duration_seconds INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Document Templates Table
CREATE TABLE public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  template_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  preview_content TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Case Milestones Table
CREATE TABLE public.case_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL,
  milestone_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Referral Program Tables
CREATE TABLE public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  uses_count INTEGER NOT NULL DEFAULT 0,
  total_credits_earned NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL,
  referred_user_id UUID NOT NULL,
  referral_code TEXT NOT NULL,
  credit_amount NUMERIC NOT NULL DEFAULT 5.00,
  status TEXT NOT NULL DEFAULT 'pending',
  credited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  source TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Support Tickets Table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL,
  sender_type TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tutorial_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Tutorial Videos
CREATE POLICY "Tutorial videos are viewable by everyone"
ON public.tutorial_videos
FOR SELECT
USING (is_active = true);

-- RLS Policies for Document Templates
CREATE POLICY "Templates are viewable by authenticated users"
ON public.document_templates
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies for Case Milestones
CREATE POLICY "Users can view their case milestones"
ON public.case_milestones
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM cases
  WHERE cases.id = case_milestones.case_id
  AND cases.user_id = auth.uid()
));

CREATE POLICY "Users can update their case milestones"
ON public.case_milestones
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM cases
  WHERE cases.id = case_milestones.case_id
  AND cases.user_id = auth.uid()
));

-- RLS Policies for Referral Program
CREATE POLICY "Users can view their own referral codes"
ON public.referral_codes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referral codes"
ON public.referral_codes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their referrals"
ON public.referrals
FOR SELECT
USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

CREATE POLICY "Users can view their credits"
ON public.user_credits
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for Support
CREATE POLICY "Users can view their own tickets"
ON public.support_tickets
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view messages for their tickets"
ON public.support_messages
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM support_tickets
  WHERE support_tickets.id = support_messages.ticket_id
  AND support_tickets.user_id = auth.uid()
));

-- Create indexes
CREATE INDEX idx_tutorial_videos_category ON public.tutorial_videos(category);
CREATE INDEX idx_tutorial_videos_pathway ON public.tutorial_videos(pathway_type);
CREATE INDEX idx_document_templates_category ON public.document_templates(category);
CREATE INDEX idx_case_milestones_case_id ON public.case_milestones(case_id);
CREATE INDEX idx_referral_codes_user_id ON public.referral_codes(user_id);
CREATE INDEX idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX idx_user_credits_user_id ON public.user_credits(user_id);
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_messages_ticket_id ON public.support_messages(ticket_id);

-- Create triggers
CREATE TRIGGER update_tutorial_videos_updated_at
BEFORE UPDATE ON public.tutorial_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at
BEFORE UPDATE ON public.document_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();