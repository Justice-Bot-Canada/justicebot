import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export function useAnalytics() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location.pathname, user?.id]);

  const trackPageView = async () => {
    try {
      await supabase.from('analytics_events').insert({
        user_id: user?.id || null,
        event_type: 'page_view',
        page_path: location.pathname,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackEvent = async (eventType: string, eventData?: any) => {
    try {
      await supabase.from('analytics_events').insert({
        user_id: user?.id || null,
        event_type: eventType,
        event_data: eventData,
        page_path: location.pathname,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackConversion = async (conversionData: any) => {
    await trackEvent('conversion', conversionData);
  };

  return {
    trackEvent,
    trackConversion,
  };
}
