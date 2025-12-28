import { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { useConsent } from '@/hooks/useConsent';
import type { Json } from '@/integrations/supabase/types';
import { getCurrentUTMParams, storeUTMParams, parseUTMParams } from '@/utils/utmTracking';

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
    // Capture and store UTM params on every page view
    const urlParams = parseUTMParams();
    const hasUrlParams = Object.values(urlParams).some(v => v !== null);
    if (hasUrlParams) {
      storeUTMParams(urlParams);
    }
    
    // Get current UTM params (from URL or storage) to include in page_view
    const utm = getCurrentUTMParams();
    
    // ALWAYS send page_view to GA4 for proper landing page attribution
    // This fixes "(not set)" landing page issue - GA4 needs page_view at session start
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href,
        // Include UTM params in page_view for attribution
        ...(utm.utm_source && { utm_source: utm.utm_source }),
        ...(utm.utm_medium && { utm_medium: utm.utm_medium }),
        ...(utm.utm_campaign && { utm_campaign: utm.utm_campaign }),
        ...(utm.utm_term && { utm_term: utm.utm_term }),
        ...(utm.utm_content && { utm_content: utm.utm_content }),
      });
    }

    // Only track to Supabase if user has given consent
    if (hasConsent) {
      try {
        await supabase.from('analytics_events').insert([{
          user_id: user?.id || null,
          event_type: 'page_view',
          page_url: location.pathname,
          user_agent: navigator.userAgent,
        }]);
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    }
  }, [location.pathname, location.search, user?.id, hasConsent]);

  // Track page views on route changes - don't wait for consent for GA4
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

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
