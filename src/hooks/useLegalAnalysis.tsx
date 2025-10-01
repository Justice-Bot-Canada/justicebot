import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface LegalAnalysis {
  meritScore: number;
  successProbability: string;
  strengths: string[];
  weaknesses: string[];
  similarCases: Array<{
    citation: string;
    outcome: string;
    relevance: string;
  }>;
  recommendedStrategy: {
    primaryPath: string;
    alternativePaths: string[];
    keySteps: Array<{
      step: string;
      timeline: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  relevantLaws: Array<{
    law: string;
    section: string;
    relevance: string;
  }>;
  evidenceNeeded: string[];
  estimatedTimeline: string;
  estimatedCost: string;
  riskFactors: string[];
  summary: string;
}

export function useLegalAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LegalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCase = async (
    caseDetails: any,
    caseType: string,
    province: string = 'ON'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting AI legal analysis...');
      
      const { data: result, error: functionError } = await supabase.functions.invoke(
        'analyze-legal-case-ai',
        {
          body: {
            caseDetails,
            caseType,
            province
          }
        }
      );

      if (functionError) {
        throw functionError;
      }

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      console.log('Analysis complete:', result);
      setAnalysis(result.analysis);
      
      toast({
        title: "Analysis Complete",
        description: `Merit Score: ${result.analysis.meritScore}/100 - ${result.sources.a2aj + result.sources.canlii} similar cases found`,
      });

      return result.analysis;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze case';
      console.error('Analysis error:', err);
      setError(errorMessage);
      
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    analysis,
    error,
    analyzeCase
  };
}
