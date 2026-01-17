import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Upload, FileText, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FlowHeader } from "@/components/FlowHeader";
import { FlowProgressIndicator } from "@/components/FlowProgressIndicator";
import { ProgramBanner, useShouldHidePricing } from "@/components/ProgramBanner";
import SEOHead from "@/components/SEOHead";
import { EvidenceHub } from "@/components/EvidenceHub";
import { EvidenceAnalyzer } from "@/components/EvidenceAnalyzer";
import { PremiumGate } from "@/components/PremiumGate";
import { CaseMeritScore } from "@/components/CaseMeritScore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { BookOfDocumentsWizard } from "@/components/BookOfDocumentsWizard";
import { BookOfDocsPaywall } from "@/components/paywalls";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, analytics } from "@/utils/analytics";
import { useProgram } from "@/contexts/ProgramContext";

const BOOK_DOCS_PRODUCT_KEY = "book_docs_generator";

const Evidence = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, isFreeUser, tier } = usePremiumAccess();
  const { program, isProgramMode } = useProgram();
  const shouldHidePricing = useShouldHidePricing();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('case') || searchParams.get('caseId');
  const [caseData, setCaseData] = useState<any>(null);
  const [bookWizardOpen, setBookWizardOpen] = useState(false);
  const [showBookPaywall, setShowBookPaywall] = useState(false);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [hasBookEntitlement, setHasBookEntitlement] = useState(false);

  const isPremium = hasAccess && (tier === 'monthly' || tier === 'yearly');

  // Check if user has Book of Documents entitlement
  const checkBookEntitlement = async () => {
    if (!user || !caseId) return;
    
    try {
      const { data } = await supabase
        .from("entitlements")
        .select("product_id, ends_at, case_id")
        .eq("user_id", user.id);
      
      if (data) {
        // Check for global premium OR specific book_docs_generator entitlement
        const hasEntitlement = data.some(e => {
          // Global subscriptions
          if (e.product_id?.toLowerCase().includes('monthly') || 
              e.product_id?.toLowerCase().includes('yearly') ||
              e.product_id?.toLowerCase().includes('premium')) {
            return !e.ends_at || new Date(e.ends_at) > new Date();
          }
          // Specific book_docs_generator entitlement
          if (e.product_id === BOOK_DOCS_PRODUCT_KEY || 
              e.product_id?.toLowerCase().includes('book')) {
            // If case-scoped, must match this case
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

  useEffect(() => {
    if (user && caseId) {
      checkBookEntitlement();
    }
  }, [user, caseId]);

  // Handle Book of Documents button click
  const handleBookClick = () => {
    // Premium users, free users, and program users bypass paywall
    if (isPremium || isFreeUser || shouldHidePricing || hasBookEntitlement) {
      setBookWizardOpen(true);
      return;
    }
    // Show paywall for non-premium users
    setShowBookPaywall(true);
  };

  const handleBookAccessGranted = () => {
    setHasBookEntitlement(true);
    setShowBookPaywall(false);
    setBookWizardOpen(true);
  };

  // Load case data for analyzer context
  useEffect(() => {
    if (caseId) {
      loadCaseData();
      loadEvidenceCount();
    }
  }, [caseId]);

  const loadCaseData = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();
      
      if (!error && data) {
        setCaseData(data);
      }
    } catch (error) {
      console.error('Error loading case:', error);
    }
  };

  const loadEvidenceCount = async () => {
    if (!caseId) return;
    const { count } = await supabase
      .from('evidence')
      .select('*', { count: 'exact', head: true })
      .eq('case_id', caseId);
    setEvidenceCount(count || 0);
  };

  // Handle generate documents
  const handleGenerateDocuments = async () => {
    if (!caseId) return;
    
    trackEvent('generate_documents_clicked', { caseId, evidenceCount });
    
    // Track program-specific document generation
    if (isProgramMode && program) {
      analytics.programDocumentsGenerated(program.id, ['book_of_documents', 'filing_forms']);
    }
    
    // Update case flow step
    await supabase
      .from('cases')
      .update({ 
        flow_step: 'generating_documents', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', caseId);

    // Navigate to smart documents for generation
    navigate(`/smart-documents?case=${caseId}&generate=true`);
  };

  // Track page view
  useEffect(() => {
    if (caseId) {
      trackEvent('evidence_upload_started', { caseId });
      
      // Track program-specific evidence upload
      if (isProgramMode && program) {
        analytics.programEvidenceUploaded(program.id, evidenceCount);
      }
    }
  }, [caseId, isProgramMode, program, evidenceCount]);

  if (!user) {
    navigate("/welcome");
    return null;
  }

  if (!caseId) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Upload Evidence - Let's See If You Have a Case | Justice Bot"
        description="Upload your documents and get a clear, plain-language assessment of your case strength. Private, secure, and built for Canadian law."
        keywords="evidence upload, case assessment, legal documents, AI analysis, Canadian law"
        canonicalUrl="https://justice-bot.com/evidence"
      />
      <FlowHeader currentStep="evidence" caseTitle={caseData?.title} />
      <ProgramBanner />
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-6">
            <FlowProgressIndicator currentStep="evidence" />
          </div>

          {/* Onboarding header - calming, guided intro */}
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

          {/* What you'll do next - process explanation */}
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

          {/* Upload examples helper */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-3 text-center">What should I upload?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>Notices or letters</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>Emails or texts</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>Photos or videos</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>Court documents</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>Applications</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>Anything relevant</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              You don't need everything. Upload what you have.
            </p>
          </div>

          {/* Evidence upload area */}
          {/* Evidence upload + merit score = ALWAYS FREE (never paywall curiosity) */}
          <div className="space-y-6">
            <EvidenceHub caseId={caseId} />
            
            {/* Show analyzer and merit score after uploads */}
            {evidenceCount > 0 && (
              <>
                <EvidenceAnalyzer 
                  caseId={caseId} 
                  caseType={caseData?.venue}
                  caseDescription={caseData?.description}
                />
                <CaseMeritScore 
                  caseId={caseId}
                  caseType={caseData?.venue}
                  caseDescription={caseData?.description}
                />
              </>
            )}
          </div>

          {/* Primary action CTA */}
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

          {/* Security reassurance */}
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your files are private and secure.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Nothing is filed or shared without your permission.
            </p>
          </div>

          {/* Dashboard link for returning users */}
          <div className="mt-8 text-center">
            <Button 
              variant="link" 
              className="text-muted-foreground text-sm"
              onClick={() => navigate('/dashboard')}
            >
              Already started a case? Go to my dashboard
            </Button>
          </div>

          {/* Hidden components for paywall flow */}
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

export default Evidence;
