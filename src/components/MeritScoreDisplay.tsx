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

  // Determine score range: LOW (0-39), MEDIUM (40-69), HIGH (70-100)
  const getScoreRange = (): 'low' | 'medium' | 'high' => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const scoreRange = getScoreRange();

  // Generate dynamic explanation based on score range
  const getScoreExplanation = () => {
    if (scoreRange === 'high') {
      return "Your evidence shows strong legal merit. Similar cases have proceeded successfully, and your situation appears well-supported.";
    } else if (scoreRange === 'medium') {
      return "Your evidence shows possible legal issues, but the case may need clarification or stronger proof to proceed confidently.";
    }
    return "Based on the evidence provided, your situation currently shows low legal merit. This doesn't mean nothing happened — it means the available evidence may not clearly support a legal claim yet.";
  };

  // Get strengths/weaknesses copy based on range
  const getStrengthsCopy = () => {
    if (scoreRange === 'high') {
      return {
        title: "Why your score is strong",
        items: top_strengths.length > 0 ? top_strengths : [
          "Evidence aligns with recognized legal issues",
          "Timelines and documentation are clear",
          "Comparable cases support your position"
        ]
      };
    } else if (scoreRange === 'medium') {
      return {
        title: "What's working",
        items: top_strengths.length > 0 ? top_strengths : [
          "Some evidence supports your concerns",
          "Issues raised are recognized under Canadian law"
        ]
      };
    }
    return {
      title: "Common reasons for a low score",
      items: top_strengths.length > 0 ? top_strengths : [
        "Key documents or dates are missing",
        "Evidence doesn't clearly show a legal breach",
        "More context is needed to connect events to legal rights"
      ]
    };
  };

  const getWeaknessesCopy = () => {
    if (scoreRange === 'high') {
      return {
        title: "Important",
        message: "Strong merit does not guarantee outcomes, but it does support moving forward.",
        items: top_risks
      };
    } else if (scoreRange === 'medium') {
      return {
        title: "What could improve",
        items: top_risks.length > 0 ? top_risks : [
          "Additional documents or timelines",
          "Clear proof of impact or breach"
        ]
      };
    }
    return {
      title: "Important",
      message: "Many cases start here and improve once the right evidence is added.",
      items: top_risks
    };
  };

  const strengthsCopy = getStrengthsCopy();
  const weaknessesCopy = getWeaknessesCopy();

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

        {/* Strengths & Weaknesses - Range-specific copy */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className={cn(
            "p-4 rounded-lg border",
            scoreRange === 'high' ? "bg-green-500/5 border-green-500/20" :
            scoreRange === 'medium' ? "bg-blue-500/5 border-blue-500/20" :
            "bg-amber-500/5 border-amber-500/20"
          )}>
            <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
              {scoreRange === 'high' ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : scoreRange === 'medium' ? (
                <CheckCircle className="w-4 h-4 text-blue-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              {strengthsCopy.title}
            </h4>
            <ul className="space-y-2">
              {strengthsCopy.items.map((s, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className={cn(
                    "mt-0.5",
                    scoreRange === 'high' ? "text-green-600" :
                    scoreRange === 'medium' ? "text-blue-600" : "text-amber-600"
                  )}>•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          
          <div className={cn(
            "p-4 rounded-lg border",
            scoreRange === 'low' ? "bg-blue-500/5 border-blue-500/20" : "bg-amber-500/5 border-amber-500/20"
          )}>
            <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
              {scoreRange === 'high' ? (
                <Scale className="w-4 h-4 text-amber-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              {weaknessesCopy.title}
            </h4>
            {weaknessesCopy.message && (
              <p className="text-sm text-muted-foreground mb-2">{weaknessesCopy.message}</p>
            )}
            {weaknessesCopy.items && weaknessesCopy.items.length > 0 && (
              <ul className="space-y-2">
                {weaknessesCopy.items.map((r, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            )}
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
        {!compact && <NextStepsActionPanel caseId={caseId} venue={venue} score={score} className="mt-6" />}
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
