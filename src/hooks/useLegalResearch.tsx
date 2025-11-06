import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CaseResult {
  title: string;
  citation: string;
  date: string;
  court: string;
  url: string;
  summary: string;
  relevance: number;
}

export function useLegalResearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CaseResult[]>([]);

  const searchCases = async (query: string, jurisdiction: string = 'on', maxResults: number = 10) => {
    setLoading(true);
    try {
      console.log('Searching CanLII:', query);

      const { data, error } = await supabase.functions.invoke('search-canlii', {
        body: {
          query,
          jurisdiction,
          maxResults,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to search cases');
      }

      setResults(data.results);
      
      if (data.results.length === 0) {
        toast({
          title: "No Results",
          description: "No relevant cases found. Try different keywords.",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${data.results.length} relevant cases`,
        });
      }

      return data.results;
    } catch (error: any) {
      console.error('Error searching cases:', error);
      
      toast({
        title: "Search Error",
        description: error.message || 'Failed to search legal cases',
        variant: "destructive",
      });
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return {
    loading,
    results,
    searchCases,
    clearResults,
  };
}
