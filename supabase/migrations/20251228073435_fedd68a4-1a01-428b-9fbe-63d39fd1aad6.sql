-- ============================================
-- EXPAND PATHWAY RULES: ALL 11 CATEGORIES
-- Categories: housing, human_rights, employment, consumer, family, child_protection, criminal, immigration, administrative, personal_injury, estates
-- ============================================

-- CONSUMER / CONTRACTS / DEBT (All Provinces)
INSERT INTO pathway_rules (pathway_id, rule_name, tribunal, province, category, issue_keywords, recommended_forms, reasoning, filing_fee, timeframe, success_rate, priority) VALUES
-- Ontario
('on_consumer_small_claims', 'Ontario Consumer Small Claims', 'Small Claims Court', 'ON', 'consumer', ARRAY['refund', 'fraud', 'contract', 'warranty', 'defective', 'consumer', 'business', 'invoice'], ARRAY['Plaintiff Claim'], 'Small Claims Court for consumer disputes up to $35,000.', '$102', '6-12 months', 62, 90),
('on_consumer_omb', 'Ontario Consumer Ombudsman', 'Various Ombudsman Services', 'ON', 'consumer', ARRAY['telecom', 'cable', 'internet', 'phone', 'bank', 'insurance'], ARRAY['Complaint Form'], 'Industry ombudsman services for regulated sectors.', '$0', '4-8 weeks', 70, 100),
-- BC
('bc_consumer_crt', 'BC Consumer CRT', 'Civil Resolution Tribunal', 'BC', 'consumer', ARRAY['refund', 'fraud', 'contract', 'warranty', 'defective', 'consumer'], ARRAY['CRT Claim'], 'CRT handles consumer disputes up to $5,000.', '$75-$175', '4-12 weeks', 68, 100),
('bc_consumer_small_claims', 'BC Consumer Small Claims', 'Provincial Court Small Claims', 'BC', 'consumer', ARRAY['consumer', 'contract', 'refund', 'business dispute'], ARRAY['Notice of Claim'], 'Small Claims for consumer disputes $5,001-$35,000.', '$156', '6-12 months', 60, 80),
-- Alberta
('ab_consumer', 'Alberta Consumer Protection', 'Provincial Court Civil', 'AB', 'consumer', ARRAY['refund', 'fraud', 'contract', 'warranty', 'consumer'], ARRAY['Civil Claim'], 'Provincial Court handles consumer disputes up to $50,000.', '$200', '6-12 months', 58, 90),
-- Quebec
('qc_consumer_opc', 'Quebec Consumer Protection', 'Office de la protection du consommateur', 'QC', 'consumer', ARRAY['refund', 'fraud', 'contract', 'warranty', 'consumer'], ARRAY['Plainte'], 'OPC handles consumer protection complaints.', '$0', '4-8 weeks', 65, 100),
-- Other provinces (generic)
('mb_consumer', 'Manitoba Consumer', 'Court of King''s Bench Small Claims', 'MB', 'consumer', ARRAY['refund', 'fraud', 'contract', 'consumer'], ARRAY['Notice of Claim'], 'Small Claims for consumer disputes up to $15,000.', '$100', '6-12 months', 60, 90),
('sk_consumer', 'Saskatchewan Consumer', 'Provincial Court Small Claims', 'SK', 'consumer', ARRAY['refund', 'fraud', 'contract', 'consumer'], ARRAY['Statement of Claim'], 'Small Claims for consumer disputes up to $30,000.', '$100', '6-12 months', 60, 90),
('ns_consumer', 'Nova Scotia Consumer', 'Small Claims Court', 'NS', 'consumer', ARRAY['refund', 'fraud', 'contract', 'consumer'], ARRAY['Claim'], 'Small Claims for consumer disputes up to $25,000.', '$101.20', '6-12 months', 60, 90),
('nb_consumer', 'New Brunswick Consumer', 'Court of King''s Bench', 'NB', 'consumer', ARRAY['refund', 'fraud', 'contract', 'consumer'], ARRAY['Claim'], 'Small Claims for consumer disputes up to $20,000.', '$50', '6-12 months', 58, 90),
('nl_consumer', 'Newfoundland Consumer', 'Provincial Court Small Claims', 'NL', 'consumer', ARRAY['refund', 'fraud', 'contract', 'consumer'], ARRAY['Statement of Claim'], 'Small Claims for consumer disputes up to $25,000.', '$60', '6-12 months', 58, 90),
('pe_consumer', 'PEI Consumer', 'Supreme Court Small Claims', 'PE', 'consumer', ARRAY['refund', 'fraud', 'contract', 'consumer'], ARRAY['Claim'], 'Small Claims for consumer disputes up to $16,000.', '$75', '6-12 months', 58, 90);

