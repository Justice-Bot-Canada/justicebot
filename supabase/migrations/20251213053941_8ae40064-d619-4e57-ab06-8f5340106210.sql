-- Update LTB forms with official PDF URLs
UPDATE forms SET pdf_url = 'https://tribunalsontario.ca/documents/ltb/Application%20Instructions/T1_Instructions_20200615.pdf' WHERE form_code = 'LTB-T1';
UPDATE forms SET pdf_url = 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20%26%20Instructions/T2.pdf' WHERE form_code = 'LTB-T2';
UPDATE forms SET pdf_url = 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20%26%20Instructions/T6.pdf' WHERE form_code = 'LTB-T6';

-- Update HRTO forms
UPDATE forms SET pdf_url = 'https://tribunalsontario.ca/documents/hrto/Form%201%20-%20Application%20%28General%29.pdf' WHERE form_code = 'HRTO-1';
UPDATE forms SET pdf_url = 'https://tribunalsontario.ca/documents/hrto/Schedule%20A.pdf' WHERE form_code = 'ON-HRTO-SCHEDULE-A';

-- Update Small Claims forms with Ontario Court Forms URLs
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/scsm/en/7a-plaintiff-claim.pdf' WHERE form_code = 'SC-00-1';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/scsm/en/9a-defence.pdf' WHERE form_code = 'SC-10-1';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/scsm/en/14a-offer-to-settle.pdf' WHERE form_code = 'SC-14A';

-- Update Family Law forms
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/flr/en/8-application-general.pdf' WHERE form_code IN ('FL-01', 'ON-FLR-8');
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/flr/en/8a-application-divorce.pdf' WHERE form_code = 'ON-FLR-8A';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/flr/en/8b-application-support.pdf' WHERE form_code = 'ON-FLR-8B';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/flr/en/8b1-application-child-protection.pdf' WHERE form_code = 'ON-FLR-8B1';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/flr/en/6-affidavit-general.pdf' WHERE form_code = 'FL-06';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/flr/en/13-financial-statement-support.pdf' WHERE form_code IN ('FL-12', 'ON-FLR-13');
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/flr/en/13-1-financial-statement-property-support.pdf' WHERE form_code = 'ON-FLR-13-1';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/flr/en/35-1-affidavit-decision-making.pdf' WHERE form_code = 'ON-FLR-35-1';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/flr/en/36-affidavit-divorce.pdf' WHERE form_code = 'ON-FLR-36';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/flr/en/25a-divorce-order.pdf' WHERE form_code = 'ON-FLR-25A';

-- Update Civil forms
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/cv/en/14a-statement-of-claim-general.pdf' WHERE form_code = 'ON-CV-14A';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/cv/en/18a-statement-of-defence.pdf' WHERE form_code = 'ON-CV-18A';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/cv/en/37a-notice-of-motion.pdf' WHERE form_code = 'ON-CV-37A';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/cv/en/4a-consent.pdf' WHERE form_code = 'ON-CV-4A';
UPDATE forms SET pdf_url = 'https://ontariocourtforms.on.ca/static/media/cv/en/4c-affidavit-of-service.pdf' WHERE form_code = 'ON-CV-4C';

-- Update WSIB forms (official WSIB URLs)
UPDATE forms SET pdf_url = 'https://www.wsib.ca/sites/default/files/2019-01/0006a_06_19.pdf' WHERE form_code = 'WSIB-6';
UPDATE forms SET pdf_url = 'https://www.wsib.ca/sites/default/files/2019-01/0007a_06_19.pdf' WHERE form_code = 'WSIB-7';
UPDATE forms SET pdf_url = 'https://www.wsib.ca/sites/default/files/2019-01/0008_06_19.pdf' WHERE form_code = 'WSIB-8';