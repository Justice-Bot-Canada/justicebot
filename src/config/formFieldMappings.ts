// Complete Form Field Mappings for Ontario, BC, and Alberta
// Each tribunal type has specific field templates matching official court form requirements

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'checkbox' | 'select' | 'number' | 'phone' | 'email';
  required?: boolean;
  placeholder?: string;
  options?: string[]; // For select fields
  maxLength?: number;
  section?: string; // Group fields into sections
}

export interface ProvinceFormConfig {
  tribunalName: string;
  formSourceUrl: string;
  fields: FormField[];
}

// ============================================
// ONTARIO FORM FIELD MAPPINGS
// ============================================

export const ONTARIO_LTB_FIELDS: FormField[] = [
  // Applicant (Tenant) Information
  { id: 'tenant_name', label: 'Tenant Full Legal Name', type: 'text', required: true, section: 'Tenant Information' },
  { id: 'tenant_address_street', label: 'Street Address', type: 'text', required: true, section: 'Tenant Information' },
  { id: 'tenant_address_unit', label: 'Unit/Apt Number', type: 'text', section: 'Tenant Information' },
  { id: 'tenant_address_city', label: 'City', type: 'text', required: true, section: 'Tenant Information' },
  { id: 'tenant_address_postal', label: 'Postal Code', type: 'text', required: true, section: 'Tenant Information' },
  { id: 'tenant_phone', label: 'Phone Number', type: 'phone', section: 'Tenant Information' },
  { id: 'tenant_email', label: 'Email Address', type: 'email', section: 'Tenant Information' },
  
  // Landlord Information
  { id: 'landlord_name', label: 'Landlord/Property Manager Name', type: 'text', required: true, section: 'Landlord Information' },
  { id: 'landlord_company', label: 'Property Management Company (if applicable)', type: 'text', section: 'Landlord Information' },
  { id: 'landlord_address', label: 'Landlord Address', type: 'text', required: true, section: 'Landlord Information' },
  { id: 'landlord_phone', label: 'Landlord Phone', type: 'phone', section: 'Landlord Information' },
  { id: 'landlord_email', label: 'Landlord Email', type: 'email', section: 'Landlord Information' },
  
  // Rental Unit Information
  { id: 'rental_address', label: 'Rental Unit Address', type: 'text', required: true, section: 'Rental Unit' },
  { id: 'rental_unit_number', label: 'Unit Number', type: 'text', section: 'Rental Unit' },
  { id: 'monthly_rent', label: 'Monthly Rent Amount ($)', type: 'number', required: true, section: 'Rental Unit' },
  { id: 'rent_due_date', label: 'Rent Due Date (day of month)', type: 'number', section: 'Rental Unit' },
  { id: 'lease_start_date', label: 'Lease Start Date', type: 'date', section: 'Rental Unit' },
  { id: 'lease_type', label: 'Lease Type', type: 'select', options: ['Month-to-month', 'Fixed term', 'Periodic'], section: 'Rental Unit' },
  
  // Issue Details
  { id: 'issue_start_date', label: 'Date Issue Started', type: 'date', required: true, section: 'Issue Details' },
  { id: 'issue_type', label: 'Type of Issue', type: 'select', options: [
    'Maintenance/Repairs not done',
    'Harassment by landlord',
    'Illegal entry',
    'Interference with reasonable enjoyment',
    'Rent reduction request',
    'Bad faith notice (N12/N13)',
    'Other'
  ], required: true, section: 'Issue Details' },
  { id: 'issue_description', label: 'Detailed Description of Issue', type: 'textarea', required: true, maxLength: 5000, section: 'Issue Details' },
  { id: 'previous_attempts', label: 'Previous Attempts to Resolve (dates, what was said)', type: 'textarea', section: 'Issue Details' },
  
  // Remedy Sought
  { id: 'remedy_sought', label: 'Remedy/Order Sought', type: 'textarea', required: true, section: 'Remedy Sought' },
  { id: 'monetary_amount', label: 'Monetary Amount Claimed ($)', type: 'number', section: 'Remedy Sought' },
  { id: 'rent_abatement_amount', label: 'Rent Abatement Amount ($)', type: 'number', section: 'Remedy Sought' },
];

