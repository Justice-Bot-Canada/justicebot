-- ============================================
-- CANADA LEGAL PATHWAY SYSTEM - MASTER SCHEMA
-- ============================================

-- 1) INTAKE FIELD DEFINITIONS
CREATE TABLE IF NOT EXISTS intake_field_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_key TEXT NOT NULL UNIQUE,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'select', 'multi_select', 'date', 'number', 'boolean', 'postal_code', 'textarea')),
  options JSONB,
  required BOOLEAN DEFAULT false,
  category TEXT,
  validation_rules JSONB,
  help_text TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed universal intake fields
INSERT INTO intake_field_definitions (field_key, field_label, field_type, options, required, category, help_text, order_index) VALUES
('province', 'Province/Territory', 'select', '["ON","BC","AB","QC","MB","SK","NS","NB","NL","PE","NT","YT","NU"]', true, NULL, 'Where did this dispute occur?', 1),
('postal_code', 'Postal Code', 'postal_code', NULL, true, NULL, 'Used to find your local courthouse/tribunal office', 2),
('dispute_type', 'Type of Dispute', 'select', '["housing","employment","family","child_protection","human_rights","consumer","debt","criminal","immigration","small_claims","estates","personal_injury","administrative"]', true, NULL, 'What category best describes your situation?', 3),
('counterparty', 'Who is the other party?', 'select', '["landlord","tenant","employer","employee","neighbor","government","police","agency","business","ex_partner","family_member","other"]', true, NULL, 'Who are you in dispute with?', 4),
('remedy_sought', 'What outcome do you want?', 'multi_select', '["money","repairs","eviction_defence","access","protection_order","reinstatement","damages","appeal","set_aside","stay","custody","support","other"]', true, NULL, 'Select all that apply', 5),
('incident_date', 'When did this start?', 'date', NULL, true, NULL, 'Date of first incident or issue', 6),
('notice_date', 'Date of any notice received', 'date', NULL, false, NULL, 'If you received a formal notice, when?', 7),
('deadline_date', 'Any known deadline?', 'date', NULL, false, NULL, 'Filing deadline if known', 8),
('evidence_types', 'What evidence do you have?', 'multi_select', '["photos","videos","receipts","emails","text_messages","medical_records","inspection_reports","contracts","notices","witness_statements","recordings","police_reports","court_orders","other"]', false, NULL, 'Select all that apply', 9),
('case_status', 'Current Status', 'select', '["pre_filing","filed","hearing_scheduled","order_issued","enforcement","appeal"]', true, NULL, 'Where are you in the process?', 10),
('amount_claimed', 'Amount in dispute (if monetary)', 'number', NULL, false, 'small_claims,debt,consumer,employment', 'Dollar amount if applicable', 11),
('is_unionized', 'Are you in a union?', 'boolean', NULL, false, 'employment', 'This affects which process applies', 12),
('protected_ground', 'Discrimination ground', 'multi_select', '["disability","race","sex","gender","age","family_status","religion","sexual_orientation","ancestry","citizenship","creed","marital_status","other"]', false, 'human_rights', 'Which protected ground(s) apply?', 13),
('social_area', 'Area of discrimination', 'select', '["employment","housing","services","education","contracts"]', false, 'human_rights', 'Where did the discrimination occur?', 14)
ON CONFLICT (field_key) DO NOTHING;

-- 2) LEGAL ELEMENTS
CREATE TABLE IF NOT EXISTS legal_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_category TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  element_key TEXT NOT NULL,
  element_name TEXT NOT NULL,
  element_description TEXT,
  required BOOLEAN DEFAULT true,
  weight NUMERIC DEFAULT 1.0,
  evidence_hint TEXT,
  order_index INTEGER DEFAULT 0,
  province TEXT,
  UNIQUE(pathway_category, issue_type, element_key)
);

