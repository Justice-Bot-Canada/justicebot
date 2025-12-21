import { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { useConsent } from '@/hooks/useConsent';
import type { Json } from '@/integrations/supabase/types';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function useAnalytics() {
  const { user } = useAuth();
  const location = useLocation();
  const { hasConsent, consent } = useConsent();

  const trackPageView = useCallback(async () => {
    // Only track if user has given consent
    if (!hasConsent) {
      return;
    }

    // Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    // Also track to Supabase (anonymized - no user_id if not logged in)
    try {
      await supabase.from('analytics_events').insert([{
        user_id: user?.id || null,
        event_type: 'page_view',
        page_url: location.pathname,
        // Only track user agent if consent given
        user_agent: hasConsent ? navigator.userAgent : null,
      }]);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [location.pathname, location.search, user?.id, hasConsent]);

  useEffect(() => {
    // Only track after consent status is determined
    if (consent !== 'pending') {
      trackPageView();
    }
  }, [trackPageView, consent]);

  const trackEvent = async (eventType: string, eventData?: Record<string, unknown>) => {
    // Only track if user has given consent
    if (!hasConsent) {
      return;
    }

    // Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventType, eventData);
    }

    // Also track to Supabase
    try {
      await supabase.from('analytics_events').insert([{
        user_id: user?.id || null,
        event_type: eventType,
        metrics: (eventData || null) as Json,
        page_url: location.pathname,
        user_agent: hasConsent ? navigator.userAgent : null,
      }]);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackConversion = async (conversionData: Record<string, unknown>) => {
    await trackEvent('conversion', conversionData);
  };

  return {
    trackEvent,
    trackConversion,
    hasConsent,
  };
}
