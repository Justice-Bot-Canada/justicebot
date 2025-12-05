-- Normalize tribunal_type values for consistent querying
-- Update HRTO forms
UPDATE public.forms 
SET tribunal_type = 'hrto' 
WHERE tribunal_type IN ('Human Rights Tribunal of Ontario', 'hrto');

-- Update LTB forms
UPDATE public.forms 
SET tribunal_type = 'ltb' 
WHERE tribunal_type IN ('Landlord and Tenant Board', 'LTB');

-- Update Small Claims forms
UPDATE public.forms 
SET tribunal_type = 'small-claims' 
WHERE tribunal_type IN ('Small Claims Court');

-- Update Family Court forms
UPDATE public.forms 
SET tribunal_type = 'family' 
WHERE tribunal_type IN ('family_court', 'Family Court', 'Superior Court of Justice - Family Court');

-- Update Criminal Court forms
UPDATE public.forms 
SET tribunal_type = 'criminal' 
WHERE tribunal_type IN ('criminal_court', 'Criminal Court', 'Ontario Court of Justice - Criminal Division');

-- Update Labour Board forms
UPDATE public.forms 
SET tribunal_type = 'labour' 
WHERE tribunal_type IN ('Ontario Labour Relations Board', 'Labour Relations Board');

-- Update Superior Court forms
UPDATE public.forms 
SET tribunal_type = 'superior-court' 
WHERE tribunal_type IN ('Superior Court of Justice');

-- Update Divisional Court forms
UPDATE public.forms 
SET tribunal_type = 'divisional' 
WHERE tribunal_type IN ('Divisional Court');