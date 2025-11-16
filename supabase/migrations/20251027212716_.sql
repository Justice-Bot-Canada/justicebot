-- Add pdf_url column to forms table to store official form PDF URLs
ALTER TABLE public.forms 
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_forms_pdf_url ON public.forms(pdf_url);

-- Update existing forms with known PDF URLs from Ontario courts
UPDATE public.forms SET pdf_url = 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T2.pdf'
WHERE form_code = 'T2' OR form_code = 'ON-LTB-T2';

UPDATE public.forms SET pdf_url = 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T6.pdf'
WHERE form_code = 'T6' OR form_code = 'ON-LTB-T6';

UPDATE public.forms SET pdf_url = 'https://tribunalsontario.ca/documents/hrto/Application%20Forms/Form%201%20Application.pdf'
WHERE form_code LIKE '%Form%1%' OR form_code = 'ON-HRTO-F1';

UPDATE public.forms SET pdf_url = 'https://tribunalsontario.ca/documents/hrto/Application%20Forms/Form%202%20-%20Response.pdf'
WHERE form_code LIKE '%Form%2%' OR form_code = 'ON-HRTO-F2';

UPDATE public.forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/7A.pdf'
WHERE form_code LIKE '%7A%' OR form_code = 'ON-SCC-7A';

UPDATE public.forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/9A.pdf'
WHERE form_code LIKE '%9A%' OR form_code = 'ON-SCC-9A';

COMMENT ON COLUMN public.forms.pdf_url IS 'URL to the official PDF form from Ontario courts or tribunals';;
