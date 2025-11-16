-- Create forms table for legal forms management
CREATE TABLE public.forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tribunal_type TEXT NOT NULL,
  price_cents INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  form_fields JSONB,
  instructions TEXT,
  filing_requirements JSONB,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- Create policies for forms (public read access since forms are public resources)
CREATE POLICY "Forms are publicly viewable" 
ON public.forms 
FOR SELECT 
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_forms_updated_at
BEFORE UPDATE ON public.forms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Ontario Landlord Tenant Board forms
INSERT INTO public.forms (form_code, title, description, category, tribunal_type, price_cents, form_fields, instructions, filing_requirements) VALUES 
(
  'T2', 
  'Application About Tenant Rights (T2)', 
  'Use this form to apply for an order about tenant rights including maintenance, vital services, harassment, or illegal entry',
  'Tenant Applications',
  'Landlord and Tenant Board',
  599,
  '{"sections": ["tenant_info", "rental_unit_info", "issue_details", "remedy_sought", "supporting_evidence"]}',
  'Complete all sections. Attach supporting documents. Pay filing fee.',
  '{"documents": ["Lease agreement", "Photos/evidence", "Communication records"], "deadline": "Within 1 year of issue", "fee": "$53 CAD"}'
),
(
  'T6', 
  'Application About Maintenance (T6)', 
  'Use this form when your landlord has not properly maintained the rental unit or residential complex',
  'Tenant Applications', 
  'Landlord and Tenant Board',
  599,
  '{"sections": ["tenant_info", "rental_unit_info", "maintenance_issues", "attempts_to_resolve", "remedy_sought"]}',
  'Document all maintenance issues with photos. Include communication attempts with landlord.',
  '{"documents": ["Photos of issues", "Repair requests", "Landlord correspondence"], "deadline": "Within 1 year", "fee": "$53 CAD"}'
),
(
  'L1',
  'Application to Evict a Tenant for Non-payment of Rent (L1)',
  'Landlords use this form to apply to evict a tenant who has not paid rent',
  'Landlord Applications',
  'Landlord and Tenant Board', 
  599,
  '{"sections": ["landlord_info", "tenant_info", "rental_unit_info", "rent_details", "arrears_calculation"]}',
  'Serve proper notices before filing. Calculate arrears accurately.',
  '{"documents": ["N4 Notice", "Lease agreement", "Rent ledger"], "prerequisite": "N4 notice served", "fee": "$186 CAD"}'
),
(
  'L2',
  'Application to End a Tenancy and Evict a Tenant (L2)', 
  'For evictions based on reasons other than non-payment of rent',
  'Landlord Applications',
  'Landlord and Tenant Board',
  599, 
  '{"sections": ["landlord_info", "tenant_info", "rental_unit_info", "grounds_for_eviction", "notices_served"]}',
  'Ensure proper notice was served for the specific ground claimed.',
  '{"documents": ["Appropriate notice (N5, N6, N7, etc.)", "Evidence supporting claim"], "prerequisite": "Proper notice served", "fee": "$186 CAD"}'
),
(
  'A1',
  'Application to Resolve a Dispute About Rent or Other Money (A1)',
  'For disputes about rent increases, deposits, or other money issues', 
  'General Applications',
  'Landlord and Tenant Board',
  599,
  '{"sections": ["applicant_info", "respondent_info", "dispute_details", "amount_claimed", "resolution_sought"]}',
  'Clearly state the dispute and amount claimed with supporting evidence.',
  '{"documents": ["Receipts", "Lease agreement", "Communication records"], "fee": "$45 CAD"}'
);

-- Create form_usage table to track smart learning
CREATE TABLE public.form_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.forms(id),
  user_id UUID,
  case_id UUID REFERENCES public.cases(id),
  completion_status TEXT DEFAULT 'started',
  field_data JSONB,
  completion_time_minutes INTEGER,
  success_rating INTEGER CHECK (success_rating >= 1 AND success_rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on form_usage
ALTER TABLE public.form_usage ENABLE ROW LEVEL SECURITY;

-- Policies for form_usage (users can only see their own usage)
CREATE POLICY "Users can view their own form usage" 
ON public.form_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own form usage" 
ON public.form_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own form usage" 
ON public.form_usage 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to increment form usage count
CREATE OR REPLACE FUNCTION public.increment_form_usage(form_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.forms 
  SET usage_count = usage_count + 1
  WHERE id = form_id;
END;
$$;;
