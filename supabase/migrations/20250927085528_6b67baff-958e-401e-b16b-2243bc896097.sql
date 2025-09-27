-- Clear existing forms and add comprehensive Ontario court forms
DELETE FROM forms;

-- Family Court Forms
INSERT INTO forms (id, form_code, title, description, category, tribunal_type, price_cents, form_fields, filing_requirements, instructions, is_active) VALUES
(gen_random_uuid(), 'FL-01', 'Application (General)', 'General application form for family court matters including custody, support, and property division', 'Family Court', 'Superior Court of Justice - Family Court', 899, 
'{"sections":["applicant_info","respondent_info","children_info","court_orders_sought","grounds","financial_info"]}',
'{"fee":"$157 CAD","documents":["Marriage certificate","Birth certificates","Financial statements","Previous court orders"],"deadline":"No specific deadline"}',
'Complete all applicable sections. Attach required documents. Pay court fees. Serve on all parties.', true),

(gen_random_uuid(), 'FL-06', 'Affidavit (General)', 'Sworn statement of facts for family court proceedings', 'Family Court', 'Superior Court of Justice - Family Court', 299,
'{"sections":["deponent_info","facts_sworn","exhibits_list","commissioner_info"]}',
'{"fee":"No fee","documents":["Supporting exhibits","Commissioner signature"],"deadline":"As required by court order or rules"}',
'Must be sworn before a commissioner for taking affidavits. Attach all exhibits referenced.', true),

(gen_random_uuid(), 'FL-12', 'Financial Statement (Property and Support Claims)', 'Detailed financial disclosure for support and property claims', 'Family Court', 'Superior Court of Justice - Family Court', 599,
'{"sections":["personal_info","income_details","expenses","assets","debts","other_circumstances"]}',
'{"fee":"No fee","documents":["Income tax returns","Pay stubs","Bank statements","Investment statements"],"deadline":"30 days after filing or as ordered"}',
'Must be completed in full with supporting documentation. Update if circumstances change significantly.', true),

-- Small Claims Court Forms
(gen_random_uuid(), 'SC-00-1', 'Plaintiff''s Claim', 'Form to start a lawsuit in Small Claims Court for claims up to $35,000', 'Small Claims', 'Small Claims Court', 499,
'{"sections":["plaintiff_info","defendant_info","claim_details","amount_claimed","reasons_for_claim"]}',
'{"fee":"$102 CAD (under $6,000), $157 CAD ($6,000-$25,000), $220 CAD (over $25,000)","documents":["Contracts","Receipts","Photos","Correspondence"],"deadline":"2 years from when claim arose"}',
'Clearly state what happened, when it happened, and how much you are claiming. Attach all supporting documents.', true),

(gen_random_uuid(), 'SC-10-1', 'Defence', 'Form for defendant to respond to a plaintiff''s claim', 'Small Claims', 'Small Claims Court', 299,
'{"sections":["defendant_info","response_to_claim","reasons_for_defence","proposals_to_resolve"]}',
'{"fee":"No fee","documents":["Supporting evidence for defence"],"deadline":"20 days after being served"}',
'Admit what is true, deny what is false, and explain your position clearly. File within 20 days to avoid default judgment.', true),

-- Civil Court Forms
(gen_random_uuid(), 'CV-01', 'Statement of Claim', 'Form to start a civil lawsuit in Superior Court', 'Civil Court', 'Superior Court of Justice', 1299,
'{"sections":["plaintiff_info","defendant_info","statement_of_facts","claim_for_relief","damages_sought"]}',
'{"fee":"$157 CAD","documents":["Contracts","Evidence","Expert reports"],"deadline":"2 years from discovery of claim"}',
'Must contain material facts, not evidence or law. Clearly state the relief sought and basis for claim.', true),

(gen_random_uuid(), 'CV-02', 'Statement of Defence', 'Defendant''s response to a statement of claim', 'Civil Court', 'Superior Court of Justice', 699,
'{"sections":["defendant_info","admissions","denials","additional_facts","counterclaim"]}',
'{"fee":"No fee (unless filing counterclaim)","documents":["Supporting evidence"],"deadline":"20 days after service (30 days if served outside Ontario)"}',
'Admit facts that are true, deny facts that are false, and state facts defendant relies on.', true),

-- Criminal Court Forms
(gen_random_uuid(), 'CR-01', 'Information', 'Formal charge document for criminal proceedings', 'Criminal Court', 'Ontario Court of Justice - Criminal Division', 0,
'{"sections":["accused_info","charge_details","informant_info","date_location"]}',
'{"fee":"No fee","documents":["Police report","Evidence"],"deadline":"Within limitation period for offence"}',
'Must clearly state the offence, date, location and accused person. Sworn before justice of the peace.', true),

-- Human Rights Tribunal Forms
(gen_random_uuid(), 'HRTO-1', 'Human Rights Application', 'Application to file a human rights complaint', 'Human Rights', 'Human Rights Tribunal of Ontario', 0,
'{"sections":["applicant_info","respondent_info","grounds_of_discrimination","details_of_incident","remedy_sought"]}',
'{"fee":"No fee","documents":["Evidence of discrimination","Correspondence","Witness statements"],"deadline":"1 year from last incident"}',
'Describe specific incidents of discrimination and how they relate to protected grounds under the Human Rights Code.', true),

-- Labour Relations Board Forms
(gen_random_uuid(), 'LRB-1', 'Application for Certification', 'Union certification application', 'Labour Relations', 'Ontario Labour Relations Board', 0,
'{"sections":["union_info","employer_info","bargaining_unit","membership_evidence","timing_requirements"]}',
'{"fee":"No fee","documents":["Membership cards","Union constitution","Evidence of support"],"deadline":"Open periods or during labour dispute"}',
'Must demonstrate majority support in appropriate bargaining unit. Include membership evidence.', true),

-- Divisional Court Forms
(gen_random_uuid(), 'DC-01', 'Notice of Application for Judicial Review', 'Application for judicial review of administrative decisions', 'Divisional Court', 'Divisional Court', 1599,
'{"sections":["applicant_info","decision_challenged","grounds_for_review","relief_sought","supporting_facts"]}',
'{"fee":"$157 CAD","documents":["Decision under review","Administrative record","Affidavit evidence"],"deadline":"30 days from decision (or when reasons received)"}',
'Must identify specific decision, grounds for review, and relief sought. Include complete administrative record.', true);

-- Update form field structures to be more detailed
UPDATE forms SET form_fields = '{
  "sections": [
    {
      "name": "applicant_info",
      "title": "Applicant Information",
      "fields": ["full_name", "address", "phone", "email", "date_of_birth"]
    },
    {
      "name": "respondent_info", 
      "title": "Respondent Information",
      "fields": ["full_name", "address", "phone", "email", "relationship"]
    },
    {
      "name": "children_info",
      "title": "Children Information", 
      "fields": ["child_names", "birth_dates", "current_residence", "custody_arrangement"]
    },
    {
      "name": "court_orders_sought",
      "title": "Orders Sought",
      "fields": ["custody_access", "child_support", "spousal_support", "property_division", "other"]
    },
    {
      "name": "grounds",
      "title": "Grounds for Application",
      "fields": ["factual_basis", "legal_basis", "supporting_evidence"]
    },
    {
      "name": "financial_info",
      "title": "Financial Information",
      "fields": ["annual_income", "assets", "debts", "monthly_expenses"]
    }
  ]
}' WHERE form_code = 'FL-01';