import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface LegalDataParams {
  queryType: 'search_cases' | 'search_legislation' | 'get_case' | 'get_legislation' | 'get_by_citation';
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
    start?: string; // Character slice start position
    end?: string; // Character slice end position
    section?: string; // Section number for laws/regulations
    type?: 'statute' | 'regulation';
    doc_type?: 'laws' | 'cases';
  };
  source?: 'a2aj' | 'canlii' | 'auto';
}

export function useLegalData() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
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

  const getCaseByCitation = async (citation: string, start?: string, end?: string) => {
    return fetchLegalData({
      queryType: 'get_by_citation',
      params: { citation, start, end }
    });
  };

  const getLawByCitation = async (citation: string, section?: string, start?: string, end?: string) => {
    return fetchLegalData({
      queryType: 'get_by_citation',
      params: { citation, section, start, end }
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
