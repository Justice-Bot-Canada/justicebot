import { useMemo, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Flow step types
export type FlowStep = 'welcome' | 'triage' | 'evidence' | 'timeline' | 'documents' | 'complete';

// Route to step mapping
const ROUTE_TO_STEP: Record<string, FlowStep> = {
  '/welcome': 'welcome',
  '/triage': 'triage',
  '/evidence': 'evidence',
  '/case-timeline': 'timeline',
  '/dashboard': 'documents',
};

// Step order for progression checks
const STEP_ORDER: FlowStep[] = ['welcome', 'triage', 'evidence', 'timeline', 'documents', 'complete'];

// Step to route mapping
const STEP_TO_ROUTE: Record<FlowStep, string> = {
  'welcome': '/welcome',
  'triage': '/triage',
  'evidence': '/evidence',
  'timeline': '/case-timeline',
  'documents': '/dashboard',
  'complete': '/dashboard',
};

// Step metadata for UI
export const STEP_METADATA: Record<FlowStep, { 
  number: number; 
  title: string; 
  shortTitle: string;
  reassurance: string;
}> = {
  'welcome': { 
    number: 1, 
    title: 'Begin Your Case', 
    shortTitle: 'Begin',
    reassurance: 'No commitment required. We\'ll help you understand your options.'
  },
  'triage': { 
    number: 2, 
    title: 'AI Legal Triage', 
    shortTitle: 'Triage',
    reassurance: 'Takes about 2 minutes. You can update answers anytime.'
  },
  'evidence': { 
    number: 3, 
    title: 'Upload Evidence', 
    shortTitle: 'Evidence',
    reassurance: 'Upload what you have. You can add more later.'
  },
  'timeline': { 
    number: 4, 
    title: 'Review Timeline', 
    shortTitle: 'Timeline',
    reassurance: 'Nothing is filed yet. This is just to help you understand what happens next.'
  },
  'documents': { 
    number: 5, 
    title: 'Generate Documents', 
    shortTitle: 'Documents',
    reassurance: 'Your Book of Documents will be court-ready. We handle formatting.'
  },
  'complete': { 
    number: 5, 
    title: 'Complete', 
    shortTitle: 'Done',
    reassurance: 'Your case is ready for filing.'
  },
};

export interface FlowState {
  // Active case data
  caseId: string | null;
  flowStep: FlowStep;
  triageComplete: boolean;
  timelineViewed: boolean;
  evidenceCount: number;
  selectedProvince: string | null;
  
  // Loading state
  isLoading: boolean;
}

export interface UseFlowEnforcementResult {
  // Current state
  currentStep: FlowStep;
  stepNumber: number;
  totalSteps: number;
  
  // Navigation helpers
  canAccess: (step: FlowStep) => boolean;
  isLocked: (step: FlowStep) => boolean;
  nextAllowedRoute: string;
  getRouteForStep: (step: FlowStep) => string;
  
  // Step status helpers
  isStepComplete: (step: FlowStep) => boolean;
  isCurrentStep: (step: FlowStep) => boolean;
  
  // Raw state
  flowState: FlowState;
  
  // Actions
  refreshFlowState: () => Promise<void>;
  updateFlowStep: (step: FlowStep) => Promise<void>;
  markTriageComplete: () => Promise<void>;
  markTimelineViewed: () => Promise<void>;
}

export function useFlowEnforcement(): UseFlowEnforcementResult {
  const { user } = useAuth();
  
  const [flowState, setFlowState] = useState<FlowState>({
    caseId: null,
    flowStep: 'welcome',
    triageComplete: false,
    timelineViewed: false,
    evidenceCount: 0,
    selectedProvince: null,
    isLoading: true,
  });

  // Fetch flow state from database
  const refreshFlowState = async () => {
    if (!user) {
      setFlowState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      // Fetch profile for selected province
      const { data: profile } = await supabase
        .from('profiles')
        .select('selected_province')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch most recent case (active case)
      const { data: cases } = await supabase
        .from('cases')
        .select('id, flow_step, triage_complete, timeline_viewed')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      const activeCase = cases?.[0];

      // Fetch evidence count for active case
      let evidenceCount = 0;
      if (activeCase?.id) {
        const { count } = await supabase
          .from('evidence')
          .select('*', { count: 'exact', head: true })
          .eq('case_id', activeCase.id);
        evidenceCount = count || 0;
      }

      setFlowState({
        caseId: activeCase?.id || null,
        flowStep: (activeCase?.flow_step as FlowStep) || 'welcome',
        triageComplete: activeCase?.triage_complete || false,
        timelineViewed: activeCase?.timeline_viewed || false,
        evidenceCount,
        selectedProvince: profile?.selected_province || null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching flow state:', error);
      setFlowState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Load flow state on mount and when user changes
  useEffect(() => {
    refreshFlowState();
  }, [user?.id]);

  // Update flow step in database
  const updateFlowStep = async (step: FlowStep) => {
    if (!flowState.caseId) return;

    try {
      await supabase
        .from('cases')
        .update({ flow_step: step, updated_at: new Date().toISOString() })
        .eq('id', flowState.caseId);

      setFlowState(prev => ({ ...prev, flowStep: step }));
    } catch (error) {
      console.error('Error updating flow step:', error);
    }
  };

  // Mark triage as complete
  const markTriageComplete = async () => {
    if (!flowState.caseId) return;

    try {
      await supabase
        .from('cases')
        .update({ 
          triage_complete: true, 
          flow_step: 'evidence',
          updated_at: new Date().toISOString() 
        })
        .eq('id', flowState.caseId);

      setFlowState(prev => ({ 
        ...prev, 
        triageComplete: true,
        flowStep: 'evidence'
      }));
    } catch (error) {
      console.error('Error marking triage complete:', error);
    }
  };

  // Mark timeline as viewed
  const markTimelineViewed = async () => {
    if (!flowState.caseId) return;

    try {
      await supabase
        .from('cases')
        .update({ 
          timeline_viewed: true, 
          flow_step: 'documents',
          updated_at: new Date().toISOString() 
        })
        .eq('id', flowState.caseId);

      setFlowState(prev => ({ 
        ...prev, 
        timelineViewed: true,
        flowStep: 'documents'
      }));
    } catch (error) {
      console.error('Error marking timeline viewed:', error);
    }
  };

  // Determine current step based on state
  const currentStep = useMemo((): FlowStep => {
    // If no user, they're at welcome
    if (!user) return 'welcome';
    
    // If no case, they need to start at welcome
    if (!flowState.caseId) return 'welcome';
    
    // If no province selected, stay at welcome
    if (!flowState.selectedProvince) return 'welcome';
    
    // If triage not complete, they're at triage
    if (!flowState.triageComplete) return 'triage';
    
    // If no evidence, they're at evidence step
    if (flowState.evidenceCount === 0) return 'evidence';
    
    // If timeline not viewed, they're at timeline
    if (!flowState.timelineViewed) return 'timeline';
    
    // Otherwise they're at documents step
    return flowState.flowStep === 'complete' ? 'complete' : 'documents';
  }, [user, flowState]);

  // Check if user can access a step
  const canAccess = (step: FlowStep): boolean => {
    if (!user) return step === 'welcome';
    
    const currentIdx = STEP_ORDER.indexOf(currentStep);
    const targetIdx = STEP_ORDER.indexOf(step);
    
    // Can always go back to completed steps or current step
    return targetIdx <= currentIdx;
  };

  // Check if a step is locked
  const isLocked = (step: FlowStep): boolean => {
    return !canAccess(step);
  };

  // Check if a step is complete
  const isStepComplete = (step: FlowStep): boolean => {
    const currentIdx = STEP_ORDER.indexOf(currentStep);
    const stepIdx = STEP_ORDER.indexOf(step);
    return stepIdx < currentIdx;
  };

  // Check if a step is the current step
  const isCurrentStep = (step: FlowStep): boolean => {
    return step === currentStep;
  };

  // Get route for a step
  const getRouteForStep = (step: FlowStep): string => {
    const route = STEP_TO_ROUTE[step];
    if (flowState.caseId && (step === 'evidence' || step === 'timeline')) {
      return `${route}?caseId=${flowState.caseId}`;
    }
    return route;
  };

  // Calculate next allowed route
  const nextAllowedRoute = useMemo((): string => {
    return getRouteForStep(currentStep);
  }, [currentStep, flowState.caseId]);

  return {
    currentStep,
    stepNumber: STEP_METADATA[currentStep].number,
    totalSteps: 5,
    canAccess,
    isLocked,
    nextAllowedRoute,
    getRouteForStep,
    isStepComplete,
    isCurrentStep,
    flowState,
    refreshFlowState,
    updateFlowStep,
    markTriageComplete,
    markTimelineViewed,
  };
}

// Hook to get step from current route
export function useCurrentFlowStep(pathname: string): FlowStep | null {
  // Match route to step
  for (const [route, step] of Object.entries(ROUTE_TO_STEP)) {
    if (pathname.startsWith(route)) {
      return step;
    }
  }
  return null;
}
