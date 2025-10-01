import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// A2AJ API Response Types
export interface CoverageItem {
  dataset: string;
  description_en: string | null;
  description_fr: string | null;
  earliest_document_date: string | null;
  latest_document_date: string | null;
  number_of_documents: number;
}

export interface CoverageResponse {
  results: CoverageItem[];
}

export interface FetchResponse {
  results: any[]; // Can be case or law documents
}

export interface SearchResultItem {
  id?: string;
  name?: string;
  title?: string;
  citation?: string;
  dataset?: string;
  court?: string;
  year?: string;
  date?: string;
  snippet?: string;
  url?: string;
  text?: string;
  language?: string;
  decision_date?: string;
  docket?: string;
  [key: string]: any; // Allow additional fields
}

export interface SearchResponse {
  results: SearchResultItem[];
  total?: number;
  query?: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface SearchResult {
  name?: string;
  title?: string;
  citation?: string;
  dataset?: string;
  year?: string;
  snippet?: string;
  url?: string;
}

interface LegalDataParams {
  queryType: 'search_cases' | 'search_legislation' | 'get_case' | 'get_legislation' | 'get_by_citation' | 'get_coverage';
  params: {
    query?: string;
    jurisdiction?: string;
    court?: string;
    dataset?: string; // e.g., 'LEGISLATION-FED', 'REGULATIONS-FED'
    year?: string;
    limit?: string;
    offset?: string;
    sort?: 'newest' | 'oldest';
    caseId?: string;
    legislationId?: string;
    citation?: string;
    start_char?: number; // Character slice start position (default 0)
    end_char?: number; // Character slice end position (-1 means end)
    section?: string; // Section number for laws/regulations
    doc_type?: 'cases' | 'laws';
    output_language?: 'en' | 'fr' | 'both';
    type?: 'statute' | 'regulation';
  };
  source?: 'a2aj' | 'canlii' | 'auto';
}

export function useLegalData() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | FetchResponse | CoverageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLegalData = async ({ queryType, params, source = 'a2aj' }: LegalDataParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: result, error: functionError } = await supabase.functions.invoke('fetch-legal-data', {
        body: { queryType, params, source }
      });

      if (functionError) throw functionError;
      
      if (result?.error) {
        setError(result.error);
        toast({
          title: "Data Fetch Warning",
          description: result.error,
          variant: "destructive"
        });
        return null;
      }

      setData(result.data);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch legal data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchCases = async (query: string, court?: string, year?: string, sort?: 'newest' | 'oldest') => {
    return fetchLegalData({
      queryType: 'search_cases',
      params: { query, court, year, sort, limit: '20' }
    });
  };

  const searchLegislation = async (query: string, dataset?: string, sort?: 'newest' | 'oldest') => {
    return fetchLegalData({
      queryType: 'search_legislation',
      params: { query, dataset, sort, limit: '20' }
    });
  };

  const getCoverage = async (doc_type?: 'laws' | 'cases', dataset?: string) => {
    return fetchLegalData({
      queryType: 'get_coverage' as any,
      params: { doc_type, dataset }
    });
  };

  const getCaseByCitation = async (
    citation: string, 
    startChar?: number, 
    endChar?: number,
    outputLanguage: 'en' | 'fr' | 'both' = 'en'
  ) => {
    // Validate citation format
    if (!citation.trim() || citation.length > 200) {
      toast({
        title: "Invalid Citation",
        description: "Citation must be between 1 and 200 characters",
        variant: "destructive"
      });
      return null;
    }

    return fetchLegalData({
      queryType: 'get_by_citation',
      params: { 
        citation: citation.trim(), 
        doc_type: 'cases',
        start_char: startChar, 
        end_char: endChar,
        output_language: outputLanguage
      }
    });
  };

  const getLawByCitation = async (
    citation: string, 
    section?: string, 
    startChar?: number, 
    endChar?: number,
    outputLanguage: 'en' | 'fr' | 'both' = 'en'
  ) => {
    // Validate citation format
    if (!citation.trim() || citation.length > 200) {
      toast({
        title: "Invalid Citation",
        description: "Citation must be between 1 and 200 characters",
        variant: "destructive"
      });
      return null;
    }

    // Validate section if provided
    if (section && section.length > 50) {
      toast({
        title: "Invalid Section",
        description: "Section must be less than 50 characters",
        variant: "destructive"
      });
      return null;
    }

    return fetchLegalData({
      queryType: 'get_by_citation',
      params: { 
        citation: citation.trim(),
        doc_type: 'laws',
        section: section?.trim(),
        start_char: startChar,
        end_char: endChar,
        output_language: outputLanguage
      }
    });
  };

  return {
    loading,
    data,
    error,
    fetchLegalData,
    searchCases,
    searchLegislation,
    getCaseByCitation,
    getLawByCitation,
    getCoverage
  };
}
