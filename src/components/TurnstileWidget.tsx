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

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Turnstile script failed to load');
      onError?.();
    };
    
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          console.error('Error removing Turnstile widget:', e);
        }
      }
    };
  }, [onError]);

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile && !widgetIdRef.current) {
      try {
        // Production sitekey - fallback to env variable
        const sitekey = import.meta.env.VITE_TURNSTILE_SITEKEY || '0x4AAAAAACDu7YkiUswZAh3z';
        
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
            console.log('Turnstile token expired, re-rendering');
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
