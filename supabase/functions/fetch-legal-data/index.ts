import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// A2AJ API - Open access, no key required
const A2AJ_API_BASE = 'https://api.a2aj.ca';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { queryType, params, source = 'a2aj' } = await req.json();
    
    // Prefer A2AJ (open, no key needed) unless user specifies CanLII
    if (source === 'a2aj' || source === 'auto') {
      return await handleA2AJRequest(queryType, params);
    } else {
      return await handleCanLIIRequest(queryType, params);
    }
  } catch (error) {
    console.error('Error in fetch-legal-data:', error);
    return new Response(
      JSON.stringify({ error: error.message, data: null }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleA2AJRequest(queryType: string, params: any) {
  try {
    let endpoint = '';
    let queryParams = new URLSearchParams();

    switch (queryType) {
      case 'search_cases':
        endpoint = `${A2AJ_API_BASE}/cases/search`;
        if (params.query) queryParams.set('q', params.query);
        if (params.jurisdiction) queryParams.set('court', params.jurisdiction);
        if (params.year) queryParams.set('year', params.year);
        if (params.limit) queryParams.set('limit', params.limit);
        break;

      case 'search_legislation':
        endpoint = `${A2AJ_API_BASE}/legislation/search`;
        if (params.query) queryParams.set('q', params.query);
        if (params.type) queryParams.set('type', params.type); // 'statute' or 'regulation'
        if (params.limit) queryParams.set('limit', params.limit);
        break;

      case 'get_case':
        endpoint = `${A2AJ_API_BASE}/cases/${params.court}/${params.caseId}`;
        break;

      case 'get_legislation':
        endpoint = `${A2AJ_API_BASE}/legislation/${params.legislationId}`;
        break;

      case 'get_by_citation':
        endpoint = `${A2AJ_API_BASE}/citation`;
        queryParams.set('citation', params.citation);
        break;

      default:
        throw new Error('Invalid query type for A2AJ');
    }

    const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
    console.log('Fetching from A2AJ:', url);
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('A2AJ API error:', response.status, errorText);
      throw new Error(`A2AJ API error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ data, source: 'a2aj', error: null }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('A2AJ request error:', error);
    throw error;
  }
}

async function handleCanLIIRequest(queryType: string, params: any) {
  try {
    const CANLII_API_KEY = Deno.env.get('CANLII_API_KEY');
    
    if (!CANLII_API_KEY) {
      console.error('CANLII_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'CanLII API key not configured. Using A2AJ instead.', data: null }), 
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
      JSON.stringify({ data, source: 'canlii', error: null }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('CanLII request error:', error);
    throw error;
  }
}
