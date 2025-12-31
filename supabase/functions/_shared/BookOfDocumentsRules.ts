// Server-side Book of Documents Rules Engine
// Ultimate Smart Evidence Engine v1

export interface BookConfig {
  province: string;
  provinceName: string;
  tribunal: string;
  indexRequired: boolean;
  pageNumberFormat: 'arabic' | 'roman' | 'both';
  chronologicalOrder: boolean;
  maxPagesPerBook: number;
  exhibitFormat: 'alphabetical' | 'numerical';
  sectionOrder: string[];
  coverPageRequired: boolean;
  certificationRequired: boolean;
  keyFactsPage: boolean;
}

export interface EvidenceMetadata {
  event_date: string | null;
  date_unknown: boolean;
  doc_type: string;
  source_party: string;
  summary: string;
  tags: string[];
  confidence: number;
  page_count: number;
  extracted_text: string;
  quality_flags: QualityFlags;
}

export interface QualityFlags {
  blurry_image: boolean;
  missing_date: boolean;
  low_text_confidence: boolean;
  possible_duplicate: boolean;
  needs_replacement: boolean;
  flag_reasons: string[];
}

export interface ExhibitItem {
  id: string;
  evidence_id: string;
  label: string;
  title: string; // Smart title: "Exhibit C — N4 Notice — 2025-07-10 — Kitchener Housing"
  file_name: string;
  category: string;
  doc_type: string;
  event_date: string | null;
  upload_date: string;
  page_start: number;
  page_end: number;
  page_count: number;
  description: string;
  legal_description: string;
  source_party: string;
  tags: string[];
  group_key: string; // e.g., "2025-01" for January 2025
  cross_references: string[];
  quality_flags: QualityFlags;
  importance: 'critical' | 'important' | 'supporting';
}

export interface BookGenerationResult {
  success: boolean;
  status: 'building' | 'ready' | 'failed';
  error?: string;
  failed_document?: string;
  coverPage: CoverPage;
  keyFactsPage?: KeyFactsPage;
  tableOfContents: TOCEntry[];
  exhibits: ExhibitItem[];
  certificateOfService?: any;
  affidavitTemplate?: any;
  totalPages: number;
  groupedExhibits: Record<string, ExhibitItem[]>;
  duplicatesDetected: DuplicateInfo[];
  conflictsDetected: ConflictInfo[];
  qualityIssues: QualityIssue[];
  complianceSummary: ComplianceSummary;
}

export interface CoverPage {
  title: string;
  subtitle: string;
  tribunal_full_name: string;
  court_file_number: string;
  applicant: string;
  respondent: string;
  hearing_date: string;
  total_exhibits: number;
  total_pages: number;
  prepared_date: string;
  province: string;
}

export interface KeyFactsPage {
  timeline: TimelineEvent[];
  parties: PartyInfo[];
  key_issues: string[];
  claim_summary: string;
  generated_at: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  exhibit_refs: string[];
  importance: 'high' | 'medium' | 'low';
}

export interface PartyInfo {
  name: string;
  role: string;
  description: string;
}

export interface TOCEntry {
  item_number: number;
  label: string;
  title: string;
  category: string;
  date: string;
  page_reference: string;
  group_header?: string;
}

export interface DuplicateInfo {
  evidence_id_1: string;
  evidence_id_2: string;
  file_name_1: string;
  file_name_2: string;
  match_type: 'hash' | 'content_similarity';
  confidence: number;
}

export interface ConflictInfo {
  evidence_id_1: string;
  evidence_id_2: string;
  conflict_type: 'same_date_same_type' | 'contradicting_dates';
  description: string;
}

export interface QualityIssue {
  evidence_id: string;
  file_name: string;
  issue: string;
  severity: 'warning' | 'error';
  suggestion: string;
}

export interface ComplianceSummary {
  is_compliant: boolean;
  issues: string[];
  warnings: string[];
  rules_applied: string[];
}

// Province-specific configuration
export const PROVINCE_CONFIGS: Record<string, BookConfig> = {
  ON: {
    province: 'ON',
    provinceName: 'Ontario',
    tribunal: 'LTB',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    maxPagesPerBook: 150,
    exhibitFormat: 'alphabetical',
    sectionOrder: ['cover', 'key_facts', 'toc', 'exhibits', 'certificate', 'affidavit'],
    coverPageRequired: true,
    certificationRequired: false,
    keyFactsPage: true,
  },
  BC: {
    province: 'BC',
    provinceName: 'British Columbia',
    tribunal: 'RTB',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    maxPagesPerBook: 150,
    exhibitFormat: 'alphabetical',
    sectionOrder: ['cover', 'toc', 'exhibits', 'certificate'],
    coverPageRequired: true,
    certificationRequired: false,
    keyFactsPage: true,
  },
  AB: {
    province: 'AB',
    provinceName: 'Alberta',
    tribunal: 'RTDRS',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    maxPagesPerBook: 150,
    exhibitFormat: 'numerical',
    sectionOrder: ['cover', 'toc', 'exhibits', 'certificate'],
    coverPageRequired: true,
    certificationRequired: false,
    keyFactsPage: true,
  }
};

