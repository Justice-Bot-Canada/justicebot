-- Add decision_result_json to cases so the UI can render from stored results
ALTER TABLE public.cases
ADD COLUMN IF NOT EXISTS decision_result_json jsonb;

-- Helpful index for debug/lookups (optional)
CREATE INDEX IF NOT EXISTS idx_cases_decision_result_json_gin
ON public.cases
USING gin (decision_result_json);
