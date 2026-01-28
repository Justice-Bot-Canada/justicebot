-- Insert LTB form sources 
INSERT INTO form_sources (form_code, name, jurisdiction, region, venue_code, official_pdf_url, official_page_url, status, is_active)
VALUES 
  ('LTB-T2', 'LTB T2 - Application about Tenant Rights', 'CA', 'CA-ON', 'LTB', 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T2.pdf', 'https://tribunalsontario.ca/ltb/forms/', 'active', true),
  ('LTB-T6', 'LTB T6 - Tenant Application about Maintenance', 'CA', 'CA-ON', 'LTB', 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T6.pdf', 'https://tribunalsontario.ca/ltb/forms/', 'active', true),
  ('LTB-L1', 'LTB L1 - Application to Evict for Non-payment of Rent', 'CA', 'CA-ON', 'LTB', 'https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L1.pdf', 'https://tribunalsontario.ca/ltb/forms/', 'active', true),
  ('LTB-L2', 'LTB L2 - Application to End a Tenancy and Evict', 'CA', 'CA-ON', 'LTB', 'https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L2.pdf', 'https://tribunalsontario.ca/ltb/forms/', 'active', true);

-- Insert form templates for LTB forms
INSERT INTO form_templates (form_source_id, enabled, field_mappings)
SELECT id, true, '{}'::jsonb
FROM form_sources 
WHERE venue_code = 'LTB';

-- Insert into legacy forms table
INSERT INTO forms (form_code, title, description, tribunal_type, category, is_active, pdf_url, price_cents)
VALUES 
  ('LTB-T2', 'LTB T2 - Application about Tenant Rights', 'Apply when your landlord has substantially interfered with your reasonable enjoyment or violated your legal rights', 'LTB', 'housing', true, 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T2.pdf', 0),
  ('LTB-T6', 'LTB T6 - Tenant Application about Maintenance', 'Apply when your landlord has failed to maintain the rental unit or building', 'LTB', 'housing', true, 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T6.pdf', 0),
  ('LTB-L1', 'LTB L1 - Application to Evict for Non-payment of Rent', 'Landlord application to evict a tenant for non-payment of rent', 'LTB', 'housing', true, 'https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L1.pdf', 0),
  ('LTB-L2', 'LTB L2 - Application to End a Tenancy and Evict', 'Landlord application to end a tenancy and evict a tenant', 'LTB', 'housing', true, 'https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L2.pdf', 0);