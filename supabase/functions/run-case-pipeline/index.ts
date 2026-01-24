import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * POST-EVIDENCE PIPELINE
 * 
 * This is the core intelligence layer that runs after evidence upload:
 * 1. Evidence Processing - extract text, metadata, dates, parties, keywords
 * 2. Merit Score (1-100) - case readiness score (ALWAYS FREE)
 * 3. CanLII Search - find similar precedents
 * 4. Legal Pathways - recommend forums and approaches
 * 5. Form Suggestions - specific forms based on pathway
 */

interface PipelineRequest {
  caseId: string;
  description?: string;
  province?: string;
}

interface EvidenceItem {
  id: string;
  file_name: string;
  file_type: string;
  description?: string;
  ocr_text?: string;
  metadata?: {
    doc_type?: string;
    category?: string;
    parties?: Record<string, unknown>;
    dates?: Record<string, unknown>;
    extracted_text?: string;
    evidence_value?: string;
    legal_issues?: string[];
    suggested_forms?: string[];
  };
}

interface PathwayResult {
  id: string;
  name: string;
  forum: string;
  whyApplies: string;
  whatToProve: string[];
  risks: string[];
  deadlines: string[];
  estimatedTimeline: string;
  estimatedCost: string;
  successRate: string;
  isPrimary: boolean;
}

interface FormSuggestion {
  formCode: string;
  formName: string;
  tribunal: string;
  purpose: string;
  relevanceScore: number;
  conditions: string[];
}

interface MeritBreakdown {
  evidenceQuantity: number;      // 0-20
  evidenceRelevance: number;     // 0-20
  timelineCompleteness: number;  // 0-15
  internalConsistency: number;   // 0-15
  precedentAlignment: number;    // 0-20
  remedyStrength: number;        // 0-10
  penalty: number;               // -10 to 0
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

