import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, TrendingUp, Scale, FileText, Clock, DollarSign } from 'lucide-react';
import { NextStepsActionPanel } from '@/components/NextStepsActionPanel';
import type { LegalAnalysis } from '@/hooks/useLegalAnalysis';

interface LegalAnalysisResultsProps {
  analysis: LegalAnalysis;
  caseId?: string;
  venue?: string;
}

const LegalAnalysisResults: React.FC<LegalAnalysisResultsProps> = ({ analysis, caseId, venue }) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'destructive' | 'default' | 'secondary'> = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return variants[priority] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Merit Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Case Merit Assessment
          </CardTitle>
          <CardDescription>
            AI analysis based on {analysis.similarCases?.length || 0} similar Canadian cases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className={`text-6xl font-bold ${getScoreColor(analysis.meritScore)}`}>
              {analysis.meritScore}
            </div>
            <div className="text-sm text-muted-foreground">Merit Score (out of 100)</div>
            <Progress value={analysis.meritScore} className="w-full" />
            <div className="text-lg font-semibold text-primary">
              Success Probability: {analysis.successProbability}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Timeline</div>
                <div className="font-medium">{analysis.estimatedTimeline}</div>
              </div>
            </div>
            {analysis.estimatedCost && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Est. Cost</div>
                  <div className="font-medium">{analysis.estimatedCost}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Cases Found</div>
                <div className="font-medium">{analysis.similarCases?.length || 0}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next - Action Panel */}
      <NextStepsActionPanel caseId={caseId} venue={venue} />

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-line">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="strategy">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="laws">Laws</TabsTrigger>
        </TabsList>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recommended Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Primary Path</h3>
                <p className="text-muted-foreground">{analysis.recommendedStrategy.primaryPath}</p>
              </div>

              {analysis.recommendedStrategy.alternativePaths?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Alternative Approaches</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {analysis.recommendedStrategy.alternativePaths.map((path, idx) => (
                      <li key={idx}>{path}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Action Steps</h3>
                <div className="space-y-3">
                  {analysis.recommendedStrategy.keySteps?.map((step, idx) => (
                    <div key={idx} className="flex gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-0.5">
                        <Badge variant={getPriorityBadge(step.priority)}>
                          {step.priority}
                        </Badge>
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{step.step}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Timeline: {step.timeline}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.evidenceNeeded?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Evidence Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.evidenceNeeded.map((evidence, idx) => (
                      <Badge key={idx} variant="outline">{evidence}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Case Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.strengths?.map((strength, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weaknesses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Potential Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Weaknesses</h3>
                <ul className="space-y-3">
                  {analysis.weaknesses?.map((weakness, idx) => (
                    <li key={idx} className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {analysis.riskFactors?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Risk Factors</h3>
                  <ul className="space-y-3">
                    {analysis.riskFactors.map((risk, idx) => (
                      <li key={idx} className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Similar Cases & Precedents</CardTitle>
              <CardDescription>
                Relevant Canadian case law from A2AJ and CanLII databases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.similarCases?.map((caseItem, idx) => (
                  <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                    <div className="font-semibold text-primary">{caseItem.citation}</div>
                    <div className="text-sm mt-1">
                      <strong>Outcome:</strong> {caseItem.outcome}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <strong>Relevance:</strong> {caseItem.relevance}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="laws" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relevant Laws & Regulations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.relevantLaws?.map((law, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="font-semibold">{law.law}</div>
                    {law.section && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Section: {law.section}
                      </div>
                    )}
                    <div className="text-sm mt-2">{law.relevance}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalAnalysisResults;
