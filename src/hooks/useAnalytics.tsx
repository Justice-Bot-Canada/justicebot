import { useEffect, useCallback, useRef } from 'react';
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

// Session start detection for GA4 attribution
const SESSION_KEY = 'jb_session_start';

function isNewSession(): boolean {
  const lastSession = sessionStorage.getItem(SESSION_KEY);
  const now = Date.now();
  // New session if no previous session OR session older than 30 min
  if (!lastSession || (now - parseInt(lastSession, 10)) > 30 * 60 * 1000) {
    sessionStorage.setItem(SESSION_KEY, now.toString());
    return true;
  }
  return false;
}

export function useAnalytics() {
  const { user } = useAuth();
  const location = useLocation();
  const { hasConsent } = useConsent();
  const lastTrackedPath = useRef<string | null>(null);

  const sendGA4PageView = useCallback((pathname: string, search: string) => {
    if (typeof window === 'undefined' || !window.gtag) return;

    // Capture and store UTM params
    const urlParams = parseUTMParams();
    const hasUrlParams = Object.values(urlParams).some(v => v !== null);
    if (hasUrlParams) {
      storeUTMParams(urlParams);
    }
    
    const utm = getCurrentUTMParams();
    const isSessionStart = isNewSession();
    
    // Build page path - ensure it's never empty
    const pagePath = pathname || '/';
    const fullPath = pagePath + (search || '');
    
    // Build complete page location
    const pageLocation = window.location.href || `https://justice-bot.com${fullPath}`;
    
    // Send page_view with session_start flag for proper landing page attribution
    // Explicitly set page_path and page_location to prevent (not set) values
    window.gtag('event', 'page_view', {
      page_path: fullPath,
      page_title: document.title || 'Justice-Bot',
      page_location: pageLocation,
      // Session start flag helps GA4 identify landing pages
      ...(isSessionStart && { 
        session_start: true,
        // Explicitly mark landing page for GA4
        landing_page: fullPath,
      }),
      // Include UTM params for attribution
      ...(utm.utm_source && { utm_source: utm.utm_source }),
      ...(utm.utm_medium && { utm_medium: utm.utm_medium }),
      ...(utm.utm_campaign && { utm_campaign: utm.utm_campaign }),
      ...(utm.utm_term && { utm_term: utm.utm_term }),
      ...(utm.utm_content && { utm_content: utm.utm_content }),
    });
  }, []);

  const trackPageViewToSupabase = useCallback(async (pathname: string) => {
    if (!hasConsent) return;
    
    try {
      await supabase.from('analytics_events').insert([{
        user_id: user?.id || null,
        event_type: 'page_view',
        page_url: pathname,
        user_agent: navigator.userAgent,
      }]);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [user?.id, hasConsent]);

  // Single unified effect for all page view tracking
  // This ensures hooks are always called in the same order
  useEffect(() => {
    const fullPath = location.pathname + location.search;
    
    // Only track if this is a new path (prevent duplicate fires)
    if (lastTrackedPath.current !== fullPath) {
      lastTrackedPath.current = fullPath;
      sendGA4PageView(location.pathname, location.search);
      trackPageViewToSupabase(location.pathname);
    }
  }, [location.pathname, location.search, sendGA4PageView, trackPageViewToSupabase]);

  const trackEvent = useCallback(async (eventType: string, eventData?: Record<string, unknown>) => {
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
  }, [hasConsent, user?.id, location.pathname]);

  const trackConversion = useCallback(async (conversionData: Record<string, unknown>) => {
    await trackEvent('conversion', conversionData);
  }, [trackEvent]);

  return {
    trackEvent,
    trackConversion,
    hasConsent,
  };
}