-- Seed legal elements
INSERT INTO legal_elements (pathway_category, issue_type, element_key, element_name, element_description, evidence_hint, order_index) VALUES
('housing', 'maintenance', 'defect_exists', 'Defect or Disrepair Exists', 'The rental unit has a specific maintenance issue', 'Photos, videos, inspection reports', 1),
('housing', 'maintenance', 'notice_given', 'Landlord Was Notified', 'You informed the landlord of the problem', 'Written notices, emails, texts with dates', 2),
('housing', 'maintenance', 'landlord_failed', 'Landlord Failed to Repair', 'Landlord did not fix the issue within reasonable time', 'Timeline showing no action, follow-up correspondence', 3),
('housing', 'maintenance', 'impact_shown', 'Impact on You', 'The issue affected your living conditions or caused harm', 'Medical notes, photos of damage, utility bills', 4),
('housing', 'maintenance', 'timeline_clear', 'Clear Timeline', 'Dates of issue, notices, and current status are documented', 'Chronological records', 5),
('housing', 'harassment', 'conduct_occurred', 'Harassing Conduct Occurred', 'Landlord engaged in specific harassing behavior', 'Recordings, witness statements, incident logs', 1),
('housing', 'harassment', 'pattern_shown', 'Pattern of Behavior', 'Multiple incidents showing ongoing harassment', 'Dated incident log, multiple pieces of evidence', 2),
('housing', 'harassment', 'impact_documented', 'Impact Documented', 'Harassment affected your tenancy or wellbeing', 'Medical notes, disruption to tenancy', 3),
('housing', 'harassment', 'complaints_made', 'Complaints Were Made', 'You raised concerns about the behavior', 'Emails, letters, police reports', 4),
('housing', 'eviction', 'notice_defective', 'Notice May Be Defective', 'The eviction notice has procedural issues', 'Copy of notice, legislation requirements', 1),
('housing', 'eviction', 'grounds_disputed', 'Grounds Are Disputed', 'The reason for eviction is incorrect or pretextual', 'Evidence contradicting landlord claims', 2),
('housing', 'eviction', 'remedy_available', 'Remedy Is Available', 'You can cure the issue (e.g., pay arrears)', 'Proof of funds, payment plan', 3),
('housing', 'eviction', 'bad_faith_shown', 'Bad Faith Shown', 'Landlord is evicting for improper reasons', 'Similar unit listings, renovation plans, texts', 4),
('human_rights', 'discrimination', 'protected_ground', 'Protected Ground Applies', 'You are part of a protected group under the Code', 'ID, medical records, relationship proof', 1),
('human_rights', 'discrimination', 'social_area', 'Occurred in Protected Area', 'Discrimination was in employment, housing, services, etc.', 'Context of relationship', 2),
('human_rights', 'discrimination', 'adverse_treatment', 'Adverse Treatment Occurred', 'You experienced negative treatment or impact', 'Specific incidents documented', 3),
('human_rights', 'discrimination', 'nexus_shown', 'Nexus to Protected Ground', 'Connection between your identity and the treatment', 'Comparators, comments, timing', 4),
('human_rights', 'discrimination', 'damages_claimed', 'Damages or Remedy Sought', 'Specific remedies you are seeking', 'Financial losses, impact statement', 5),
('employment', 'wrongful_dismissal', 'employment_existed', 'Employment Relationship Existed', 'You were an employee (not contractor)', 'Contract, pay stubs, T4', 1),
('employment', 'wrongful_dismissal', 'termination_occurred', 'Termination Occurred', 'You were dismissed from employment', 'Termination letter, ROE', 2),
('employment', 'wrongful_dismissal', 'notice_insufficient', 'Insufficient Notice/Severance', 'You did not receive adequate notice or pay', 'Offer vs entitlement calculation', 3),
('employment', 'wrongful_dismissal', 'mitigation_shown', 'Mitigation Efforts', 'You are looking for new work', 'Job search records', 4),
('employment', 'unpaid_wages', 'wages_owed', 'Wages Are Owed', 'Employer owes you money for work performed', 'Pay stubs, timesheets, contract', 1),
('employment', 'unpaid_wages', 'demand_made', 'Demand Was Made', 'You asked employer to pay', 'Emails, letters', 2),
('employment', 'unpaid_wages', 'amount_calculated', 'Amount Calculated', 'You know the specific amount owed', 'Calculation with supporting docs', 3),
('family', 'parenting', 'relationship_exists', 'Parent-Child Relationship', 'You are the parent of the child(ren)', 'Birth certificate, adoption order', 1),
('family', 'parenting', 'current_arrangement', 'Current Parenting Arrangement', 'There is or is not an existing order/agreement', 'Order, separation agreement', 2),
('family', 'parenting', 'best_interests', 'Best Interests Factors', 'Evidence relating to childs best interests', 'School records, medical, housing stability', 3),
('family', 'parenting', 'proposed_schedule', 'Proposed Parenting Schedule', 'Your specific proposal for time with child', 'Proposed schedule', 4),
('family', 'support', 'relationship_ended', 'Relationship Has Ended', 'Separation or divorce', 'Separation date, agreement', 1),
('family', 'support', 'income_disclosed', 'Income Information', 'Both parties income is known or discoverable', 'Tax returns, pay stubs, NOA', 2),
('family', 'support', 'children_identified', 'Children Identified', 'Number and ages of children', 'Birth certificates', 3),
('family', 'support', 'table_amount', 'Table Amount Calculated', 'Child support per guidelines', 'Guidelines calculation', 4),
('small_claims', 'money_owed', 'debt_exists', 'Debt or Obligation Exists', 'The defendant owes you money', 'Contract, invoice, agreement', 1),
('small_claims', 'money_owed', 'amount_certain', 'Amount Is Certain', 'You know exactly how much is owed', 'Calculation, invoices', 2),
('small_claims', 'money_owed', 'demand_made', 'Demand Was Made', 'You asked for payment before suing', 'Demand letter', 3),
('small_claims', 'money_owed', 'limitation_ok', 'Within Limitation Period', 'Claim is not statute-barred', 'Date of last payment/breach', 4)
ON CONFLICT DO NOTHING;

-- 3) PROCEDURE TEMPLATES
CREATE TABLE IF NOT EXISTS procedure_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type TEXT NOT NULL CHECK (template_type IN ('tribunal_application', 'court_claim', 'appeal_review')),
  step_number INTEGER NOT NULL,
  step_key TEXT NOT NULL,
  step_title TEXT NOT NULL,
  step_description TEXT,
  typical_timeframe TEXT,
  documents_needed TEXT[],
  tips TEXT[],
  province TEXT,
  pathway_category TEXT,
  UNIQUE(template_type, step_number, province, pathway_category)
);

-- Template 1: Tribunal Application
INSERT INTO procedure_templates (template_type, step_number, step_key, step_title, step_description, typical_timeframe, documents_needed, tips) VALUES
('tribunal_application', 1, 'prepare', 'Prepare Your Application', 'Gather evidence, complete the application form, calculate fees', '1-2 weeks', ARRAY['Application form', 'Evidence copies', 'ID', 'Fee payment'], ARRAY['Make copies of everything', 'Organize evidence chronologically']),
('tribunal_application', 2, 'file', 'File Application', 'Submit your application to the tribunal with required fee', '1 day', ARRAY['Completed application', 'Filing fee', 'Copies for service'], ARRAY['Keep your receipt', 'Note your file number']),
('tribunal_application', 3, 'serve', 'Serve the Other Party', 'Deliver copies to all respondents as required', '5-14 days', ARRAY['Certificate of service', 'Proof of delivery'], ARRAY['Follow tribunal service rules exactly', 'Document how/when you served']),
('tribunal_application', 4, 'disclosure', 'Exchange Evidence', 'Share your evidence with the other party and receive theirs', '2-4 weeks', ARRAY['Evidence list', 'Disclosure letter'], ARRAY['Request their evidence in writing', 'Note what they do not provide']),
('tribunal_application', 5, 'mediation', 'Mediation (if required)', 'Attempt to settle before hearing', '1-4 weeks', ARRAY['Settlement authority', 'Key documents'], ARRAY['Know your bottom line', 'Be prepared to compromise']),
('tribunal_application', 6, 'hearing', 'Attend Hearing', 'Present your case to the adjudicator', '1 day - 1 week', ARRAY['Evidence book', 'Witness list', 'Opening statement'], ARRAY['Arrive early', 'Dress professionally', 'Bring all originals']),
('tribunal_application', 7, 'order', 'Receive Decision', 'Tribunal issues written order', '1-8 weeks after hearing', ARRAY[]::TEXT[], ARRAY['Read the order carefully', 'Note appeal deadlines']),
('tribunal_application', 8, 'enforce', 'Enforce Order', 'If other party does not comply, take enforcement steps', 'Varies', ARRAY['Certified order', 'Enforcement forms'], ARRAY['File order with court if needed', 'Consider collections']);

