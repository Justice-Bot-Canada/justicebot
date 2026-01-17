import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, Upload, ArrowRight, BookOpen } from "lucide-react";

interface NextStepsActionPanelProps {
  caseId?: string;
  venue?: string;
  variant?: "default" | "compact";
  className?: string;
  /** Merit score to customize actions by range */
  score?: number;
}

/**
 * Post-result action panel that appears after merit score, AI analysis, or CanLII results.
 * Provides exactly 3 clear next steps to keep users moving forward.
 * Actions are ordered based on merit score range (LOW/MEDIUM/HIGH).
 */
export function NextStepsActionPanel({ 
  caseId, 
  venue,
  variant = "default",
  className = "",
  score
}: NextStepsActionPanelProps) {
  const navigate = useNavigate();

  // Determine score range: LOW (0-39), MEDIUM (40-69), HIGH (70-100)
  const getScoreRange = (): 'low' | 'medium' | 'high' | undefined => {
    if (score === undefined) return undefined;
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const scoreRange = getScoreRange();

  // Base actions
  const generateFormAction = {
    id: "generate-form",
    icon: FileText,
    title: "Generate the correct legal form",
    description: "We'll identify the forms that match your situation and pre-fill them using your evidence.",
    buttonText: "Generate my legal form",
    onClick: () => {
      if (caseId) {
        navigate(`/smart-documents?case=${caseId}`);
      } else {
        navigate("/smart-documents");
      }
    },
    primary: true,
  };

  const uploadEvidenceAction = {
    id: "upload-evidence",
    icon: Upload,
    title: "Strengthen your case",
    description: "Add more documents or information to improve your score and analysis.",
    buttonText: "Upload more evidence",
    onClick: () => {
      if (caseId) {
        navigate(`/evidence?case=${caseId}`);
      } else {
        navigate("/evidence");
      }
    },
    primary: false,
  };

  const filingGuideAction = {
    id: "filing-guide",
    icon: MapPin,
    title: "See the step-by-step process",
    description: "Understand what filing involves, where to file, and what usually happens next.",
    buttonText: "View step-by-step guide",
    onClick: () => {
      if (caseId && venue) {
        navigate(`/case-timeline?caseId=${caseId}`);
      } else if (venue) {
        const guideRoutes: Record<string, string> = {
          ltb: "/ltb-guide",
          hrto: "/human-rights-guide",
          "small-claims": "/small-claims-court",
          family: "/family-law-guide",
          criminal: "/criminal-court-guide",
        };
        navigate(guideRoutes[venue.toLowerCase()] || "/forms");
      } else {
        navigate("/forms");
      }
    },
    primary: false,
  };

  const learnRightsAction = {
    id: "learn-rights",
    icon: BookOpen,
    title: "Learn about your rights anyway",
    description: "Understand what legal protections may apply to your situation.",
    buttonText: "See what evidence usually matters",
    onClick: () => navigate("/legal-resources"),
    primary: false,
  };

  // Order actions based on score range
  let actions;
  if (scoreRange === 'low') {
    // LOW: Primary = Upload more evidence
    actions = [
      { ...uploadEvidenceAction, primary: true },
      learnRightsAction,
      { ...generateFormAction, primary: false },
    ];
  } else if (scoreRange === 'medium') {
    // MEDIUM: Primary = Strengthen case
    actions = [
      { ...uploadEvidenceAction, primary: true },
      generateFormAction,
      filingGuideAction,
    ];
  } else {
    // HIGH or undefined: Primary = Generate form
    actions = [
      generateFormAction,
      filingGuideAction,
      { ...uploadEvidenceAction, primary: false },
    ];
  }

  // Get reassurance text based on score range
  const getReassuranceText = () => {
    if (scoreRange === 'low') {
      return "This score is informational. It helps you decide whether gathering more evidence is worthwhile.";
    } else if (scoreRange === 'medium') {
      return "Improving your evidence can meaningfully change this score.";
    }
    return "You remain in control. Nothing is filed without your approval.";
  };

  if (variant === "compact") {
    return (
      <div className={`p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3 ${className}`}>
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-primary" />
          What happens next?
        </h4>
        <p className="text-xs text-muted-foreground">
          Choose what makes sense for you right now.
        </p>
        <div className="flex flex-col gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.primary ? "default" : "outline"}
              size="sm"
              onClick={action.onClick}
              className="gap-2 justify-start text-xs"
            >
              <action.icon className="h-3 w-3 flex-shrink-0" />
              {action.buttonText}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center pt-2">
          {getReassuranceText()}
        </p>
      </div>
    );
  }

  return (
    <Card className={`border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background ${className}`}>
      <CardHeader className="pb-4 text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <ArrowRight className="h-5 w-5 text-primary" />
          What happens next?
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          You have a few clear options. Choose what makes sense for you right now.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => (
          <div
            key={action.id}
            className={`p-4 rounded-lg border ${
              action.primary 
                ? "bg-primary/10 border-primary/30" 
                : "bg-card border-border"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg flex-shrink-0 ${action.primary ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <h4 className="font-medium text-sm">{action.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3 pl-7">{action.description}</p>
                <div className="pl-7">
                  <Button
                    variant={action.primary ? "default" : "outline"}
                    size="sm"
                    onClick={action.onClick}
                    className="gap-2"
                  >
                    {action.buttonText}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Reassurance - Score-specific */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {getReassuranceText()}
          </p>
          {scoreRange !== 'low' && (
            <p className="text-xs text-muted-foreground mt-1">
              Nothing is filed, sent, or shared unless you choose to proceed.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default NextStepsActionPanel;
