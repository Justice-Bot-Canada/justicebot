-- Insert LTB Forms (T1, T2, T6)
INSERT INTO forms (form_code, title, description, category, tribunal_type, price_cents, is_active, form_fields, filing_requirements, instructions) VALUES
(
  'LTB-T1',
  'Tenant Application About a Rent Increase Above the Guideline',
  'Use this form if your landlord has increased your rent above the guideline amount without proper approval',
  'tenant_rights',
  'Landlord and Tenant Board',
  0,
  true,
  '{"sections": [{"title": "Applicant Information", "fields": ["full_name", "address", "phone", "email"]}, {"title": "Landlord Information", "fields": ["landlord_name", "landlord_address"]}, {"title": "Rental Unit Details", "fields": ["unit_address", "monthly_rent", "rent_increase_amount", "rent_increase_date"]}, {"title": "Grounds for Application", "fields": ["issue_description", "supporting_details"]}]}'::jsonb,
  '{"fee": "$53", "copies": "3 copies required", "service": "Must serve landlord", "deadline": "File within 1 year"}'::jsonb,
  'Complete all sections. Attach supporting documents such as rent receipts, notice of rent increase, and any correspondence with landlord.'
),
(
  'LTB-T2',
  'Tenant Application About Tenant Rights',
  'Use this form if your landlord has breached your rights (harassment, illegal entry, interference with utilities, etc.)',
  'tenant_rights',
  'Landlord and Tenant Board',
  0,
  true,
  '{"sections": [{"title": "Applicant Information", "fields": ["full_name", "address", "phone", "email"]}, {"title": "Landlord Information", "fields": ["landlord_name", "landlord_address"]}, {"title": "Rental Unit Details", "fields": ["unit_address", "monthly_rent", "move_in_date"]}, {"title": "Issues", "fields": ["issue_type", "issue_description", "dates_of_incidents", "witnesses"]}, {"title": "Remedy Sought", "fields": ["rent_abatement_amount", "other_remedies"]}]}'::jsonb,
  '{"fee": "$53", "copies": "3 copies required", "service": "Must serve landlord", "deadline": "File within 1 year of incident"}'::jsonb,
  'Document each incident with dates, times, and details. Include photos, emails, text messages as evidence. You can claim rent abatement for the period you were affected.'
),
(
  'LTB-T6',
  'Tenant Application About Maintenance',
  'Use this form if your landlord has failed to maintain the rental unit or complex in a good state of repair',
  'maintenance',
  'Landlord and Tenant Board',
  0,
  true,
  '{"sections": [{"title": "Applicant Information", "fields": ["full_name", "address", "phone", "email"]}, {"title": "Landlord Information", "fields": ["landlord_name", "landlord_address"]}, {"title": "Rental Unit Details", "fields": ["unit_address", "monthly_rent"]}, {"title": "Maintenance Issues", "fields": ["issue_description", "date_first_reported", "dates_of_follow_ups", "health_safety_concerns"]}, {"title": "Remedy Sought", "fields": ["repair_order", "rent_abatement_amount"]}]}'::jsonb,
  '{"fee": "$53", "copies": "3 copies required", "service": "Must serve landlord", "deadline": "No deadline but file promptly"}'::jsonb,
  'Take dated photos/videos of issues. Keep copies of all communications with landlord. Document how issues affect your use of the unit. Inspection reports are helpful.'
)
ON CONFLICT (form_code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  tribunal_type = EXCLUDED.tribunal_type,
  form_fields = EXCLUDED.form_fields,
  filing_requirements = EXCLUDED.filing_requirements,
  instructions = EXCLUDED.instructions,
  is_active = EXCLUDED.is_active;
;
