import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MeritBreakdown {
  evidenceQuantity: number;
  evidenceRelevance: number;
  timelineCompleteness: number;
  internalConsistency: number;
  precedentAlignment: number;
  remedyStrength: number;
  penalty: number;
}

export interface MeritScore {
  score: number;
  band: 'Weak' | 'Fair' | 'Moderate' | 'Strong' | 'Very Strong';
  breakdown: MeritBreakdown;
  strengths: string[];
  weaknesses: string[];
  gaps: string[];
}

export interface Pathway {
  id: string;
  name: string;
  forum: string;
  isPrimary: boolean;
  summaryFree: string;
  // Paywalled content
  whyApplies: string;
  whatToProve: string[];
  risks: string[];
  deadlines: string[];
  estimatedTimeline: string;
  estimatedCost: string;
  successRate: string;
}

export interface FormSuggestion {
  formCode: string;
  formName: string;
  tribunal: string;
  purpose: string;
  conditions: string[];
  relevanceScore: number;
}

export interface Precedent {
  citation: string;
  title?: string;
  outcome?: string;
  relevance?: number;
  url?: string;
}

export interface PipelineResult {
  success: boolean;
  caseId: string;
  meritScore: MeritScore;
  pathways: Pathway[];
  formSuggestions: FormSuggestion[];
  precedents: Precedent[];
  evidenceCount: number;
  analyzedAt: string;
}

export function useCasePipeline() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runPipeline = useCallback(async (
    caseId: string,
    description?: string,
    province?: string
  ): Promise<PipelineResult | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Running case pipeline for:', caseId);

      const { data, error: fnError } = await supabase.functions.invoke('run-case-pipeline', {
        body: { caseId, description, province },
      });

      if (fnError) {
        console.error('Pipeline function error:', fnError);
        throw new Error(fnError.message || 'Pipeline failed');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Pipeline returned unsuccessful');
      }

      const pipelineResult: PipelineResult = {
        success: data.success,
        caseId: data.caseId,
        meritScore: data.meritScore,
        pathways: data.pathways,
        formSuggestions: data.formSuggestions,
        precedents: data.precedents,
        evidenceCount: data.evidenceCount,
        analyzedAt: data.analyzedAt,
      };

      setResult(pipelineResult);

      toast.success('Case Analysis Complete', {
        description: `Merit Score: ${pipelineResult.meritScore.score}/100 (${pipelineResult.meritScore.band})`,
      });

      return pipelineResult;
    } catch (err: any) {
      const message = err.message || 'Failed to analyze case';
      console.error('Pipeline error:', err);
      setError(message);
      toast.error('Analysis Failed', { description: message });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    runPipeline,
    result,
    loading,
    error,
    reset,
  };
}

// Helper to get band color
export function getBandColor(band: MeritScore['band']): string {
  switch (band) {
    case 'Very Strong': return 'text-green-600 bg-green-50 border-green-200';
    case 'Strong': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'Moderate': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'Fair': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'Weak': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-muted-foreground bg-muted';
  }
}

// Helper for progress bar color
export function getScoreProgressColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 65) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  if (score >= 35) return 'bg-orange-500';
  return 'bg-red-500';
}