  try {
    // Authenticate user
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

    const { caseId, description, province = 'ON' }: PipelineRequest = await req.json();

    if (!caseId) {
      return new Response(JSON.stringify({ error: 'caseId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Starting case pipeline for:', caseId);

    // =====================================
    // STEP 0: Set merit_status = 'pending' IMMEDIATELY
    // =====================================
    await supabase
      .from('cases')
      .update({ 
        merit_status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', caseId);

    // =====================================
    // STEP 1: Fetch case and evidence data
    // =====================================
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError || !caseData) {
      // Set error status if case not found
      await supabase
        .from('cases')
        .update({ 
          merit_status: 'error',
          merit_error: 'Case not found',
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);
        
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

    // Fetch evidence with metadata
    const { data: evidenceData } = await supabase
      .from('evidence')
      .select(`
        id, file_name, file_type, description, ocr_text,
        evidence_metadata (
          doc_type, category, parties, dates, extracted_text,
          confidence_score, flags
        )
      `)
      .eq('case_id', caseId);

    const evidence: EvidenceItem[] = (evidenceData || []).map((e: any) => ({
      id: e.id,
      file_name: e.file_name,
      file_type: e.file_type,
      description: e.description,
      ocr_text: e.ocr_text,
      metadata: e.evidence_metadata?.[0] ? {
        doc_type: e.evidence_metadata[0].doc_type,
        category: e.evidence_metadata[0].category,
        parties: e.evidence_metadata[0].parties,
        dates: e.evidence_metadata[0].dates,
        extracted_text: e.evidence_metadata[0].extracted_text,
        evidence_value: e.evidence_metadata[0].flags?.evidence_value,
        legal_issues: e.evidence_metadata[0].flags?.legal_issues,
        suggested_forms: e.evidence_metadata[0].flags?.suggested_forms,
      } : undefined
    }));

    console.log(`Found ${evidence.length} evidence items`);

    // Build case profile from evidence
    const caseProfile = buildCaseProfile(caseData, evidence, description);

    // =====================================
    // STEP 2: Calculate Merit Score (FREE)
    // =====================================
    const meritResult = calculateMeritScore(caseProfile, evidence);
    console.log('Merit score calculated:', meritResult.score);

    // =====================================
    // STEP 3: Search CanLII for precedents
    // =====================================
    let precedents: any[] = [];
    try {
      const canliiQuery = buildCanLIIQuery(caseProfile);
      const canliiApiKey = Deno.env.get('CANLII_API_KEY');
      
      if (canliiApiKey && canliiQuery) {
        const jurisdiction = mapProvinceToJurisdiction(province || caseData.province || 'ON');
        const searchUrl = `https://api.canlii.org/v1/caseBrowse/${jurisdiction}/en/?api_key=${canliiApiKey}&resultCount=10&search=${encodeURIComponent(canliiQuery)}`;
        
        const canliiResponse = await fetch(searchUrl);
        if (canliiResponse.ok) {
          const canliiData = await canliiResponse.json();
          precedents = (canliiData.cases || []).slice(0, 5).map((c: any) => ({
            citation: c.citation || c.databaseId,
            title: c.title,
            date: c.decisionDate,
            court: c.court,
            outcome: inferOutcome(c),
            relevance: 0.85,
            url: c.url || `https://www.canlii.org/en/${jurisdiction}/${c.databaseId}`
          }));
        }
      }
    } catch (e) {
      console.error('CanLII search failed:', e);
    }

    // =====================================
    // STEP 4: Generate Legal Pathways
    // =====================================
    const pathways = await generatePathways(
      caseProfile, 
      meritResult, 
      precedents, 
      province || caseData.province || 'ON',
      lovableApiKey
    );

    // =====================================
    // STEP 5: Suggest Forms Based on Pathway
    // =====================================
    const formSuggestions = generateFormSuggestions(
      pathways, 
      caseProfile, 
      province || caseData.province || 'ON'
    );

    // =====================================
    // STEP 6: Store Results (CRITICAL - mark merit complete)
    // =====================================
    // Update case with merit score AND mark as complete
    const { error: updateError } = await supabase
      .from('cases')
      .update({ 
        merit_score: meritResult.score,
        merit_status: 'complete',
        merit_error: null,
        merit_updated_at: new Date().toISOString(),
        status: 'analyzed',
        flow_step: 'pathways_ready',
        updated_at: new Date().toISOString()
      })
      .eq('id', caseId);

    if (updateError) {
      console.error('Failed to update case with merit score:', updateError);
      // Mark as error if update failed
      await supabase
        .from('cases')
        .update({ 
          merit_status: 'error',
          merit_error: updateError.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);
    }

    // Store pathway if we have a primary one
    const primaryPathway = pathways.find(p => p.isPrimary) || pathways[0];
    if (primaryPathway) {
      await supabase
        .from('legal_pathways')
        .upsert({
          case_id: caseId,
          user_id: userData.user.id,
          pathway_type: primaryPathway.id,
          recommendation: primaryPathway.whyApplies,
          confidence_score: meritResult.score,
          relevant_laws: pathways.map(p => p.forum),
          next_steps: primaryPathway.whatToProve
        }, { onConflict: 'case_id' });
    }

    // Log audit event
    await supabase.from('security_audit_log').insert({
      user_id: userData.user.id,
      action: 'case_pipeline_complete',
      resource_type: 'case',
      resource_id: caseId,
      metadata: {
        merit_score: meritResult.score,
        evidence_count: evidence.length,
        pathways_count: pathways.length,
        precedents_count: precedents.length
      }
    });

    // =====================================
    // STEP 7: Return Complete Analysis
    // =====================================
    const response = {
      success: true,
      caseId,
      
      // ALWAYS FREE - Merit Score
      meritScore: {
        score: meritResult.score,
        band: getScoreBand(meritResult.score),
        breakdown: meritResult.breakdown,
        strengths: meritResult.strengths,
        weaknesses: meritResult.weaknesses,
        gaps: meritResult.gaps,
      },

      // PARTIALLY FREE - Pathway Summaries
      pathways: pathways.map(p => ({
        id: p.id,
        name: p.name,
        forum: p.forum,
        isPrimary: p.isPrimary,
        // Free: basic info
        summaryFree: `${p.name} - ${p.forum}`,
        // Paywalled: detailed info
        whyApplies: p.whyApplies,
        whatToProve: p.whatToProve,
        risks: p.risks,
        deadlines: p.deadlines,
        estimatedTimeline: p.estimatedTimeline,
        estimatedCost: p.estimatedCost,
        successRate: p.successRate,
      })),

      // PAYWALLED - Form Suggestions
      formSuggestions: formSuggestions.map(f => ({
        formCode: f.formCode,
        formName: f.formName,
        tribunal: f.tribunal,
        // Free: just the name
        // Paywalled: purpose, conditions
        purpose: f.purpose,
        conditions: f.conditions,
        relevanceScore: f.relevanceScore,
      })),

      // Precedents (partial free)
      precedents: precedents.map(p => ({
        citation: p.citation,
        // Free: citation only
        // Paywalled: full details
        title: p.title,
        outcome: p.outcome,
        relevance: p.relevance,
        url: p.url,
      })),

      // Metadata
      evidenceCount: evidence.length,
      analyzedAt: new Date().toISOString(),
    };

    console.log('Pipeline complete:', { 
      meritScore: response.meritScore.score, 
      pathways: response.pathways.length,
      forms: response.formSuggestions.length 
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Pipeline error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Pipeline failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// =====================================
// HELPER FUNCTIONS
// =====================================

interface CaseProfile {
  description: string;
  province: string;
  venue: string;
  category: string;
  keywords: string[];
  parties: { applicant?: string; respondent?: string };
  dates: { incident?: string; deadline?: string };
  amounts: string[];
  issues: string[];
}

function buildCaseProfile(caseData: any, evidence: EvidenceItem[], description?: string): CaseProfile {
  const desc = description || caseData.description || '';
  const lowerDesc = desc.toLowerCase();
  
  // Detect category from keywords
  let category = 'civil';
  const keywords: string[] = [];
  const issues: string[] = [];
  
  // Landlord-tenant keywords
  const ltbKeywords = ['landlord', 'tenant', 'rent', 'eviction', 'lease', 'repairs', 'maintenance', 'n4', 'n12', 'ltb', 'pest', 'cockroach', 'mice', 'bed bug'];
  // Human rights keywords
  const hrKeywords = ['discrimination', 'harassment', 'human rights', 'hrto', 'disability', 'race', 'gender', 'accommodation', 'retaliation'];
  // Employment keywords
  const empKeywords = ['employer', 'workplace', 'fired', 'terminated', 'wrongful dismissal', 'severance', 'employment'];
  // Small claims keywords
  const scKeywords = ['small claims', 'money owed', 'debt', 'contract', 'damages'];
  
  ltbKeywords.forEach(k => { if (lowerDesc.includes(k)) { keywords.push(k); category = 'landlord-tenant'; } });
  hrKeywords.forEach(k => { if (lowerDesc.includes(k)) { keywords.push(k); category = 'human-rights'; } });
  empKeywords.forEach(k => { if (lowerDesc.includes(k)) { keywords.push(k); category = 'employment'; } });
  scKeywords.forEach(k => { if (lowerDesc.includes(k)) { keywords.push(k); category = 'small-claims'; } });

  // Extract issues from evidence metadata
  evidence.forEach(e => {
    if (e.metadata?.legal_issues) {
      issues.push(...e.metadata.legal_issues);
    }
    if (e.metadata?.category) {
      keywords.push(e.metadata.category.toLowerCase());
    }
  });

  // Extract parties and dates from evidence
  let parties: { applicant?: string; respondent?: string } = {};
  let dates: { incident?: string; deadline?: string } = {};
  let amounts: string[] = [];

  evidence.forEach(e => {
    if (e.metadata?.parties) {
      if (typeof e.metadata.parties === 'object') {
        const p = e.metadata.parties as Record<string, string>;
        if (p.tenant) parties.applicant = p.tenant;
        if (p.landlord) parties.respondent = p.landlord;
        if (p.applicant) parties.applicant = p.applicant;
        if (p.respondent) parties.respondent = p.respondent;
      }
    }
    if (e.metadata?.dates) {
      const d = e.metadata.dates as Record<string, string>;
      if (d.incident) dates.incident = d.incident;
      if (d.deadline) dates.deadline = d.deadline;
    }
  });

  // Extract amounts from description
  const amountMatches = desc.match(/\$[\d,]+\.?\d*/g);
  if (amountMatches) amounts = amountMatches;

  return {
    description: desc,
    province: caseData.province || 'ON',
    venue: caseData.venue || category,
    category,
    keywords: [...new Set(keywords)],
    parties,
    dates,
    amounts,
    issues: [...new Set(issues)],
  };
}

function calculateMeritScore(profile: CaseProfile, evidence: EvidenceItem[]): {
  score: number;
  breakdown: MeritBreakdown;
  strengths: string[];
  weaknesses: string[];
  gaps: string[];
} {
  const breakdown: MeritBreakdown = {
    evidenceQuantity: 0,
    evidenceRelevance: 0,
    timelineCompleteness: 0,
    internalConsistency: 0,
    precedentAlignment: 0,
    remedyStrength: 0,
    penalty: 0,
  };

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const gaps: string[] = [];

  // Evidence Quantity (0-20)
  if (evidence.length >= 5) {
    breakdown.evidenceQuantity = 20;
    strengths.push(`Strong evidence base (${evidence.length} documents)`);
  } else if (evidence.length >= 3) {
    breakdown.evidenceQuantity = 15;
    strengths.push('Adequate evidence documentation');
  } else if (evidence.length >= 1) {
    breakdown.evidenceQuantity = 8;
    weaknesses.push('Limited evidence - consider uploading more documents');
  } else {
    breakdown.evidenceQuantity = 0;
    gaps.push('No evidence uploaded - critical gap');
  }

  // Evidence Relevance (0-20)
  const highValueEvidence = evidence.filter(e => e.metadata?.evidence_value === 'high').length;
  const mediumValueEvidence = evidence.filter(e => e.metadata?.evidence_value === 'medium').length;
  breakdown.evidenceRelevance = Math.min(20, (highValueEvidence * 8) + (mediumValueEvidence * 4));
  
  if (highValueEvidence > 0) {
    strengths.push(`${highValueEvidence} high-value evidence item(s)`);
  }
  if (breakdown.evidenceRelevance < 10) {
    weaknesses.push('Evidence relevance could be stronger');
  }

  // Timeline Completeness (0-15)
  const hasIncidentDate = !!profile.dates.incident;
  const hasDeadlineDate = !!profile.dates.deadline;
  const hasDatedEvidence = evidence.some(e => e.metadata?.dates);
  
  if (hasIncidentDate && hasDatedEvidence) {
    breakdown.timelineCompleteness = 15;
    strengths.push('Clear timeline established');
  } else if (hasIncidentDate || hasDatedEvidence) {
    breakdown.timelineCompleteness = 8;
    weaknesses.push('Timeline could be more complete');
  } else {
    breakdown.timelineCompleteness = 0;
    gaps.push('No dates identified - establish a clear timeline');
  }

  // Internal Consistency (0-15)
  // Check for contradictions in evidence
  breakdown.internalConsistency = 12; // Default to good unless we detect issues
  if (profile.keywords.length > 3) {
    breakdown.internalConsistency = 15;
    strengths.push('Consistent narrative across evidence');
  }

  // Precedent Alignment (0-20)
  // Based on how well the case fits known legal patterns
  if (profile.category !== 'civil' && profile.keywords.length >= 3) {
    breakdown.precedentAlignment = 18;
    strengths.push('Case fits established legal patterns');
  } else if (profile.keywords.length >= 1) {
    breakdown.precedentAlignment = 10;
  } else {
    breakdown.precedentAlignment = 5;
    gaps.push('Case type unclear - provide more details');
  }

  // Remedy Strength (0-10)
  if (profile.amounts.length > 0) {
    breakdown.remedyStrength = 8;
    strengths.push('Specific damages/amounts identified');
  } else if (profile.description.length > 200) {
    breakdown.remedyStrength = 5;
  } else {
    breakdown.remedyStrength = 2;
    weaknesses.push('Remedy sought is unclear');
  }

  // Penalties
  if (hasDeadlineDate) {
    const deadline = new Date(profile.dates.deadline!);
    const now = new Date();
    const daysUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysUntilDeadline < 0) {
      breakdown.penalty = -10;
      weaknesses.push('⚠️ Deadline may have passed');
    } else if (daysUntilDeadline < 14) {
      breakdown.penalty = -5;
      weaknesses.push('⚠️ Approaching deadline - act soon');
    }
  }

  const score = Math.max(0, Math.min(100,
    breakdown.evidenceQuantity +
    breakdown.evidenceRelevance +
    breakdown.timelineCompleteness +
    breakdown.internalConsistency +
    breakdown.precedentAlignment +
    breakdown.remedyStrength +
    breakdown.penalty
  ));

  return { score, breakdown, strengths, weaknesses, gaps };
}

function getScoreBand(score: number): string {
  if (score >= 80) return 'Very Strong';
  if (score >= 65) return 'Strong';
  if (score >= 50) return 'Moderate';
  if (score >= 35) return 'Fair';
  return 'Weak';
}

function buildCanLIIQuery(profile: CaseProfile): string {
  const terms: string[] = [];
  
  // Add category-specific terms
  if (profile.category === 'landlord-tenant') {
    terms.push('residential tenancy');
    if (profile.keywords.includes('repairs')) terms.push('maintenance');
    if (profile.keywords.includes('eviction')) terms.push('termination');
    if (profile.keywords.includes('harassment')) terms.push('harassment tenant');
  } else if (profile.category === 'human-rights') {
    terms.push('discrimination');
    profile.keywords.filter(k => hrKeywords.includes(k)).forEach(k => terms.push(k));
  } else if (profile.category === 'employment') {
    terms.push('wrongful dismissal');
  }
  
  // Add specific issues
  profile.issues.slice(0, 3).forEach(i => terms.push(i));
  
  return terms.slice(0, 5).join(' ');
}

const hrKeywords = ['discrimination', 'harassment', 'disability', 'race', 'gender', 'accommodation', 'retaliation'];

function mapProvinceToJurisdiction(province: string): string {
  const map: Record<string, string> = {
    'ON': 'on',
    'Ontario': 'on',
    'BC': 'bc',
    'AB': 'ab',
    'QC': 'qc',
    'MB': 'mb',
    'SK': 'sk',
    'NS': 'ns',
    'NB': 'nb',
    'NL': 'nl',
    'PE': 'pe',
  };
  return map[province] || 'on';
}

function inferOutcome(caseData: any): string {
  // Simple heuristic - in production would parse actual decision
  return 'Review case for outcome';
}

async function generatePathways(
  profile: CaseProfile,
  meritResult: any,
  precedents: any[],
  province: string,
  apiKey?: string
): Promise<PathwayResult[]> {
  const pathways: PathwayResult[] = [];

  // Generate pathways based on case category
  if (profile.category === 'landlord-tenant') {
    pathways.push({
      id: 'ltb',
      name: 'Landlord and Tenant Board',
      forum: province === 'ON' ? 'Landlord and Tenant Board (LTB)' : `${province} Residential Tenancy Branch`,
      whyApplies: `Your case involves ${profile.keywords.slice(0, 3).join(', ')} issues which fall under residential tenancy law.`,
      whatToProve: [
        'You are a tenant under a valid tenancy agreement',
        'The landlord failed to meet their obligations',
        'You suffered harm or loss as a result',
        'You have documented the issues and given reasonable notice'
      ],
      risks: [
        'Landlord may counterclaim for rent arrears',
        'Hearing delays of 4-8 months are common',
        'Limited monetary remedies compared to civil court'
      ],
      deadlines: [
        'File within 1 year of issue arising',
        'T2 applications: within 1 year of incident',
        'T6 applications: while still a tenant or within 1 year of leaving'
      ],
      estimatedTimeline: '4-8 months',
      estimatedCost: '$53 filing fee',
      successRate: meritResult.score >= 65 ? 'Favorable based on evidence' : 'Moderate based on current evidence',
      isPrimary: true,
    });

    // Secondary pathway: Small Claims if damages exceed LTB limits
    if (profile.amounts.some(a => parseInt(a.replace(/[$,]/g, '')) > 35000)) {
      pathways.push({
        id: 'small-claims',
        name: 'Small Claims Court',
        forum: 'Small Claims Court',
        whyApplies: 'Your claimed damages may exceed LTB remedies. Small Claims allows claims up to $35,000.',
        whatToProve: [
          'Landlord breached contractual or legal duty',
          'You suffered quantifiable damages',
          'Damages are directly caused by the breach'
        ],
        risks: [
          'More formal process than LTB',
          'May need to wait for LTB decision first',
          'Landlord may hire a lawyer'
        ],
        deadlines: ['2-year limitation period from discovery of harm'],
        estimatedTimeline: '6-12 months',
        estimatedCost: '$102-$273 filing fee',
        successRate: 'Depends on evidence of quantifiable damages',
        isPrimary: false,
      });
    }
  } else if (profile.category === 'human-rights') {
    pathways.push({
      id: 'hrto',
      name: 'Human Rights Tribunal',
      forum: province === 'ON' ? 'Human Rights Tribunal of Ontario (HRTO)' : `${province} Human Rights Tribunal`,
      whyApplies: `Your case involves ${profile.keywords.filter(k => hrKeywords.includes(k)).join(', ')} which are protected grounds under human rights legislation.`,
      whatToProve: [
        'You belong to a protected group',
        'You experienced adverse treatment',
        'The treatment was connected to a protected ground',
        'The respondent is covered by the Human Rights Code'
      ],
      risks: [
        'Must file within 1 year of incident',
        'Respondent may deny discrimination',
        'Process can take 12-18 months'
      ],
      deadlines: ['File within 1 year of the last incident of discrimination'],
      estimatedTimeline: '12-18 months',
      estimatedCost: 'No filing fee',
      successRate: meritResult.score >= 60 ? 'Favorable with documented incidents' : 'Requires stronger evidence',
      isPrimary: true,
    });
  } else if (profile.category === 'employment') {
    pathways.push({
      id: 'employment-standards',
      name: 'Employment Standards Claim',
      forum: province === 'ON' ? 'Ministry of Labour' : `${province} Employment Standards`,
      whyApplies: 'Your employment-related issue may be addressed through employment standards legislation.',
      whatToProve: [
        'Employment relationship existed',
        'Employer violated employment standards',
        'You are owed wages, severance, or other entitlements'
      ],
      risks: [
        'Limited remedies compared to civil action',
        'Cannot claim for wrongful dismissal damages'
      ],
      deadlines: ['File within 2 years of violation'],
      estimatedTimeline: '3-6 months',
      estimatedCost: 'No filing fee',
      successRate: 'High for clear wage violations',
      isPrimary: true,
    });
  } else {
    // Generic civil pathway
    pathways.push({
      id: 'small-claims',
      name: 'Small Claims Court',
      forum: 'Small Claims Court',
      whyApplies: 'Your civil matter may be resolved through Small Claims Court.',
      whatToProve: [
        'The other party owed you a duty or obligation',
        'They breached that duty',
        'You suffered damages as a result'
      ],
      risks: ['Other party may defend or counterclaim'],
      deadlines: ['2-year limitation period applies'],
      estimatedTimeline: '6-12 months',
      estimatedCost: '$102-$273 filing fee',
      successRate: 'Depends on strength of evidence',
      isPrimary: true,
    });
  }

  return pathways;
}

function generateFormSuggestions(
  pathways: PathwayResult[],
  profile: CaseProfile,
  province: string
): FormSuggestion[] {
  const forms: FormSuggestion[] = [];
  const primaryPathway = pathways.find(p => p.isPrimary);

  if (primaryPathway?.id === 'ltb') {
    // Ontario LTB forms
    if (profile.keywords.includes('repairs') || profile.keywords.includes('maintenance') || profile.keywords.includes('pest')) {
      forms.push({
        formCode: 'T6',
        formName: 'Tenant Application about Maintenance',
        tribunal: 'Landlord and Tenant Board',
        purpose: 'Apply for rent reduction and repairs order when landlord fails to maintain the rental unit',
        relevanceScore: 95,
        conditions: ['Active tenancy', 'Written notice to landlord recommended', 'Photos/documentation of issues']
      });
    }
    
    if (profile.keywords.includes('harassment') || profile.keywords.includes('retaliation') || profile.keywords.includes('privacy')) {
      forms.push({
        formCode: 'T2',
        formName: 'Tenant Application about Tenant Rights',
        tribunal: 'Landlord and Tenant Board',
        purpose: 'Apply when landlord harasses, threatens, or interferes with your reasonable enjoyment',
        relevanceScore: 90,
        conditions: ['Document incidents with dates', 'Evidence of landlord actions', 'Written complaints if possible']
      });
    }

    if (profile.keywords.includes('rent') || profile.keywords.includes('illegal')) {
      forms.push({
        formCode: 'T1',
        formName: 'Tenant Application for a Rebate',
        tribunal: 'Landlord and Tenant Board',
        purpose: 'Apply for rebate of illegally collected rent or deposits',
        relevanceScore: 85,
        conditions: ['Proof of payments made', 'Evidence amount exceeds legal limits']
      });
    }
  } else if (primaryPathway?.id === 'hrto') {
    forms.push({
      formCode: 'Form 1',
      formName: 'Application (Form 1)',
      tribunal: 'Human Rights Tribunal of Ontario',
      purpose: 'File a human rights complaint for discrimination',
      relevanceScore: 95,
      conditions: ['File within 1 year of incident', 'Identify protected ground', 'Describe discriminatory treatment']
    });
  } else if (primaryPathway?.id === 'small-claims') {
    forms.push({
      formCode: '7A',
      formName: 'Plaintiff\'s Claim',
      tribunal: 'Small Claims Court',
      purpose: 'Start a civil claim for money owed or damages',
      relevanceScore: 90,
      conditions: ['Claim under $35,000', 'Know defendant\'s address', 'Can describe amount owed']
    });
  }

  // Always suggest affidavit for supporting evidence
  if (forms.length > 0) {
    forms.push({
      formCode: 'Affidavit',
      formName: 'Affidavit of Service / Supporting Affidavit',
      tribunal: 'General',
      purpose: 'Sworn statement to support your application with facts',
      relevanceScore: 70,
      conditions: ['Can be notarized for free at some legal clinics']
    });
  }

  return forms;
}
