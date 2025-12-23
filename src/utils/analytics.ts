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

// GA4 Enhanced Ecommerce Events
const sendGA4Event = (eventName: string, params: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
  // Console log in development
  if (import.meta.env.DEV) {
    console.log('[GA4 Ecommerce]', eventName, params);
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
};
