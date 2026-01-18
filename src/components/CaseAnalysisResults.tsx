import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  FileText, 
  Clock, 
  DollarSign,
  ChevronDown,
  ChevronRight,
  Lock,
  Sparkles,
  ExternalLink,
  BookOpen,
  Gavel
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import type { PipelineResult, MeritScore, Pathway, FormSuggestion, Precedent } from '@/hooks/useCasePipeline';
import { getBandColor, getScoreProgressColor } from '@/hooks/useCasePipeline';

interface CaseAnalysisResultsProps {
  result: PipelineResult;
  caseId: string;
  onUnlockClick?: () => void;
}

export function CaseAnalysisResults({ result, caseId, onUnlockClick }: CaseAnalysisResultsProps) {
  const navigate = useNavigate();
  const { hasAccess, tier } = usePremiumAccess();
  const isPremium = hasAccess && (tier === 'monthly' || tier === 'yearly');
  
  const [expandedPathways, setExpandedPathways] = useState<Set<string>>(new Set());

  const togglePathway = (id: string) => {
    const newExpanded = new Set(expandedPathways);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPathways(newExpanded);
  };

  const handleStartForm = (formCode: string) => {
    navigate(`/forms?code=${formCode}&case=${caseId}`);
  };

  const handleUnlock = () => {
    if (onUnlockClick) {
      onUnlockClick();
    } else {
      navigate('/pricing');
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== MERIT SCORE (ALWAYS FREE) ===== */}
      <MeritScoreCard meritScore={result.meritScore} evidenceCount={result.evidenceCount} />

      {/* ===== LEGAL PATHWAYS ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Legal Pathways
          </CardTitle>
          <CardDescription>
            {result.pathways.length} pathway{result.pathways.length !== 1 ? 's' : ''} identified for your case
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.pathways.map((pathway) => (
            <PathwayCard 
              key={pathway.id}
              pathway={pathway}
              isExpanded={expandedPathways.has(pathway.id)}
              onToggle={() => togglePathway(pathway.id)}
              isPremium={isPremium}
              onUnlock={handleUnlock}
            />
          ))}
        </CardContent>
      </Card>

      {/* ===== FORM SUGGESTIONS ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recommended Forms
            {!isPremium && (
              <Badge variant="secondary" className="ml-2">
                <Lock className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Official forms matched to your case
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <div className="space-y-3">
              {result.formSuggestions.map((form, idx) => (
                <FormSuggestionCard 
                  key={idx} 
                  form={form} 
                  onStart={() => handleStartForm(form.formCode)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Show form names only (locked) */}
              {result.formSuggestions.slice(0, 2).map((form, idx) => (
                <div key={idx} className="p-3 border rounded-lg bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{form.formCode} - {form.formName}</p>
                      <p className="text-sm text-muted-foreground">{form.tribunal}</p>
                    </div>
                  </div>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
              
              {result.formSuggestions.length > 2 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{result.formSuggestions.length - 2} more forms available
                </p>
              )}
              
              <Button onClick={handleUnlock} className="w-full mt-4 gap-2">
                <Sparkles className="h-4 w-4" />
                Unlock Forms & Filing Instructions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== PRECEDENTS ===== */}
      {result.precedents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Similar Cases
              {!isPremium && (
                <Badge variant="secondary" className="ml-2">
                  <Lock className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {result.precedents.length} relevant precedent{result.precedents.length !== 1 ? 's' : ''} from CanLII
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPremium ? (
              <div className="space-y-3">
                {result.precedents.map((p, idx) => (
                  <PrecedentCard key={idx} precedent={p} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {result.precedents.slice(0, 1).map((p, idx) => (
                  <div key={idx} className="p-3 border rounded-lg bg-muted/30">
                    <p className="font-medium text-primary">{p.citation}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Unlock to see full case details and outcome analysis
                    </p>
                  </div>
                ))}
                {result.precedents.length > 1 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{result.precedents.length - 1} more precedents available
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ===== MERIT SCORE CARD (ALWAYS FREE) =====
function MeritScoreCard({ meritScore, evidenceCount }: { meritScore: MeritScore; evidenceCount: number }) {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Case Readiness Score
        </CardTitle>
        <CardDescription>
          Based on {evidenceCount} document{evidenceCount !== 1 ? 's' : ''} analyzed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center space-y-3">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${getBandColor(meritScore.band)}`}>
            <span className="text-3xl font-bold">{meritScore.score}</span>
          </div>
          <Badge className={getBandColor(meritScore.band)}>
            {meritScore.band}
          </Badge>
          <Progress 
            value={meritScore.score} 
            className="h-2"
          />
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Evidence Quantity</span>
            <span className="font-medium">{meritScore.breakdown.evidenceQuantity}/20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Evidence Relevance</span>
            <span className="font-medium">{meritScore.breakdown.evidenceRelevance}/20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Timeline</span>
            <span className="font-medium">{meritScore.breakdown.timelineCompleteness}/15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Consistency</span>
            <span className="font-medium">{meritScore.breakdown.internalConsistency}/15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Legal Pattern</span>
            <span className="font-medium">{meritScore.breakdown.precedentAlignment}/20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remedy Clarity</span>
            <span className="font-medium">{meritScore.breakdown.remedyStrength}/10</span>
          </div>
        </div>

        {/* Strengths */}
        {meritScore.strengths.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Strengths
            </h4>
            <ul className="space-y-1">
              {meritScore.strengths.map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {meritScore.weaknesses.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              Areas to Improve
            </h4>
            <ul className="space-y-1">
              {meritScore.weaknesses.map((w, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">⚠</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gaps */}
        {meritScore.gaps.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Missing:</strong> {meritScore.gaps.join(', ')}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// ===== PATHWAY CARD =====
function PathwayCard({ 
  pathway, 
  isExpanded, 
  onToggle, 
  isPremium,
  onUnlock 
}: { 
  pathway: Pathway; 
  isExpanded: boolean; 
  onToggle: () => void;
  isPremium: boolean;
  onUnlock: () => void;
}) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className={`border rounded-lg ${pathway.isPrimary ? 'border-primary bg-primary/5' : ''}`}>
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{pathway.name}</span>
                {pathway.isPrimary && (
                  <Badge variant="default" className="text-xs">Recommended</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{pathway.forum}</p>
            </div>
          </div>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            {/* Free: Basic Info */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Timeline</div>
                  <div className="font-medium">{pathway.estimatedTimeline}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Cost</div>
                  <div className="font-medium">{pathway.estimatedCost}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Outlook</div>
                  <div className="font-medium text-xs">{pathway.successRate}</div>
                </div>
              </div>
            </div>

            {/* Premium: Detailed Info */}
            {isPremium ? (
              <>
                <div>
                  <h5 className="font-medium mb-1">Why This Applies</h5>
                  <p className="text-sm text-muted-foreground">{pathway.whyApplies}</p>
                </div>

                <div>
                  <h5 className="font-medium mb-2">What You Must Prove</h5>
                  <ul className="text-sm space-y-1">
                    {pathway.whatToProve.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {pathway.risks.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 text-amber-600">Risks</h5>
                    <ul className="text-sm space-y-1">
                      {pathway.risks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600">⚠</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pathway.deadlines.length > 0 && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Deadlines:</strong> {pathway.deadlines.join(' • ')}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <div className="pt-2">
                <Button variant="outline" onClick={onUnlock} className="w-full gap-2">
                  <Lock className="h-4 w-4" />
                  Unlock Full Pathway Details
                </Button>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ===== FORM SUGGESTION CARD =====
function FormSuggestionCard({ form, onStart }: { form: FormSuggestion; onStart: () => void }) {
  return (
    <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono">{form.formCode}</Badge>
            <span className="font-medium">{form.formName}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{form.purpose}</p>
          <div className="flex flex-wrap gap-1">
            {form.conditions.slice(0, 2).map((c, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
            ))}
          </div>
        </div>
        <Button size="sm" onClick={onStart} className="gap-1">
          <FileText className="h-4 w-4" />
          Start
        </Button>
      </div>
    </div>
  );
}

// ===== PRECEDENT CARD =====
function PrecedentCard({ precedent }: { precedent: Precedent }) {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-start justify-between gap-2">
        <div>
          <a 
            href={precedent.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline flex items-center gap-1"
          >
            {precedent.citation}
            <ExternalLink className="h-3 w-3" />
          </a>
          {precedent.title && (
            <p className="text-sm text-muted-foreground mt-1">{precedent.title}</p>
          )}
          {precedent.outcome && (
            <p className="text-sm mt-1">
              <strong>Outcome:</strong> {precedent.outcome}
            </p>
          )}
        </div>
        {precedent.relevance && (
          <Badge variant="secondary">{Math.round(precedent.relevance * 100)}% match</Badge>
        )}
      </div>
    </div>
  );
}

export default CaseAnalysisResults;
