import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";
import { analytics } from "@/utils/analytics";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresCase?: boolean;
  flowStep?: 'triage' | 'evidence' | 'timeline' | 'documents' | 'forms' | 'generate';
  requiresMeritScore?: boolean;
  requiresPayment?: boolean;
}

/**
 * FUNNEL GUARDRAILS - DO NOT TOUCH
 * 
 * Routes that require flow enforcement and their requirements:
 * - /triage: requires province
 * - /evidence: requires triage_complete
 * - /case-timeline: requires evidence_uploaded
 * - /dashboard: requires triage_complete
 * - /forms: requires merit_score_generated
 * - /generate: requires ALL (triage + evidence + merit + payment)
 */
const FLOW_ROUTES: Record<string, {
  step: 'triage' | 'evidence' | 'timeline' | 'documents' | 'forms' | 'generate';
  requiresMeritScore?: boolean;
  requiresPayment?: boolean;
}> = {
  '/triage': { step: 'triage' },
  '/evidence': { step: 'evidence' },
  '/case-timeline': { step: 'timeline' },
  '/dashboard': { step: 'documents' },
  '/forms': { step: 'forms', requiresMeritScore: true },
  '/form-selector': { step: 'forms', requiresMeritScore: true },
  '/smart-documents': { step: 'generate', requiresMeritScore: true, requiresPayment: true },
  '/generate': { step: 'generate', requiresMeritScore: true, requiresPayment: true },
};

interface FlowState {
  hasCase: boolean;
  hasProvince: boolean;
  triageComplete: boolean;
  evidenceCount: number;
  timelineViewed: boolean;
  meritScoreGenerated: boolean;
  meritScore: number | null;
  accessUnlocked: boolean;
  caseId: string | null;
  flowStep: string | null;
  venue: string | null;
}

const ProtectedRoute = ({ 
  children, 
  requiresCase, 
  flowStep,
  requiresMeritScore,
  requiresPayment,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [flowState, setFlowState] = useState<FlowState | null>(null);
  const [checkingFlow, setCheckingFlow] = useState(true);

  // Determine which flow step this route requires
  const routeConfig = FLOW_ROUTES[location.pathname];
  const requiredStep = flowStep || routeConfig?.step;
  const needsMeritScore = requiresMeritScore ?? routeConfig?.requiresMeritScore ?? false;
  const needsPayment = requiresPayment ?? routeConfig?.requiresPayment ?? false;

  // Check flow state when user is authenticated
  useEffect(() => {
    const checkFlowState = async () => {
      if (!user) {
        setCheckingFlow(false);
        return;
      }

      // Skip flow enforcement for non-flow routes
      if (!requiredStep && !needsMeritScore && !needsPayment) {
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
          .select('id, flow_step, triage_complete, timeline_viewed, province, venue, merit_score, is_paid')
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

        // Check for paid entitlements
        // NOTE: This must stay aligned with server-side paywall logic (check-access).
        // Stripe subscriptions and one-time products are often stored as Stripe IDs (e.g. price_123).
        let hasAccess = activeCase?.is_paid === true;
        if (!hasAccess && user.id) {
          const { data: entitlements } = await supabase
            .from('entitlements')
            .select('product_id, ends_at')
            .eq('user_id', user.id);
          
          if (entitlements && entitlements.length > 0) {
            hasAccess = entitlements.some(e => {
              if (e.ends_at && new Date(e.ends_at) < new Date()) {
                return false;
              }
              // Stripe IDs
              if (e.product_id?.startsWith('price_')) {
                return true;
              }
              return e.product_id?.toLowerCase().includes('monthly') ||
                     e.product_id?.toLowerCase().includes('yearly') ||
                     e.product_id?.toLowerCase().includes('premium') ||
                     e.product_id?.toLowerCase().includes('professional') ||
                     e.product_id?.toLowerCase().includes('basic');
            });
          }
        }

        setFlowState({
          hasCase: !!activeCase,
          hasProvince: !!(profile?.selected_province || activeCase?.province),
          triageComplete: activeCase?.triage_complete || false,
          evidenceCount,
          timelineViewed: activeCase?.timeline_viewed || false,
          meritScoreGenerated: activeCase?.merit_score !== null && activeCase?.merit_score !== undefined,
          meritScore: activeCase?.merit_score || null,
          accessUnlocked: hasAccess,
          caseId: activeCase?.id || null,
          flowStep: activeCase?.flow_step || null,
          venue: activeCase?.venue || null,
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
  }, [user, loading, requiredStep, needsMeritScore, needsPayment]);

  // Show loading while checking auth
  if (loading || (user && checkingFlow && (requiredStep || needsMeritScore || needsPayment))) {
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
  if ((requiredStep || needsMeritScore || needsPayment) && flowState) {
    let redirectTo: string | null = null;
    let message: string | null = null;

    // GUARDRAIL 1: Province required for all flow routes
    if (!flowState.hasProvince) {
      redirectTo = '/welcome';
      message = 'Please select your province first';
    }
    // GUARDRAIL 2: Triage required for all routes beyond triage
    else if (requiredStep !== 'triage' && !flowState.triageComplete) {
      redirectTo = '/triage';
      message = 'Please complete the AI triage first';
    }
    // GUARDRAIL 3: Evidence required for timeline/forms/generate
    else if ((requiredStep === 'timeline' || requiredStep === 'forms' || requiredStep === 'generate') && 
             flowState.evidenceCount === 0) {
      redirectTo = flowState.caseId 
        ? `/evidence?caseId=${flowState.caseId}` 
        : '/evidence';
      message = 'Please upload at least one piece of evidence';
    }
    // GUARDRAIL 4: Merit score required for forms/generate (NON-OPTIONAL)
    else if ((needsMeritScore || requiredStep === 'forms' || requiredStep === 'generate') && 
             !flowState.meritScoreGenerated) {
      // Fire paywall_triggered for analytics
      analytics.paywallTriggered('merit_score_required', flowState.caseId || undefined, flowState.venue || undefined);
      
      redirectTo = '/dashboard';
      message = 'Your case strength must be calculated first';
    }
    // GUARDRAIL 5: Payment required for document generation (DO NOT SOFTEN)
    else if ((needsPayment || requiredStep === 'generate') && !flowState.accessUnlocked) {
      // Fire paywall_triggered for analytics
      analytics.paywallTriggered('payment_required', flowState.caseId || undefined, flowState.venue || undefined);
      
      redirectTo = '/pricing';
      message = 'Please unlock premium features to generate documents';
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
