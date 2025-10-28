-- Add actual Ontario government document templates

-- HRTO Form 1 Application
INSERT INTO document_templates (
  title, description, category, template_type, file_path, preview_content, tags, is_premium, download_count
) VALUES (
  'HRTO Form 1 - Individual Application',
  'Official Human Rights Tribunal of Ontario Form 1 for filing individual discrimination complaints',
  'HRTO',
  'application',
  'https://tribunalsontario.ca/documents/hrto/HRTO%20Form%201%20-%20Final%20for%20consultation.pdf',
  'Complete this Form 1 to file an application under the Ontario Human Rights Code for yourself or another person.',
  ARRAY['HRTO', 'human rights', 'discrimination', 'application', 'Form 1'],
  false,
  0
);

-- LTB T2 Application
INSERT INTO document_templates (
  title, description, category, template_type, file_path, preview_content, tags, is_premium, download_count
) VALUES (
  'LTB Form T2 - Application About Tenant Rights',
  'Official Landlord and Tenant Board Form T2 to apply for determinations about tenant rights violations',
  'LTB',
  'application',
  'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T2.pdf',
  'Use this form to apply to have the Board determine whether your landlord entered your rental unit illegally, changed locks, or substantially interfered with your reasonable enjoyment.',
  ARRAY['LTB', 'tenant rights', 'landlord', 'T2', 'rental'],
  false,
  0
);

-- LTB T6 Application
INSERT INTO document_templates (
  title, description, category, template_type, file_path, preview_content, tags, is_premium, download_count
) VALUES (
  'LTB Form T6 - Tenant Application About Maintenance',
  'Official Landlord and Tenant Board Form T6 to apply for maintenance and repair issues',
  'LTB',
  'application',
  'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T6.pdf',
  'Use this form to apply when your landlord has not repaired or maintained the rental unit or residential complex, or has not complied with health, safety, housing or maintenance standards.',
  ARRAY['LTB', 'maintenance', 'repairs', 'T6', 'housing standards'],
  false,
  0
);

-- T2 Instructions
INSERT INTO document_templates (
  title, description, category, template_type, file_path, preview_content, tags, is_premium, download_count
) VALUES (
  'LTB Form T2 - Instructions',
  'Official instructions for completing Form T2 - Application About Tenant Rights',
  'LTB',
  'instructions',
  'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T2_Instructions_20200401.pdf',
  'Detailed step-by-step instructions for completing and filing Form T2, including when to use this application and what to include.',
  ARRAY['LTB', 'instructions', 'T2', 'guide'],
  false,
  0
);

-- T6 Instructions
INSERT INTO document_templates (
  title, description, category, template_type, file_path, preview_content, tags, is_premium, download_count
) VALUES (
  'LTB Form T6 - Instructions',
  'Official instructions for completing Form T6 - Tenant Application About Maintenance',
  'LTB',
  'instructions',
  'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T6_Instructions_20200401.pdf',
  'Detailed step-by-step instructions for completing and filing Form T6, including documenting maintenance issues.',
  ARRAY['LTB', 'instructions', 'T6', 'guide', 'maintenance'],
  false,
  0
);

-- HRTO Applicant's Guide
INSERT INTO document_templates (
  title, description, category, template_type, file_path, preview_content, tags, is_premium, download_count
) VALUES (
  'HRTO Applicant''s Guide',
  'Comprehensive guide to filing an application with the Human Rights Tribunal of Ontario',
  'HRTO',
  'guide',
  'https://tribunalsontario.ca/documents/hrto/Guides/Applicants%20Guide.html',
  'This guide provides general information about filing an Application with the HRTO, general information about the Human Rights Code, and explains how the HRTO will process your application.',
  ARRAY['HRTO', 'guide', 'application process', 'human rights code'],
  false,
  0
);