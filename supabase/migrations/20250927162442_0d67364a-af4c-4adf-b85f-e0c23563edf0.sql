-- Fix the existing evidence_tsvector_trigger function to use correct column names
CREATE OR REPLACE FUNCTION public.evidence_tsvector_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  new.content_tsvector := to_tsvector('english', coalesce(new.file_name,'') || ' ' || coalesce(new.description,''));
  return new;
end
$function$;

-- Add new columns to evidence table for enhanced Evidence Builder functionality
ALTER TABLE public.evidence 
ADD COLUMN tags text[] DEFAULT '{}',
ADD COLUMN page_count integer DEFAULT 1,
ADD COLUMN ocr_text text DEFAULT NULL,
ADD COLUMN order_index integer DEFAULT 0,
ADD COLUMN redacted_regions jsonb DEFAULT '[]';

-- Create indexes for better performance
CREATE INDEX idx_evidence_tags ON public.evidence USING GIN(tags);
CREATE INDEX idx_evidence_order_index ON public.evidence (case_id, order_index);
CREATE INDEX idx_evidence_ocr_text ON public.evidence USING GIN(to_tsvector('english', coalesce(ocr_text, '')));

-- Update existing records with proper order_index based on upload_date
WITH ordered_evidence AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY case_id ORDER BY upload_date) - 1 as new_order
  FROM public.evidence
)
UPDATE public.evidence 
SET order_index = ordered_evidence.new_order
FROM ordered_evidence
WHERE evidence.id = ordered_evidence.id;