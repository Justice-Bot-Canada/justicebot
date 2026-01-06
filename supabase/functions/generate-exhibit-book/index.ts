import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// ULTIMATE SMART BOOK OF DOCUMENTS ENGINE v1
// Court-grade evidence book generator with AI analysis
// ============================================================================

interface ExhibitOverride {
  evidence_id: string;
  description?: string;
  relevance?: string;
  incident_date?: string;
  order?: number;
}

interface ExhibitBookRequest {
  caseId: string;
  includeTableOfContents?: boolean;
  numberingStyle?: 'alphabetical' | 'numerical';
  caseDescription?: string;
  exhibitOverrides?: ExhibitOverride[];
  organizationAnswers?: {
    sortBy: 'chronological' | 'category' | 'importance';
    includeWitnessList: boolean;
    includeAffidavit: boolean;
    includeCertificateOfService: boolean;
    opposingPartyName?: string;
    courtFileNumber?: string;
    hearingDate?: string;
    serviceMethod?: 'email' | 'mail' | 'personal' | 'courier';
    serviceDate?: string;
  };
}

interface QualityFlags {
  blurry_image: boolean;
  missing_date: boolean;
  low_text_confidence: boolean;
  possible_duplicate: boolean;
  needs_replacement: boolean;
  flag_reasons: string[];
}

// Province configurations
const PROVINCE_CONFIGS: Record<string, {
  name: string;
  tribunals: string[];
  maxPagesPerBook: number;
  evidenceRules: {
    deadlineDays: number;
    maxFileSizeMB: number;
    acceptedFormats: string[];
    requiresTableOfContents: boolean;
    requiresPageNumbers: boolean;
    requiresCertificateOfService: boolean;
  };
}> = {
  ON: {
    name: 'Ontario',
    tribunals: ['LTB', 'HRTO', 'WSIB', 'OLT'],
    maxPagesPerBook: 150,
    evidenceRules: {
      deadlineDays: 7,
      maxFileSizeMB: 35,
      acceptedFormats: ['PDF', 'DOC', 'DOCX', 'JPG', 'MP3', 'MP4', 'MOV'],
      requiresTableOfContents: true,
      requiresPageNumbers: true,
      requiresCertificateOfService: true
    }
  },
  BC: {
    name: 'British Columbia',
    tribunals: ['RTB', 'BCHRT', 'CRT'],
    maxPagesPerBook: 150,
    evidenceRules: {
      deadlineDays: 14,
      maxFileSizeMB: 25,
      acceptedFormats: ['PDF', 'DOC', 'DOCX', 'JPG'],
      requiresTableOfContents: true,
      requiresPageNumbers: true,
      requiresCertificateOfService: true
    }
  },
  AB: {
    name: 'Alberta',
    tribunals: ['RTDRS', 'AHRC'],
    maxPagesPerBook: 150,
    evidenceRules: {
      deadlineDays: 10,
      maxFileSizeMB: 30,
      acceptedFormats: ['PDF', 'DOC', 'DOCX', 'JPG'],
      requiresTableOfContents: true,
      requiresPageNumbers: true,
      requiresCertificateOfService: true
    }
  }
};

const DOC_TYPE_LABELS: Record<string, string> = {
  'notice': 'Notice', 'n4': 'N4 Notice', 'n5': 'N5 Notice', 'n12': 'N12 Notice',
  'receipt': 'Receipt', 'invoice': 'Invoice', 'email': 'Email',
  'letter': 'Letter', 'contract': 'Agreement', 'lease': 'Lease',
  'photo': 'Photograph', 'video': 'Video', 'medical': 'Medical Record',
  'bank': 'Bank Statement', 'report': 'Report', 'inspection': 'Inspection Report'
};

// Helper functions
function generateExhibitLabel(index: number, format: 'alphabetical' | 'numerical'): string {
  if (format === 'numerical') return (index + 1).toString();
  if (index < 26) return String.fromCharCode(65 + index);
  const first = String.fromCharCode(65 + Math.floor((index - 26) / 26));
  const second = String.fromCharCode(65 + ((index - 26) % 26));
  return `${first}${second}`;
}

