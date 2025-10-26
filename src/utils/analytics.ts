// Analytics utility for tracking user interactions
// Compatible with Google Analytics 4 and Plausible

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // Plausible Analytics
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props: properties });
  }
  
  // Console log in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, properties);
  }
};

// Predefined tracking functions
export const analytics = {
  // Triage tracking
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
  
  // Conversions
  signUp: (method: string) => trackEvent('sign_up', { method }),
  purchase: (plan: string, amount: number) => trackEvent('purchase', { plan, value: amount, currency: 'CAD' }),
  
  // Content engagement
  videoPlay: (videoId: string) => trackEvent('video_play', { video_id: videoId }),
  tutorialView: (tutorialId: string) => trackEvent('tutorial_view', { tutorial_id: tutorialId }),
  templateDownload: (templateId: string) => trackEvent('template_download', { template_id: templateId }),
  
  // Chat interactions
  chatStart: () => trackEvent('chat_start'),
  chatMessage: (messageCount: number) => trackEvent('chat_message', { message_count: messageCount }),
};
