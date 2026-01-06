import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Unlock, Upload, Clock, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResumeCaseCardProps {
  caseId: string;
  caseTitle: string;
  flowStep: string | null;
  evidenceCount: number;
  province: string;
}

type CaseState = 'paywall_unlocked' | 'evidence_uploaded' | 'generating_documents' | 'documents_ready';

const getStatusInfo = (flowStep: string | null, evidenceCount: number): {
  statusLine: string;
  ctaText: string;
  ctaRoute: string;
  icon: React.ReactNode;
} => {
  // Map flow_step to our simplified states
  const step = flowStep?.toLowerCase() || '';
  
  if (step === 'documents_ready' || step === 'complete') {
    return {
      statusLine: 'Documents ready to download',
      ctaText: 'Download My Documents',
      ctaRoute: 'documents-ready',
      icon: <FileText className="h-5 w-5" />
    };
  }
  
  if (step === 'generating_documents') {
    return {
      statusLine: 'Documents generating...',
      ctaText: 'View Progress',
      ctaRoute: 'smart-documents',
      icon: <Clock className="h-5 w-5 animate-pulse" />
    };
  }
  
  if (evidenceCount > 0) {
    return {
      statusLine: 'Ready to generate documents',
      ctaText: 'Generate My Documents',
      ctaRoute: 'evidence',
      icon: <FileText className="h-5 w-5" />
    };
  }
  
  // Default: just unlocked, needs evidence
  return {
    statusLine: 'Evidence upload in progress',
    ctaText: 'Continue Uploading Evidence',
    ctaRoute: 'evidence',
    icon: <Upload className="h-5 w-5" />
  };
};

export const ResumeCaseCard = ({ 
  caseId, 
  caseTitle, 
  flowStep, 
  evidenceCount,
  province 
}: ResumeCaseCardProps) => {
  const navigate = useNavigate();
  const { statusLine, ctaText, ctaRoute, icon } = getStatusInfo(flowStep, evidenceCount);

  const handleContinue = () => {
    if (ctaRoute === 'documents-ready') {
      navigate(`/case/${caseId}/documents-ready`);
    } else if (ctaRoute === 'evidence') {
      navigate(`/evidence?case=${caseId}`);
    } else {
      navigate(`/${ctaRoute}?case=${caseId}`);
    }
  };

  const handleViewDetails = () => {
    navigate(`/case/${caseId}/next-steps`);
  };

  return (
    <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 via-background to-green-50/30 dark:from-green-900/20 dark:to-green-900/10 shadow-lg">
      <CardContent className="pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Unlock className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h2 className="text-xl font-bold text-foreground">Resume Your Case</h2>
        </div>

        {/* Case info */}
        <p className="text-sm text-muted-foreground mb-1">{caseTitle}</p>
        
        {/* Status line */}
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <span className="text-sm font-medium text-foreground">{statusLine}</span>
        </div>

        {/* Helper text */}
        <p className="text-sm text-muted-foreground mb-6">
          Your progress has been saved. You can continue exactly where you left off.
        </p>

        {/* Primary CTA */}
        <Button 
          onClick={handleContinue}
          size="lg" 
          className="w-full gap-2 mb-3"
        >
          {ctaText}
          <ArrowRight className="h-4 w-4" />
        </Button>

        {/* Secondary reassurance */}
        <p className="text-center text-xs text-muted-foreground mb-3">
          This purchase applies to this case only. No additional charges.
        </p>

        {/* Tertiary link */}
        <button 
          onClick={handleViewDetails}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
        >
          View case details
        </button>
      </CardContent>
    </Card>
  );
};
