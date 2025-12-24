import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TimelineSeed {
  date: string;
  type: string;
  description: string;
  evidence_ids?: string[];
}

export interface CaseProfile {
  issueType: string;
  recommendedForm: string;
  parties?: {
    landlord?: string;
    tenant?: string;
    respondent?: string;
    applicant?: string;
  };
  location?: {
    province?: string;
    municipality?: string;
    postalCode?: string;
  };
  timelineSeeds: TimelineSeed[];
  facts: string[];
  keywords: string[];
  urgency?: string;
  tribunal: string;
  flags: string[];
  venue?: string;
  confidence?: number;
  reasoning?: string;
}

const STORAGE_KEY = 'justice_bot_case_profile';

/**
 * Security: Using sessionStorage instead of localStorage for case profiles.
 * This ensures sensitive legal data is cleared when the browser/tab closes,
 * reducing risk from device access or XSS attacks.
 */
export function useCaseProfile(caseId?: string) {
  const { user } = useAuth();
  const [caseProfile, setCaseProfile] = useState<CaseProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Load from sessionStorage or database on mount
  useEffect(() => {
    // If no caseId, try sessionStorage
    if (!caseId) {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setCaseProfile(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse case profile:', e);
        }
      }
      return;
    }

    // If we have caseId but no user, can't load from DB
    if (!user) return;

    // Load from database
    let cancelled = false;
    
    const loadFromDB = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('triage')
          .eq('id', caseId)
          .maybeSingle();

        if (cancelled) return;
        if (error) throw error;

        if (data?.triage) {
          const profile = data.triage as unknown as CaseProfile;
          setCaseProfile(profile);
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading case profile:', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFromDB();

    return () => {
      cancelled = true;
    };
  }, [caseId, user]);

  const saveCaseProfile = async (profile: CaseProfile, caseIdToUpdate?: string) => {
    setCaseProfile(profile);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    // Sync to database if user is logged in and caseId provided
    if (user && caseIdToUpdate) {
      try {
        const { error } = await supabase
          .from('cases')
          .update({ triage: profile as any })
          .eq('id', caseIdToUpdate);

        if (error) throw error;
      } catch (error) {
        console.error('Error syncing case profile:', error);
      }
    }

    return profile;
  };

  const clearCaseProfile = () => {
    setCaseProfile(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return {
    caseProfile,
    loading,
    saveCaseProfile,
    clearCaseProfile,
  };
}
