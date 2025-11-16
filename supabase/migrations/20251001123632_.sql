-- Create case_events table for tracking deadlines and court dates
CREATE TABLE IF NOT EXISTS public.case_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'other' CHECK (event_type IN ('filing_deadline', 'court_appearance', 'hearing', 'mediation', 'document_due', 'other')),
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'missed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  location TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;

-- Users can view events for their own cases
CREATE POLICY "Users can view their case events"
  ON public.case_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_events.case_id
      AND cases.user_id = auth.uid()
    )
  );

-- Users can create events for their own cases
CREATE POLICY "Users can create events for their cases"
  ON public.case_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_events.case_id
      AND cases.user_id = auth.uid()
    )
  );

-- Users can update events for their own cases
CREATE POLICY "Users can update their case events"
  ON public.case_events
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_events.case_id
      AND cases.user_id = auth.uid()
    )
  );

-- Users can delete events for their own cases
CREATE POLICY "Users can delete their case events"
  ON public.case_events
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_events.case_id
      AND cases.user_id = auth.uid()
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_case_events_updated_at
  BEFORE UPDATE ON public.case_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_case_events_case_id ON public.case_events(case_id);
CREATE INDEX idx_case_events_event_date ON public.case_events(event_date);;
