import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { queryType, params } = await req.json();
    const CANLII_API_KEY = Deno.env.get('CANLII_API_KEY');
    
    if (!CANLII_API_KEY) {
      console.error('CANLII_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'CanLII API key not configured', data: null }), 
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let endpoint = '';
    let queryParams = new URLSearchParams();

    switch (queryType) {
      case 'search_cases':
        endpoint = 'https://api.canlii.org/v1/caseBrowse/en/';
        if (params.jurisdiction) queryParams.set('jurisdiction', params.jurisdiction);
        if (params.query) queryParams.set('search', params.query);
        if (params.year) queryParams.set('publishedAfter', `${params.year}-01-01`);
        queryParams.set('resultCount', params.limit || '10');
        break;

      case 'search_legislation':
        endpoint = 'https://api.canlii.org/v1/legislationBrowse/en/';
        if (params.jurisdiction) queryParams.set('jurisdiction', params.jurisdiction);
        if (params.query) queryParams.set('search', params.query);
        queryParams.set('resultCount', params.limit || '10');
        break;

      case 'get_document':
        // Get specific case or legislation by ID
        endpoint = `https://api.canlii.org/v1/${params.type || 'case'}/${params.jurisdiction}/${params.documentId}`;
        break;

      case 'citator':
        // Get citing cases
        endpoint = `https://api.canlii.org/v1/caseCitator/en/${params.jurisdiction}/${params.caseId}`;
        break;

      default:
        throw new Error('Invalid query type');
    }

    const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
    
    console.log('Fetching from CanLII:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CANLII_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CanLII API error:', response.status, errorText);
      throw new Error(`CanLII API error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ data, error: null }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-canlii-data:', error);
    return new Response(
      JSON.stringify({ error: error.message, data: null }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
