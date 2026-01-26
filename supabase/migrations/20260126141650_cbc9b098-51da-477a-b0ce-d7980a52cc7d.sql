-- Case Law Analyses table to store CanLII analysis results
CREATE TABLE IF NOT EXISTS public.case_law_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  merit_score INTEGER CHECK (merit_score >= 0 AND merit_score <= 100),
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  outcome_prediction TEXT CHECK (outcome_prediction IN ('favorable', 'unfavorable', 'uncertain')),
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  legal_basis TEXT,
  search_query TEXT,
  jurisdiction TEXT DEFAULT 'ON',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Similar Cases table to store CanLII case matches
CREATE TABLE IF NOT EXISTS public.similar_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.case_law_analyses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  citation TEXT NOT NULL,
  court TEXT,
  decision_date TEXT,
  url TEXT,
  relevance_score DECIMAL(5,2) DEFAULT 0,
  summary TEXT,
  outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.case_law_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.similar_cases ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_case_law_analyses_case_id ON public.case_law_analyses(case_id);
CREATE INDEX idx_case_law_analyses_user_id ON public.case_law_analyses(user_id);
CREATE INDEX idx_similar_cases_analysis_id ON public.similar_cases(analysis_id);

-- RLS policies for case_law_analyses
CREATE POLICY "Users can view their own case law analyses"
  ON public.case_law_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own case law analyses"
  ON public.case_law_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case law analyses"
  ON public.case_law_analyses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own case law analyses"
  ON public.case_law_analyses FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for similar_cases (through analysis ownership)
CREATE POLICY "Users can view similar cases for their analyses"
  ON public.similar_cases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.case_law_analyses
      WHERE case_law_analyses.id = similar_cases.analysis_id
      AND case_law_analyses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create similar cases for their analyses"
  ON public.similar_cases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.case_law_analyses
      WHERE case_law_analyses.id = similar_cases.analysis_id
      AND case_law_analyses.user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_case_law_analyses_updated_at
  BEFORE UPDATE ON public.case_law_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();