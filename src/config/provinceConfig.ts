// Province-specific configuration for tribunals, venues, and form sources
// Each province has its own unique tribunal names and procedures

export interface TribunalConfig {
  code: string;
  name: string;
  description: string;
  formPrefix?: string;
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
    { code: 'LTB', name: 'Landlord and Tenant Board', description: 'Resolves residential tenancy disputes', formPrefix: 'T' },
    { code: 'HRTO', name: 'Human Rights Tribunal of Ontario', description: 'Handles discrimination complaints under the Ontario Human Rights Code', formPrefix: 'HRTO' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims up to $35,000', formPrefix: 'SC' },
    { code: 'FAMILY', name: 'Ontario Court of Justice - Family', description: 'Family law matters', formPrefix: 'FL' },
    { code: 'SUPERIOR', name: 'Superior Court of Justice', description: 'Higher court matters over $35,000', formPrefix: 'CV' },
    { code: 'CRIMINAL', name: 'Ontario Court of Justice - Criminal', description: 'Criminal matters', formPrefix: 'CR' },
    { code: 'LABOUR', name: 'Ontario Labour Relations Board', description: 'Employment and labour disputes', formPrefix: 'OLRB' },
    { code: 'WSIB', name: 'Workplace Safety and Insurance Board', description: 'Workplace injury claims', formPrefix: 'WSIB' },
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
    { code: 'RTB', name: 'Residential Tenancy Branch', description: 'Resolves residential tenancy disputes', formPrefix: 'RTB' },
    { code: 'BCHRT', name: 'BC Human Rights Tribunal', description: 'Handles discrimination complaints under BC Human Rights Code', formPrefix: 'HRT' },
    { code: 'CRT', name: 'Civil Resolution Tribunal', description: 'Small claims, strata, and motor vehicle disputes up to $5,000', formPrefix: 'CRT' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Court', description: 'Civil claims $5,001 to $35,000', formPrefix: 'SC' },
    { code: 'FAMILY', name: 'Provincial Court of BC - Family', description: 'Family law matters', formPrefix: 'PFA' },
    { code: 'SUPREME', name: 'Supreme Court of British Columbia', description: 'Higher court matters', formPrefix: 'SCBC' },
    { code: 'CRIMINAL', name: 'Provincial Court of BC - Criminal', description: 'Criminal matters', formPrefix: 'CR' },
    { code: 'LRB', name: 'Labour Relations Board', description: 'Employment and labour disputes', formPrefix: 'LRB' },
    { code: 'WCB', name: 'WorkSafeBC', description: 'Workplace injury claims', formPrefix: 'WCB' },
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
    { code: 'RTDRS', name: 'Residential Tenancy Dispute Resolution Service', description: 'Resolves residential tenancy disputes', formPrefix: 'RTDRS' },
    { code: 'AHRC', name: 'Alberta Human Rights Commission', description: 'Handles discrimination complaints', formPrefix: 'HRC' },
    { code: 'SMALL_CLAIMS', name: 'Provincial Court Civil', description: 'Civil claims up to $50,000', formPrefix: 'CIV' },
    { code: 'FAMILY', name: 'Court of King\'s Bench - Family', description: 'Family law matters', formPrefix: 'FL' },
    { code: 'KINGS_BENCH', name: 'Court of King\'s Bench', description: 'Higher court matters', formPrefix: 'QB' },
    { code: 'CRIMINAL', name: 'Provincial Court of Alberta - Criminal', description: 'Criminal matters', formPrefix: 'CR' },
    { code: 'ALRB', name: 'Alberta Labour Relations Board', description: 'Employment and labour disputes', formPrefix: 'ALRB' },
    { code: 'WCB', name: 'Workers\' Compensation Board', description: 'Workplace injury claims', formPrefix: 'WCB' },
  ],
  formSourceUrl: 'https://www.albertacourts.ca/qb/resources/forms',
  evidenceRules: {
    maxFileSizeMB: 20,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 10,
  }
};

// ============================================
// QUEBEC CONFIGURATION (Placeholder for Phase 5)
// ============================================
export const QUEBEC_CONFIG: ProvinceConfig = {
  code: 'QC',
  name: 'Quebec',
  tribunals: [
    { code: 'TAL', name: 'Tribunal administratif du logement', description: 'Residential tenancy disputes', formPrefix: 'TAL' },
    { code: 'CDPDJ', name: 'Commission des droits de la personne', description: 'Human rights complaints', formPrefix: 'CDP' },
    { code: 'SMALL_CLAIMS', name: 'Small Claims Division', description: 'Civil claims up to $15,000', formPrefix: 'SC' },
    { code: 'FAMILY', name: 'Superior Court - Family', description: 'Family law matters', formPrefix: 'FAM' },
    { code: 'SUPERIOR', name: 'Superior Court of Quebec', description: 'Higher court matters', formPrefix: 'CS' },
    { code: 'CRIMINAL', name: 'Court of Quebec - Criminal', description: 'Criminal matters', formPrefix: 'CR' },
    { code: 'TAT', name: 'Tribunal administratif du travail', description: 'Labour disputes', formPrefix: 'TAT' },
    { code: 'CNESST', name: 'CNESST', description: 'Workplace injury claims', formPrefix: 'CNESST' },
  ],
  formSourceUrl: 'https://www.justice.gouv.qc.ca/en/forms',
  evidenceRules: {
    maxFileSizeMB: 15,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    deadlineDays: 5,
  }
};

// ============================================
// PROVINCE REGISTRY
// ============================================
export const PROVINCE_CONFIGS: Record<string, ProvinceConfig> = {
  'ON': ONTARIO_CONFIG,
  'BC': BC_CONFIG,
  'AB': ALBERTA_CONFIG,
  'QC': QUEBEC_CONFIG,
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
    'tenancy': { 'ON': 'LTB', 'BC': 'RTB', 'AB': 'RTDRS', 'QC': 'TAL' },
    'human_rights': { 'ON': 'HRTO', 'BC': 'BCHRT', 'AB': 'AHRC', 'QC': 'CDPDJ' },
    'small_claims': { 'ON': 'SMALL_CLAIMS', 'BC': 'SMALL_CLAIMS', 'AB': 'SMALL_CLAIMS', 'QC': 'SMALL_CLAIMS' },
    'family': { 'ON': 'FAMILY', 'BC': 'FAMILY', 'AB': 'FAMILY', 'QC': 'FAMILY' },
    'labour': { 'ON': 'LABOUR', 'BC': 'LRB', 'AB': 'ALRB', 'QC': 'TAT' },
    'workers_comp': { 'ON': 'WSIB', 'BC': 'WCB', 'AB': 'WCB', 'QC': 'CNESST' },
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
