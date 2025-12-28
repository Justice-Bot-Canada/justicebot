import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, Scale, FileText, Gavel, Clock, TrendingUp } from "lucide-react";
import { MeritScoreResult, getBandColor, getComponentColor } from "@/hooks/useFormalMeritScore";
import { cn } from "@/lib/utils";

interface MeritScoreDisplayProps {
  result: MeritScoreResult;
  compact?: boolean;
}

export function MeritScoreDisplay({ result, compact = false }: MeritScoreDisplayProps) {
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

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Formal Merit Score
            </CardTitle>
            <CardDescription>AI-powered case strength analysis</CardDescription>
          </div>
          <Badge className={cn("text-lg px-4 py-1 border", getBandColor(band))}>
            {score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Band */}
        <div className="text-center">
          <div className="text-2xl font-bold">{band}</div>
          <Progress value={score} className="h-3 mt-2" />
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

        {/* Score Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Score Breakdown</h4>
          
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
        </div>

        {/* Strengths & Risks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Strengths
            </h4>
            <ul className="space-y-1">
              {top_strengths.map((s, idx) => (
                <li key={idx} className="text-xs text-muted-foreground">{s}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Risks
            </h4>
            <ul className="space-y-1">
              {top_risks.map((r, idx) => (
                <li key={idx} className="text-xs text-muted-foreground">{r}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Actions */}
        {next_best_actions.length > 0 && (
          <div className="p-3 bg-primary/5 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Recommended Next Steps</h4>
            <ul className="space-y-1">
              {next_best_actions.map((action, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-primary font-medium">{idx + 1}.</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Element Coverage (Collapsible) */}
        {element_coverage.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full">
              <ChevronDown className="w-4 h-4" />
              View Legal Element Coverage ({element_coverage.length} elements)
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