export const ONTARIO_HRTO_FIELDS: FormField[] = [
  // Applicant Information
  { id: 'applicant_name', label: 'Full Legal Name', type: 'text', required: true, section: 'Applicant Information' },
  { id: 'applicant_address', label: 'Street Address', type: 'text', required: true, section: 'Applicant Information' },
  { id: 'applicant_city', label: 'City', type: 'text', required: true, section: 'Applicant Information' },
  { id: 'applicant_province', label: 'Province', type: 'text', required: true, section: 'Applicant Information' },
  { id: 'applicant_postal', label: 'Postal Code', type: 'text', required: true, section: 'Applicant Information' },
  { id: 'applicant_phone', label: 'Phone Number', type: 'phone', section: 'Applicant Information' },
  { id: 'applicant_email', label: 'Email Address', type: 'email', section: 'Applicant Information' },
  { id: 'applicant_preferred_language', label: 'Preferred Language', type: 'select', options: ['English', 'French'], section: 'Applicant Information' },
  
  // Respondent Information
  { id: 'respondent_name', label: 'Respondent Name (Organization/Individual)', type: 'text', required: true, section: 'Respondent Information' },
  { id: 'respondent_type', label: 'Respondent Type', type: 'select', options: ['Individual', 'Corporation', 'Partnership', 'Government Agency', 'Other'], section: 'Respondent Information' },
  { id: 'respondent_address', label: 'Respondent Address', type: 'text', required: true, section: 'Respondent Information' },
  { id: 'respondent_phone', label: 'Respondent Phone', type: 'phone', section: 'Respondent Information' },
  { id: 'respondent_email', label: 'Respondent Email', type: 'email', section: 'Respondent Information' },
  
  // Discrimination Details
  { id: 'social_area', label: 'Social Area', type: 'select', options: [
    'Employment',
    'Housing (accommodation)',
    'Goods, Services and Facilities',
    'Contracts',
    'Membership in unions, trade or professional associations'
  ], required: true, section: 'Discrimination Details' },
  { id: 'discrimination_grounds', label: 'Ground(s) of Discrimination', type: 'select', options: [
    'Race',
    'Ancestry',
    'Place of origin',
    'Colour',
    'Ethnic origin',
    'Citizenship',
    'Creed (religion)',
    'Sex (including pregnancy, gender identity)',
    'Sexual orientation',
    'Age',
    'Marital status',
    'Family status',
    'Disability',
    'Receipt of public assistance (housing only)',
    'Record of offences (employment only)'
  ], required: true, section: 'Discrimination Details' },
  { id: 'incident_date', label: 'Date of Most Recent Incident', type: 'date', required: true, section: 'Discrimination Details' },
  { id: 'incident_ongoing', label: 'Is the discrimination ongoing?', type: 'checkbox', section: 'Discrimination Details' },
  { id: 'incident_description', label: 'Detailed Description of Discrimination', type: 'textarea', required: true, maxLength: 10000, section: 'Discrimination Details' },
  { id: 'comparator_treatment', label: 'How were others treated differently?', type: 'textarea', section: 'Discrimination Details' },
  
  // Previous Complaints
  { id: 'previous_complaint', label: 'Have you filed this complaint elsewhere?', type: 'checkbox', section: 'Other Proceedings' },
  { id: 'previous_complaint_details', label: 'If yes, provide details', type: 'textarea', section: 'Other Proceedings' },
  
  // Remedy Sought
  { id: 'remedy_monetary', label: 'Monetary Compensation Sought ($)', type: 'number', section: 'Remedy Sought' },
  { id: 'remedy_non_monetary', label: 'Non-Monetary Remedy Sought', type: 'textarea', section: 'Remedy Sought' },
  { id: 'remedy_public_interest', label: 'Public Interest Remedy Sought', type: 'textarea', section: 'Remedy Sought' },
];

export const ONTARIO_SMALL_CLAIMS_FIELDS: FormField[] = [
  // Plaintiff Information
  { id: 'plaintiff_name', label: 'Plaintiff Full Legal Name', type: 'text', required: true, section: 'Plaintiff Information' },
  { id: 'plaintiff_address', label: 'Street Address', type: 'text', required: true, section: 'Plaintiff Information' },
  { id: 'plaintiff_city', label: 'City', type: 'text', required: true, section: 'Plaintiff Information' },
  { id: 'plaintiff_province', label: 'Province', type: 'text', required: true, section: 'Plaintiff Information' },
  { id: 'plaintiff_postal', label: 'Postal Code', type: 'text', required: true, section: 'Plaintiff Information' },
  { id: 'plaintiff_phone', label: 'Phone Number', type: 'phone', section: 'Plaintiff Information' },
  { id: 'plaintiff_email', label: 'Email Address', type: 'email', section: 'Plaintiff Information' },
  
  // Defendant Information
  { id: 'defendant_name', label: 'Defendant Full Legal Name', type: 'text', required: true, section: 'Defendant Information' },
  { id: 'defendant_is_business', label: 'Defendant is a Business', type: 'checkbox', section: 'Defendant Information' },
  { id: 'defendant_address', label: 'Defendant Street Address', type: 'text', required: true, section: 'Defendant Information' },
  { id: 'defendant_city', label: 'City', type: 'text', required: true, section: 'Defendant Information' },
  { id: 'defendant_province', label: 'Province', type: 'text', section: 'Defendant Information' },
  { id: 'defendant_postal', label: 'Postal Code', type: 'text', section: 'Defendant Information' },
  { id: 'defendant_phone', label: 'Defendant Phone', type: 'phone', section: 'Defendant Information' },
  
  // Claim Details
  { id: 'claim_type', label: 'Type of Claim', type: 'select', options: [
    'Breach of Contract',
    'Unpaid Debt',
    'Property Damage',
    'Personal Injury',
    'Consumer Protection',
    'Return of Property',
    'Other'
  ], required: true, section: 'Claim Details' },
  { id: 'claim_amount', label: 'Amount Claimed ($)', type: 'number', required: true, section: 'Claim Details' },
  { id: 'pre_judgment_interest', label: 'Pre-Judgment Interest Rate (%)', type: 'number', section: 'Claim Details' },
  { id: 'claim_date', label: 'Date Claim Arose', type: 'date', required: true, section: 'Claim Details' },
  { id: 'claim_location', label: 'Where did the issue occur?', type: 'text', section: 'Claim Details' },
  { id: 'claim_description', label: 'Detailed Description of Claim', type: 'textarea', required: true, maxLength: 5000, section: 'Claim Details' },
  { id: 'evidence_summary', label: 'Summary of Evidence You Have', type: 'textarea', section: 'Claim Details' },
  
  // Previous Attempts
  { id: 'demand_letter_sent', label: 'Have you sent a demand letter?', type: 'checkbox', section: 'Previous Attempts' },
  { id: 'demand_letter_date', label: 'Demand Letter Date', type: 'date', section: 'Previous Attempts' },
  { id: 'settlement_attempts', label: 'Previous Settlement Attempts', type: 'textarea', section: 'Previous Attempts' },
  
  // Court Selection
  { id: 'court_location', label: 'Preferred Court Location', type: 'text', required: true, section: 'Court Information' },
];