-- FAMILY LAW (All Provinces)
INSERT INTO pathway_rules (pathway_id, rule_name, tribunal, province, category, issue_keywords, recommended_forms, reasoning, filing_fee, timeframe, success_rate, priority) VALUES
-- Ontario
('on_family_custody', 'Ontario Family - Custody/Access', 'Ontario Court of Justice / Superior Court', 'ON', 'family', ARRAY['custody', 'access', 'parenting', 'visitation', 'children', 'parenting time', 'decision making'], ARRAY['Form 8', 'Form 35.1'], 'Family court for custody and access disputes.', '$202', '6-18 months', 55, 100),
('on_family_support', 'Ontario Family - Child Support', 'Ontario Court of Justice / Superior Court', 'ON', 'family', ARRAY['child support', 'support', 'maintenance', 'guidelines', 'arrears'], ARRAY['Form 8', 'Form 13'], 'Family court for child and spousal support.', '$202', '3-12 months', 70, 100),
('on_family_divorce', 'Ontario Family - Divorce', 'Superior Court of Justice', 'ON', 'family', ARRAY['divorce', 'separation', 'marriage breakdown', 'division', 'property'], ARRAY['Form 8A', 'Form 36'], 'Superior Court for divorce proceedings.', '$447', '6-18 months', 90, 90),
('on_family_protection', 'Ontario Family - Protection Order', 'Ontario Court of Justice', 'ON', 'family', ARRAY['restraining order', 'protection', 'abuse', 'domestic violence', 'safety'], ARRAY['Form 14B'], 'Emergency protection orders for domestic situations.', '$0', '1-7 days', 75, 100),
-- BC
('bc_family_custody', 'BC Family - Parenting', 'Provincial Court / Supreme Court', 'BC', 'family', ARRAY['custody', 'parenting', 'guardianship', 'children', 'access'], ARRAY['Form F3'], 'Provincial Court for parenting disputes.', '$0-$200', '6-18 months', 55, 100),
('bc_family_support', 'BC Family - Support', 'Provincial Court / Supreme Court', 'BC', 'family', ARRAY['child support', 'spousal support', 'maintenance'], ARRAY['Form F3'], 'Family court for support orders.', '$0-$200', '3-12 months', 68, 100),
('bc_family_divorce', 'BC Family - Divorce', 'Supreme Court', 'BC', 'family', ARRAY['divorce', 'separation', 'property division'], ARRAY['Form F3'], 'Supreme Court for divorce.', '$210', '6-18 months', 88, 90),
-- Alberta
('ab_family_custody', 'Alberta Family - Parenting', 'Court of King''s Bench Family', 'AB', 'family', ARRAY['custody', 'parenting', 'access', 'children', 'guardianship'], ARRAY['Originating Application'], 'Family court for parenting matters.', '$260', '6-18 months', 55, 100),
('ab_family_support', 'Alberta Family - Support', 'Court of King''s Bench Family', 'AB', 'family', ARRAY['child support', 'spousal support', 'maintenance'], ARRAY['Originating Application'], 'Family court for support.', '$260', '3-12 months', 68, 100),
-- Quebec
('qc_family_custody', 'Quebec Family - Garde', 'Cour supérieure', 'QC', 'family', ARRAY['garde', 'custody', 'droits parentaux', 'children', 'access'], ARRAY['Demande'], 'Superior Court for custody matters.', '$315', '6-18 months', 55, 100),
('qc_family_support', 'Quebec Family - Pension', 'Cour supérieure', 'QC', 'family', ARRAY['pension alimentaire', 'child support', 'spousal support'], ARRAY['Demande'], 'Superior Court for support.', '$315', '3-12 months', 68, 100),
-- Other provinces
('mb_family', 'Manitoba Family', 'Court of King''s Bench Family', 'MB', 'family', ARRAY['custody', 'support', 'divorce', 'parenting', 'children'], ARRAY['Petition'], 'Family Division for all family matters.', '$200', '6-18 months', 58, 100),
('sk_family', 'Saskatchewan Family', 'Court of King''s Bench Family', 'SK', 'family', ARRAY['custody', 'support', 'divorce', 'parenting', 'children'], ARRAY['Petition'], 'Family Division for all family matters.', '$200', '6-18 months', 58, 100),
('ns_family', 'Nova Scotia Family', 'Supreme Court Family', 'NS', 'family', ARRAY['custody', 'support', 'divorce', 'parenting', 'children'], ARRAY['Notice of Application'], 'Family Division for all family matters.', '$258.65', '6-18 months', 58, 100),
('nb_family', 'New Brunswick Family', 'Court of King''s Bench Family', 'NB', 'family', ARRAY['custody', 'support', 'divorce', 'parenting', 'children'], ARRAY['Notice of Application'], 'Family Division for all family matters.', '$100', '6-18 months', 58, 100),
('nl_family', 'Newfoundland Family', 'Supreme Court Family', 'NL', 'family', ARRAY['custody', 'support', 'divorce', 'parenting', 'children'], ARRAY['Originating Application'], 'Family Division for all family matters.', '$120', '6-18 months', 58, 100),
('pe_family', 'PEI Family', 'Supreme Court Family', 'PE', 'family', ARRAY['custody', 'support', 'divorce', 'parenting', 'children'], ARRAY['Notice of Application'], 'Family Section for all family matters.', '$75', '6-18 months', 58, 100);

