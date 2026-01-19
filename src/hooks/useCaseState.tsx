import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { analytics } from '@/utils/analytics';

/**
 * CANONICAL CASE STATE - Single Source of Truth
 * 
 * All funnel progression is driven by this state, not UI.
 * UI must read from this state only.
 * UI must never infer progress from page visits.
 */
export interface CaseState {
  // Core flags (non-negotiable)
  triage_complete: boolean;
  evidence_uploaded: boolean;
  merit_score_generated: boolean;
  access_unlocked: boolean;
  dashboard_ready: boolean;
  
  // Supporting data
  caseId: string | null;
  meritScore: number | null;
  evidenceCount: number;
  province: string | null;
  venue: string | null;
  timelineViewed: boolean;
  isPaid: boolean;
  
  // Loading state
  isLoading: boolean;
  error: string | null;
}

export interface UseCaseStateResult {
  state: CaseState;
  refresh: () => Promise<void>;
  
  // State setters (update both local and DB)
  markTriageComplete: (caseId: string) => Promise<void>;
  markEvidenceUploaded: (count: number) => Promise<void>;
  markMeritScoreGenerated: (score: number) => Promise<void>;
  markAccessUnlocked: () => Promise<void>;
  markTimelineViewed: () => Promise<void>;
  
  // Derived helpers
  canAccessDashboard: boolean;
  canAccessEvidence: boolean;
  canAccessTimeline: boolean;
  canAccessForms: boolean;
  canGenerateDocuments: boolean;
  nextRequiredStep: 'welcome' | 'triage' | 'evidence' | 'dashboard';
}

const INITIAL_STATE: CaseState = {
  triage_complete: false,
  evidence_uploaded: false,
  merit_score_generated: false,
  access_unlocked: false,
  dashboard_ready: false,
  caseId: null,
  meritScore: null,
  evidenceCount: 0,
  province: null,
  venue: null,
  timelineViewed: false,
  isPaid: false,
  isLoading: true,
  error: null,
};

