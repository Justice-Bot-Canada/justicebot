// Analytics utility for tracking user interactions
// Compatible with Google Analytics 4 and Plausible

import { getCurrentUTMParams, isClinicTraffic, getClinicCampaign } from './utmTracking';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (...args: any[]) => void;
  }
}

// Session storage key for program_id
const PROGRAM_STORAGE_KEY = 'justice_bot_program';

// Helper to get current program_id from session
const getCurrentProgramId = (): string | null => {
  try {
    const stored = sessionStorage.getItem(PROGRAM_STORAGE_KEY);
    if (stored) {
      const program = JSON.parse(stored);
      return program?.id || null;
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
};

// Helper to attach UTM params and program_id to all events
const attachUTMParams = (properties?: Record<string, any>): Record<string, any> => {
  const utm = getCurrentUTMParams();
  const enrichedParams: Record<string, any> = {};
  
  if (utm.utm_source) enrichedParams.utm_source = utm.utm_source;
  if (utm.utm_medium) enrichedParams.utm_medium = utm.utm_medium;
  if (utm.utm_campaign) enrichedParams.utm_campaign = utm.utm_campaign;
  if (utm.utm_term) enrichedParams.utm_term = utm.utm_term;
  if (utm.utm_content) enrichedParams.utm_content = utm.utm_content;
  
  // Always attach program_id if present (CRITICAL for agency analytics)
  const programId = getCurrentProgramId();
  if (programId) {
    enrichedParams.program_id = programId;
  }
  
  return { ...properties, ...enrichedParams };
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  const enrichedProps = attachUTMParams(properties);
  
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, enrichedProps);
  }
  
  // Plausible Analytics
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props: enrichedProps });
  }
  
  // Console log in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, enrichedProps);
  }
};

// GA4 Enhanced Ecommerce Events
const sendGA4Event = (eventName: string, params: Record<string, any>) => {
  const enrichedParams = attachUTMParams(params);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, enrichedParams);
  }
  // Console log in development
  if (import.meta.env.DEV) {
    console.log('[GA4 Ecommerce]', eventName, enrichedParams);
  }
};

// Helper to create item object for GA4 ecommerce
const createItem = (planKey: string, planName: string, price: number) => ({
  item_id: planKey,
  item_name: `${planName} Subscription`,
  item_category: 'Legal Services',
  item_category2: 'Subscription',
  price: price,
  quantity: 1,
});

