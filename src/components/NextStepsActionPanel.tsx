import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, Upload, ArrowRight } from "lucide-react";

interface NextStepsActionPanelProps {
  caseId?: string;
  venue?: string;
  variant?: "default" | "compact";
  className?: string;
}

/**
 * Post-result action panel that appears after merit score, AI analysis, or CanLII results.
 * Provides exactly 3 clear next steps to keep users moving forward.
 */
export function NextStepsActionPanel({ 
  caseId, 
  venue,
  variant = "default",
  className = ""
}: NextStepsActionPanelProps) {
  const navigate = useNavigate();

  const actions = [
    {
      id: "generate-form",
      icon: FileText,
      title: "Generate the recommended legal form",
      description: "Auto-fill forms based on your case details",
      onClick: () => {
        if (caseId) {
          navigate(`/smart-documents?case=${caseId}`);
        } else {
          navigate("/smart-documents");
        }
      },
      primary: true,
    },
    {
      id: "filing-guide",
      icon: MapPin,
      title: "View step-by-step filing guide",
      description: "Learn exactly how and where to file",
      onClick: () => {
        if (caseId && venue) {
          navigate(`/case-timeline?caseId=${caseId}`);
        } else if (venue) {
          // Route to venue-specific guide
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
    },
    {
      id: "upload-evidence",
      icon: Upload,
      title: "Upload more evidence to strengthen your case",
      description: "Add documents to improve your merit score",
      onClick: () => {
        if (caseId) {
          navigate(`/evidence?case=${caseId}`);
        } else {
          navigate("/evidence");
        }
      },
      primary: false,
    },
  ];

  if (variant === "compact") {
    return (
      <div className={`p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2 sm:space-y-3 ${className}`}>
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-primary" />
          What happens next?
        </h4>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.primary ? "default" : "outline"}
              size="sm"
              onClick={action.onClick}
              className="gap-1 justify-start sm:justify-center text-xs"
            >
              <action.icon className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{action.title.split(" ").slice(0, 4).join(" ")}...</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ArrowRight className="h-5 w-5 text-primary" />
          What happens next?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`w-full text-left p-4 rounded-lg border transition-all hover:border-primary/50 hover:shadow-sm ${
              action.primary 
                ? "bg-primary/10 border-primary/30" 
                : "bg-card border-border"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${action.primary ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <h4 className="font-medium text-sm">{action.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-7">{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
          </button>
        ))}
        <p className="text-xs text-center text-muted-foreground pt-2">
          Nothing is filed without your approval. You're always in control.
        </p>
      </CardContent>
    </Card>
  );
}

export default NextStepsActionPanel;
