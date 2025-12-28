// UTM Parameter Tracking for Clinic Outreach
// Captures and persists UTM params throughout session

export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

const UTM_STORAGE_KEY = 'justice_bot_utm_params';
const UTM_EXPIRY_KEY = 'justice_bot_utm_expiry';
const UTM_EXPIRY_HOURS = 24; // Persist UTM for 24 hours

// Parse UTM params from URL
export const parseUTMParams = (): UTMParams => {
  if (typeof window === 'undefined') {
    return { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null, utm_content: null };
  }

  const params = new URLSearchParams(window.location.search);
  
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  };
};

// Store UTM params in sessionStorage (persists across page navigations)
export const storeUTMParams = (params: UTMParams): void => {
  if (typeof window === 'undefined') return;
  
  // Only store if we have at least one UTM param
  const hasParams = Object.values(params).some(v => v !== null);
  if (!hasParams) return;

  const expiry = Date.now() + (UTM_EXPIRY_HOURS * 60 * 60 * 1000);
  
  sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
  sessionStorage.setItem(UTM_EXPIRY_KEY, expiry.toString());
  
  if (import.meta.env.DEV) {
    console.log('[UTM] Stored params:', params);
  }
};

// Retrieve stored UTM params
export const getStoredUTMParams = (): UTMParams | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  const expiry = sessionStorage.getItem(UTM_EXPIRY_KEY);
  
  if (!stored || !expiry) return null;
  
  // Check expiry
  if (Date.now() > parseInt(expiry, 10)) {
    sessionStorage.removeItem(UTM_STORAGE_KEY);
    sessionStorage.removeItem(UTM_EXPIRY_KEY);
    return null;
  }
  
  return JSON.parse(stored);
};

// Get current UTM params (from URL or storage)
export const getCurrentUTMParams = (): UTMParams => {
  const urlParams = parseUTMParams();
  const hasUrlParams = Object.values(urlParams).some(v => v !== null);
  
  if (hasUrlParams) {
    storeUTMParams(urlParams);
    return urlParams;
  }
  
  return getStoredUTMParams() || { 
    utm_source: null, 
    utm_medium: null, 
    utm_campaign: null, 
    utm_term: null, 
    utm_content: null 
  };
};

// Check if visitor is from a clinic
export const isClinicTraffic = (): boolean => {
  const params = getCurrentUTMParams();
  return params.utm_source === 'clinic';
};

// Get clinic campaign name (e.g., "waterloo_region", "toronto_legal")
export const getClinicCampaign = (): string | null => {
  const params = getCurrentUTMParams();
  if (params.utm_source === 'clinic') {
    return params.utm_campaign;
  }
  return null;
};

// Campaign name to display name mapping
const CLINIC_DISPLAY_NAMES: Record<string, string> = {
  'waterloo_region': 'Waterloo Region',
  'toronto_legal': 'Toronto',
  'london_middlesex': 'London & Middlesex',
  'ottawa_legal': 'Ottawa',
  'hamilton_legal': 'Hamilton',
  'windsor_essex': 'Windsor & Essex',
  'niagara_region': 'Niagara Region',
  'durham_region': 'Durham Region',
  'peel_region': 'Peel Region',
  'york_region': 'York Region',
  'sudbury_legal': 'Sudbury',
  'thunder_bay': 'Thunder Bay',
  'kingston_legal': 'Kingston',
  'barrie_simcoe': 'Barrie & Simcoe',
  // Add more as needed
};

// Get friendly display name for clinic region
export const getClinicDisplayName = (): string | null => {
  const campaign = getClinicCampaign();
  if (!campaign) return null;
  
  return CLINIC_DISPLAY_NAMES[campaign] || campaign.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Generate UTM link for a clinic
export const generateClinicUTMLink = (
  campaign: string,
  medium: string = 'email',
  baseUrl: string = 'https://www.justice-bot.com'
): string => {
  const params = new URLSearchParams({
    utm_source: 'clinic',
    utm_medium: medium,
    utm_campaign: campaign,
  });
  
  return `${baseUrl}/?${params.toString()}`;
};

// Predefined clinic links for easy reference
export const CLINIC_UTM_LINKS = {
  waterloo_region: generateClinicUTMLink('waterloo_region'),
  toronto_legal: generateClinicUTMLink('toronto_legal'),
  london_middlesex: generateClinicUTMLink('london_middlesex'),
  ottawa_legal: generateClinicUTMLink('ottawa_legal'),
  hamilton_legal: generateClinicUTMLink('hamilton_legal'),
  windsor_essex: generateClinicUTMLink('windsor_essex'),
  niagara_region: generateClinicUTMLink('niagara_region'),
  durham_region: generateClinicUTMLink('durham_region'),
  peel_region: generateClinicUTMLink('peel_region'),
  york_region: generateClinicUTMLink('york_region'),
};
