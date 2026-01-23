/**
 * Decision Engine Types
 * 
 * These types define the contract for the case assessment system.
 * The engine receives a CaseProfile and produces a DecisionResult.
 */

// ==================
// INPUT: CaseProfile
// ==================
export interface CaseProfile {
  case_id?: string;
  user_id?: string;
  jurisdiction: string; // Province code: ON, BC, AB, etc.
  postal_code?: string;
  venue_hint?: 'LTB' | 'HRTO' | 'FAMILY' | 'SMALL_CLAIMS' | 'LABOUR' | 'WSIB' | 'COURT' | 'UNKNOWN';
  story_text: string;
  issue_tags: string[];
  key_facts: {
    dates: {
      first_incident?: string; // YYYY-MM-DD
      last_incident?: string;
      notice_given_dates?: string[];
    };
    parties: {
      landlord_name?: string;
      tenant_names?: string[];
      other_party?: string;
    };
    money: {
      arrears_claimed?: number;
      out_of_pocket_costs?: number;
      damages_sought?: number;
    };
  };
  evidence: EvidenceItem[];
  user_answers: UserAnswers;
}

export interface EvidenceItem {
  file_id?: string;
  type: 'photo' | 'video' | 'email' | 'text' | 'letter' | 'notice' | 'receipt' | 'medical' | 'inspection' | 'other';
  tags: string[];
  date?: string;
  confidence?: number;
  file_name?: string;
}

export interface UserAnswers {
  asked_landlord_to_fix?: boolean;
  landlord_ignored?: boolean;
  health_impact?: boolean;
  disability_related?: boolean;
  service_disruption?: boolean;
  locked_out?: boolean;
  threats?: boolean;
  discrimination_type?: string;
  amount_claimed?: number;
  [key: string]: boolean | string | number | undefined;
}

// ==================
// OUTPUT: DecisionResult
// ==================
export interface DecisionResult {
  merit: MeritResult;
  pathways: PathwayResult;
  forms: FormRecommendation[];
  next_steps: NextStep[];
}

export interface MeritResult {
  score: number; // 0-100
  band: 'LOW' | 'MEDIUM' | 'HIGH';
  reasons: string[];
  missing: string[];
  confidence: number; // 0.0-1.0
  breakdown: MeritBreakdown;
}

export interface MeritBreakdown {
  evidence_strength: number;    // 0-30
  legal_fit: number;            // 0-25
  timeline_quality: number;     // 0-15
  credibility: number;          // 0-20
  risk_flags: number;           // -20 to 0
}

export interface PathwayResult {
  primary: Pathway;
  secondary: Pathway[];
  escalation: Pathway[];
}

export interface Pathway {
  venue: string;
  title: string;
  why: string[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  estimated_timeline?: string;
  filing_fee?: string;
}

export interface FormRecommendation {
  venue: string;
  form_code: string;
  label: string;
  recommended_level: 'PRIMARY' | 'SUPPORTING' | 'OPTIONAL';
  triggered_by: string[];
  what_it_does: string[];
  what_user_needs: string[];
}

export interface NextStep {
  step: number;
  text: string;
  action: 'VIEW' | 'COLLECT' | 'GENERATE' | 'FILE' | 'SERVE' | 'PREPARE';
  completed?: boolean;
}

// ==================
// RULE ENGINE TYPES
// ==================
export interface PathwayRule {
  rule_id: string;
  venue: string;
  triggers: RuleTrigger[];
  forms: string[];
  priority: number;
}

export interface RuleTrigger {
  type: 'issue_tag' | 'user_answer' | 'evidence_type' | 'keyword';
  value: string;
  operator?: 'includes' | 'equals' | 'contains';
}

// ==================
// UI DISPLAY HELPERS
// ==================
export function getMeritBandLabel(band: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (band) {
    case 'HIGH': return 'Strong Case';
    case 'MEDIUM': return 'Viable Case';
    case 'LOW': return 'Weak Case';
    default: return 'Unknown';
  }
}

export function getMeritBandColor(band: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (band) {
    case 'HIGH': return 'text-green-600 bg-green-50 border-green-200';
    case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'LOW': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-muted-foreground bg-muted border-muted';
  }
}

export function getMeritScoreDescription(score: number, band: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  if (band === 'HIGH') {
    return 'Based on your evidence and situation, your claims appear legally viable and well-supported. Similar cases have proceeded successfully when filed correctly.';
  } else if (band === 'MEDIUM') {
    return 'Your case shows merit but has some gaps. Strengthening your evidence or clarifying key details would improve your position.';
  }
  return 'Your case as currently presented has weaknesses. This doesn\'t mean you can\'t proceed, but understanding the gaps is the first step to addressing them.';
}
