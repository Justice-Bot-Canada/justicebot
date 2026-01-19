import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * MERIT SCORE COMPUTATION
 * 
 * Triggered on:
 * - Triage complete
 * - Evidence upload
 * - Evidence delete
 * 
 * Components (0-100 total):
 * - Evidence Strength (0-40)
 * - Legal Issue Match (0-25)
 * - Timeline & Compliance (0-15)
 * - Precedent/Pattern Match (0-10)
 * - Risk Flags (-10 to 0)
 */

interface MeritComponents {
  evidence: number;      // 0-40
  legal: number;         // 0-25
  timeline: number;      // 0-15
  pattern: number;       // 0-10
  risk: number;          // -10 to 0
}

interface MeritResult {
  score: number;
  band: 'Weak' | 'Fair' | 'Moderate' | 'Strong' | 'Very Strong';
  components: MeritComponents;
  reasons: string[];
  strengths: string[];
  weaknesses: string[];
  gaps: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  try {
    // Authenticate
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { caseId } = await req.json();

    if (!caseId) {
      return new Response(JSON.stringify({ error: 'caseId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch case
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError || !caseData) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify ownership
    if (caseData.user_id !== userData.user.id) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch evidence
    const { data: evidence } = await supabase
      .from('evidence')
      .select(`
        id, file_name, file_type, description, ocr_text, tags,
        evidence_metadata (
          doc_type, category, confidence_score, flags, dates
        )
      `)
      .eq('case_id', caseId);

    console.log(`Computing merit for case ${caseId}: ${evidence?.length || 0} evidence items`);

    // ==================
    // CALCULATE MERIT
    // ==================
    const result = calculateMerit(caseData, evidence || []);

    // Persist to case_merit table (upsert)
    await supabase
      .from('case_merit')
      .upsert({
        case_id: caseId,
        score_total: result.score,
        components: result.components,
        reasons: result.reasons,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        gaps: result.gaps,
        updated_at: new Date().toISOString()
      }, { onConflict: 'case_id' });

    // Also update cases.merit_score for backward compatibility
    await supabase
      .from('cases')
      .update({ 
        merit_score: result.score,
        updated_at: new Date().toISOString()
      })
      .eq('id', caseId);

    // Log analytics event
    await supabase.from('funnel_events').insert({
      user_id: userData.user.id,
      case_id: caseId,
      event_type: 'merit_score_generated',
      event_data: { score: result.score, band: result.band }
    });

    console.log(`Merit computed: ${result.score} (${result.band})`);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Merit computation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Merit computation failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateMerit(caseData: any, evidence: any[]): MeritResult {
  const components: MeritComponents = {
    evidence: 0,
    legal: 0,
    timeline: 0,
    pattern: 0,
    risk: 0
  };

  const reasons: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const gaps: string[] = [];

  // ==================
  // 1. Evidence Strength (0-40)
  // ==================
  const evidenceCount = evidence.length;
  
  // Base score from quantity
  if (evidenceCount >= 7) {
    components.evidence = 25;
    strengths.push(`Strong evidence base with ${evidenceCount} documents`);
  } else if (evidenceCount >= 4) {
    components.evidence = 18;
    strengths.push('Good evidence documentation');
  } else if (evidenceCount >= 2) {
    components.evidence = 10;
    weaknesses.push('Consider uploading more supporting documents');
  } else if (evidenceCount >= 1) {
    components.evidence = 5;
    weaknesses.push('Limited evidence - more documentation recommended');
  } else {
    components.evidence = 0;
    gaps.push('No evidence uploaded - critical for case strength');
  }

  // Bonus for evidence types
  const hasPhotos = evidence.some(e => e.file_type?.startsWith('image/'));
  const hasOfficialDocs = evidence.some(e => 
    e.file_name?.toLowerCase().includes('notice') ||
    e.file_name?.toLowerCase().includes('letter') ||
    e.file_name?.toLowerCase().includes('form')
  );
  const hasTimestamps = evidence.some(e => e.evidence_metadata?.[0]?.dates);

  if (hasPhotos) {
    components.evidence += 5;
    strengths.push('Photographic evidence included');
  }
  if (hasOfficialDocs) {
    components.evidence += 5;
    strengths.push('Official documents or notices present');
  }
  if (hasTimestamps) {
    components.evidence += 5;
    reasons.push('Evidence has clear date documentation');
  }

  components.evidence = Math.min(40, components.evidence);

  // ==================
  // 2. Legal Issue Match (0-25)
  // ==================
  const hasVenue = !!caseData.venue;
  const hasDescription = (caseData.description?.length || 0) > 50;
  const hasTriage = !!caseData.triage_complete;
  const hasLawSection = !!caseData.law_section;

  if (hasVenue) {
    components.legal += 8;
    reasons.push(`Case properly categorized for ${caseData.venue}`);
  } else {
    gaps.push('No legal venue selected - pathway unclear');
  }

  if (hasDescription) {
    components.legal += 7;
  } else {
    weaknesses.push('Case description is brief - add more details');
  }

  if (hasTriage) {
    components.legal += 5;
    strengths.push('Triage questionnaire completed');
  }

  if (hasLawSection) {
    components.legal += 5;
    reasons.push('Specific legal grounds identified');
  }

  components.legal = Math.min(25, components.legal);

  // ==================
  // 3. Timeline & Compliance (0-15)
  // ==================
  const caseAge = (Date.now() - new Date(caseData.created_at).getTime()) / (1000 * 60 * 60 * 24);
  
  if (caseAge < 30) {
    components.timeline = 10;
    reasons.push('Recent case - timelines likely compliant');
  } else if (caseAge < 90) {
    components.timeline = 7;
  } else if (caseAge < 180) {
    components.timeline = 4;
    weaknesses.push('Case is several months old - check limitation periods');
  } else {
    components.timeline = 0;
    gaps.push('Case may be past limitation period - verify deadlines');
  }

  // Bonus for complete timeline
  if (evidence.length >= 3) {
    components.timeline += 5;
  }

  components.timeline = Math.min(15, components.timeline);

  // ==================
  // 4. Pattern Match (0-10)
  // ==================
  // Simple heuristic based on common case patterns
  const description = (caseData.description || '').toLowerCase();
  const knownPatterns = [
    { keywords: ['repairs', 'maintenance', 'pest', 'mold'], score: 8 },
    { keywords: ['harassment', 'threat', 'intimidation'], score: 7 },
    { keywords: ['eviction', 'n4', 'n12', 'notice'], score: 8 },
    { keywords: ['rent increase', 'above guideline'], score: 7 },
    { keywords: ['discrimination', 'human rights'], score: 6 },
    { keywords: ['wrongful dismissal', 'termination'], score: 7 },
  ];

  for (const pattern of knownPatterns) {
    if (pattern.keywords.some(k => description.includes(k))) {
      components.pattern = pattern.score;
      reasons.push('Case matches known successful claim pattern');
      break;
    }
  }

  // ==================
  // 5. Risk Flags (-10 to 0)
  // ==================
  const riskFactors: string[] = [];

  if (!hasVenue) {
    components.risk -= 3;
    riskFactors.push('No legal venue specified');
  }

  if (evidenceCount === 0) {
    components.risk -= 5;
    riskFactors.push('No evidence uploaded');
  }

  if (caseAge > 365) {
    components.risk -= 5;
    riskFactors.push('Case may be time-barred');
  }

  if (riskFactors.length > 0) {
    weaknesses.push(...riskFactors);
  }

  components.risk = Math.max(-10, Math.min(0, components.risk));

  // ==================
  // TOTAL SCORE
  // ==================
  const total = Math.max(0, Math.min(100,
    components.evidence +
    components.legal +
    components.timeline +
    components.pattern +
    components.risk
  ));

  // Determine band
  let band: MeritResult['band'];
  if (total >= 80) band = 'Very Strong';
  else if (total >= 65) band = 'Strong';
  else if (total >= 50) band = 'Moderate';
  else if (total >= 35) band = 'Fair';
  else band = 'Weak';

  return {
    score: total,
    band,
    components,
    reasons,
    strengths,
    weaknesses,
    gaps
  };
}
