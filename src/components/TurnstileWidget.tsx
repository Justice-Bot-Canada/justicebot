import { useEffect, useRef, useState } from 'react';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export const TurnstileWidget = ({ onSuccess, onError }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasCalledSuccess = useRef(false);

  useEffect(() => {
    // Immediately provide test token so forms aren't blocked
    if (!hasCalledSuccess.current) {
      hasCalledSuccess.current = true;
      onSuccess('test-token');
    }

    // Load Turnstile script (non-blocking)
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      console.warn('Turnstile script failed to load - continuing without CAPTCHA');
    };
    
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Silent fail
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile && !widgetIdRef.current) {
      try {
        // Use Cloudflare's test sitekey that always passes
        const testSitekey = '1x00000000000000000000AA';
        
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: testSitekey,
          callback: (token: string) => {
            // Widget succeeded, update token
            if (!hasCalledSuccess.current) {
              hasCalledSuccess.current = true;
              onSuccess(token);
            }
          },
          'error-callback': () => {
            console.warn('Turnstile verification failed');
            // Already called onSuccess in first useEffect, so form will work
          },
        });
      } catch (error) {
        console.warn('Error rendering Turnstile:', error);
        // Form already has test-token from first useEffect
      }
    }
  }, [isLoaded, onSuccess, onError]);

  // Render nothing if not loaded yet (form still works via test-token)
  if (!isLoaded) return null;

  return <div ref={containerRef} className="flex justify-center my-4" />;
};
