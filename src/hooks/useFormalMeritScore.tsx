import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MeritScoreBreakdown {
  path_fit: number;      // 0-15
  elements: number;      // 0-25
  evidence: number;      // 0-25
  case_law: number;      // 0-25
  penalty: number;       // -15 to 0
}

export interface MeritScoreResult {
  score: number;         // 0-100
  band: 'Weak' | 'Fair' | 'Moderate' | 'Strong' | 'Very Strong';
  breakdown: MeritScoreBreakdown;
  top_strengths: string[];
  top_risks: string[];
  next_best_actions: string[];
  element_coverage: {
    element_key: string;
    element_name: string;
    score: 0 | 1 | 2 | 3;
    evidence_matched: boolean;
  }[];
  case_law_matches: {
    citation: string;
    similarity: number;
    outcome: 'granted' | 'partial' | 'dismissed';
  }[];
  deadline_warnings: string[];
}

export interface MeritScoreInput {
  caseId: string;
  province: string;
  venue: string;
  issueType: string;
  description: string;
  evidenceIds?: string[];
  incidentDate?: string;
  filingDeadline?: string;
}

export function useFormalMeritScore() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeritScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateMeritScore = async (input: MeritScoreInput): Promise<MeritScoreResult | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Calculating formal merit score...', input);

      const { data, error: fnError } = await supabase.functions.invoke('formal-merit-score', {
        body: input,
      });

      if (fnError) throw fnError;

      if (data.error) throw new Error(data.error);

      setResult(data);
      
      toast.success('Merit Score Calculated', {
        description: `Score: ${data.score}/100 (${data.band})`,
      });

      return data;
    } catch (err: any) {
      const message = err.message || 'Failed to calculate merit score';
      console.error('Merit score error:', err);
      setError(message);
      toast.error('Analysis Failed', { description: message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    calculateMeritScore,
    result,
    loading,
    error,
    reset,
  };
}

// Helper to get score band
export function getScoreBand(score: number): MeritScoreResult['band'] {
  if (score >= 80) return 'Very Strong';
  if (score >= 65) return 'Strong';
  if (score >= 50) return 'Moderate';
  if (score >= 35) return 'Fair';
  return 'Weak';
}

// Helper to get band color
export function getBandColor(band: MeritScoreResult['band']) {
  switch (band) {
    case 'Very Strong': return 'text-green-600 bg-green-100 border-green-200';
    case 'Strong': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
    case 'Moderate': return 'text-amber-600 bg-amber-100 border-amber-200';
    case 'Fair': return 'text-orange-600 bg-orange-100 border-orange-200';
    case 'Weak': return 'text-red-600 bg-red-100 border-red-200';
  }
}

// Helper to get component color
export function getComponentColor(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 75) return 'bg-green-500';
  if (pct >= 50) return 'bg-amber-500';
  if (pct >= 25) return 'bg-orange-500';
  return 'bg-red-500';
}
