import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";
import { FlowHeader } from "@/components/FlowHeader";
import { FlowProgressIndicator } from "@/components/FlowProgressIndicator";
import { RelatedPages } from "@/components/RelatedPages";
import CanonicalURL from "@/components/CanonicalURL";
import EnhancedSEO from "@/components/EnhancedSEO";
import SmartTriageForm from "@/components/SmartTriageForm";
import TriageResults from "@/components/TriageResults";
import { TriageDiscountModal } from "@/components/TriageDiscountModal";
import { TriageDocumentUpload, PendingDocument } from "@/components/TriageDocumentUpload";
import { BookOfDocumentsWizard } from "@/components/BookOfDocumentsWizard";
import AuthDialog from "@/components/AuthDialog";
import { ProgramBanner, useShouldHidePricing } from "@/components/ProgramBanner";
import { CourtReadyPaywall } from "@/components/CourtReadyPaywall";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BookOpen, FileCheck, ArrowRight, ArrowLeft, UserPlus, Shield, Sparkles, CheckCircle, Info } from "lucide-react";
import { analytics, trackEvent } from "@/utils/analytics";
import { useProgramCaseFields } from "@/hooks/useProgramCaseFields";
import { useProgram } from "@/contexts/ProgramContext";

interface FormRecommendation {
  formCode: string;
  formTitle: string;
  confidence: number;
  reason: string;
  tribunalType: string;
  priority: 'primary' | 'secondary' | 'optional';
}

interface TriageResult {
  venue: string;
  venueTitle: string;
  confidence: number;
  reasoning: string;
  urgentDeadlines: string[];
  recommendedForms: FormRecommendation[];
  nextSteps: string[];
  followUpQuestions?: string[];
  flags: string[];
  alternativeVenues?: { venue: string; reason: string }[];
}

