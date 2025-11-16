-- Populate tutorial_videos with actual content
INSERT INTO public.tutorial_videos (title, description, video_url, thumbnail_url, category, pathway_type, step_number, duration_seconds) VALUES
-- LTB Videos
('Introduction to Landlord and Tenant Board', 'Overview of the LTB process and what to expect', 'https://player.vimeo.com/video/placeholder1', '/placeholder.svg', 'Getting Started', 'ltb', 1, 180),
('How to File Form T2 - Tenant Rights Application', 'Step-by-step guide to completing and filing Form T2', 'https://player.vimeo.com/video/placeholder2', '/placeholder.svg', 'Form Completion', 'ltb', 2, 420),
('Gathering Evidence for Your LTB Case', 'What evidence you need and how to organize it', 'https://player.vimeo.com/video/placeholder3', '/placeholder.svg', 'Evidence Preparation', 'ltb', 3, 360),
('Preparing for Your LTB Hearing', 'What to expect at your hearing and how to present your case', 'https://player.vimeo.com/video/placeholder4', '/placeholder.svg', 'Hearing Preparation', 'ltb', 4, 480),
('Filing Form L1 - Application to Evict for Non-Payment', 'Landlord guide to filing eviction applications', 'https://player.vimeo.com/video/placeholder5', '/placeholder.svg', 'Form Completion', 'ltb', 5, 390),

-- HRTO Videos
('Introduction to Human Rights Tribunal Ontario', 'Overview of HRTO and discrimination claims', 'https://player.vimeo.com/video/placeholder6', '/placeholder.svg', 'Getting Started', 'hrto', 1, 240),
('Filing an HRTO Application', 'Complete guide to filing your human rights application', 'https://player.vimeo.com/video/placeholder7', '/placeholder.svg', 'Form Completion', 'hrto', 2, 540),
('Building Your Discrimination Case', 'How to document and prove discrimination', 'https://player.vimeo.com/video/placeholder8', '/placeholder.svg', 'Evidence Preparation', 'hrto', 3, 420),
('HRTO Mediation Process', 'Understanding mediation and how to prepare', 'https://player.vimeo.com/video/placeholder9', '/placeholder.svg', 'Mediation', 'hrto', 4, 300),

-- Small Claims Videos
('Small Claims Court Overview', 'Introduction to small claims court in Ontario', 'https://player.vimeo.com/video/placeholder10', '/placeholder.svg', 'Getting Started', 'small-claims', 1, 210),
('Filing Your Small Claims Application', 'How to file and serve your claim', 'https://player.vimeo.com/video/placeholder11', '/placeholder.svg', 'Form Completion', 'small-claims', 2, 450),
('Organizing Evidence for Small Claims', 'What evidence you need for your claim', 'https://player.vimeo.com/video/placeholder12', '/placeholder.svg', 'Evidence Preparation', 'small-claims', 3, 330),
('Small Claims Court Hearing Tips', 'How to present your case effectively', 'https://player.vimeo.com/video/placeholder13', '/placeholder.svg', 'Hearing Preparation', 'small-claims', 4, 390),

-- General Videos
('Understanding Ontario Legal System', 'Overview of courts and tribunals in Ontario', 'https://player.vimeo.com/video/placeholder14', '/placeholder.svg', 'general', 'general', 1, 300),
('Legal Rights and Responsibilities', 'Know your rights as an Ontario resident', 'https://player.vimeo.com/video/placeholder15', '/placeholder.svg', 'general', 'general', 2, 360);

