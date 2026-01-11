-- Create additional missing tables

-- 1. document_templates table
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. support_tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. support_messages table
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'agent', 'bot')),
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. user_feedback table
CREATE TABLE public.user_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug_report', 'feature_request', 'testimonial', 'complaint', 'suggestion')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. evidence_analysis table
CREATE TABLE public.evidence_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evidence_id UUID NOT NULL REFERENCES public.evidence(id) ON DELETE CASCADE,
  analysis_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. evidence_metadata table  
CREATE TABLE public.evidence_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evidence_id UUID NOT NULL REFERENCES public.evidence(id) ON DELETE CASCADE,
  metadata_key TEXT NOT NULL,
  metadata_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  form_id UUID REFERENCES public.forms(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'cad',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_provider TEXT,
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add pdf_url and purchasable columns to forms if missing
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS purchasable BOOLEAN NOT NULL DEFAULT true;

-- Enable RLS on all new tables
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_templates (public read, admin write)
CREATE POLICY "Document templates are publicly viewable" ON public.document_templates
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify templates" ON public.document_templates
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for support_tickets
CREATE POLICY "Users can view their tickets" ON public.support_tickets
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets" ON public.support_tickets
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage tickets" ON public.support_tickets
FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for support_messages
CREATE POLICY "Users can view messages for their tickets" ON public.support_messages
FOR SELECT USING (EXISTS (SELECT 1 FROM public.support_tickets WHERE support_tickets.id = support_messages.ticket_id AND support_tickets.user_id = auth.uid()));

CREATE POLICY "Users can create messages for their tickets" ON public.support_messages
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.support_tickets WHERE support_tickets.id = support_messages.ticket_id AND support_tickets.user_id = auth.uid()));

CREATE POLICY "Service role can manage messages" ON public.support_messages
FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for user_feedback
CREATE POLICY "Users can view their feedback" ON public.user_feedback
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create feedback" ON public.user_feedback
FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Service role can manage feedback" ON public.user_feedback
FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for evidence_analysis
CREATE POLICY "Users can view analysis for their evidence" ON public.evidence_analysis
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.evidence e 
  JOIN public.cases c ON c.id = e.case_id 
  WHERE e.id = evidence_analysis.evidence_id AND c.user_id = auth.uid()
));

CREATE POLICY "Users can create analysis for their evidence" ON public.evidence_analysis
FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.evidence e 
  JOIN public.cases c ON c.id = e.case_id 
  WHERE e.id = evidence_analysis.evidence_id AND c.user_id = auth.uid()
));

-- RLS Policies for evidence_metadata
CREATE POLICY "Users can view metadata for their evidence" ON public.evidence_metadata
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.evidence e 
  JOIN public.cases c ON c.id = e.case_id 
  WHERE e.id = evidence_metadata.evidence_id AND c.user_id = auth.uid()
));

CREATE POLICY "Users can manage metadata for their evidence" ON public.evidence_metadata
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.evidence e 
  JOIN public.cases c ON c.id = e.case_id 
  WHERE e.id = evidence_metadata.evidence_id AND c.user_id = auth.uid()
));

-- RLS Policies for payments
CREATE POLICY "Users can view their payments" ON public.payments
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage payments" ON public.payments
FOR ALL USING (auth.role() = 'service_role');

-- Add triggers for updated_at
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();