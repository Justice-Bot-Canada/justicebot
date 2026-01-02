-- Add progress tracking columns to cases table
ALTER TABLE public.cases 
ADD COLUMN IF NOT EXISTS timeline_viewed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS merit_score_status TEXT DEFAULT 'pending' CHECK (merit_score_status IN ('pending', 'calculating', 'complete', 'failed'));