import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AgentRole = 'researcher' | 'analyst' | 'strategist' | 'drafter';

export interface LawReference {
  name: string;
  section?: string;
  sections?: string[];
  description?: string;
  application?: string;
}

export interface Precedent {
  citation: string;
  court?: string;
  summary?: string;
  relevance?: string;
  outcome?: string;
}

export interface StrengthWeakness {
  factor: string;
  impact?: string;
  description?: string;
  evidence?: string;
  mitigation?: string;
}

export interface RiskFactor {
  risk: string;
  severity?: string;
  mitigation?: string;
  likelihood?: string;
  impact?: string;
}

export interface ActionItem {
  action: string;
  step?: number;
  priority?: string;
  deadline?: string;
  resources?: string;
}

export interface DocumentRequirement {
  name: string;
  form?: string;
  required?: boolean;
  description?: string;
  deadline?: string;
  priority?: string;
}

export interface KeyArgument {
  argument: string;
  support?: string;
  strength?: string;
  evidence?: string;
  anticipatedResponse?: string;
}

export interface FilingInstruction {
  step?: string;
  details?: string;
  deadline?: string;
  where?: string;
  how?: string;
  fees?: string;
  copies?: string;
}

export interface NextStep {
  step: string | number;
  action?: string;
  priority?: string;
  notes?: string;
  deadline?: string;
}

export interface PrimaryStrategy {
  approach?: string;
  rationale?: string;
  timeline?: string;
  estimatedCost?: string;
}

export interface NegotiationStrategy {
  leverage?: string[];
  targets?: string;
  walkAwayPoint?: string;
}

export interface AgentResult {
  agent: AgentRole;
  output: Record<string, unknown>;
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
    relevantLaws: LawReference[];
    precedents: Precedent[];
    keyIssues: string[];
    strengths: StrengthWeakness[];
    weaknesses: StrengthWeakness[];
    evidenceGaps: string[];
    riskFactors: RiskFactor[];
    primaryStrategy: PrimaryStrategy;
    actionPlan: ActionItem[];
    negotiationStrategy: NegotiationStrategy;
    requiredDocuments: DocumentRequirement[];
    keyArguments: KeyArgument[];
    filingInstructions: FilingInstruction;
    summary: string;
    nextSteps: NextStep[];
  };
  totalDuration: number;
}

export interface CaseDetails {
  title?: string;
  description?: string;
  province?: string;
  venue?: string;
  status?: string;
  [key: string]: unknown;
}

export function useMultiAgentAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MultiAgentAnalysis | null>(null);
  const [currentAgent, setCurrentAgent] = useState<AgentRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (
    caseId: string | null,
    caseDetails: CaseDetails,
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
