import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CaseAnalysis {
  strengthScore: number;
  successProbability: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  legalBasis?: string;
  riskFactors?: string[];
  estimatedTimeline?: string;
}

export default function CaseStrengthAnalyzer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [caseDetails, setCaseDetails] = useState("");
  const [evidenceList, setEvidenceList] = useState("");
  const [jurisdiction, setJurisdiction] = useState("Ontario, Canada");
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!user) {
      navigate("/");
      return;
    }

    if (!caseDetails) {
      toast({
        title: "Missing Information",
        description: "Please provide case details",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-case-strength", {
        body: {
          caseDetails,
          evidenceList,
          jurisdiction,
        },
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your case strength has been analyzed",
      });
    } catch (error: any) {
      console.error("Error analyzing case:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze case",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getProbabilityColor = (prob: string) => {
    switch (prob) {
      case "high": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-red-600";
      default: return "";
    }
  };

  return (
    <>
      <SEOHead
        title="Case Strength Analyzer - Justice Bot"
        description="Get an AI-powered analysis of your case strength, success probability, and strategic recommendations."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Case Strength Analyzer</h1>
          <p className="text-muted-foreground">
            AI-powered assessment of your case's strengths and weaknesses
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Educational Tool:</strong> This analysis is for informational purposes only and is not legal advice.
            Consult with a qualified lawyer for professional advice.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Case Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="caseDetails">Case Details *</Label>
                <Textarea
                  id="caseDetails"
                  value={caseDetails}
                  onChange={(e) => setCaseDetails(e.target.value)}
                  placeholder="Describe your case: what happened, when, who is involved, what laws may apply..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="evidenceList">Available Evidence</Label>
                <Textarea
                  id="evidenceList"
                  value={evidenceList}
                  onChange={(e) => setEvidenceList(e.target.value)}
                  placeholder="List your evidence: documents, photos, witness statements, etc..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Textarea
                  id="jurisdiction"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  placeholder="e.g., Ontario, Canada"
                  rows={1}
                />
              </div>

              <Button onClick={handleAnalyze} disabled={loading} className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                {loading ? "Analyzing..." : "Analyze Case Strength"}
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            {analysis ? (
              <>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Strength Assessment</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Overall Strength</span>
                        <span className="text-sm font-bold">{analysis.strengthScore}/100</span>
                      </div>
                      <Progress value={analysis.strengthScore} className="h-2" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">Success Probability: </span>
                      <Badge className={getProbabilityColor(analysis.successProbability)}>
                        {analysis.successProbability.toUpperCase()}
                      </Badge>
                    </div>
                    {analysis.estimatedTimeline && (
                      <div>
                        <span className="text-sm font-medium">Timeline: </span>
                        <span className="text-sm">{analysis.estimatedTimeline}</span>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-2" />
                    Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm flex items-start">
                        <span className="mr-2">{idx + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {analysis.legalBasis && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-3">Legal Basis</h3>
                    <p className="text-sm">{analysis.legalBasis}</p>
                  </Card>
                )}

                {analysis.riskFactors && analysis.riskFactors.length > 0 && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center text-orange-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Risk Factors
                    </h3>
                    <ul className="space-y-2">
                      {analysis.riskFactors.map((risk, idx) => (
                        <li key={idx} className="text-sm flex items-start">
                          <span className="mr-2">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </>
            ) : (
              <Card className="p-6 h-[600px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your case analysis will appear here</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
