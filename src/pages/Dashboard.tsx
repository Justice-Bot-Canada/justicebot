import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Scale, 
  FileText, 
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Gift,
  MessageSquare,
  Upload,
  BarChart3,
  BookOpen,
  Calendar,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import CaseManager from "@/components/CaseManager";
import CaseCalendar from "@/components/CaseCalendar";
import { DocumentAnalyzer } from "@/components/DocumentAnalyzer";
import { EvidenceHub } from "@/components/EvidenceHub";
import { BookOfDocumentsWizard } from "@/components/BookOfDocumentsWizard";
import CaseProgressTracker from "@/components/CaseProgressTracker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LegalChatbot } from "@/components/LegalChatbot";
import { FormsList } from "@/components/FormsList";
import { DeadlineWidget } from "@/components/DeadlineWidget";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

// Progress steps for the guided workflow
type ProgressStep = 'intake' | 'evidence' | 'processing' | 'merit' | 'forms' | 'generate';

interface CaseData {
  id: string;
  title: string;
  status: string | null;
  merit_score: number | null;
  created_at: string;
  province: string;
  venue: string | null;
}

interface EvidenceStats {
  total: number;
  processing: number;
  complete: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { hasAccess, isFreeUser, userNumber } = usePremiumAccess();
  
  // Dashboard state
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [evidenceStats, setEvidenceStats] = useState<EvidenceStats>({ total: 0, processing: 0, complete: 0 });
  const [loading, setLoading] = useState(true);
  const [showBookWizard, setShowBookWizard] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'triage' | 'evidence' | 'forms' | 'calendar' | 'cases'>('overview');

