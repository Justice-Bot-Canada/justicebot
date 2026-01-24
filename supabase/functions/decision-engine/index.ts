import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ==================
// INPUT SCHEMA
// ==================
const CaseProfileSchema = z.object({
  case_id: z.string().optional(),
  user_id: z.string().optional(),
  jurisdiction: z.string().default('ON'),
  postal_code: z.string().optional(),
  venue_hint: z.enum(['LTB', 'HRTO', 'FAMILY', 'SMALL_CLAIMS', 'LABOUR', 'WSIB', 'COURT', 'UNKNOWN']).optional(),
  story_text: z.string().min(10).max(10000),
  issue_tags: z.array(z.string()).default([]),
  key_facts: z.object({
    dates: z.object({
      first_incident: z.string().optional(),
      last_incident: z.string().optional(),
      notice_given_dates: z.array(z.string()).optional(),
    }).optional(),
    parties: z.object({
      landlord_name: z.string().optional(),
      tenant_names: z.array(z.string()).optional(),
      other_party: z.string().optional(),
    }).optional(),
    money: z.object({
      arrears_claimed: z.number().optional(),
      out_of_pocket_costs: z.number().optional(),
      damages_sought: z.number().optional(),
    }).optional(),
  }).default({}),
  evidence: z.array(z.object({
    file_id: z.string().optional(),
    type: z.enum(['photo', 'video', 'email', 'text', 'letter', 'notice', 'receipt', 'medical', 'inspection', 'other']),
    tags: z.array(z.string()).default([]),
    date: z.string().optional(),
    confidence: z.number().optional(),
    file_name: z.string().optional(),
  })).default([]),
  user_answers: z.record(z.union([z.boolean(), z.string(), z.number()])).default({}),
});

type CaseProfile = z.infer<typeof CaseProfileSchema>;

// ==================
// OUTPUT TYPES
// ==================
interface DecisionResult {
  merit: MeritResult;
  pathways: PathwayResult;
  forms: FormRecommendation[];
  next_steps: NextStep[];
}

interface MeritResult {
  score: number;
  band: 'LOW' | 'MEDIUM' | 'HIGH';
  reasons: string[];
  missing: string[];
  confidence: number;
  breakdown: MeritBreakdown;
}

interface MeritBreakdown {
  evidence_strength: number;
  legal_fit: number;
  timeline_quality: number;
  credibility: number;
  risk_flags: number;
}

interface PathwayResult {
  primary: Pathway;
  secondary: Pathway[];
  escalation: Pathway[];
}

