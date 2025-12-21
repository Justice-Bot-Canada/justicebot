import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

const CONSENT_KEY = 'jb_analytics_consent';
const CONSENT_TIMESTAMP_KEY = 'jb_consent_timestamp';

export type ConsentStatus = 'pending' | 'accepted' | 'declined';

interface ConsentContextType {
  consent: ConsentStatus;
  consentTimestamp: string | null;
  acceptConsent: () => void;
  declineConsent: () => void;
  resetConsent: () => void;
  hasConsent: boolean;
}

const ConsentContext = createContext<ConsentContextType | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentStatus>('pending');
  const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);

  // Load consent from localStorage on mount
  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_KEY) as ConsentStatus | null;
    const storedTimestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY);
    
    if (storedConsent && (storedConsent === 'accepted' || storedConsent === 'declined')) {
      setConsent(storedConsent);
      setConsentTimestamp(storedTimestamp);
    }
  }, []);

  const acceptConsent = useCallback(() => {
    const timestamp = new Date().toISOString();
    localStorage.setItem(CONSENT_KEY, 'accepted');
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, timestamp);
    setConsent('accepted');
    setConsentTimestamp(timestamp);
    
    // Enable Google Analytics if consent is given
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  }, []);

  const declineConsent = useCallback(() => {
    const timestamp = new Date().toISOString();
    localStorage.setItem(CONSENT_KEY, 'declined');
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, timestamp);
    setConsent('declined');
    setConsentTimestamp(timestamp);
    
    // Disable Google Analytics if consent is declined
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  }, []);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
    setConsent('pending');
    setConsentTimestamp(null);
  }, []);

  const hasConsent = consent === 'accepted';

  return (
    <ConsentContext.Provider value={{
      consent,
      consentTimestamp,
      acceptConsent,
      declineConsent,
      resetConsent,
      hasConsent,
    }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
