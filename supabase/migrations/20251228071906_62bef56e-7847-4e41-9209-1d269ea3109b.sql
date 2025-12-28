-- Add pathway rules for ALL Canadian provinces and territories

-- BRITISH COLUMBIA
INSERT INTO pathway_rules (pathway_id, rule_name, tribunal, province, category, issue_keywords, recommended_forms, reasoning, filing_fee, timeframe, success_rate, priority) VALUES
('bc_rtb_maintenance', 'BC RTB Maintenance', 'Residential Tenancy Branch', 'BC', 'housing', ARRAY['repairs', 'maintenance', 'mold', 'heat', 'water', 'pest', 'habitability'], ARRAY['RTB-12'], 'BC Residential Tenancy Branch handles landlord-tenant disputes including maintenance issues.', '$100', '6-12 weeks', 72, 100),
('bc_rtb_eviction', 'BC RTB Eviction Defence', 'Residential Tenancy Branch', 'BC', 'housing', ARRAY['eviction', 'notice', 'end tenancy', 'N4', 'N5', 'N12', 'landlord ending'], ARRAY['RTB-2'], 'Dispute eviction notices through the Residential Tenancy Branch.', '$100', '4-8 weeks', 65, 100),
('bc_rtb_deposit', 'BC RTB Security Deposit', 'Residential Tenancy Branch', 'BC', 'housing', ARRAY['deposit', 'security', 'damage deposit', 'last month', 'refund'], ARRAY['RTB-12'], 'Recover security deposits through RTB dispute resolution.', '$100', '4-8 weeks', 78, 90),
('bc_hrt', 'BC Human Rights Tribunal', 'BC Human Rights Tribunal', 'BC', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender', 'sexual orientation', 'family status', 'age'], ARRAY['Form 1'], 'BC Human Rights Tribunal handles discrimination complaints in housing, employment, and services.', '$0', '12-24 months', 45, 100),
('bc_crt', 'BC Civil Resolution Tribunal', 'Civil Resolution Tribunal', 'BC', 'civil', ARRAY['money', 'debt', 'contract', 'property damage', 'motor vehicle', 'strata'], ARRAY['CRT Claim'], 'CRT handles small claims up to $5,000 and strata disputes.', '$75-$175', '4-12 weeks', 68, 90),
('bc_small_claims', 'BC Small Claims', 'Provincial Court Small Claims', 'BC', 'civil', ARRAY['money owed', 'debt', 'contract', 'damages', 'property'], ARRAY['Notice of Claim'], 'Provincial Court Small Claims for claims $5,001-$35,000.', '$156', '6-12 months', 62, 80),
('bc_employment', 'BC Employment Standards', 'Employment Standards Branch', 'BC', 'employment', ARRAY['wages', 'overtime', 'termination', 'severance', 'vacation pay', 'wrongful dismissal'], ARRAY['ESB Complaint'], 'File employment standards complaints for wage and termination issues.', '$0', '8-16 weeks', 70, 100),

-- ALBERTA
('ab_rtdrs', 'Alberta RTDRS', 'Residential Tenancy Dispute Resolution Service', 'AB', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'deposit', 'rent', 'landlord', 'tenant'], ARRAY['RTDRS Application'], 'Alberta RTDRS handles landlord-tenant disputes.', '$75', '4-8 weeks', 70, 100),
('ab_hrc', 'Alberta Human Rights Commission', 'Alberta Human Rights Commission', 'AB', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender', 'age'], ARRAY['Complaint Form'], 'Alberta HRC handles discrimination complaints.', '$0', '12-18 months', 42, 100),
('ab_provincial', 'Alberta Provincial Court Civil', 'Provincial Court of Alberta', 'AB', 'civil', ARRAY['money', 'debt', 'contract', 'damages', 'property'], ARRAY['Civil Claim'], 'Provincial Court handles civil claims up to $50,000.', '$200', '6-12 months', 60, 90),
('ab_employment', 'Alberta Employment Standards', 'Employment Standards', 'AB', 'employment', ARRAY['wages', 'overtime', 'termination', 'severance', 'vacation'], ARRAY['ES Complaint'], 'File complaints for unpaid wages and employment issues.', '$0', '8-12 weeks', 68, 100),

-- QUEBEC
('qc_tal', 'Quebec TAL', 'Tribunal administratif du logement', 'QC', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'rent', 'lease', 'landlord', 'tenant', 'loyer'], ARRAY['Demande'], 'TAL (formerly Régie du logement) handles all residential tenancy matters in Quebec.', '$82', '6-12 weeks', 70, 100),
('qc_cdpdj', 'Quebec Human Rights Commission', 'Commission des droits de la personne', 'QC', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender'], ARRAY['Plainte'], 'CDPDJ handles human rights complaints in Quebec.', '$0', '12-24 months', 40, 100),
('qc_small_claims', 'Quebec Small Claims', 'Court of Québec Small Claims', 'QC', 'civil', ARRAY['money', 'debt', 'contract', 'damages'], ARRAY['Statement of Claim'], 'Small Claims Division handles claims up to $15,000.', '$107', '6-12 months', 58, 90),
('qc_tat', 'Quebec TAT', 'Tribunal administratif du travail', 'QC', 'employment', ARRAY['wages', 'dismissal', 'labour', 'union', 'workplace'], ARRAY['Plainte'], 'TAT handles labour and employment disputes.', '$0', '8-16 weeks', 65, 100),

-- MANITOBA
('mb_rtb', 'Manitoba RTB', 'Residential Tenancies Branch', 'MB', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'deposit', 'rent', 'landlord', 'tenant'], ARRAY['Application'], 'Manitoba RTB handles landlord-tenant disputes.', '$70', '4-8 weeks', 68, 100),
('mb_hrc', 'Manitoba Human Rights Commission', 'Manitoba Human Rights Commission', 'MB', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender'], ARRAY['Complaint Form'], 'Manitoba HRC handles discrimination complaints.', '$0', '12-18 months', 43, 100),
('mb_small_claims', 'Manitoba Small Claims', 'Court of Queen''s Bench Small Claims', 'MB', 'civil', ARRAY['money', 'debt', 'contract', 'damages'], ARRAY['Notice of Claim'], 'Small Claims handles claims up to $15,000.', '$100', '6-12 months', 60, 90),

-- SASKATCHEWAN
('sk_ort', 'Saskatchewan ORT', 'Office of Residential Tenancies', 'SK', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'deposit', 'rent', 'landlord', 'tenant'], ARRAY['Application'], 'Saskatchewan ORT handles landlord-tenant disputes.', '$75', '4-8 weeks', 67, 100),
('sk_hrc', 'Saskatchewan Human Rights Commission', 'Saskatchewan Human Rights Commission', 'SK', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender'], ARRAY['Complaint'], 'Saskatchewan HRC handles discrimination complaints.', '$0', '12-18 months', 41, 100),
('sk_small_claims', 'Saskatchewan Small Claims', 'Provincial Court Small Claims', 'SK', 'civil', ARRAY['money', 'debt', 'contract', 'damages'], ARRAY['Statement of Claim'], 'Small Claims handles claims up to $30,000.', '$100', '6-12 months', 62, 90),

-- NOVA SCOTIA
('ns_rtb', 'Nova Scotia Tenancy Board', 'Residential Tenancies Program', 'NS', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'deposit', 'rent', 'landlord', 'tenant'], ARRAY['Application'], 'Nova Scotia Residential Tenancies handles landlord-tenant disputes.', '$31.20', '4-8 weeks', 69, 100),
('ns_hrc', 'Nova Scotia Human Rights Commission', 'Nova Scotia Human Rights Commission', 'NS', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender'], ARRAY['Complaint Form'], 'NS HRC handles discrimination complaints.', '$0', '12-18 months', 44, 100),
('ns_small_claims', 'Nova Scotia Small Claims', 'Small Claims Court', 'NS', 'civil', ARRAY['money', 'debt', 'contract', 'damages'], ARRAY['Claim'], 'Small Claims Court handles claims up to $25,000.', '$101.20', '6-12 months', 61, 90),

-- NEW BRUNSWICK
('nb_rtb', 'New Brunswick RTB', 'Residential Tenancies Tribunal', 'NB', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'deposit', 'rent', 'landlord', 'tenant'], ARRAY['Application'], 'NB RTT handles landlord-tenant disputes.', '$25', '4-8 weeks', 66, 100),
('nb_hrc', 'New Brunswick Human Rights Commission', 'New Brunswick Human Rights Commission', 'NB', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender'], ARRAY['Complaint'], 'NB HRC handles discrimination complaints.', '$0', '12-18 months', 42, 100),
('nb_small_claims', 'New Brunswick Small Claims', 'Court of Queen''s Bench', 'NB', 'civil', ARRAY['money', 'debt', 'contract', 'damages'], ARRAY['Claim'], 'Small Claims handles claims up to $20,000.', '$50', '6-12 months', 59, 90),

-- NEWFOUNDLAND AND LABRADOR
('nl_rtb', 'Newfoundland RTB', 'Residential Tenancies Division', 'NL', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'deposit', 'rent', 'landlord', 'tenant'], ARRAY['Application'], 'NL Residential Tenancies handles landlord-tenant disputes.', '$50', '4-8 weeks', 65, 100),
('nl_hrc', 'Newfoundland Human Rights Commission', 'NL Human Rights Commission', 'NL', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender'], ARRAY['Complaint'], 'NL HRC handles discrimination complaints.', '$0', '12-18 months', 40, 100),
('nl_small_claims', 'Newfoundland Small Claims', 'Provincial Court Small Claims', 'NL', 'civil', ARRAY['money', 'debt', 'contract', 'damages'], ARRAY['Statement of Claim'], 'Small Claims handles claims up to $25,000.', '$60', '6-12 months', 58, 90),

-- PRINCE EDWARD ISLAND
('pe_irac', 'PEI IRAC', 'Island Regulatory and Appeals Commission', 'PE', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'deposit', 'rent', 'landlord', 'tenant'], ARRAY['Application'], 'IRAC handles landlord-tenant disputes in PEI.', '$70', '4-8 weeks', 68, 100),
('pe_hrc', 'PEI Human Rights Commission', 'PEI Human Rights Commission', 'PE', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender'], ARRAY['Complaint'], 'PEI HRC handles discrimination complaints.', '$0', '12-18 months', 43, 100),
('pe_small_claims', 'PEI Small Claims', 'Supreme Court Small Claims', 'PE', 'civil', ARRAY['money', 'debt', 'contract', 'damages'], ARRAY['Claim'], 'Small Claims Section handles claims up to $16,000.', '$75', '6-12 months', 60, 90),

-- NORTHWEST TERRITORIES
('nt_rtb', 'NWT Rental Office', 'NWT Rental Office', 'NT', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'deposit', 'rent', 'landlord', 'tenant'], ARRAY['Complaint'], 'NWT Rental Office handles landlord-tenant disputes.', '$0', '4-8 weeks', 65, 100),
('nt_hrc', 'NWT Human Rights Commission', 'NWT Human Rights Adjudication Panel', 'NT', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender'], ARRAY['Complaint'], 'NWT handles human rights complaints.', '$0', '12-18 months', 45, 100),
('nt_small_claims', 'NWT Small Claims', 'Territorial Court', 'NT', 'civil', ARRAY['money', 'debt', 'contract', 'damages'], ARRAY['Claim'], 'Territorial Court handles small claims up to $35,000.', '$50', '6-12 months', 58, 90),

-- YUKON
('yt_rtb', 'Yukon Residential Tenancies', 'Residential Tenancies Office', 'YT', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'deposit', 'rent', 'landlord', 'tenant'], ARRAY['Application'], 'Yukon Residential Tenancies handles landlord-tenant disputes.', '$0', '4-8 weeks', 67, 100),
('yt_hrc', 'Yukon Human Rights Commission', 'Yukon Human Rights Commission', 'YT', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender'], ARRAY['Complaint'], 'Yukon HRC handles discrimination complaints.', '$0', '12-18 months', 44, 100),
('yt_small_claims', 'Yukon Small Claims', 'Territorial Court', 'YT', 'civil', ARRAY['money', 'debt', 'contract', 'damages'], ARRAY['Claim'], 'Small Claims handles claims up to $25,000.', '$50', '6-12 months', 60, 90),

-- NUNAVUT
('nu_rtb', 'Nunavut Rental Office', 'Nunavut Rental Officer', 'NU', 'housing', ARRAY['repairs', 'maintenance', 'eviction', 'deposit', 'rent', 'landlord', 'tenant'], ARRAY['Complaint'], 'Nunavut Rental Officer handles landlord-tenant disputes.', '$0', '4-8 weeks', 64, 100),
('nu_hrt', 'Nunavut Human Rights Tribunal', 'Nunavut Human Rights Tribunal', 'NU', 'human_rights', ARRAY['discrimination', 'harassment', 'disability', 'race', 'religion', 'gender'], ARRAY['Complaint'], 'Nunavut HRT handles discrimination complaints.', '$0', '12-18 months', 42, 100),
('nu_small_claims', 'Nunavut Small Claims', 'Nunavut Court of Justice', 'NU', 'civil', ARRAY['money', 'debt', 'contract', 'damages'], ARRAY['Claim'], 'Court of Justice handles small claims up to $20,000.', '$50', '6-12 months', 55, 90);

-- Add FEDERAL pathways (apply to all provinces)
INSERT INTO pathway_rules (pathway_id, rule_name, tribunal, province, category, issue_keywords, recommended_forms, reasoning, filing_fee, timeframe, success_rate, priority) VALUES
('fed_chrt', 'Canadian Human Rights Tribunal', 'Canadian Human Rights Tribunal', NULL, 'human_rights', ARRAY['federal discrimination', 'federal employer', 'bank', 'airline', 'telecom', 'first nations', 'indigenous', 'federal government'], ARRAY['CHRC Complaint'], 'Federal tribunal for discrimination by federally-regulated employers and services.', '$0', '18-36 months', 38, 90),
('fed_tat', 'Transportation Appeal Tribunal', 'Transportation Appeal Tribunal of Canada', NULL, 'administrative', ARRAY['aviation', 'marine', 'rail', 'transport', 'license', 'certificate'], ARRAY['Notice of Appeal'], 'Appeals of Transport Canada decisions.', '$0', '6-12 months', 55, 80),
('fed_irb', 'Immigration and Refugee Board', 'Immigration and Refugee Board', NULL, 'immigration', ARRAY['refugee', 'asylum', 'immigration', 'deportation', 'sponsorship', 'appeal'], ARRAY['Various'], 'Federal tribunal for immigration and refugee matters.', '$0', '6-24 months', 45, 100),
('fed_sst', 'Social Security Tribunal', 'Social Security Tribunal', NULL, 'benefits', ARRAY['EI', 'employment insurance', 'CPP', 'disability', 'OAS', 'pension', 'benefits'], ARRAY['Notice of Appeal'], 'Appeals of CPP, OAS, and EI decisions.', '$0', '6-12 months', 52, 100),
('fed_crtc', 'CRTC Complaints', 'CRTC', NULL, 'telecom', ARRAY['telecom', 'broadcasting', 'internet', 'phone', 'cable', 'billing'], ARRAY['CCTS Complaint'], 'Telecom and broadcasting complaints.', '$0', '4-8 weeks', 65, 80),
('fed_tax', 'Tax Court of Canada', 'Tax Court of Canada', NULL, 'tax', ARRAY['income tax', 'GST', 'HST', 'CRA', 'tax assessment', 'tax appeal'], ARRAY['Notice of Appeal'], 'Appeals of CRA tax assessments.', '$0-$250', '12-24 months', 42, 90);