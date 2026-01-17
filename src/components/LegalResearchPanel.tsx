import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, ExternalLink, BookOpen, Sparkles, Save, Check } from 'lucide-react';
import { useLegalResearch, CaseResult } from '@/hooks/useLegalResearch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { NextStepsActionPanel } from '@/components/NextStepsActionPanel';

interface LegalResearchPanelProps {
  defaultQuery?: string;
  caseId?: string;
}

export function LegalResearchPanel({ defaultQuery = '', caseId: propCaseId }: LegalResearchPanelProps) {
  const { loading, saving, results, searchCases, saveToCase } = useLegalResearch();
  const { toast } = useToast();
  const { user } = useAuth();
  const [savedResults, setSavedResults] = useState<Set<number>>(new Set());
  const [cases, setCases] = useState<{ id: string; title: string }[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(propCaseId || '');
  const [loadingCases, setLoadingCases] = useState(false);

  // Load user's cases for saving research
  useEffect(() => {
    if (!user) return;
    
    const loadCases = async () => {
      setLoadingCases(true);
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('id, title')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        setCases(data || []);
        
        // Auto-select first case if none provided
        if (!propCaseId && data && data.length > 0) {
          setSelectedCaseId(data[0].id);
        }
      } catch (error) {
        console.error('Error loading cases:', error);
      } finally {
        setLoadingCases(false);
      }
    };
    
    loadCases();
  }, [user, propCaseId]);

  const handleSaveToCase = async (result: CaseResult, index: number) => {
    if (!user || !selectedCaseId) {
      toast({
        title: "Cannot Save",
        description: user ? "Please select a case first" : "Please sign in to save research",
        variant: "destructive",
      });
      return;
    }
    
    const success = await saveToCase(selectedCaseId, user.id, result);
    if (success) {
      setSavedResults(prev => new Set(prev).add(index));
    }
  };
  const [query, setQuery] = useState(defaultQuery);
  const [jurisdiction, setJurisdiction] = useState('on');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzingAI, setAnalyzingAI] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setAiAnalysis(null); // Clear previous analysis
    searchCases(query, jurisdiction);
  };

  const handleAIAnalysis = async () => {
    if (results.length === 0) return;
    
    setAnalyzingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-legal-research', {
        body: {
          searchResults: results,
          userQuery: query,
          caseContext: null
        }
      });

      if (error) throw error;

      setAiAnalysis(data.analysis);
      toast({
        title: "AI Analysis Complete",
        description: "Review the insights below"
      });
    } catch (error: any) {
      console.error("Error analyzing research:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze results",
        variant: "destructive"
      });
    } finally {
      setAnalyzingAI(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Legal Research Assistant
        </CardTitle>
        <CardDescription>
          Search CanLII for relevant case law and precedents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Controls */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search for cases... (e.g., 'landlord tenant repairs')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Select value={jurisdiction} onValueChange={setJurisdiction}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on">Ontario</SelectItem>
              <SelectItem value="bc">BC</SelectItem>
              <SelectItem value="ab">Alberta</SelectItem>
              <SelectItem value="qc">Quebec</SelectItem>
              <SelectItem value="ca">Federal</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Searching CanLII database...</p>
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No cases found. Try different keywords.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Found {results.length} relevant case{results.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                {user && cases.length > 0 && (
                  <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                    <SelectTrigger className="w-40 h-8 text-xs">
                      <SelectValue placeholder="Select case" />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">
                          {c.title.length > 25 ? c.title.slice(0, 25) + '...' : c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAIAnalysis}
                  disabled={analyzingAI}
                >
                  {analyzingAI ? (
                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="h-3 w-3 mr-1" /> AI Analysis</>
                  )}
                </Button>
              </div>
            </div>

            {aiAnalysis && (
              <Alert className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-sm mt-2 whitespace-pre-wrap">
                  {aiAnalysis}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
            {results.map((result, i) => (
              <div key={i} className="p-4 border rounded-lg bg-card space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{result.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {result.citation} • {result.court} • {result.date}
                    </p>
                    <p className="text-sm">{result.summary}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Relevance: {Math.round(result.relevance * 10) / 10}
                  </Badge>
                </div>
                <div className="flex justify-end gap-2">
                  {user && selectedCaseId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveToCase(result, i)}
                      disabled={saving || savedResults.has(i)}
                    >
                      {savedResults.has(i) ? (
                        <><Check className="mr-2 h-3 w-3 text-green-600" /> Saved</>
                      ) : saving ? (
                        <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Saving...</>
                      ) : (
                        <><Save className="mr-2 h-3 w-3" /> Save to Case</>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(result.url, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Read Full Case
                  </Button>
                </div>
              </div>
            ))}
            </div>

            {/* What Happens Next - Action Panel */}
            <NextStepsActionPanel caseId={selectedCaseId} variant="compact" className="mt-4" />
          </>
        )}

        {!loading && results.length === 0 && !query && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Enter keywords to search for relevant case law</p>
            <p className="text-xs mt-2">Examples: "tenant repairs", "discrimination workplace", "custody dispute"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