const Triage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const programCaseFields = useProgramCaseFields();
  const { program, isProgramMode } = useProgram();
  const { hasAccess, isProgramUser, loading: accessLoading } = usePremiumAccess();
  const shouldHidePricing = useShouldHidePricing();
  const [step, setStep] = useState(0);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [userDescription, setUserDescription] = useState("");
  const [province, setProvince] = useState("Ontario");
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>([]);
  const [isSavingDocuments, setIsSavingDocuments] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);
  const [showBookWizard, setShowBookWizard] = useState(false);
  const [uploadedEvidenceCount, setUploadedEvidenceCount] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Check if user should see paywall (after triage, before evidence)
  const userHasAccess = hasAccess || isProgramUser || shouldHidePricing;

  const handleTriageComplete = (result: TriageResult, description: string, prov: string, evidenceCount?: number) => {
    setTriageResult(result);
    setUserDescription(description);
    setProvince(prov);
    setUploadedEvidenceCount(evidenceCount || 0);
    setStep(1);
    
    // Track triage completion events
    analytics.triageComplete(result.venue);
    analytics.triageCompletedEvent(result.venue, prov);
    
    // Track case snapshot shown (Step 2 of funnel)
    analytics.caseSnapshotShown(result.venue, result.confidence);
    
    // Pipeline event with rich payload
    analytics.triageCompleted({
      recommendedJourney: result.venue,
      meritScore: Math.round(result.confidence),
      groundsDetected: result.flags || [],
      dualPathway: (result.alternativeVenues?.length || 0) > 0,
      userLoggedIn: !!user,
    });
    trackEvent('triage_complete', { 
      venue: result.venue, 
      confidence: result.confidence,
      province: prov,
      evidenceCount: evidenceCount || 0
    });
    
    // Track program-specific intake completion
    if (isProgramMode && program) {
      analytics.programIntakeCompleted(program.id, result.venue);
    }
    
    // Show discount modal after triage (only once per session) - but not if they have evidence ready
    const hasEvidenceReady = result.flags?.includes('evidence-ready') || result.flags?.includes('book-of-documents-recommended');
    const hasSeenOffer = sessionStorage.getItem('triage_discount_shown');
    if (!hasSeenOffer && !hasEvidenceReady) {
      setTimeout(() => {
        setShowDiscountModal(true);
        sessionStorage.setItem('triage_discount_shown', 'true');
      }, 1500);
    }
  };
  
  // Check if user should be prompted to build Book of Documents
  const shouldShowBookOfDocuments = triageResult && (
    triageResult.flags?.includes('evidence-ready') ||
    triageResult.flags?.includes('book-of-documents-recommended') ||
    uploadedEvidenceCount >= 3 ||
    pendingDocuments.length >= 3
  );

  const handleProceed = async (goToBookOfDocs = false, preselectFormCode?: string) => {
    if (!user) {
      toast.error("Please sign in to continue");
      navigate("/");
      return;
    }

    if (!triageResult) return;

    setIsSavingDocuments(true);

    try {
      // Create a case with triage data - CRITICAL: populate merit_score column
      // triageResult.confidence is sometimes 0-1 (probability) and sometimes 0-100 (percentage)
      const rawConfidence = Number(triageResult.confidence);
      const normalizedConfidence = Number.isFinite(rawConfidence)
        ? (rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence)
        : 0;
      const meritScoreFromTriage = Math.min(100, Math.max(1, Math.round(normalizedConfidence)));

      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          title: `${triageResult.venueTitle} Case`,
          description: userDescription,
          venue: triageResult.venue,
          province: province,
          status: 'pending',
          merit_score: meritScoreFromTriage, // Store confidence as merit score (1-100)
          triage: {
            venue: triageResult.venue,
            venueTitle: triageResult.venueTitle,
            confidence: triageResult.confidence,
            reasoning: triageResult.reasoning,
            recommendedForms: triageResult.recommendedForms,
            flags: triageResult.flags,
          } as any,
          ...programCaseFields,
        })
        .select()
        .single();

      if (caseError) throw caseError;

      setCreatedCaseId(caseData.id);

      // Upload pending documents to evidence
      if (pendingDocuments.length > 0) {
        for (const doc of pendingDocuments) {
          try {
            setPendingDocuments(prev =>
              prev.map(d => d.id === doc.id ? { ...d, status: 'uploading' as const, progress: 20 } : d)
            );

            const filePath = `${user.id}/${caseData.id}/${Date.now()}_${doc.file.name}`;
            const { error: uploadError } = await supabase.storage
              .from('evidence')
              .upload(filePath, doc.file);

            if (uploadError) throw uploadError;

            setPendingDocuments(prev =>
              prev.map(d => d.id === doc.id ? { ...d, progress: 60 } : d)
            );

            const { error: evidenceError } = await supabase
              .from('evidence')
              .insert({
                case_id: caseData.id,
                file_name: doc.file.name,
                file_path: filePath,
                file_type: doc.file.type,
                description: `Uploaded during triage - ${triageResult.venueTitle}`,
                upload_date: new Date().toISOString()
              });

            if (evidenceError) throw evidenceError;

            setPendingDocuments(prev =>
              prev.map(d => d.id === doc.id ? { ...d, status: 'uploaded' as const, progress: 100 } : d)
            );

            // Queue AI analysis (async) - read file content first
            const reader = new FileReader();
            reader.onload = async (e) => {
              const content = e.target?.result as string;
              if (content && content.length > 0) {
                supabase.functions.invoke('analyze-document', {
                  body: {
                    fileContent: content.substring(0, 50000),
                    fileName: doc.file.name,
                    caseId: caseData.id
                  }
                }).catch(err => console.warn('Document analysis queued:', err));
              }
            };
            reader.readAsText(doc.file);

          } catch (docError) {
            console.error('Error uploading document:', doc.file.name, docError);
            setPendingDocuments(prev =>
              prev.map(d => d.id === doc.id ? { ...d, status: 'error' as const, error: 'Upload failed' } : d)
            );
          }
        }
      }

      toast.success("Case created with documents!");

      if (goToBookOfDocs) {
        setShowBookWizard(true);
      } else {
        const recommendedForm = typeof preselectFormCode === 'string' && preselectFormCode.trim().length > 0
          ? `&recommendedForm=${encodeURIComponent(preselectFormCode.trim())}`
          : '';

        navigate(`/forms/${triageResult.venue}?caseId=${caseData.id}${recommendedForm}`, {
          state: {
            caseId: caseData.id,
            userInput: userDescription,
            province,
            triageResult,
          }
        });
      }
    } catch (error) {
      console.error("Error creating case:", error);
      toast.error("Failed to create case");
    } finally {
      setIsSavingDocuments(false);
    }
  };

  const handleBuildBookOfDocuments = () => {
    handleProceed(true);
  };

  const handleSelectForm = (form: FormRecommendation) => {
    if (!user) {
      toast.error("Please sign in to access forms");
      navigate("/");
      return;
    }

    handleProceed(false, form.formCode);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Smart Legal Triage Tool",
    "description": "AI-powered legal triage to determine the best legal pathway and forms for your situation in Ontario",
    "url": "https://www.justice-bot.com/triage",
    "applicationCategory": "LegalService",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD"
    }
  };

  const relatedPages = [
    {
      title: "Small Claims Court Guide",
      description: "Learn how to file claims under $35,000",
      path: "/small-claims",
      icon: "calculator" as const,
      category: "Court"
    },
    {
      title: "LTB Filing Help",
      description: "Landlord Tenant Board application assistance",
      path: "/ltb-help",
      icon: "file" as const,
      category: "Tribunal"
    },
    {
      title: "Human Rights Claims",
      description: "File discrimination complaints with HRTO",
      path: "/hrto-help",
      icon: "help" as const,
      category: "Tribunal"
    },
    {
      title: "Family Law Guide",
      description: "Divorce, custody, and support matters",
      path: "/family-law-guide",
      icon: "book" as const,
      category: "Court"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CanonicalURL />
      <EnhancedSEO
        title="Free AI Legal Triage Tool - Find Your Legal Pathway | Justice-Bot"
        description="Use our smart AI-powered legal triage to instantly determine if you need Small Claims Court, LTB, HRTO, Family Court, or other tribunals. Get personalized form recommendations and next steps."
        keywords="legal triage, legal pathway finder, Canada legal help, legal assessment tool, smart legal triage, AI legal help, form recommendation"
        structuredData={structuredData}
      />
      <FlowHeader currentStep="triage" />
      <ProgramBanner />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-6">
            <FlowProgressIndicator currentStep="triage" />
          </div>

          {/* Step header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Legal Triage</h1>
            <p className="text-muted-foreground">
              Answer a few questions and we'll identify the right legal pathway and forms for your situation.
            </p>
            {step === 0 && (
              <Alert className="mt-4 bg-primary/5 border-primary/20">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Takes about 2 minutes. You can update answers anytime.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {step === 0 && (
            <SmartTriageForm onTriageComplete={handleTriageComplete} />
          )}

          {step === 1 && triageResult && (
            <>
              {/* Create Free Account CTA for anonymous users */}
              {!user && (
                <Card className="mb-6 border-primary bg-gradient-to-r from-primary/10 via-primary/5 to-background overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex-shrink-0 p-3 rounded-full bg-primary/20">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">Save Your Case Overview — It's Free!</h3>
                          <Badge variant="secondary" className="text-xs">100% Free</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Create your free account to save this analysis, upload documents, and track your legal journey.
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Save case overview
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Upload evidence
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Track deadlines
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            AI form assistance
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="lg" 
                        onClick={() => setShowAuthDialog(true)}
                        className="whitespace-nowrap"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Free Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <TriageResults
                result={triageResult}
                description={userDescription}
                province={province}
                onProceed={() => {
                  if (!user) {
                    setShowAuthDialog(true);
                  } else if (userHasAccess) {
                    setStep(2);
                  } else {
                    setShowPaywall(true);
                  }
                }}
                onBack={() => setStep(0)}
                onSelectForm={handleSelectForm}
                isLoading={isSavingDocuments}
              />

              {/* Paywall - shown after triage for non-paying users */}
              {showPaywall && !userHasAccess && user && (
                <div className="mt-8">
                  <CourtReadyPaywall
                    triageData={{
                      venue: triageResult.venue,
                      venueTitle: triageResult.venueTitle,
                      province: province,
                      description: userDescription,
                    }}
                    caseId={createdCaseId}
                    onCaseCreated={(newCaseId) => setCreatedCaseId(newCaseId)}
                    onAccessGranted={() => {
                      setShowPaywall(false);
                      setStep(2);
                    }}
                  />
                </div>
              )}

              {/* Document Upload Section - only for logged in users with access */}
              {user && userHasAccess && !showPaywall && (
                <div className="mt-6">
                  <TriageDocumentUpload
                    documents={pendingDocuments}
                    onDocumentsChange={setPendingDocuments}
                    disabled={isSavingDocuments}
                  />
                </div>
              )}

              {/* Prompt to sign up to upload documents */}
              {!user && (
                <Card className="mt-6 border-dashed">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <h4 className="font-medium mb-1">Ready to Upload Evidence?</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a free account to securely upload and store your documents
                    </p>
                    <Button variant="outline" onClick={() => setShowAuthDialog(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up to Upload
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <div className="mt-8">
                <RelatedPages 
                  pages={relatedPages}
                  title="Explore More Resources"
                  description="Get additional help with your legal journey"
                />
              </div>
            </>
          )}

          {/* Step 2: After pathway selection - Book of Documents or Forms */}
          {step === 2 && triageResult && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(1)}
                  className="w-fit mb-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Results
                </Button>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BookOpen className="h-5 w-5" />
                  {shouldShowBookOfDocuments 
                    ? "Build Your Book of Documents" 
                    : "Proceed with Your Case"}
                </CardTitle>
                <CardDescription>
                  {shouldShowBookOfDocuments 
                    ? `You've uploaded ${uploadedEvidenceCount + pendingDocuments.length} document(s). Organize your evidence into a professional Book of Documents for your ${triageResult.venueTitle} hearing.`
                    : `Create your case and proceed to fill out the required forms for ${triageResult.venueTitle}.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {shouldShowBookOfDocuments && (
                    <Button 
                      onClick={handleBuildBookOfDocuments} 
                      className="flex-1"
                      disabled={isSavingDocuments}
                    >
                      {isSavingDocuments ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Case...
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Build Book of Documents
                        </>
                      )}
                    </Button>
                  )}
                  <Button 
                    variant={shouldShowBookOfDocuments ? "outline" : "default"}
                    onClick={() => handleProceed(false)}
                    disabled={isSavingDocuments}
                    className="flex-1"
                  >
                    {isSavingDocuments ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Case...
                      </>
                    ) : (
                      <>
                        <FileCheck className="h-4 w-4 mr-2" />
                        {shouldShowBookOfDocuments ? "Skip to Forms" : "Continue to Forms"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
                {shouldShowBookOfDocuments && (
                  <p className="text-xs text-muted-foreground">
                    The Book of Documents wizard will help you organize, label, and compile your evidence 
                    into a tribunal-ready format with proper exhibit labels and indexing.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <TriageDiscountModal 
        isOpen={showDiscountModal} 
        onClose={() => setShowDiscountModal(false)} 
      />
      
      {/* Auth Dialog for signup */}
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog} 
      />
      
      {/* Book of Documents Wizard */}
      {createdCaseId && (
        <BookOfDocumentsWizard
          caseId={createdCaseId}
          caseTitle={triageResult?.venueTitle}
          open={showBookWizard}
          onOpenChange={setShowBookWizard}
        />
      )}
    </div>
  );
};

export default Triage;
