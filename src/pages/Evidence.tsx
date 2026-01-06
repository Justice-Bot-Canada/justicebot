import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Upload, FileText, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FlowHeader } from "@/components/FlowHeader";
import { FlowProgressIndicator } from "@/components/FlowProgressIndicator";
import SEOHead from "@/components/SEOHead";
import { EvidenceHub } from "@/components/EvidenceHub";
import { EvidenceAnalyzer } from "@/components/EvidenceAnalyzer";
import { PremiumGate } from "@/components/PremiumGate";
import { CaseMeritScore } from "@/components/CaseMeritScore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { BookOfDocumentsWizard } from "@/components/BookOfDocumentsWizard";
import { EvidenceBundlePaywall } from "@/components/paywalls";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, analytics } from "@/utils/analytics";
import { useProgram } from "@/contexts/ProgramContext";

const Evidence = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, isFreeUser, tier } = usePremiumAccess();
  const { program, isProgramMode } = useProgram();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('case') || searchParams.get('caseId'); // Support both params
  const [caseData, setCaseData] = useState<any>(null);
  const [bookWizardOpen, setBookWizardOpen] = useState(false);
  const [showBundlePaywall, setShowBundlePaywall] = useState(false);
  const [evidenceCount, setEvidenceCount] = useState(0);

  const isPremium = hasAccess && (tier === 'monthly' || tier === 'yearly');

  const handleBookClick = () => {
    if (!isPremium && !isFreeUser) {
      setShowBundlePaywall(true);
      return;
    }
    setBookWizardOpen(true);
  };

  const handleBundlePaywallConfirm = () => {
    setShowBundlePaywall(false);
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
        title="Evidence Hub - Upload Your Documents | Justice Bot"
        description="Upload once, use everywhere. Smart AI tagging automatically organizes your evidence for forms, timelines, and tribunal hearings."
        keywords="evidence management, document organization, legal evidence, AI tagging, tribunal documents"
        canonicalUrl="https://justice-bot.com/evidence"
      />
      <FlowHeader currentStep="evidence" caseTitle={caseData?.title} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-6">
            <FlowProgressIndicator currentStep="evidence" />
          </div>

          {/* Step header */}
          <div className="mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Upload Your Evidence</h1>
                <p className="text-muted-foreground">
                  Add documents that support your case. You can upload now or come back later — progress is saved automatically.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleBookClick}
              >
                <BookOpen className="h-4 w-4" />
                Generate Book of Documents
              </Button>
            </div>

            <EvidenceBundlePaywall
              open={showBundlePaywall}
              onOpenChange={setShowBundlePaywall}
              onConfirm={handleBundlePaywallConfirm}
            />

            <BookOfDocumentsWizard
              caseId={caseId}
              caseTitle={caseData?.title}
              open={bookWizardOpen}
              onOpenChange={setBookWizardOpen}
            />
          </div>

          {/* Reassurance message */}
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
            <Upload className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Progress saves automatically.</strong> You can add, remove, or replace evidence anytime before generating documents.
            </AlertDescription>
          </Alert>

          <PremiumGate feature="Evidence Management">
            <div className="space-y-6">
              {/* Case-Specific Merit Score */}
              <CaseMeritScore 
                caseId={caseId}
                caseType={caseData?.venue}
                caseDescription={caseData?.description}
              />
              
              <EvidenceAnalyzer 
                caseId={caseId} 
                caseType={caseData?.venue}
                caseDescription={caseData?.description}
              />
              <EvidenceHub caseId={caseId} />
            </div>
          </PremiumGate>

          {/* Continue CTA */}
          <Card className="mt-8 border-primary/20 bg-gradient-to-r from-primary/5 to-background">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {evidenceCount > 0 
                      ? `${evidenceCount} document${evidenceCount !== 1 ? 's' : ''} uploaded`
                      : 'No documents uploaded yet'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {evidenceCount > 0 
                      ? 'Ready to generate your documents'
                      : 'Upload at least one document to continue'}
                  </p>
                </div>
                <Button 
                  onClick={handleGenerateDocuments}
                  disabled={evidenceCount === 0}
                  size="lg"
                  className="gap-2 w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white"
                >
                  <FileText className="h-4 w-4" />
                  Generate My Documents
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              {/* Refund-prevention micro-copy */}
              {evidenceCount > 0 && (
                <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t border-border">
                  Make sure all evidence is uploaded before generating documents.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Evidence;
