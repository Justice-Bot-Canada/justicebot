import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Scale, TrendingUp, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NextStepsActionPanel } from "@/components/NextStepsActionPanel";

interface CaseMeritScoreProps {
  caseId: string;
  caseType?: string;
  caseDescription?: string;
}

interface CaseData {
  id: string;
  title: string;
  venue: string;
  province: string;
  merit_score: number | null;
  description: string | null;
}

export function CaseMeritScore({ caseId, caseType, caseDescription }: CaseMeritScoreProps) {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCaseData();
  }, [caseId]);

  // Auto-calculate merit score when first loading if no score exists
  useEffect(() => {
    if (!loading && caseData && caseData.merit_score === null && !analyzing) {
      recalculateMerit();
    }
  }, [loading, caseData?.merit_score]);

  const fetchCaseData = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('id, title, venue, province, merit_score, description')
        .eq('id', caseId)
        .single();

      if (error) throw error;
      setCaseData(data);
    } catch (error) {
      console.error('Error fetching case:', error);
    } finally {
      setLoading(false);
    }
  };

  const recalculateMerit = async () => {
    if (!caseData) return;
    
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-case-strength', {
        body: {
          caseId: caseId, // Pass caseId to fetch evidence from database
          caseDetails: caseData.description || caseDescription || '',
          caseType: caseData.venue || caseType,
          jurisdiction: `${caseData.province}, Canada`
        }
      });

      if (error) throw error;

      const newScore = data.analysis?.strengthScore || 0;
      
      // Update the case with the new merit score
      await supabase
        .from('cases')
        .update({ merit_score: newScore })
        .eq('id', caseId);

      setCaseData(prev => prev ? { ...prev, merit_score: newScore } : null);

      toast({
        title: "Merit Score Updated",
        description: `Your ${getVenueLabel(caseData.venue)} case score: ${newScore}/100`,
      });
    } catch (error: any) {
      console.error('Error analyzing case:', error);
      toast({
        title: "Analysis Error",
        description: error.message || "Failed to analyze case",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getVenueLabel = (venue?: string): string => {
    const labels: Record<string, string> = {
      'HRTO': 'Human Rights Tribunal',
      'LTB': 'Landlord Tenant Board',
      'SMALL_CLAIMS': 'Small Claims Court',
      'FAMILY': 'Family Court',
      'SUPERIOR': 'Superior Court',
      'CRIMINAL': 'Criminal Court',
      'LABOUR': 'Labour Board'
    };
    return labels[venue?.toUpperCase() || ''] || venue || 'Legal';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Strong Case";
    if (score >= 40) return "Moderate Case";
    return "Needs Work";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return "bg-green-50 dark:bg-green-900/20";
    if (score >= 40) return "bg-yellow-50 dark:bg-yellow-900/20";
    return "bg-red-50 dark:bg-red-900/20";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!caseData) return null;

  const score = caseData.merit_score ?? 0;
  const venueLabel = getVenueLabel(caseData.venue);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{venueLabel} Merit Score</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {venueLabel}
          </Badge>
        </div>
        <CardDescription>
          Case-specific strength assessment for your {venueLabel} matter
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {score > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Score:</span>
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}/100
              </span>
            </div>
            
            <Progress value={score} className="h-3" />
            
            <div className={`flex items-start gap-2 p-4 rounded-lg ${getScoreBgColor(score)}`}>
              <AlertCircle className={`h-5 w-5 mt-0.5 ${getScoreColor(score)}`} />
              <div className="space-y-1">
                <p className={`font-semibold ${getScoreColor(score)}`}>
                  {getScoreLabel(score)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {score >= 70 && "Your case shows strong merit based on the evidence and details provided."}
                  {score >= 40 && score < 70 && "Consider gathering additional evidence to strengthen your position."}
                  {score < 40 && "Review your case details and evidence - additional documentation may help."}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mb-4">
              No merit score calculated yet for this {venueLabel} case
            </p>
          </div>
        )}

        <Button 
          onClick={recalculateMerit} 
          disabled={analyzing}
          className="w-full"
          variant={score > 0 ? "outline" : "default"}
        >
          {analyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing {venueLabel} Case...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {score > 0 ? "Recalculate Score" : "Calculate Merit Score"}
            </>
          )}
        </Button>

        {/* What Happens Next - Action Panel (only show if score exists) */}
        {score > 0 && (
          <NextStepsActionPanel 
            caseId={caseId} 
            venue={caseData.venue} 
            variant="compact" 
            className="mt-4" 
          />
        )}

        <p className="text-xs text-center text-muted-foreground">
          AI-generated assessment for {venueLabel} cases. Not legal advice.
        </p>
      </CardContent>
    </Card>
  );
}