interface Pathway {
  venue: string;
  title: string;
  why: string[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  estimated_timeline?: string;
  filing_fee?: string;
}

interface FormRecommendation {
  venue: string;
  form_code: string;
  label: string;
  recommended_level: 'PRIMARY' | 'SUPPORTING' | 'OPTIONAL';
  triggered_by: string[];
  what_it_does: string[];
  what_user_needs: string[];
}

interface NextStep {
  step: number;
  text: string;
  action: 'VIEW' | 'COLLECT' | 'GENERATE' | 'FILE' | 'SERVE' | 'PREPARE';
}

// ==================
// PATHWAY RULES
// ==================
const PATHWAY_RULES = {
  RULE_LTB_T6: {
    venue: 'LTB',
    title: 'Landlord & Tenant Board – Maintenance Issues',
    form: 'T6',
    form_label: 'Tenant Application About Maintenance',
    triggers: {
      issue_tags: ['maintenance', 'repairs', 'mold', 'pests', 'vital_services', 'cockroach', 'bedbug', 'mice', 'heat', 'hot_water', 'plumbing', 'broken', 'leak', 'unsafe'],
      user_answers: ['asked_landlord_to_fix'],
      evidence_tags: ['notice', 'repair_request', 'photos'],
    },
    filing_fee: '$53',
    timeline: '3-6 months',
    what_it_does: [
      'Order landlord to complete repairs',
      'Order rent abatement for period of disrepair',
      'Award compensation for out-of-pocket costs',
    ],
    what_user_needs: [
      'Proof of repair requests (emails, texts, letters)',
      'Photos or videos of the issues',
      'Receipts for any costs incurred',
      'Timeline of events',
    ],
  },
  RULE_LTB_T2: {
    venue: 'LTB',
    title: 'Landlord & Tenant Board – Tenant Rights',
    form: 'T2',
    form_label: 'Tenant Application About Tenant Rights',
    triggers: {
      issue_tags: ['harassment', 'interference', 'illegal_entry', 'reprisal', 'threats', 'intimidation', 'changed_locks', 'cut_utilities', 'retaliation'],
      user_answers: ['threats', 'locked_out', 'service_disruption'],
      evidence_tags: ['harassment', 'threats', 'messages'],
    },
    filing_fee: '$53',
    timeline: '3-6 months',
    what_it_does: [
      'Order landlord to stop the behaviour',
      'Award compensation for interference',
      'Terminate tenancy if landlord behaviour is severe',
    ],
    what_user_needs: [
      'Record of incidents with dates',
      'Screenshots of threatening messages',
      'Witness statements if available',
      'Police reports if applicable',
    ],
  },
  RULE_HRTO: {
    venue: 'HRTO',
    title: 'Human Rights Tribunal of Ontario',
    form: 'Form 1',
    form_label: 'Human Rights Application',
    triggers: {
      issue_tags: ['discrimination', 'disability', 'race', 'sex', 'gender', 'religion', 'age', 'family_status', 'creed', 'ancestry', 'sexual_orientation', 'accommodation'],
      user_answers: ['disability_related', 'discrimination_type'],
      evidence_tags: ['medical', 'accommodation_request'],
    },
    filing_fee: 'Free',
    timeline: '12-18 months',
    what_it_does: [
      'Order respondent to accommodate your needs',
      'Award monetary compensation for injury to dignity',
      'Order policy changes to prevent future discrimination',
    ],
    what_user_needs: [
      'Details of discrimination (who, what, when, where)',
      'Medical documentation if disability-related',
      'Proof you requested accommodation',
      'Evidence of respondent\'s refusal or failure',
    ],
  },
  RULE_SMALL_CLAIMS: {
    venue: 'SMALL_CLAIMS',
    title: 'Small Claims Court',
    form: 'Form 7A',
    form_label: 'Plaintiff\'s Claim',
    triggers: {
      issue_tags: ['money_owed', 'debt', 'unpaid', 'contract_breach', 'damaged_property', 'refund', 'deposit', 'damages'],
      user_answers: ['amount_claimed'],
      evidence_tags: ['receipt', 'contract', 'invoice'],
    },
    filing_fee: '$102-$500',
    timeline: '6-12 months',
    what_it_does: [
      'Order defendant to pay money owed',
      'Award damages for breach of contract',
      'Award costs of the proceeding',
    ],
    what_user_needs: [
      'Contracts or agreements in writing',
      'Invoices or receipts',
      'Correspondence showing the debt',
      'Calculation of damages claimed',
    ],
  },
  RULE_FAMILY: {
    venue: 'FAMILY',
    title: 'Family Court',
    form: 'Form 8',
    form_label: 'Application (General)',
    triggers: {
      issue_tags: ['custody', 'child_support', 'spousal_support', 'divorce', 'separation', 'access', 'parenting'],
      user_answers: [],
      evidence_tags: [],
    },
    filing_fee: 'Varies',
    timeline: '6-24 months',
    what_it_does: [
      'Establish custody and access arrangements',
      'Order child or spousal support',
      'Divide property between spouses',
    ],
    what_user_needs: [
      'Financial disclosure (Form 13 or 13.1)',
      'Children\'s information',
      'Proposed parenting plan',
      'Property and debt documentation',
    ],
  },
};

// ==================
// MERIT CALCULATION
// ==================
function calculateMerit(profile: CaseProfile): MeritResult {
  const breakdown: MeritBreakdown = {
    evidence_strength: 0,
    legal_fit: 0,
    timeline_quality: 0,
    credibility: 0,
    risk_flags: 0,
  };
  const reasons: string[] = [];
  const missing: string[] = [];

  // Start at 30 baseline (forces needing actual evidence/detail to reach HIGH)
  let baseScore = 30;

  // ==================
  // EVIDENCE STRENGTH (0-30)
  // ==================
  const evidenceCount = profile.evidence.length;
  
  // Evidence with REAL metadata (not just file name)
  const evidenceWithRealTags = profile.evidence.filter(e => 
    e.tags && e.tags.length > 0 && !e.tags.every(t => t === 'unknown')
  ).length;
  const evidenceWithDates = profile.evidence.filter(e => e.date).length;
  
  // +8 if evidence count ≥ 5 AND has metadata
  if (evidenceCount >= 5 && evidenceWithRealTags >= 3) {
    breakdown.evidence_strength += 8;
    reasons.push(`Strong evidence base with ${evidenceCount} documents including categorized files`);
  } else if (evidenceCount >= 3) {
    breakdown.evidence_strength += 5;
    reasons.push(`Good evidence documentation (${evidenceCount} files)`);
  } else if (evidenceCount >= 1) {
    breakdown.evidence_strength += 2;
    missing.push('Upload more evidence – 3+ documents significantly strengthens your case');
  } else {
    breakdown.evidence_strength -= 5;
    missing.push('No evidence uploaded – upload photos, messages, or documents to strengthen your case');
  }

  // +5 if evidence includes "official" docs (stricter check)
  const hasOfficialDocs = profile.evidence.some(e =>
    ['notice', 'letter', 'medical', 'inspection'].includes(e.type)
  );
  if (hasOfficialDocs) {
    breakdown.evidence_strength += 5;
    reasons.push('Official documents (notices, letters, or inspections) included');
  } else if (evidenceCount > 0) {
    missing.push('Add official documents like notices or letters from the landlord');
  }

  // +5 if evidence has dates (requires at least 2 dated items)
  if (evidenceWithDates >= 2) {
    breakdown.evidence_strength += 5;
    reasons.push('Evidence has clear date documentation');
  } else if (evidenceCount > 0) {
    missing.push('Add dates to your evidence to establish a clear timeline');
  }

  // +6 if evidence tags strongly match issue tags (requires real overlap)
  const evidenceTags = profile.evidence.flatMap(e => e.tags || []);
  const tagOverlap = profile.issue_tags.filter(tag => 
    evidenceTags.some(et => et.toLowerCase().includes(tag.toLowerCase()))
  );
  if (tagOverlap.length >= 2 && evidenceWithRealTags >= 2) {
    breakdown.evidence_strength += 6;
    reasons.push('Evidence directly supports your claimed issues');
  } else if (profile.issue_tags.length > 0 && evidenceCount > 0) {
    missing.push('Tag your evidence to match your issues (repairs, harassment, etc.)');
  }

  breakdown.evidence_strength = Math.max(-5, Math.min(24, breakdown.evidence_strength));

  // ==================
  // LEGAL FIT (0-25)
  // ==================
  const triggeredRules = evaluateRules(profile);
  
  // +10 if venue_hint is known and consistent with issue_tags
  if (profile.venue_hint && profile.venue_hint !== 'UNKNOWN') {
    const venueMatchesRules = triggeredRules.some(r => r.venue === profile.venue_hint);
    if (venueMatchesRules) {
      breakdown.legal_fit += 10;
      reasons.push(`Your situation clearly fits ${profile.venue_hint} jurisdiction`);
    } else {
      breakdown.legal_fit += 5;
    }
  }

  // +8 if issue_tags map cleanly to at least one form
  if (triggeredRules.length > 0) {
    breakdown.legal_fit += 8;
    reasons.push('Your issues match known legal claim patterns');
  } else {
    missing.push('Clarify the main issues you\'re facing (repairs, harassment, money owed, etc.)');
  }

  // +7 if user_answers include core legal elements
  const coreAnswers = ['asked_landlord_to_fix', 'health_impact', 'disability_related', 'threats'];
  const answeredCore = coreAnswers.filter(k => profile.user_answers[k]);
  if (answeredCore.length >= 2) {
    breakdown.legal_fit += 7;
    reasons.push('You\'ve documented key legal elements');
  } else if (answeredCore.length >= 1) {
    breakdown.legal_fit += 4;
  }

  breakdown.legal_fit = Math.min(25, breakdown.legal_fit);

  // ==================
  // TIMELINE QUALITY (0-15)
  // ==================
  const dates = profile.key_facts?.dates || {};
  
  // +8 if first_incident + last_incident exist
  if (dates.first_incident && dates.last_incident) {
    breakdown.timeline_quality += 8;
    reasons.push('Clear timeline of events documented');
  } else if (dates.first_incident || dates.last_incident) {
    breakdown.timeline_quality += 4;
    missing.push('Add both start and most recent incident dates');
  } else {
    missing.push('Add incident dates to establish when events occurred');
  }

  // +4 if timeline < 2 years
  if (dates.first_incident) {
    const firstDate = new Date(dates.first_incident);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    if (firstDate > twoYearsAgo) {
      breakdown.timeline_quality += 4;
    } else {
      breakdown.risk_flags -= 5;
      missing.push('Events may be approaching or past limitation periods – check filing deadlines');
    }
  }

  // +3 if notice_given_dates exist
  if (dates.notice_given_dates && dates.notice_given_dates.length > 0) {
    breakdown.timeline_quality += 3;
    reasons.push('Notice dates documented');
  }

  breakdown.timeline_quality = Math.min(15, breakdown.timeline_quality);

  // ==================
  // CREDIBILITY / CONSISTENCY (0-20) - stricter scoring
  // ==================
  const storyLength = profile.story_text.length;
  
  // Story length scoring (stricter thresholds)
  if (storyLength > 1200) {
    breakdown.credibility += 10;
    reasons.push('Comprehensive description of your situation provided');
  } else if (storyLength > 800) {
    breakdown.credibility += 7;
    reasons.push('Detailed description provided');
  } else if (storyLength > 500) {
    breakdown.credibility += 4;
  } else if (storyLength > 300) {
    breakdown.credibility += 2;
    missing.push('Provide more detail – longer descriptions help establish your case');
  } else {
    breakdown.credibility -= 5;
    missing.push('Your description is too brief – add specifics about what happened and when');
  }

  // +5 if evidence types are diverse (at least 3 different types)
  const uniqueTypes = new Set(profile.evidence.map(e => e.type));
  if (uniqueTypes.size >= 3) {
    breakdown.credibility += 5;
    reasons.push('Multiple types of evidence (photos, messages, documents) provided');
  } else if (uniqueTypes.size >= 2) {
    breakdown.credibility += 2;
  }

  // +4 if story references specific events AND has evidence
  if (profile.evidence.length >= 2 && storyLength > 400) {
    breakdown.credibility += 4;
  }

  breakdown.credibility = Math.max(-5, Math.min(19, breakdown.credibility));

  // ==================
  // RISK FLAGS (-15 to 0) - catches weak cases
  // ==================
  // -6 if user is asking for relief that doesn't match venue
  const money = profile.key_facts?.money || {};
  if (money.damages_sought && money.damages_sought > 35000 && !triggeredRules.some(r => r.venue === 'COURT')) {
    breakdown.risk_flags -= 6;
    missing.push('For claims over $35,000, consider Superior Court instead of Small Claims');
  }

  // -5 if no evidence AND short story (really weak case)
  if (evidenceCount === 0 && storyLength < 300) {
    breakdown.risk_flags -= 5;
  }

  // -4 if no timeline info at all
  if (!dates.first_incident && !dates.last_incident) {
    breakdown.risk_flags -= 4;
  }

  breakdown.risk_flags = Math.max(-15, Math.min(0, breakdown.risk_flags));

  breakdown.risk_flags = Math.max(-20, Math.min(0, breakdown.risk_flags));

  // ==================
  // TOTAL SCORE
  // ==================
  const adjustments = 
    breakdown.evidence_strength +
    breakdown.legal_fit +
    breakdown.timeline_quality +
    breakdown.credibility +
    breakdown.risk_flags;

  const finalScore = Math.max(0, Math.min(100, baseScore + adjustments));

  // Determine band with HIGH gate (prevents premature "Strong" labels)
  let band: 'LOW' | 'MEDIUM' | 'HIGH';
  
  // HIGH gate: require at least 2 of 3 conditions
  const hasLongStory = storyLength >= 800;
  const hasGoodEvidence = evidenceCount >= 4;
  const hasDates = (dates.first_incident && dates.last_incident) || evidenceWithDates >= 2;
  const highGateScore = (hasLongStory ? 1 : 0) + (hasGoodEvidence ? 1 : 0) + (hasDates ? 1 : 0);
  const passesHighGate = highGateScore >= 2;
  
  if (finalScore >= 70 && passesHighGate) {
    band = 'HIGH';
  } else if (finalScore >= 70 && !passesHighGate) {
    // Score qualifies but gate fails - cap at MEDIUM and explain
    band = 'MEDIUM';
    if (!hasLongStory) missing.push('Provide a more detailed description (800+ characters) for a Strong rating');
    if (!hasGoodEvidence) missing.push('Upload at least 4 pieces of evidence for a Strong rating');
    if (!hasDates) missing.push('Add incident dates for a Strong rating');
  } else if (finalScore >= 40) {
    band = 'MEDIUM';
  } else {
    band = 'LOW';
  }

  // Calculate confidence
  let confidence = 0.2;
  if (dates.first_incident) confidence += 0.1;
  if (evidenceCount >= 3) confidence += 0.2;
  if (profile.venue_hint && profile.venue_hint !== 'UNKNOWN') confidence += 0.15;
  if (profile.issue_tags.length > 0) confidence += 0.15;
  if (triggeredRules.length > 0) confidence += 0.2;
  confidence = Math.min(0.9, confidence);

  return {
    score: Math.round(finalScore),
    band,
    reasons,
    missing,
    confidence: Math.round(confidence * 100) / 100,
    breakdown,
  };
}

// ==================
// RULE EVALUATION
// ==================
interface TriggeredRule {
  rule_id: string;
  venue: string;
  score: number;
  form: string;
  label: string;
  rule: typeof PATHWAY_RULES[keyof typeof PATHWAY_RULES];
}

function evaluateRules(profile: CaseProfile): TriggeredRule[] {
  const triggered: TriggeredRule[] = [];
  const storyLower = profile.story_text.toLowerCase();
  const evidenceTags = profile.evidence.flatMap(e => e.tags.map(t => t.toLowerCase()));

  for (const [ruleId, rule] of Object.entries(PATHWAY_RULES)) {
    let score = 0;

    // Check issue_tags matches
    const tagMatches = rule.triggers.issue_tags.filter(tag =>
      profile.issue_tags.some(pt => pt.toLowerCase().includes(tag.toLowerCase())) ||
      storyLower.includes(tag.toLowerCase())
    );
    score += tagMatches.length * 2;

    // Check user_answers
    const answerMatches = rule.triggers.user_answers.filter(key =>
      profile.user_answers[key] === true
    );
    score += answerMatches.length * 3;

    // Check evidence_tags
    const evidenceMatches = rule.triggers.evidence_tags.filter(tag =>
      evidenceTags.some(et => et.includes(tag.toLowerCase()))
    );
    score += evidenceMatches.length * 2;

    // Trigger if score > 3 (meaningful match)
    if (score > 3) {
      triggered.push({
        rule_id: ruleId,
        venue: rule.venue,
        score,
        form: rule.form,
        label: rule.form_label,
        rule,
      });
    }
  }

  // Sort by score descending
  return triggered.sort((a, b) => b.score - a.score);
}

// ==================
// PATHWAY GENERATION
// ==================
function generatePathways(profile: CaseProfile, triggeredRules: TriggeredRule[]): PathwayResult {
  // Default fallback if no rules triggered
  const defaultPathway: Pathway = {
    venue: 'UNKNOWN',
    title: 'Legal Pathway Analysis',
    why: ['Based on your description, we need more information to recommend a specific legal venue.'],
    risk_level: 'MEDIUM',
  };

  if (triggeredRules.length === 0) {
    return {
      primary: defaultPathway,
      secondary: [],
      escalation: [],
    };
  }

  // Primary pathway is highest scored rule
  const primary = triggeredRules[0];
  const primaryPathway: Pathway = {
    venue: primary.venue,
    title: primary.rule.title,
    why: [
      `Your situation involves ${primary.rule.triggers.issue_tags.slice(0, 3).join(', ')}`,
      `This tribunal specifically handles these types of disputes`,
      primary.rule.filing_fee === 'Free' 
        ? 'No filing fee required' 
        : `Filing fee is ${primary.rule.filing_fee}`,
    ],
    risk_level: 'LOW',
    estimated_timeline: primary.rule.timeline,
    filing_fee: primary.rule.filing_fee,
  };

  // Secondary pathways are other triggered rules
  const secondary = triggeredRules.slice(1, 3).map(r => ({
    venue: r.venue,
    title: r.rule.title,
    why: [`Also addresses ${r.rule.triggers.issue_tags.slice(0, 2).join(', ')}`],
    risk_level: 'MEDIUM' as const,
    estimated_timeline: r.rule.timeline,
    filing_fee: r.rule.filing_fee,
  }));

  // Escalation options
  const escalation: Pathway[] = [];
  
  // If HRTO triggered as secondary, flag as escalation option
  if (triggeredRules.some(r => r.venue === 'HRTO' && r.rule_id !== primary.rule_id)) {
    const hrtoRule = triggeredRules.find(r => r.venue === 'HRTO');
    if (hrtoRule) {
      escalation.push({
        venue: 'HRTO',
        title: 'Human Rights Tribunal (Escalation)',
        why: ['Disability or discrimination elements may qualify for human rights complaint', 'Can run parallel to other proceedings'],
        risk_level: 'MEDIUM',
        estimated_timeline: '12-18 months',
        filing_fee: 'Free',
      });
    }
  }

  return { primary: primaryPathway, secondary, escalation };
}

// ==================
// FORM RECOMMENDATIONS
// ==================
function generateFormRecommendations(triggeredRules: TriggeredRule[]): FormRecommendation[] {
  const forms: FormRecommendation[] = [];

  for (let i = 0; i < triggeredRules.length; i++) {
    const rule = triggeredRules[i];
    forms.push({
      venue: rule.venue,
      form_code: rule.form,
      label: rule.label,
      recommended_level: i === 0 ? 'PRIMARY' : i === 1 ? 'SUPPORTING' : 'OPTIONAL',
      triggered_by: [rule.rule_id],
      what_it_does: rule.rule.what_it_does,
      what_user_needs: rule.rule.what_user_needs,
    });
  }

  return forms;
}

// ==================
// NEXT STEPS
// ==================
function generateNextSteps(merit: MeritResult, forms: FormRecommendation[]): NextStep[] {
  const steps: NextStep[] = [];
  let stepNum = 1;

  // Always start with confirming facts
  steps.push({
    step: stepNum++,
    text: 'Confirm key facts (dates, names, addresses)',
    action: 'VIEW',
  });

  // If missing items, prompt to collect
  if (merit.missing.length > 0) {
    steps.push({
      step: stepNum++,
      text: `Upload missing evidence (${merit.missing.length} items recommended)`,
      action: 'COLLECT',
    });
  }

  // Generate documents
  if (forms.length > 0) {
    const primaryForm = forms[0];
    steps.push({
      step: stepNum++,
      text: `Generate ${primaryForm.form_code} Application`,
      action: 'GENERATE',
    });

    // Supporting forms
    const supporting = forms.filter(f => f.recommended_level === 'SUPPORTING');
    if (supporting.length > 0) {
      steps.push({
        step: stepNum++,
        text: `Generate supporting form (${supporting[0].form_code})`,
        action: 'GENERATE',
      });
    }
  }

  // Filing instructions
  steps.push({
    step: stepNum++,
    text: 'Review filing instructions for your tribunal',
    action: 'FILE',
  });

  // Service instructions
  steps.push({
    step: stepNum++,
    text: 'Serve documents on the opposing party',
    action: 'SERVE',
  });

  // Hearing prep
  steps.push({
    step: stepNum++,
    text: 'Prepare for your hearing',
    action: 'PREPARE',
  });

  return steps;
}

// ==================
// MAIN HANDLER
// ==================
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = CaseProfileSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input',
          details: validationResult.error.errors.map(e => e.message).join(', ')
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const profile = validationResult.data;
    console.log(`Decision engine processing: ${profile.story_text.length} chars, ${profile.evidence.length} evidence items`);

