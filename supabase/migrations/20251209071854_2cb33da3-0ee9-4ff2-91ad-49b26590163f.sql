-- Add essential Ontario Court Forms from ontariocourtforms.on.ca
-- Focusing on the most commonly needed forms for self-represented litigants

-- FAMILY LAW FORMS (most frequently used)
INSERT INTO forms (form_code, title, category, tribunal_type, description, pdf_url, is_active, price_cents)
VALUES 
  -- Core Family Applications
  ('ON-FLR-6B', 'Form 6B - Affidavit of Service', 'Service', 'family', 'Used to prove that court documents were properly served on the other party.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/06b/flr-6b-e-1016.pdf', true, 2999),
  ('ON-FLR-14', 'Form 14 - Notice of Motion', 'Motions', 'family', 'Used to bring a motion (request for court order) in family court.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/14/form_14_2018.pdf', true, 2999),
  ('ON-FLR-14A', 'Form 14A - Affidavit (General)', 'Evidence', 'family', 'General affidavit form for family court proceedings.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/14a/flr-14a-e.pdf', true, 2999),
  ('ON-FLR-15', 'Form 15 - Motion to Change', 'Motions', 'family', 'Used to change an existing family court order for custody, access, or support.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/15/flr-15-0921-en.docx', true, 2999),
  ('ON-FLR-25', 'Form 25 - Order (General)', 'Orders', 'family', 'Template for general family court orders.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/25/form-25-en-dec20.pdf', true, 2999),
  ('ON-FLR-25F', 'Form 25F - Restraining Order', 'Orders', 'family', 'Used for restraining orders in family court.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/25f/flr-25f-e.pdf', true, 2999),
  
  -- Support Enforcement Forms
  ('ON-FLR-26', 'Form 26 - Statement of Money Owed', 'Enforcement', 'family', 'Used to calculate arrears and amounts owed under a support order.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/26/flr-26-apr16-en-fil.pdf', true, 2999),
  ('ON-FLR-29', 'Form 29 - Request for Garnishment', 'Enforcement', 'family', 'Used to garnish wages or bank accounts to collect support arrears.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/29/flr-29-apr16-en-fil.pdf', true, 2999),

-- SMALL CLAIMS COURT FORMS (most commonly needed)
  ('ON-SCC-7A', 'Form 7A - Plaintiff''s Claim', 'Claims', 'small-claims', 'Main form to start a Small Claims Court case to sue someone for up to $35,000.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/scc/07a/scr-7a-aug22-en-fil.pdf', true, 2999),
  ('ON-SCC-9A', 'Form 9A - Defence', 'Defence', 'small-claims', 'Used by defendants to respond to a claim filed against them.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/scc/09a/scr-9a-aug22-en-fil.pdf', true, 2999),
  ('ON-SCC-10A', 'Form 10A - Defendant''s Claim', 'Claims', 'small-claims', 'Used to make a counterclaim or third party claim in Small Claims Court.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/scc/10a/scr-10a-aug22-fil-en.pdf', true, 2999),
  ('ON-SCC-8A', 'Form 8A - Affidavit of Service', 'Service', 'small-claims', 'Used to prove documents were properly served in Small Claims Court.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/scc/08a/scr-8a-aug22-en-fil.pdf', true, 2999),
  ('ON-SCC-11B', 'Form 11B - Default Judgment', 'Judgments', 'small-claims', 'Used to get a default judgment when the defendant fails to respond.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/scc/11b/scr-11b-jan21-en-fil.pdf', true, 2999),
  ('ON-SCC-15A', 'Form 15A - Notice of Motion', 'Motions', 'small-claims', 'Used to bring a motion in Small Claims Court.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/scc/15a/scr-15a-aug22-en-fil.pdf', true, 2999),
  ('ON-SCC-20E', 'Form 20E - Notice of Garnishment', 'Enforcement', 'small-claims', 'Used to garnish wages or accounts after winning a judgment.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/scc/20e/scr-20e-jan21-en-fil.pdf', true, 2999),
  ('ON-SCC-20C', 'Form 20C - Writ of Seizure and Sale', 'Enforcement', 'small-claims', 'Used to seize and sell property to satisfy a judgment.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/scc/20c/scr-20c-may25-en-fil.pdf', true, 2999),
  ('ON-SCC-14A', 'Form 14A - Offer to Settle', 'Settlement', 'small-claims', 'Used to make a formal settlement offer in Small Claims Court.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/scc/14a/rscc-14a-e.pdf', true, 2999),

-- CIVIL PROCEDURE FORMS (Superior Court)
  ('ON-RCP-4D', 'Form 4D - Affidavit', 'Evidence', 'superior-court', 'General affidavit form for Superior Court civil proceedings.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/civil/04d/rcp-e-4d-feb21.docx', true, 2999),
  ('ON-RCP-14E', 'Form 14E - Notice of Application', 'Applications', 'superior-court', 'Used to start an application (non-action proceeding) in Superior Court.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/civil/14e/rcp-e-14e-0920.pdf', true, 2999),
  ('ON-RCP-16B', 'Form 16B - Affidavit of Service', 'Service', 'superior-court', 'Used to prove service of documents in Superior Court civil proceedings.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/civil/16b/rcp-e-16b-0221.docx', true, 2999),
  ('ON-RCP-37A', 'Form 37A - Notice of Motion', 'Motions', 'superior-court', 'Used to bring a motion in Superior Court civil proceedings.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/civil/37a/rcp-37a-e-0920.pdf', true, 2999),
  ('ON-RCP-59A', 'Form 59A - Notice of Appeal to Appellate Court', 'Appeals', 'superior-court', 'Used to appeal a Superior Court decision to the Court of Appeal.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/civil/59a/rcp-59a-e.pdf', true, 2999),
  ('ON-RCP-60A', 'Form 60A - Writ of Seizure and Sale', 'Enforcement', 'superior-court', 'Used to enforce a Superior Court judgment by seizing assets.', 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/civil/60a/rcp-60a-e.pdf', true, 2999),
  
-- Fee Waiver Form (universally needed by low-income litigants)
  ('ON-FW-01', 'Fee Waiver Request', 'Fee Waiver', 'general', 'Request to waive court filing fees for low-income litigants.', 'https://ontariocourtforms.on.ca/court-fee-waiver-guide-and-forms', true, 0)

ON CONFLICT (form_code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  pdf_url = EXCLUDED.pdf_url,
  is_active = true;