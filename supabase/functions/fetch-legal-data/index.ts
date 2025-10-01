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
      case 'search_legislation':
        // A2AJ uses a unified /search endpoint for both cases and legislation
        endpoint = `${A2AJ_API_BASE}/search`;
        if (params.query) queryParams.set('q', params.query);
        
        // Filter by type: cases or legislation
        if (queryType === 'search_cases') {
          queryParams.set('category', 'case');
        } else if (queryType === 'search_legislation') {
          queryParams.set('category', 'legislation');
        }
        
        // Optional filters
        if (params.court) queryParams.set('dataset', params.court);
        if (params.year) queryParams.set('year', params.year);
        if (params.sort) queryParams.set('sort', params.sort); // 'newest', 'oldest', or default (relevance)
        if (params.limit) queryParams.set('limit', params.limit);
        if (params.offset) queryParams.set('offset', params.offset);
        break;

      case 'get_by_citation':
        // A2AJ uses /fetch endpoint for citation lookups
        endpoint = `${A2AJ_API_BASE}/fetch`;
        if (params.citation) queryParams.set('citation', params.citation);
        if (params.start) queryParams.set('start', params.start); // Character slice start
        if (params.end) queryParams.set('end', params.end); // Character slice end
        if (params.section) queryParams.set('section', params.section); // For laws only
        break;

      case 'get_coverage':
        // Get dataset coverage stats
        endpoint = `${A2AJ_API_BASE}/coverage`;
        if (params.dataset) queryParams.set('dataset', params.dataset);
        if (params.doc_type) queryParams.set('doc_type', params.doc_type); // 'laws' or 'cases'
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
      throw new Error(`A2AJ API error: ${response.status} - ${errorText}`);
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