-- CHILD PROTECTION (All Provinces)
INSERT INTO pathway_rules (pathway_id, rule_name, tribunal, province, category, issue_keywords, recommended_forms, reasoning, filing_fee, timeframe, success_rate, priority) VALUES
('on_child_protection', 'Ontario Child Protection', 'Ontario Court of Justice', 'ON', 'child_protection', ARRAY['CAS', 'children aid', 'child protection', 'apprehension', 'supervision', 'foster', 'wardship', 'access'], ARRAY['Answer'], 'Respond to CAS applications within strict deadlines.', '$0', '5-30 days initial', 45, 100),
('bc_child_protection', 'BC Child Protection', 'Provincial Court', 'BC', 'child_protection', ARRAY['MCFD', 'child protection', 'apprehension', 'supervision', 'foster', 'CCO'], ARRAY['Response'], 'Respond to MCFD protection applications.', '$0', '5-30 days initial', 45, 100),
('ab_child_protection', 'Alberta Child Protection', 'Provincial Court', 'AB', 'child_protection', ARRAY['child protection', 'intervention', 'apprehension', 'TGO', 'PGO'], ARRAY['Response'], 'Respond to child intervention matters.', '$0', '5-30 days initial', 45, 100),
('qc_child_protection', 'Quebec Child Protection', 'Chambre de la jeunesse', 'QC', 'child_protection', ARRAY['DPJ', 'protection jeunesse', 'signalement', 'placement'], ARRAY['Réponse'], 'Youth Division for protection matters.', '$0', '5-30 days initial', 45, 100),
('mb_child_protection', 'Manitoba Child Protection', 'Provincial Court', 'MB', 'child_protection', ARRAY['CFS', 'child welfare', 'apprehension', 'protection'], ARRAY['Response'], 'Respond to CFS protection applications.', '$0', '5-30 days initial', 45, 100),
('sk_child_protection', 'Saskatchewan Child Protection', 'Provincial Court', 'SK', 'child_protection', ARRAY['child protection', 'ministry', 'apprehension'], ARRAY['Response'], 'Respond to ministry protection applications.', '$0', '5-30 days initial', 45, 100),
('ns_child_protection', 'Nova Scotia Child Protection', 'Family Court', 'NS', 'child_protection', ARRAY['CSAP', 'child protection', 'apprehension'], ARRAY['Response'], 'Respond to CSAP protection applications.', '$0', '5-30 days initial', 45, 100),
('nb_child_protection', 'New Brunswick Child Protection', 'Court of King''s Bench Family', 'NB', 'child_protection', ARRAY['child protection', 'social development', 'apprehension'], ARRAY['Response'], 'Respond to protection applications.', '$0', '5-30 days initial', 45, 100),
('nl_child_protection', 'Newfoundland Child Protection', 'Provincial Court', 'NL', 'child_protection', ARRAY['child protection', 'CSSD', 'apprehension'], ARRAY['Response'], 'Respond to CSSD protection applications.', '$0', '5-30 days initial', 45, 100),
('pe_child_protection', 'PEI Child Protection', 'Supreme Court', 'PE', 'child_protection', ARRAY['child protection', 'director', 'apprehension'], ARRAY['Response'], 'Respond to Director protection applications.', '$0', '5-30 days initial', 45, 100);

