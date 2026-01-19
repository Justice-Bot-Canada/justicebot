import { cn } from "@/lib/utils";
import { Scale, TrendingUp, AlertTriangle, CheckCircle, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface MeritBreakdown {
  evidenceQuantity?: number;
  evidenceRelevance?: number;
  timelineCompleteness?: number;
  internalConsistency?: number;
  precedentAlignment?: number;
  remedyStrength?: number;
  penalty?: number;
  // Alternative format from formal-merit-score
  path_fit?: number;
  elements?: number;
  evidence?: number;
  case_law?: number;
}

interface MeritScoreBadgeProps {
  score: number | null | undefined;
  showExplanation?: boolean;
  showBreakdown?: boolean;
  breakdown?: MeritBreakdown;
  strengths?: string[];
  weaknesses?: string[];
  compact?: boolean;
  className?: string;
}

export function getMeritBand(score: number): string {
  if (score >= 80) return "Very Strong";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Moderate";
  if (score >= 35) return "Fair";
  return "Weak";
}

export function getMeritColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
  if (score >= 65) return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800";
  if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800";
  if (score >= 35) return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800";
  return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
}

export function getMeritProgressColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 65) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  if (score >= 35) return "bg-orange-500";
  return "bg-red-500";
}

function getScoreExplanation(score: number): string {
  if (score >= 70) {
    return "Your case shows strong legal merit based on your evidence and situation. Similar cases have proceeded successfully.";
  } else if (score >= 50) {
    return "Your case shows moderate merit. Additional evidence or clarification could strengthen your position.";
  } else if (score >= 35) {
    return "Your case shows fair merit but has gaps. Consider adding more supporting documents or details.";
  }
  return "Your case currently shows low merit. This may mean evidence is missing or the situation doesn't clearly fit legal criteria. This can improve with more documentation.";
}

export function MeritScoreBadge({ 
  score, 
  showExplanation = false, 
  showBreakdown = false,
  breakdown,
  strengths = [],
  weaknesses = [],
  compact = false,
  className 
}: MeritScoreBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle null/undefined scores
  if (score === null || score === undefined) {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-lg border bg-muted/50", className)}>
        <Scale className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Merit score pending...</span>
      </div>
    );
  }

  const band = getMeritBand(score);
  const colorClass = getMeritColor(score);
  const progressColorClass = getMeritProgressColor(score);

  // Compact inline badge
  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border", colorClass)}>
          <Scale className="h-4 w-4" />
          <span className="font-bold">{score}</span>
          <span className="text-xs opacity-80">/ 100</span>
        </div>
        <Badge variant="outline" className={cn("text-xs", colorClass)}>{band}</Badge>
      </div>
    );
  }

  // Full card display
  return (
    <Card className={cn("border-2", colorClass.includes('green') ? 'border-green-200/50' : colorClass.includes('amber') ? 'border-amber-200/50' : 'border-red-200/50', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            <span>Case Merit Score</span>
          </div>
          <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border", colorClass)}>
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-sm opacity-80">/ 100</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={score} className="h-3" />
          <div className="flex justify-between text-sm">
            <Badge className={cn("border", colorClass)}>{band}</Badge>
            <span className="text-muted-foreground text-xs">
              {score >= 65 ? "Ready to proceed" : score >= 50 ? "May need more evidence" : "Strengthen your case"}
            </span>
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getScoreExplanation(score)}
            </p>
          </div>
        )}

        {/* What this score is based on */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Your score is based on:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Strength and relevance of your evidence</li>
            <li>How well your situation matches recognized legal claims</li>
            <li>Timeline compliance and deadline status</li>
            <li>Pattern match with similar successful cases</li>
          </ul>
        </div>

        {/* Breakdown toggle */}
        {showBreakdown && breakdown && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full pt-2 border-t">
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
              View detailed breakdown
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-2">
              {/* Show breakdown based on available format */}
              {breakdown.evidenceQuantity !== undefined && (
                <>
                  <BreakdownItem label="Evidence Quantity" score={breakdown.evidenceQuantity} max={20} />
                  <BreakdownItem label="Evidence Relevance" score={breakdown.evidenceRelevance || 0} max={20} />
                  <BreakdownItem label="Timeline Completeness" score={breakdown.timelineCompleteness || 0} max={15} />
                  <BreakdownItem label="Internal Consistency" score={breakdown.internalConsistency || 0} max={15} />
                  <BreakdownItem label="Legal Pattern Match" score={breakdown.precedentAlignment || 0} max={20} />
                  <BreakdownItem label="Remedy Clarity" score={breakdown.remedyStrength || 0} max={10} />
                  {(breakdown.penalty || 0) < 0 && (
                    <div className="flex items-center justify-between text-sm text-red-600">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Deadline Penalty
                      </span>
                      <span className="font-medium">{breakdown.penalty}</span>
                    </div>
                  )}
                </>
              )}
              {breakdown.path_fit !== undefined && (
                <>
                  <BreakdownItem label="Path Fit" score={breakdown.path_fit} max={15} />
                  <BreakdownItem label="Legal Elements" score={breakdown.elements || 0} max={25} />
                  <BreakdownItem label="Evidence Strength" score={breakdown.evidence || 0} max={25} />
                  <BreakdownItem label="Case Law Support" score={breakdown.case_law || 0} max={25} />
                  {(breakdown.penalty || 0) < 0 && (
                    <div className="flex items-center justify-between text-sm text-red-600">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Deadline Penalty
                      </span>
                      <span className="font-medium">{breakdown.penalty}</span>
                    </div>
                  )}
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Strengths and Weaknesses */}
        {(strengths.length > 0 || weaknesses.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t">
            {strengths.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1 text-green-600 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {strengths.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-green-600">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {weaknesses.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1 text-amber-600 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  To Improve
                </h4>
                <ul className="space-y-1">
                  {weaknesses.slice(0, 3).map((w, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-amber-600">⚠</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-center text-muted-foreground italic pt-2 border-t">
          This is an informational assessment, not legal advice.
        </p>
      </CardContent>
    </Card>
  );
}

function BreakdownItem({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = (score / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score}/{max}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all",
            pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"
          )} 
          style={{ width: `${pct}%` }} 
        />
      </div>
    </div>
  );
}

export default MeritScoreBadge;
