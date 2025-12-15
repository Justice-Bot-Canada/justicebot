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
    __turnstileLoading?: boolean;
    __turnstileLoaded?: boolean;
    __turnstileCallbacks?: Array<() => void>;
  }
}

// Load Turnstile script only once globally
const loadTurnstileScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (window.__turnstileLoaded && window.turnstile) {
      resolve();
      return;
    }

    // Currently loading - add to callbacks
    if (window.__turnstileLoading) {
      window.__turnstileCallbacks = window.__turnstileCallbacks || [];
      window.__turnstileCallbacks.push(resolve);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (existingScript) {
      window.__turnstileLoaded = true;
      resolve();
      return;
    }

    // Start loading
    window.__turnstileLoading = true;
    window.__turnstileCallbacks = [resolve];

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.__turnstileLoaded = true;
      window.__turnstileLoading = false;
      window.__turnstileCallbacks?.forEach(cb => cb());
      window.__turnstileCallbacks = [];
    };

    script.onerror = () => {
      window.__turnstileLoading = false;
      reject(new Error('Turnstile script failed to load'));
    };

    document.head.appendChild(script);
  });
};

export const TurnstileWidget = ({ onSuccess, onError }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadTurnstileScript()
      .then(() => {
        if (mounted) setIsLoaded(true);
      })
      .catch(() => {
        if (mounted) onError?.();
      });

    return () => {
      mounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Widget may already be removed
        }
      }
      widgetIdRef.current = null;
    };
  }, [onError]);

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile && !widgetIdRef.current) {
      try {
        const sitekey = import.meta.env.VITE_TURNSTILE_SITEKEY || '0x4AAAAAACDu7QoIMEUzUdsnnDP2-uM-Nug';
        
        if (!sitekey) {
          console.error('Turnstile sitekey not configured');
          onError?.();
          return;
        }
        
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey,
          callback: (token: string) => {
            console.log('Turnstile verification successful');
            onSuccess(token);
          },
          'error-callback': () => {
            console.error('Turnstile verification failed');
            onError?.();
          },
          'expired-callback': () => {
            console.log('Turnstile token expired');
            widgetIdRef.current = null;
          },
        });
      } catch (error) {
        console.error('Error rendering Turnstile:', error);
        onError?.();
      }
    }
  }, [isLoaded, onSuccess, onError]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center my-4">
        <div className="text-sm text-muted-foreground">Loading verification...</div>
      </div>
    );
  }

  return <div ref={containerRef} className="flex justify-center my-4" />;
};