export const ONTARIO_FAMILY_FIELDS: FormField[] = [
  // Applicant Information
  { id: 'applicant_name', label: 'Your Full Legal Name', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_birthdate', label: 'Your Date of Birth', type: 'date', section: 'Your Information' },
  { id: 'applicant_address', label: 'Street Address', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_city', label: 'City', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_postal', label: 'Postal Code', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_phone', label: 'Phone Number', type: 'phone', section: 'Your Information' },
  { id: 'applicant_email', label: 'Email Address', type: 'email', section: 'Your Information' },
  { id: 'applicant_occupation', label: 'Occupation', type: 'text', section: 'Your Information' },
  { id: 'applicant_employer', label: 'Employer Name', type: 'text', section: 'Your Information' },
  
  // Respondent Information
  { id: 'respondent_name', label: 'Other Party Full Legal Name', type: 'text', required: true, section: 'Other Party Information' },
  { id: 'respondent_birthdate', label: 'Other Party Date of Birth', type: 'date', section: 'Other Party Information' },
  { id: 'respondent_address', label: 'Other Party Address', type: 'text', section: 'Other Party Information' },
  { id: 'respondent_phone', label: 'Other Party Phone', type: 'phone', section: 'Other Party Information' },
  { id: 'respondent_email', label: 'Other Party Email', type: 'email', section: 'Other Party Information' },
  
  // Relationship Information
  { id: 'marriage_date', label: 'Date of Marriage', type: 'date', section: 'Relationship Details' },
  { id: 'marriage_location', label: 'Place of Marriage', type: 'text', section: 'Relationship Details' },
  { id: 'separation_date', label: 'Date of Separation', type: 'date', required: true, section: 'Relationship Details' },
  { id: 'cohabitation_start', label: 'Date You Started Living Together', type: 'date', section: 'Relationship Details' },
  
  // Children Information
  { id: 'children_names', label: 'Names of Children (comma separated)', type: 'textarea', section: 'Children' },
  { id: 'children_birthdates', label: 'Children Birth Dates', type: 'textarea', section: 'Children' },
  { id: 'children_current_residence', label: 'Where Children Currently Reside', type: 'text', section: 'Children' },
  { id: 'current_custody_arrangement', label: 'Current Custody/Access Arrangement', type: 'textarea', section: 'Children' },
  
  // Property Information
  { id: 'matrimonial_home_address', label: 'Matrimonial Home Address', type: 'text', section: 'Property' },
  { id: 'matrimonial_home_value', label: 'Estimated Value of Matrimonial Home ($)', type: 'number', section: 'Property' },
  { id: 'mortgage_balance', label: 'Mortgage Balance ($)', type: 'number', section: 'Property' },
  { id: 'other_property', label: 'Other Significant Property', type: 'textarea', section: 'Property' },
  
  // Financial Information
  { id: 'annual_income', label: 'Your Annual Income ($)', type: 'number', section: 'Financial' },
  { id: 'income_source', label: 'Source of Income', type: 'text', section: 'Financial' },
  { id: 'spouse_annual_income', label: 'Other Party Annual Income ($)', type: 'number', section: 'Financial' },
  { id: 'monthly_expenses', label: 'Your Monthly Expenses ($)', type: 'number', section: 'Financial' },
  
  // Orders Sought
  { id: 'orders_sought', label: 'Orders Sought', type: 'select', options: [
    'Divorce',
    'Custody',
    'Access',
    'Child Support',
    'Spousal Support',
    'Property Division',
    'Restraining Order',
    'Exclusive Possession of Matrimonial Home'
  ], required: true, section: 'Orders Sought' },
  { id: 'orders_description', label: 'Detailed Description of Orders Sought', type: 'textarea', required: true, section: 'Orders Sought' },
];

export const ONTARIO_WSIB_FIELDS: FormField[] = [
  // Worker Information
  { id: 'worker_name', label: 'Worker Full Legal Name', type: 'text', required: true, section: 'Worker Information' },
  { id: 'worker_address', label: 'Street Address', type: 'text', required: true, section: 'Worker Information' },
  { id: 'worker_city', label: 'City', type: 'text', required: true, section: 'Worker Information' },
  { id: 'worker_postal', label: 'Postal Code', type: 'text', required: true, section: 'Worker Information' },
  { id: 'worker_phone', label: 'Phone Number', type: 'phone', section: 'Worker Information' },
  { id: 'worker_sin', label: 'SIN (last 4 digits)', type: 'text', section: 'Worker Information' },
  { id: 'worker_birthdate', label: 'Date of Birth', type: 'date', section: 'Worker Information' },
  
  // Employer Information
  { id: 'employer_name', label: 'Employer Name', type: 'text', required: true, section: 'Employer Information' },
  { id: 'employer_address', label: 'Employer Address', type: 'text', section: 'Employer Information' },
  { id: 'employer_phone', label: 'Employer Phone', type: 'phone', section: 'Employer Information' },
  { id: 'supervisor_name', label: 'Supervisor Name', type: 'text', section: 'Employer Information' },
  
  // Injury/Illness Details
  { id: 'injury_date', label: 'Date of Injury/Illness', type: 'date', required: true, section: 'Injury Details' },
  { id: 'injury_time', label: 'Time of Injury (if known)', type: 'text', section: 'Injury Details' },
  { id: 'injury_location', label: 'Where Did Injury Occur?', type: 'text', required: true, section: 'Injury Details' },
  { id: 'injury_type', label: 'Type of Injury/Illness', type: 'text', required: true, section: 'Injury Details' },
  { id: 'body_parts_affected', label: 'Body Parts Affected', type: 'textarea', section: 'Injury Details' },
  { id: 'injury_description', label: 'How Did Injury Occur?', type: 'textarea', required: true, section: 'Injury Details' },
  
  // Medical Treatment
  { id: 'treatment_received', label: 'Treatment Received', type: 'textarea', section: 'Medical Treatment' },
  { id: 'doctor_name', label: 'Treating Doctor Name', type: 'text', section: 'Medical Treatment' },
  { id: 'hospital_name', label: 'Hospital/Clinic Name', type: 'text', section: 'Medical Treatment' },
  { id: 'time_off_work', label: 'Time Off Work Required', type: 'text', section: 'Medical Treatment' },
  
  // Claim Information
  { id: 'claim_number', label: 'WSIB Claim Number (if assigned)', type: 'text', section: 'Claim Information' },
  { id: 'appeal_reason', label: 'Reason for Appeal/Objection', type: 'textarea', section: 'Claim Information' },
];

export const ONTARIO_SUPERIOR_COURT_FIELDS: FormField[] = [
  // Plaintiff/Applicant Information
  { id: 'plaintiff_name', label: 'Plaintiff/Applicant Full Legal Name', type: 'text', required: true, section: 'Plaintiff Information' },
  { id: 'plaintiff_address', label: 'Street Address', type: 'text', required: true, section: 'Plaintiff Information' },
  { id: 'plaintiff_city', label: 'City', type: 'text', required: true, section: 'Plaintiff Information' },
  { id: 'plaintiff_postal', label: 'Postal Code', type: 'text', required: true, section: 'Plaintiff Information' },
  { id: 'plaintiff_phone', label: 'Phone Number', type: 'phone', section: 'Plaintiff Information' },
  { id: 'plaintiff_email', label: 'Email Address', type: 'email', section: 'Plaintiff Information' },
  { id: 'plaintiff_lawyer', label: 'Lawyer Name (if represented)', type: 'text', section: 'Plaintiff Information' },
  { id: 'lawyer_firm', label: 'Law Firm Name', type: 'text', section: 'Plaintiff Information' },
  
  // Defendant/Respondent Information
  { id: 'defendant_name', label: 'Defendant/Respondent Full Legal Name', type: 'text', required: true, section: 'Defendant Information' },
  { id: 'defendant_address', label: 'Defendant Address', type: 'text', required: true, section: 'Defendant Information' },
  { id: 'defendant_city', label: 'City', type: 'text', section: 'Defendant Information' },
  { id: 'defendant_postal', label: 'Postal Code', type: 'text', section: 'Defendant Information' },
  
  // Case Information
  { id: 'court_file_number', label: 'Court File Number (if assigned)', type: 'text', section: 'Case Information' },
  { id: 'court_location', label: 'Court Location', type: 'text', required: true, section: 'Case Information' },
  { id: 'proceeding_type', label: 'Type of Proceeding', type: 'select', options: [
    'Action',
    'Application',
    'Appeal',
    'Motion',
    'Judicial Review'
  ], section: 'Case Information' },
  
  // Claim Details
  { id: 'amount_claimed', label: 'Amount Claimed ($)', type: 'number', section: 'Claim Details' },
  { id: 'claim_summary', label: 'Summary of Claim/Application', type: 'textarea', required: true, section: 'Claim Details' },
  { id: 'relief_sought', label: 'Relief/Orders Sought', type: 'textarea', required: true, section: 'Claim Details' },
  { id: 'grounds', label: 'Grounds for Claim', type: 'textarea', section: 'Claim Details' },
];

// ============================================
// BRITISH COLUMBIA FORM FIELD MAPPINGS
// ============================================

export const BC_RESIDENTIAL_TENANCY_FIELDS: FormField[] = [
  // Tenant Information
  { id: 'tenant_name', label: 'Tenant Full Legal Name', type: 'text', required: true, section: 'Tenant Information' },
  { id: 'tenant_address', label: 'Mailing Address', type: 'text', required: true, section: 'Tenant Information' },
  { id: 'tenant_city', label: 'City', type: 'text', required: true, section: 'Tenant Information' },
  { id: 'tenant_postal', label: 'Postal Code', type: 'text', required: true, section: 'Tenant Information' },
  { id: 'tenant_phone', label: 'Phone Number', type: 'phone', section: 'Tenant Information' },
  { id: 'tenant_email', label: 'Email Address', type: 'email', section: 'Tenant Information' },
  
  // Landlord Information
  { id: 'landlord_name', label: 'Landlord Name', type: 'text', required: true, section: 'Landlord Information' },
  { id: 'landlord_address', label: 'Landlord Address', type: 'text', required: true, section: 'Landlord Information' },
  { id: 'landlord_phone', label: 'Landlord Phone', type: 'phone', section: 'Landlord Information' },
  
  // Rental Unit
  { id: 'rental_address', label: 'Rental Unit Address', type: 'text', required: true, section: 'Rental Unit' },
  { id: 'monthly_rent', label: 'Monthly Rent ($)', type: 'number', required: true, section: 'Rental Unit' },
  { id: 'tenancy_start', label: 'Tenancy Start Date', type: 'date', section: 'Rental Unit' },
  
  // Dispute Details
  { id: 'dispute_type', label: 'Type of Dispute', type: 'select', options: [
    'Repairs and maintenance',
    'Return of security deposit',
    'Rent increase dispute',
    'Notice to end tenancy dispute',
    'Monetary compensation',
    'Breach of quiet enjoyment',
    'Other'
  ], required: true, section: 'Dispute Details' },
  { id: 'dispute_description', label: 'Description of Dispute', type: 'textarea', required: true, section: 'Dispute Details' },
  { id: 'monetary_amount', label: 'Monetary Amount Claimed ($)', type: 'number', section: 'Dispute Details' },
  { id: 'remedy_sought', label: 'Remedy Sought', type: 'textarea', section: 'Dispute Details' },
];

export const BC_HUMAN_RIGHTS_FIELDS: FormField[] = [
  // Complainant Information
  { id: 'complainant_name', label: 'Full Legal Name', type: 'text', required: true, section: 'Complainant Information' },
  { id: 'complainant_address', label: 'Mailing Address', type: 'text', required: true, section: 'Complainant Information' },
  { id: 'complainant_city', label: 'City', type: 'text', required: true, section: 'Complainant Information' },
  { id: 'complainant_postal', label: 'Postal Code', type: 'text', required: true, section: 'Complainant Information' },
  { id: 'complainant_phone', label: 'Phone', type: 'phone', section: 'Complainant Information' },
  { id: 'complainant_email', label: 'Email', type: 'email', section: 'Complainant Information' },
  
  // Respondent Information
  { id: 'respondent_name', label: 'Respondent Name', type: 'text', required: true, section: 'Respondent Information' },
  { id: 'respondent_address', label: 'Respondent Address', type: 'text', section: 'Respondent Information' },
  { id: 'respondent_phone', label: 'Respondent Phone', type: 'phone', section: 'Respondent Information' },
  
  // Discrimination Details (BC Human Rights Code grounds)
  { id: 'area_of_discrimination', label: 'Area of Discrimination', type: 'select', options: [
    'Employment',
    'Tenancy',
    'Purchase of property',
    'Services and facilities',
    'Publications',
    'Union membership'
  ], required: true, section: 'Discrimination Details' },
  { id: 'ground_of_discrimination', label: 'Ground of Discrimination', type: 'select', options: [
    'Race',
    'Colour',
    'Ancestry',
    'Place of origin',
    'Religion',
    'Marital status',
    'Family status',
    'Physical or mental disability',
    'Sex',
    'Sexual orientation',
    'Gender identity or expression',
    'Age',
    'Political belief',
    'Conviction for criminal or summary offence (employment only)'
  ], required: true, section: 'Discrimination Details' },
  { id: 'incident_date', label: 'Date of Incident', type: 'date', required: true, section: 'Discrimination Details' },
  { id: 'incident_description', label: 'Description of Incident', type: 'textarea', required: true, section: 'Discrimination Details' },
  
  // Remedy
  { id: 'remedy_sought', label: 'Remedy Sought', type: 'textarea', section: 'Remedy' },
  { id: 'monetary_compensation', label: 'Monetary Compensation Sought ($)', type: 'number', section: 'Remedy' },
];

export const BC_SMALL_CLAIMS_FIELDS: FormField[] = [
  // Claimant Information
  { id: 'claimant_name', label: 'Claimant Full Legal Name', type: 'text', required: true, section: 'Claimant Information' },
  { id: 'claimant_address', label: 'Address', type: 'text', required: true, section: 'Claimant Information' },
  { id: 'claimant_city', label: 'City', type: 'text', required: true, section: 'Claimant Information' },
  { id: 'claimant_postal', label: 'Postal Code', type: 'text', required: true, section: 'Claimant Information' },
  { id: 'claimant_phone', label: 'Phone', type: 'phone', section: 'Claimant Information' },
  { id: 'claimant_email', label: 'Email', type: 'email', section: 'Claimant Information' },
  
  // Defendant Information
  { id: 'defendant_name', label: 'Defendant Name', type: 'text', required: true, section: 'Defendant Information' },
  { id: 'defendant_address', label: 'Defendant Address', type: 'text', required: true, section: 'Defendant Information' },
  { id: 'defendant_city', label: 'City', type: 'text', section: 'Defendant Information' },
  
  // Claim Details (BC Small Claims limit is $35,000)
  { id: 'claim_amount', label: 'Amount Claimed (max $35,000)', type: 'number', required: true, section: 'Claim Details' },
  { id: 'claim_date', label: 'Date of Incident', type: 'date', required: true, section: 'Claim Details' },
  { id: 'claim_type', label: 'Type of Claim', type: 'select', options: [
    'Debt or money owed',
    'Breach of contract',
    'Personal property damage',
    'Personal injury (minor)',
    'Return of personal property',
    'Specific performance of agreement'
  ], section: 'Claim Details' },
  { id: 'claim_description', label: 'Description of Claim', type: 'textarea', required: true, section: 'Claim Details' },
  
  // Court Location
  { id: 'registry_location', label: 'Provincial Court Registry', type: 'text', required: true, section: 'Court Information' },
];

export const BC_FAMILY_FIELDS: FormField[] = [
  // Applicant Information
  { id: 'applicant_name', label: 'Your Full Legal Name', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_birthdate', label: 'Date of Birth', type: 'date', section: 'Your Information' },
  { id: 'applicant_address', label: 'Address', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_city', label: 'City', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_postal', label: 'Postal Code', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_phone', label: 'Phone', type: 'phone', section: 'Your Information' },
  { id: 'applicant_email', label: 'Email', type: 'email', section: 'Your Information' },
  
  // Respondent Information
  { id: 'respondent_name', label: 'Other Party Name', type: 'text', required: true, section: 'Other Party' },
  { id: 'respondent_address', label: 'Other Party Address', type: 'text', section: 'Other Party' },
  { id: 'respondent_phone', label: 'Other Party Phone', type: 'phone', section: 'Other Party' },
  
  // Relationship
  { id: 'relationship_type', label: 'Relationship', type: 'select', options: [
    'Married',
    'Common-law',
    'Dating/other relationship'
  ], section: 'Relationship' },
  { id: 'marriage_date', label: 'Date of Marriage (if applicable)', type: 'date', section: 'Relationship' },
  { id: 'separation_date', label: 'Date of Separation', type: 'date', section: 'Relationship' },
  
  // Children
  { id: 'children_details', label: 'Names and Birth Dates of Children', type: 'textarea', section: 'Children' },
  { id: 'current_living_arrangements', label: 'Current Living Arrangements for Children', type: 'textarea', section: 'Children' },
  
  // Orders Sought (BC Family Law Act terminology)
  { id: 'orders_sought', label: 'Orders Sought', type: 'select', options: [
    'Parenting arrangements',
    'Child support',
    'Spousal support',
    'Property division',
    'Protection order',
    'Divorce'
  ], section: 'Orders Sought' },
  { id: 'orders_description', label: 'Details of Orders Sought', type: 'textarea', section: 'Orders Sought' },
];

// ============================================
// ALBERTA FORM FIELD MAPPINGS
// ============================================

export const ALBERTA_RTDRS_FIELDS: FormField[] = [
  // Landlord/Tenant Information
  { id: 'applicant_type', label: 'Are you the', type: 'select', options: ['Landlord', 'Tenant'], required: true, section: 'Party Information' },
  { id: 'applicant_name', label: 'Your Full Legal Name', type: 'text', required: true, section: 'Party Information' },
  { id: 'applicant_address', label: 'Your Mailing Address', type: 'text', required: true, section: 'Party Information' },
  { id: 'applicant_city', label: 'City', type: 'text', required: true, section: 'Party Information' },
  { id: 'applicant_postal', label: 'Postal Code', type: 'text', required: true, section: 'Party Information' },
  { id: 'applicant_phone', label: 'Phone', type: 'phone', section: 'Party Information' },
  { id: 'applicant_email', label: 'Email', type: 'email', section: 'Party Information' },
  
  // Other Party
  { id: 'respondent_name', label: 'Other Party Name', type: 'text', required: true, section: 'Other Party' },
  { id: 'respondent_address', label: 'Other Party Address', type: 'text', section: 'Other Party' },
  { id: 'respondent_phone', label: 'Other Party Phone', type: 'phone', section: 'Other Party' },
  
  // Rental Unit
  { id: 'rental_address', label: 'Rental Property Address', type: 'text', required: true, section: 'Rental Property' },
  { id: 'monthly_rent', label: 'Monthly Rent ($)', type: 'number', required: true, section: 'Rental Property' },
  { id: 'security_deposit', label: 'Security Deposit Amount ($)', type: 'number', section: 'Rental Property' },
  { id: 'tenancy_start', label: 'Tenancy Start Date', type: 'date', section: 'Rental Property' },
  { id: 'tenancy_end', label: 'Tenancy End Date (if applicable)', type: 'date', section: 'Rental Property' },
  
  // Dispute
  { id: 'dispute_type', label: 'Type of Dispute', type: 'select', options: [
    'Security deposit',
    'Rent owing',
    'Repairs and maintenance',
    'Termination of tenancy',
    'Landlord entry',
    'Breach of lease',
    'Compensation for damages',
    'Other'
  ], required: true, section: 'Dispute' },
  { id: 'dispute_description', label: 'Description of Dispute', type: 'textarea', required: true, section: 'Dispute' },
  { id: 'amount_claimed', label: 'Amount Claimed ($)', type: 'number', section: 'Dispute' },
];

export const ALBERTA_HUMAN_RIGHTS_FIELDS: FormField[] = [
  // Complainant
  { id: 'complainant_name', label: 'Full Legal Name', type: 'text', required: true, section: 'Complainant' },
  { id: 'complainant_address', label: 'Mailing Address', type: 'text', required: true, section: 'Complainant' },
  { id: 'complainant_city', label: 'City', type: 'text', required: true, section: 'Complainant' },
  { id: 'complainant_postal', label: 'Postal Code', type: 'text', required: true, section: 'Complainant' },
  { id: 'complainant_phone', label: 'Phone', type: 'phone', section: 'Complainant' },
  { id: 'complainant_email', label: 'Email', type: 'email', section: 'Complainant' },
  
  // Respondent
  { id: 'respondent_name', label: 'Respondent Name', type: 'text', required: true, section: 'Respondent' },
  { id: 'respondent_address', label: 'Respondent Address', type: 'text', section: 'Respondent' },
  
  // Discrimination (Alberta Human Rights Act grounds)
  { id: 'area', label: 'Area', type: 'select', options: [
    'Employment practices',
    'Tenancy',
    'Public services',
    'Goods, services, accommodation, facilities'
  ], required: true, section: 'Discrimination' },
  { id: 'ground', label: 'Protected Ground', type: 'select', options: [
    'Race',
    'Religious beliefs',
    'Colour',
    'Gender',
    'Gender identity',
    'Gender expression',
    'Physical disability',
    'Mental disability',
    'Age',
    'Ancestry',
    'Place of origin',
    'Marital status',
    'Source of income',
    'Family status',
    'Sexual orientation'
  ], required: true, section: 'Discrimination' },
  { id: 'incident_date', label: 'Date of Incident', type: 'date', required: true, section: 'Discrimination' },
  { id: 'incident_description', label: 'Description', type: 'textarea', required: true, section: 'Discrimination' },
  
  // Remedy
  { id: 'remedy_sought', label: 'Remedy Sought', type: 'textarea', section: 'Remedy' },
];

export const ALBERTA_SMALL_CLAIMS_FIELDS: FormField[] = [
  // Claimant (Alberta Civil Resolution Tribunal for claims up to $50,000)
  { id: 'claimant_name', label: 'Claimant Name', type: 'text', required: true, section: 'Claimant' },
  { id: 'claimant_address', label: 'Address', type: 'text', required: true, section: 'Claimant' },
  { id: 'claimant_city', label: 'City', type: 'text', required: true, section: 'Claimant' },
  { id: 'claimant_postal', label: 'Postal Code', type: 'text', required: true, section: 'Claimant' },
  { id: 'claimant_phone', label: 'Phone', type: 'phone', section: 'Claimant' },
  { id: 'claimant_email', label: 'Email', type: 'email', section: 'Claimant' },
  
  // Defendant
  { id: 'defendant_name', label: 'Defendant Name', type: 'text', required: true, section: 'Defendant' },
  { id: 'defendant_address', label: 'Defendant Address', type: 'text', required: true, section: 'Defendant' },
  
  // Claim (Alberta Provincial Court Civil Division limit is $50,000)
  { id: 'claim_amount', label: 'Amount Claimed (max $50,000)', type: 'number', required: true, section: 'Claim' },
  { id: 'claim_date', label: 'Date of Incident', type: 'date', section: 'Claim' },
  { id: 'claim_type', label: 'Type of Claim', type: 'select', options: [
    'Debt',
    'Breach of contract',
    'Property damage',
    'Return of property',
    'Defamation',
    'Motor vehicle accident'
  ], section: 'Claim' },
  { id: 'claim_description', label: 'Description of Claim', type: 'textarea', required: true, section: 'Claim' },
  
  // Court
  { id: 'court_location', label: 'Court Location', type: 'text', section: 'Court' },
];

export const ALBERTA_FAMILY_FIELDS: FormField[] = [
  // Applicant
  { id: 'applicant_name', label: 'Your Full Legal Name', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_birthdate', label: 'Date of Birth', type: 'date', section: 'Your Information' },
  { id: 'applicant_address', label: 'Address', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_city', label: 'City', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_postal', label: 'Postal Code', type: 'text', required: true, section: 'Your Information' },
  { id: 'applicant_phone', label: 'Phone', type: 'phone', section: 'Your Information' },
  { id: 'applicant_email', label: 'Email', type: 'email', section: 'Your Information' },
  
  // Respondent
  { id: 'respondent_name', label: 'Other Party Name', type: 'text', required: true, section: 'Other Party' },
  { id: 'respondent_address', label: 'Other Party Address', type: 'text', section: 'Other Party' },
  
  // Relationship (Alberta Family Law Act)
  { id: 'marriage_date', label: 'Date of Marriage', type: 'date', section: 'Relationship' },
  { id: 'separation_date', label: 'Date of Separation', type: 'date', section: 'Relationship' },
  
  // Children
  { id: 'children_details', label: 'Children Names and Birth Dates', type: 'textarea', section: 'Children' },
  
  // Orders (Alberta terminology: parenting vs custody)
  { id: 'orders_sought', label: 'Orders Sought', type: 'select', options: [
    'Parenting order (decision-making/parenting time)',
    'Child support',
    'Spousal support',
    'Property division',
    'Exclusive possession of home',
    'Emergency protection order',
    'Divorce'
  ], section: 'Orders' },
  { id: 'orders_description', label: 'Details', type: 'textarea', section: 'Orders' },
];

// ============================================
// PROVINCE CONFIG EXPORT
// ============================================

export const PROVINCE_FORM_CONFIGS: Record<string, Record<string, ProvinceFormConfig>> = {
  'ON': {
    'LTB': { tribunalName: 'Landlord and Tenant Board', formSourceUrl: 'https://tribunalsontario.ca/ltb/', fields: ONTARIO_LTB_FIELDS },
    'HRTO': { tribunalName: 'Human Rights Tribunal of Ontario', formSourceUrl: 'https://tribunalsontario.ca/hrto/', fields: ONTARIO_HRTO_FIELDS },
    'SMALL_CLAIMS': { tribunalName: 'Small Claims Court', formSourceUrl: 'https://ontariocourtforms.on.ca', fields: ONTARIO_SMALL_CLAIMS_FIELDS },
    'FAMILY': { tribunalName: 'Ontario Court of Justice - Family', formSourceUrl: 'https://ontariocourtforms.on.ca', fields: ONTARIO_FAMILY_FIELDS },
    'WSIB': { tribunalName: 'Workplace Safety and Insurance Board', formSourceUrl: 'https://www.wsib.ca', fields: ONTARIO_WSIB_FIELDS },
    'SUPERIOR': { tribunalName: 'Superior Court of Justice', formSourceUrl: 'https://ontariocourtforms.on.ca', fields: ONTARIO_SUPERIOR_COURT_FIELDS },
  },
  'BC': {
    'RTB': { tribunalName: 'Residential Tenancy Branch', formSourceUrl: 'https://www2.gov.bc.ca/gov/content/housing-tenancy/residential-tenancies', fields: BC_RESIDENTIAL_TENANCY_FIELDS },
    'BCHRT': { tribunalName: 'BC Human Rights Tribunal', formSourceUrl: 'https://www.bchrt.bc.ca/', fields: BC_HUMAN_RIGHTS_FIELDS },
    'SMALL_CLAIMS': { tribunalName: 'Small Claims Court (Civil Resolution Tribunal)', formSourceUrl: 'https://civilresolutionbc.ca/', fields: BC_SMALL_CLAIMS_FIELDS },
    'FAMILY': { tribunalName: 'Provincial Court - Family', formSourceUrl: 'https://www.provincialcourt.bc.ca/types-of-cases/family-matters', fields: BC_FAMILY_FIELDS },
  },
  'AB': {
    'RTDRS': { tribunalName: 'Residential Tenancy Dispute Resolution Service', formSourceUrl: 'https://www.alberta.ca/residential-tenancy-dispute-resolution-service', fields: ALBERTA_RTDRS_FIELDS },
    'AHRC': { tribunalName: 'Alberta Human Rights Commission', formSourceUrl: 'https://www.albertahumanrights.ab.ca/', fields: ALBERTA_HUMAN_RIGHTS_FIELDS },
    'SMALL_CLAIMS': { tribunalName: 'Provincial Court - Civil', formSourceUrl: 'https://www.albertacourts.ca/pc/areas-of-law/civil', fields: ALBERTA_SMALL_CLAIMS_FIELDS },
    'FAMILY': { tribunalName: 'Court of King\'s Bench - Family', formSourceUrl: 'https://www.albertacourts.ca/kb/areas-of-law/family', fields: ALBERTA_FAMILY_FIELDS },
  }
};

// Helper to get fields for a specific form
export function getFormFields(province: string, tribunalType: string): FormField[] {
  const provinceCode = province.toUpperCase().substring(0, 2);
  const config = PROVINCE_FORM_CONFIGS[provinceCode]?.[tribunalType.toUpperCase()];
  
  if (config) {
    return config.fields;
  }
  
  // Fallback to Ontario LTB as default
  return ONTARIO_LTB_FIELDS;
}

// Helper to determine tribunal type from form code
export function getTribunalTypeFromFormCode(formCode: string, province: string = 'ON'): string {
  const code = formCode.toUpperCase();
  
  // Ontario specific
  if (province === 'ON' || province === 'Ontario') {
    if (code.includes('T1') || code.includes('T2') || code.includes('T3') || code.includes('T4') || code.includes('T5') || code.includes('T6') || 
        code.includes('L1') || code.includes('L2') || code.includes('L3') || code.includes('L4') || code.includes('L5') ||
        code.includes('N1') || code.includes('N4') || code.includes('N5') || code.includes('N6') || code.includes('N7') || code.includes('N8') ||
        code.includes('LTB')) return 'LTB';
    if (code.includes('HRTO') || code.includes('FORM 1') || code.includes('F1')) return 'HRTO';
    if (code.includes('FLR') || code.includes('FL-')) return 'FAMILY';
    if (code.includes('7A') || code.includes('9A') || code.includes('10A') || code.includes('11A') || code.includes('11B') || code.includes('SCC')) return 'SMALL_CLAIMS';
    if (code.includes('CV-') || code.includes('14A') || code.includes('18A') || code.includes('37A')) return 'SUPERIOR';
    if (code.includes('WSIB') || code.includes('WSIAT')) return 'WSIB';
  }
  
  // BC specific
  if (province === 'BC' || province === 'British Columbia') {
    if (code.includes('RTB')) return 'RTB';
    if (code.includes('HRT')) return 'BCHRT';
    if (code.includes('CRT') || code.includes('SCL')) return 'SMALL_CLAIMS';
    if (code.includes('FAM') || code.includes('PFA')) return 'FAMILY';
  }
  
  // Alberta specific
  if (province === 'AB' || province === 'Alberta') {
    if (code.includes('RTDRS') || code.includes('RTA')) return 'RTDRS';
    if (code.includes('AHRC') || code.includes('HRC')) return 'AHRC';
    if (code.includes('CIV') || code.includes('CCQ')) return 'SMALL_CLAIMS';
    if (code.includes('FAM') || code.includes('DIV')) return 'FAMILY';
  }
  
  return 'SMALL_CLAIMS'; // Default fallback
}
