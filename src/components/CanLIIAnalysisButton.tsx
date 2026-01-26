import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Scale, 
  Loader2, 
  ExternalLink, 
  ChevronDown, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  BookOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SimilarCase {
  title: string;
  citation: string;
  court: string;
  date: string;
  url: string;
  summary?: string;
  relevance: number;
}

interface AnalysisResult {
  meritScore: number;
  confidence: number;
  outcomePrediction: 'favorable' | 'unfavorable' | 'uncertain';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  legalBasis: string;
  similarCases: SimilarCase[];
}

interface CanLIIAnalysisButtonProps {
  caseId: string;
  className?: string;
}

export function CanLIIAnalysisButton({ caseId, className }: CanLIIAnalysisButtonProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  // Load cached analysis on mount
  useEffect(() => {
    loadCachedAnalysis();
  }, [caseId]);

  const loadCachedAnalysis = async () => {
    try {
      const { data } = await supabase
        .from('case_law_analyses')
        .select(`
          *,
          similar_cases (*)
        `)
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setAnalysis({
          meritScore: data.merit_score || 0,
          confidence: data.confidence || 0,
          outcomePrediction: data.outcome_prediction as any || 'uncertain',
          strengths: data.strengths || [],
          weaknesses: data.weaknesses || [],
          recommendations: data.recommendations || [],
          legalBasis: data.legal_basis || '',
          similarCases: (data.similar_cases || []).map((sc: any) => ({
            title: sc.title,
            citation: sc.citation,
            court: sc.court,
            date: sc.decision_date,
            url: sc.url,
            summary: sc.summary,
            relevance: sc.relevance_score,
          })),
        });
      }
    } catch (err) {
      // No cached analysis, that's fine
    }
  };

  const runAnalysis = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    setFallbackMessage(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-case-law', {
        body: { caseId, forceRefresh },
      });

      if (fnError) throw fnError;

      if (data.fallback) {
        setFallbackMessage(data.message);
        return;
      }

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data.analysis);
      
      toast({
        title: "Analysis Complete",
        description: `Merit Score: ${data.analysis.meritScore}/100 - ${data.canliiCasesFound || 0} cases analyzed`,
      });
    } catch (err: any) {
      console.error('CanLII analysis error:', err);
      setError(err.message || 'Failed to analyze case');
      toast({
        title: "Analysis Error",
        description: err.message || 'Failed to run case law analysis',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 45) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return "bg-green-50 dark:bg-green-900/20 border-green-200";
    if (score >= 45) return "bg-amber-50 dark:bg-amber-900/20 border-amber-200";
    return "bg-red-50 dark:bg-red-900/20 border-red-200";
  };

  const getOutcomeIcon = (prediction: string) => {
    switch (prediction) {
      case 'favorable':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'unfavorable':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <HelpCircle className="h-5 w-5 text-amber-600" />;
    }
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.75) return "High";
    if (confidence >= 0.5) return "Moderate";
    return "Low";
  };

  // Fallback UI when CanLII is not configured
  if (fallbackMessage) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{fallbackMessage}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">CanLII Case Law Analysis</CardTitle>
          </div>
          {analysis && (
            <Badge variant="outline" className="text-xs">
              {analysis.similarCases.length} precedents
            </Badge>
          )}
        </div>
        <CardDescription>
          AI-powered analysis using Canadian legal precedents
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Analysis Button */}
        {!analysis && !loading && (
          <Button 
            onClick={() => runAnalysis()} 
            className="w-full"
            disabled={loading}
          >
            <Scale className="mr-2 h-4 w-4" />
            Analyze with CanLII
          </Button>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Analyzing case law precedents...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Display */}
        {analysis && !loading && (
          <div className="space-y-4">
            {/* Merit Score */}
            <div className={`p-4 rounded-lg border ${getScoreBgColor(analysis.meritScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Merit Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(analysis.meritScore)}`}>
                  {analysis.meritScore}/100
                </span>
              </div>
              <Progress value={analysis.meritScore} className="h-2" />
            </div>

            {/* Confidence & Prediction */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                <p className="font-semibold">{getConfidenceLabel(analysis.confidence)}</p>
                <p className="text-xs text-muted-foreground">{Math.round(analysis.confidence * 100)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Outcome Prediction</p>
                <div className="flex items-center gap-2">
                  {getOutcomeIcon(analysis.outcomePrediction)}
                  <span className="font-semibold capitalize">{analysis.outcomePrediction}</span>
                </div>
              </div>
            </div>

            {/* Similar Cases */}
            {analysis.similarCases.length > 0 && (
              <Collapsible open={showDetails} onOpenChange={setShowDetails}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Top {Math.min(5, analysis.similarCases.length)} Similar Cases</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-2">
                  {analysis.similarCases.slice(0, 5).map((sc, index) => (
                    <div 
                      key={index} 
                      className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{sc.title}</p>
                          <p className="text-xs text-muted-foreground">{sc.citation}</p>
                          <p className="text-xs text-muted-foreground">{sc.court} • {sc.date}</p>
                        </div>
                        <a 
                          href={sc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="shrink-0"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Strengths & Weaknesses */}
            {(analysis.strengths.length > 0 || analysis.weaknesses.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.strengths.length > 0 && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200">
                    <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">Strengths</p>
                    <ul className="text-xs space-y-1">
                      {analysis.strengths.slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.weaknesses.length > 0 && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
                    <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-2">Weaknesses</p>
                    <ul className="text-xs space-y-1">
                      {analysis.weaknesses.slice(0, 3).map((w, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <XCircle className="h-3 w-3 mt-0.5 text-red-600 shrink-0" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Refresh Button */}
            <Button 
              variant="outline" 
              onClick={() => runAnalysis(true)} 
              disabled={loading}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Analysis
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Powered by CanLII case law database. Not legal advice.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
