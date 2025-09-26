import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Scale, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  MapPin, 
  Calendar,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LegalPathway {
  id: string;
  pathway_type: string;
  recommendation: string;
  confidence_score: number;
  relevant_laws: any; // JSON field from database
  next_steps: any; // JSON field from database
}

interface AnalysisData {
  meritScore: number;
  scoreBreakdown: {
    baseScore: number;
    evidenceBonus: number;
    lawSectionBonus: number;
    descriptionBonus: number;
    categoryBonus: number;
    variationBonus: number;
  };
  caseStrengths: string[];
  caseWeaknesses: string[];
  pathwayType: string;
  recommendation: string;
  confidenceScore: number;
  relevantLaws: string[];
  nextSteps: string[];
  filingInstructions: string[];
  recommendedForms: string[];
}

interface LegalPathwayGuideProps {
  caseId: string;
  onBack: () => void;
}

const LegalPathwayGuide: React.FC<LegalPathwayGuideProps> = ({ caseId, onBack }) => {
  const [pathway, setPathway] = useState<LegalPathway | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPathwayData();
  }, [caseId]);

  const fetchPathwayData = async () => {
    try {
      const { data: pathwayData, error: pathwayError } = await supabase
        .from('legal_pathways')
        .select('*')
        .eq('case_id', caseId)
        .single();

      if (pathwayError) throw pathwayError;
      setPathway(pathwayData);

      // Get the case for re-analysis
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (caseError) throw caseError;

      // Re-run analysis to get detailed breakdown
      const analysisResponse = await supabase.functions.invoke('analyze-legal-case', {
        body: {
          caseId,
          description: caseData.description,
          province: caseData.province,
          municipality: caseData.municipality,
          lawSection: caseData.law_section,
          evidenceFiles: [] // Would need to fetch actual evidence count
        }
      });

      if (analysisResponse.data) {
        setAnalysisData(analysisResponse.data);
      }
    } catch (error) {
      console.error('Error fetching pathway data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPathwayTitle = (pathwayType: string) => {
    switch (pathwayType) {
      case 'criminal': return 'Criminal Court System';
      case 'landlord-tenant': return 'Landlord and Tenant Board';
      case 'human-rights-workplace': return 'Human Rights Tribunal (Workplace)';
      case 'human-rights': return 'Human Rights Tribunal';
      case 'employment': return 'Employment Standards';
      default: return 'Civil Court';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-pulse">Loading pathway guidance...</div>
        </CardContent>
      </Card>
    );
  }

  if (!pathway) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p>No pathway data found for this case.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Case
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{getPathwayTitle(pathway.pathway_type)}</h2>
          <p className="text-muted-foreground">Detailed guidance for your legal case</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="score-breakdown">Score Analysis</TabsTrigger>
          <TabsTrigger value="filing">Filing Guide</TabsTrigger>
          <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Case Merit Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={analysisData?.meritScore || pathway.confidence_score} className="h-3" />
                </div>
                <Badge className={`font-bold ${getScoreColor(analysisData?.meritScore || pathway.confidence_score)}`}>
                  {analysisData?.meritScore || pathway.confidence_score}% Merit
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">{pathway.recommendation}</p>
            </CardContent>
          </Card>

          {analysisData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    Case Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisData.caseStrengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-warning">
                    <AlertCircle className="h-5 w-5" />
                    Areas to Strengthen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisData.caseWeaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="score-breakdown" className="space-y-6">
          {analysisData?.scoreBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle>Merit Score Breakdown</CardTitle>
                <CardDescription>Understanding how your merit score was calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Base Score</span>
                    <Badge variant="outline">{analysisData.scoreBreakdown.baseScore} points</Badge>
                  </div>
                  
                  {analysisData.scoreBreakdown.evidenceBonus > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Evidence Documentation</span>
                      <Badge variant="outline" className="text-success">+{analysisData.scoreBreakdown.evidenceBonus} points</Badge>
                    </div>
                  )}
                  
                  {analysisData.scoreBreakdown.lawSectionBonus > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Legal Citations</span>
                      <Badge variant="outline" className="text-success">+{analysisData.scoreBreakdown.lawSectionBonus} points</Badge>
                    </div>
                  )}
                  
                  {analysisData.scoreBreakdown.descriptionBonus > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Case Detail Quality</span>
                      <Badge variant="outline" className="text-success">+{analysisData.scoreBreakdown.descriptionBonus} points</Badge>
                    </div>
                  )}
                  
                  {analysisData.scoreBreakdown.categoryBonus > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Legal Category Strength</span>
                      <Badge variant="outline" className="text-success">+{analysisData.scoreBreakdown.categoryBonus} points</Badge>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Merit Score</span>
                    <Badge className={getScoreColor(analysisData.meritScore)}>
                      {analysisData.meritScore} points
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="filing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Filing Instructions
              </CardTitle>
              <CardDescription>Step-by-step guide to file your case</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData?.filingInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm">{instruction}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {analysisData?.recommendedForms && (
            <Card>
              <CardHeader>
                <CardTitle>Required Forms</CardTitle>
                <CardDescription>Forms you may need to complete</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisData.recommendedForms.map((form, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {form}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="next-steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recommended Next Steps
              </CardTitle>
              <CardDescription>Priority actions for your case</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pathway.next_steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relevant Laws & Regulations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pathway.relevant_laws.map((law, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    {law}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalPathwayGuide;