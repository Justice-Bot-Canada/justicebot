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

export function useCaseProfile(caseId?: string) {
  const { user } = useAuth();
  const [caseProfile, setCaseProfile] = useState<CaseProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Load from localStorage or database on mount
  useEffect(() => {
    console.log('[useCaseProfile] Effect triggered', { caseId, hasUser: !!user });
    
    // If no caseId, try localStorage
    if (!caseId) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const profile = JSON.parse(stored);
          console.log('[useCaseProfile] Loaded from localStorage');
          setCaseProfile(profile);
        } catch (e) {
          console.error('[useCaseProfile] Failed to parse from localStorage:', e);
        }
      }
      return;
    }

    // If we have caseId but no user, can't load from DB
    if (!user) {
      console.log('[useCaseProfile] No user, skipping database load');
      return;
    }

    // Load from database
    let cancelled = false;
    
    const loadFromDB = async () => {
      setLoading(true);
      try {
        console.log('[useCaseProfile] Fetching from database:', caseId);
        const { data, error } = await supabase
          .from('cases')
          .select('triage')
          .eq('id', caseId)
          .maybeSingle();

        if (cancelled) return;
        
        if (error) throw error;

        if (data?.triage) {
          const profile = data.triage as unknown as CaseProfile;
          console.log('[useCaseProfile] Loaded from database');
          setCaseProfile(profile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        }
      } catch (error) {
        if (!cancelled) {
          console.error('[useCaseProfile] Error loading case profile:', error);
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
    console.log('[useCaseProfile] Saving case profile', { caseIdToUpdate });
    setCaseProfile(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    // Sync to database if user is logged in and caseId provided
    if (user && caseIdToUpdate) {
      try {
        const { error } = await supabase
          .from('cases')
          .update({ triage: profile as any })
          .eq('id', caseIdToUpdate);

        if (error) throw error;
        console.log('[useCaseProfile] Synced to database');
      } catch (error) {
        console.error('[useCaseProfile] Error syncing case profile to database:', error);
      }
    }

    return profile;
  };

  const clearCaseProfile = () => {
    console.log('[useCaseProfile] Clearing case profile');
    setCaseProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    caseProfile,
    loading,
    saveCaseProfile,
    clearCaseProfile,
  };
}
