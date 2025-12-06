-- Add missing Small Claims Court forms
INSERT INTO forms (form_code, title, description, tribunal_type, category, is_active, price_cents) VALUES
('SC-07A', 'Plaintiff''s Claim', 'Form to start a lawsuit for damages under $35,000', 'small-claims', 'civil', true, 2999),
('SC-09A', 'Defence', 'Form for defending against a small claims lawsuit', 'small-claims', 'civil', true, 2999),
('SC-10A', 'Defendant''s Claim', 'Counterclaim form against the plaintiff', 'small-claims', 'civil', true, 2999),
('SC-11A', 'Affidavit of Service', 'Proof that documents were served', 'small-claims', 'procedural', true, 999),
('SC-11B', 'Request to Clerk', 'General requests to Small Claims Court clerk', 'small-claims', 'procedural', true, 999),
('SC-14A', 'Offer to Settle', 'Formal offer to settle a small claims matter', 'small-claims', 'settlement', true, 999)
ON CONFLICT (form_code) DO NOTHING;

-- Add WSIB forms
INSERT INTO forms (form_code, title, description, tribunal_type, category, is_active, price_cents) VALUES
('WSIB-6', 'Worker''s Report of Injury/Illness', 'Initial injury report from worker', 'wsib', 'claims', true, 0),
('WSIB-7', 'Employer''s Report of Injury/Illness', 'Employer report of workplace injury', 'wsib', 'claims', true, 0),
('WSIB-8', 'Health Professional''s Report', 'Medical assessment for workplace injury', 'wsib', 'medical', true, 0)
ON CONFLICT (form_code) DO NOTHING;

-- Add Superior Court forms
INSERT INTO forms (form_code, title, description, tribunal_type, category, is_active, price_cents) VALUES
('ON-CV-14A', 'Statement of Claim (General)', 'Civil lawsuit over $35,000', 'superior-court', 'civil', true, 2999),
('ON-CV-18A', 'Statement of Defence', 'Defence to civil lawsuit', 'superior-court', 'civil', true, 2999),
('ON-CV-37A', 'Notice of Motion', 'Motion in civil proceedings', 'superior-court', 'procedural', true, 1999),
('ON-CV-4A', 'Consent', 'Consent to court orders', 'superior-court', 'procedural', true, 999),
('ON-CV-4C', 'Affidavit of Service', 'Proof of service in civil matters', 'superior-court', 'procedural', true, 999)
ON CONFLICT (form_code) DO NOTHING;