import { useCallback, useRef, useEffect } from 'react';

/**
 * Standardized signup analytics hook with exactly 4 events:
 * 1. signup_view - fires once when signup UI loads
 * 2. signup_attempt - fires once when user clicks submit
 * 3. signup_error - fires ONLY when backend rejects signup (with error_type)
 * 4. signup_success - THE CONVERSION - fires ONLY after confirmed account creation
 * 
 * Rules:
 * - Each event fires exactly ONCE per action
 * - signup_error includes error_type for debugging
 * - signup_success is the ONLY conversion event
 * - No duplicate firing, no validation events
 */

// Use the existing gtag type from window

// Track which views have fired this session (prevents duplicate view events)
const viewedSources = new Set<string>();

// Error type mapping for clear GA4 reporting
type SignupErrorType = 
  | 'email_exists'
  | 'invalid_email'
  | 'invalid_password'
  | 'verification_failed'
  | 'rate_limited'
  | 'network_error'
  | 'unexpected_error';

const mapErrorToType = (errorMessage: string): SignupErrorType => {
  const lowerError = errorMessage.toLowerCase();
  
  if (lowerError.includes('already registered') || lowerError.includes('already exists')) {
    return 'email_exists';
  }
  if (lowerError.includes('invalid email') || lowerError.includes('email format')) {
    return 'invalid_email';
  }
  if (lowerError.includes('password')) {
    return 'invalid_password';
  }
  if (lowerError.includes('verification') || lowerError.includes('confirm')) {
    return 'verification_failed';
  }
  if (lowerError.includes('rate') || lowerError.includes('too many')) {
    return 'rate_limited';
  }
  if (lowerError.includes('network') || lowerError.includes('fetch')) {
    return 'network_error';
  }
  return 'unexpected_error';
};

const sendGA4Event = (eventName: string, params: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      page_path: window.location.pathname,
    });
  }
  
  // Console log in development for debugging
  if (import.meta.env.DEV) {
    console.log(`[GA4 Signup] ${eventName}`, params);
  }
};

interface UseSignupAnalyticsOptions {
  source: string; // e.g., 'auth_dialog', 'save_case_modal', 'signup_wall'
}

export function useSignupAnalytics({ source }: UseSignupAnalyticsOptions) {
  // Track if attempt has been fired for this submit (prevents double-click firing)
  const attemptFiredRef = useRef(false);
  
  /**
   * signup_view - Fire ONCE when the signup form becomes visible
   * Called automatically when hook mounts with open=true
   */
  const trackSignupView = useCallback(() => {
    // Prevent duplicate view events for same source in session
    if (viewedSources.has(source)) {
      return;
    }
    viewedSources.add(source);
    
    sendGA4Event('signup_view', {
      source,
    });
  }, [source]);

  /**
   * signup_attempt - Fire ONCE when user clicks Create Account
   * Returns true if this is the first attempt (should proceed)
   * Returns false if already fired (prevent double-submit)
   */
  const trackSignupAttempt = useCallback((email: string): boolean => {
    // Prevent double-firing on rapid clicks
    if (attemptFiredRef.current) {
      console.log('[GA4 Signup] Attempt already fired, blocking duplicate');
      return false;
    }
    
    attemptFiredRef.current = true;
    
    sendGA4Event('signup_attempt', {
      source,
      email_domain: email.split('@')[1] || 'unknown',
    });
    
    return true;
  }, [source]);

  /**
   * Reset attempt tracking - call when form is reset or on error
   */
  const resetAttempt = useCallback(() => {
    attemptFiredRef.current = false;
  }, []);

  /**
   * signup_error - Fire ONLY when backend rejects the signup
   * DO NOT call for validation errors (those don't reach backend)
   */
  const trackSignupError = useCallback((errorMessage: string) => {
    const errorType = mapErrorToType(errorMessage);
    
    sendGA4Event('signup_error', {
      source,
      error_type: errorType,
      error_message: errorMessage.slice(0, 100), // Truncate for GA4
    });
    
    // Reset attempt so user can try again
    attemptFiredRef.current = false;
  }, [source]);

  /**
   * signup_success - THE CONVERSION EVENT
   * Fire ONLY after:
   * 1. Account is confirmed created in Supabase
   * 2. User is logged in OR email confirmation sent
   * 
   * This is the ONLY event that should be marked as conversion in GA4
   */
  const trackSignupSuccess = useCallback((email: string, method: string = 'email') => {
    sendGA4Event('signup_success', {
      source,
      method,
      email_domain: email.split('@')[1] || 'unknown',
    });
    
    // Also fire the standard GA4 sign_up event for compatibility
    sendGA4Event('sign_up', {
      method,
      source,
    });
  }, [source]);

  return {
    trackSignupView,
    trackSignupAttempt,
    trackSignupError,
    trackSignupSuccess,
    resetAttempt,
  };
}

/**
 * Helper hook for components that need view tracking on mount
 */
export function useSignupViewTracking(source: string, isOpen: boolean) {
  const { trackSignupView } = useSignupAnalytics({ source });
  
  useEffect(() => {
    if (isOpen) {
      trackSignupView();
    }
  }, [isOpen, trackSignupView]);
}