-- CRIMINAL (All Provinces - same courts, different local practices)
INSERT INTO pathway_rules (pathway_id, rule_name, tribunal, province, category, issue_keywords, recommended_forms, reasoning, filing_fee, timeframe, success_rate, priority) VALUES
('on_criminal_bail', 'Ontario Bail Hearing', 'Ontario Court of Justice', 'ON', 'criminal', ARRAY['bail', 'release', 'detention', 'surety', 'conditions'], ARRAY['Bail Plan'], 'Bail hearing within 24-48 hours of arrest.', 'N/A', '24-48 hours', 70, 100),
('on_criminal_trial', 'Ontario Criminal Trial', 'Ontario Court of Justice / Superior Court', 'ON', 'criminal', ARRAY['trial', 'charge', 'accused', 'criminal', 'offence', 'plea'], ARRAY[]::TEXT[], 'Criminal trial proceedings.', 'N/A', '6-24 months', 50, 90),
('bc_criminal', 'BC Criminal', 'Provincial Court / Supreme Court', 'BC', 'criminal', ARRAY['criminal', 'charge', 'bail', 'trial', 'offence'], ARRAY[]::TEXT[], 'Criminal proceedings in BC courts.', 'N/A', '6-24 months', 50, 90),
('ab_criminal', 'Alberta Criminal', 'Provincial Court / Court of King''s Bench', 'AB', 'criminal', ARRAY['criminal', 'charge', 'bail', 'trial', 'offence'], ARRAY[]::TEXT[], 'Criminal proceedings in Alberta courts.', 'N/A', '6-24 months', 50, 90),
('qc_criminal', 'Quebec Criminal', 'Cour du Québec / Cour supérieure', 'QC', 'criminal', ARRAY['criminel', 'accusation', 'mise en liberté', 'procès'], ARRAY[]::TEXT[], 'Criminal proceedings in Quebec courts.', 'N/A', '6-24 months', 50, 90);

