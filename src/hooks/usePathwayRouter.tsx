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

// Tribunal display names - all provinces
export const tribunalNames: Record<string, string> = {
  // Ontario
  LTB: "Landlord and Tenant Board",
  HRTO: "Human Rights Tribunal of Ontario",
  SMALL_CLAIMS: "Small Claims Court",
  SUPERIOR: "Superior Court of Justice",
  FAMILY: "Family Court",
  LABOUR: "Ontario Labour Relations Board",
  CAS: "Child Protection Court",
  CRIMINAL: "Criminal Court",
  OIPRD: "Office of the Independent Police Review Director",
  // British Columbia
  RTB: "Residential Tenancy Branch",
  BCHRT: "BC Human Rights Tribunal",
  CRT: "Civil Resolution Tribunal",
  PROVINCIAL: "Provincial Court of BC",
  SUPREME: "Supreme Court of British Columbia",
  LRB: "Labour Relations Board",
  // Alberta
  RTDRS: "Residential Tenancy Dispute Resolution Service",
  AHRC: "Alberta Human Rights Commission",
  KINGS_BENCH: "Court of King's Bench",
  ALRB: "Alberta Labour Relations Board",
  // Quebec
  TAL: "Tribunal administratif du logement",
  CDPDJ: "Commission des droits de la personne",
  TAT: "Tribunal administratif du travail",
  // Manitoba
  RTB_MB: "Residential Tenancies Branch",
  MHRC: "Manitoba Human Rights Commission",
  // Saskatchewan
  ORT: "Office of Residential Tenancies",
  SHRC: "Saskatchewan Human Rights Commission",
  // Nova Scotia
  RTB_NS: "Residential Tenancies Program",
  NSHRC: "Nova Scotia Human Rights Commission",
  // New Brunswick
  RTB_NB: "Residential Tenancies Tribunal",
  NBHRC: "New Brunswick Human Rights Commission",
  // Newfoundland
  RTT: "Residential Tenancies Tribunal",
  NLHRC: "Newfoundland and Labrador Human Rights Commission",
  // PEI
  IRAC: "Island Regulatory and Appeals Commission",
  PEIHRC: "PEI Human Rights Commission",
  // Territories
  RTO: "Rental Officer",
  CONSULTATION: "Legal Consultation Recommended",
  // Federal
  IRB: "Immigration and Refugee Board",
  CHRT: "Canadian Human Rights Tribunal",
  FCA: "Federal Court of Appeal",
  TAX_COURT: "Tax Court of Canada",
  CIRB: "Canada Industrial Relations Board",
  CRTC: "CRTC",
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
  "immigration-journey": "/immigration-journey",
  "accountability-journey": "/accountability-journey",
  "find-my-path": "/find-my-path",
};