export function useCaseState(): UseCaseStateResult {
  const { user } = useAuth();
  const [state, setState] = useState<CaseState>(INITIAL_STATE);

  // Fetch complete case state from database
  const refresh = useCallback(async () => {
    if (!user) {
      setState({ ...INITIAL_STATE, isLoading: false });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch profile for province
      const { data: profile } = await supabase
        .from('profiles')
        .select('selected_province')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch most recent case
      const { data: cases } = await supabase
        .from('cases')
        .select('id, flow_step, triage_complete, timeline_viewed, province, venue, merit_score, is_paid, status')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      const activeCase = cases?.[0];

      // Fetch evidence count
      let evidenceCount = 0;
      if (activeCase?.id) {
        const { count } = await supabase
          .from('evidence')
          .select('*', { count: 'exact', head: true })
          .eq('case_id', activeCase.id);
        evidenceCount = count || 0;
      }

      // Check for paid entitlements (premium access)
      let hasAccess = false;
      if (user.id) {
        const { data: entitlements } = await supabase
          .from('entitlements')
          .select('product_id, ends_at')
          .eq('user_id', user.id);
        
        if (entitlements && entitlements.length > 0) {
          hasAccess = entitlements.some(e => {
            // Check if subscription is still active
            if (e.ends_at && new Date(e.ends_at) < new Date()) {
              return false;
            }
            // Premium products
            return e.product_id?.toLowerCase().includes('monthly') ||
                   e.product_id?.toLowerCase().includes('yearly') ||
                   e.product_id?.toLowerCase().includes('premium') ||
                   e.product_id?.toLowerCase().includes('professional') ||
                   e.product_id?.toLowerCase().includes('basic');
          });
        }
      }

      // Derive state flags
      const triageComplete = activeCase?.triage_complete || false;
      const evidenceUploaded = evidenceCount > 0;
      const meritScoreGenerated = activeCase?.merit_score !== null && activeCase?.merit_score !== undefined;
      const accessUnlocked = hasAccess || activeCase?.is_paid === true;
      
      // Dashboard is ready when user has completed triage
      const dashboardReady = triageComplete;

      setState({
        triage_complete: triageComplete,
        evidence_uploaded: evidenceUploaded,
        merit_score_generated: meritScoreGenerated,
        access_unlocked: accessUnlocked,
        dashboard_ready: dashboardReady,
        caseId: activeCase?.id || null,
        meritScore: activeCase?.merit_score || null,
        evidenceCount,
        province: profile?.selected_province || activeCase?.province || null,
        venue: activeCase?.venue || null,
        timelineViewed: activeCase?.timeline_viewed || false,
        isPaid: accessUnlocked,
        isLoading: false,
        error: null,
      });

    } catch (error) {
      console.error('Error fetching case state:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to load case state' 
      }));
    }
  }, [user?.id]);

  // Load state on mount and user change
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Mark triage complete
  const markTriageComplete = useCallback(async (caseId: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('cases')
        .update({ 
          triage_complete: true, 
          flow_step: 'evidence',
          updated_at: new Date().toISOString() 
        })
        .eq('id', caseId);

      setState(prev => ({ 
        ...prev, 
        triage_complete: true,
        caseId,
        dashboard_ready: true,
      }));
      
      // Fire analytics event
      analytics.funnelTriageComplete({
        province: state.province || 'ON',
        caseType: state.venue || 'unknown',
      });
    } catch (error) {
      console.error('Error marking triage complete:', error);
    }
  }, [user, state.province, state.venue]);

  // Mark evidence uploaded
  const markEvidenceUploaded = useCallback(async (count: number) => {
    setState(prev => ({ 
      ...prev, 
      evidence_uploaded: count > 0,
      evidenceCount: count,
    }));
    
    // Fire analytics event
    if (count > 0) {
      analytics.evidenceUploadComplete(count, state.caseId || undefined);
    }
  }, [state.caseId]);

  // Mark merit score generated
  const markMeritScoreGenerated = useCallback(async (score: number) => {
    if (!state.caseId) return;
    
    try {
      await supabase
        .from('cases')
        .update({ 
          merit_score: score,
          updated_at: new Date().toISOString() 
        })
        .eq('id', state.caseId);

      setState(prev => ({ 
        ...prev, 
        merit_score_generated: true,
        meritScore: score,
      }));
      
      // Fire analytics event
      analytics.meritScoreGenerated(score, state.caseId);
    } catch (error) {
      console.error('Error marking merit score generated:', error);
    }
  }, [state.caseId]);

  // Mark access unlocked (after payment)
  const markAccessUnlocked = useCallback(async () => {
    setState(prev => ({ 
      ...prev, 
      access_unlocked: true,
      isPaid: true,
    }));
    
    // Fire analytics event
    analytics.featuresUnlocked(state.caseId || undefined);
  }, [state.caseId]);

  // Mark timeline viewed
  const markTimelineViewed = useCallback(async () => {
    if (!state.caseId) return;
    
    try {
      await supabase
        .from('cases')
        .update({ 
          timeline_viewed: true,
          flow_step: 'documents',
          updated_at: new Date().toISOString() 
        })
        .eq('id', state.caseId);

      setState(prev => ({ 
        ...prev, 
        timelineViewed: true,
      }));
    } catch (error) {
      console.error('Error marking timeline viewed:', error);
    }
  }, [state.caseId]);

  // Derived access checks
  const canAccessDashboard = useMemo(() => {
    return state.triage_complete;
  }, [state.triage_complete]);

  const canAccessEvidence = useMemo(() => {
    return state.triage_complete;
  }, [state.triage_complete]);

  const canAccessTimeline = useMemo(() => {
    return state.triage_complete && state.evidence_uploaded;
  }, [state.triage_complete, state.evidence_uploaded]);

  const canAccessForms = useMemo(() => {
    return state.triage_complete && state.evidence_uploaded && state.merit_score_generated;
  }, [state.triage_complete, state.evidence_uploaded, state.merit_score_generated]);

  // Form generation requires ALL conditions
  const canGenerateDocuments = useMemo(() => {
    return state.triage_complete && 
           state.evidence_uploaded && 
           state.merit_score_generated && 
           state.access_unlocked;
  }, [state.triage_complete, state.evidence_uploaded, state.merit_score_generated, state.access_unlocked]);

  // Calculate next required step
  const nextRequiredStep = useMemo((): 'welcome' | 'triage' | 'evidence' | 'dashboard' => {
    if (!state.province) return 'welcome';
    if (!state.triage_complete) return 'triage';
    if (!state.evidence_uploaded) return 'evidence';
    return 'dashboard';
  }, [state.province, state.triage_complete, state.evidence_uploaded]);

  return {
    state,
    refresh,
    markTriageComplete,
    markEvidenceUploaded,
    markMeritScoreGenerated,
    markAccessUnlocked,
    markTimelineViewed,
    canAccessDashboard,
    canAccessEvidence,
    canAccessTimeline,
    canAccessForms,
    canGenerateDocuments,
    nextRequiredStep,
  };
}
