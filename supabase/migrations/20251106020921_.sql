-- Create timeline_events table for case timeline builder
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  category TEXT, -- incident, filing, correspondence, evidence, witness, other
  importance TEXT DEFAULT 'medium', -- low, medium, high, critical
  evidence_ids TEXT[], -- array of related evidence IDs
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own timeline events" 
ON public.timeline_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own timeline events" 
ON public.timeline_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timeline events" 
ON public.timeline_events 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own timeline events" 
ON public.timeline_events 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_timeline_events_user_date ON public.timeline_events(user_id, event_date DESC);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_timeline_events_updated_at
BEFORE UPDATE ON public.timeline_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();;
