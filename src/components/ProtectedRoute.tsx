import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresCase?: boolean;
  flowStep?: 'triage' | 'evidence' | 'timeline' | 'documents';
}

// Routes that require flow enforcement
const FLOW_ROUTES: Record<string, 'triage' | 'evidence' | 'timeline' | 'documents'> = {
  '/triage': 'triage',
  '/evidence': 'evidence',
  '/case-timeline': 'timeline',
  '/dashboard': 'documents',
};

interface FlowState {
  hasCase: boolean;
  hasProvince: boolean;
  triageComplete: boolean;
  evidenceCount: number;
  timelineViewed: boolean;
  caseId: string | null;
  flowStep: string | null;
}

const ProtectedRoute = ({ children, requiresCase, flowStep }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [flowState, setFlowState] = useState<FlowState | null>(null);
  const [checkingFlow, setCheckingFlow] = useState(true);

  // Determine which flow step this route requires
  const requiredStep = flowStep || FLOW_ROUTES[location.pathname];

  // Check flow state when user is authenticated
  useEffect(() => {
    const checkFlowState = async () => {
      if (!user) {
        setCheckingFlow(false);
        return;
      }

      // Skip flow enforcement for non-flow routes
      if (!requiredStep) {
        setCheckingFlow(false);
        return;
      }

      try {
        // Check profile for province
        const { data: profile } = await supabase
          .from('profiles')
          .select('selected_province')
          .eq('user_id', user.id)
          .maybeSingle();

        // Check for active case
        const { data: cases } = await supabase
          .from('cases')
          .select('id, flow_step, triage_complete, timeline_viewed, province')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);

        const activeCase = cases?.[0];
        
        // Get evidence count if case exists
        let evidenceCount = 0;
        if (activeCase?.id) {
          const { count } = await supabase
            .from('evidence')
            .select('*', { count: 'exact', head: true })
            .eq('case_id', activeCase.id);
          evidenceCount = count || 0;
        }

        setFlowState({
          hasCase: !!activeCase,
          hasProvince: !!(profile?.selected_province || activeCase?.province),
          triageComplete: activeCase?.triage_complete || false,
          evidenceCount,
          timelineViewed: activeCase?.timeline_viewed || false,
          caseId: activeCase?.id || null,
          flowStep: activeCase?.flow_step || null,
        });
      } catch (error) {
        console.error('Error checking flow state:', error);
      } finally {
        setCheckingFlow(false);
      }
    };

    if (!loading) {
      checkFlowState();
    }
  }, [user, loading, requiredStep]);

  // Show loading while checking auth
  if (loading || (user && checkingFlow && requiredStep)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to welcome
  if (!user) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  // Flow enforcement for flow routes
  if (requiredStep && flowState) {
    let redirectTo: string | null = null;
    let message: string | null = null;

    switch (requiredStep) {
      case 'triage':
        // Triage requires province selection
        if (!flowState.hasProvince) {
          redirectTo = '/welcome';
          message = 'Please select your province first';
        }
        break;

      case 'evidence':
        // Evidence requires triage complete
        if (!flowState.hasProvince) {
          redirectTo = '/welcome';
          message = 'Please select your province first';
        } else if (!flowState.triageComplete) {
          redirectTo = '/triage';
          message = 'Please complete the AI triage first';
        }
        break;

      case 'timeline':
        // Timeline requires at least one piece of evidence
        if (!flowState.hasProvince) {
          redirectTo = '/welcome';
          message = 'Please select your province first';
        } else if (!flowState.triageComplete) {
          redirectTo = '/triage';
          message = 'Please complete the AI triage first';
        } else if (flowState.evidenceCount === 0) {
          redirectTo = flowState.caseId 
            ? `/evidence?caseId=${flowState.caseId}` 
            : '/evidence';
          message = 'Please upload at least one piece of evidence';
        }
        break;

      case 'documents':
        // Documents (dashboard) requires timeline viewed
        // But we allow some flexibility here for returning users
        if (!flowState.hasCase && !flowState.hasProvince) {
          redirectTo = '/welcome';
          message = 'Please start by creating a case';
        }
        // Note: We don't strictly enforce all steps for dashboard
        // as users may need to access it for various reasons
        break;
    }

    if (redirectTo) {
      if (message) {
        toast.info(message);
      }
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Case requirement check (for routes that need a case ID)
  if (requiresCase && flowState && !flowState.caseId) {
    toast.info('Please start a case first');
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
