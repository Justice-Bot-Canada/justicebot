-- Insert HRTO form sources (simple insert, no conflict handling)
INSERT INTO form_sources (form_code, name, jurisdiction, region, venue_code, official_pdf_url, official_page_url, status, is_active)
VALUES 
  ('HRTO-Form-1', 'HRTO Form 1 - Application (Individual)', 'CA', 'CA-ON', 'HRTO', 'https://tribunalsontario.ca/documents/sjto/HRTO_Form1.pdf', 'https://tribunalsontario.ca/hrto/forms-and-filing/', 'active', true),
  ('HRTO-Form-1G', 'HRTO Form 1G - Application (Group)', 'CA', 'CA-ON', 'HRTO', 'https://tribunalsontario.ca/documents/sjto/HRTO_Form1G.pdf', 'https://tribunalsontario.ca/hrto/forms-and-filing/', 'active', true),
  ('HRTO-Form-2', 'HRTO Form 2 - Response', 'CA', 'CA-ON', 'HRTO', 'https://tribunalsontario.ca/documents/sjto/HRTO_Form2.pdf', 'https://tribunalsontario.ca/hrto/forms-and-filing/', 'active', true),
  ('HRTO-Form-3', 'HRTO Form 3 - Reply', 'CA', 'CA-ON', 'HRTO', 'https://tribunalsontario.ca/documents/sjto/HRTO_Form3.pdf', 'https://tribunalsontario.ca/hrto/forms-and-filing/', 'active', true);

-- Insert form templates for each HRTO form source
INSERT INTO form_templates (form_source_id, enabled, field_mappings)
SELECT id, true, '{}'::jsonb
FROM form_sources 
WHERE venue_code = 'HRTO';

-- Also insert into legacy forms table for backwards compatibility
INSERT INTO forms (form_code, title, description, tribunal_type, category, is_active, pdf_url, price_cents)
VALUES 
  ('HRTO-Form-1', 'HRTO Form 1 - Application (Individual)', 'File a human rights complaint as an individual applicant', 'HRTO', 'human_rights', true, 'https://tribunalsontario.ca/documents/sjto/HRTO_Form1.pdf', 0),
  ('HRTO-Form-1G', 'HRTO Form 1G - Application (Group)', 'File a human rights complaint on behalf of a group', 'HRTO', 'human_rights', true, 'https://tribunalsontario.ca/documents/sjto/HRTO_Form1G.pdf', 0),
  ('HRTO-Form-2', 'HRTO Form 2 - Response', 'Respond to a human rights application filed against you', 'HRTO', 'human_rights', true, 'https://tribunalsontario.ca/documents/sjto/HRTO_Form2.pdf', 0),
  ('HRTO-Form-3', 'HRTO Form 3 - Reply', 'Reply to a response in a human rights application', 'HRTO', 'human_rights', true, 'https://tribunalsontario.ca/documents/sjto/HRTO_Form3.pdf', 0);