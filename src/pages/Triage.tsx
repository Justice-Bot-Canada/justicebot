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
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
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

  const handleTriageComplete = (result: TriageResult, description: string, prov: string) => {
    setTriageResult(result);
    setUserDescription(description);
    setProvince(prov);
    setStep(1);
    
    // Track triage completion
    analytics.triageComplete(result.venue);
    trackEvent('triage_complete', { 
      venue: result.venue, 
      confidence: result.confidence,
      province: prov 
    });
    
    // Show discount modal after triage (only once per session)
    const hasSeenOffer = sessionStorage.getItem('triage_discount_shown');
    if (!hasSeenOffer) {
      setTimeout(() => {
        setShowDiscountModal(true);
        sessionStorage.setItem('triage_discount_shown', 'true');
      }, 1500); // Show after slight delay for better UX
    }
  };

  const handleProceed = async () => {
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
          status: 'active',
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

      // Upload pending documents to evidence
      if (pendingDocuments.length > 0) {
        for (const doc of pendingDocuments) {
          try {
            // Update status
            setPendingDocuments(prev => 
              prev.map(d => d.id === doc.id ? { ...d, status: 'uploading' as const, progress: 20 } : d)
            );

            // Upload file to storage
            const filePath = `${user.id}/${caseData.id}/${Date.now()}_${doc.file.name}`;
            const { error: uploadError } = await supabase.storage
              .from('evidence')
              .upload(filePath, doc.file);

            if (uploadError) throw uploadError;

            setPendingDocuments(prev => 
              prev.map(d => d.id === doc.id ? { ...d, progress: 60 } : d)
            );

            // Create evidence record
            const { data: evidenceData, error: evidenceError } = await supabase
              .from('evidence')
              .insert({
                case_id: caseData.id,
                file_name: doc.file.name,
                file_path: filePath,
                file_type: doc.file.type,
                description: `Uploaded during triage - ${triageResult.venueTitle}`,
                upload_date: new Date().toISOString()
              })
              .select()
              .single();

            if (evidenceError) throw evidenceError;

            setPendingDocuments(prev => 
              prev.map(d => d.id === doc.id ? { ...d, status: 'uploaded' as const, progress: 100 } : d)
            );

            // Queue AI analysis (async, don't wait)
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
      navigate(`/form-selector?venue=${triageResult.venue}&caseId=${caseData.id}`);
    } catch (error) {
      console.error("Error creating case:", error);
      toast.error("Failed to create case");
    } finally {
      setIsSavingDocuments(false);
    }
  };

  const handleSelectForm = (form: FormRecommendation) => {
    // Navigate directly to form with context
    if (!user) {
      toast.error("Please sign in to access forms");
      navigate("/");
      return;
    }
    
    // For now, proceed to form selector with form pre-selected
    handleProceed();
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
                onProceed={handleProceed}
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
        </div>
      </main>
      <Footer />
      
      <TriageDiscountModal 
        isOpen={showDiscountModal} 
        onClose={() => setShowDiscountModal(false)} 
      />
    </div>
  );
};

export default Triage;