// Document type classifications
export const DOC_TYPE_LABELS: Record<string, string> = {
  'notice': 'Notice',
  'n4': 'N4 Notice',
  'n5': 'N5 Notice',
  'n12': 'N12 Notice',
  'n13': 'N13 Notice',
  'receipt': 'Receipt',
  'invoice': 'Invoice',
  'email': 'Email Correspondence',
  'text': 'Text Message',
  'letter': 'Letter',
  'contract': 'Agreement/Contract',
  'lease': 'Lease Agreement',
  'photo': 'Photograph',
  'video': 'Video Recording',
  'medical': 'Medical Record',
  'bank': 'Bank Statement',
  'report': 'Report',
  'inspection': 'Inspection Report',
  'work_order': 'Work Order',
  'other': 'Document'
};

// Helper functions

export function getProvinceConfig(province: string): BookConfig {
  return PROVINCE_CONFIGS[province?.toUpperCase()] || PROVINCE_CONFIGS['ON'];
}

export function generateExhibitLabel(index: number, format: 'alphabetical' | 'numerical'): string {
  if (format === 'numerical') {
    return `Exhibit ${index + 1}`;
  }
  // Alphabetical: A, B, C, ... Z, AA, AB, ...
  if (index < 26) {
    return `Exhibit ${String.fromCharCode(65 + index)}`;
  }
  const firstLetter = String.fromCharCode(65 + Math.floor((index - 26) / 26));
  const secondLetter = String.fromCharCode(65 + ((index - 26) % 26));
  return `Exhibit ${firstLetter}${secondLetter}`;
}

export function generateSmartTitle(
  label: string,
  docType: string,
  eventDate: string | null,
  sourceParty: string
): string {
  const docTypeLabel = DOC_TYPE_LABELS[docType?.toLowerCase()] || docType || 'Document';
  const dateStr = eventDate ? new Date(eventDate).toISOString().split('T')[0] : 'Date Unknown';
  const source = sourceParty || '';
  
  return `${label} — ${docTypeLabel} — ${dateStr}${source ? ` — ${source}` : ''}`;
}

export function getGroupKey(date: string | null): string {
  if (!date) return 'undated';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'undated';
  const year = d.getFullYear();
  const month = d.toLocaleString('en-US', { month: 'long' });
  return `${month} ${year}`;
}

export function calculatePageRange(
  startPage: number,
  pageCount: number
): { start: number; end: number; reference: string } {
  const end = startPage + pageCount - 1;
  return {
    start: startPage,
    end,
    reference: startPage === end ? `p. ${startPage}` : `pp. ${startPage}–${end}`
  };
}

export function detectDuplicates(items: Array<{ id: string; file_name: string; content_hash?: string }>): DuplicateInfo[] {
  const duplicates: DuplicateInfo[] = [];
  const hashMap = new Map<string, typeof items[0]>();
  
  for (const item of items) {
    if (item.content_hash) {
      const existing = hashMap.get(item.content_hash);
      if (existing) {
        duplicates.push({
          evidence_id_1: existing.id,
          evidence_id_2: item.id,
          file_name_1: existing.file_name,
          file_name_2: item.file_name,
          match_type: 'hash',
          confidence: 1.0
        });
      } else {
        hashMap.set(item.content_hash, item);
      }
    }
  }
  
  return duplicates;
}

export function detectConflicts(
  items: Array<{ id: string; file_name: string; event_date: string | null; doc_type: string }>
): ConflictInfo[] {
  const conflicts: ConflictInfo[] = [];
  const dateTypeMap = new Map<string, typeof items[0]>();
  
  for (const item of items) {
    if (item.event_date && item.doc_type) {
      const key = `${item.event_date}_${item.doc_type}`;
      const existing = dateTypeMap.get(key);
      if (existing) {
        conflicts.push({
          evidence_id_1: existing.id,
          evidence_id_2: item.id,
          conflict_type: 'same_date_same_type',
          description: `Both "${existing.file_name}" and "${item.file_name}" are ${item.doc_type} documents dated ${item.event_date}`
        });
      } else {
        dateTypeMap.set(key, item);
      }
    }
  }
  
  return conflicts;
}

