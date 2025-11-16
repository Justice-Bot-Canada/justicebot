-- Create table to store extracted form prefill data
CREATE TABLE public.form_prefill_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  extracted_data JSONB NOT NULL DEFAULT '{}',
  pathway_type TEXT NOT NULL,
  province TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.form_prefill_data ENABLE ROW LEVEL SECURITY;

-- Create policies for form prefill data
CREATE POLICY "Users can view their own form prefill data" 
ON public.form_prefill_data 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE cases.id = form_prefill_data.case_id 
    AND cases.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own form prefill data" 
ON public.form_prefill_data 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE cases.id = form_prefill_data.case_id 
    AND cases.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own form prefill data" 
ON public.form_prefill_data 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE cases.id = form_prefill_data.case_id 
    AND cases.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_form_prefill_data_updated_at
BEFORE UPDATE ON public.form_prefill_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_form_prefill_data_case_id ON public.form_prefill_data(case_id);
CREATE INDEX idx_form_prefill_data_pathway ON public.form_prefill_data(pathway_type, province);;