// Predefined tracking functions
export const analytics = {
  // ==========================================
  // GA4 FUNNEL EVENTS (Required for Purchase Funnels)
  // ==========================================

  // Funnel entry - when user clicks "Check eligibility" from SEO pages
  funnelStart: (entryPage?: string) => {
    sendGA4Event('funnel_start', {
      country: 'CA',
      entry_page: entryPage || window.location.pathname,
    });
  },

  // Triage start - when first triage question loads
  funnelTriageStart: (province?: string) => {
    sendGA4Event('triage_start', {
      country: 'CA',
      province: province || 'ON',
    });
  },

  // Triage complete - CRITICAL: when last triage question is answered
  funnelTriageComplete: (data: { province?: string; caseType?: string; meritRange?: string }) => {
    sendGA4Event('triage_complete', {
      country: 'CA',
      province: data.province || 'ON',
      case_type: data.caseType || 'unknown',
      merit_range: data.meritRange || 'unknown',
    });
  },

  // Paywall shown - when unlock/paywall screen appears
  paywallView: (product?: string) => {
    sendGA4Event('paywall_view', {
      country: 'CA',
      product: product || 'case_assessment',
    });
  },

  // Checkout started - when user clicks payment button
  funnelBeginCheckout: (data: { value: number; itemName: string }) => {
    sendGA4Event('begin_checkout', {
      country: 'CA',
      currency: 'CAD',
      value: data.value,
      item_name: data.itemName,
    });
  },

  // Purchase completed - NON-NEGOTIABLE: fires after confirmed payment
  funnelPurchase: (data: { transactionId?: string; value: number; itemName: string }) => {
    sendGA4Event('purchase', {
      transaction_id: data.transactionId || crypto.randomUUID(),
      currency: 'CAD',
      value: data.value,
      items: [{
        item_name: data.itemName,
        category: 'Legal',
        country: 'CA',
      }],
    });
  },

  // ==========================================
  // GA4 ECOMMERCE EVENTS (for general use)
  // ==========================================

  // GA4 Ecommerce: view_item (required for Purchase Journey)
  viewItem: (planKey: string, planName: string, price: number) => {
    sendGA4Event('view_item', {
      currency: 'CAD',
      value: price,
      items: [createItem(planKey, planName, price)],
    });
  },

  // GA4 Ecommerce: add_to_cart (required for Purchase Journey)
  addToCart: (planKey: string, planName: string, price: number) => {
    sendGA4Event('add_to_cart', {
      currency: 'CAD',
      value: price,
      items: [createItem(planKey, planName, price)],
    });
  },

  // GA4 Ecommerce: begin_checkout (required for Purchase Journey)
  beginCheckout: (planKey: string, planName: string, price: number) => {
    sendGA4Event('begin_checkout', {
      currency: 'CAD',
      value: price,
      items: [createItem(planKey, planName, price)],
    });
  },

  // Triage tracking (legacy)
  triageStart: () => trackEvent('triage_start'),
  triageComplete: (venue: string) => trackEvent('triage_complete', { venue }),
  
  // Journey tracking
  journeyView: (journey: string) => trackEvent('journey_view', { journey }),
  journeyStepView: (journey: string, step: string) => trackEvent('journey_step_view', { journey, step }),
  journeyComplete: (journey: string) => trackEvent('journey_complete', { journey }),
  
  // Form tracking
  formOpen: (formType: string) => trackEvent('form_open', { form_type: formType }),
  formDownload: (formType: string) => trackEvent('form_download', { form_type: formType }),
  formFill: (formType: string) => trackEvent('form_fill_start', { form_type: formType }),
  
  // Low-income program
  lowIncomeApplicationStart: () => trackEvent('low_income_application_start'),
  lowIncomeApplicationComplete: () => trackEvent('low_income_application_complete'),
  
  // GA4 Enhanced Conversions - Sign Up
  signUp: (method: string) => {
    trackEvent('sign_up', { method });
    // GA4 recommended event
    sendGA4Event('sign_up', {
      method: method,
    });
  },
  
  // GA4 Enhanced Conversions - Purchase
  purchase: (plan: string, amount: number, transactionId?: string) => {
    trackEvent('purchase', { plan, value: amount, currency: 'CAD' });
    // GA4 recommended ecommerce event
    sendGA4Event('purchase', {
      transaction_id: transactionId || `txn_${Date.now()}`,
      value: amount,
      currency: 'CAD',
      items: [{
        item_id: plan,
        item_name: plan === 'form_purchase' ? 'Legal Form' : `${plan} Subscription`,
        category: 'Legal Services',
        quantity: 1,
        price: amount,
      }],
    });
  },
  
  // Content engagement
  videoPlay: (videoId: string) => trackEvent('video_play', { video_id: videoId }),
  tutorialView: (tutorialId: string) => trackEvent('tutorial_view', { tutorial_id: tutorialId }),
  templateDownload: (templateId: string) => trackEvent('template_download', { template_id: templateId }),
  
  // Chat interactions
  chatStart: () => trackEvent('chat_start'),
  chatMessage: (messageCount: number) => trackEvent('chat_message', { message_count: messageCount }),
  
  // GA4 Enhanced - Signup flow (KEY EVENT for conversions)
  signupClick: () => {
    trackEvent('signup_click');
    sendGA4Event('generate_lead', { lead_source: 'signup_button' });
  },
  signupAttempt: (email: string) => {
    trackEvent('signup_attempt', { email_domain: email.split('@')[1] });
  },
  signupComplete: (email: string, method: string) => {
    // Primary sign_up event - mark as KEY EVENT in GA4
    trackEvent('sign_up', { method });
    
    // GA4 recommended sign_up event (mark this as key event in GA4 admin)
    sendGA4Event('sign_up', { 
      method: method,
      user_email_domain: email.split('@')[1],
    });
    
    // Custom conversion event for tracking
    sendGA4Event('user_signup_complete', {
      method: method,
      signup_page: window.location.pathname,
    });
  },
  signupFailed: (error: string) => trackEvent('signup_failed', { error }),
  
  // GA4 Enhanced - Payment flow
  paymentInitiated: (plan: string, amount: string, method: string) => {
    trackEvent('payment_initiated', { plan, amount, method });
    sendGA4Event('begin_checkout', {
      currency: 'CAD',
      value: parseFloat(amount.replace(/[^0-9.]/g, '')),
      items: [{
        item_id: plan,
        item_name: plan === 'form_purchase' ? 'Legal Form' : `${plan} Subscription`,
        quantity: 1,
        price: parseFloat(amount.replace(/[^0-9.]/g, '')),
      }],
    });
  },
  paymentCompleted: (plan: string, amount: string, paymentId?: string) => {
    const value = parseFloat(amount.replace(/[^0-9.]/g, ''));
    trackEvent('payment_completed', { plan, amount, payment_id: paymentId, value, currency: 'CAD' });
    // GA4 purchase event
    sendGA4Event('purchase', {
      transaction_id: paymentId || `txn_${Date.now()}`,
      value: value,
      currency: 'CAD',
      items: [{
        item_id: plan,
        item_name: plan === 'form_purchase' ? 'Legal Form' : `${plan} Subscription`,
        category: 'Legal Services',
        quantity: 1,
        price: value,
      }],
    });
  },
  paymentAbandoned: (plan: string, amount: string, reason: string) => {
    trackEvent('payment_abandoned', { plan, amount, reason });
  },
  paymentFailed: (plan: string, amount: string, error: string) => {
    trackEvent('payment_failed', { plan, amount, error });
  },

  // Lead capture
  leadCaptured: (source: string, journey?: string) => {
    trackEvent('lead_captured', { source, journey });
    sendGA4Event('generate_lead', { 
      lead_source: source,
      journey: journey,
    });
  },

  // Pipeline Conversion Events (6 key events + 1 global)
  
  // Global: journey_started - fires when any journey page loads
  journeyStarted: (journey: string, entryPoint: string, userLoggedIn: boolean) => {
    const payload = {
      journey,
      entry_point: entryPoint,
      user_logged_in: userLoggedIn,
    };
    trackEvent('journey_started', payload);
    sendGA4Event('journey_started', payload);
  },

  // 1. /urgent-triage → journey page loaded
  urgentRouted: (data: {
    detectedTrigger: string;
    recommendedJourney: string;
    secondaryFlag?: string[];
    timeToRouteSeconds: number;
    userLoggedIn: boolean;
  }) => {
    const payload = {
      route: '/urgent-triage',
      detected_trigger: data.detectedTrigger,
      recommended_journey: data.recommendedJourney,
      secondary_flag: data.secondaryFlag || [],
      time_to_route_seconds: data.timeToRouteSeconds,
      user_logged_in: data.userLoggedIn,
    };
    trackEvent('urgent_routed', payload);
    sendGA4Event('urgent_routed', payload);
  },
  
  // 2. /find-my-path → journey clicked
  pathSelected: (data: {
    legalDomain: string;
    selectedJourney: string;
    confidenceLevel?: 'low' | 'medium' | 'high';
    userLoggedIn: boolean;
  }) => {
    const payload = {
      route: '/find-my-path',
      legal_domain: data.legalDomain,
      selected_journey: data.selectedJourney,
      confidence_level: data.confidenceLevel || 'medium',
      user_logged_in: data.userLoggedIn,
    };
    trackEvent('path_selected', payload);
    sendGA4Event('path_selected', payload);
  },
  
  // 3. /upload-first → AI returns pathway
  docAnalyzed: (data: {
    documentType: string;
    issuesDetected: string[];
    recommendedJourney: string[];
    confidenceScore: number;
    userLoggedIn: boolean;
  }) => {
    const payload = {
      route: '/upload-first',
      document_type: data.documentType,
      issues_detected: data.issuesDetected,
      recommended_journey: data.recommendedJourney,
      confidence_score: data.confidenceScore,
      user_logged_in: data.userLoggedIn,
    };
    trackEvent('doc_analyzed', payload);
    sendGA4Event('doc_analyzed', payload);
  },
  
  // 4. /triage → merit + tribunal shown
  triageCompleted: (data: {
    recommendedJourney: string;
    meritScore: number;
    groundsDetected?: string[];
    dualPathway: boolean;
    userLoggedIn: boolean;
  }) => {
    const payload = {
      route: '/triage',
      recommended_journey: data.recommendedJourney,
      merit_score: data.meritScore,
      grounds_detected: data.groundsDetected || [],
      dual_pathway: data.dualPathway,
      user_logged_in: data.userLoggedIn,
    };
    trackEvent('triage_completed', payload);
    sendGA4Event('triage_completed', payload);
  },
  
  // 5. /explain-my-options → clicks triage or upload
  educationConverted: (data: {
    destination: string;
    timeOnPageSeconds: number;
    userLoggedIn: boolean;
  }) => {
    const payload = {
      route: '/explain-my-options',
      destination: data.destination,
      time_on_page_seconds: data.timeOnPageSeconds,
      user_logged_in: data.userLoggedIn,
    };
    trackEvent('education_converted', payload);
    sendGA4Event('education_converted', payload);
  },
  
  // 6. /case-demo → account created
  demoSignup: (data: {
    demoCase: string;
    userLoggedIn: boolean;
  }) => {
    const payload = {
      route: '/case-demo',
      demo_case: data.demoCase,
      conversion_source: 'demo',
      user_logged_in: data.userLoggedIn,
    };
    trackEvent('demo_signup', payload);
    sendGA4Event('demo_signup', payload);
  },

  // ==========================================
  // CLINIC OUTREACH CONVERSION EVENTS
  // Mark these as KEY EVENTS in GA4 Admin
  // ==========================================

  // Clinic visitor arrived (fires on landing with clinic UTM)
  clinicVisitorArrived: () => {
    if (!isClinicTraffic()) return;
    
    const campaign = getClinicCampaign();
    const payload = {
      clinic_campaign: campaign,
      landing_page: window.location.pathname,
    };
    trackEvent('clinic_visitor_arrived', payload);
    sendGA4Event('clinic_visitor_arrived', payload);
  },

  // Clinic visitor started assessment (KEY CONVERSION)
  clinicAssessmentStart: () => {
    const campaign = getClinicCampaign();
    const payload = {
      clinic_campaign: campaign,
      is_clinic_traffic: isClinicTraffic(),
    };
    trackEvent('clinic_assessment_start', payload);
    sendGA4Event('clinic_assessment_start', payload);
  },

  // Clinic visitor completed assessment (KEY CONVERSION)
  clinicAssessmentComplete: (venue: string) => {
    const campaign = getClinicCampaign();
    const payload = {
      clinic_campaign: campaign,
      is_clinic_traffic: isClinicTraffic(),
      venue,
    };
    trackEvent('clinic_assessment_complete', payload);
    sendGA4Event('clinic_assessment_complete', payload);
  },

  // Clinic visitor signed up (KEY CONVERSION)
  clinicSignupComplete: (method: string) => {
    const campaign = getClinicCampaign();
    const payload = {
      clinic_campaign: campaign,
      is_clinic_traffic: isClinicTraffic(),
      method,
    };
    trackEvent('clinic_signup_complete', payload);
    sendGA4Event('clinic_signup_complete', payload);
  },

  // Clinic visitor generated document (KEY CONVERSION)
  clinicDocumentGenerated: (documentType: string) => {
    const campaign = getClinicCampaign();
    const payload = {
      clinic_campaign: campaign,
      is_clinic_traffic: isClinicTraffic(),
      document_type: documentType,
    };
    trackEvent('clinic_document_generated', payload);
    sendGA4Event('clinic_document_generated', payload);
  },

  // Clinic visitor dropped off (for funnel analysis)
  clinicDropoff: (lastPage: string, timeOnSiteSeconds: number) => {
    const campaign = getClinicCampaign();
    const payload = {
      clinic_campaign: campaign,
      is_clinic_traffic: isClinicTraffic(),
      last_page: lastPage,
      time_on_site_seconds: timeOnSiteSeconds,
    };
    trackEvent('clinic_dropoff', payload);
    sendGA4Event('clinic_dropoff', payload);
  },

  // ==========================================
  // PROGRAM / AGENCY CONVERSION EVENTS
  // These track agency/government referral flows
  // All events auto-include program_id via attachUTMParams
  // ==========================================

  // Program landing page viewed
  programLandingViewed: (programId: string, programSlug: string, organization?: string) => {
    const payload = {
      program_id: programId,
      program_slug: programSlug,
      organization: organization || 'unknown',
    };
    trackEvent('program_landing_viewed', payload);
    sendGA4Event('program_landing_viewed', payload);
  },

  // Program intake started (user clicks "Start My Case")
  programIntakeStarted: (programId: string, programSlug: string) => {
    const payload = {
      program_id: programId,
      program_slug: programSlug,
    };
    trackEvent('program_intake_started', payload);
    sendGA4Event('program_intake_started', payload);
  },

  // Program intake completed (triage done)
  programIntakeCompleted: (programId: string, venue?: string) => {
    const payload = {
      program_id: programId,
      venue: venue || 'unknown',
    };
    trackEvent('program_intake_completed', payload);
    sendGA4Event('program_intake_completed', payload);
  },

  // Program evidence uploaded
  programEvidenceUploaded: (programId: string, fileCount: number) => {
    const payload = {
      program_id: programId,
      file_count: fileCount,
    };
    trackEvent('program_evidence_uploaded', payload);
    sendGA4Event('program_evidence_uploaded', payload);
  },

  // Program documents generated
  programDocumentsGenerated: (programId: string, documentTypes: string[]) => {
    const payload = {
      program_id: programId,
      document_types: documentTypes,
    };
    trackEvent('program_documents_generated', payload);
    sendGA4Event('program_documents_generated', payload);
  },

  // Program documents downloaded
  programDocumentsDownloaded: (programId: string) => {
    const payload = {
      program_id: programId,
    };
    trackEvent('program_documents_downloaded', payload);
    sendGA4Event('program_documents_downloaded', payload);
  },
};