-- Populate document_templates with actual templates
INSERT INTO public.document_templates (title, description, category, template_type, file_path, tags, preview_content, is_premium) VALUES
-- Evidence Organization Templates
('Evidence Log Template', 'Organized spreadsheet to track all your evidence with dates, descriptions, and references', 'Evidence', 'spreadsheet', '/templates/evidence-log.xlsx', ARRAY['evidence', 'organization', 'tracking'], 'Track evidence items, dates collected, relevance to case, and storage location', false),
('Photo Evidence Organizer', 'Template for documenting and labeling photographic evidence', 'Evidence', 'document', '/templates/photo-evidence.docx', ARRAY['evidence', 'photos', 'documentation'], 'Document each photo with date, time, location, and description of what it shows', false),
('Witness Statement Template', 'Professional template for collecting witness statements', 'Evidence', 'document', '/templates/witness-statement.docx', ARRAY['witness', 'statement', 'testimony'], 'I, [Name], of [Address], make the following statement regarding...', false),
('Timeline of Events', 'Visual timeline template to document incident chronology', 'Evidence', 'document', '/templates/timeline.docx', ARRAY['timeline', 'chronology', 'events'], 'Create a clear chronological record of all relevant events in your case', false),

-- Letter Templates for Landlords
('Notice to Landlord - Repair Request', 'Formal letter requesting repairs under RTA', 'LTB', 'letter', '/templates/repair-request.docx', ARRAY['landlord', 'repairs', 'maintenance'], 'Dear Landlord, I am writing to formally request the following repairs...', false),
('Notice to Landlord - Rent Reduction Request', 'Letter requesting rent reduction for service issues', 'LTB', 'letter', '/templates/rent-reduction.docx', ARRAY['landlord', 'rent', 'reduction'], 'Request rent reduction due to lack of services or maintenance issues', false),
('Response to Eviction Notice', 'Template for responding to landlord eviction notice', 'LTB', 'letter', '/templates/eviction-response.docx', ARRAY['eviction', 'response', 'tenant'], 'Formal response to an eviction notice with legal grounds', true),
('Notice to Landlord - Harassment Complaint', 'Document landlord harassment incidents', 'LTB', 'letter', '/templates/harassment-complaint.docx', ARRAY['harassment', 'complaint', 'tenant'], 'Formal complaint documenting harassment by landlord', false),

-- Letter Templates for Employers
('Accommodation Request Letter', 'Request workplace accommodation under Human Rights Code', 'HRTO', 'letter', '/templates/accommodation-request.docx', ARRAY['employer', 'accommodation', 'disability'], 'Request reasonable accommodation in the workplace', false),
('Discrimination Complaint Letter', 'Formal complaint of workplace discrimination', 'HRTO', 'letter', '/templates/discrimination-complaint.docx', ARRAY['discrimination', 'complaint', 'workplace'], 'I am writing to formally complain about discriminatory treatment...', false),
('Harassment Documentation Log', 'Template for documenting workplace harassment', 'HRTO', 'document', '/templates/harassment-log.xlsx', ARRAY['harassment', 'workplace', 'documentation'], 'Date, time, location, witnesses, description of incident', false),

-- Small Claims Templates
('Demand Letter Template', 'Pre-litigation demand letter for payment', 'Small Claims', 'letter', '/templates/demand-letter.docx', ARRAY['demand', 'payment', 'debt'], 'Formal demand for payment before filing small claims', false),
('Small Claims Plaintiff Claim', 'Template for plaintiff claim form', 'Small Claims', 'form', '/templates/plaintiff-claim.pdf', ARRAY['small-claims', 'plaintiff', 'claim'], 'Fill-in template for small claims plaintiff claim', false),
('Defence and Counterclaim Template', 'Template for filing defence in small claims', 'Small Claims', 'form', '/templates/defence.docx', ARRAY['defence', 'counterclaim', 'small-claims'], 'Respond to a small claims action and file counterclaim', true),

-- General Legal Documents
('Affidavit Template', 'Sworn statement template for legal proceedings', 'General', 'document', '/templates/affidavit.docx', ARRAY['affidavit', 'sworn', 'statement'], 'I, [Name], of [Address], make oath and say as follows...', false),
('Character Reference Letter', 'Template for character reference in legal matters', 'General', 'letter', '/templates/character-reference.docx', ARRAY['reference', 'character', 'support'], 'To Whom It May Concern: I am writing to provide a character reference for...', false),
('Legal Fee Agreement Template', 'Template for hiring legal representation', 'General', 'document', '/templates/fee-agreement.docx', ARRAY['legal', 'fees', 'agreement'], 'Agreement between client and legal representative', true);;
