// Province-specific configuration for tribunals, venues, and form sources
// Each province has its own unique tribunal names and procedures
// CANADA-WIDE: All 13 provinces/territories supported

export interface TribunalConfig {
  code: string;
  name: string;
  description: string;
  formPrefix?: string;
  externalUrl?: string;
}

export interface ProvinceConfig {
  code: string;
  name: string;
  tribunals: TribunalConfig[];
  formSourceUrl: string;
  evidenceRules: {
    maxFileSizeMB: number;
    allowedFormats: string[];
    deadlineDays?: number;
  };
}

// ============================================
// ONTARIO CONFIGURATION
// ============================================
export const ONTARIO_CONFIG: ProvinceConfig = {
  code: 'ON',
  name: 'Ontario',
  tribunals: [
    { code: 'LTB', name: 'Landlord and Tenant Board', description: 'Resolves residential tenancy disputes', formPrefix: 'T', externalUrl: 'https://tribunalsontario.ca/ltb/' },
    { code: 'HRTO', name: 'Human Rights Tribunal of Ontario', description: 'Handles discrimination complaints under the Ontario Human Rights Code', formPrefix: 'HRTO', externalUrl: 'https://tribunalsontario.ca/hrto/' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims up to $35,000', formPrefix: 'SC', externalUrl: 'https://www.ontario.ca/page/suing-someone-small-claims-court' },
    { code: 'FAMILY', name: 'Ontario Court of Justice - Family', description: 'Family law matters', formPrefix: 'FL', externalUrl: 'https://www.ontariocourts.ca/ocj/family-court/' },
    { code: 'SUPERIOR', name: 'Superior Court of Justice', description: 'Higher court matters over $35,000', formPrefix: 'CV', externalUrl: 'https://www.ontariocourts.ca/scj/' },
    { code: 'CRIMINAL', name: 'Ontario Court of Justice - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.ontariocourts.ca/ocj/criminal-matters/' },
    { code: 'LABOUR', name: 'Ontario Labour Relations Board', description: 'Employment and labour disputes', formPrefix: 'OLRB', externalUrl: 'https://www.olrb.gov.on.ca/' },
    { code: 'WSIB', name: 'Workplace Safety and Insurance Board', description: 'Workplace injury claims', formPrefix: 'WSIB', externalUrl: 'https://www.wsib.ca/' },
  ],
  formSourceUrl: 'https://ontariocourtforms.on.ca',
  evidenceRules: {
    maxFileSizeMB: 25,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 5,
  }
};

// ============================================
// BRITISH COLUMBIA CONFIGURATION
// ============================================
export const BC_CONFIG: ProvinceConfig = {
  code: 'BC',
  name: 'British Columbia',
  tribunals: [
    { code: 'RTB', name: 'Residential Tenancy Branch', description: 'Resolves residential tenancy disputes', formPrefix: 'RTB', externalUrl: 'https://www2.gov.bc.ca/gov/content/housing-tenancy/residential-tenancies' },
    { code: 'BCHRT', name: 'BC Human Rights Tribunal', description: 'Handles discrimination complaints under BC Human Rights Code', formPrefix: 'HRT', externalUrl: 'http://www.bchrt.bc.ca/' },
    { code: 'CRT', name: 'Civil Resolution Tribunal', description: 'Small claims, strata, and motor vehicle disputes up to $5,000', formPrefix: 'CRT', externalUrl: 'https://civilresolutionbc.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims $5,001 to $35,000', formPrefix: 'SC', externalUrl: 'https://www.bccourts.ca/small_claims/' },
    { code: 'FAMILY', name: 'Provincial Court of BC - Family', description: 'Family law matters', formPrefix: 'PFA', externalUrl: 'https://www.provincialcourt.bc.ca/types-of-cases/family-matters' },
    { code: 'SUPREME', name: 'Supreme Court of British Columbia', description: 'Higher court matters', formPrefix: 'SCBC', externalUrl: 'https://www.bccourts.ca/supreme_court/' },
    { code: 'CRIMINAL', name: 'Provincial Court of BC - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.provincialcourt.bc.ca/types-of-cases/criminal-matters' },
    { code: 'LRB', name: 'Labour Relations Board', description: 'Employment and labour disputes', formPrefix: 'LRB', externalUrl: 'https://www.lrb.bc.ca/' },
    { code: 'WCB', name: 'WorkSafeBC', description: 'Workplace injury claims', formPrefix: 'WCB', externalUrl: 'https://www.worksafebc.com/' },
  ],
  formSourceUrl: 'https://www.bccourts.ca/supreme_court/self-represented_litigants/forms_and_guides.aspx',
  evidenceRules: {
    maxFileSizeMB: 20,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 7,
  }
};

// ============================================
// ALBERTA CONFIGURATION
// ============================================
export const ALBERTA_CONFIG: ProvinceConfig = {
  code: 'AB',
  name: 'Alberta',
  tribunals: [
    { code: 'RTDRS', name: 'Residential Tenancy Dispute Resolution Service', description: 'Resolves residential tenancy disputes', formPrefix: 'RTDRS', externalUrl: 'https://www.alberta.ca/residential-tenancy-dispute-resolution-service' },
    { code: 'AHRC', name: 'Alberta Human Rights Commission', description: 'Handles discrimination complaints', formPrefix: 'HRC', externalUrl: 'https://albertahumanrights.ab.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Provincial Court Civil', description: 'Civil claims up to $50,000', formPrefix: 'CIV', externalUrl: 'https://www.albertacourts.ca/pc/areas-of-law/civil' },
    { code: 'FAMILY', name: 'Court of King\'s Bench - Family', description: 'Family law matters', formPrefix: 'FL', externalUrl: 'https://www.albertacourts.ca/kb/areas-of-law/family' },
    { code: 'KINGS_BENCH', name: 'Court of King\'s Bench', description: 'Higher court matters', formPrefix: 'QB', externalUrl: 'https://www.albertacourts.ca/kb' },
    { code: 'CRIMINAL', name: 'Provincial Court of Alberta - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.albertacourts.ca/pc/areas-of-law/criminal' },
    { code: 'ALRB', name: 'Alberta Labour Relations Board', description: 'Employment and labour disputes', formPrefix: 'ALRB', externalUrl: 'https://alrb.gov.ab.ca/' },
    { code: 'WCB', name: 'Workers\' Compensation Board', description: 'Workplace injury claims', formPrefix: 'WCB', externalUrl: 'https://www.wcb.ab.ca/' },
  ],
  formSourceUrl: 'https://www.albertacourts.ca/qb/resources/forms',
  evidenceRules: {
    maxFileSizeMB: 20,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 10,
  }
};

// ============================================
// QUEBEC CONFIGURATION
// ============================================
export const QUEBEC_CONFIG: ProvinceConfig = {
  code: 'QC',
  name: 'Quebec',
  tribunals: [
    { code: 'TAL', name: 'Tribunal administratif du logement', description: 'Residential tenancy disputes', formPrefix: 'TAL', externalUrl: 'https://www.tal.gouv.qc.ca/' },
    { code: 'CDPDJ', name: 'Commission des droits de la personne', description: 'Human rights complaints', formPrefix: 'CDP', externalUrl: 'https://www.cdpdj.qc.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Division', description: 'Civil claims up to $15,000', formPrefix: 'SC', externalUrl: 'https://www.justice.gouv.qc.ca/en/your-disputes/small-claims' },
    { code: 'FAMILY', name: 'Superior Court - Family', description: 'Family law matters', formPrefix: 'FAM', externalUrl: 'https://www.justice.gouv.qc.ca/en/your-family' },
    { code: 'SUPERIOR', name: 'Superior Court of Quebec', description: 'Higher court matters', formPrefix: 'CS', externalUrl: 'https://www.tribunaux.qc.ca/mjq_en/c-superieure/' },
    { code: 'CRIMINAL', name: 'Court of Quebec - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.tribunaux.qc.ca/mjq_en/c-quebec/' },
    { code: 'TAT', name: 'Tribunal administratif du travail', description: 'Labour disputes', formPrefix: 'TAT', externalUrl: 'https://www.tat.gouv.qc.ca/' },
    { code: 'CNESST', name: 'CNESST', description: 'Workplace injury claims', formPrefix: 'CNESST', externalUrl: 'https://www.cnesst.gouv.qc.ca/' },
  ],
  formSourceUrl: 'https://www.justice.gouv.qc.ca/en/forms',
  evidenceRules: {
    maxFileSizeMB: 15,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 5,
  }
};

// ============================================
// MANITOBA CONFIGURATION
// ============================================
export const MANITOBA_CONFIG: ProvinceConfig = {
  code: 'MB',
  name: 'Manitoba',
  tribunals: [
    { code: 'RTB', name: 'Residential Tenancies Branch', description: 'Resolves residential tenancy disputes', formPrefix: 'RTB', externalUrl: 'https://www.gov.mb.ca/cca/rtb/' },
    { code: 'MHRC', name: 'Manitoba Human Rights Commission', description: 'Handles discrimination complaints', formPrefix: 'MHRC', externalUrl: 'http://www.manitobahumanrights.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Court of King\'s Bench - Small Claims', description: 'Civil claims up to $15,000', formPrefix: 'SC', externalUrl: 'https://www.manitobacourts.mb.ca/court-of-kings-bench/' },
    { code: 'FAMILY', name: 'Court of King\'s Bench - Family', description: 'Family law matters', formPrefix: 'FAM', externalUrl: 'https://www.manitobacourts.mb.ca/court-of-kings-bench/family-division/' },
    { code: 'KINGS_BENCH', name: 'Court of King\'s Bench', description: 'Higher court matters', formPrefix: 'KB', externalUrl: 'https://www.manitobacourts.mb.ca/court-of-kings-bench/' },
    { code: 'CRIMINAL', name: 'Provincial Court - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.manitobacourts.mb.ca/provincial-court/' },
    { code: 'MLRB', name: 'Manitoba Labour Board', description: 'Employment and labour disputes', formPrefix: 'MLRB', externalUrl: 'https://www.gov.mb.ca/labour/labbrd/' },
    { code: 'WCB', name: 'Workers Compensation Board of Manitoba', description: 'Workplace injury claims', formPrefix: 'WCB', externalUrl: 'https://www.wcb.mb.ca/' },
  ],
  formSourceUrl: 'https://www.manitobacourts.mb.ca/general-information/forms/',
  evidenceRules: {
    maxFileSizeMB: 20,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 7,
  }
};

// ============================================
// SASKATCHEWAN CONFIGURATION
// ============================================
export const SASKATCHEWAN_CONFIG: ProvinceConfig = {
  code: 'SK',
  name: 'Saskatchewan',
  tribunals: [
    { code: 'ORT', name: 'Office of Residential Tenancies', description: 'Resolves residential tenancy disputes', formPrefix: 'ORT', externalUrl: 'https://www.saskatchewan.ca/government/government-structure/boards-commissions-and-agencies/office-of-residential-tenancies' },
    { code: 'SHRC', name: 'Saskatchewan Human Rights Commission', description: 'Handles discrimination complaints', formPrefix: 'SHRC', externalUrl: 'https://saskatchewanhumanrights.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Court of King\'s Bench - Small Claims', description: 'Civil claims up to $30,000', formPrefix: 'SC', externalUrl: 'https://sasklawcourts.ca/kings-bench/small-claims/' },
    { code: 'FAMILY', name: 'Court of King\'s Bench - Family', description: 'Family law matters', formPrefix: 'FAM', externalUrl: 'https://sasklawcourts.ca/kings-bench/family/' },
    { code: 'KINGS_BENCH', name: 'Court of King\'s Bench', description: 'Higher court matters', formPrefix: 'KB', externalUrl: 'https://sasklawcourts.ca/kings-bench/' },
    { code: 'CRIMINAL', name: 'Provincial Court - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://sasklawcourts.ca/provincial-court/' },
    { code: 'SLRB', name: 'Saskatchewan Labour Relations Board', description: 'Employment and labour disputes', formPrefix: 'SLRB', externalUrl: 'https://www.saskatchewan.ca/government/government-structure/boards-commissions-and-agencies/saskatchewan-labour-relations-board' },
    { code: 'WCB', name: 'Saskatchewan Workers\' Compensation Board', description: 'Workplace injury claims', formPrefix: 'WCB', externalUrl: 'https://www.wcbsask.com/' },
  ],
  formSourceUrl: 'https://sasklawcourts.ca/resources/forms/',
  evidenceRules: {
    maxFileSizeMB: 20,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 10,
  }
};

// ============================================
// NOVA SCOTIA CONFIGURATION
// ============================================
export const NOVA_SCOTIA_CONFIG: ProvinceConfig = {
  code: 'NS',
  name: 'Nova Scotia',
  tribunals: [
    { code: 'RTB', name: 'Residential Tenancies Program', description: 'Resolves residential tenancy disputes', formPrefix: 'RTB', externalUrl: 'https://novascotia.ca/sns/access/land/residential-tenancies.asp' },
    { code: 'NSHRC', name: 'Nova Scotia Human Rights Commission', description: 'Handles discrimination complaints', formPrefix: 'NSHRC', externalUrl: 'https://humanrights.novascotia.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims up to $25,000', formPrefix: 'SC', externalUrl: 'https://www.courts.ns.ca/Small_Claims_Court/NSSC_home.htm' },
    { code: 'FAMILY', name: 'Supreme Court - Family Division', description: 'Family law matters', formPrefix: 'FAM', externalUrl: 'https://www.courts.ns.ca/Family_Court/NSFC_home.htm' },
    { code: 'SUPREME', name: 'Supreme Court of Nova Scotia', description: 'Higher court matters', formPrefix: 'NSSC', externalUrl: 'https://www.courts.ns.ca/Supreme_Court/NSSC_home.htm' },
    { code: 'CRIMINAL', name: 'Provincial Court - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.courts.ns.ca/Provincial_Court/NSPC_home.htm' },
    { code: 'NSLRB', name: 'Nova Scotia Labour Board', description: 'Employment and labour disputes', formPrefix: 'NSLRB', externalUrl: 'https://novascotia.ca/lae/labourboard/' },
    { code: 'WCB', name: 'Workers\' Compensation Board of Nova Scotia', description: 'Workplace injury claims', formPrefix: 'WCB', externalUrl: 'https://www.wcb.ns.ca/' },
  ],
  formSourceUrl: 'https://www.courts.ns.ca/forms_and_filing.htm',
  evidenceRules: {
    maxFileSizeMB: 20,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 7,
  }
};

// ============================================
// NEW BRUNSWICK CONFIGURATION
// ============================================
export const NEW_BRUNSWICK_CONFIG: ProvinceConfig = {
  code: 'NB',
  name: 'New Brunswick',
  tribunals: [
    { code: 'RTD', name: 'Residential Tenancies Tribunal', description: 'Resolves residential tenancy disputes', formPrefix: 'RTD', externalUrl: 'https://www2.gnb.ca/content/gnb/en/services/services_renderer.201361.Residential_Tenancies_Tribunal.html' },
    { code: 'NBHRC', name: 'New Brunswick Human Rights Commission', description: 'Handles discrimination complaints', formPrefix: 'NBHRC', externalUrl: 'https://www2.gnb.ca/content/gnb/en/departments/nbhrc.html' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims up to $20,000', formPrefix: 'SC', externalUrl: 'https://www.gnb.ca/cour/03Court/small-e.asp' },
    { code: 'FAMILY', name: 'Court of King\'s Bench - Family Division', description: 'Family law matters', formPrefix: 'FAM', externalUrl: 'https://www.gnb.ca/cour/03Court/family-e.asp' },
    { code: 'KINGS_BENCH', name: 'Court of King\'s Bench', description: 'Higher court matters', formPrefix: 'KB', externalUrl: 'https://www.gnb.ca/cour/03Court/queens-e.asp' },
    { code: 'CRIMINAL', name: 'Provincial Court - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.gnb.ca/cour/03Court/provincial-e.asp' },
    { code: 'NBLEB', name: 'Labour and Employment Board', description: 'Employment and labour disputes', formPrefix: 'NBLEB', externalUrl: 'https://www2.gnb.ca/content/gnb/en/departments/elg/local_government/content/governance/content/labour_and_employment_board.html' },
    { code: 'WSNB', name: 'WorkSafeNB', description: 'Workplace injury claims', formPrefix: 'WSNB', externalUrl: 'https://www.worksafenb.ca/' },
  ],
  formSourceUrl: 'https://www.gnb.ca/cour/04Forms/index-e.asp',
  evidenceRules: {
    maxFileSizeMB: 15,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 7,
  }
};

// ============================================
// NEWFOUNDLAND & LABRADOR CONFIGURATION
// ============================================
export const NEWFOUNDLAND_CONFIG: ProvinceConfig = {
  code: 'NL',
  name: 'Newfoundland and Labrador',
  tribunals: [
    { code: 'RTD', name: 'Residential Tenancies Division', description: 'Resolves residential tenancy disputes', formPrefix: 'RTD', externalUrl: 'https://www.gov.nl.ca/dgsnl/landlord/' },
    { code: 'NLHRC', name: 'Newfoundland and Labrador Human Rights Commission', description: 'Handles discrimination complaints', formPrefix: 'NLHRC', externalUrl: 'https://thinkhumanrights.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims up to $25,000', formPrefix: 'SC', externalUrl: 'https://www.court.nl.ca/provincial/smallclaims/' },
    { code: 'FAMILY', name: 'Family Division', description: 'Family law matters', formPrefix: 'FAM', externalUrl: 'https://www.court.nl.ca/supreme/family/' },
    { code: 'SUPREME', name: 'Supreme Court of Newfoundland and Labrador', description: 'Higher court matters', formPrefix: 'SCNL', externalUrl: 'https://www.court.nl.ca/supreme/' },
    { code: 'CRIMINAL', name: 'Provincial Court - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.court.nl.ca/provincial/' },
    { code: 'NLLRB', name: 'Labour Relations Board', description: 'Employment and labour disputes', formPrefix: 'NLLRB', externalUrl: 'https://www.gov.nl.ca/lrb/' },
    { code: 'WHSCC', name: 'Workplace Health, Safety and Compensation Commission', description: 'Workplace injury claims', formPrefix: 'WHSCC', externalUrl: 'https://workplacenl.ca/' },
  ],
  formSourceUrl: 'https://www.court.nl.ca/forms/',
  evidenceRules: {
    maxFileSizeMB: 15,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 10,
  }
};

// ============================================
// PRINCE EDWARD ISLAND CONFIGURATION
// ============================================
export const PEI_CONFIG: ProvinceConfig = {
  code: 'PE',
  name: 'Prince Edward Island',
  tribunals: [
    { code: 'IRAC', name: 'Island Regulatory and Appeals Commission', description: 'Resolves residential tenancy disputes', formPrefix: 'IRAC', externalUrl: 'https://www.irac.pe.ca/rental/' },
    { code: 'PEIHRC', name: 'PEI Human Rights Commission', description: 'Handles discrimination complaints', formPrefix: 'PEIHRC', externalUrl: 'https://www.peihumanrights.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims up to $16,000', formPrefix: 'SC', externalUrl: 'https://www.princeedwardisland.ca/en/information/justice-and-public-safety/small-claims-court' },
    { code: 'FAMILY', name: 'Supreme Court - Family Section', description: 'Family law matters', formPrefix: 'FAM', externalUrl: 'https://www.courts.pe.ca/supreme-court' },
    { code: 'SUPREME', name: 'Supreme Court of PEI', description: 'Higher court matters', formPrefix: 'SCPEI', externalUrl: 'https://www.courts.pe.ca/supreme-court' },
    { code: 'CRIMINAL', name: 'Provincial Court - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.courts.pe.ca/provincial-court' },
    { code: 'LRB', name: 'Labour Relations Board', description: 'Employment and labour disputes', formPrefix: 'LRB', externalUrl: 'https://www.princeedwardisland.ca/en/information/economic-growth-tourism-and-culture/labour-relations-board' },
    { code: 'WCB', name: 'Workers Compensation Board of PEI', description: 'Workplace injury claims', formPrefix: 'WCB', externalUrl: 'http://www.wcb.pe.ca/' },
  ],
  formSourceUrl: 'https://www.courts.pe.ca/forms',
  evidenceRules: {
    maxFileSizeMB: 15,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 7,
  }
};

// ============================================
// NORTHWEST TERRITORIES CONFIGURATION
// ============================================
export const NWT_CONFIG: ProvinceConfig = {
  code: 'NT',
  name: 'Northwest Territories',
  tribunals: [
    { code: 'RO', name: 'Rental Officer', description: 'Resolves residential tenancy disputes', formPrefix: 'RO', externalUrl: 'https://www.justice.gov.nt.ca/en/rental-office/' },
    { code: 'NWTHR', name: 'NWT Human Rights Commission', description: 'Handles discrimination complaints', formPrefix: 'NWTHR', externalUrl: 'https://nwthumanrights.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims up to $35,000', formPrefix: 'SC', externalUrl: 'https://www.nwtcourts.ca/territorial-court/small-claims/' },
    { code: 'FAMILY', name: 'Supreme Court - Family', description: 'Family law matters', formPrefix: 'FAM', externalUrl: 'https://www.nwtcourts.ca/supreme-court/' },
    { code: 'SUPREME', name: 'Supreme Court of the NWT', description: 'Higher court matters', formPrefix: 'SCNWT', externalUrl: 'https://www.nwtcourts.ca/supreme-court/' },
    { code: 'CRIMINAL', name: 'Territorial Court - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.nwtcourts.ca/territorial-court/' },
    { code: 'WSCC', name: 'Workers\' Safety and Compensation Commission', description: 'Workplace injury claims', formPrefix: 'WSCC', externalUrl: 'https://www.wscc.nt.ca/' },
  ],
  formSourceUrl: 'https://www.nwtcourts.ca/forms/',
  evidenceRules: {
    maxFileSizeMB: 15,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 14,
  }
};

// ============================================
// NUNAVUT CONFIGURATION
// ============================================
export const NUNAVUT_CONFIG: ProvinceConfig = {
  code: 'NU',
  name: 'Nunavut',
  tribunals: [
    { code: 'RTB', name: 'Residential Tenancies Tribunal', description: 'Resolves residential tenancy disputes', formPrefix: 'RTB', externalUrl: 'https://www.nunavutcourts.ca/' },
    { code: 'NHRT', name: 'Nunavut Human Rights Tribunal', description: 'Handles discrimination complaints', formPrefix: 'NHRT', externalUrl: 'https://www.nhrt.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims up to $20,000', formPrefix: 'SC', externalUrl: 'https://www.nunavutcourts.ca/ncj/small-claims' },
    { code: 'FAMILY', name: 'Nunavut Court of Justice - Family', description: 'Family law matters', formPrefix: 'FAM', externalUrl: 'https://www.nunavutcourts.ca/ncj/family' },
    { code: 'NCJ', name: 'Nunavut Court of Justice', description: 'Higher court matters', formPrefix: 'NCJ', externalUrl: 'https://www.nunavutcourts.ca/ncj/' },
    { code: 'CRIMINAL', name: 'Nunavut Court of Justice - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.nunavutcourts.ca/ncj/criminal' },
    { code: 'WSCC', name: 'Workers\' Safety and Compensation Commission', description: 'Workplace injury claims', formPrefix: 'WSCC', externalUrl: 'https://www.wscc.nu.ca/' },
  ],
  formSourceUrl: 'https://www.nunavutcourts.ca/forms/',
  evidenceRules: {
    maxFileSizeMB: 10,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 14,
  }
};

// ============================================
// YUKON CONFIGURATION
// ============================================
export const YUKON_CONFIG: ProvinceConfig = {
  code: 'YT',
  name: 'Yukon',
  tribunals: [
    { code: 'RTB', name: 'Residential Tenancies Office', description: 'Resolves residential tenancy disputes', formPrefix: 'RTB', externalUrl: 'https://yukon.ca/en/housing/renting/residential-tenancies-office' },
    { code: 'YHRC', name: 'Yukon Human Rights Commission', description: 'Handles discrimination complaints', formPrefix: 'YHRC', externalUrl: 'https://yhrc.yk.ca/' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims up to $35,000', formPrefix: 'SC', externalUrl: 'https://www.yukoncourts.ca/courts/small-claims-court' },
    { code: 'FAMILY', name: 'Supreme Court - Family', description: 'Family law matters', formPrefix: 'FAM', externalUrl: 'https://www.yukoncourts.ca/courts/supreme-court' },
    { code: 'SUPREME', name: 'Supreme Court of Yukon', description: 'Higher court matters', formPrefix: 'SCYT', externalUrl: 'https://www.yukoncourts.ca/courts/supreme-court' },
    { code: 'CRIMINAL', name: 'Territorial Court - Criminal', description: 'Criminal matters', formPrefix: 'CR', externalUrl: 'https://www.yukoncourts.ca/courts/territorial-court' },
    { code: 'LRB', name: 'Labour Relations Board', description: 'Employment and labour disputes', formPrefix: 'LRB', externalUrl: 'https://yukon.ca/en/employment/labour-relations-board' },
    { code: 'YWCHSB', name: 'Yukon Workers\' Compensation Health and Safety Board', description: 'Workplace injury claims', formPrefix: 'YWCHSB', externalUrl: 'https://www.wcb.yk.ca/' },
  ],
  formSourceUrl: 'https://www.yukoncourts.ca/forms/',
  evidenceRules: {
    maxFileSizeMB: 15,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 10,
  }
};

// ============================================
// PROVINCE REGISTRY (ALL 13 PROVINCES/TERRITORIES)
// ============================================
export const PROVINCE_CONFIGS: Record<string, ProvinceConfig> = {
  'ON': ONTARIO_CONFIG,
  'BC': BC_CONFIG,
  'AB': ALBERTA_CONFIG,
  'QC': QUEBEC_CONFIG,
  'MB': MANITOBA_CONFIG,
  'SK': SASKATCHEWAN_CONFIG,
  'NS': NOVA_SCOTIA_CONFIG,
  'NB': NEW_BRUNSWICK_CONFIG,
  'NL': NEWFOUNDLAND_CONFIG,
  'PE': PEI_CONFIG,
  'NT': NWT_CONFIG,
  'NU': NUNAVUT_CONFIG,
  'YT': YUKON_CONFIG,
};

// Full name to code mapping for UI dropdowns
export const PROVINCE_NAMES: Record<string, string> = {
  'ON': 'Ontario',
  'BC': 'British Columbia',
  'AB': 'Alberta',
  'QC': 'Quebec',
  'MB': 'Manitoba',
  'SK': 'Saskatchewan',
  'NS': 'Nova Scotia',
  'NB': 'New Brunswick',
  'NL': 'Newfoundland and Labrador',
  'PE': 'Prince Edward Island',
  'NT': 'Northwest Territories',
  'NU': 'Nunavut',
  'YT': 'Yukon',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get province config by code (ON, BC, AB, etc.)
 */
export function getProvinceConfig(provinceCode: string): ProvinceConfig | undefined {
  const code = provinceCode?.toUpperCase().trim();
  return PROVINCE_CONFIGS[code];
}

/**
 * Get tribunals for a specific province
 */
export function getProvinceTribunals(provinceCode: string): TribunalConfig[] {
  const config = getProvinceConfig(provinceCode);
  return config?.tribunals || [];
}

/**
 * Get tribunal name for a province-specific tribunal code
 * e.g., getProvinceTribunalName('ON', 'LTB') -> 'Landlord and Tenant Board'
 * e.g., getProvinceTribunalName('BC', 'LTB') -> undefined (BC uses RTB)
 */
export function getProvinceTribunalName(provinceCode: string, tribunalCode: string): string | undefined {
  const tribunals = getProvinceTribunals(provinceCode);
  const tribunal = tribunals.find(t => t.code === tribunalCode);
  return tribunal?.name;
}

/**
 * Check if a tribunal code is valid for a province
 */
export function isTribunalValidForProvince(provinceCode: string, tribunalCode: string): boolean {
  const tribunals = getProvinceTribunals(provinceCode);
  return tribunals.some(t => t.code === tribunalCode);
}

/**
 * Map a generic venue type to province-specific tribunal
 * e.g., 'tenancy' in ON -> 'LTB', in BC -> 'RTB', in AB -> 'RTDRS'
 */
export function mapVenueToProvinceTribunal(provinceCode: string, venueType: string): string | undefined {
  const venueMapping: Record<string, Record<string, string>> = {
    'tenancy': { 
      'ON': 'LTB', 'BC': 'RTB', 'AB': 'RTDRS', 'QC': 'TAL',
      'MB': 'RTB', 'SK': 'ORT', 'NS': 'RTB', 'NB': 'RTD',
      'NL': 'RTD', 'PE': 'IRAC', 'NT': 'RO', 'NU': 'RTB', 'YT': 'RTB'
    },
    'human_rights': { 
      'ON': 'HRTO', 'BC': 'BCHRT', 'AB': 'AHRC', 'QC': 'CDPDJ',
      'MB': 'MHRC', 'SK': 'SHRC', 'NS': 'NSHRC', 'NB': 'NBHRC',
      'NL': 'NLHRC', 'PE': 'PEIHRC', 'NT': 'NWTHR', 'NU': 'NHRT', 'YT': 'YHRC'
    },
    'small_claims': { 
      'ON': 'SMALL_CLAIMS', 'BC': 'SMALL_CLAIMS', 'AB': 'SMALL_CLAIMS', 'QC': 'SMALL_CLAIMS',
      'MB': 'SMALL_CLAIMS', 'SK': 'SMALL_CLAIMS', 'NS': 'SMALL_CLAIMS', 'NB': 'SMALL_CLAIMS',
      'NL': 'SMALL_CLAIMS', 'PE': 'SMALL_CLAIMS', 'NT': 'SMALL_CLAIMS', 'NU': 'SMALL_CLAIMS', 'YT': 'SMALL_CLAIMS'
    },
    'family': { 
      'ON': 'FAMILY', 'BC': 'FAMILY', 'AB': 'FAMILY', 'QC': 'FAMILY',
      'MB': 'FAMILY', 'SK': 'FAMILY', 'NS': 'FAMILY', 'NB': 'FAMILY',
      'NL': 'FAMILY', 'PE': 'FAMILY', 'NT': 'FAMILY', 'NU': 'FAMILY', 'YT': 'FAMILY'
    },
    'labour': { 
      'ON': 'LABOUR', 'BC': 'LRB', 'AB': 'ALRB', 'QC': 'TAT',
      'MB': 'MLRB', 'SK': 'SLRB', 'NS': 'NSLRB', 'NB': 'NBLEB',
      'NL': 'NLLRB', 'PE': 'LRB', 'NT': 'WSCC', 'NU': 'WSCC', 'YT': 'LRB'
    },
    'workers_comp': { 
      'ON': 'WSIB', 'BC': 'WCB', 'AB': 'WCB', 'QC': 'CNESST',
      'MB': 'WCB', 'SK': 'WCB', 'NS': 'WCB', 'NB': 'WSNB',
      'NL': 'WHSCC', 'PE': 'WCB', 'NT': 'WSCC', 'NU': 'WSCC', 'YT': 'YWCHSB'
    },
  };

  const code = provinceCode?.toUpperCase();
  return venueMapping[venueType?.toLowerCase()]?.[code];
}

/**
 * Get all supported province codes
 */
export function getSupportedProvinces(): string[] {
  return Object.keys(PROVINCE_CONFIGS);
}

/**
 * Get province name from code
 */
export function getProvinceName(provinceCode: string): string {
  return getProvinceConfig(provinceCode)?.name || provinceCode;
}

/**
 * Get all provinces as options for select dropdowns
 */
export function getProvinceOptions(): { value: string; label: string }[] {
  return Object.entries(PROVINCE_NAMES).map(([code, name]) => ({
    value: code,
    label: name,
  }));
}
