import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  Circle,
  ArrowRight,
  Gift,
  MessageSquare,
  Upload,
  BookOpen,
  Loader2,
  FileText,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  User,
  Settings,
  HelpCircle,
  History,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useNextAction, NextActionType } from "@/hooks/useNextAction";
import { EvidenceHub } from "@/components/EvidenceHub";
import { BookOfDocumentsWizard } from "@/components/BookOfDocumentsWizard";
import { BookOfDocumentsPreview } from "@/components/BookOfDocumentsPreview";
import DashboardHeader from "@/components/DashboardHeader";
import { ProgramBanner } from "@/components/ProgramBanner";
import { ResumeCaseCard } from "@/components/ResumeCaseCard";
import { MeritScoreBadge } from "@/components/MeritScoreBadge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CaseData {
  id: string;
  title: string;
  status: string | null;
  merit_score: number | null;
  created_at: string;
  province: string;
  venue: string | null;
  description: string | null;
  timeline_viewed?: boolean;
  merit_score_status?: 'pending' | 'calculating' | 'complete' | 'failed';
  flow_step?: string | null;
  is_paid?: boolean;
}

interface EvidenceStats {
  total: number;
  processing: number;
  complete: number;
}

interface CaseEntitlement {
  case_id: string;
  product_id: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isFreeUser, userNumber, hasAccess } = usePremiumAccess();
  
  // Dashboard state
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [paidCases, setPaidCases] = useState<CaseEntitlement[]>([]);
  const [evidenceStats, setEvidenceStats] = useState<EvidenceStats>({ total: 0, processing: 0, complete: 0 });
  const [loading, setLoading] = useState(true);
  const [showBookWizard, setShowBookWizard] = useState(false);
  const [showBookPreview, setShowBookPreview] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  // Derived state for next action
  const nextAction = useNextAction({
    activeCase,
    evidenceStats,
    hasPaidAccess: hasAccess,
    timelineViewed: activeCase?.timeline_viewed ?? false,
    meritScoreStatus: activeCase?.merit_score_status ?? null,
  });

  // Calculate progress percentage for funnel tracking
  const progressPercent = useMemo(() => {
    if (!activeCase) return 0;
    
    let progress = 20; // Case created = 20%
    
    if (evidenceStats.total > 0) {
      progress += 20; // Evidence uploaded = +20% (40% total)
    }
    
    if (activeCase.timeline_viewed) {
      progress += 15; // Timeline viewed = +15% (55% total)
    }
    
    if (activeCase.merit_score !== null && activeCase.merit_score !== undefined) {
      progress += 10; // Merit score = +10% (65% total)
    }
    
    if (hasAccess) {
      progress += 20; // Paid = +20% (85% total)
    }
    
    // Documents generated would be 100% but we don't track that here
    return Math.min(progress, 100);
  }, [activeCase, evidenceStats.total, hasAccess]);

  // Track dashboard view
  useEffect(() => {
    if (!loading && user) {
      analytics.dashboardView(activeCase?.id, progressPercent);
      
      // Track case resumed if returning user with existing case
      if (activeCase && cases.length > 0) {
        const lastActivity = activeCase.flow_step || 'case_created';
        analytics.caseResumed(activeCase.id, lastActivity);
      }
    }
  }, [loading, user, activeCase?.id, progressPercent]);

  // Load user's cases and entitlements
  useEffect(() => {
    const loadCasesAndEntitlements = async () => {
      if (!user) return;
      
      try {
        // Load cases with flow_step and is_paid
        const { data: casesData, error: casesError } = await supabase
          .from('cases')
          .select('id, title, status, merit_score, created_at, province, venue, description, flow_step, is_paid')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (!casesError && casesData) {
          setCases(casesData);
          if (casesData.length > 0 && !activeCase) {
            setActiveCase(casesData[0]);
          }
        }

        // Load case-scoped entitlements
        const { data: entitlementData, error: entitlementError } = await supabase
          .from('entitlements')
          .select('case_id, product_id')
          .eq('user_id', user.id)
          .not('case_id', 'is', null);

        if (!entitlementError && entitlementData) {
          setPaidCases(entitlementData.filter(e => e.case_id) as CaseEntitlement[]);
        }
      } catch (error) {
        console.error('Error loading cases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCasesAndEntitlements();
  }, [user]);

  // Load evidence stats when active case changes
  useEffect(() => {
    const loadEvidenceStats = async () => {
      if (!activeCase) return;

      try {
        const { data, error } = await supabase
          .from('evidence')
          .select('id, ocr_text')
          .eq('case_id', activeCase.id);

        if (!error && data) {
          const total = data.length;
          const complete = data.filter(e => e.ocr_text && e.ocr_text.length > 0).length;
          setEvidenceStats({
            total,
            processing: total - complete,
            complete
          });
        }
      } catch (error) {
        console.error('Error loading evidence stats:', error);
      }
    };

    loadEvidenceStats();
  }, [activeCase]);

  // Handle next action click
  const handleNextAction = () => {
    if (nextAction.action === 'generate_document') {
      setShowBookWizard(true);
    } else if (nextAction.route) {
      navigate(nextAction.route);
    }
  };

  // Get icon for next action
  const getActionIcon = () => {
    switch (nextAction.icon) {
      case 'triage': return <MessageSquare className="h-6 w-6" />;
      case 'upload': return <Upload className="h-6 w-6" />;
      case 'timeline': return <CalendarIcon className="h-6 w-6" />;
      case 'loading': return <Clock className="h-6 w-6 animate-pulse" />;
      case 'payment': return <DollarSign className="h-6 w-6" />;
      case 'document': return <BookOpen className="h-6 w-6" />;
      default: return <ArrowRight className="h-6 w-6" />;
    }
  };

  // Calculate progress status
  const getProgressStatus = (step: string): 'complete' | 'current' | 'upcoming' => {
    const stepOrder = ['case', 'evidence', 'timeline', 'merit', 'payment', 'document'];
    const actionToStep: Record<NextActionType, number> = {
      'start_triage': 0,
      'upload_evidence': 1,
      'view_timeline': 2,
      'wait_merit': 3,
      'unlock_documents': 4,
      'generate_document': 5,
    };
    const currentIdx = actionToStep[nextAction.action];
    const stepIdx = stepOrder.indexOf(step);
    
    if (stepIdx < currentIdx) return 'complete';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Dashboard | Justice-Bot</title>
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      <ProgramBanner />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        {/* Your case is saved header */}
        {activeCase && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Your case is saved</h1>
            <p className="text-muted-foreground text-sm">
              {activeCase.venue || activeCase.province} • Last updated {new Date(activeCase.created_at).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* MERIT SCORE - Prominently displayed on dashboard */}
        {activeCase && activeCase.merit_score !== null && (
          <div className="mb-6">
            <MeritScoreBadge 
              score={activeCase.merit_score} 
              showExplanation={true}
              compact={false}
            />
          </div>
        )}

        {/* Progress indicator with percentage */}
        {activeCase && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">You're {progressPercent}% prepared</span>
              <span className="text-xs text-muted-foreground">{progressPercent < 100 ? 'Keep going!' : 'Ready to file'}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Checklist */}
        {activeCase && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preparation Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Upload evidence */}
              <div className="flex items-center gap-3">
                {evidenceStats.total > 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={evidenceStats.total > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                  Upload evidence
                </span>
                {evidenceStats.total > 0 && (
                  <Badge variant="outline" className="ml-auto">{evidenceStats.total} files</Badge>
                )}
              </div>
              
              {/* Review timeline */}
              <div className="flex items-center gap-3">
                {activeCase.timeline_viewed ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={activeCase.timeline_viewed ? 'text-foreground' : 'text-muted-foreground'}>
                  Review timeline
                </span>
              </div>
              
              {/* Generate forms (locked) */}
              <div className="flex items-center gap-3">
                {hasAccess ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={hasAccess ? 'text-foreground' : 'text-muted-foreground'}>
                  Generate forms {!hasAccess && <span className="text-xs">(locked)</span>}
                </span>
              </div>
              
              {/* Prepare for filing (locked) */}
              <div className="flex items-center gap-3">
                {hasAccess ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={hasAccess ? 'text-foreground' : 'text-muted-foreground'}>
                  Export Book of Documents {!hasAccess && <span className="text-xs">(locked)</span>}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Free user badge */}
        {isFreeUser && userNumber && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 inline-flex items-center gap-2">
            <Gift className="w-4 h-4 text-green-700 dark:text-green-300" />
            <Badge variant="outline" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
              FREE User #{userNumber}
            </Badge>
            <span className="text-sm text-green-600 dark:text-green-400">Lifetime free access!</span>
          </div>
        )}

        {/* Case selector (if multiple cases) */}
        {cases.length > 1 && (
          <div className="mb-4">
            <select 
              className="p-2 border rounded-md bg-background text-sm w-full"
              value={activeCase?.id || ''}
              onChange={(e) => {
                const selected = cases.find(c => c.id === e.target.value);
                if (selected) setActiveCase(selected);
              }}
            >
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* ============================================ */}
        {/* ABOVE THE FOLD: Show Resume Card OR Next Action */}
        {/* ============================================ */}
        {(() => {
          // Check if active case has a paid entitlement
          const activeCasePaid = activeCase && paidCases.some(e => e.case_id === activeCase.id);
          
          if (activeCasePaid && activeCase) {
            // Show Resume Case card for paid cases - NO pricing, NO upsells
            return (
              <div className="mb-6">
                <ResumeCaseCard
                  caseId={activeCase.id}
                  caseTitle={activeCase.title}
                  flowStep={activeCase.flow_step || null}
                  evidenceCount={evidenceStats.total}
                  province={activeCase.province}
                />
              </div>
            );
          }
          
          // Default: Show regular next action card for unpaid cases
          return (
            <Card className="mb-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/10 shadow-lg">
              <CardContent className="pt-6 pb-8">
                {/* Status indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {activeCase ? 'Case in progress' : 'Ready to start'}
                  </span>
                  {activeCase && (
                    <span className="text-sm text-muted-foreground">
                      • {activeCase.venue || activeCase.province}
                    </span>
                  )}
                </div>

                {/* Next step title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {getActionIcon()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Your next step:</p>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      {nextAction.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {nextAction.description}
                    </p>
                  </div>
                </div>

                {/* PRIMARY CTA - Full width, high contrast */}
                <Button 
                  onClick={handleNextAction}
                  size="lg" 
                  className="w-full text-lg py-6 gap-3"
                  disabled={nextAction.action === 'wait_merit'}
                >
                  {nextAction.ctaText}
                  <ArrowRight className="h-5 w-5" />
                </Button>

                {/* Reassurance text */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {nextAction.reassurance}
                </p>
              </CardContent>
            </Card>
          );
        })()}

        {/* ============================================ */}
        {/* SECONDARY: Case Progress (Collapsed)        */}
        {/* Read-only status indicators - NO actions    */}
        {/* ============================================ */}
        <Collapsible open={progressOpen} onOpenChange={setProgressOpen} className="mb-4">
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Circle className="h-4 w-4" />
                    Case Progress
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {activeCase ? 'In Progress' : 'Not Started'}
                    </span>
                    {progressOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Case created */}
                  <div className="flex items-center gap-3">
                    {getProgressStatus('case') === 'complete' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={getProgressStatus('case') === 'complete' ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}>
                      Case created
                    </span>
                    {activeCase && (
                      <Badge variant="outline" className="ml-auto">{activeCase.province}</Badge>
                    )}
                  </div>

                  {/* Evidence status */}
                  <div className="flex items-center gap-3">
                    {getProgressStatus('evidence') === 'complete' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : getProgressStatus('evidence') === 'current' ? (
                      <Circle className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={getProgressStatus('evidence') === 'complete' ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}>
                      Evidence uploaded
                    </span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {evidenceStats.total > 0 ? `${evidenceStats.complete}/${evidenceStats.total} processed` : 'None'}
                    </span>
                  </div>

                  {/* Merit score */}
                  <div className="flex items-center gap-3">
                    {activeCase?.merit_score !== null && activeCase?.merit_score !== undefined ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={activeCase?.merit_score !== null && activeCase?.merit_score !== undefined ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}>
                      Case strength
                    </span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {activeCase?.merit_score !== null && activeCase?.merit_score !== undefined ? `${activeCase.merit_score}%` : 'Pending'}
                    </span>
                  </div>

                  {/* Documents */}
                  <div className="flex items-center gap-3">
                    {hasAccess ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={hasAccess ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}>
                      Documents
                    </span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {hasAccess ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* ============================================ */}
        {/* TERTIARY: Other Tools (Accordion - hidden)  */}
        {/* Must scroll/expand to see                   */}
        {/* ============================================ */}
        <Collapsible open={toolsOpen} onOpenChange={setToolsOpen} className="mb-6">
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Other Tools
                  </CardTitle>
                  {toolsOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid gap-2">
                  {/* Book of Documents - Quick Access (always visible if case exists) */}
                  {activeCase && (
                    <Button 
                      variant="ghost" 
                      className="justify-start gap-3 h-auto py-3 border border-primary/20 bg-primary/5 hover:bg-primary/10"
                      onClick={() => setShowBookPreview(true)}
                    >
                      <BookOpen className="h-4 w-4 text-primary" />
                      <div className="text-left flex-1">
                        <div className="font-medium">View Book of Documents</div>
                        <div className="text-xs text-muted-foreground">
                          {evidenceStats.total} evidence item{evidenceStats.total !== 1 ? 's' : ''} compiled
                        </div>
                      </div>
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3 h-auto py-3"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Profile</div>
                      <div className="text-xs text-muted-foreground">View and edit your profile</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3 h-auto py-3"
                    onClick={() => navigate('/forms')}
                  >
                    <FileText className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Forms Library</div>
                      <div className="text-xs text-muted-foreground">Browse available legal forms</div>
                    </div>
                  </Button>

                  {cases.length > 0 && (
                    <Button 
                      variant="ghost" 
                      className="justify-start gap-3 h-auto py-3"
                      onClick={() => navigate('/cases')}
                    >
                      <History className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Past Cases</div>
                        <div className="text-xs text-muted-foreground">View and manage all cases</div>
                      </div>
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3 h-auto py-3"
                    onClick={() => navigate('/faq')}
                  >
                    <HelpCircle className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Help & FAQ</div>
                      <div className="text-xs text-muted-foreground">Get answers to common questions</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Book of Documents Preview (quick view - free to view, download paywalled) */}
        {activeCase && (
          <BookOfDocumentsPreview
            caseId={activeCase.id}
            caseTitle={activeCase.title}
            open={showBookPreview}
            onOpenChange={setShowBookPreview}
            onOpenFullWizard={() => setShowBookWizard(true)}
          />
        )}

        {/* Book of Documents Wizard (full customization - modal) */}
        {activeCase && (
          <BookOfDocumentsWizard 
            caseId={activeCase.id} 
            open={showBookWizard}
            onOpenChange={setShowBookWizard}
          />
        )}
      </main>

      {/* Minimal footer - just legal links */}
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <a href="/terms" className="hover:underline">Terms</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/disclaimer" className="hover:underline">Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Dashboard;
