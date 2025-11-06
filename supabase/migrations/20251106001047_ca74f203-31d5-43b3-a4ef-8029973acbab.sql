-- Create case_deadlines table for Deadline Guardian agent
CREATE TABLE IF NOT EXISTS public.case_deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  completed BOOLEAN NOT NULL DEFAULT false,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.case_deadlines ENABLE ROW LEVEL SECURITY;

-- Users can only see their own deadlines
CREATE POLICY "Users can view own deadlines"
  ON public.case_deadlines FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own deadlines
CREATE POLICY "Users can create own deadlines"
  ON public.case_deadlines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own deadlines
CREATE POLICY "Users can update own deadlines"
  ON public.case_deadlines FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own deadlines
CREATE POLICY "Users can delete own deadlines"
  ON public.case_deadlines FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX idx_case_deadlines_user_id ON public.case_deadlines(user_id);
CREATE INDEX idx_case_deadlines_due_date ON public.case_deadlines(due_date);
CREATE INDEX idx_case_deadlines_completed ON public.case_deadlines(completed);

-- Trigger to update updated_at
CREATE TRIGGER set_case_deadlines_updated_at
  BEFORE UPDATE ON public.case_deadlines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();