import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { EvidenceHub } from "@/components/EvidenceHub";
import { EvidenceAnalyzer } from "@/components/EvidenceAnalyzer";
import { PremiumGate } from "@/components/PremiumGate";
import { CaseMeritScore } from "@/components/CaseMeritScore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const Evidence = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');
  const [caseData, setCaseData] = useState<any>(null);

  // Load case data for analyzer context
  useEffect(() => {
    if (caseId) {
      loadCaseData();
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-4">Please sign in to access the Evidence Builder</p>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!caseId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">No Case Selected</h1>
            <p className="text-muted-foreground mb-4">Please select a case to manage evidence</p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Evidence Hub - Centralized Document Management | Justice Bot"
        description="Upload once, use everywhere. Smart AI tagging automatically organizes your evidence for forms, timelines, and tribunal hearings."
        keywords="evidence management, document organization, legal evidence, AI tagging, tribunal documents"
        canonicalUrl="https://justice-bot.com/evidence"
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Evidence Hub</h1>
                <p className="text-muted-foreground">
                  One upload. One place. Zero confusion. All your evidence, automatically organized.
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Generate Exhibit Book
              </Button>
            </div>
          </div>

          <Alert className="mb-6">
            <AlertDescription>
              <strong>Smart Evidence Management:</strong> Upload your documents here and they'll be automatically tagged with AI, 
              connected to relevant forms, and ready to use across your entire case. No more re-uploading the same file!
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Evidence;