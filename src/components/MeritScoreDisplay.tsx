import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, Scale, FileText, Gavel, Clock, TrendingUp } from "lucide-react";
import { MeritScoreResult, getBandColor, getComponentColor } from "@/hooks/useFormalMeritScore";
import { NextStepsActionPanel } from "@/components/NextStepsActionPanel";
import { cn } from "@/lib/utils";

interface MeritScoreDisplayProps {
  result: MeritScoreResult;
  compact?: boolean;
  caseId?: string;
  venue?: string;
}

export function MeritScoreDisplay({ result, compact = false, caseId, venue }: MeritScoreDisplayProps) {
  const { score, band, breakdown, top_strengths, top_risks, next_best_actions, element_coverage, deadline_warnings } = result;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
            <circle
              cx="32" cy="32" r="28" fill="none" strokeWidth="4"
              strokeDasharray={`${(score / 100) * 176} 176`}
              className={cn(
                score >= 65 ? "stroke-green-500" :
                score >= 50 ? "stroke-amber-500" :
                score >= 35 ? "stroke-orange-500" : "stroke-red-500"
              )}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{score}</span>
        </div>
        <div>
          <Badge className={cn("border", getBandColor(band))}>{band}</Badge>
          <p className="text-sm text-muted-foreground mt-1">Merit Score</p>
        </div>
      </div>
    );
  }

  // Generate dynamic explanation based on score
  const getScoreExplanation = () => {
    if (score >= 70) {
      return "Based on the evidence you uploaded and similar Canadian cases, your situation shows moderate to strong legal merit. This means you likely have valid legal issues worth pursuing, though outcomes can depend on next steps and additional evidence.";
    } else if (score >= 50) {
      return "Based on your evidence and similar Canadian cases, your situation shows some legal merit. There may be valid issues to pursue, but strengthening your evidence or addressing gaps could significantly improve your position.";
    } else if (score >= 35) {
      return "Based on your evidence, your situation shows limited legal merit at this time. This doesn't mean you have no case, but it may require additional evidence or a different approach to strengthen your position.";
    }
    return "Based on the current evidence, your situation shows weak legal merit. Consider gathering more documentation or consulting with a legal professional to better understand your options.";
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-4">
        <div className="text-center">
          <CardTitle className="text-xl sm:text-2xl mb-2">Your Case Assessment</CardTitle>
          <CardDescription>Based on your evidence and Canadian law</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display - Prominent */}
        <div className="text-center py-4">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
              <circle
                cx="64" cy="64" r="56" fill="none" strokeWidth="8"
                strokeDasharray={`${(score / 100) * 352} 352`}
                className={cn(
                  score >= 65 ? "stroke-green-500" :
                  score >= 50 ? "stroke-amber-500" :
                  score >= 35 ? "stroke-orange-500" : "stroke-red-500"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{score}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <Badge className={cn("mt-3 text-sm px-4 py-1 border", getBandColor(band))}>
            {band}
          </Badge>
        </div>

        {/* What This Means */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">What this means</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getScoreExplanation()}
          </p>
        </div>

        {/* Deadline Warnings */}
        {deadline_warnings.length > 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive font-medium mb-2">
              <Clock className="w-4 h-4" />
              Deadline Warnings
            </div>
            {deadline_warnings.map((warning, idx) => (
              <p key={idx} className="text-sm text-destructive">{warning}</p>
            ))}
          </div>
        )}

        {/* Strengths & Weaknesses - Plain Language */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
            <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              What strengthens your case
            </h4>
            <ul className="space-y-2">
              {top_strengths.length > 0 ? top_strengths.map((s, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  {s}
                </li>
              )) : (
                <>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    Evidence supports your version of events
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    Issues raised are recognized under Canadian law
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              What could weaken your case
            </h4>
            <ul className="space-y-2">
              {top_risks.length > 0 ? top_risks.map((r, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  {r}
                </li>
              )) : (
                <>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    Some timelines or documents may be missing
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    Additional proof could improve clarity
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground italic">
          This assessment is informational, not legal advice.
        </p>

        {/* What This Score Is For */}
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium text-sm mb-3">What this score is for</h4>
          <p className="text-sm text-muted-foreground mb-3">This score helps you decide:</p>
          <ul className="space-y-1 text-sm text-muted-foreground mb-3">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Whether to move forward
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              What kind of legal action may apply
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              How much preparation is worthwhile
            </li>
          </ul>
          <p className="text-xs text-muted-foreground">It does not guarantee an outcome.</p>
        </div>

        {/* Score Breakdown - Collapsible */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full">
            <ChevronDown className="w-4 h-4" />
            View detailed score breakdown
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <ScoreComponent label="Path Fit" score={breakdown.path_fit} max={15} icon={<TrendingUp className="w-4 h-4" />} />
            <ScoreComponent label="Legal Elements" score={breakdown.elements} max={25} icon={<FileText className="w-4 h-4" />} />
            <ScoreComponent label="Evidence Strength" score={breakdown.evidence} max={25} icon={<FileText className="w-4 h-4" />} />
            <ScoreComponent label="Case Law Support" score={breakdown.case_law} max={25} icon={<Gavel className="w-4 h-4" />} />
            {breakdown.penalty < 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  Deadline Penalty
                </span>
                <span className="font-medium text-destructive">{breakdown.penalty}</span>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Element Coverage (Collapsible) */}
        {element_coverage.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full">
              <ChevronDown className="w-4 h-4" />
              View legal element coverage ({element_coverage.length} elements)
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-2">
                {element_coverage.map((el, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                    <span className="flex items-center gap-2">
                      {el.score >= 2 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : el.score >= 1 ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      {el.element_name}
                    </span>
                    <div className="flex items-center gap-2">
                      {el.evidence_matched && (
                        <Badge variant="outline" className="text-xs">Evidence ✓</Badge>
                      )}
                      <Badge variant="secondary">{el.score}/3</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* What Happens Next - Action Panel (integrated, not separate) */}
        {!compact && <NextStepsActionPanel caseId={caseId} venue={venue} className="mt-6" />}
      </CardContent>
    </Card>
  );
}

function ScoreComponent({ label, score, max, icon }: { label: string; score: number; max: number; icon: React.ReactNode }) {
  const pct = (score / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">{icon}{label}</span>
        <span className="font-medium">{score}/{max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", getComponentColor(score, max))}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
