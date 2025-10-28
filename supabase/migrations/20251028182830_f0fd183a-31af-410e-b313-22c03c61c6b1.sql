-- Add real Ontario tribunal forms with proper structure
-- T2 Form - Landlord & Tenant Board
INSERT INTO forms (
  form_code,
  title,
  description,
  category,
  tribunal_type,
  price_cents,
  is_active,
  purchasable,
  pdf_url,
  form_fields
) VALUES (
  'T2',
  'Application About Tenant Rights',
  'Use this form if your landlord has interfered with your reasonable enjoyment, withheld a vital service, harassed you, or illegally entered your rental unit.',
  'Tenant Applications',
  'Landlord and Tenant Board',
  599,
  true,
  true,
  'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T2.pdf',
  '[
    {"id": "tenant_name", "label": "Your Full Name", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "tenant_address", "label": "Rental Unit Address", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "tenant_phone", "label": "Phone Number", "type": "tel", "required": true, "section": "Personal Info"},
    {"id": "tenant_email", "label": "Email Address", "type": "email", "required": true, "section": "Personal Info"},
    {"id": "landlord_name", "label": "Landlord Full Name", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "landlord_address", "label": "Landlord Address", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "issue_type", "label": "Type of Issue", "type": "select", "required": true, "section": "Case Details", "options": ["Interference with reasonable enjoyment", "Vital service withheld", "Harassment", "Illegal entry", "Other"]},
    {"id": "issue_description", "label": "Describe what happened", "type": "textarea", "required": true, "section": "Case Details", "help_text": "Provide specific dates, times, and details"},
    {"id": "issue_date", "label": "When did this start?", "type": "date", "required": true, "section": "Case Details"},
    {"id": "remedy_sought", "label": "What remedy are you seeking?", "type": "textarea", "required": true, "section": "Case Details"}
  ]'::jsonb
),
(
  'T6',
  'Application About Maintenance',
  'Use this form if your landlord has failed to maintain the rental property or complex in a good state of repair.',
  'Tenant Applications',
  'Landlord and Tenant Board',
  599,
  true,
  true,
  'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T6.pdf',
  '[
    {"id": "tenant_name", "label": "Your Full Name", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "tenant_address", "label": "Rental Unit Address", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "tenant_phone", "label": "Phone Number", "type": "tel", "required": true, "section": "Personal Info"},
    {"id": "tenant_email", "label": "Email Address", "type": "email", "required": true, "section": "Personal Info"},
    {"id": "landlord_name", "label": "Landlord Full Name", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "landlord_address", "label": "Landlord Address", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "maintenance_issue", "label": "Maintenance Problem", "type": "textarea", "required": true, "section": "Case Details", "help_text": "Describe the maintenance issue in detail"},
    {"id": "issue_date", "label": "When did you first notice this issue?", "type": "date", "required": true, "section": "Case Details"},
    {"id": "landlord_notified", "label": "Did you notify the landlord?", "type": "select", "required": true, "section": "Case Details", "options": ["Yes", "No"]},
    {"id": "notification_date", "label": "Date you notified landlord", "type": "date", "required": false, "section": "Case Details"}
  ]'::jsonb
),
(
  'L1',
  'Application to Evict a Tenant for Non-payment of Rent',
  'Landlords use this form when a tenant has not paid rent and owes rent to the landlord.',
  'Landlord Applications',
  'Landlord and Tenant Board',
  599,
  true,
  true,
  'https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L1.pdf',
  '[
    {"id": "landlord_name", "label": "Your Full Name", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "landlord_address", "label": "Your Address", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "landlord_phone", "label": "Phone Number", "type": "tel", "required": true, "section": "Personal Info"},
    {"id": "landlord_email", "label": "Email Address", "type": "email", "required": true, "section": "Personal Info"},
    {"id": "tenant_name", "label": "Tenant Full Name", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "rental_address", "label": "Rental Unit Address", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "monthly_rent", "label": "Monthly Rent Amount", "type": "number", "required": true, "section": "Case Details"},
    {"id": "rent_arrears", "label": "Total Rent Owed", "type": "number", "required": true, "section": "Case Details"},
    {"id": "first_unpaid_period", "label": "First month not paid", "type": "month", "required": true, "section": "Case Details"}
  ]'::jsonb
),
(
  'Form 1',
  'Human Rights Application',
  'Use this form to file an application claiming discrimination under the Ontario Human Rights Code.',
  'Applications',
  'Human Rights Tribunal of Ontario',
  599,
  true,
  true,
  'https://www.sjto.gov.on.ca/documents/hrto/Application%20Forms/Application.pdf',
  '[
    {"id": "applicant_name", "label": "Your Full Name", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "applicant_address", "label": "Your Address", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "applicant_phone", "label": "Phone Number", "type": "tel", "required": true, "section": "Personal Info"},
    {"id": "applicant_email", "label": "Email Address", "type": "email", "required": true, "section": "Personal Info"},
    {"id": "respondent_name", "label": "Respondent Name (person/organization you are filing against)", "type": "text", "required": true, "section": "Personal Info"},
    {"id": "discrimination_ground", "label": "Ground of Discrimination", "type": "select", "required": true, "section": "Case Details", "options": ["Race", "Ancestry", "Place of origin", "Colour", "Ethnic origin", "Citizenship", "Creed", "Sex", "Sexual orientation", "Gender identity", "Gender expression", "Age", "Marital status", "Family status", "Disability"]},
    {"id": "social_area", "label": "Social Area", "type": "select", "required": true, "section": "Case Details", "options": ["Accommodation (housing)", "Contracts", "Employment", "Services, goods and facilities", "Vocational association"]},
    {"id": "incident_description", "label": "Describe the discrimination", "type": "textarea", "required": true, "section": "Case Details"},
    {"id": "incident_date", "label": "When did this occur?", "type": "date", "required": true, "section": "Case Details"}
  ]'::jsonb
);