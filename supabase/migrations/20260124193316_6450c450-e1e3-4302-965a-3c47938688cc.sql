-- Fix: Mark the user's most recent case as triage complete so they can access dashboard
UPDATE cases 
SET triage_complete = true, 
    flow_step = 'evidence',
    updated_at = now()
WHERE id = '63510e49-d3ff-4359-b0e5-45b7dcf13368'
AND user_id = '9580a5d2-ddf4-4a5b-b8d5-f292ccf5794b';