  // Load user's cases
  useEffect(() => {
    const loadCases = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('id, title, status, merit_score, created_at, province, venue')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (!error && data) {
          setCases(data);
          // Set active case to most recent
          if (data.length > 0 && !activeCase) {
            setActiveCase(data[0]);
          }
        }
      } catch (error) {
        console.error('Error loading cases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
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

  // Calculate current progress step
  const getCurrentStep = (): ProgressStep => {
    if (!activeCase) return 'intake';
    if (evidenceStats.total === 0) return 'evidence';
    if (evidenceStats.processing > 0) return 'processing';
    if (!activeCase.merit_score) return 'merit';
    return 'forms';
  };

  const getProgressPercentage = (): number => {
    const step = getCurrentStep();
    const steps: ProgressStep[] = ['intake', 'evidence', 'processing', 'merit', 'forms', 'generate'];
    return ((steps.indexOf(step) + 1) / steps.length) * 100;
  };

  const getNextAction = () => {
    const step = getCurrentStep();
    switch (step) {
      case 'intake':
        return { label: 'Start AI Triage', action: () => setActiveView('triage'), icon: MessageSquare };
      case 'evidence':
        return { label: 'Upload Evidence', action: () => setActiveView('evidence'), icon: Upload };
      case 'processing':
        return { label: 'View Processing Status', action: () => setActiveView('evidence'), icon: Clock };
      case 'merit':
        return { label: 'Get Merit Score', action: () => setActiveView('triage'), icon: BarChart3 };
      case 'forms':
        return { label: 'View Recommended Forms', action: () => setActiveView('forms'), icon: FileText };
      default:
        return { label: 'Build Book of Documents', action: () => setShowBookWizard(true), icon: BookOpen };
    }
  };

  const nextAction = getNextAction();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {cases.length > 0 ? 'Your Legal Workspace' : 'Welcome to Justice-Bot'}
          </h1>
          <p className="text-muted-foreground">
            {cases.length > 0 
              ? 'Continue working on your case or start a new one'
              : 'Start by telling us about your legal situation'}
          </p>
          
          {isFreeUser && userNumber && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 inline-flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-700 dark:text-green-300" />
              <Badge variant="outline" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                FREE User #{userNumber}
              </Badge>
              <span className="text-sm text-green-600 dark:text-green-400">Lifetime free access!</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          {[
            { key: 'overview', label: 'Overview', icon: Scale },
            { key: 'triage', label: 'AI Triage', icon: MessageSquare },
            { key: 'evidence', label: 'Documents', icon: FileText },
            { key: 'forms', label: 'Forms', icon: FileText },
            { key: 'calendar', label: 'Calendar', icon: Calendar },
            { key: 'cases', label: 'My Cases', icon: Scale },
          ].map(tab => (
            <Button
              key={tab.key}
              variant={activeView === tab.key ? 'default' : 'ghost'}
              onClick={() => setActiveView(tab.key as typeof activeView)}
              className="gap-2"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Overview View - Main Dashboard */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Case Selector (if multiple cases) */}
            {cases.length > 1 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Active Case</CardTitle>
                </CardHeader>
                <CardContent>
                  <select 
                    className="w-full p-2 border rounded-md bg-background"
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
                </CardContent>
              </Card>
            )}

            {/* Progress Tracker */}
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {activeCase ? activeCase.title : 'Start Your Case'}
                    </CardTitle>
                    <CardDescription>
                      {activeCase 
                        ? `${activeCase.venue || 'Legal matter'} • ${activeCase.province}`
                        : 'No case created yet'}
                    </CardDescription>
                  </div>
                  {activeCase && (
                    <Badge variant={activeCase.status === 'active' ? 'default' : 'secondary'}>
                      {activeCase.status || 'In Progress'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress Steps */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{Math.round(getProgressPercentage())}%</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
                  {[
                    { key: 'intake', label: 'Intake', icon: MessageSquare },
                    { key: 'evidence', label: 'Evidence', icon: Upload },
                    { key: 'processing', label: 'Processing', icon: Clock },
                    { key: 'merit', label: 'Merit Score', icon: BarChart3 },
                    { key: 'forms', label: 'Forms', icon: FileText },
                    { key: 'generate', label: 'Generate', icon: BookOpen },
                  ].map((step, idx) => {
                    const currentIdx = ['intake', 'evidence', 'processing', 'merit', 'forms', 'generate'].indexOf(getCurrentStep());
                    const isComplete = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    
                    return (
                      <div 
                        key={step.key}
                        className={`p-2 rounded-lg text-center text-xs ${
                          isComplete ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          isCurrent ? 'bg-primary/10 text-primary border border-primary/30' :
                          'bg-muted text-muted-foreground'
                        }`}
                      >
                        <step.icon className="h-4 w-4 mx-auto mb-1" />
                        <span>{step.label}</span>
                        {isComplete && <CheckCircle className="h-3 w-3 mx-auto mt-1" />}
                      </div>
                    );
                  })}
                </div>

                {/* Continue Action Card */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">What's Next?</h4>
                      <p className="text-sm text-muted-foreground">{nextAction.label}</p>
                    </div>
                    <Button onClick={nextAction.action} className="gap-2">
                      <nextAction.icon className="h-4 w-4" />
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Evidence Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Evidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {evidenceStats.total > 0 ? (
                    <div>
                      <div className="text-2xl font-bold">{evidenceStats.total}</div>
                      <p className="text-xs text-muted-foreground">
                        {evidenceStats.complete} processed • {evidenceStats.processing} pending
                      </p>
                      {evidenceStats.processing > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing documents...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No evidence uploaded yet
                      <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setActiveView('evidence')}>
                        Upload now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Merit Score */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Merit Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeCase?.merit_score ? (
                    <div>
                      <div className="text-2xl font-bold">{activeCase.merit_score}/100</div>
                      <p className="text-xs text-muted-foreground">
                        {activeCase.merit_score >= 70 ? 'Strong case' : activeCase.merit_score >= 50 ? 'Moderate strength' : 'Needs work'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      Not yet calculated
                      <p className="text-xs">Complete triage to get your score</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Deadlines */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Check the Calendar tab for deadlines
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Book of Documents CTA (if ready) */}
            {activeCase && evidenceStats.complete >= 3 && (
              <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Ready to Build Your Book of Documents
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You have {evidenceStats.complete} documents ready. Generate a professionally formatted exhibit book.
                      </p>
                    </div>
                    <Button onClick={() => setShowBookWizard(true)} size="lg">
                      Build Now <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Triage View */}
        {activeView === 'triage' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Legal Assistant
              </CardTitle>
              <CardDescription>
                Describe your legal situation and get personalized guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LegalChatbot />
            </CardContent>
          </Card>
        )}

        {/* Evidence View */}
        {activeView === 'evidence' && (
          <div className="space-y-6">
            {activeCase ? (
              <>
                <EvidenceHub caseId={activeCase.id} />
                
                <Card className="border-primary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Book of Documents Wizard
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Generate a court-ready exhibit book
                        </p>
                      </div>
                      <Button onClick={() => setShowBookWizard(true)}>
                        Build Book <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <BookOfDocumentsWizard 
                  caseId={activeCase.id} 
                  open={showBookWizard}
                  onOpenChange={setShowBookWizard}
                />
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-2 font-medium">No case selected</p>
                  <p className="text-sm">Start with AI Triage to create a case first.</p>
                  <Button className="mt-4" onClick={() => setActiveView('triage')}>
                    Start AI Triage
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Forms View */}
        {activeView === 'forms' && <FormsList />}

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div className="space-y-6">
            <DeadlineWidget />
            {activeCase ? (
              <CaseCalendar caseId={activeCase.id} />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Create a case to track deadlines</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Cases View */}
        {activeView === 'cases' && (
          <CaseManager onCaseSelect={(id) => {
            const selected = cases.find(c => c.id === id);
            if (selected) {
              setActiveCase(selected);
              setActiveView('overview');
            }
          }} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
