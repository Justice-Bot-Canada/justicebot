import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FlowHeader } from "@/components/FlowHeader";
import { FlowProgressIndicator } from "@/components/FlowProgressIndicator";
import { ProgramBanner, useShouldHidePricing } from "@/components/ProgramBanner";
import SEOHead from "@/components/SEOHead";
import { EvidenceHub } from "@/components/EvidenceHub";
import { CaseAnalysisResults } from "@/components/CaseAnalysisResults";
import { Card, CardContent } from "@/components/ui/card";
import { BookOfDocumentsWizard } from "@/components/BookOfDocumentsWizard";
import { BookOfDocsPaywall } from "@/components/paywalls";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useCasePipeline } from "@/hooks/useCasePipeline";
import { MeritStatusTracker } from "@/components/MeritStatusTracker";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, analytics } from "@/utils/analytics";
import { useProgram } from "@/contexts/ProgramContext";

const BOOK_DOCS_PRODUCT_KEY = "book_docs_generator";

// Strict UUID validation (version 1-5, variant 8/9/a/b)
const isValidUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

/**
 * Case-scoped Evidence page: /case/:caseId/evidence
 * This route ensures caseId is in the URL path, not query params.
 */
const CaseEvidence = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, isFreeUser, tier } = usePremiumAccess();
  const { program, isProgramMode } = useProgram();
  const shouldHidePricing = useShouldHidePricing();
  
  const [caseData, setCaseData] = useState<any>(null);
  const [bookWizardOpen, setBookWizardOpen] = useState(false);
  const [showBookPaywall, setShowBookPaywall] = useState(false);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [hasBookEntitlement, setHasBookEntitlement] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  const isPremium = hasAccess && (tier === 'monthly' || tier === 'yearly');
  const { runPipeline, result: pipelineResult, loading: pipelineLoading } = useCasePipeline();

  // Validate caseId immediately - no DB calls for invalid UUIDs
  useEffect(() => {
    if (!caseId || !isValidUUID(caseId)) {
      setAccessError("Invalid case ID. Please start a new assessment.");
      return;
    }
    if (!user) {
      navigate("/welcome");
      return;
    }
    loadCaseData();
    loadEvidenceCount();
    checkBookEntitlement();
  }, [caseId, user]);

  const loadCaseData = async () => {
    if (!caseId || !isValidUUID(caseId)) return;
    
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          setAccessError("This case doesn't exist or you don't have permission to view it.");
        } else {
          setAccessError("Failed to load case. Please try again.");
        }
        return;
      }
      
      setCaseData(data);
    } catch (error) {
      console.error('Error loading case:', error);
      setAccessError("Failed to load case data.");
    }
  };

  const loadEvidenceCount = async () => {
    if (!caseId || !isValidUUID(caseId)) return;
    const { count } = await supabase
      .from('evidence')
      .select('*', { count: 'exact', head: true })
      .eq('case_id', caseId);
    setEvidenceCount(count || 0);
  };

  const checkBookEntitlement = async () => {
    if (!user || !caseId) return;
    
    try {
      const { data } = await supabase
        .from("entitlements")
        .select("product_id, ends_at, case_id")
        .eq("user_id", user.id);
      
      if (data) {
        const hasEntitlement = data.some(e => {
          if (e.product_id?.toLowerCase().includes('monthly') || 
              e.product_id?.toLowerCase().includes('yearly') ||
              e.product_id?.toLowerCase().includes('premium')) {
            return !e.ends_at || new Date(e.ends_at) > new Date();
          }
          if (e.product_id === BOOK_DOCS_PRODUCT_KEY || 
              e.product_id?.toLowerCase().includes('book')) {
            if (e.case_id && e.case_id !== caseId) return false;
            return !e.ends_at || new Date(e.ends_at) > new Date();
          }
          return false;
        });
        setHasBookEntitlement(hasEntitlement);
      }
    } catch (err) {
      console.error("Error checking entitlement:", err);
    }
  };

  const handleEvidenceUploaded = async (count: number) => {
    setEvidenceCount(count);
    if (count > 0 && caseId && !pipelineResult) {
      await runPipeline(caseId, caseData?.description, caseData?.province);
    }
  };

  // CRITICAL: Redirect to /case/:caseId/pathways (path-based routing)
  const handleRedirectToDashboard = () => {
    analytics.redirectToDashboardSuccess('/case/evidence', caseId || undefined);
    navigate(`/case/${caseId}/pathways`, { replace: true });
  };

  const handleBookClick = () => {
    if (isPremium || isFreeUser || shouldHidePricing || hasBookEntitlement) {
      setBookWizardOpen(true);
      return;
    }
    setShowBookPaywall(true);
  };

  const handleBookAccessGranted = () => {
    setHasBookEntitlement(true);
    setShowBookPaywall(false);
    setBookWizardOpen(true);
  };

  const handleGenerateDocuments = async () => {
    if (!caseId) return;
    
    trackEvent('generate_documents_clicked', { caseId, evidenceCount });
    
    if (isProgramMode && program) {
      analytics.programDocumentsGenerated(program.id, ['book_of_documents', 'filing_forms']);
    }
    
    await supabase
      .from('cases')
      .update({ 
        flow_step: 'generating_documents', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', caseId);

    navigate(`/case/${caseId}/pathways`);
  };

  useEffect(() => {
    if (caseId && isValidUUID(caseId)) {
      trackEvent('evidence_upload_started', { caseId });
      if (isProgramMode && program) {
        analytics.programEvidenceUploaded(program.id, evidenceCount);
      }
    }
  }, [caseId, isProgramMode, program, evidenceCount]);

  // Error state
  if (accessError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-xl font-semibold">Can't access this case</h2>
            <p className="text-muted-foreground">{accessError}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate("/welcome")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/triage")}>
                Start New Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;
  if (!caseId || !isValidUUID(caseId)) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Upload Evidence - Let's See If You Have a Case | Justice Bot"
        description="Upload your documents and get a clear, plain-language assessment of your case strength."
        keywords="evidence upload, case assessment, legal documents, AI analysis, Canadian law"
        canonicalUrl={`https://justice-bot.com/case/${caseId}/evidence`}
      />
      <FlowHeader currentStep="evidence" caseTitle={caseData?.title} />
      <ProgramBanner />
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <FlowProgressIndicator currentStep="evidence" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Let's see if you have a case
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-2">
              You're not committing to anything yet.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base">
              This takes a few minutes and helps you understand where you stand.
            </p>
          </div>

          <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="py-6">
              <h2 className="font-semibold text-lg mb-4">What you'll do next</h2>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">1</span>
                  <span className="text-sm sm:text-base">Upload any documents, photos, or notices related to your situation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">2</span>
                  <span className="text-sm sm:text-base">We'll review them using Canadian law and similar cases</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">3</span>
                  <span className="text-sm sm:text-base">You'll get a clear explanation of your case strength and options</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <div className="mb-6">
            <p className="text-sm font-medium mb-3 text-center">What should I upload?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground">
              {['Notices or letters', 'Emails or texts', 'Photos or videos', 'Court documents', 'Applications', 'Anything relevant'].map((item) => (
                <div key={item} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              You don't need everything. Upload what you have.
            </p>
          </div>

          <div className="space-y-6">
            <EvidenceHub 
              caseId={caseId} 
              onUploadComplete={handleEvidenceUploaded}
              autoRedirectAfterUpload={true}
              onRedirectToDashboard={handleRedirectToDashboard}
            />
            
            {pipelineResult && (
              <CaseAnalysisResults 
                result={pipelineResult} 
                caseId={caseId}
                onUnlockClick={() => navigate('/pricing')}
              />
            )}
            
            {evidenceCount > 0 && !pipelineResult && (
              <MeritStatusTracker 
                caseId={caseId} 
                onComplete={(score) => console.log('Merit score complete:', score)}
              />
            )}
            
            {pipelineLoading && (
              <Card>
                <CardContent className="py-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                  <p className="font-medium">Analyzing your evidence...</p>
                  <p className="text-sm text-muted-foreground">Finding legal pathways and matching forms</p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="mt-8 border-primary/20 bg-gradient-to-r from-primary/5 to-background">
            <CardContent className="py-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div>
                  <p className="font-medium text-lg">
                    {evidenceCount > 0 
                      ? `${evidenceCount} document${evidenceCount !== 1 ? 's' : ''} uploaded`
                      : 'Upload evidence to continue'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {evidenceCount > 0 
                      ? 'Ready to analyze your case and generate documents'
                      : 'Add at least one document to get your case assessment'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button 
                    onClick={handleGenerateDocuments}
                    disabled={evidenceCount === 0}
                    size="lg"
                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    {evidenceCount > 0 ? 'Continue to Analysis' : 'Upload Evidence First'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={handleBookClick}
                  >
                    <BookOpen className="h-4 w-4" />
                    Generate Book of Documents
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your files are private and secure.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Nothing is filed or shared without your permission.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Button 
              variant="link" 
              className="text-muted-foreground text-sm"
              onClick={() => navigate('/dashboard')}
            >
              Already started a case? Go to my dashboard
            </Button>
          </div>

          <BookOfDocsPaywall
            open={showBookPaywall}
            onOpenChange={setShowBookPaywall}
            onAccessGranted={handleBookAccessGranted}
            caseId={caseId}
            caseTitle={caseData?.title}
          />

          <BookOfDocumentsWizard
            caseId={caseId}
            caseTitle={caseData?.title}
            open={bookWizardOpen}
            onOpenChange={setBookWizardOpen}
          />
        </div>
      </main>
    </div>
  );
};

export default CaseEvidence;
