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
  MapPin,
  ExternalLink,
  Building2,
  Users,
  DollarSign,
  Heart,
  Scale,
  Briefcase,
  Shield,
  Gavel,
  Info,
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
  ltb: "bg-blue-50 text-blue-700 border-blue-200",
  hrto: "bg-purple-50 text-purple-700 border-purple-200",
  "small-claims": "bg-green-50 text-green-700 border-green-200",
  family: "bg-rose-50 text-rose-700 border-rose-200",
  criminal: "bg-red-50 text-red-700 border-red-200",
  labour: "bg-amber-50 text-amber-700 border-amber-200",
  wsib: "bg-orange-50 text-orange-700 border-orange-200",
  "superior-court": "bg-indigo-50 text-indigo-700 border-indigo-200",
  divisional: "bg-slate-50 text-slate-700 border-slate-200",
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

  const hasUrgentFlags = result.flags.some(f => 
    ['urgent', 'deadline', 'safety', 'eviction'].includes(f.toLowerCase())
  );

  const primaryForms = result.recommendedForms.filter(f => f.priority === 'primary');
  const secondaryForms = result.recommendedForms.filter(f => f.priority === 'secondary');
  const optionalForms = result.recommendedForms.filter(f => f.priority === 'optional');

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className="overflow-hidden">
        <div className={`h-2 ${result.confidence >= 80 ? 'bg-green-500' : result.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Recommended Legal Pathway
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Venue Header */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${venueColor}`}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-background">
                <VenueIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{result.venueTitle}</h3>
                <p className="text-sm opacity-80">{province}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={result.confidence >= 80 ? 'bg-green-600' : result.confidence >= 60 ? 'bg-amber-600' : 'bg-red-600'}>
                {result.confidence}% Match
              </Badge>
            </div>
          </div>

          {/* Reasoning */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Why This Venue?
            </h4>
            <p className="text-muted-foreground">{result.reasoning}</p>
          </div>

          {/* Urgent Deadlines */}
          {result.urgentDeadlines.length > 0 && (
            <div className={`p-4 rounded-lg border ${hasUrgentFlags ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-start gap-2">
                <Clock className={`h-5 w-5 mt-0.5 ${hasUrgentFlags ? 'text-red-600' : 'text-amber-600'}`} />
                <div>
                  <h4 className={`font-semibold mb-2 ${hasUrgentFlags ? 'text-red-700' : 'text-amber-700'}`}>
                    {hasUrgentFlags ? '⚠️ Urgent Deadlines' : 'Important Deadlines'}
                  </h4>
                  <ul className="space-y-1">
                    {result.urgentDeadlines.map((deadline, index) => (
                      <li key={index} className="text-sm">{deadline}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Flags */}
          {result.flags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {result.flags.map((flag, index) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {flag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Forms Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recommended Forms
          </CardTitle>
          <CardDescription>
            Based on your situation, these forms are most appropriate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Forms */}
          {primaryForms.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Start With These (Primary)
              </h4>
              <div className="space-y-3">
                {primaryForms.map((form, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-colors"
                    onClick={() => onSelectForm(form)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{form.formCode}</span>
                          <Badge variant="outline" className="text-xs">
                            {form.confidence}% match
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{form.formTitle}</p>
                        <p className="text-sm text-muted-foreground mt-1">{form.reason}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Forms */}
          {secondaryForms.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                You May Also Need (Secondary)
              </h4>
              <div className="space-y-2">
                {secondaryForms.map((form, index) => (
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
            </div>
          )}

          {/* Optional Forms */}
          {optionalForms.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                Optional / Situational
              </h4>
              <div className="flex flex-wrap gap-2">
                {optionalForms.map((form, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => onSelectForm(form)}
                  >
                    {form.formCode}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps Card */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
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

      {/* Alternative Venues */}
      {result.alternativeVenues && result.alternativeVenues.length > 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Other Options to Consider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.alternativeVenues.map((alt, index) => {
                const AltIcon = venueIcons[alt.venue] || Scale;
                return (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <AltIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium capitalize">{alt.venue.replace('-', ' ')}</span>
                      <p className="text-xs text-muted-foreground">{alt.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={isLoading}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Revise My Description
        </Button>
        <Button onClick={onProceed} className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Case & Uploading...
            </>
          ) : (
            <>
              Proceed to Forms
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Official Portal Link */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Official portal:{" "}
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            {portalUrl}
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  );
};

export default TriageResults;
