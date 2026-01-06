import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  Building2,
  Users,
  DollarSign,
  Heart,
  Scale,
  Briefcase,
  Shield,
  Gavel,
  Loader2
} from "lucide-react";

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

interface TriageResultsProps {
  result: TriageResult;
  description: string;
  province: string;
  onProceed: () => void;
  onBack: () => void;
  onSelectForm: (form: FormRecommendation) => void;
  isLoading?: boolean;
}

const venueIcons: Record<string, React.ElementType> = {
  ltb: Building2,
  hrto: Users,
  "small-claims": DollarSign,
  family: Heart,
  criminal: Gavel,
  labour: Briefcase,
  wsib: Shield,
  "superior-court": Scale,
  divisional: Scale,
};

const venueColors: Record<string, string> = {
  ltb: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
  hrto: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800",
  "small-claims": "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
  family: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800",
  criminal: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
  labour: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
  wsib: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800",
  "superior-court": "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800",
  divisional: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-300 dark:border-slate-800",
};

const venuePortals: Record<string, string> = {
  ltb: "https://tribunalsontario.ca/ltb/",
  hrto: "https://tribunalsontario.ca/hrto/",
  "small-claims": "https://www.ontariocourts.ca/scj/small-claims-court/",
  family: "https://www.ontariocourts.ca/scj/family/",
  criminal: "https://www.ontariocourts.ca/ocj/criminal-court/",
  labour: "https://www.olrb.gov.on.ca/",
  wsib: "https://www.wsib.ca/",
  "superior-court": "https://www.ontariocourts.ca/scj/",
  divisional: "https://www.ontariocourts.ca/scj/divisional-court/",
};

const TriageResults: React.FC<TriageResultsProps> = ({
  result,
  description,
  province,
  onProceed,
  onBack,
  onSelectForm,
  isLoading = false,
}) => {
  const VenueIcon = venueIcons[result.venue] || Scale;
  const venueColor = venueColors[result.venue] || "bg-gray-50 text-gray-700 border-gray-200";
  const portalUrl = venuePortals[result.venue] || "https://www.ontario.ca/";

  const primaryForms = result.recommendedForms.filter(f => f.priority === 'primary');

  return (
    <div className="space-y-6">
      {/* Main Result Card - Venue */}
      <Card className="overflow-hidden border-2 border-primary/30">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Your Situation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Venue Header */}
          <div className={`flex items-center gap-4 p-4 rounded-lg border ${venueColor}`}>
            <div className="p-3 rounded-lg bg-background">
              <VenueIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-80">Correct Venue</p>
              <h3 className="font-bold text-xl">{result.venueTitle}</h3>
              <p className="text-sm opacity-80">{province}</p>
            </div>
          </div>

          {/* Primary Form */}
          {primaryForms.length > 0 && (
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium text-muted-foreground mb-1">Correct Form</p>
              <h4 className="font-bold text-lg">{primaryForms[0].formCode} – {primaryForms[0].formTitle}</h4>
            </div>
          )}

          {/* Informational Note */}
          <div className="p-4 rounded-lg border border-muted bg-muted/30">
            <p className="text-sm text-muted-foreground">
              This is informational, not legal advice. We help you understand the process.
            </p>
          </div>

          {/* Urgent Deadlines */}
          {result.urgentDeadlines.length > 0 && (
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                    Important Deadlines
                  </h4>
                  <ul className="space-y-1">
                    {result.urgentDeadlines.map((deadline, index) => (
                      <li key={index} className="text-sm text-red-600 dark:text-red-400">{deadline}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Primary CTA - Save & Continue */}
      <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="pt-6 pb-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Save my case & continue</h3>
            <p className="text-muted-foreground">
              You can come back anytime. Nothing is filed without you.
            </p>
            <Button onClick={onProceed} size="lg" className="gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Save & continue
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              ✓ Come back anytime • ✓ No payment yet • ✓ Nothing shared
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Card */}
      {result.nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {result.nextSteps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Additional Forms (collapsed) */}
      {result.recommendedForms.length > 1 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Other Forms You May Need
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.recommendedForms.slice(1).map((form, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                  onClick={() => onSelectForm(form)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm">{form.formCode}: {form.formTitle}</span>
                      <p className="text-xs text-muted-foreground">{form.reason}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back Button */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} disabled={isLoading}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Start Over
        </Button>
        
        <a
          href={portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
        >
          Official tribunal portal
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default TriageResults;
