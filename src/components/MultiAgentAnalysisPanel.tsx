import { useState } from 'react';
import { useMultiAgentAnalysis, AgentRole, MultiAgentAnalysis, CaseDetails, ActionItem, LawReference, Precedent, StrengthWeakness, RiskFactor, DocumentRequirement, KeyArgument, NextStep } from '@/hooks/useMultiAgentAnalysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Search, 
  BarChart3, 
  Lightbulb, 
  FileText, 
  CheckCircle2,
  Clock,
  AlertTriangle,
  Target,
  Scale,
  Loader2,
  LucideIcon
} from 'lucide-react';

interface MultiAgentAnalysisPanelProps {
  caseId?: string;
  caseDetails: CaseDetails;
  caseType: string;
  province?: string;
}

const AGENT_INFO: Record<AgentRole, { icon: LucideIcon; label: string; description: string }> = {
  researcher: { 
    icon: Search, 
    label: 'Research Agent', 
    description: 'Searches for relevant cases and laws' 
  },
  analyst: { 
    icon: BarChart3, 
    label: 'Analyst Agent', 
    description: 'Evaluates case strength and evidence' 
  },
  strategist: { 
    icon: Lightbulb, 
    label: 'Strategist Agent', 
    description: 'Develops legal strategy' 
  },
  drafter: { 
    icon: FileText, 
    label: 'Drafter Agent', 
    description: 'Prepares document guidance' 
  }
};

