import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  console.log(`[CanLII Sweeper] ${step}`, details ? JSON.stringify(details) : '');
};

// Legal areas to search for new cases
const LEGAL_AREAS = [
  { keyword: 'landlord tenant', jurisdiction: 'on', areas: ['ltb'] },
  { keyword: 'human rights tribunal', jurisdiction: 'on', areas: ['hrto'] },
  { keyword: 'small claims', jurisdiction: 'on', areas: ['small_claims'] },
  { keyword: 'family law custody', jurisdiction: 'on', areas: ['family'] },
  { keyword: 'employment wrongful dismissal', jurisdiction: 'on', areas: ['labour'] },
  { keyword: 'residential tenancies act', jurisdiction: 'on', areas: ['ltb'] },
  { keyword: 'human rights code discrimination', jurisdiction: 'on', areas: ['hrto'] },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Starting CanLII case law sweep');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const canliiApiKey = Deno.env.get('CANLII_API_KEY');
    const canliiBaseUrl = Deno.env.get('CANLII_BASE_URL') || 'https://api.canlii.org/v1';

    if (!canliiApiKey) {
      throw new Error('CANLII_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let totalNewCases = 0;
    let totalUpdates = 0;

    // Get date range for recent cases (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

    for (const area of LEGAL_AREAS) {
      logStep(`Searching CanLII for: ${area.keyword}`);

      try {
        // Search CanLII API for recent cases
        const searchUrl = `${canliiBaseUrl}/caseBrowse/${area.jurisdiction}?api_key=${canliiApiKey}&offset=0&resultCount=20`;
        
        const response = await fetch(searchUrl, {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          logStep(`CanLII API error for ${area.keyword}`, { status: response.status });
          continue;
        }

        const data = await response.json();
        const cases = data.caseBrowse || data.cases || [];

        logStep(`Found ${cases.length} cases for ${area.keyword}`);

        for (const caseItem of cases) {
          const caseId = caseItem.caseId?.en || caseItem.databaseId || caseItem.id;
          if (!caseId) continue;

          // Check if we already have this case
          const { data: existing } = await supabase
            .from('canlii_case_updates')
            .select('id')
            .eq('case_id', caseId)
            .single();

          if (!existing) {
            // Insert new case
            const { error: insertError } = await supabase
              .from('canlii_case_updates')
              .insert({
                case_id: caseId,
                title: caseItem.title || caseItem.name,
                citation: caseItem.citation,
                decision_date: caseItem.decisionDate,
                court: caseItem.court || caseItem.tribunal,
                jurisdiction: area.jurisdiction,
                url: caseItem.url || `https://www.canlii.org/en/on/cases/${caseId}`,
                keywords: area.areas,
                summary: caseItem.summary || null
              });

            if (!insertError) {
              totalNewCases++;

              // Also add to legal_updates for tracking
              await supabase
                .from('legal_updates')
                .insert({
                  source: 'canlii',
                  update_type: 'new_case',
                  title: caseItem.title || caseItem.name || 'New Case',
                  description: `New case law from ${caseItem.court || 'tribunal'}: ${caseItem.citation || caseId}`,
                  jurisdiction: area.jurisdiction,
                  affected_areas: area.areas,
                  url: caseItem.url || `https://www.canlii.org/en/on/cases/${caseId}`
                });

              totalUpdates++;
            }
          }
        }
      } catch (areaError) {
        logStep(`Error processing ${area.keyword}`, { error: areaError.message });
      }
    }

    logStep('CanLII sweep complete', { newCases: totalNewCases, updates: totalUpdates });

    return new Response(
      JSON.stringify({
        success: true,
        newCases: totalNewCases,
        updates: totalUpdates,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logStep('Sweep failed', { error: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
