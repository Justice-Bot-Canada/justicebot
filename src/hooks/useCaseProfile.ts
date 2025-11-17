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

  // Load from localStorage on mount
  useEffect(() => {
    if (caseId) {
      loadCaseProfile(caseId);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setCaseProfile(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse case profile from localStorage:', e);
        }
      }
    }
  }, [caseId]);

  const loadCaseProfile = async (id: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('triage')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data?.triage) {
        const profile = data.triage as unknown as CaseProfile;
        setCaseProfile(profile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Error loading case profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCaseProfile = async (profile: CaseProfile, caseIdToUpdate?: string) => {
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
      } catch (error) {
        console.error('Error syncing case profile to database:', error);
      }
    }

    return profile;
  };

  const clearCaseProfile = () => {
    setCaseProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    caseProfile,
    loading,
    saveCaseProfile,
    loadCaseProfile,
    clearCaseProfile,
  };
}
