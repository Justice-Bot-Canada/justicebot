import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AgentRole = 'researcher' | 'analyst' | 'strategist' | 'drafter';

export interface AgentResult {
  agent: AgentRole;
  output: any;
  duration: number;
}

export interface MultiAgentAnalysis {
  success: boolean;
  caseId: string;
  agents: AgentResult[];
  finalAnalysis: {
    meritScore: number;
    successProbability: string;
    confidence: string;
    relevantLaws: any[];
    precedents: any[];
    keyIssues: string[];
    strengths: any[];
    weaknesses: any[];
    evidenceGaps: string[];
    riskFactors: any[];
    primaryStrategy: any;
    actionPlan: any[];
    negotiationStrategy: any;
    requiredDocuments: any[];
    keyArguments: any[];
    filingInstructions: any;
    summary: string;
    nextSteps: any[];
  };
  totalDuration: number;
}

export function useMultiAgentAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MultiAgentAnalysis | null>(null);
  const [currentAgent, setCurrentAgent] = useState<AgentRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (
    caseId: string | null,
    caseDetails: any,
    caseType: string,
    province: string = 'ON',
    agents?: AgentRole[]
  ): Promise<MultiAgentAnalysis | null> => {
    setLoading(true);
    setError(null);
    setCurrentAgent('researcher');

    try {
      toast.info('Starting multi-agent analysis...', {
        description: 'This may take a minute as multiple AI agents analyze your case.'
      });

      const { data, error: fnError } = await supabase.functions.invoke('multi-agent-analysis', {
        body: {
          caseId,
          caseDetails,
          caseType,
          province,
          agents
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data);
      toast.success('Analysis complete!', {
        description: `Merit score: ${data.finalAnalysis.meritScore}/100`
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      toast.error('Analysis failed', { description: message });
      return null;
    } finally {
      setLoading(false);
      setCurrentAgent(null);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    loading,
    analysis,
    currentAgent,
    error,
    runAnalysis,
    clearAnalysis
  };
}
