import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Scale, TrendingUp, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VENUES = [
  { value: 'LTB', label: 'Landlord Tenant Board' },
  { value: 'HRTO', label: 'Human Rights Tribunal' },
  { value: 'SMALL_CLAIMS', label: 'Small Claims Court' },
  { value: 'FAMILY', label: 'Family Court' },
  { value: 'SUPERIOR', label: 'Superior Court' },
  { value: 'CRIMINAL', label: 'Criminal Court' },
  { value: 'LABOUR', label: 'Labour Board' },
];

const PROVINCES = [
  { value: 'ON', label: 'Ontario' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'AB', label: 'Alberta' },
  { value: 'QC', label: 'Quebec' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland' },
  { value: 'PE', label: 'Prince Edward Island' },
];

interface AnalysisResult {
  strengthScore: number;
  successProbability: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export default function MeritScoreCalculator() {
  const [province, setProvince] = useState('ON');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!venue || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a case type and describe your situation",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-case-strength', {
        body: {
          caseDetails: description,
          caseType: venue,
          jurisdiction: `${province}, Canada`
        }
      });

      if (error) throw error;

      if (data?.analysis) {
        setResult(data.analysis);
        toast({
          title: "Analysis Complete",
          description: `Your case strength score: ${data.analysis.strengthScore}/100`,
        });
      }
    } catch (error: any) {
      console.error('Error analyzing case:', error);
      toast({
        title: "Analysis Error",
        description: error.message || "Failed to analyze case. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
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

  const venueLabel = VENUES.find(v => v.value === venue)?.label || 'Legal';

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <CardTitle>Case Details</CardTitle>
          </div>
          <CardDescription>
            Describe your situation to get an AI-powered merit assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger id="province">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Case Type</Label>
              <Select value={venue} onValueChange={setVenue}>
                <SelectTrigger id="venue">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {VENUES.map(v => (
                    <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Describe Your Situation</Label>
            <Textarea
              id="description"
              placeholder="Briefly describe what happened and the legal issue you're facing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Include key facts, dates, and any evidence you have.
            </p>
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={analyzing || !venue || !description.trim()}
            className="w-full"
            size="lg"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Your Case...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Free Case Assessment
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            AI-generated assessment. Not legal advice.
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className={`border-primary/20 ${!result ? 'flex items-center justify-center' : ''}`}>
        {result ? (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your {venueLabel} Assessment</CardTitle>
                <Badge variant="outline">{result.successProbability} Success</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Merit Score:</span>
                <span className={`text-3xl font-bold ${getScoreColor(result.strengthScore)}`}>
                  {result.strengthScore}/100
                </span>
              </div>
              
              <Progress value={result.strengthScore} className="h-3" />
              
              <div className={`flex items-start gap-2 p-4 rounded-lg ${getScoreBgColor(result.strengthScore)}`}>
                <AlertCircle className={`h-5 w-5 mt-0.5 ${getScoreColor(result.strengthScore)}`} />
                <div>
                  <p className={`font-semibold ${getScoreColor(result.strengthScore)}`}>
                    {getScoreLabel(result.strengthScore)}
                  </p>
                </div>
              </div>

              {result.strengths?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 text-green-600">Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {result.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-muted-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.weaknesses?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 text-yellow-600">Areas to Address</h4>
                  <ul className="text-sm space-y-1">
                    {result.weaknesses.slice(0, 3).map((w, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-500">!</span>
                        <span className="text-muted-foreground">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 text-primary">Recommendations</h4>
                  <ul className="text-sm space-y-1">
                    {result.recommendations.slice(0, 3).map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">→</span>
                        <span className="text-muted-foreground">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <div className="text-center p-8">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="font-medium mb-2">Your Results Will Appear Here</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Fill out the form and click "Get Free Case Assessment" to see your merit score
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
