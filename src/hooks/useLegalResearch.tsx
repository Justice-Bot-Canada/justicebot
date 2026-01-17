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
  const [saving, setSaving] = useState(false);

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
    } catch (error: unknown) {
      console.error('Error searching cases:', error);
      
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : 'Failed to search legal cases',
        variant: "destructive",
      });
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  const saveToCase = async (caseId: string, userId: string, caseResult: CaseResult) => {
    setSaving(true);
    try {
      const content = `**${caseResult.title}**\n\nCitation: ${caseResult.citation}\nCourt: ${caseResult.court}\nDate: ${caseResult.date}\n\n${caseResult.summary}\n\nSource: ${caseResult.url}`;
      
      const { error } = await supabase
        .from('case_notes')
        .insert({
          case_id: caseId,
          user_id: userId,
          content,
          note_type: 'legal_research',
        });

      if (error) throw error;

      toast({
        title: "Saved to Case",
        description: `"${caseResult.title}" added to your case notes`,
      });
      return true;
    } catch (error: unknown) {
      console.error('Error saving to case:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : 'Failed to save research',
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return {
    loading,
    saving,
    results,
    searchCases,
    saveToCase,
    clearResults,
  };
}
