-- Add merit_status column for tracking scoring state (pending/complete/error)
ALTER TABLE public.cases 
ADD COLUMN IF NOT EXISTS merit_status text DEFAULT NULL 
CHECK (merit_status IN ('pending', 'complete', 'error', NULL));

-- Add merit_error column for storing error messages
ALTER TABLE public.cases 
ADD COLUMN IF NOT EXISTS merit_error text DEFAULT NULL;

-- Add merit_updated_at for tracking when score was last calculated
ALTER TABLE public.cases 
ADD COLUMN IF NOT EXISTS merit_updated_at timestamp with time zone DEFAULT NULL;

-- Create index for faster status lookups
CREATE INDEX IF NOT EXISTS idx_cases_merit_status ON public.cases(merit_status) WHERE merit_status IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN public.cases.merit_status IS 'Status of merit scoring: pending, complete, or error';
COMMENT ON COLUMN public.cases.merit_error IS 'Error message if merit scoring failed';
COMMENT ON COLUMN public.cases.merit_updated_at IS 'Timestamp when merit score was last calculated';