import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, ExternalLink, BookOpen } from 'lucide-react';
import { useLegalResearch, CaseResult } from '@/hooks/useLegalResearch';

interface LegalResearchPanelProps {
  defaultQuery?: string;
}

export function LegalResearchPanel({ defaultQuery = '' }: LegalResearchPanelProps) {
  const { loading, results, searchCases } = useLegalResearch();
  const [query, setQuery] = useState(defaultQuery);
  const [jurisdiction, setJurisdiction] = useState('on');

  const handleSearch = () => {
    if (!query.trim()) return;
    searchCases(query, jurisdiction);
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
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found {results.length} relevant case{results.length !== 1 ? 's' : ''}
            </p>
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
