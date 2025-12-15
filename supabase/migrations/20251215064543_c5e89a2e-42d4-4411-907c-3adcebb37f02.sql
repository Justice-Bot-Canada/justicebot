-- Update ALL form prices to $5.99 (599 cents)
UPDATE forms SET price_cents = 599 WHERE price_cents != 599;

-- Add Quebec Forms (comprehensive coverage)
INSERT INTO forms (form_code, title, description, tribunal_type, category, is_active, pdf_url, price_cents)
VALUES
-- Quebec Rental Board (TAL - Tribunal administratif du logement)
('TAL-A', 'Application to the TAL', 'Application to the Tribunal administratif du logement for tenant disputes', 'tal', 'tenant_rights', true, 'https://www.tal.gouv.qc.ca/sites/default/files/TAL_form_A.pdf', 599),
('TAL-D', 'Demand for Damages', 'Request for compensation for damages caused by landlord or tenant', 'tal', 'tenant_rights', true, 'https://www.tal.gouv.qc.ca/sites/default/files/TAL_form_D.pdf', 599),
('TAL-R', 'Request for Rent Decrease', 'Application for rent reduction due to defects or lack of services', 'tal', 'tenant_rights', true, 'https://www.tal.gouv.qc.ca/sites/default/files/TAL_form_R.pdf', 599),
('TAL-E', 'Eviction Application', 'Landlord application to evict tenant', 'tal', 'tenant_rights', true, 'https://www.tal.gouv.qc.ca/sites/default/files/TAL_form_E.pdf', 599),
('TAL-N', 'Non-Payment of Rent', 'Application for non-payment of rent recovery', 'tal', 'tenant_rights', true, 'https://www.tal.gouv.qc.ca/sites/default/files/TAL_form_N.pdf', 599),

-- Quebec Human Rights (CDPDJ - Commission des droits de la personne et des droits de la jeunesse)
('CDPDJ-1', 'Discrimination Complaint', 'File a discrimination complaint with Quebec Human Rights Commission', 'cdpdj', 'human_rights', true, 'https://www.cdpdj.qc.ca/storage/app/media/form-plainte.pdf', 599),
('CDPDJ-2', 'Harassment Complaint', 'File a harassment complaint based on prohibited grounds', 'cdpdj', 'human_rights', true, 'https://www.cdpdj.qc.ca/storage/app/media/form-harcelement.pdf', 599),
('CDPDJ-3', 'Systemic Discrimination Complaint', 'Complaint for systemic or organizational discrimination', 'cdpdj', 'human_rights', true, 'https://www.cdpdj.qc.ca/storage/app/media/form-systemique.pdf', 599),

-- Quebec Small Claims (Cour du Québec - Division des petites créances)
('SCC-1', 'Statement of Claim (Small Claims)', 'Quebec Small Claims Court claim form up to $15,000', 'small-claims-qc', 'small_claims', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/SCC-1.pdf', 599),
('SCC-2', 'Defence (Small Claims)', 'Response to Small Claims Court claim', 'small-claims-qc', 'small_claims', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/SCC-2.pdf', 599),
('SCC-3', 'Counterclaim (Small Claims)', 'Counterclaim in Small Claims proceedings', 'small-claims-qc', 'small_claims', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/SCC-3.pdf', 599),
('SCC-4', 'Motion for Default Judgment', 'Request judgment when defendant fails to respond', 'small-claims-qc', 'small_claims', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/SCC-4.pdf', 599),

-- Quebec Family Court Forms
('QC-FLA-1', 'Application for Divorce', 'Quebec divorce application form', 'family-qc', 'family', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/divorce.pdf', 599),
('QC-FLA-2', 'Child Custody Application', 'Application for child custody determination', 'family-qc', 'family', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/garde-enfants.pdf', 599),
('QC-FLA-3', 'Child Support Application', 'Application to establish or modify child support', 'family-qc', 'family', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/pension-alimentaire.pdf', 599),
('QC-FLA-4', 'Spousal Support Application', 'Application for spousal support', 'family-qc', 'family', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/pension-epoux.pdf', 599),
('QC-FLA-5', 'Motion to Vary Order', 'Motion to change existing family court order', 'family-qc', 'family', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/modification-ordonnance.pdf', 599),
('QC-FLA-6', 'Parenting Plan', 'Quebec parenting time schedule form', 'family-qc', 'family', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/plan-parental.pdf', 599),

-- Quebec Labour (CNESST - Commission des normes, de l'équité, de la santé et de la sécurité du travail)
('CNESST-1', 'Workplace Injury Claim', 'Report workplace injury to CNESST', 'cnesst', 'labour', true, 'https://www.cnesst.gouv.qc.ca/sites/default/files/documents/reclamation-travailleur.pdf', 599),
('CNESST-2', 'Wage Complaint', 'Complaint for unpaid wages or labour standards violation', 'cnesst', 'labour', true, 'https://www.cnesst.gouv.qc.ca/sites/default/files/documents/plainte-salaire.pdf', 599),
('CNESST-3', 'Wrongful Dismissal Complaint', 'Complaint for unjust termination', 'cnesst', 'labour', true, 'https://www.cnesst.gouv.qc.ca/sites/default/files/documents/plainte-congediement.pdf', 599),
('CNESST-4', 'Psychological Harassment Complaint', 'Workplace harassment complaint form', 'cnesst', 'labour', true, 'https://www.cnesst.gouv.qc.ca/sites/default/files/documents/plainte-harcelement.pdf', 599),

-- Quebec Superior Court Civil Forms
('QC-CV-1', 'Statement of Claim (Superior Court)', 'Civil claim in Quebec Superior Court', 'superior-court-qc', 'civil', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/declaration.pdf', 599),
('QC-CV-2', 'Defence and Counterclaim', 'Defence filing in Superior Court', 'superior-court-qc', 'civil', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/defense.pdf', 599),
('QC-CV-3', 'Motion for Summary Judgment', 'Request for judgment without trial', 'superior-court-qc', 'civil', true, 'https://www.justice.gouv.qc.ca/fileadmin/user_upload/contenu/documents/formulaires/requete-jugement.pdf', 599)
ON CONFLICT (form_code) DO NOTHING;