-- ADMINISTRATIVE / GOVERNMENT DECISIONS (All Provinces)
INSERT INTO pathway_rules (pathway_id, rule_name, tribunal, province, category, issue_keywords, recommended_forms, reasoning, filing_fee, timeframe, success_rate, priority) VALUES
('on_admin_lat', 'Ontario LAT', 'Licence Appeal Tribunal', 'ON', 'administrative', ARRAY['license', 'permit', 'FSRA', 'OMVIC', 'RECO', 'suspension'], ARRAY['Notice of Appeal'], 'Appeals of licensing decisions.', '$100', '3-6 months', 55, 100),
('on_admin_sbt', 'Ontario SBT', 'Social Benefits Tribunal', 'ON', 'administrative', ARRAY['ODSP', 'OW', 'Ontario Works', 'disability', 'benefits', 'denial'], ARRAY['Notice of Appeal'], 'Appeals of social assistance decisions.', '$0', '3-9 months', 60, 100),
('on_admin_wsiat', 'Ontario WSIAT', 'Workplace Safety and Insurance Appeals Tribunal', 'ON', 'administrative', ARRAY['WSIB', 'workers comp', 'injury', 'claim denial', 'benefits'], ARRAY['Notice of Appeal'], 'Appeals of WSIB decisions.', '$0', '6-18 months', 52, 100),
('on_admin_divisional', 'Ontario Divisional Court JR', 'Divisional Court', 'ON', 'administrative', ARRAY['judicial review', 'government decision', 'tribunal appeal', 'administrative law'], ARRAY['Notice of Application'], 'Judicial review of administrative decisions.', '$181', '6-18 months', 40, 80),
('bc_admin', 'BC Administrative Tribunals', 'Various', 'BC', 'administrative', ARRAY['license', 'permit', 'benefits', 'government decision', 'appeal'], ARRAY['Notice of Appeal'], 'Appeals of BC administrative decisions.', 'Varies', '3-12 months', 50, 100),
('ab_admin', 'Alberta Administrative', 'Various Tribunals', 'AB', 'administrative', ARRAY['license', 'permit', 'benefits', 'government decision', 'appeal'], ARRAY['Notice of Appeal'], 'Appeals of Alberta administrative decisions.', 'Varies', '3-12 months', 50, 100),
('qc_admin_tat', 'Quebec TAQ', 'Tribunal administratif du Québec', 'QC', 'administrative', ARRAY['license', 'permit', 'benefits', 'government', 'SAAQ', 'RAMQ'], ARRAY['Requête'], 'Appeals to TAQ.', '$0-$105', '6-18 months', 50, 100);

-- PERSONAL INJURY / TORT (All Provinces)
INSERT INTO pathway_rules (pathway_id, rule_name, tribunal, province, category, issue_keywords, recommended_forms, reasoning, filing_fee, timeframe, success_rate, priority) VALUES
('on_injury_small', 'Ontario Personal Injury - Small Claims', 'Small Claims Court', 'ON', 'personal_injury', ARRAY['injury', 'accident', 'slip', 'fall', 'negligence', 'damages', 'assault'], ARRAY['Plaintiff Claim'], 'Small Claims for injury claims up to $35,000.', '$102', '6-18 months', 55, 90),
('on_injury_superior', 'Ontario Personal Injury - Superior', 'Superior Court of Justice', 'ON', 'personal_injury', ARRAY['serious injury', 'catastrophic', 'motor vehicle', 'medical malpractice', 'wrongful death'], ARRAY['Statement of Claim'], 'Superior Court for major injury claims.', '$240', '2-5 years', 50, 80),
('on_injury_lat_auto', 'Ontario Auto Injury - LAT', 'Licence Appeal Tribunal', 'ON', 'personal_injury', ARRAY['auto accident', 'car accident', 'insurance denial', 'accident benefits', 'SABs'], ARRAY['Application'], 'LAT for auto insurance benefit disputes.', '$100', '12-24 months', 55, 100),
('bc_injury_crt', 'BC Injury - CRT', 'Civil Resolution Tribunal', 'BC', 'personal_injury', ARRAY['minor injury', 'ICBC', 'motor vehicle', 'accident'], ARRAY['CRT Claim'], 'CRT for minor injury disputes.', '$75-$175', '4-12 weeks', 55, 100),
('bc_injury_court', 'BC Injury - Court', 'Supreme Court', 'BC', 'personal_injury', ARRAY['serious injury', 'negligence', 'malpractice'], ARRAY['Notice of Civil Claim'], 'Supreme Court for major injury claims.', '$210', '2-5 years', 50, 80),
('ab_injury', 'Alberta Personal Injury', 'Court of King''s Bench', 'AB', 'personal_injury', ARRAY['injury', 'accident', 'negligence', 'damages'], ARRAY['Statement of Claim'], 'Court for personal injury claims.', '$200', '2-5 years', 50, 90),
('qc_injury', 'Quebec Personal Injury', 'Cour supérieure', 'QC', 'personal_injury', ARRAY['blessure', 'accident', 'négligence', 'dommages'], ARRAY['Déclaration'], 'Superior Court for injury claims.', '$315', '2-5 years', 50, 90);

