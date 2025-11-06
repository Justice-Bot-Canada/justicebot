-- Create evidence_analysis table to store AI analysis results
CREATE TABLE IF NOT EXISTS public.evidence_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  analysis_data JSONB NOT NULL,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.evidence_analysis ENABLE ROW LEVEL SECURITY;

-- Users can only see their own analyses
CREATE POLICY "Users can view own evidence analyses"
  ON public.evidence_analysis FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own analyses
CREATE POLICY "Users can create own evidence analyses"
  ON public.evidence_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses
CREATE POLICY "Users can update own evidence analyses"
  ON public.evidence_analysis FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete own evidence analyses"
  ON public.evidence_analysis FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for efficient queries
CREATE INDEX idx_evidence_analysis_user_id ON public.evidence_analysis(user_id);
CREATE INDEX idx_evidence_analysis_case_id ON public.evidence_analysis(case_id);
CREATE INDEX idx_evidence_analysis_created_at ON public.evidence_analysis(created_at DESC);

-- Trigger to update updated_at
CREATE TRIGGER set_evidence_analysis_updated_at
  BEFORE UPDATE ON public.evidence_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();