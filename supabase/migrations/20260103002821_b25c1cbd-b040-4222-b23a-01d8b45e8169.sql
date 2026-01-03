-- Add selected_province to profiles (user-level preference)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS selected_province TEXT;

-- Add flow_step to cases (source of truth per case - supports multiple cases)
ALTER TABLE cases
ADD COLUMN IF NOT EXISTS flow_step TEXT DEFAULT 'welcome'
  CHECK (flow_step IN ('welcome', 'triage', 'evidence', 'timeline', 'documents', 'complete'));

-- Add triage_complete boolean for explicit tracking (not just "visited page")
ALTER TABLE cases
ADD COLUMN IF NOT EXISTS triage_complete BOOLEAN DEFAULT false;

-- Create index for quick lookup of active cases by flow step
CREATE INDEX IF NOT EXISTS idx_cases_flow_step ON cases(user_id, flow_step);

-- Comment for clarity
COMMENT ON COLUMN profiles.selected_province IS 'User preferred province for new cases';
COMMENT ON COLUMN cases.flow_step IS 'Current step in the guided legal preparation flow';
COMMENT ON COLUMN cases.triage_complete IS 'Whether user completed the AI triage questionnaire';