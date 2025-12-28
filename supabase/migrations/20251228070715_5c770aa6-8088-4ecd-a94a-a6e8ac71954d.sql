-- Add provincial and territorial court sources
INSERT INTO public.legal_sources (code, name, base_url, listing_url, doc_selector, listing_selector, jurisdiction, court_level, rate_limit_ms, is_active)
VALUES
  -- Ontario
  ('ONCA', 'Ontario Court of Appeal', 'https://www.ontariocourts.ca', 'https://www.ontariocourts.ca/decisions/en/latest', 'div.decision-content', 'table.decisions-list a', 'ON', 'appeal', 2000, true),
  ('ONSC', 'Ontario Superior Court of Justice', 'https://www.ontariocourts.ca', 'https://www.ontariocourts.ca/scj/decisions/', 'div.decision-content', 'table.decisions-list a', 'ON', 'superior', 2000, true),
  
  -- British Columbia
  ('BCCA', 'British Columbia Court of Appeal', 'https://www.bccourts.ca', 'https://www.bccourts.ca/Court_of_Appeal/recent_judgments.aspx', 'div.judgment-content', 'table a.judgment-link', 'BC', 'appeal', 2000, true),
  ('BCSC', 'British Columbia Supreme Court', 'https://www.bccourts.ca', 'https://www.bccourts.ca/supreme_court/recent_judgments.aspx', 'div.judgment-content', 'table a.judgment-link', 'BC', 'superior', 2000, true),
  
  -- Alberta
  ('ABCA', 'Alberta Court of Appeal', 'https://www.albertacourts.ca', 'https://www.albertacourts.ca/ca/home/judgments', 'div.judgment-body', 'ul.judgment-list a', 'AB', 'appeal', 2000, true),
  ('ABKB', 'Alberta Court of King''s Bench', 'https://www.albertacourts.ca', 'https://www.albertacourts.ca/kb/home/judgments', 'div.judgment-body', 'ul.judgment-list a', 'AB', 'superior', 2000, true),
  
  -- Quebec
  ('QCCA', 'Quebec Court of Appeal', 'https://courdappelduquebec.ca', 'https://courdappelduquebec.ca/en/judgments/', 'div.judgment-content', 'ul.judgments a', 'QC', 'appeal', 2000, true),
  ('QCCS', 'Quebec Superior Court', 'https://www.tribunaux.qc.ca', 'https://www.tribunaux.qc.ca/mjq_en/c-superieure/index-cs.html', 'div.judgment-content', 'table a', 'QC', 'superior', 2000, true),
  
  -- Manitoba
  ('MBCA', 'Manitoba Court of Appeal', 'https://www.manitobacourts.mb.ca', 'https://www.manitobacourts.mb.ca/court-of-appeal/decisions/', 'div.decision-content', 'table a', 'MB', 'appeal', 2000, true),
  ('MBKB', 'Manitoba Court of King''s Bench', 'https://www.manitobacourts.mb.ca', 'https://www.manitobacourts.mb.ca/court-of-kings-bench/decisions/', 'div.decision-content', 'table a', 'MB', 'superior', 2000, true),
  
  -- Saskatchewan
  ('SKCA', 'Saskatchewan Court of Appeal', 'https://sasklawcourts.ca', 'https://sasklawcourts.ca/index.php/home/court-of-appeal/judgments', 'div.judgment', 'table a', 'SK', 'appeal', 2000, true),
  ('SKKB', 'Saskatchewan Court of King''s Bench', 'https://sasklawcourts.ca', 'https://sasklawcourts.ca/index.php/home/court-of-kings-bench/judgments', 'div.judgment', 'table a', 'SK', 'superior', 2000, true),
  
  -- Nova Scotia
  ('NSCA', 'Nova Scotia Court of Appeal', 'https://www.courts.ns.ca', 'https://www.courts.ns.ca/Appeal_Court/NSCA_decisions.htm', 'div.decision', 'table a', 'NS', 'appeal', 2000, true),
  ('NSSC', 'Nova Scotia Supreme Court', 'https://www.courts.ns.ca', 'https://www.courts.ns.ca/Supreme_Court/NSSC_decisions.htm', 'div.decision', 'table a', 'NS', 'superior', 2000, true),
  
  -- New Brunswick
  ('NBCA', 'New Brunswick Court of Appeal', 'https://www.gnb.ca', 'https://www.gnb.ca/cour/05coa/index-e.asp', 'div.decision', 'table a', 'NB', 'appeal', 2000, true),
  ('NBKB', 'New Brunswick Court of King''s Bench', 'https://www.gnb.ca', 'https://www.gnb.ca/cour/06qb/index-e.asp', 'div.decision', 'table a', 'NB', 'superior', 2000, true),
  
  -- Newfoundland and Labrador
  ('NLCA', 'Newfoundland and Labrador Court of Appeal', 'https://court.nl.ca', 'https://court.nl.ca/appeal/decisions/', 'div.decision-content', 'table a', 'NL', 'appeal', 2000, true),
  ('NLSC', 'Newfoundland and Labrador Supreme Court', 'https://court.nl.ca', 'https://court.nl.ca/supreme/decisions/', 'div.decision-content', 'table a', 'NL', 'superior', 2000, true),
  
  -- Prince Edward Island
  ('PECA', 'PEI Court of Appeal', 'https://www.courts.pe.ca', 'https://www.courts.pe.ca/ca/decisions', 'div.decision', 'table a', 'PE', 'appeal', 2000, true),
  ('PESC', 'PEI Supreme Court', 'https://www.courts.pe.ca', 'https://www.courts.pe.ca/sc/decisions', 'div.decision', 'table a', 'PE', 'superior', 2000, true),
  
  -- Territories
  ('NWTCA', 'Northwest Territories Court of Appeal', 'https://www.nwtcourts.ca', 'https://www.nwtcourts.ca/en/decisions/', 'div.decision', 'table a', 'NT', 'appeal', 2000, true),
  ('NWTSC', 'Northwest Territories Supreme Court', 'https://www.nwtcourts.ca', 'https://www.nwtcourts.ca/en/decisions/', 'div.decision', 'table a', 'NT', 'superior', 2000, true),
  
  ('YKCA', 'Yukon Court of Appeal', 'https://www.yukoncourts.ca', 'https://www.yukoncourts.ca/courts/court-appeal/decisions', 'div.decision', 'table a', 'YT', 'appeal', 2000, true),
  ('YKSC', 'Yukon Supreme Court', 'https://www.yukoncourts.ca', 'https://www.yukoncourts.ca/courts/supreme-court/decisions', 'div.decision', 'table a', 'YT', 'superior', 2000, true),
  
  ('NUCJ', 'Nunavut Court of Justice', 'https://www.nunavutcourts.ca', 'https://www.nunavutcourts.ca/index.php/decisions', 'div.decision', 'table a', 'NU', 'superior', 2000, true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  listing_url = EXCLUDED.listing_url,
  jurisdiction = EXCLUDED.jurisdiction,
  court_level = EXCLUDED.court_level,
  is_active = true;