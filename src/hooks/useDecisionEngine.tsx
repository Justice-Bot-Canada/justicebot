import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { DecisionResult, CaseProfile, EvidenceItem } from '@/types/decisionEngine';

interface UseDecisionEngineOptions {
  onSuccess?: (result: DecisionResult) => void;
  onError?: (error: Error) => void;
}

interface TriageInput {
  storyText: string;
  province: string;
  venueHint?: string;
  issueTags?: string[];
  evidenceDescriptions?: string[];
  userAnswers?: Record<string, boolean | string | number>;
  keyFacts?: {
    firstIncident?: string;
    lastIncident?: string;
    landlordName?: string;
    amountClaimed?: number;
  };
}

export function useDecisionEngine(options: UseDecisionEngineOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);

  const runDecisionEngine = useCallback(async (input: TriageInput, caseId?: string): Promise<DecisionResult | null> => {
    setLoading(true);
    setError(null);

    try {
      // Build CaseProfile from input
      const evidence: EvidenceItem[] = (input.evidenceDescriptions || []).map((desc, i) => ({
        file_id: `pending_${i}`,
        type: inferEvidenceType(desc),
        tags: inferTags(desc),
        file_name: desc,
      }));

      const profile: CaseProfile = {
        case_id: caseId,
        jurisdiction: mapProvinceToCode(input.province),
        venue_hint: mapVenueHint(input.venueHint),
        story_text: input.storyText,
        issue_tags: input.issueTags || inferIssueTags(input.storyText),
        key_facts: {
          dates: {
            first_incident: input.keyFacts?.firstIncident,
            last_incident: input.keyFacts?.lastIncident,
          },
          parties: {
            landlord_name: input.keyFacts?.landlordName,
          },
          money: {
            damages_sought: input.keyFacts?.amountClaimed,
          },
        },
        evidence,
        user_answers: input.userAnswers || {},
      };

      console.log('[DecisionEngine] Calling with profile:', {
        story_length: profile.story_text.length,
        evidence_count: profile.evidence.length,
        issue_tags: profile.issue_tags,
        venue_hint: profile.venue_hint,
      });

      const { data, error: fnError } = await supabase.functions.invoke('decision-engine', {
        body: profile,
      });

      if (fnError) {
        throw new Error(fnError.message || 'Decision engine failed');
      }

      const decisionResult = data as DecisionResult;
      
      console.log('[DecisionEngine] Result:', {
        merit_score: decisionResult.merit.score,
        merit_band: decisionResult.merit.band,
        primary_pathway: decisionResult.pathways.primary.venue,
        forms_count: decisionResult.forms.length,
      });

      setResult(decisionResult);
      options.onSuccess?.(decisionResult);
      
      return decisionResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('[DecisionEngine] Error:', error);
      setError(error);
      options.onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    runDecisionEngine,
    loading,
    error,
    result,
  };
}

// Helper functions
function mapProvinceToCode(province: string): string {
  const map: Record<string, string> = {
    'ontario': 'ON',
    'british columbia': 'BC',
    'alberta': 'AB',
    'quebec': 'QC',
    'manitoba': 'MB',
    'saskatchewan': 'SK',
    'nova scotia': 'NS',
    'new brunswick': 'NB',
    'newfoundland and labrador': 'NL',
    'prince edward island': 'PE',
    'northwest territories': 'NT',
    'nunavut': 'NU',
    'yukon': 'YT',
  };
  return map[province.toLowerCase()] || province.toUpperCase().substring(0, 2);
}

function mapVenueHint(venue?: string): CaseProfile['venue_hint'] {
  if (!venue) return 'UNKNOWN';
  const v = venue.toLowerCase();
  if (v.includes('ltb') || v.includes('landlord') || v.includes('tenant')) return 'LTB';
  if (v.includes('hrto') || v.includes('human rights')) return 'HRTO';
  if (v.includes('family')) return 'FAMILY';
  if (v.includes('small') || v.includes('claims')) return 'SMALL_CLAIMS';
  if (v.includes('labour') || v.includes('employment')) return 'LABOUR';
  return 'UNKNOWN';
}

function inferEvidenceType(desc: string): EvidenceItem['type'] {
  const d = desc.toLowerCase();
  if (d.includes('photo') || d.includes('image') || d.includes('.jpg') || d.includes('.png')) return 'photo';
  if (d.includes('video') || d.includes('.mp4')) return 'video';
  if (d.includes('email') || d.includes('gmail')) return 'email';
  if (d.includes('text') || d.includes('message') || d.includes('sms')) return 'text';
  if (d.includes('notice') || d.includes('n4') || d.includes('n12')) return 'notice';
  if (d.includes('letter')) return 'letter';
  if (d.includes('receipt') || d.includes('invoice')) return 'receipt';
  if (d.includes('medical') || d.includes('doctor')) return 'medical';
  if (d.includes('inspection')) return 'inspection';
  return 'other';
}

function inferTags(desc: string): string[] {
  const tags: string[] = [];
  const d = desc.toLowerCase();
  
  if (d.includes('repair') || d.includes('maintenance')) tags.push('repairs');
  if (d.includes('pest') || d.includes('cockroach') || d.includes('bedbug') || d.includes('mice')) tags.push('pests');
  if (d.includes('mold') || d.includes('mould')) tags.push('mold');
  if (d.includes('notice')) tags.push('notice');
  if (d.includes('threat') || d.includes('harassment')) tags.push('harassment');
  if (d.includes('eviction')) tags.push('eviction');
  
  return tags;
}

function inferIssueTags(storyText: string): string[] {
  const tags: string[] = [];
  const s = storyText.toLowerCase();
  
  // Housing issues
  if (s.includes('repair') || s.includes('fix') || s.includes('broken')) tags.push('maintenance');
  if (s.includes('pest') || s.includes('cockroach') || s.includes('bedbug')) tags.push('pests');
  if (s.includes('mold') || s.includes('mould')) tags.push('mold');
  if (s.includes('heat') || s.includes('hot water')) tags.push('vital_services');
  if (s.includes('harass') || s.includes('threat') || s.includes('intimidat')) tags.push('harassment');
  if (s.includes('evict') || s.includes('n4') || s.includes('n12')) tags.push('eviction');
  if (s.includes('landlord') || s.includes('tenant') || s.includes('rent')) tags.push('housing');
  
  // Human rights
  if (s.includes('discriminat') || s.includes('human rights')) tags.push('discrimination');
  if (s.includes('disability') || s.includes('accommodation')) tags.push('disability');
  
  // Employment
  if (s.includes('fired') || s.includes('terminated') || s.includes('wrongful')) tags.push('wrongful_dismissal');
  if (s.includes('wages') || s.includes('unpaid') || s.includes('overtime')) tags.push('wages');
  
  // Money
  if (s.includes('owe') || s.includes('debt') || s.includes('refund')) tags.push('money_owed');
  
  return tags;
}

export default useDecisionEngine;