function generateSmartTitle(label: string, docType: string, eventDate: string | null, sourceParty: string): string {
  const docTypeLabel = DOC_TYPE_LABELS[docType?.toLowerCase()] || docType || 'Document';
  const dateStr = eventDate ? new Date(eventDate).toISOString().split('T')[0] : 'Date Unknown';
  return `${label} — ${docTypeLabel} — ${dateStr}${sourceParty ? ` — ${sourceParty}` : ''}`;
}

function getGroupKey(date: string | null): string {
  if (!date) return 'Undated Documents';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Undated Documents';
  return `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`;
}

function assessQualityFlags(metadata: any, ocrText: string | null, fileType: string): QualityFlags {
  const flags: QualityFlags = {
    blurry_image: false,
    missing_date: false,
    low_text_confidence: false,
    possible_duplicate: false,
    needs_replacement: false,
    flag_reasons: []
  };
  
  if (!metadata?.event_date && !metadata?.dates?.incident) {
    flags.missing_date = true;
    flags.flag_reasons.push('No document date detected');
  }
  
  const confidence = metadata?.confidence_score ?? metadata?.confidence ?? 1.0;
  if (confidence < 0.7) {
    flags.low_text_confidence = true;
    flags.flag_reasons.push(`Low text extraction confidence (${Math.round(confidence * 100)}%)`);
  }
  
  if (ocrText && ocrText.length < 50 && fileType?.startsWith('image/')) {
    flags.blurry_image = true;
    flags.flag_reasons.push('Image may be blurry or unreadable');
  }
  
  if (flags.flag_reasons.length >= 2) {
    flags.needs_replacement = true;
  }
  
  return flags;
}

function detectDuplicates(items: any[]): Array<{ file1: string; file2: string; reason: string }> {
  const duplicates: Array<{ file1: string; file2: string; reason: string }> = [];
  const seen = new Map<string, any>();
  
  for (const item of items) {
    // Check by normalized filename
    const normalizedName = item.file_name?.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedName && seen.has(normalizedName)) {
      const existing = seen.get(normalizedName);
      duplicates.push({
        file1: existing.file_name,
        file2: item.file_name,
        reason: 'Similar filename detected'
      });
    } else if (normalizedName) {
      seen.set(normalizedName, item);
    }
  }
  
  return duplicates;
}

