import { useMemo } from "react";

export type NextActionType = 
  | 'start_triage'
  | 'upload_evidence'
  | 'view_timeline'
  | 'wait_merit'
  | 'unlock_documents'
  | 'generate_document';

interface CaseData {
  id: string;
  title: string;
  status: string | null;
  merit_score: number | null;
  timeline_viewed?: boolean;
  merit_score_status?: 'pending' | 'calculating' | 'complete' | 'failed';
}

interface EvidenceStats {
  total: number;
  processing: number;
  complete: number;
}

interface NextActionResult {
  action: NextActionType;
  title: string;
  description: string;
  ctaText: string;
  reassurance: string;
  route: string;
  icon: 'triage' | 'upload' | 'timeline' | 'loading' | 'payment' | 'document';
}

interface UseNextActionParams {
  activeCase: CaseData | null;
  evidenceStats: EvidenceStats;
  hasPaidAccess: boolean;
  timelineViewed: boolean;
  meritScoreStatus: 'pending' | 'calculating' | 'complete' | 'failed' | null;
}

/**
 * Deterministic hook that returns exactly ONE next action
 * based on case state, evidence, timeline, merit score, and payment status.
 * 
 * Decision tree:
 * 1. No case -> start_triage
 * 2. No evidence -> upload_evidence
 * 3. Timeline not viewed -> view_timeline
 * 4. Merit score pending/calculating -> wait_merit
 * 5. Payment required -> unlock_documents
 * 6. Ready -> generate_document
 */
export function useNextAction({
  activeCase,
  evidenceStats,
  hasPaidAccess,
  timelineViewed,
  meritScoreStatus,
}: UseNextActionParams): NextActionResult {
  return useMemo(() => {
    // 1. No case exists -> start triage
    if (!activeCase) {
      return {
        action: 'start_triage',
        title: 'Start Your Case',
        description: "Tell us about your legal situation. We will help you understand the right pathway and what to do next.",
        ctaText: 'Start AI Triage',
        reassurance: 'Takes about 2 minutes. No commitment required.',
        route: '/triage',
        icon: 'triage',
      };
    }

    // 2. No evidence uploaded -> upload evidence
    if (evidenceStats.total === 0) {
      return {
        action: 'upload_evidence',
        title: 'Upload Your Evidence',
        description: 'To continue your case, you need to upload the remaining evidence. This helps us assess your situation and unlock the correct legal documents.',
        ctaText: 'Upload Evidence',
        reassurance: 'You can come back and update this later. Nothing is final yet.',
        route: '/evidence',
        icon: 'upload',
      };
    }

    // 3. Evidence exists but still processing
    if (evidenceStats.processing > 0) {
      return {
        action: 'wait_merit',
        title: 'Processing Your Documents',
        description: "We are analyzing your uploaded evidence. This usually takes a few minutes.",
        ctaText: 'View Progress',
        reassurance: 'You will be notified when processing is complete.',
        route: '/evidence',
        icon: 'loading',
      };
    }

    // 4. Timeline not viewed -> view timeline
    if (!timelineViewed) {
      return {
        action: 'view_timeline',
        title: 'Review Your Case Timeline',
        description: 'Review your case timeline to understand what happens next and when. This will prepare you for filing and deadlines.',
        ctaText: 'View Case Timeline',
        reassurance: 'Nothing is filed yet. This is just guidance.',
        route: "/case-timeline?caseId=" + activeCase.id,
        icon: 'timeline',
      };
    }

    // 5. Merit score pending/calculating -> wait
    if (meritScoreStatus === 'pending' || meritScoreStatus === 'calculating') {
      return {
        action: 'wait_merit',
        title: 'Calculating Case Strength',
        description: "We are calculating your case strength based on the evidence you have provided. This helps determine the best approach.",
        ctaText: 'View Analysis',
        reassurance: 'This usually takes 1-2 minutes.',
        route: "/case-strength?caseId=" + activeCase.id,
        icon: 'loading',
      };
    }

    // 6. Payment required -> unlock documents
    if (!hasPaidAccess) {
      return {
        action: 'unlock_documents',
        title: 'Unlock Your Documents',
        description: "To unlock your documents, you will need to complete payment. This gives you full access to download and file your forms.",
        ctaText: 'Unlock Documents',
        reassurance: 'One-time payment. No subscription required.',
        route: '/pricing',
        icon: 'payment',
      };
    }

    // 7. Ready to generate -> generate document
    return {
      action: 'generate_document',
      title: 'Generate Your Legal Document',
      description: "Your case is ready. You can now generate your legal document. We will auto-fill it based on your information.",
      ctaText: 'Generate Document',
      reassurance: 'Your Book of Documents will be court-ready.',
      route: '',
      icon: 'document',
    };
  }, [activeCase, evidenceStats, hasPaidAccess, timelineViewed, meritScoreStatus]);
}
