-- Insert Family Law Forms
INSERT INTO public.forms (form_code, title, description, category, tribunal_type, is_active, price_cents, purchasable, instructions) VALUES
('ON-FLR-8', 'Form 8 - Application (General)', 'General application form for starting most family law cases', 'family', 'family_court', true, 0, true, 'Complete all sections accurately. Attach required schedules based on your case type.'),
('ON-FLR-8A', 'Form 8A - Application (Divorce)', 'Application to start a divorce case', 'family_divorce', 'family_court', true, 0, true, 'Required to start divorce proceedings. Must include marriage certificate and proof of separation.'),
('ON-FLR-8B', 'Form 8B - Application (Child, Spousal or Family Support)', 'Application for child or spousal support', 'family_support', 'family_court', true, 0, true, 'Include financial statement Form 13 or 13.1 with this application.'),
('ON-FLR-8B1', 'Form 8B.1 - Application (Child Protection)', 'Application for child protection matters (CAS cases)', 'child_protection', 'family_court', true, 0, true, 'Used in child protection proceedings involving CAS. Legal aid is available.'),
('ON-FLR-10', 'Form 10 - Answer', 'Response to a family law application', 'family', 'family_court', true, 0, true, 'Must be filed within 30 days of being served with the application.'),
('ON-FLR-13', 'Form 13 - Financial Statement (Support Claims)', 'Financial disclosure for support claims under $150k income', 'family_financial', 'family_court', true, 0, true, 'Required when claiming or responding to child or spousal support. Update annually.'),
('ON-FLR-13-1', 'Form 13.1 - Financial Statement (Property & Support Claims)', 'Financial disclosure for property and support claims', 'family_financial', 'family_court', true, 0, true, 'Use this form if property division is involved or income exceeds $150,000.'),
('ON-FLR-35-1', 'Form 35.1 - Affidavit (Decision-Making, Parenting Time, Contact)', 'Affidavit for custody and access matters', 'family_custody', 'family_court', true, 0, true, 'Required when seeking decision-making responsibility or parenting time arrangements.'),
('ON-FLR-36', 'Form 36 - Affidavit for Divorce', 'Sworn statement of facts for divorce application', 'family_divorce', 'family_court', true, 0, true, 'Must be sworn before a commissioner for taking affidavits. Include proof of service.'),
('ON-FLR-25A', 'Form 25A - Divorce Order', 'Final divorce order', 'family_divorce', 'family_court', true, 0, true, 'The final order granting divorce. Takes effect 31 days after being issued.'),
('ON-FLR-34L', 'Form 34L - Application (Change/Terminate Openness Order)', 'Application to change or end openness order in adoption', 'child_protection', 'family_court', true, 0, true, 'Used to modify openness agreements in adoption cases.'),
('ON-OCL-001', 'OCL Intake Form - Custody/Access', 'Intake form when judge orders Children''s Lawyer involvement', 'child_protection', 'family_court', true, 0, true, 'Complete when Office of Children''s Lawyer is appointed to represent child''s interests.')
ON CONFLICT (form_code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_active = true,
  updated_at = now();

-- Insert Criminal Forms
INSERT INTO public.forms (form_code, title, description, category, tribunal_type, is_active, price_cents, purchasable, instructions) VALUES
('ON-CRIM-5-1', 'Form 5.1 - Undertaking Given to Peace Officer', 'Promise to police officer regarding bail conditions', 'criminal_bail', 'criminal_court', true, 0, true, 'Sign only if you understand and can comply with all conditions. Breach can result in charges.'),
('ON-CRIM-11', 'Form 11 - Recognizance (Officer in Charge)', 'Bail recognizance entered before officer in charge', 'criminal_bail', 'criminal_court', true, 0, true, 'This is your bail document. Keep a copy and follow all conditions strictly.'),
('ON-CRIM-32', 'Form 32 - Recognizance', 'General recognizance for various Criminal Code sections', 'criminal_bail', 'criminal_court', true, 0, true, 'Used for peace bonds and various bail conditions. Seek legal advice before signing.'),
('ON-CR-OCJ', 'Criminal Rules Forms (Ontario Court of Justice)', 'Various criminal procedure forms for OCJ', 'criminal', 'criminal_court', true, 0, true, 'Collection of procedural forms for Ontario Court of Justice criminal proceedings.'),
('ON-CR-SCJ', 'Criminal Proceedings Rules Forms (Superior Court)', 'Criminal procedure forms for Superior Court', 'criminal', 'criminal_court', true, 0, true, 'Forms for Superior Court of Justice criminal proceedings and appeals.')
ON CONFLICT (form_code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_active = true,
  updated_at = now();

-- Insert additional HRTO Forms
INSERT INTO public.forms (form_code, title, description, category, tribunal_type, is_active, price_cents, purchasable, instructions) VALUES
('ON-HRTO-F2', 'HRTO Form 2 - Response', 'Response to human rights application', 'human_rights', 'hrto', true, 0, true, 'File within 35 days of receiving the application. Include all defences and evidence.'),
('ON-HRTO-SCHEDULE-A', 'HRTO Schedule A - Details of Application', 'Detailed description of discrimination allegations', 'human_rights', 'hrto', true, 0, true, 'Attach to Form 1. Be specific about dates, locations, people involved, and impacts.')
ON CONFLICT (form_code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_active = true,
  updated_at = now();;