function detectConflicts(items: any[]): Array<{ file1: string; file2: string; conflict: string }> {
  const conflicts: Array<{ file1: string; file2: string; conflict: string }> = [];
  const dateTypeMap = new Map<string, any>();
  
  for (const item of items) {
    const eventDate = item.event_date || item.evidence_metadata?.[0]?.dates?.incident;
    const docType = item.evidence_metadata?.[0]?.doc_type;
    
    if (eventDate && docType) {
      const key = `${eventDate}_${docType}`;
      const existing = dateTypeMap.get(key);
      if (existing) {
        conflicts.push({
          file1: existing.file_name,
          file2: item.file_name,
          conflict: `Both documents are ${docType} dated ${eventDate}`
        });
      } else {
        dateTypeMap.set(key, item);
      }
    }
  }
  
  return conflicts;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Track status for response
  let buildStatus: 'building' | 'ready' | 'failed' = 'building';
  const failedDocument: string | null = null;

  try {
    console.log('[GENERATE-BOOK] Starting book generation...');
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        success: false, 
        status: 'failed', 
        error: 'Authentication required' 
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ 
        success: false, 
        status: 'failed', 
        error: 'Invalid authentication' 
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    console.log('[GENERATE-BOOK] User authenticated:', userId);

    const { 
      caseId, 
      includeTableOfContents = true, 
      numberingStyle = 'alphabetical',
      caseDescription,
      exhibitOverrides,
      organizationAnswers 
    }: ExhibitBookRequest = await req.json();

    if (!caseId) {
      return new Response(JSON.stringify({ 
        success: false, 
        status: 'failed', 
        error: 'Case ID is required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ========================================================================
    // SERVER-ENFORCED ENTITLEMENT CHECK
    // ========================================================================
    console.log('[GENERATE-BOOK] Checking entitlements for case:', caseId);
    
    const { data: entitlements } = await supabase
      .from('entitlements')
      .select('product_id, scope, case_id')
      .eq('user_id', userId);

    // Check for valid entitlement
    const hasGlobalSub = entitlements?.some(e => 
      e.scope === 'global' ||
      e.product_id?.toLowerCase().includes('monthly') ||
      e.product_id?.toLowerCase().includes('yearly') ||
      e.product_id?.toLowerCase().includes('premium')
    );
    
    const hasCasePurchase = entitlements?.some(e => 
      e.case_id === caseId && 
      (e.product_id?.toLowerCase().includes('book') || e.product_id?.toLowerCase().includes('evidence'))
    );

    // Check admin status
    const { data: adminData } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .is('revoked_at', null)
      .maybeSingle();
    
    const isAdmin = !!adminData;

    if (!hasGlobalSub && !hasCasePurchase && !isAdmin) {
      console.log('[GENERATE-BOOK] Entitlement check failed - no valid subscription');
      return new Response(JSON.stringify({ 
        success: false, 
        status: 'failed', 
        error: 'Premium subscription required',
        requiresPayment: true,
        message: 'Book of Documents generation requires a premium subscription.'
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('[GENERATE-BOOK] Entitlement verified');

    // Get case data
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id, user_id, title, description, venue, province')
      .eq('id', caseId)
      .eq('user_id', userId)
      .single();

    if (caseError || !caseData) {
      return new Response(JSON.stringify({ 
        success: false, 
        status: 'failed', 
        error: 'Case not found or access denied' 
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const province = caseData.province?.toUpperCase() || 'ON';
    const provinceConfig = PROVINCE_CONFIGS[province] || PROVINCE_CONFIGS['ON'];

    // Get user profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('first_name, last_name, display_name, phone, email')
      .eq('user_id', userId)
      .single();

    // Fetch evidence with metadata
    const { data: evidenceData, error: evidenceError } = await supabase
      .from('evidence')
      .select(`
        *,
        evidence_metadata (
          doc_type,
          category,
          dates,
          extracted_text,
          parties,
          confidence_score
        )
      `)
      .eq('case_id', caseId);

    if (evidenceError) throw evidenceError;

    if (!evidenceData || evidenceData.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        status: 'failed', 
        error: 'No evidence found for this case. Upload documents first.' 
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[GENERATE-BOOK] Processing ${evidenceData.length} evidence items`);

    // ========================================================================
    // DETECT DUPLICATES & CONFLICTS
    // ========================================================================
    const duplicates = detectDuplicates(evidenceData);
    const conflicts = detectConflicts(evidenceData);
    
    if (duplicates.length > 0) {
      console.log('[GENERATE-BOOK] Duplicates detected:', duplicates.length);
    }
    if (conflicts.length > 0) {
      console.log('[GENERATE-BOOK] Conflicts detected:', conflicts.length);
    }

    // Apply exhibit overrides
    let processedEvidence = evidenceData.map((item: any) => {
      const override = exhibitOverrides?.find(o => o.evidence_id === item.id);
      const metadata = item.evidence_metadata?.[0] || {};
      
      // Assess quality flags
      const qualityFlags = assessQualityFlags(metadata, item.ocr_text, item.file_type);
      
      return {
        ...item,
        description: override?.description || item.description,
        user_relevance: override?.relevance,
        event_date: override?.incident_date || metadata.dates?.incident || metadata.dates?.captured || null,
        order_override: override?.order,
        source_party: metadata.parties?.source || metadata.parties?.from || '',
        quality_flags: qualityFlags
      };
    });

    // Filter out ignored duplicates by default (keep first occurrence)
    const seenHashes = new Set<string>();
    processedEvidence = processedEvidence.filter((item: any) => {
      const normalizedName = item.file_name?.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seenHashes.has(normalizedName)) {
        console.log(`[GENERATE-BOOK] Skipping duplicate: ${item.file_name}`);
        return false;
      }
      seenHashes.add(normalizedName);
      return true;
    });

    // ========================================================================
    // SORT CHRONOLOGICALLY (oldest first - Ontario requirement)
    // ========================================================================
    const sortBy = organizationAnswers?.sortBy || 'chronological';
    const sortedEvidence = [...processedEvidence];

    sortedEvidence.sort((a, b) => {
      if (a.order_override !== undefined && b.order_override !== undefined) {
        return a.order_override - b.order_override;
      }
      
      const getDate = (item: any): Date => {
        if (item.event_date) return new Date(item.event_date);
        return new Date(item.upload_date);
      };
      
      if (sortBy === 'chronological') {
        return getDate(a).getTime() - getDate(b).getTime();
      } else if (sortBy === 'category') {
        const catA = a.evidence_metadata?.[0]?.category || 'zzz';
        const catB = b.evidence_metadata?.[0]?.category || 'zzz';
        if (catA !== catB) return catA.localeCompare(catB);
        return getDate(a).getTime() - getDate(b).getTime();
      }
      return getDate(a).getTime() - getDate(b).getTime();
    });

    // ========================================================================
    // CHECK PAGE LIMIT
    // ========================================================================
    let totalEstimatedPages = 0;
    for (const item of sortedEvidence) {
      totalEstimatedPages += item.page_count || 1;
    }
    
    // Add cover, key facts, TOC pages
    totalEstimatedPages += 1 + 2 + Math.ceil(sortedEvidence.length / 15);
    
    if (totalEstimatedPages > provinceConfig.maxPagesPerBook) {
      return new Response(JSON.stringify({ 
        success: false, 
        status: 'failed', 
        error: `Book exceeds ${provinceConfig.maxPagesPerBook} page limit (${totalEstimatedPages} pages). Consider splitting into multiple books or compressing documents.`,
        totalPages: totalEstimatedPages,
        maxPages: provinceConfig.maxPagesPerBook
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ========================================================================
    // CALCULATE PAGE NUMBERS
    // ========================================================================
    let currentPage = 1;
    const coverPageCount = 1;
    const keyFactsPageCount = 2;
    const tocEstimatedPages = Math.ceil(sortedEvidence.length / 15) || 1;
    
    currentPage = coverPageCount + keyFactsPageCount + tocEstimatedPages + 1;

    // ========================================================================
    // GENERATE EXHIBITS WITH SMART TITLES & GROUPING
    // ========================================================================
    const exhibits = sortedEvidence.map((item: any, index: number) => {
      const label = generateExhibitLabel(index, numberingStyle);
      const docType = item.evidence_metadata?.[0]?.doc_type || 'document';
      const estimatedPages = item.page_count || 1;
      const startPage = currentPage;
      currentPage += estimatedPages;
      
      const eventDate = item.event_date;
      const groupKey = getGroupKey(eventDate);
      const smartTitle = generateSmartTitle(`Exhibit ${label}`, docType, eventDate, item.source_party);

      return {
        id: item.id,
        exhibit_number: index + 1,
        label: `Exhibit ${label}`,
        short_label: label,
        smart_title: smartTitle,
        file_name: item.file_name,
        file_path: item.file_path,
        file_type: item.file_type,
        description: item.description,
        user_relevance: item.user_relevance,
        category: item.evidence_metadata?.[0]?.category || 'Document',
        doc_type: docType,
        event_date: eventDate,
        upload_date: item.upload_date,
        page_start: startPage,
        page_end: startPage + estimatedPages - 1,
        page_count: estimatedPages,
        summary: item.evidence_metadata?.[0]?.extracted_text?.substring(0, 300),
        source_party: item.source_party,
        group_key: groupKey,
        quality_flags: item.quality_flags,
        formatted_date: eventDate 
          ? new Date(eventDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
          : 'Date unknown'
      };
    });

    const totalPages = currentPage - 1;

    // ========================================================================
    // GROUP EXHIBITS BY MONTH/YEAR
    // ========================================================================
    const groupedExhibits: Record<string, typeof exhibits> = {};
    for (const exhibit of exhibits) {
      if (!groupedExhibits[exhibit.group_key]) {
        groupedExhibits[exhibit.group_key] = [];
      }
      groupedExhibits[exhibit.group_key].push(exhibit);
    }

    // ========================================================================
    // QUALITY ISSUES SUMMARY
    // ========================================================================
    const qualityIssues = exhibits
      .filter((e: any) => e.quality_flags?.flag_reasons?.length > 0)
      .map((e: any) => ({
        evidence_id: e.id,
        file_name: e.file_name,
        issues: e.quality_flags.flag_reasons,
        needs_replacement: e.quality_flags.needs_replacement,
        suggestion: e.quality_flags.needs_replacement 
          ? 'Replace this file for best results'
          : 'Consider reviewing this document'
      }));

    // ========================================================================
    // GENERATE AI DESCRIPTIONS + KEY FACTS
    // ========================================================================
    let aiDescriptions: { [key: string]: string } = {};
    let keyFactsPage: any = null;
    
    if (LOVABLE_API_KEY && exhibits.length > 0) {
      try {
        console.log('[GENERATE-BOOK] Generating AI descriptions...');
        
        const evidenceSummary = exhibits.map((e: any) => 
          `${e.label}: ${e.file_name} (${e.category}, dated ${e.formatted_date}) - ${e.description || 'No description'}`
        ).join('\n');

        const venueContext = caseData.venue || 'tribunal';
        
        // Generate exhibit descriptions
        const descResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `You are a legal document assistant preparing exhibit descriptions for Ontario ${venueContext} proceedings. Generate brief, professional descriptions suitable for a Book of Documents. Each description must:
1. Be 1-2 sentences maximum
2. State what the document is and its date
3. Explain its relevance to the case
4. Use formal, neutral language
5. Avoid legal conclusions or opinions`
              },
              {
                role: "user",
                content: `Generate professional exhibit descriptions for a Book of Documents in an Ontario ${venueContext} case about: ${caseDescription || caseData.description || caseData.title}

Exhibits:
${evidenceSummary}

Return a JSON object with exhibit labels as keys and professional descriptions as values.`
              }
            ],
            tools: [{
              type: "function",
              function: {
                name: "generate_descriptions",
                description: "Generate exhibit descriptions",
                parameters: {
                  type: "object",
                  properties: {
                    descriptions: {
                      type: "object",
                      additionalProperties: { type: "string" }
                    }
                  },
                  required: ["descriptions"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "generate_descriptions" } }
          }),
        });

        if (descResponse.ok) {
          const descData = await descResponse.json();
          const toolCall = descData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            const parsed = JSON.parse(toolCall.function.arguments);
            aiDescriptions = parsed.descriptions || {};
          }
        }

        // Generate Key Facts Extract
        console.log('[GENERATE-BOOK] Generating Key Facts Extract...');
        const keyFactsResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `You are a legal evidence analyst for Canadian tribunal proceedings. Generate a "Key Facts Extract" page for a Book of Documents.

OUTPUT FORMAT - Return valid JSON:
{
  "timeline": [
    {"date": "YYYY-MM-DD", "event": "Brief factual description", "exhibit_refs": ["A", "B"], "importance": "high|medium|low"}
  ],
  "parties": [
    {"name": "Party name", "role": "Applicant/Respondent/Witness", "description": "Brief description"}
  ],
  "key_issues": ["Legal issue 1", "Legal issue 2"],
  "claim_summary": "2-3 sentence factual summary of the claim"
}

RULES:
- Timeline events must be factual, not argumentative
- Use exhibit letters when referencing evidence
- Keep descriptions concise and court-appropriate
- Maximum 8 timeline events
- Key issues should be legal categories (e.g., "Maintenance breach", "Rent arrears")`
              },
              {
                role: "user",
                content: `Generate Key Facts Extract for this ${venueContext} case:

CASE: ${caseDescription || caseData.description || caseData.title}

EXHIBITS (${exhibits.length} documents):
${exhibits.map((e: any) => `${e.label}: ${e.file_name} (${e.doc_type}, ${e.formatted_date}) - ${e.description || 'No description provided'}`).join('\n')}

Generate the Key Facts JSON now.`
              }
            ],
            tools: [{
              type: "function",
              function: {
                name: "generate_key_facts",
                description: "Generate key facts extract",
                parameters: {
                  type: "object",
                  properties: {
                    timeline: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          date: { type: "string" },
                          event: { type: "string" },
                          exhibit_refs: { type: "array", items: { type: "string" } },
                          importance: { type: "string", enum: ["high", "medium", "low"] }
                        }
                      }
                    },
                    parties: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          role: { type: "string" },
                          description: { type: "string" }
                        }
                      }
                    },
                    key_issues: { type: "array", items: { type: "string" } },
                    claim_summary: { type: "string" }
                  },
                  required: ["timeline", "parties", "key_issues", "claim_summary"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "generate_key_facts" } }
          }),
        });

        if (keyFactsResponse.ok) {
          const kfData = await keyFactsResponse.json();
          const kfToolCall = kfData.choices?.[0]?.message?.tool_calls?.[0];
          if (kfToolCall?.function?.arguments) {
            keyFactsPage = JSON.parse(kfToolCall.function.arguments);
            keyFactsPage.generated_at = new Date().toISOString();
          }
        }

      } catch (e) {
        console.error('[GENERATE-BOOK] AI generation failed:', e);
      }
    }

    // Enhance exhibits with AI descriptions
    const enhancedExhibits = exhibits.map((exhibit: any) => ({
      ...exhibit,
      legal_description: aiDescriptions[exhibit.label] || 
        `${exhibit.category} dated ${exhibit.formatted_date}. ${exhibit.description || ''}`
    }));

    // ========================================================================
    // SAVE EXHIBIT RECORDS
    // ========================================================================
    const exhibitRecords = enhancedExhibits.map((exhibit: any, index: number) => ({
      case_id: caseId,
      evidence_id: exhibit.id,
      label: exhibit.label,
      order_index: index,
      page_start: exhibit.page_start,
      page_end: exhibit.page_end
    }));

    const { error: insertError } = await supabase
      .from('exhibits')
      .upsert(exhibitRecords, { 
        onConflict: 'case_id,evidence_id',
        ignoreDuplicates: false 
      });

    if (insertError) {
      console.error('[GENERATE-BOOK] Error creating exhibit records:', insertError);
    }

    // ========================================================================
    // GENERATE TABLE OF CONTENTS WITH GROUPING
    // ========================================================================
    const tableOfContents: any[] = [];
    let currentGroup = '';
    
    for (const exhibit of enhancedExhibits) {
      // Add group header if new group
      if (exhibit.group_key !== currentGroup) {
        currentGroup = exhibit.group_key;
        tableOfContents.push({
          is_group_header: true,
          group_name: currentGroup
        });
      }
      
      tableOfContents.push({
        is_group_header: false,
        item_number: exhibit.exhibit_number,
        label: exhibit.label,
        short_label: exhibit.short_label,
        title: exhibit.file_name,
        smart_title: exhibit.smart_title,
        description: exhibit.legal_description,
        category: exhibit.category,
        date: exhibit.formatted_date,
        page_reference: exhibit.page_start === exhibit.page_end 
          ? `p. ${exhibit.page_start}`
          : `pp. ${exhibit.page_start}-${exhibit.page_end}`,
        quality_warning: exhibit.quality_flags?.needs_replacement
      });
    }

    // ========================================================================
    // GENERATE COVER PAGE
    // ========================================================================
    const userName = profileData?.display_name || 
                    `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() ||
                    'Applicant';

    const venueDisplay: Record<string, string> = {
      'LTB': 'Landlord and Tenant Board',
      'HRTO': 'Human Rights Tribunal of Ontario',
      'Small Claims': 'Small Claims Court',
      'Superior': 'Superior Court of Justice',
      'Family': 'Ontario Court of Justice - Family Court',
      'WSIB': 'Workplace Safety and Insurance Appeals Tribunal'
    };

    const coverPage = {
      title: 'BOOK OF DOCUMENTS',
      subtitle: `${venueDisplay[caseData.venue || ''] || caseData.venue || 'Court/Tribunal'}`,
      case_title: caseData.title,
      court_file_number: organizationAnswers?.courtFileNumber || '[Court File Number]',
      tribunal: caseData.venue || 'Court',
      tribunal_full_name: venueDisplay[caseData.venue || ''] || caseData.venue || 'Court/Tribunal',
      applicant: userName,
      applicant_type: 'Applicant',
      respondent: organizationAnswers?.opposingPartyName || '[Opposing Party]',
      respondent_type: 'Respondent',
      hearing_date: organizationAnswers?.hearingDate 
        ? new Date(organizationAnswers.hearingDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
        : '[Hearing Date]',
      total_exhibits: enhancedExhibits.length,
      total_pages: totalPages,
      prepared_date: new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }),
      province: provinceConfig.name,
      province_code: province
    };

    // ========================================================================
    // CERTIFICATE OF SERVICE
    // ========================================================================
    let certificateOfService = null;
    if (organizationAnswers?.includeCertificateOfService !== false) {
      const serviceMethodText: Record<string, string> = {
        'email': 'email transmission to the address provided',
        'mail': 'regular mail to the address provided',
        'personal': 'personal service',
        'courier': 'courier delivery'
      };

      certificateOfService = {
        title: 'CERTIFICATE OF SERVICE',
        content: `I, ${userName}, certify that on ${organizationAnswers?.serviceDate 
          ? new Date(organizationAnswers.serviceDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
          : '[DATE]'}, I served a copy of this Book of Documents containing ${enhancedExhibits.length} exhibit(s) totaling ${totalPages} pages on:

${organizationAnswers?.opposingPartyName || '[Opposing Party Name]'}
[Address]

I served these documents by: ${serviceMethodText[organizationAnswers?.serviceMethod || 'email'] || '[Method of Service]'}

Date: ____________________

Signature: ____________________
${userName}`,
        fields_to_complete: [
          'Date of service',
          'Opposing party address',
          'Method of service (if not pre-selected)',
          'Your signature'
        ]
      };
    }

    // Affidavit template
    let affidavitTemplate = null;
    if (organizationAnswers?.includeAffidavit !== false) {
      affidavitTemplate = {
        title: 'AFFIDAVIT OF SERVICE',
        content: `AFFIDAVIT OF SERVICE

I, ${userName}, of the [City/Town] of _____________, in the Province of ${provinceConfig.name}, MAKE OATH AND SAY:

1. On ${organizationAnswers?.serviceDate 
  ? new Date(organizationAnswers.serviceDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  : '[DATE]'}, I served a copy of the attached Book of Documents containing ${enhancedExhibits.length} exhibits on:

   ${organizationAnswers?.opposingPartyName || '[Opposing Party Name]'}
   [Address]

2. I served these documents by [method of service].

SWORN BEFORE ME at the
[City/Town] of _____________,
in the Province of ${provinceConfig.name},
this _____ day of _____________, 20___


_____________________________
Commissioner for Taking Affidavits


_____________________________
${userName}`,
        fields_to_complete: [
          'City/Town',
          'Date of service',
          'Method of service',
          'Opposing party address',
          'Commissioner signature',
          'Your signature'
        ]
      };
    }

    // ========================================================================
    // COMPLIANCE SUMMARY
    // ========================================================================
    const complianceSummary = {
      is_compliant: qualityIssues.filter((q: any) => q.needs_replacement).length === 0,
      issues: qualityIssues.filter((q: any) => q.needs_replacement).map((q: any) => `${q.file_name}: ${q.issues.join(', ')}`),
      warnings: qualityIssues.filter((q: any) => !q.needs_replacement).map((q: any) => `${q.file_name}: ${q.issues.join(', ')}`),
      rules_applied: [
        'Chronological ordering (oldest first)',
        'Consecutive page numbering',
        'Table of contents with page references',
        `${numberingStyle === 'alphabetical' ? 'Alphabetical' : 'Numerical'} exhibit labeling`
      ]
    };

    buildStatus = 'ready';
    console.log(`[GENERATE-BOOK] Success! Generated book with ${enhancedExhibits.length} exhibits, ${totalPages} pages`);

    return new Response(JSON.stringify({
      success: true,
      status: buildStatus,
      coverPage,
      keyFactsPage,
      tableOfContents,
      exhibits: enhancedExhibits,
      groupedExhibits,
      certificateOfService,
      affidavitTemplate,
      totalPages,
      duplicatesDetected: duplicates,
      conflictsDetected: conflicts,
      qualityIssues,
      complianceSummary
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error('[GENERATE-BOOK] Error:', error);
    buildStatus = 'failed';
    
    return new Response(JSON.stringify({ 
      success: false,
      status: buildStatus,
      error: error.message,
      failed_document: failedDocument
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
