import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-internal-key',
};

interface LegalSource {
  id: string;
  code: string;
  name: string;
  base_url: string;
  listing_url: string;
  rate_limit_ms: number;
}

interface DocumentMeta {
  url: string;
  title: string;
  citation?: string;
  date?: string;
  court?: string;
}

// Polite delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Parse SCC recent decisions page
async function parseSCCListing(html: string, baseUrl: string): Promise<DocumentMeta[]> {
  const docs: DocumentMeta[] = [];
  
  // SCC uses a table-based layout for recent decisions
  // Match links to judgment pages
  const linkPattern = /<a[^>]+href="([^"]*case-dossier\/info\/sum-som-eng\.aspx\?cas=[^"]+)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  
  while ((match = linkPattern.exec(html)) !== null) {
    const relativeUrl = match[1];
    const title = match[2].trim();
    const url = relativeUrl.startsWith('http') ? relativeUrl : `${baseUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
    
    // Extract citation from title if present (e.g., "2024 SCC 1")
    const citationMatch = title.match(/(\d{4}\s+SCC\s+\d+)/i);
    
    docs.push({
      url,
      title: title.replace(/\s+/g, ' ').trim(),
      citation: citationMatch ? citationMatch[1] : undefined,
      court: 'Supreme Court of Canada'
    });
  }
  
  // Also try to find PDF/HTML judgment links
  const judgmentPattern = /<a[^>]+href="([^"]*\/judgments-jugements\/[^"]+)"[^>]*>([^<]+)<\/a>/gi;
  while ((match = judgmentPattern.exec(html)) !== null) {
    const relativeUrl = match[1];
    const title = match[2].trim();
    const url = relativeUrl.startsWith('http') ? relativeUrl : `${baseUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
    
    if (!docs.some(d => d.url === url)) {
      docs.push({
        url,
        title,
        court: 'Supreme Court of Canada'
      });
    }
  }
  
  console.log(`SCC: Found ${docs.length} documents`);
  return docs;
}

// Parse Federal Court / FCA decisions (CanLII-style interface)
async function parseFederalCourtListing(html: string, baseUrl: string, courtName: string): Promise<DocumentMeta[]> {
  const docs: DocumentMeta[] = [];
  
  // Federal courts use a structured listing
  // Look for decision links in the standard format
  const linkPattern = /<a[^>]+href="([^"]*\/[a-z]{2}\/item\/\d+\/[^"]*)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  
  while ((match = linkPattern.exec(html)) !== null) {
    const relativeUrl = match[1];
    const title = match[2].trim();
    const url = relativeUrl.startsWith('http') ? relativeUrl : `${baseUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
    
    // Try to extract citation
    const citationMatch = title.match(/(\d{4}\s+(?:FCA|FC|CAF|CF)\s+\d+)/i);
    
    // Try to extract date from URL or content
    const dateMatch = relativeUrl.match(/\/(\d{4})[^\d]/);
    
    docs.push({
      url,
      title: title.replace(/\s+/g, ' ').trim(),
      citation: citationMatch ? citationMatch[1] : undefined,
      date: dateMatch ? dateMatch[1] : undefined,
      court: courtName
    });
  }
  
  // Alternative pattern for newer interface
  const altPattern = /<h4[^>]*class="[^"]*decision[^"]*"[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
  while ((match = altPattern.exec(html)) !== null) {
    const url = match[1];
    const title = match[2].trim();
    
    if (!docs.some(d => d.url === url)) {
      docs.push({
        url: url.startsWith('http') ? url : `${baseUrl}${url}`,
        title,
        court: courtName
      });
    }
  }
  
  console.log(`${courtName}: Found ${docs.length} documents`);
  return docs;
}

// Fetch and parse a single document page
async function fetchDocumentContent(url: string): Promise<{ text: string; html: string; hash: string } | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Justice-Bot/1.0 (Legal Research Tool; +https://justice-bot.com)',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    
    const html = await response.text();
    
    // Extract main content - try common selectors
    let text = '';
    
    // Try to find main content area
    const contentPatterns = [
      /<div[^>]+id="MainContent"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]+class="[^"]*decision-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<main[^>]*>([\s\S]*?)<\/main>/i,
    ];
    
    for (const pattern of contentPatterns) {
      const match = html.match(pattern);
      if (match) {
        text = match[1];
        break;
      }
    }
    
    // Fallback to body
    if (!text) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      text = bodyMatch ? bodyMatch[1] : html;
    }
    
    // Strip HTML tags for text version
    text = text
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#\d+;/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Generate content hash for deduplication
    const encoder = new TextEncoder();
    const data = encoder.encode(text.substring(0, 10000)); // Hash first 10k chars
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return { text, html, hash };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

// Main sweep function for a single source
async function sweepSource(
  supabase: ReturnType<typeof createClient>,
  source: LegalSource
): Promise<{ found: number; new: number; updated: number; errors: string[] }> {
  const result = { found: 0, new: 0, updated: 0, errors: [] as string[] };
  
  console.log(`Starting sweep for ${source.name} (${source.code})`);
  
  // Create sweep run record
  const { data: runData, error: runError } = await supabase
    .from('legal_sweep_runs')
    .insert({ source_id: source.id, status: 'running' })
    .select()
    .single();
  
  if (runError) {
    console.error('Failed to create sweep run:', runError);
    result.errors.push(`Failed to create sweep run: ${runError.message}`);
    return result;
  }
  
  const runId = runData.id;
  
  try {
    // Fetch listing page
    console.log(`Fetching listing: ${source.listing_url}`);
    const response = await fetch(source.listing_url, {
      headers: {
        'User-Agent': 'Justice-Bot/1.0 (Legal Research Tool; +https://justice-bot.com)',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch listing: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Parse documents based on source type
    let documents: DocumentMeta[];
    switch (source.code) {
      case 'SCC':
        documents = await parseSCCListing(html, source.base_url);
        break;
      case 'FCA':
        documents = await parseFederalCourtListing(html, source.base_url, 'Federal Court of Appeal');
        break;
      case 'FC':
        documents = await parseFederalCourtListing(html, source.base_url, 'Federal Court');
        break;
      default:
        documents = [];
    }
    
    result.found = documents.length;
    
    // Process each document
    for (const doc of documents) {
      try {
        // Check if document already exists
        const { data: existing } = await supabase
          .from('legal_documents')
          .select('id, content_hash')
          .eq('url', doc.url)
          .single();
        
        // Fetch document content
        await delay(source.rate_limit_ms);
        const content = await fetchDocumentContent(doc.url);
        
        if (!content) {
          result.errors.push(`Failed to fetch content for ${doc.url}`);
          continue;
        }
        
        if (existing) {
          // Check if content changed
          if (existing.content_hash !== content.hash) {
            await supabase
              .from('legal_documents')
              .update({
                content_text: content.text,
                content_html: content.html,
                content_hash: content.hash,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id);
            result.updated++;
          }
        } else {
          // Insert new document
          const { error: insertError } = await supabase
            .from('legal_documents')
            .insert({
              source_id: source.id,
              url: doc.url,
              title: doc.title,
              citation: doc.citation,
              court: doc.court,
              decision_date: doc.date ? `${doc.date}-01-01` : null,
              content_text: content.text,
              content_html: content.html,
              content_hash: content.hash,
              is_processed: true
            });
          
          if (insertError) {
            // Skip if duplicate URL (race condition)
            if (!insertError.message.includes('duplicate')) {
              result.errors.push(`Insert error for ${doc.url}: ${insertError.message}`);
            }
          } else {
            result.new++;
          }
        }
      } catch (docError) {
        const errMsg = docError instanceof Error ? docError.message : String(docError);
        result.errors.push(`Error processing ${doc.url}: ${errMsg}`);
      }
    }
    
    // Update source last_sweep_at
    await supabase
      .from('legal_sources')
      .update({ last_sweep_at: new Date().toISOString() })
      .eq('id', source.id);
    
    // Complete sweep run
    await supabase
      .from('legal_sweep_runs')
      .update({
        completed_at: new Date().toISOString(),
        status: 'completed',
        docs_found: result.found,
        docs_new: result.new,
        docs_updated: result.updated,
        errors: result.errors
      })
      .eq('id', runId);
      
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    result.errors.push(errMsg);
    
    await supabase
      .from('legal_sweep_runs')
      .update({
        completed_at: new Date().toISOString(),
        status: 'failed',
        errors: result.errors
      })
      .eq('id', runId);
  }
  
  console.log(`Completed sweep for ${source.name}: found=${result.found}, new=${result.new}, updated=${result.updated}`);
  return result;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify internal key for security (service-role only)
    const internalKey = req.headers.get('x-internal-key');
    const expectedKey = Deno.env.get('INTERNAL_SWEEP_KEY');
    
    if (!expectedKey || internalKey !== expectedKey) {
      console.error('Unauthorized sweep attempt');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for optional source filter
    let sourceCode: string | null = null;
    try {
      const body = await req.json();
      sourceCode = body?.source || null;
    } catch {
      // No body or invalid JSON - sweep all sources
    }

    // Fetch active sources
    let query = supabase
      .from('legal_sources')
      .select('*')
      .eq('is_active', true);
    
    if (sourceCode) {
      query = query.eq('code', sourceCode);
    }
    
    const { data: sources, error: sourcesError } = await query;
    
    if (sourcesError) {
      throw new Error(`Failed to fetch sources: ${sourcesError.message}`);
    }

    if (!sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active sources to sweep', results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sweep each source sequentially to respect rate limits
    const results: Record<string, { found: number; new: number; updated: number; errors: string[] }> = {};
    
    for (const source of sources) {
      results[source.code] = await sweepSource(supabase, source);
      
      // Delay between sources
      if (sources.indexOf(source) < sources.length - 1) {
        await delay(5000);
      }
    }

    const summary = {
      sources_swept: Object.keys(results).length,
      total_found: Object.values(results).reduce((sum, r) => sum + r.found, 0),
      total_new: Object.values(results).reduce((sum, r) => sum + r.new, 0),
      total_updated: Object.values(results).reduce((sum, r) => sum + r.updated, 0),
      results
    };

    console.log('Sweep complete:', JSON.stringify(summary));

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Sweep error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});