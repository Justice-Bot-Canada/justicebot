import { useState, useEffect } from "react";
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
  BarChart3,
  BookOpen,
  Loader2,
  FileText,
  Calendar as CalendarIcon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { EvidenceHub } from "@/components/EvidenceHub";
import { BookOfDocumentsWizard } from "@/components/BookOfDocumentsWizard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LegalChatbot } from "@/components/LegalChatbot";
import { FormsList } from "@/components/FormsList";
import { DeadlineWidget } from "@/components/DeadlineWidget";
import CaseCalendar from "@/components/CaseCalendar";
import CaseManager from "@/components/CaseManager";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

// Progress steps for the guided workflow
type ProgressStep = 'intake' | 'evidence' | 'summarized' | 'book';

interface CaseData {
  id: string;
  title: string;
  status: string | null;
  merit_score: number | null;
  created_at: string;
  province: string;
  venue: string | null;
  description: string | null;
}

interface EvidenceStats {
  total: number;
  processing: number;
  complete: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isFreeUser, userNumber, hasAccess } = usePremiumAccess();
  
  // Dashboard state
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [evidenceStats, setEvidenceStats] = useState<EvidenceStats>({ total: 0, processing: 0, complete: 0 });
  const [loading, setLoading] = useState(true);
  const [showBookWizard, setShowBookWizard] = useState(false);
  const [bookGenerated, setBookGenerated] = useState(false);

  // Load user's cases
  useEffect(() => {
    const loadCases = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('id, title, status, merit_score, created_at, province, venue, description')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (!error && data) {
          setCases(data);
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
    if (evidenceStats.processing > 0 || evidenceStats.complete === 0) return 'summarized';
    if (!bookGenerated) return 'book';
    return 'book';
  };

  const currentStep = getCurrentStep();
  
  const progressSteps: { key: ProgressStep; label: string; description: string }[] = [
    { key: 'intake', label: 'Situation Identified', description: 'Complete triage to understand your legal pathway' },
    { key: 'evidence', label: 'Evidence Uploaded', description: 'Upload your documents and evidence' },
    { key: 'summarized', label: 'Evidence Summarized', description: 'AI processes and summarizes your documents' },
    { key: 'book', label: 'Book of Documents Generated', description: 'Generate your court-ready exhibit book' },
  ];

  const getStepStatus = (stepKey: ProgressStep): 'complete' | 'current' | 'upcoming' => {
    const stepOrder: ProgressStep[] = ['intake', 'evidence', 'summarized', 'book'];
    const currentIdx = stepOrder.indexOf(currentStep);
    const stepIdx = stepOrder.indexOf(stepKey);
    
    if (stepIdx < currentIdx) return 'complete';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  const getProgressPercentage = (): number => {
    const stepOrder: ProgressStep[] = ['intake', 'evidence', 'summarized', 'book'];
    const currentIdx = stepOrder.indexOf(currentStep);
    return ((currentIdx) / (stepOrder.length - 1)) * 100;
  };

  const handleStepClick = (stepKey: ProgressStep) => {
    switch (stepKey) {
      case 'intake':
        navigate('/triage');
        break;
      case 'evidence':
      case 'summarized':
        // Scroll to evidence section or navigate
        break;
      case 'book':
        if (evidenceStats.complete >= 1) {
          setShowBookWizard(true);
        }
        break;
    }
  };

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

  // No case yet - show simplified start view
  if (cases.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Justice-Bot</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Start by telling us about your legal situation. We'll help you understand the right pathway and what to do next.
            </p>
            <Button size="lg" onClick={() => navigate('/triage')} className="gap-2">
              <MessageSquare className="h-5 w-5" />
              Start AI Triage
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            {isFreeUser && userNumber && (
              <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 inline-flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-700 dark:text-green-300" />
                <Badge variant="outline" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                  FREE User #{userNumber}
                </Badge>
                <span className="text-sm text-green-600 dark:text-green-400">Lifetime free access!</span>
              </div>
            )}
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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">Your Case Progress</h1>
            {cases.length > 1 && (
              <select 
                className="p-2 border rounded-md bg-background text-sm"
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
            )}
          </div>
          {activeCase && (
            <p className="text-muted-foreground">
              {activeCase.venue || 'Legal matter'} • {activeCase.province}
            </p>
          )}
          
          {isFreeUser && userNumber && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 inline-flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-700 dark:text-green-300" />
              <Badge variant="outline" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                FREE User #{userNumber}
              </Badge>
            </div>
          )}
        </div>

        {/* Progress Tracker - Linear Steps */}
        <Card className="mb-8 border-primary/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Case Progress</CardTitle>
              <span className="text-sm text-muted-foreground">{Math.round(getProgressPercentage())}% Complete</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={getProgressPercentage()} className="h-2 mb-6" />
            
            <div className="space-y-3">
              {progressSteps.map((step, idx) => {
                const status = getStepStatus(step.key);
                const isClickable = status === 'current' || status === 'complete';
                
                return (
                  <button
                    key={step.key}
                    onClick={() => isClickable && handleStepClick(step.key)}
                    disabled={!isClickable}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors ${
                      status === 'complete' 
                        ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' 
                        : status === 'current'
                        ? 'bg-primary/5 border-primary/30 ring-2 ring-primary/20'
                        : 'bg-muted/30 border-border opacity-60'
                    } ${isClickable ? 'cursor-pointer hover:border-primary/50' : 'cursor-not-allowed'}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      status === 'complete' 
                        ? 'bg-green-600 text-white' 
                        : status === 'current'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {status === 'complete' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${status === 'complete' ? 'text-green-700 dark:text-green-300' : ''}`}>
                        {step.label}
                        {status === 'complete' && ' ✓'}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {status === 'current' && (
                      <ArrowRight className="h-5 w-5 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Evidence Section */}
        {activeCase && (
          <div className="space-y-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Evidence & Documents
                </CardTitle>
                <CardDescription>
                  {evidenceStats.total > 0 
                    ? `${evidenceStats.complete} of ${evidenceStats.total} documents processed`
                    : 'Upload your evidence to build your case'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EvidenceHub 
                  caseId={activeCase.id} 
                  caseDescription={activeCase.description || activeCase.title}
                  caseType={activeCase.venue || undefined}
                  onBuildBook={() => setShowBookWizard(true)}
                />
              </CardContent>
            </Card>
            
            {/* Book of Documents CTA */}
            {evidenceStats.complete >= 1 && (
              <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Generate Court-Ready Book (PDF)
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-lg">
                        Your Book of Documents includes a cover page, table of contents, properly labeled exhibits, and sequential page numbering — the format tribunals expect.
                      </p>
                    </div>
                    <Button onClick={() => setShowBookWizard(true)} size="lg" className="gap-2 whitespace-nowrap">
                      Generate Book
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <BookOfDocumentsWizard 
              caseId={activeCase.id} 
              open={showBookWizard}
              onOpenChange={setShowBookWizard}
            />
          </div>
        )}

        {/* Quick Actions Row */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/triage')}>
            <CardContent className="pt-6">
              <MessageSquare className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-1">AI Legal Chat</h4>
              <p className="text-sm text-muted-foreground">Get guidance on your situation</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-1">Forms Library</h4>
              <p className="text-sm text-muted-foreground">Find the right forms for your case</p>
              <Link to="/forms" className="text-primary text-sm hover:underline mt-2 inline-block">
                Browse forms →
              </Link>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <CalendarIcon className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-1">Deadlines</h4>
              <p className="text-sm text-muted-foreground">Track important dates</p>
              {activeCase && (
                <div className="mt-3">
                  <DeadlineWidget />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Case Management Link */}
        {cases.length > 0 && (
          <div className="text-center">
            <Link to="/cases" className="text-primary hover:underline text-sm">
              Manage all cases →
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
