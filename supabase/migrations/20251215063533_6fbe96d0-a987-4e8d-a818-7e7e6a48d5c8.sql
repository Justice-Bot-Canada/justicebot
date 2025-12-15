-- Add British Columbia Forms
INSERT INTO forms (form_code, title, description, tribunal_type, category, is_active, pdf_url, price_cents)
VALUES 
-- BC Residential Tenancy Branch (RTB) Forms
('RTB-1', 'Application for Dispute Resolution', 'BC RTB application to resolve tenancy disputes', 'rtb', 'tenant_rights', true, 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb1.pdf', 2999),
('RTB-2', 'Tenant Notice to End Tenancy', 'BC form for tenant to end tenancy', 'rtb', 'tenant_rights', true, 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb2.pdf', 2999),
('RTB-3', 'Landlord Notice to End Tenancy for Cause', 'BC landlord notice for cause eviction', 'rtb', 'landlord', true, 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb3.pdf', 2999),
('RTB-12', 'Request for Review of Order', 'BC RTB form to request review of decision', 'rtb', 'appeals', true, 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb12.pdf', 2999),
('RTB-26', 'Application for Rent Increase Above Guideline', 'BC landlord application for above-guideline rent increase', 'rtb', 'landlord', true, 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb26.pdf', 2999),

-- BC Human Rights Tribunal (BCHRT) Forms
('BCHRT-1', 'Complaint Form', 'BC Human Rights Tribunal complaint application', 'bchrt', 'human_rights', true, 'https://www.bchrt.bc.ca/complaint-form/', 2999),
('BCHRT-Response', 'Response to Complaint', 'Response to BC Human Rights complaint', 'bchrt', 'human_rights', true, 'https://www.bchrt.bc.ca/response-form/', 2999),

-- BC Small Claims Court Forms
('SCR-1', 'Notice of Claim', 'BC Small Claims Court claim form (under $35,000)', 'small-claims-bc', 'civil', true, 'https://www.provincialcourt.bc.ca/downloads/smallclaims/Forms/SCR%201.pdf', 2999),
('SCR-5', 'Reply', 'BC Small Claims Court reply to claim', 'small-claims-bc', 'civil', true, 'https://www.provincialcourt.bc.ca/downloads/smallclaims/Forms/SCR%205.pdf', 2999),
('SCR-6', 'Counterclaim', 'BC Small Claims Court counterclaim form', 'small-claims-bc', 'civil', true, 'https://www.provincialcourt.bc.ca/downloads/smallclaims/Forms/SCR%206.pdf', 2999),
('SCR-18', 'Application to Set Aside Default Order', 'BC Small Claims application to set aside default judgment', 'small-claims-bc', 'procedural', true, 'https://www.provincialcourt.bc.ca/downloads/smallclaims/Forms/SCR%2018.pdf', 2999),

-- BC Family Court Forms
('F1', 'Notice of Family Claim', 'BC Supreme Court family claim form', 'family-bc', 'family', true, 'https://www.bccourts.ca/supreme_court/documents/form_f1.pdf', 2999),
('F3', 'Response to Family Claim', 'BC Supreme Court family response form', 'family-bc', 'family', true, 'https://www.bccourts.ca/supreme_court/documents/form_f3.pdf', 2999),
('F5', 'Counterclaim', 'BC Supreme Court family counterclaim', 'family-bc', 'family', true, 'https://www.bccourts.ca/supreme_court/documents/form_f5.pdf', 2999),
('F8', 'Notice of Motion', 'BC Supreme Court family motion form', 'family-bc', 'family_motion', true, 'https://www.bccourts.ca/supreme_court/documents/form_f8.pdf', 2999),
('PFA-1', 'Application for Provincial Family Order', 'BC Provincial Court family application', 'family-bc', 'family_provincial', true, 'https://www.provincialcourt.bc.ca/downloads/family/Forms/PFA%201.pdf', 2999),

-- Alberta RTDRS (Residential Tenancy Dispute Resolution Service) Forms
('RTDRS-Application', 'Application for Dispute Resolution', 'Alberta RTDRS tenancy dispute application', 'rtdrs', 'tenant_rights', true, 'https://www.alberta.ca/residential-tenancy-dispute-resolution-service', 2999),
('RTDRS-Response', 'Response to Application', 'Alberta RTDRS response to dispute application', 'rtdrs', 'tenant_rights', true, 'https://www.alberta.ca/residential-tenancy-dispute-resolution-service', 2999),
('RTDRS-Review', 'Request for Review', 'Alberta RTDRS review of order request', 'rtdrs', 'appeals', true, 'https://www.alberta.ca/residential-tenancy-dispute-resolution-service', 2999),

-- Alberta Human Rights Commission Forms
('AHRC-Complaint', 'Human Rights Complaint', 'Alberta Human Rights Commission complaint form', 'ahrc', 'human_rights', true, 'https://www.albertahumanrights.ab.ca/complaints/Pages/complaint_forms.aspx', 2999),
('AHRC-Response', 'Response to Complaint', 'Alberta Human Rights Commission response form', 'ahrc', 'human_rights', true, 'https://www.albertahumanrights.ab.ca/complaints/Pages/complaint_forms.aspx', 2999),

-- Alberta Provincial Court Civil (Small Claims) Forms
('CIV-3001', 'Civil Claim', 'Alberta Provincial Court civil claim (under $50,000)', 'small-claims-ab', 'civil', true, 'https://www.albertacourts.ca/pc/resources/forms/civil', 2999),
('CIV-3002', 'Dispute Note', 'Alberta Provincial Court dispute note (defence)', 'small-claims-ab', 'civil', true, 'https://www.albertacourts.ca/pc/resources/forms/civil', 2999),
('CIV-3005', 'Counterclaim', 'Alberta Provincial Court counterclaim form', 'small-claims-ab', 'civil', true, 'https://www.albertacourts.ca/pc/resources/forms/civil', 2999),
('CIV-3010', 'Application', 'Alberta Provincial Court civil application', 'small-claims-ab', 'procedural', true, 'https://www.albertacourts.ca/pc/resources/forms/civil', 2999),

-- Alberta Family Court Forms
('FL-1', 'Statement of Claim for Divorce', 'Alberta Court of King''s Bench divorce claim', 'family-ab', 'family_divorce', true, 'https://www.albertacourts.ca/qb/resources/forms/family-law', 2999),
('FL-2', 'Statement of Defence', 'Alberta Court of King''s Bench family defence', 'family-ab', 'family', true, 'https://www.albertacourts.ca/qb/resources/forms/family-law', 2999),
('FL-9', 'Application', 'Alberta family law application form', 'family-ab', 'family', true, 'https://www.albertacourts.ca/qb/resources/forms/family-law', 2999),
('FL-10', 'Affidavit', 'Alberta family law affidavit form', 'family-ab', 'family', true, 'https://www.albertacourts.ca/qb/resources/forms/family-law', 2999),
('PC-FAM-1', 'Application for Parenting Order', 'Alberta Provincial Court parenting application', 'family-ab', 'family_custody', true, 'https://www.albertacourts.ca/pc/resources/forms/family', 2999),
('PC-FAM-3', 'Application for Child Support Order', 'Alberta Provincial Court child support application', 'family-ab', 'family_support', true, 'https://www.albertacourts.ca/pc/resources/forms/family', 2999)

ON CONFLICT (form_code) DO NOTHING;