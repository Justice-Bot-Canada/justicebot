import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { caseId, includeTableOfContents = true, numberingStyle = 'alphabetical' } = await req.json();

    if (!caseId) {
      return new Response(JSON.stringify({ error: 'Case ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user owns this case
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id, user_id')
      .eq('id', caseId)
      .eq('user_id', userData.user.id)
      .single();

    if (caseError || !caseData) {
      return new Response(JSON.stringify({ error: 'Case not found or access denied' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all evidence for this case with metadata
    const { data: evidenceData, error: evidenceError } = await supabase
      .from('evidence')
      .select(`
        *,
        evidence_metadata (
          doc_type,
          category,
          dates,
          extracted_text
        )
      `)
      .eq('case_id', caseId)
      .order('uploaded_at', { ascending: true });

    if (evidenceError) throw evidenceError;

    if (!evidenceData || evidenceData.length === 0) {
      return new Response(JSON.stringify({ error: 'No evidence found for this case' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate exhibit labels (A, B, C... or 1, 2, 3...)
    const exhibits = evidenceData.map((item: any, index: number) => {
      const label = numberingStyle === 'alphabetical' 
        ? String.fromCharCode(65 + index) // A, B, C...
        : (index + 1).toString(); // 1, 2, 3...

      return {
        label: `Exhibit ${label}`,
        file_name: item.file_name,
        file_url: item.file_url,
        description: item.description,
        category: item.evidence_metadata?.[0]?.category,
        date: item.evidence_metadata?.[0]?.dates?.captured || 
              item.evidence_metadata?.[0]?.dates?.incident ||
              item.uploaded_at,
        summary: item.evidence_metadata?.[0]?.extracted_text
      };
    });

    // Create exhibits records in database
    const exhibitRecords = exhibits.map((exhibit, index) => ({
      case_id: caseId,
      evidence_id: evidenceData[index].id,
      label: exhibit.label,
      order_index: index
    }));

    const { error: insertError } = await supabase
      .from('exhibits')
      .upsert(exhibitRecords, { 
        onConflict: 'case_id,evidence_id',
        ignoreDuplicates: false 
      });

    if (insertError) {
      console.error('Error creating exhibit records:', insertError);
    }

    // Generate Table of Contents
    const tableOfContents = exhibits.map(exhibit => ({
      label: exhibit.label,
      title: exhibit.file_name,
      category: exhibit.category,
      date: exhibit.date,
      summary: exhibit.summary
    }));

    console.log(`Generated exhibit book with ${exhibits.length} exhibits for case ${caseId}`);

    return new Response(
      JSON.stringify({
        success: true,
        caseId,
        exhibitCount: exhibits.length,
        exhibits,
        tableOfContents: includeTableOfContents ? tableOfContents : undefined,
        message: 'Exhibit book generated successfully. Download links for individual exhibits included.'
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Error generating exhibit book:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to generate exhibit book'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
