import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  jurisdiction?: string;
  maxResults?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, jurisdiction = 'on', maxResults = 10 }: SearchRequest = await req.json();

    console.log('Searching CanLII:', { query, jurisdiction, maxResults });

    const CANLII_API_KEY = Deno.env.get('CANLII_API_KEY');
    if (!CANLII_API_KEY) {
      throw new Error('CANLII_API_KEY not configured');
    }

    // CanLII API v2 endpoint
    const searchUrl = new URL('https://api.canlii.org/v1/caseBrowse/en/');
    searchUrl.searchParams.append('api_key', CANLII_API_KEY);
    searchUrl.searchParams.append('resultCount', String(maxResults));
    
    // Search within specific jurisdiction if provided
    if (jurisdiction) {
      searchUrl.pathname = `/v1/caseBrowse/en/${jurisdiction}/`;
    }

    const response = await fetch(searchUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CanLII API error:', response.status, errorText);
      throw new Error(`CanLII API error: ${response.status}`);
    }

    const data = await response.json();

    // Now search within the results using the query
    const searchResults = await searchCases(data.caseBrowse || [], query, CANLII_API_KEY);

    console.log(`Found ${searchResults.length} relevant cases`);

    return new Response(
      JSON.stringify({
        success: true,
        results: searchResults,
        query,
        jurisdiction,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error searching CanLII:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function searchCases(cases: any[], query: string, apiKey: string) {
  const results = [];
  const queryLower = query.toLowerCase();

  for (const caseItem of cases.slice(0, 20)) {
    try {
      // Fetch case details
      const caseUrl = `https://api.canlii.org${caseItem.url}?api_key=${apiKey}`;
      const caseResponse = await fetch(caseUrl);
      
      if (!caseResponse.ok) continue;

      const caseData = await caseResponse.json();
      const caseTitle = caseData.title || '';
      const caseText = JSON.stringify(caseData).toLowerCase();

      // Simple relevance check
      if (caseTitle.toLowerCase().includes(queryLower) || 
          caseText.includes(queryLower)) {
        
        results.push({
          title: caseData.title,
          citation: caseData.citation || 'No citation',
          date: caseData.decisionDate || 'Unknown date',
          court: caseData.court || 'Unknown court',
          url: `https://www.canlii.org${caseItem.url}`,
          summary: extractSummary(caseData),
          relevance: calculateRelevance(caseText, queryLower),
        });
      }

      if (results.length >= 10) break;

    } catch (error) {
      console.error('Error fetching case:', error);
      continue;
    }
  }

  // Sort by relevance
  return results.sort((a, b) => b.relevance - a.relevance);
}

function extractSummary(caseData: any): string {
  // Try to extract a meaningful summary
  const text = caseData.content || caseData.title || '';
  const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 20);
  
  if (sentences.length === 0) return 'No summary available';
  
  const summary = sentences.slice(0, 3).join('. ').substring(0, 300);
  return summary + (summary.length < text.length ? '...' : '');
}

function calculateRelevance(text: string, query: string): number {
  const words = query.split(/\s+/);
  let score = 0;

  for (const word of words) {
    const matches = (text.match(new RegExp(word, 'gi')) || []).length;
    score += matches;
  }

  return score;
}
