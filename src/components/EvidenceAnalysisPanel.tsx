import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Loader2,
  RefreshCw,
  FileText,
  Target,
  TrendingUp,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { useEvidenceAnalysis, EvidenceAnalysis } from '@/hooks/useEvidenceAnalysis';
import { supabase } from '@/integrations/supabase/client';

interface EvidenceAnalysisPanelProps {
  caseId: string;
  caseDescription?: string;
  caseType?: string;
  evidenceCount: number;
  onBuildBook?: () => void;
}

export function EvidenceAnalysisPanel({ 
  caseId, 
  caseDescription,
  caseType,
  evidenceCount,
  onBuildBook
}: EvidenceAnalysisPanelProps) {
  const { loading, analysis, analyzeEvidence } = useEvidenceAnalysis();
  const [savedAnalysis, setSavedAnalysis] = useState<EvidenceAnalysis | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(true);

  // Load existing analysis on mount
  useEffect(() => {
    const loadExistingAnalysis = async () => {
      try {
        const { data, error } = await supabase
          .from('evidence_analysis')
          .select('analysis_data, created_at')
          .eq('case_id', caseId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setSavedAnalysis(data.analysis_data as unknown as EvidenceAnalysis);
        }
      } catch (e) {
        // No existing analysis
      } finally {
        setLoadingExisting(false);
      }
    };

    loadExistingAnalysis();
  }, [caseId]);

  const currentAnalysis = analysis || savedAnalysis;

  const handleAnalyze = async () => {
    const result = await analyzeEvidence(caseId, caseType, caseDescription);
    if (result) {
      setSavedAnalysis(result);
    }
  };

  if (loadingExisting) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading analysis...</p>
        </CardContent>
      </Card>
    );
  }

  if (evidenceCount === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <h3 className="font-medium mb-1">No Evidence Yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload documents to get an AI analysis of your case evidence.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!currentAnalysis) {
    return (
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Evidence Analysis
          </CardTitle>
          <CardDescription>
            Get strategic insights about your {evidenceCount} uploaded document{evidenceCount !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Our AI will analyze your evidence to identify strengths, weaknesses, gaps, 
              and recommend how to organize your exhibits.
            </p>
            <Button onClick={handleAnalyze} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Evidence...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze My Evidence
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show analysis results
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Evidence Analysis
            </CardTitle>
            <CardDescription>
              Strategic assessment of your {evidenceCount} document{evidenceCount !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleAnalyze} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <Alert className="bg-primary/5 border-primary/20">
          <Target className="h-4 w-4" />
          <AlertDescription>{currentAnalysis.summary}</AlertDescription>
        </Alert>

        {/* Strengths */}
        {currentAnalysis.strengths?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Strengths ({currentAnalysis.strengths.length})
            </h4>
            <ul className="text-sm space-y-1 pl-6">
              {currentAnalysis.strengths.map((s, i) => (
                <li key={i} className="list-disc text-muted-foreground">{s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {currentAnalysis.weaknesses?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Potential Issues ({currentAnalysis.weaknesses.length})
            </h4>
            <ul className="text-sm space-y-1 pl-6">
              {currentAnalysis.weaknesses.map((w, i) => (
                <li key={i} className="list-disc text-muted-foreground">{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Gaps */}
        {currentAnalysis.gaps?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              Missing Evidence ({currentAnalysis.gaps.length})
            </h4>
            <ul className="text-sm space-y-1 pl-6">
              {currentAnalysis.gaps.map((g, i) => (
                <li key={i} className="list-disc text-muted-foreground">{g}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {currentAnalysis.recommendations?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </h4>
            <ul className="text-sm space-y-1 pl-6">
              {currentAnalysis.recommendations.map((r, i) => (
                <li key={i} className="list-disc text-muted-foreground">{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Exhibit Order */}
        {currentAnalysis.exhibits?.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Suggested Exhibit Order
            </h4>
            <div className="space-y-2">
              {currentAnalysis.exhibits.slice(0, 5).map((ex, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <Badge variant="outline" className="shrink-0">
                    {ex.exhibitLetter}
                  </Badge>
                  <div className="flex-1">
                    <span className="font-medium">{ex.fileName}</span>
                    <p className="text-xs text-muted-foreground">{ex.description}</p>
                  </div>
                  <Badge 
                    className={
                      ex.importance === 'critical' ? 'bg-red-500/10 text-red-700 dark:text-red-400' :
                      ex.importance === 'important' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400' :
                      'bg-muted text-muted-foreground'
                    }
                  >
                    {ex.importance}
                  </Badge>
                </div>
              ))}
              {currentAnalysis.exhibits.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{currentAnalysis.exhibits.length - 5} more exhibits
                </p>
              )}
            </div>
          </div>
        )}

        {/* Build Book CTA */}
        {onBuildBook && evidenceCount >= 1 && (
          <div className="pt-4 border-t">
            <Button onClick={onBuildBook} className="w-full gap-2">
              <BookOpen className="h-4 w-4" />
              Build Book of Documents
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}