-- Template 2: Court Claim
INSERT INTO procedure_templates (template_type, step_number, step_key, step_title, step_description, typical_timeframe, documents_needed, tips) VALUES
('court_claim', 1, 'demand', 'Send Demand Letter', 'Formally request payment/action before suing', '1-2 weeks', ARRAY['Demand letter', 'Supporting documents'], ARRAY['Give reasonable deadline', 'Keep proof of sending']),
('court_claim', 2, 'file', 'File Claim', 'Submit claim to court with required fee', '1 day', ARRAY['Statement of claim', 'Filing fee', 'Copies'], ARRAY['Check monetary jurisdiction', 'Include all defendants']),
('court_claim', 3, 'serve', 'Serve Defendants', 'Deliver claim documents to all defendants', '30-60 days', ARRAY['Affidavit of service'], ARRAY['Personal service preferred', 'Document all attempts']),
('court_claim', 4, 'defence', 'Wait for Defence', 'Defendant has time to respond', '20-30 days', ARRAY[]::TEXT[], ARRAY['If no defence, request default judgment']),
('court_claim', 5, 'settlement_conf', 'Settlement Conference', 'Mandatory settlement meeting with judge', '2-4 months', ARRAY['Settlement brief', 'Evidence summary'], ARRAY['Come with authority to settle', 'Know your best/worst outcomes']),
('court_claim', 6, 'motions', 'Pre-Trial Motions', 'Handle procedural issues if needed', 'As needed', ARRAY['Motion materials', 'Supporting affidavits'], ARRAY['Only bring necessary motions']),
('court_claim', 7, 'trial', 'Trial', 'Present your case to the judge', '1 day - 2 weeks', ARRAY['Trial brief', 'Witness summons', 'Evidence book'], ARRAY['Practice your testimony', 'Prepare for cross-examination']),
('court_claim', 8, 'judgment', 'Judgment', 'Court issues decision', 'Same day - 3 months', ARRAY[]::TEXT[], ARRAY['Note appeal deadline', 'Understand costs award']),
('court_claim', 9, 'enforce', 'Enforcement', 'Collect on your judgment', 'Ongoing', ARRAY['Writ of seizure', 'Garnishment forms'], ARRAY['Register judgment immediately', 'Investigate assets']);

