import { useEffect } from 'react';

// Klaviyo Company ID
const KLAVIYO_COMPANY_ID = 'Tr3qJ8';

declare global {
  interface Window {
    _learnq: any[];
    _klOnsite: any[];
    klaviyo: any;
  }
}

export const KlaviyoTracking = () => {
  useEffect(() => {
    // Initialize Klaviyo object on page load (official script)
    if (!window.klaviyo) {
      window._klOnsite = window._klOnsite || [];
      try {
        window.klaviyo = new Proxy({}, {
          get: function(_target: any, prop: string | symbol) {
            return "push" === prop 
              ? function(...args: any[]) {
                  window._klOnsite.push.apply(window._klOnsite, args);
                }
              : function(...args: any[]) {
                  const callback = "function" == typeof args[args.length - 1] ? args.pop() : undefined;
                  const promise = new Promise((resolve) => {
                    window._klOnsite.push([prop, ...args, function(result: any) {
                      callback && callback(result);
                      resolve(result);
                    }]);
                  });
                  return promise;
                };
          }
        });
      } catch (_e) {
        window.klaviyo = window.klaviyo || [];
        window.klaviyo.push = function(...args: any[]) {
          window._klOnsite.push.apply(window._klOnsite, args);
        };
      }
    }

    // Initialize legacy _learnq for backwards compatibility
    window._learnq = window._learnq || [];

    // Load Klaviyo script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://static.klaviyo.com/onsite/js/${KLAVIYO_COMPANY_ID}/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`;
    
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    return () => {
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