    // Run deterministic merit calculation
    const merit = calculateMerit(profile);
    console.log(`Merit calculated: ${merit.score} (${merit.band})`);

    // Evaluate pathway rules
    const triggeredRules = evaluateRules(profile);
    console.log(`Triggered ${triggeredRules.length} pathway rules`);

    // Generate pathways
    const pathways = generatePathways(profile, triggeredRules);

    // Generate form recommendations
    const forms = generateFormRecommendations(triggeredRules);

    // Generate next steps
    const next_steps = generateNextSteps(merit, forms);

    const result: DecisionResult = {
      merit,
      pathways,
      forms,
      next_steps,
    };

    // If case_id provided, persist the result with error checking
    if (profile.case_id) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Update cases table with REAL error checking + merit_status
      const { data: updateData, error: updateError } = await supabase
        .from('cases')
        .update({
          merit_score: merit.score,
          merit_status: 'complete',
          merit_error: null,
          merit_updated_at: new Date().toISOString(),
          decision_result_json: result as unknown as Record<string, unknown>,
          status: 'scored', // Valid status per cases_status_check constraint
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.case_id)
        .select('id')
        .single();

      if (updateError) {
        console.error(`Failed to persist to cases table: ${updateError.message}`);
        // Mark as error status
        await supabase
          .from('cases')
          .update({
            merit_status: 'error',
            merit_error: updateError.message,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.case_id);
      } else if (!updateData) {
        console.error(`No case row found with id ${profile.case_id} - update matched 0 rows`);
      } else {
        console.log(`Successfully persisted decision to case ${profile.case_id}`);
      }

      // Store full decision result in case_merit
      const { error: meritError } = await supabase
        .from('case_merit')
        .upsert({
          case_id: profile.case_id,
          score_total: merit.score,
          components: merit.breakdown,
          reasons: merit.reasons,
          strengths: merit.reasons.slice(0, 3),
          weaknesses: merit.missing.slice(0, 3),
          gaps: merit.missing,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'case_id' });

      if (meritError) {
        console.error(`Failed to persist to case_merit: ${meritError.message}`);
      }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Decision engine error:', error);
    
    // Return fallback response instead of error
    const fallbackResult: DecisionResult = {
      merit: {
        score: 50,
        band: 'MEDIUM',
        reasons: ['Analysis temporarily unavailable'],
        missing: ['Complete the triage questionnaire for a full assessment'],
        confidence: 0.3,
        breakdown: {
          evidence_strength: 10,
          legal_fit: 10,
          timeline_quality: 10,
          credibility: 10,
          risk_flags: 0,
        },
      },
      pathways: {
        primary: {
          venue: 'UNKNOWN',
          title: 'Pathway analysis pending',
          why: ['Please complete the questionnaire to receive pathway recommendations'],
          risk_level: 'MEDIUM',
        },
        secondary: [],
        escalation: [],
      },
      forms: [],
      next_steps: [
        { step: 1, text: 'Complete the intake questionnaire', action: 'VIEW' },
        { step: 2, text: 'Upload supporting evidence', action: 'COLLECT' },
      ],
    };

    return new Response(
      JSON.stringify(fallbackResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
