-- Create low_income_applications table for income verification
CREATE TABLE public.low_income_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  annual_income INTEGER NOT NULL,
  household_size INTEGER NOT NULL,
  employment_status TEXT NOT NULL,
  proof_of_income_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.low_income_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can create their own applications" 
ON public.low_income_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications" 
ON public.low_income_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.low_income_applications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_low_income_applications_updated_at
BEFORE UPDATE ON public.low_income_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for income proof documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('income-proof', 'income-proof', false);

-- Create storage policies for income proof uploads
CREATE POLICY "Users can upload their own income proof" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'income-proof' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own income proof" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'income-proof' AND auth.uid()::text = (storage.foldername(name))[1]);;