export function MultiAgentAnalysisPanel({ 
  caseId, 
  caseDetails, 
  caseType, 
  province = 'ON' 
}: MultiAgentAnalysisPanelProps) {
  const { loading, analysis, currentAgent, error, runAnalysis, clearAnalysis } = useMultiAgentAnalysis();
  const [activeTab, setActiveTab] = useState('overview');

  const handleRunAnalysis = () => {
    runAnalysis(caseId || null, caseDetails, caseType, province);
  };

  const getMeritScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMeritScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (!analysis && !loading) {
    return (
      <Card className="border-2 border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Multi-Agent Legal Analysis</CardTitle>
          <CardDescription>
            Our AI agents will research, analyze, strategize, and prepare document guidance for your case.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(AGENT_INFO).map(([role, info]) => (
              <div key={role} className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <info.icon className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">{info.label}</span>
              </div>
            ))}
          </div>
          <Button onClick={handleRunAnalysis} size="lg" className="gap-2">
            <Brain className="h-5 w-5" />
            Start Multi-Agent Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Running Multi-Agent Analysis
          </CardTitle>
          <CardDescription>
            Multiple AI agents are analyzing your case...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(AGENT_INFO).map(([role, info]) => {
              const isActive = currentAgent === role;
              const isPast = analysis?.agents?.some(a => a.agent === role);
              
              return (
                <div 
                  key={role} 
                  className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primary/10 border border-primary' : 
                    isPast ? 'bg-green-50 border border-green-200' : 'bg-muted/30'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isActive ? 'bg-primary text-primary-foreground' :
                    isPast ? 'bg-green-500 text-white' : 'bg-muted'
                  }`}>
                    {isPast ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <info.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{info.label}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                  {isActive && (
                    <Badge variant="secondary" className="animate-pulse">
                      Running...
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Analysis Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRunAnalysis}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  const fa = analysis?.finalAnalysis;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Multi-Agent Analysis Results
            </CardTitle>
            <CardDescription>
              Completed in {(analysis?.totalDuration / 1000).toFixed(1)}s using {analysis?.agents.length} agents
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={clearAnalysis}>
            Run New Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            {/* Merit Score */}
            <div className={`p-6 rounded-lg ${getMeritScoreBg(fa?.meritScore || 0)}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Case Merit Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on precedents, evidence, and legal strength
                  </p>
                </div>
                <div className={`text-4xl font-bold ${getMeritScoreColor(fa?.meritScore || 0)}`}>
                  {fa?.meritScore}/100
                </div>
              </div>
              <Progress value={fa?.meritScore || 0} className="h-3" />
              <div className="mt-2 flex justify-between text-sm">
                <span>Success probability: {fa?.successProbability}</span>
                <span>Confidence: {fa?.confidence}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="prose prose-sm max-w-none">
              <h4>Executive Summary</h4>
              <p className="text-muted-foreground whitespace-pre-line">{fa?.summary}</p>
            </div>

            {/* Key Issues */}
            {fa?.keyIssues?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Key Legal Issues
                </h4>
                <div className="flex flex-wrap gap-2">
                  {fa.keyIssues.map((issue: string, i: number) => (
                    <Badge key={i} variant="outline">{issue}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {fa?.nextSteps?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Immediate Next Steps</h4>
                <div className="space-y-2">
                  {fa.nextSteps.slice(0, 5).map((step: NextStep, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {step.step || i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step.action}</p>
                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                          {step.deadline && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {step.deadline}
                            </span>
                          )}
                          {step.priority && (
                            <Badge variant={step.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                              {step.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="research" className="space-y-6 pt-4">
            {/* Relevant Laws */}
            {fa?.relevantLaws?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Relevant Legislation
                </h4>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {fa.relevantLaws.map((law: LawReference, i: number) => (
                      <Card key={i} className="p-4">
                        <h5 className="font-medium">{law.name}</h5>
                        {law.sections?.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Sections: {law.sections.join(', ')}
                          </p>
                        )}
                        <p className="text-sm mt-2">{law.application}</p>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Precedents */}
            {fa?.precedents?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Key Precedents</h4>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {fa.precedents.map((p: Precedent, i: number) => (
                      <Card key={i} className="p-4">
                        <h5 className="font-medium">{p.citation}</h5>
                        {p.court && <p className="text-sm text-muted-foreground">{p.court}</p>}
                        <p className="text-sm mt-2"><strong>Outcome:</strong> {p.outcome}</p>
                        <p className="text-sm"><strong>Relevance:</strong> {p.relevance}</p>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6 pt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div>
                <h4 className="font-semibold mb-3 text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Strengths
                </h4>
                <div className="space-y-2">
                  {fa?.strengths?.map((s: StrengthWeakness, i: number) => (
                    <div key={i} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="font-medium text-green-800">{s.factor}</p>
                      {s.evidence && <p className="text-sm text-green-600 mt-1">{s.evidence}</p>}
                      {s.impact && (
                        <Badge variant="outline" className="mt-2 text-green-700 border-green-300">
                          {s.impact} impact
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h4 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Weaknesses
                </h4>
                <div className="space-y-2">
                  {fa?.weaknesses?.map((w: StrengthWeakness, i: number) => (
                    <div key={i} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="font-medium text-red-800">{w.factor}</p>
                      {w.mitigation && (
                        <p className="text-sm text-red-600 mt-1">
                          <strong>Mitigation:</strong> {w.mitigation}
                        </p>
                      )}
                      {w.impact && (
                        <Badge variant="outline" className="mt-2 text-red-700 border-red-300">
                          {w.impact} impact
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Evidence Gaps */}
            {fa?.evidenceGaps?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-amber-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Evidence Gaps
                </h4>
                <div className="flex flex-wrap gap-2">
                  {fa.evidenceGaps.map((gap: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-amber-700 border-amber-300">
                      {gap}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Factors */}
            {fa?.riskFactors?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Risk Factors</h4>
                <div className="space-y-2">
                  {fa.riskFactors.map((r: RiskFactor, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{r.risk}</p>
                        <p className="text-sm text-muted-foreground">
                          Likelihood: {r.likelihood} | Impact: {r.impact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6 pt-4">
            {/* Primary Strategy */}
            {fa?.primaryStrategy && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Recommended Strategy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium">{fa.primaryStrategy.approach}</p>
                  <p className="text-muted-foreground">{fa.primaryStrategy.rationale}</p>
                  <div className="flex gap-4 text-sm">
                    {fa.primaryStrategy.timeline && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {fa.primaryStrategy.timeline}
                      </span>
                    )}
                    {fa.primaryStrategy.estimatedCost && (
                      <span>Est. Cost: {fa.primaryStrategy.estimatedCost}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Plan */}
            {fa?.actionPlan?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Detailed Action Plan</h4>
                <div className="space-y-3">
                  {fa.actionPlan.map((step: ActionItem, i: number) => (
                    <div key={i} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                        {step.step || i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step.action}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                          {step.deadline && <span>📅 {step.deadline}</span>}
                          {step.resources && <span>📋 {step.resources}</span>}
                          {step.priority && (
                            <Badge variant={step.priority === 'high' ? 'destructive' : 'secondary'}>
                              {step.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Negotiation Strategy */}
            {fa?.negotiationStrategy && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Negotiation Strategy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fa.negotiationStrategy.leverage?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Leverage Points</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {fa.negotiationStrategy.leverage.map((l: string, i: number) => (
                          <li key={i}>{l}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {fa.negotiationStrategy.targets && (
                    <div>
                      <h5 className="font-medium mb-1">Settlement Targets</h5>
                      <p className="text-sm text-muted-foreground">{fa.negotiationStrategy.targets}</p>
                    </div>
                  )}
                  {fa.negotiationStrategy.walkAwayPoint && (
                    <div>
                      <h5 className="font-medium mb-1">Walk-Away Point</h5>
                      <p className="text-sm text-muted-foreground">{fa.negotiationStrategy.walkAwayPoint}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-6 pt-4">
            {/* Required Documents */}
            {fa?.requiredDocuments?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Required Documents
                </h4>
                <div className="space-y-3">
                  {fa.requiredDocuments.map((doc: DocumentRequirement, i: number) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium">{doc.name}</h5>
                          {doc.form && <p className="text-sm text-muted-foreground">Form: {doc.form}</p>}
                          <p className="text-sm mt-1">{doc.description}</p>
                        </div>
                        <div className="text-right">
                          {doc.deadline && (
                            <Badge variant="outline" className="mb-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {doc.deadline}
                            </Badge>
                          )}
                          {doc.priority && (
                            <Badge variant={doc.priority === 'high' ? 'destructive' : 'secondary'}>
                              {doc.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Key Arguments */}
            {fa?.keyArguments?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Key Arguments to Include</h4>
                <div className="space-y-3">
                  {fa.keyArguments.map((arg: KeyArgument, i: number) => (
                    <Card key={i} className="p-4">
                      <h5 className="font-medium">{arg.argument}</h5>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Support:</strong> {arg.support}
                      </p>
                      {arg.anticipatedResponse && (
                        <p className="text-sm text-amber-700 mt-2">
                          <strong>Anticipated Response:</strong> {arg.anticipatedResponse}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Filing Instructions */}
            {fa?.filingInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filing Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {fa.filingInstructions.where && (
                    <p><strong>Where to file:</strong> {fa.filingInstructions.where}</p>
                  )}
                  {fa.filingInstructions.how && (
                    <p><strong>How to file:</strong> {fa.filingInstructions.how}</p>
                  )}
                  {fa.filingInstructions.fees && (
                    <p><strong>Filing fees:</strong> {fa.filingInstructions.fees}</p>
                  )}
                  {fa.filingInstructions.copies && (
                    <p><strong>Copies needed:</strong> {fa.filingInstructions.copies}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
