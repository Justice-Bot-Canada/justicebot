import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MeritScoreInput {
  caseId: string;
  province: string;
  venue: string;
  issueType: string;
  description: string;
  evidenceIds?: string[];
  incidentDate?: string;
  filingDeadline?: string;
}

interface ElementScore {
  element_key: string;
  element_name: string;
  score: 0 | 1 | 2 | 3;
  evidence_matched: boolean;
}

interface CaseLawMatch {
  citation: string;
  similarity: number;
  outcome: 'granted' | 'partial' | 'dismissed';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: MeritScoreInput = await req.json();
    console.log('Formal merit score request:', input);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const CANLII_API_KEY = Deno.env.get('CANLII_API_KEY');

    // 1. Fetch legal elements for this issue type
    const { data: elements } = await supabase
      .from('legal_elements')
      .select('*')
      .eq('pathway_category', mapVenueToCategory(input.venue))
      .eq('issue_type', input.issueType)
      .order('order_index');

    console.log(`Found ${elements?.length || 0} legal elements`);

    // 2. Fetch evidence for case
    const { data: evidence } = await supabase
      .from('evidence')
      .select('id, file_name, description, file_type, ocr_text, tags')
      .eq('case_id', input.caseId);

    console.log(`Found ${evidence?.length || 0} evidence items`);

    // 3. Fetch merit score config
    const { data: scoreConfig } = await supabase
      .from('merit_score_config')
      .select('*');

    // 4. Calculate Path Fit (0-15)
    const pathFitScore = calculatePathFit(input);
    console.log('Path fit score:', pathFitScore);

    // 5. Use AI to analyze elements and evidence
    let elementScores: ElementScore[] = [];
    let evidenceScore = 0;
    let caseLawScore = 0;
    let caseLawMatches: CaseLawMatch[] = [];
    let topStrengths: string[] = [];
    let topRisks: string[] = [];
    let nextActions: string[] = [];

    if (LOVABLE_API_KEY) {
      const analysisResult = await analyzeWithAI(
        input,
        elements || [],
        evidence || [],
        LOVABLE_API_KEY,
        CANLII_API_KEY
      );
      
      elementScores = analysisResult.elementScores;
      evidenceScore = analysisResult.evidenceScore;
      caseLawScore = analysisResult.caseLawScore;
      caseLawMatches = analysisResult.caseLawMatches;
      topStrengths = analysisResult.topStrengths;
      topRisks = analysisResult.topRisks;
      nextActions = analysisResult.nextActions;
    } else {
      // Fallback: basic scoring without AI
      elementScores = (elements || []).map(el => ({
        element_key: el.element_key,
        element_name: el.element_name,
        score: 1 as 0 | 1 | 2 | 3,
        evidence_matched: false,
      }));
      evidenceScore = Math.min(25, (evidence?.length || 0) * 5);
    }

    // 6. Calculate elements coverage score (normalize to 25)
    const maxElementPoints = (elements?.length || 1) * 3;
    const rawElementScore = elementScores.reduce((sum, e) => sum + e.score, 0);
    const normalizedElementScore = Math.round((rawElementScore / maxElementPoints) * 25);

    // 7. Calculate penalty (-15 to 0)
    const deadlineWarnings: string[] = [];
    let penalty = 0;
    
    if (input.filingDeadline) {
      const deadline = new Date(input.filingDeadline);
      const now = new Date();
      const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil < 0) {
        penalty = -15;
        deadlineWarnings.push(`Filing deadline passed ${Math.abs(daysUntil)} days ago - case may be barred`);
      } else if (daysUntil < 7) {
        penalty = -7;
        deadlineWarnings.push(`Only ${daysUntil} days until filing deadline - urgent action needed`);
      } else if (daysUntil < 30) {
        penalty = -3;
        deadlineWarnings.push(`Filing deadline in ${daysUntil} days - plan accordingly`);
      }
    }

    // Check for limitation period risks based on incident date
    if (input.incidentDate) {
      const incident = new Date(input.incidentDate);
      const now = new Date();
      const yearsSince = (now.getTime() - incident.getTime()) / (1000 * 60 * 60 * 24 * 365);
      
      if (yearsSince > 2) {
        penalty = Math.min(penalty, -15);
        deadlineWarnings.push('Incident over 2 years ago - may exceed limitation period');
      } else if (yearsSince > 1.5) {
        penalty = Math.min(penalty, -7);
        deadlineWarnings.push('Incident over 18 months ago - check limitation period');
      }
    }

    // 8. Calculate total score
    const breakdown = {
      path_fit: pathFitScore,
      elements: normalizedElementScore,
      evidence: evidenceScore,
      case_law: caseLawScore,
      penalty: penalty,
    };

    const totalScore = Math.max(0, Math.min(100,
      breakdown.path_fit +
      breakdown.elements +
      breakdown.evidence +
      breakdown.case_law +
      breakdown.penalty
    ));

    // 9. Determine band
    const band = getScoreBand(totalScore);

    // 10. Log audit trail
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('case_merit_audit').insert({
        case_id: input.caseId,
        user_id: user.id,
        query_signature: `${input.province}:${input.venue}:${input.issueType}`,
        jurisdiction: input.province,
        decision: {
          score: totalScore,
          band,
          breakdown,
          element_scores: elementScores,
        },
        weights: scoreConfig,
      });
    }

    const result = {
      score: totalScore,
      band,
      breakdown,
      top_strengths: topStrengths,
      top_risks: topRisks,
      next_best_actions: nextActions,
      element_coverage: elementScores,
      case_law_matches: caseLawMatches,
      deadline_warnings: deadlineWarnings,
    };

    console.log('Merit score result:', { score: totalScore, band, breakdown });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Formal merit score error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function mapVenueToCategory(venue: string): string {
  const venueMap: Record<string, string> = {
    LTB: 'housing',
    RTB: 'housing',
    RTDRS: 'housing',
    TAL: 'housing',
    HRTO: 'human_rights',
    BCHRT: 'human_rights',
    AHRC: 'human_rights',
    CDPDJ: 'human_rights',
    SMALL_CLAIMS: 'small_claims',
    CRT: 'small_claims',
    LABOUR: 'employment',
    LRB: 'employment',
    ALRB: 'employment',
    TAT: 'employment',
    FAMILY: 'family',
    CRIMINAL: 'criminal',
  };
  return venueMap[venue?.toUpperCase()] || 'small_claims';
}

