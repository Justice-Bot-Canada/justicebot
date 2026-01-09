-- Add missing venue column to cases
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS venue text;

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  email text NOT NULL,
  name text,
  phone text,
  source text,
  status text DEFAULT 'new',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Create case_events table
CREATE TABLE IF NOT EXISTS public.case_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_date timestamp with time zone NOT NULL,
  event_type text NOT NULL DEFAULT 'general',
  priority text DEFAULT 'medium',
  location text,
  reminder_sent boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view events for their cases" ON public.case_events FOR SELECT USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_events.case_id AND cases.user_id = auth.uid()));
CREATE POLICY "Users can create events for their cases" ON public.case_events FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_events.case_id AND cases.user_id = auth.uid()));
CREATE POLICY "Users can update events for their cases" ON public.case_events FOR UPDATE USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_events.case_id AND cases.user_id = auth.uid()));
CREATE POLICY "Users can delete events for their cases" ON public.case_events FOR DELETE USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_events.case_id AND cases.user_id = auth.uid()));

-- Create timeline_events table
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users,
  title text NOT NULL,
  description text,
  event_date timestamp with time zone NOT NULL,
  event_time text,
  category text DEFAULT 'general',
  importance text DEFAULT 'medium',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own timeline events" ON public.timeline_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own timeline events" ON public.timeline_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own timeline events" ON public.timeline_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own timeline events" ON public.timeline_events FOR DELETE USING (auth.uid() = user_id);

-- Create case_milestones table
CREATE TABLE IF NOT EXISTS public.case_milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  milestone_type text NOT NULL,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.case_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view milestones for their cases" ON public.case_milestones FOR SELECT USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_milestones.case_id AND cases.user_id = auth.uid()));
CREATE POLICY "Users can create milestones for their cases" ON public.case_milestones FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_milestones.case_id AND cases.user_id = auth.uid()));
CREATE POLICY "Users can update milestones for their cases" ON public.case_milestones FOR UPDATE USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_milestones.case_id AND cases.user_id = auth.uid()));
CREATE POLICY "Users can delete milestones for their cases" ON public.case_milestones FOR DELETE USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_milestones.case_id AND cases.user_id = auth.uid()));

-- Create case_deadlines table
CREATE TABLE IF NOT EXISTS public.case_deadlines (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamp with time zone NOT NULL,
  priority text DEFAULT 'medium',
  status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.case_deadlines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view deadlines for their cases" ON public.case_deadlines FOR SELECT USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_deadlines.case_id AND cases.user_id = auth.uid()));
CREATE POLICY "Users can create deadlines for their cases" ON public.case_deadlines FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_deadlines.case_id AND cases.user_id = auth.uid()));
CREATE POLICY "Users can update deadlines for their cases" ON public.case_deadlines FOR UPDATE USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_deadlines.case_id AND cases.user_id = auth.uid()));
CREATE POLICY "Users can delete deadlines for their cases" ON public.case_deadlines FOR DELETE USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_deadlines.case_id AND cases.user_id = auth.uid()));

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users,
  case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL,
  form_key text,
  title text NOT NULL,
  content text,
  file_path text,
  file_type text,
  status text DEFAULT 'draft',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own documents" ON public.documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON public.documents FOR DELETE USING (auth.uid() = user_id);