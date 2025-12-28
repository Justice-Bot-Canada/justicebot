import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PathwayResult {
  recommended_tribunal: string;
  recommended_pathway: string;
  recommended_forms: string[];
  confidence_score: number;
  reasoning: string[];
  timeframe?: string;
  filing_fee?: string;
  success_rate?: number;
  alternative_pathways: {
    tribunal: string;
    pathway: string;
    confidence: number;
    reasoning: string;
    forms: string[];
    timeframe?: string;
    filing_fee?: string;
  }[];
  matched_rules: {
    rule_id: string;
    rule_name: string;
    score: number;
    reasoning: string;
  }[];
}

interface UsePathwayRouterOptions {
  onSuccess?: (result: PathwayResult) => void;
  onError?: (error: Error) => void;
}

export function usePathwayRouter(options?: UsePathwayRouterOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PathwayResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const routeCase = async (params: {
    description: string;
    category?: string;
    province?: string;
    amount?: number;
    caseId?: string;
  }): Promise<PathwayResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke("pathway-router", {
        body: params,
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      options?.onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to route case");
      setError(error);
      options?.onError?.(error);
      toast.error("Could not determine legal pathway", {
        description: error.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    routeCase,
    result,
    isLoading,
    error,
    reset,
  };
}

// Tribunal display names
export const tribunalNames: Record<string, string> = {
  LTB: "Landlord and Tenant Board",
  HRTO: "Human Rights Tribunal of Ontario",
  SMALL_CLAIMS: "Small Claims Court",
  SUPERIOR: "Superior Court of Justice",
  FAMILY: "Family Court",
  LABOUR: "Ontario Labour Relations Board",
  CAS: "Child Protection Court",
  CRIMINAL: "Criminal Court",
  OIPRD: "Office of the Independent Police Review Director",
  CONSULTATION: "Legal Consultation Recommended",
};

// Pathway journey URLs
export const pathwayUrls: Record<string, string> = {
  "ltb-journey": "/ltb-journey",
  "hrto-journey": "/hrto-journey",
  "small-claims-journey": "/small-claims-journey",
  "superior-court-journey": "/superior-court-journey",
  "family-journey": "/family-journey",
  "labour-board-journey": "/labour-board-journey",
  "cas-journey": "/cas-journey",
  "criminal-journey": "/criminal-journey",
  "police-accountability-journey": "/police-accountability-journey",
  "find-my-path": "/find-my-path",
};
