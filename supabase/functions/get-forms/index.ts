import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * GET /api/forms - DB-DRIVEN FORMS API
 * 
 * Query params:
 * - province: ON, BC, AB, etc.
 * - jurisdiction: LTB, HRTO, COURT
 * - tags: comma-separated (e.g., tenant_repairs,harassment)
 * - category: tenant_rights, maintenance, etc.
 * 
 * Rules:
 * - Returns only status=active forms
 * - Returns newest version_date per form_id
 * - If DB fails → 503 FORMS_LIBRARY_UNAVAILABLE
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ 
      error: 'FORMS_LIBRARY_UNAVAILABLE',
      message: 'Service configuration error'
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    const province = url.searchParams.get('province') || 'ON';
    const jurisdiction = url.searchParams.get('jurisdiction');
    const tags = url.searchParams.get('tags');
    const category = url.searchParams.get('category');
    const formCode = url.searchParams.get('form_code');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build query with filters
    let query = supabase
      .from('forms')
      .select('*')
      .eq('status', 'active')
      .eq('is_active', true);

    // Province filter
    if (province) {
      query = query.eq('province', province.toUpperCase());
    }

    // Jurisdiction filter (LTB, HRTO, COURT)
    if (jurisdiction) {
      query = query.eq('jurisdiction', jurisdiction.toUpperCase());
    }

    // Category filter
    if (category) {
      query = query.eq('category', category);
    }

    // Specific form code lookup
    if (formCode) {
      query = query.eq('form_code', formCode);
    }

    // Order by version_date descending to get newest first
    query = query.order('version_date', { ascending: false });

    const { data: forms, error } = await query;

    if (error) {
      console.error('DB query failed:', error);
      return new Response(JSON.stringify({ 
        error: 'FORMS_LIBRARY_UNAVAILABLE',
        message: 'Database query failed',
        details: error.message
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!forms || forms.length === 0) {
      return new Response(JSON.stringify({ 
        forms: [],
        count: 0,
        filters: { province, jurisdiction, category, tags },
        message: 'No forms found matching criteria'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Filter by tags if provided (comma-separated)
    let filteredForms = forms;
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim().toLowerCase());
      filteredForms = forms.filter(form => {
        const formCategory = (form.category || '').toLowerCase();
        const formDescription = (form.description || '').toLowerCase();
        return tagList.some(tag => 
          formCategory.includes(tag) || 
          formDescription.includes(tag)
        );
      });
    }

    // Deduplicate by form_code, keeping newest version_date
    const formMap = new Map();
    for (const form of filteredForms) {
      const key = form.form_code;
      if (!formMap.has(key) || new Date(form.version_date) > new Date(formMap.get(key).version_date)) {
        formMap.set(key, form);
      }
    }

    const uniqueForms = Array.from(formMap.values());

    console.log(`Returning ${uniqueForms.length} forms for ${province}/${jurisdiction || 'all'}`);

    return new Response(JSON.stringify({ 
      forms: uniqueForms,
      count: uniqueForms.length,
      filters: { province, jurisdiction, category, tags },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Forms API error:', error);
    return new Response(JSON.stringify({ 
      error: 'FORMS_LIBRARY_UNAVAILABLE',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