export function assessQualityFlags(metadata: any, ocrText: string | null): QualityFlags {
  const flags: QualityFlags = {
    blurry_image: false,
    missing_date: false,
    low_text_confidence: false,
    possible_duplicate: false,
    needs_replacement: false,
    flag_reasons: []
  };
  
  // Missing date check
  if (!metadata?.event_date && !metadata?.dates?.incident) {
    flags.missing_date = true;
    flags.flag_reasons.push('No document date detected');
  }
  
  // Low text confidence (OCR quality)
  const confidence = metadata?.confidence_score ?? metadata?.confidence ?? 1.0;
  if (confidence < 0.7) {
    flags.low_text_confidence = true;
    flags.flag_reasons.push(`Low text extraction confidence (${Math.round(confidence * 100)}%)`);
  }
  
  // Very short OCR text for image might indicate blur
  if (ocrText && ocrText.length < 50 && metadata?.file_type?.startsWith('image/')) {
    flags.blurry_image = true;
    flags.flag_reasons.push('Image may be blurry or unreadable');
  }
  
  // If multiple issues, suggest replacement
  if (flags.flag_reasons.length >= 2) {
    flags.needs_replacement = true;
  }
  
  return flags;
}

// Entitlement checks
export interface EntitlementCheck {
  hasAccess: boolean;
  reason: string;
  tier?: string;
}

export function checkBookEntitlement(
  entitlements: Array<{ product_id: string; scope?: string; case_id?: string }>,
  caseId: string
): EntitlementCheck {
  if (!entitlements || entitlements.length === 0) {
    return { hasAccess: false, reason: 'no_entitlement' };
  }
  
  // Check for global subscription (monthly/yearly)
  const globalSub = entitlements.find(e => 
    e.scope === 'global' || 
    e.product_id.toLowerCase().includes('monthly') ||
    e.product_id.toLowerCase().includes('yearly') ||
    e.product_id.toLowerCase().includes('premium')
  );
  
  if (globalSub) {
    return { hasAccess: true, reason: 'subscription', tier: globalSub.product_id };
  }
  
  // Check for case-specific purchase
  const casePurchase = entitlements.find(e => 
    e.case_id === caseId && 
    (e.product_id.toLowerCase().includes('book') || e.product_id.toLowerCase().includes('evidence'))
  );
  
  if (casePurchase) {
    return { hasAccess: true, reason: 'case_purchase', tier: casePurchase.product_id };
  }
  
  return { hasAccess: false, reason: 'insufficient_entitlement' };
}

// Key Facts Extract AI Prompt
export const KEY_FACTS_SYSTEM_PROMPT = `You are a legal evidence analyst for Canadian tribunal proceedings. Your task is to generate a "Key Facts Extract" page that will appear at the front of a Book of Documents.

OUTPUT REQUIREMENTS:
Generate a structured JSON with these exact fields:
{
  "timeline": [
    {
      "date": "YYYY-MM-DD",
      "event": "Brief factual description of what happened",
      "exhibit_refs": ["A", "B"],
      "importance": "high|medium|low"
    }
  ],
  "parties": [
    {
      "name": "Party name",
      "role": "Applicant/Respondent/Witness/etc",
      "description": "Brief relevant description"
    }
  ],
  "key_issues": ["Legal issue 1", "Legal issue 2"],
  "claim_summary": "2-3 sentence summary of the claim being made"
}

GUIDELINES:
1. Timeline events must be factual, not argumentative
2. Use exhibit letters (A, B, C...) when referencing evidence
3. Keep descriptions concise and court-appropriate
4. Identify 3-8 key timeline events maximum
5. List only parties mentioned in the evidence
6. Key issues should be legal categories (e.g., "Maintenance breach", "Rent arrears", "Harassment")
7. Claim summary should be neutral and factual`;

export const KEY_FACTS_USER_PROMPT = (
  caseDescription: string,
  caseType: string,
  exhibits: Array<{ label: string; file_name: string; doc_type: string; event_date: string | null; description: string }>
) => `Generate a Key Facts Extract for this ${caseType} case:

CASE DESCRIPTION:
${caseDescription}

EXHIBITS (${exhibits.length} documents):
${exhibits.map(e => 
  `${e.label}: ${e.file_name} (${e.doc_type}, ${e.event_date || 'date unknown'})
   Description: ${e.description || 'No description'}`
).join('\n\n')}

Generate the Key Facts Extract JSON now.`;
