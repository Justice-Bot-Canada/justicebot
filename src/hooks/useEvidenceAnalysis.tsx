import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EvidenceAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  gaps: string[];
  contradictions?: string[];
  timeline_issues?: string[];
  recommendations: string[];
  exhibits: Array<{
    fileName: string;
    exhibitLetter: string;
    description: string;
    importance: 'critical' | 'important' | 'supporting';
  }>;
}

export function useEvidenceAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EvidenceAnalysis | null>(null);

  const analyzeEvidence = async (caseId: string, caseType?: string, caseDescription?: string) => {
    setLoading(true);
    try {
      console.log('Analyzing evidence for case:', caseId);

      const { data, error } = await supabase.functions.invoke('analyze-evidence', {
        body: {
          caseId,
          caseType,
          caseDescription,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze evidence');
      }

      setAnalysis(data.analysis);
      
      toast({
        title: "Evidence Analysis Complete",
        description: `Analyzed ${data.evidenceCount} pieces of evidence`,
      });

      return data.analysis;
    } catch (error: any) {
      console.error('Error analyzing evidence:', error);
      
      toast({
        title: "Analysis Error",
        description: error.message || 'Failed to analyze evidence',
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
  };

  return {
    loading,
    analysis,
    analyzeEvidence,
    clearAnalysis,
  };
}
