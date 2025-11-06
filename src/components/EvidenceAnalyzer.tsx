import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertTriangle, AlertCircle, FileText, Download } from 'lucide-react';
import { useEvidenceAnalysis, EvidenceAnalysis } from '@/hooks/useEvidenceAnalysis';

interface EvidenceAnalyzerProps {
  caseId: string;
  caseType?: string;
  caseDescription?: string;
}

export function EvidenceAnalyzer({ caseId, caseType, caseDescription }: EvidenceAnalyzerProps) {
  const { loading, analysis, analyzeEvidence } = useEvidenceAnalysis();

  const handleAnalyze = () => {
    analyzeEvidence(caseId, caseType, caseDescription);
  };

  const downloadExhibitBook = () => {
    if (!analysis) return;

    const content = `EXHIBIT BOOK
Generated: ${new Date().toLocaleDateString()}

${analysis.exhibits.map((exhibit, i) => `
EXHIBIT ${exhibit.exhibitLetter}
File: ${exhibit.fileName}
Importance: ${exhibit.importance.toUpperCase()}
Description: ${exhibit.description}
`).join('\n---\n')}

EVIDENCE SUMMARY
${analysis.summary}

STRENGTHS
${analysis.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

WEAKNESSES
${analysis.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

GAPS TO ADDRESS
${analysis.gaps.map((g, i) => `${i + 1}. ${g}`).join('\n')}

RECOMMENDATIONS
${analysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exhibit-book-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Evidence Strategist</span>
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Evidence'
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            AI-powered analysis of your evidence to identify strengths, weaknesses, and gaps
          </CardDescription>
        </CardHeader>

        {analysis && (
          <CardContent className="space-y-6">
            {/* Summary */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {analysis.summary}
              </AlertDescription>
            </Alert>

            {/* Strengths */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                Strengths ({analysis.strengths.length})
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            {analysis.weaknesses.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  Weaknesses ({analysis.weaknesses.length})
                </h3>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-600 mt-0.5">⚠</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gaps */}
            {analysis.gaps.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Missing Evidence ({analysis.gaps.length})
                </h3>
                <ul className="space-y-2">
                  {analysis.gaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-600 mt-0.5">✗</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contradictions */}
            {analysis.contradictions && analysis.contradictions.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Contradictions
                </h3>
                <ul className="space-y-2">
                  {analysis.contradictions.map((contradiction, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-600 mt-0.5">⚠</span>
                      <span>{contradiction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Strategic Recommendations
              </h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exhibit Book */}
            {analysis.exhibits.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Suggested Exhibit Organization
                  </h3>
                  <Button onClick={downloadExhibitBook} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Exhibit Book
                  </Button>
                </div>
                <div className="space-y-2">
                  {analysis.exhibits.map((exhibit, i) => (
                    <div key={i} className="p-3 border rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono">
                              Exhibit {exhibit.exhibitLetter}
                            </Badge>
                            <Badge variant={
                              exhibit.importance === 'critical' ? 'destructive' :
                              exhibit.importance === 'important' ? 'default' : 'secondary'
                            }>
                              {exhibit.importance}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{exhibit.fileName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {exhibit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
