import { useEffect } from 'react';

// Klaviyo Public API Key (safe for client-side)
const KLAVIYO_PUBLIC_KEY = 'Tr3qJ8';

declare global {
  interface Window {
    _learnq: any[];
    klaviyo: any;
  }
}

export const KlaviyoTracking = () => {
  useEffect(() => {
    // Initialize Klaviyo queue
    window._learnq = window._learnq || [];

    // Load Klaviyo script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_PUBLIC_KEY}`;
    
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
};

// Helper functions for Klaviyo tracking
export const klaviyoIdentify = (email: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window._learnq) {
    window._learnq.push(['identify', {
      '$email': email,
      ...properties
    }]);
  }
};

export const klaviyoTrack = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window._learnq) {
    window._learnq.push(['track', eventName, properties]);
  }
};

// Pre-defined event trackers
export const klaviyoEvents = {
  viewedPage: (pageName: string, pageUrl: string) => {
    klaviyoTrack('Viewed Page', { 'Page Name': pageName, 'Page URL': pageUrl });
  },
  
  startedTriage: (caseType?: string) => {
    klaviyoTrack('Started Triage', { 'Case Type': caseType });
  },
  
  completedTriage: (caseType: string, province: string) => {
    klaviyoTrack('Completed Triage', { 'Case Type': caseType, 'Province': province });
  },
  
  viewedForm: (formCode: string, formTitle: string) => {
    klaviyoTrack('Viewed Form', { 'Form Code': formCode, 'Form Title': formTitle });
  },
  
  startedCheckout: (formCode: string, price: number) => {
    klaviyoTrack('Started Checkout', { 
      'Form Code': formCode, 
      '$value': price,
      'Currency': 'CAD'
    });
  },
  
  completedPurchase: (formCode: string, price: number, orderId: string) => {
    klaviyoTrack('Completed Purchase', {
      'Form Code': formCode,
      '$value': price,
      'Currency': 'CAD',
      'Order ID': orderId
    });
  },
  
  signedUp: (source: string) => {
    klaviyoTrack('Signed Up', { 'Source': source });
  },
  
  subscribedNewsletter: (source: string) => {
    klaviyoTrack('Subscribed Newsletter', { 'Source': source });
  }
};
