-- Create storage buckets for evidence and legal documents
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('legal-docs', 'legal-docs', true);

-- Create cases table
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  province TEXT NOT NULL,
  municipality TEXT,
  law_section TEXT,
  merit_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create evidence table
CREATE TABLE public.evidence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  description TEXT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create legal_pathways table
CREATE TABLE public.legal_pathways (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  pathway_type TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  confidence_score INTEGER NOT NULL DEFAULT 0,
  relevant_laws JSONB,
  next_steps JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pathways ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cases
CREATE POLICY "Users can view their own cases" 
ON public.cases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cases" 
ON public.cases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cases" 
ON public.cases 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cases" 
ON public.cases 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for evidence
CREATE POLICY "Users can view evidence for their cases" 
ON public.evidence 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.cases 
  WHERE cases.id = evidence.case_id 
  AND cases.user_id = auth.uid()
));

CREATE POLICY "Users can add evidence to their cases" 
ON public.evidence 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.cases 
  WHERE cases.id = evidence.case_id 
  AND cases.user_id = auth.uid()
));

CREATE POLICY "Users can update evidence for their cases" 
ON public.evidence 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.cases 
  WHERE cases.id = evidence.case_id 
  AND cases.user_id = auth.uid()
));

CREATE POLICY "Users can delete evidence for their cases" 
ON public.evidence 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.cases 
  WHERE cases.id = evidence.case_id 
  AND cases.user_id = auth.uid()
));

-- Create RLS policies for legal_pathways
CREATE POLICY "Users can view pathways for their cases" 
ON public.legal_pathways 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.cases 
  WHERE cases.id = legal_pathways.case_id 
  AND cases.user_id = auth.uid()
));

CREATE POLICY "System can create pathways" 
ON public.legal_pathways 
FOR INSERT 
WITH CHECK (true);

-- Create storage policies for evidence bucket
CREATE POLICY "Users can view their own evidence files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own evidence files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own evidence files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own evidence files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for legal-docs bucket (public read)
CREATE POLICY "Legal documents are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'legal-docs');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cases_updated_at
BEFORE UPDATE ON public.cases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();