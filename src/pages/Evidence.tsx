import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Upload } from "lucide-react";
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

const Evidence = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, isFreeUser, tier } = usePremiumAccess();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');
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

  // Handle continue to timeline
  const handleContinueToTimeline = async () => {
    if (!caseId) return;
    
    // Update case flow step
    await supabase
      .from('cases')
      .update({ flow_step: 'timeline', updated_at: new Date().toISOString() })
      .eq('id', caseId);

    navigate(`/case-timeline?caseId=${caseId}`);
  };

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
                  Upload documents that support your case. They'll be automatically organized and ready to use.
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
          <Alert className="mb-6 bg-primary/5 border-primary/20">
            <Upload className="h-4 w-4" />
            <AlertDescription>
              Upload what you have. You can add more documents later. All uploads are encrypted and secure.
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
                      ? 'Ready to continue to the next step'
                      : 'Upload at least one document to continue'}
                  </p>
                </div>
                <Button 
                  onClick={handleContinueToTimeline}
                  disabled={evidenceCount === 0}
                  size="lg"
                  className="gap-2 w-full sm:w-auto"
                >
                  Continue to Timeline
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Evidence;