-- Template 3: Appeal/Review
INSERT INTO procedure_templates (template_type, step_number, step_key, step_title, step_description, typical_timeframe, documents_needed, tips) VALUES
('appeal_review', 1, 'identify_deadline', 'Identify Deadline', 'Calculate exact deadline from decision date', 'Immediately', ARRAY['Original decision', 'Legislation/rules'], ARRAY['Deadlines are strict', 'Some are as short as 15 days']),
('appeal_review', 2, 'assess_grounds', 'Assess Grounds', 'Determine if you have valid appeal grounds', '1-3 days', ARRAY['Decision', 'Hearing transcript'], ARRAY['Focus on legal errors', 'New evidence is usually not allowed']),
('appeal_review', 3, 'stay_motion', 'Request Stay (if needed)', 'Ask court to pause the order pending appeal', 'ASAP', ARRAY['Stay motion', 'Supporting affidavit'], ARRAY['Show irreparable harm', 'Strong case on merits']),
('appeal_review', 4, 'file_appeal', 'File Notice of Appeal', 'Submit appeal documents to higher court/body', 'Before deadline', ARRAY['Notice of appeal', 'Filing fee', 'Decision under appeal'], ARRAY['Follow appeal rules exactly', 'Serve all parties']),
('appeal_review', 5, 'record', 'Prepare Appeal Record', 'Compile documents from original proceeding', '30-60 days', ARRAY['Transcripts', 'Exhibits', 'Reasons'], ARRAY['Order transcripts early', 'Include only relevant materials']),
('appeal_review', 6, 'factum', 'Write Factum/Brief', 'Written argument for the appeal', '30-60 days', ARRAY['Factum', 'Book of authorities'], ARRAY['Focus on key legal arguments', 'Cite relevant cases']),
('appeal_review', 7, 'hearing', 'Appeal Hearing', 'Present arguments to appeal court/body', '1 day', ARRAY['Factum', 'Authorities'], ARRAY['Focus on legal errors', 'Answer judges questions directly']),
('appeal_review', 8, 'decision', 'Appeal Decision', 'Receive result', '1-6 months', ARRAY[]::TEXT[], ARRAY['Check for further appeal rights', 'Understand remedy granted']);

-- 4) MERIT SCORE CONFIGURATION
CREATE TABLE IF NOT EXISTS merit_score_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_key TEXT NOT NULL UNIQUE,
  component_name TEXT NOT NULL,
  max_points INTEGER NOT NULL,
  weight NUMERIC DEFAULT 1.0,
  description TEXT,
  calculation_rules JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO merit_score_config (component_key, component_name, max_points, weight, description, calculation_rules) VALUES
('path_fit', 'Jurisdiction & Path Fit', 15, 1.0, 'Correct tribunal + form + respondent + remedy', 
 '{"15": "Correct venue, form, respondent, remedy", "8-12": "Mostly correct, fixable issues", "0-7": "Wrong venue or barred"}'::jsonb),
('elements', 'Legal Elements Coverage', 25, 1.0, 'Required proof points for your issue type',
 '{"per_element": {"0": "missing", "1": "alleged but vague", "2": "specific facts", "3": "facts + corroboration"}, "normalize_to": 25}'::jsonb),
('evidence', 'Evidence Strength', 25, 1.0, 'Quality and relevance of your evidence',
 '{"factors": ["relevance", "reliability", "timestamp", "continuity", "corroboration"], "each_0_to_1": true}'::jsonb),
('case_law', 'Case Law Similarity', 25, 1.0, 'How similar cases were decided',
 '{"outcome_weights": {"granted": 1.0, "partial": 0.6, "dismissed": 0.0}, "recency_decay": true, "top_k": 10}'::jsonb),
('penalty', 'Procedure & Deadline Risk', -15, 1.0, 'Deductions for deadline and procedural issues',
 '{"mild_risk": -3, "moderate_risk": -7, "severe_risk": -15, "examples": ["limitation", "wrong_service", "missing_party"]}'::jsonb)
ON CONFLICT (component_key) DO NOTHING;

-- 5) RLS
ALTER TABLE intake_field_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE merit_score_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "intake_fields_public_read" ON intake_field_definitions FOR SELECT USING (true);
CREATE POLICY "legal_elements_public_read" ON legal_elements FOR SELECT USING (true);
CREATE POLICY "procedure_templates_public_read" ON procedure_templates FOR SELECT USING (true);
CREATE POLICY "merit_config_public_read" ON merit_score_config FOR SELECT USING (true);

CREATE POLICY "intake_fields_admin_write" ON intake_field_definitions FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "legal_elements_admin_write" ON legal_elements FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "procedure_templates_admin_write" ON procedure_templates FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "merit_config_admin_write" ON merit_score_config FOR ALL USING (is_admin()) WITH CHECK (is_admin());