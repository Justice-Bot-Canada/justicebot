import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query, jurisdiction = 'on', maxResults = 10 }: SearchRequest = await req.json();
    const apiKey = Deno.env.get('CANLII_API_KEY');

    if (!apiKey) {
      throw new Error('CanLII API key not configured');
    }

    console.log('Searching CanLII API:', { query, jurisdiction, maxResults });

    // Search CanLII database using the API
    const searchUrl = `https://api.canlii.org/v1/caseBrowse/${jurisdiction}/en/?api_key=${apiKey}&resultCount=${maxResults}&search=${encodeURIComponent(query)}`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`CanLII API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform CanLII results to our format
    const results = (data.cases || []).map((caseItem: any) => ({
      title: caseItem.title || caseItem.databaseId || 'Untitled Case',
      citation: caseItem.citation || caseItem.databaseId || 'N/A',
      date: caseItem.decisionDate || 'Unknown',
      court: caseItem.court || 'Unknown Court',
      url: caseItem.url || `https://www.canlii.org/en/${jurisdiction}/${caseItem.databaseId}`,
      summary: caseItem.summary || 'No summary available',
      relevance: 100,
    }));

    console.log(`Found ${results.length} CanLII results`);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        query,
        jurisdiction,
        isMockData: false,
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
