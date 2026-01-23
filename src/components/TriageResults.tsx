import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NextStepsActionPanel } from "@/components/NextStepsActionPanel";
import { MeritScoreBadge } from "@/components/MeritScoreBadge";
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
  Loader2,
  Target,
  TrendingUp,
  Zap,
  Info,
  ChevronRight,
  Compass
} from "lucide-react";

interface FormRecommendation {
  formCode: string;
  formTitle: string;
  confidence: number;
  reason: string;
  tribunalType: string;
  priority: 'primary' | 'secondary' | 'optional';
}

interface MeritBreakdown {
  evidenceQuantity: number;
  evidenceRelevance: number;
  timelineCompleteness: number;
  internalConsistency: number;
  precedentAlignment: number;
  remedyStrength: number;
  penalty: number;
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
  meritBreakdown?: MeritBreakdown;
  meritStrengths?: string[];
  meritWeaknesses?: string[];
}

interface TriageResultsProps {
  result: TriageResult;
  description: string;
  province: string;
  caseId?: string;
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

// Helper to get score band label
function getScoreBand(score: number): { label: string; color: string; description: string } {
  if (score >= 70) return { 
    label: "Strong Case", 
    color: "text-green-600 bg-green-50 border-green-200",
    description: "Strong chance if filed correctly"
  };
  if (score >= 40) return { 
    label: "Viable Case", 
    color: "text-amber-600 bg-amber-50 border-amber-200",
    description: "Viable but may need strengthening"
  };
  return { 
    label: "Needs Work", 
    color: "text-red-600 bg-red-50 border-red-200",
    description: "Weak as currently presented — but here's why"
  };
}

// Generate plain English explanation from breakdown
function generatePlainExplanation(result: TriageResult): string {
  const breakdown = result.meritBreakdown;
  if (!breakdown) {
    return result.reasoning || "Your case has been analyzed based on your description.";
  }

  const parts: string[] = [];
  
  // Evidence assessment
  const evidenceScore = breakdown.evidenceQuantity + breakdown.evidenceRelevance;
  if (evidenceScore >= 30) {
    parts.push("Your evidence appears strong and directly supports your legal claim");
  } else if (evidenceScore >= 20) {
    parts.push("You have some supporting evidence, but additional documentation would strengthen your case");
  } else {
    parts.push("More evidence would help support your position");
  }

  // Timeline/consistency
  if (breakdown.timelineCompleteness >= 12) {
    parts.push("the timeline of events is clear and consistent");
  } else if (breakdown.timelineCompleteness >= 8) {
    parts.push("you have a reasonable timeline, though some gaps exist");
  }

  // Legal match
  if (breakdown.precedentAlignment >= 15) {
    parts.push("your situation aligns well with recognized legal claims");
  } else if (breakdown.precedentAlignment >= 10) {
    parts.push("your situation may fit legal criteria with proper framing");
  }

  // Penalty warnings
  if (breakdown.penalty < 0) {
    parts.push("⚠️ Note: There may be deadline or procedural concerns to address");
  }

  return parts.length > 0 
    ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + (parts.length > 1 ? ", and " + parts.slice(1).join(", ") + "." : ".")
    : result.reasoning;
}

const TriageResults: React.FC<TriageResultsProps> = ({
  result,
  description,
  province,
  caseId,
  onProceed,
  onBack,
  onSelectForm,
  isLoading = false,
}) => {
  const VenueIcon = venueIcons[result.venue] || Scale;
  const venueColor = venueColors[result.venue] || "bg-gray-50 text-gray-700 border-gray-200";
  const portalUrl = venuePortals[result.venue] || "https://www.ontario.ca/";

  const primaryForms = result.recommendedForms.filter(f => f.priority === 'primary');
  const secondaryForms = result.recommendedForms.filter(f => f.priority === 'secondary');
  const scoreBand = getScoreBand(result.confidence);
  const plainExplanation = generatePlainExplanation(result);

  return (
    <div className="space-y-6">
      {/* ========== STEP 1: MERIT SCORE - UNAVOIDABLE ========== */}
      <Card className="overflow-hidden border-2 border-primary/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-6 w-6 text-primary" />
              Your Case Assessment
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              FREE Analysis
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Score Display - Large and prominent */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-muted/50 border">
              <div className="text-5xl font-bold text-foreground">
                {result.confidence}
              </div>
              <div className="text-left">
                <div className="text-sm text-muted-foreground">out of 100</div>
                <Badge className={`mt-1 ${scoreBand.color}`}>
                  {scoreBand.label}
                </Badge>
              </div>
            </div>
            <p className="text-lg font-medium text-foreground">
              {scoreBand.description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={result.confidence} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Weak</span>
              <span>Moderate</span>
              <span>Strong</span>
            </div>
          </div>

          {/* ========== STEP 2: PLAIN ENGLISH EXPLANATION ========== */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Why You Got This Score
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {plainExplanation}
            </p>
          </div>

          {/* Score Breakdown - Visual bars */}
          {result.meritBreakdown && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <ScoreItem 
                label="Evidence Strength" 
                score={result.meritBreakdown.evidenceQuantity + result.meritBreakdown.evidenceRelevance} 
                max={40} 
              />
              <ScoreItem 
                label="Legal Issue Match" 
                score={result.meritBreakdown.precedentAlignment} 
                max={20} 
              />
              <ScoreItem 
                label="Timeline Clarity" 
                score={result.meritBreakdown.timelineCompleteness + result.meritBreakdown.internalConsistency} 
                max={30} 
              />
              <ScoreItem 
                label="Remedy Strength" 
                score={result.meritBreakdown.remedyStrength} 
                max={10} 
              />
            </div>
          )}

          {/* Strengths & Weaknesses - What matters to users */}
          {(result.meritStrengths?.length || result.meritWeaknesses?.length) ? (
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
              {result.meritStrengths && result.meritStrengths.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    Your Strengths
                  </h4>
                  <ul className="space-y-1.5">
                    {result.meritStrengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.meritWeaknesses && result.meritWeaknesses.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    To Improve
                  </h4>
                  <ul className="space-y-1.5">
                    {result.meritWeaknesses.slice(0, 3).map((w, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">⚠</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Urgent Deadlines - Critical visibility */}
      {result.urgentDeadlines.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                  ⏰ Important Deadlines
                </h4>
                <ul className="space-y-1">
                  {result.urgentDeadlines.map((deadline, index) => (
                    <li key={index} className="text-sm text-red-600 dark:text-red-400">{deadline}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========== STEP 3: GUIDED LEGAL PATHWAY (NOT "PICK A FORM") ========== */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Compass className="h-5 w-5 text-primary" />
            Recommended Legal Pathway
          </CardTitle>
          <CardDescription>
            Based on your situation, here is the most likely path forward
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* PRIMARY PATHWAY */}
          {primaryForms.length > 0 && (
            <div className={`p-4 rounded-lg border-2 ${venueColor}`}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-background flex-shrink-0">
                  <VenueIcon className="h-8 w-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="default" className="text-xs bg-primary">
                      🧭 Primary Path
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-1">
                    {result.venueTitle}
                  </h3>
                  <p className="text-sm opacity-90 mb-3">
                    {primaryForms[0].formCode} – {primaryForms[0].formTitle}
                  </p>
                  
                  {/* Why it applies */}
                  <div className="text-sm space-y-2 mb-4">
                    <div>
                      <span className="font-medium">Why this applies: </span>
                      <span className="opacity-80">{primaryForms[0].reason}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECONDARY PATHWAYS */}
          {secondaryForms.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Additional Options (May Strengthen Your Case)
              </p>
              {secondaryForms.map((form, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          🔁 Secondary
                        </Badge>
                        <span className="font-medium text-sm">{form.formCode}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{form.formTitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">{form.reason}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Alternative venues */}
          {result.alternativeVenues && result.alternativeVenues.length > 0 && (
            <div className="pt-3 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Escalation Options
              </p>
              {result.alternativeVenues.map((alt, index) => (
                <div key={index} className="p-2 rounded border border-dashed text-sm">
                  <span className="font-medium">⚠️ {alt.venue}</span>
                  <span className="text-muted-foreground ml-2">{alt.reason}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========== STEP 4: FORMS AS ACTIONS (NOT A MENU) ========== */}
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Next Step
          </CardTitle>
          <CardDescription>
            You now understand your case. Ready to take action?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Primary action */}
          {primaryForms.length > 0 && (
            <Button 
              onClick={onProceed} 
              size="lg" 
              className="w-full gap-2 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Generate {primaryForms[0].formCode} Application
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Recommended
                  </Badge>
                </>
              )}
            </Button>
          )}

          {/* Secondary action */}
          {secondaryForms.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => onSelectForm(secondaryForms[0])}
              className="w-full gap-2"
              disabled={isLoading}
            >
              <Clock className="h-4 w-4" />
              Generate {secondaryForms[0].formCode} (Optional – strengthens your case)
            </Button>
          )}

          {/* What payment unlocks */}
          <div className="pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground mb-3">
              Generating documents unlocks:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Auto-filled forms
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Filing instructions
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Service steps
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Hearing prep guide
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next - Action Panel */}
      <NextStepsActionPanel caseId={caseId} venue={result.venue} />

      {/* Informational disclaimer */}
      <div className="p-4 rounded-lg border border-muted bg-muted/30 text-center">
        <p className="text-sm text-muted-foreground">
          <Shield className="h-4 w-4 inline mr-1" />
          This is informational guidance, not legal advice. You stay in control at every step.
        </p>
      </div>

      {/* Back Button & External Link */}
      <div className="flex justify-between items-center">
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

// Helper component for score breakdown items
function ScoreItem({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = Math.min(100, (score / max) * 100);
  const getColor = () => {
    if (pct >= 70) return "bg-green-500";
    if (pct >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${getColor()}`} 
          style={{ width: `${pct}%` }} 
        />
      </div>
    </div>
  );
}

export default TriageResults;