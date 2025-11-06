import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, ExternalLink, BookOpen, AlertTriangle, Sparkles } from 'lucide-react';
import { useLegalResearch, CaseResult } from '@/hooks/useLegalResearch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LegalResearchPanelProps {
  defaultQuery?: string;
}

export function LegalResearchPanel({ defaultQuery = '' }: LegalResearchPanelProps) {
  const { loading, results, searchCases } = useLegalResearch();
  const { toast } = useToast();
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
        {/* Development Notice */}
        <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Under Development:</strong> This feature is currently showing demo results while we await CanLII API access. 
            Accurate case law data will be available in the coming days.
          </AlertDescription>
        </Alert>
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
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Found {results.length} relevant case{results.length !== 1 ? 's' : ''}
              </p>
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
                <div className="flex justify-end">
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