-- ESTATES / WILLS / POA (All Provinces)
INSERT INTO pathway_rules (pathway_id, rule_name, tribunal, province, category, issue_keywords, recommended_forms, reasoning, filing_fee, timeframe, success_rate, priority) VALUES
('on_estates_probate', 'Ontario Probate', 'Superior Court of Justice', 'ON', 'estates', ARRAY['probate', 'estate', 'will', 'executor', 'certificate', 'estate trustee'], ARRAY['Form 74.4', 'Form 74.5'], 'Probate application for estate administration.', '$150+', '2-6 months', 90, 90),
('on_estates_dispute', 'Ontario Estate Dispute', 'Superior Court of Justice', 'ON', 'estates', ARRAY['will challenge', 'undue influence', 'capacity', 'dependant relief', 'estate litigation'], ARRAY['Notice of Application'], 'Estate litigation and will challenges.', '$240', '1-3 years', 45, 80),
('on_estates_poa', 'Ontario POA/Guardianship', 'Superior Court of Justice', 'ON', 'estates', ARRAY['power of attorney', 'POA', 'guardianship', 'capacity', 'incapacity'], ARRAY['Application'], 'Guardianship and POA matters.', '$240', '3-12 months', 60, 90),
('bc_estates', 'BC Estates', 'Supreme Court', 'BC', 'estates', ARRAY['probate', 'estate', 'will', 'wills variation', 'executor'], ARRAY['P1 Form'], 'Probate and estate matters.', '$0-$200', '2-6 months', 88, 90),
('ab_estates', 'Alberta Estates', 'Surrogate Court', 'AB', 'estates', ARRAY['probate', 'estate', 'will', 'grant', 'executor'], ARRAY['Application for Grant'], 'Surrogate matters.', '$275+', '2-6 months', 88, 90),
('qc_estates', 'Quebec Estates', 'Cour supérieure', 'QC', 'estates', ARRAY['succession', 'testament', 'liquidateur', 'héritage'], ARRAY['Requête'], 'Estate and succession matters.', '$315', '2-6 months', 85, 90),
('mb_estates', 'Manitoba Estates', 'Court of King''s Bench', 'MB', 'estates', ARRAY['probate', 'estate', 'will', 'grant'], ARRAY['Application'], 'Surrogate matters.', '$70+', '2-6 months', 88, 90),
('sk_estates', 'Saskatchewan Estates', 'Court of King''s Bench', 'SK', 'estates', ARRAY['probate', 'estate', 'will', 'letters'], ARRAY['Application'], 'Surrogate matters.', '$75+', '2-6 months', 88, 90),
('ns_estates', 'Nova Scotia Estates', 'Supreme Court Probate', 'NS', 'estates', ARRAY['probate', 'estate', 'will', 'grant'], ARRAY['Application'], 'Probate Court matters.', '$85.85+', '2-6 months', 88, 90),
('nb_estates', 'New Brunswick Estates', 'Probate Court', 'NB', 'estates', ARRAY['probate', 'estate', 'will', 'letters'], ARRAY['Petition'], 'Probate Court matters.', '$50+', '2-6 months', 88, 90),
('nl_estates', 'Newfoundland Estates', 'Supreme Court', 'NL', 'estates', ARRAY['probate', 'estate', 'will', 'grant'], ARRAY['Application'], 'Probate matters.', '$60+', '2-6 months', 88, 90),
('pe_estates', 'PEI Estates', 'Supreme Court Estates', 'PE', 'estates', ARRAY['probate', 'estate', 'will', 'grant'], ARRAY['Application'], 'Estates Section matters.', '$40+', '2-6 months', 88, 90);