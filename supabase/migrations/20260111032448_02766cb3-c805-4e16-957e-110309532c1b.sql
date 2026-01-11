-- Create missing tables for case management

-- 1. case_events table
CREATE TABLE public.case_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'other' CHECK (event_type IN ('court_appearance', 'filing_deadline', 'hearing', 'mediation', 'document_due', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. case_deadlines table  
CREATE TABLE public.case_deadlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. case_milestones table
CREATE TABLE public.case_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. timeline_events table
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  form_key TEXT,
  title TEXT NOT NULL,
  content TEXT,
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'filed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  source TEXT,
  journey TEXT,
  payload JSONB,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add venue column to cases if missing
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS venue TEXT;

-- Enable RLS on all new tables
ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for case_events (access via case ownership)
CREATE POLICY "Users can view events for their cases" ON public.case_events
FOR SELECT USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_events.case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can create events for their cases" ON public.case_events
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_events.case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can update events for their cases" ON public.case_events
FOR UPDATE USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_events.case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can delete events for their cases" ON public.case_events
FOR DELETE USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_events.case_id AND cases.user_id = auth.uid()));

-- RLS Policies for case_deadlines
CREATE POLICY "Users can view their deadlines" ON public.case_deadlines
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their deadlines" ON public.case_deadlines
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their deadlines" ON public.case_deadlines
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their deadlines" ON public.case_deadlines
FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for case_milestones
CREATE POLICY "Users can view milestones for their cases" ON public.case_milestones
FOR SELECT USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_milestones.case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can create milestones for their cases" ON public.case_milestones
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_milestones.case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can update milestones for their cases" ON public.case_milestones
FOR UPDATE USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_milestones.case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can delete milestones for their cases" ON public.case_milestones
FOR DELETE USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_milestones.case_id AND cases.user_id = auth.uid()));

-- RLS Policies for timeline_events
CREATE POLICY "Users can view timeline events for their cases" ON public.timeline_events
FOR SELECT USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = timeline_events.case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can create timeline events for their cases" ON public.timeline_events
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = timeline_events.case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can update timeline events for their cases" ON public.timeline_events
FOR UPDATE USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = timeline_events.case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can delete timeline events for their cases" ON public.timeline_events
FOR DELETE USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = timeline_events.case_id AND cases.user_id = auth.uid()));

-- RLS Policies for documents  
CREATE POLICY "Users can view their documents" ON public.documents
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their documents" ON public.documents
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their documents" ON public.documents
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their documents" ON public.documents
FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for leads (service role only for security)
CREATE POLICY "Service role can manage leads" ON public.leads
FOR ALL USING (auth.role() = 'service_role');

-- Add trigger for documents updated_at
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();