import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RelatedPages } from "@/components/RelatedPages";
import CanonicalURL from "@/components/CanonicalURL";
import EnhancedSEO from "@/components/EnhancedSEO";
import SmartTriageForm from "@/components/SmartTriageForm";
import TriageResults from "@/components/TriageResults";
import { TriageDiscountModal } from "@/components/TriageDiscountModal";
import { TriageDocumentUpload, PendingDocument } from "@/components/TriageDocumentUpload";
import { BookOfDocumentsWizard } from "@/components/BookOfDocumentsWizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, BookOpen, FileCheck, ArrowRight } from "lucide-react";
import { analytics, trackEvent } from "@/utils/analytics";

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

  const handleTriageComplete = (result: TriageResult, description: string, prov: string, evidenceCount?: number) => {
    setTriageResult(result);
    setUserDescription(description);
    setProvince(prov);
    setUploadedEvidenceCount(evidenceCount || 0);
    setStep(1);
    
    // Track triage completion
    analytics.triageComplete(result.venue);
    trackEvent('triage_complete', { 
      venue: result.venue, 
      confidence: result.confidence,
      province: prov,
      evidenceCount: evidenceCount || 0
    });
    
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
      // Create a case with triage data
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          title: `${triageResult.venueTitle} Case`,
          description: userDescription,
          venue: triageResult.venue,
          province: province,
          status: 'pending',
          triage: {
            venue: triageResult.venue,
            venueTitle: triageResult.venueTitle,
            confidence: triageResult.confidence,
            reasoning: triageResult.reasoning,
            recommendedForms: triageResult.recommendedForms,
            flags: triageResult.flags,
          } as any,
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

            // Queue AI analysis (async)
            supabase.functions.invoke('analyze-document', {
              body: {
                fileContent: '',
                fileName: doc.file.name,
                fileType: doc.file.type,
                caseId: caseData.id
              }
            }).catch(err => console.warn('Document analysis queued:', err));

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
    <div className="min-h-screen bg-background">
      <CanonicalURL />
      <EnhancedSEO
        title="Free AI Legal Triage Tool - Find Your Legal Pathway | Justice-Bot"
        description="Use our smart AI-powered legal triage to instantly determine if you need Small Claims Court, LTB, HRTO, Family Court, or other tribunals. Get personalized form recommendations and next steps."
        keywords="legal triage, legal pathway finder, Ontario legal help, legal assessment tool, smart legal triage, AI legal help, form recommendation"
        structuredData={structuredData}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => step === 0 ? navigate("/") : setStep(0)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {step === 0 ? "Back to Home" : "New Analysis"}
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Smart Legal Triage</h1>
            <p className="text-muted-foreground">
              Get AI-powered guidance on the right legal pathway and forms for your situation.
            </p>
          </div>

          {step === 0 && (
            <SmartTriageForm onTriageComplete={handleTriageComplete} />
          )}

          {step === 1 && triageResult && (
            <>
              <TriageResults
                result={triageResult}
                description={userDescription}
                province={province}
                onProceed={() => setStep(2)}
                onBack={() => setStep(0)}
                onSelectForm={handleSelectForm}
                isLoading={isSavingDocuments}
              />

              {/* Document Upload Section */}
              <div className="mt-6">
                <TriageDocumentUpload
                  documents={pendingDocuments}
                  onDocumentsChange={setPendingDocuments}
                  disabled={isSavingDocuments}
                />
              </div>
              
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
      <Footer />
      
      <TriageDiscountModal 
        isOpen={showDiscountModal} 
        onClose={() => setShowDiscountModal(false)} 
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
