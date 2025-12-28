import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  query?: string;
  court?: string;
  source_code?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Get auth header if present
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} }
    });

    // Parse search parameters
    let params: SearchParams = {};
    
    if (req.method === 'POST') {
      params = await req.json();
    } else {
      const url = new URL(req.url);
      params = {
        query: url.searchParams.get('query') || undefined,
        court: url.searchParams.get('court') || undefined,
        source_code: url.searchParams.get('source_code') || undefined,
        date_from: url.searchParams.get('date_from') || undefined,
        date_to: url.searchParams.get('date_to') || undefined,
        limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined,
        offset: url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!) : undefined,
      };
    }

    const { query, court, source_code, date_from, date_to, limit = 20, offset = 0 } = params;

    console.log('Case law search:', JSON.stringify(params));

    // Build query
    let dbQuery = supabase
      .from('legal_documents')
      .select(`
        id,
        title,
        citation,
        court,
        decision_date,
        url,
        summary,
        keywords,
        created_at,
        source:legal_sources(code, name)
      `, { count: 'exact' });

    // Apply filters
    if (court) {
      dbQuery = dbQuery.ilike('court', `%${court}%`);
    }

    if (source_code) {
      // Join with source to filter by code
      const { data: sourceData } = await supabase
        .from('legal_sources')
        .select('id')
        .eq('code', source_code)
        .single();
      
      if (sourceData) {
        dbQuery = dbQuery.eq('source_id', sourceData.id);
      }
    }

    if (date_from) {
      dbQuery = dbQuery.gte('decision_date', date_from);
    }

    if (date_to) {
      dbQuery = dbQuery.lte('decision_date', date_to);
    }

    // Full-text search if query provided
    if (query && query.trim()) {
      // Use PostgreSQL full-text search with ranking
      const searchTerms = query.trim().split(/\s+/).join(' & ');
      
      dbQuery = dbQuery.or(`title.ilike.%${query}%,citation.ilike.%${query}%,content_text.ilike.%${query}%`);
    }

    // Apply pagination and ordering
    dbQuery = dbQuery
      .order('decision_date', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    const { data: documents, error, count } = await dbQuery;

    if (error) {
      console.error('Search error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }

    // If full-text query, also get trigram similarity scores for ranking
    let rankedDocs = documents || [];
    
    if (query && query.trim() && rankedDocs.length > 0) {
      // Score documents by relevance
      rankedDocs = rankedDocs.map(doc => {
        let score = 0;
        const q = query.toLowerCase();
        const title = (doc.title || '').toLowerCase();
        const citation = (doc.citation || '').toLowerCase();
        
        // Exact citation match gets highest score
        if (citation.includes(q)) score += 100;
        
        // Title contains query
        if (title.includes(q)) score += 50;
        
        // Title starts with query
        if (title.startsWith(q)) score += 25;
        
        return { ...doc, relevance_score: score };
      }).sort((a, b) => b.relevance_score - a.relevance_score);
    }

    const response = {
      success: true,
      query: params,
      total: count || rankedDocs.length,
      limit,
      offset,
      results: rankedDocs.map(doc => ({
        id: doc.id,
        title: doc.title,
        citation: doc.citation,
        court: doc.court,
        decision_date: doc.decision_date,
        url: doc.url,
        summary: doc.summary,
        keywords: doc.keywords,
        source: doc.source,
        relevance_score: (doc as any).relevance_score
      }))
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});