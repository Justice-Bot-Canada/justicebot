-- Seed pathway_rules with deterministic routing rules
-- These are the canonical rule-based fallback for AI failures

INSERT INTO pathway_rules (pathway_id, rule_name, tribunal, category, issue_keywords, province, recommended_forms, timeframe, filing_fee, success_rate, reasoning, priority, is_active)
VALUES
-- LTB Tenant Rights (T2)
('ltb-t2', 'LTB Tenant Rights T2', 'LTB', 'tenant_rights', 
 ARRAY['harassment', 'landlord entry', 'vital services', 'illegal entry', 'intimidation', 'threatened eviction', 'changed locks', 'cut utilities', 'disconnected services'],
 'ON', ARRAY['T2'], '3-6 months', '$53', 72, 
 'Landlord and Tenant Board handles tenant rights violations including harassment, illegal entry, and service disruptions', 1, true),

-- LTB Maintenance (T6)
('ltb-t6', 'LTB Maintenance T6', 'LTB', 'maintenance',
 ARRAY['repairs', 'maintenance', 'mold', 'pest', 'cockroach', 'bedbug', 'mice', 'heat', 'hot water', 'plumbing', 'broken', 'leak', 'not fixed', 'unsafe', 'housing standards'],
 'ON', ARRAY['T6'], '3-6 months', '$53', 68,
 'LTB handles maintenance issues affecting health, safety, or housing standards violations', 2, true),

-- LTB Eviction Defense (N4)
('ltb-n4-defense', 'LTB Eviction Defense', 'LTB', 'eviction',
 ARRAY['eviction', 'n4', 'n5', 'n6', 'n7', 'n12', 'n13', 'notice to terminate', 'must leave', 'sheriff', 'locked out', 'kicked out'],
 'ON', ARRAY['L1', 'L2'], '1-3 months', 'Varies', 55,
 'Respond to eviction notices at the Landlord and Tenant Board', 3, true),

-- HRTO Discrimination
('hrto-discrimination', 'HRTO Human Rights', 'HRTO', 'discrimination',
 ARRAY['discrimination', 'human rights', 'disability', 'race', 'sex', 'gender', 'religion', 'age', 'family status', 'creed', 'ancestry', 'sexual orientation', 'accommodation', 'refused', 'denied'],
 'ON', ARRAY['Form1'], '12-18 months', 'Free', 45,
 'Human Rights Tribunal handles discrimination complaints under Ontario Human Rights Code', 4, true),

-- Small Claims Court (under $35k)
('small-claims-money', 'Small Claims Court', 'COURT', 'money_dispute',
 ARRAY['money owed', 'debt', 'unpaid', 'contract breach', 'damaged property', 'refund', 'deposit', 'sue', 'lawsuit', 'claim'],
 'ON', ARRAY['Form7A'], '6-12 months', '$102-$500', 60,
 'Small Claims Court handles monetary disputes up to $35,000', 5, true),

-- Family Court
('family-court', 'Family Court', 'COURT', 'family',
 ARRAY['custody', 'child support', 'spousal support', 'divorce', 'separation', 'access', 'parenting', 'family'],
 'ON', ARRAY['Form8'], '6-24 months', 'Varies', 50,
 'Ontario Court of Justice Family Court handles custody, support, and divorce matters', 6, true),

-- Labour Board
('labour-board', 'Ontario Labour Relations Board', 'OLRB', 'employment',
 ARRAY['wrongful dismissal', 'termination', 'fired', 'laid off', 'severance', 'wages owed', 'overtime', 'unpaid'],
 'ON', ARRAY[]::text[], '3-12 months', 'Free', 55,
 'Ontario Labour Relations Board handles employment standards and wrongful dismissal claims', 7, true),

-- Criminal (Limited Scope)
('criminal-info', 'Criminal Court Information', 'COURT', 'criminal',
 ARRAY['arrested', 'charged', 'criminal', 'assault', 'theft', 'bail', 'trial'],
 NULL, ARRAY[]::text[], 'Varies', 'Varies', 0,
 'Criminal matters require legal representation - Justice-Bot provides procedural information only', 10, true),

-- BC RTB (Tenants)
('bc-rtb', 'BC Residential Tenancy Branch', 'RTB', 'tenant_rights',
 ARRAY['landlord', 'tenant', 'rent', 'repairs', 'eviction', 'deposit'],
 'BC', ARRAY[]::text[], '2-4 months', '$100', 60,
 'BC Residential Tenancy Branch handles landlord-tenant disputes', 8, true),

-- AB RTDRS
('ab-rtdrs', 'Alberta Residential Tenancy Dispute Resolution', 'RTDRS', 'tenant_rights',
 ARRAY['landlord', 'tenant', 'rent', 'repairs', 'eviction', 'deposit'],
 'AB', ARRAY[]::text[], '2-6 months', '$75', 55,
 'Alberta RTDRS handles landlord-tenant disputes', 9, true);

-- Create index for faster pathway lookups
CREATE INDEX IF NOT EXISTS idx_pathway_rules_active_province ON pathway_rules(is_active, province) WHERE is_active = true;