function calculatePathFit(input: MeritScoreInput): number {
  let score = 0;
  
  // Province provided? +3
  if (input.province) score += 3;
  
  // Venue provided and valid? +4
  const validVenues = ['LTB', 'RTB', 'RTDRS', 'TAL', 'HRTO', 'BCHRT', 'AHRC', 'SMALL_CLAIMS', 'CRT', 'FAMILY', 'CRIMINAL', 'LABOUR'];
  if (input.venue && validVenues.includes(input.venue.toUpperCase())) score += 4;
  
  // Issue type provided? +4
  if (input.issueType) score += 4;
  
  // Description substantive? +4
  if (input.description && input.description.length > 50) score += 4;
  
  return Math.min(15, score);
}

function getScoreBand(score: number): 'Weak' | 'Fair' | 'Moderate' | 'Strong' | 'Very Strong' {
  if (score >= 80) return 'Very Strong';
  if (score >= 65) return 'Strong';
  if (score >= 50) return 'Moderate';
  if (score >= 35) return 'Fair';
  return 'Weak';
}

async function analyzeWithAI(
  input: MeritScoreInput,
  elements: any[],
  evidence: any[],
  apiKey: string,
  canliiKey?: string | null
): Promise<{
  elementScores: ElementScore[];
  evidenceScore: number;
  caseLawScore: number;
  caseLawMatches: CaseLawMatch[];
  topStrengths: string[];
  topRisks: string[];
  nextActions: string[];
}> {
  // Build element list for AI
  const elementList = elements.map(e => ({
    key: e.element_key,
    name: e.element_name,
    description: e.element_description,
    hint: e.evidence_hint,
  }));

  // Build evidence summary
  const evidenceSummary = evidence.map((e, i) => 
    `${i + 1}. ${e.file_name} (${e.file_type})${e.description ? `: ${e.description}` : ''}${e.ocr_text ? `\n   Text: ${e.ocr_text.substring(0, 200)}...` : ''}`
  ).join('\n');

  const systemPrompt = `You are a Canadian legal merit analyzer. Score each legal element and assess evidence quality.

For each element, score 0-3:
- 0: Missing - no facts alleged
- 1: Vague - alleged but unclear
- 2: Specific - clear facts stated
- 3: Corroborated - facts + evidence match

Evidence quality factors (each 0-1): relevance, reliability, timestamp, pattern, corroboration

Return structured JSON analysis.`;

  const userPrompt = `Analyze this ${input.venue} case in ${input.province}:

ISSUE TYPE: ${input.issueType}
DESCRIPTION: ${input.description}

LEGAL ELEMENTS TO SCORE:
${JSON.stringify(elementList, null, 2)}

UPLOADED EVIDENCE (${evidence.length} items):
${evidenceSummary || 'No evidence uploaded'}

Return JSON with:
{
  "elementScores": [{"element_key": "...", "score": 0-3, "evidence_matched": true/false}],
  "evidenceScore": 0-25,
  "caseLawScore": 0-25,
  "caseLawMatches": [{"citation": "...", "similarity": 0-1, "outcome": "granted|partial|dismissed"}],
  "topStrengths": ["strength 1", "strength 2"],
  "topRisks": ["risk 1", "risk 2"],
  "nextActions": ["action 1", "action 2"]
}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      console.error('AI response error:', response.status);
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error('No AI response content');

    const parsed = JSON.parse(content);
    
    // Map element scores with names
    const elementScores: ElementScore[] = (parsed.elementScores || []).map((es: any) => {
      const element = elements.find(e => e.element_key === es.element_key);
      return {
        element_key: es.element_key,
        element_name: element?.element_name || es.element_key,
        score: Math.min(3, Math.max(0, es.score)) as 0 | 1 | 2 | 3,
        evidence_matched: es.evidence_matched || false,
      };
    });

    return {
      elementScores,
      evidenceScore: Math.min(25, Math.max(0, parsed.evidenceScore || 0)),
      caseLawScore: Math.min(25, Math.max(0, parsed.caseLawScore || 0)),
      caseLawMatches: (parsed.caseLawMatches || []).slice(0, 5),
      topStrengths: (parsed.topStrengths || []).slice(0, 5),
      topRisks: (parsed.topRisks || []).slice(0, 5),
      nextActions: (parsed.nextActions || []).slice(0, 5),
    };
  } catch (err) {
    console.error('AI analysis failed:', err);
    // Return basic scores
    return {
      elementScores: elements.map(e => ({
        element_key: e.element_key,
        element_name: e.element_name,
        score: 1 as 0 | 1 | 2 | 3,
        evidence_matched: false,
      })),
      evidenceScore: Math.min(25, evidence.length * 5),
      caseLawScore: 10,
      caseLawMatches: [],
      topStrengths: ['Case details provided'],
      topRisks: ['AI analysis unavailable - manual review recommended'],
      nextActions: ['Upload supporting evidence', 'Review legal elements'],
    };
  }
}
