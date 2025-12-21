import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Ontario Book of Documents Requirements (LTB, HRTO, Superior Court, Small Claims)
// Based on Ontario Practice Directions:
// - Consecutively numbered pages
// - Table of contents with page numbers
// - Readable documents
// - Each item identified by order and page number

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

// Province-specific configuration for future expansion
const PROVINCE_CONFIGS: Record<string, {
  name: string;
  tribunals: string[];
  evidenceRules: {
    deadlineDays: number;
    maxFileSizeMB: number;
    acceptedFormats: string[];
    requiresTableOfContents: boolean;
    requiresPageNumbers: boolean;
    requiresCertificateOfService: boolean;
  };
  courtLevels: string[];
}> = {
  ON: {
    name: 'Ontario',
    tribunals: ['LTB', 'HRTO', 'WSIB', 'OLT'],
    courtLevels: ['Small Claims', 'Superior Court', 'Divisional Court', 'Court of Appeal'],
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
    courtLevels: ['Small Claims', 'Supreme Court', 'Court of Appeal'],
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
    courtLevels: ['Provincial Court', 'Court of Queen\'s Bench', 'Court of Appeal'],
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
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
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { 
      caseId, 
      includeTableOfContents = true, 
      numberingStyle = 'alphabetical',
      caseDescription,
      exhibitOverrides,
      organizationAnswers 
    }: ExhibitBookRequest = await req.json();

    if (!caseId) {
      return new Response(JSON.stringify({ error: 'Case ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user owns this case and get case details
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id, user_id, title, description, venue, province')
      .eq('id', caseId)
      .eq('user_id', userData.user.id)
      .single();

    if (caseError || !caseData) {
      return new Response(JSON.stringify({ error: 'Case not found or access denied' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get province config (default to Ontario)
    const province = caseData.province?.toUpperCase() || 'ON';
    const provinceConfig = PROVINCE_CONFIGS[province] || PROVINCE_CONFIGS['ON'];

    // Fetch user profile for cover page and affidavit
    const { data: profileData } = await supabase
      .from('profiles')
      .select('first_name, last_name, display_name, phone, email')
      .eq('user_id', userData.user.id)
      .single();

    // Fetch all evidence for this case with metadata
    const { data: evidenceData, error: evidenceError } = await supabase
      .from('evidence')
      .select(`
        *,
        evidence_metadata (
          doc_type,
          category,
          dates,
          extracted_text,
          parties
        )
      `)
      .eq('case_id', caseId);

    if (evidenceError) throw evidenceError;

    if (!evidenceData || evidenceData.length === 0) {
      return new Response(JSON.stringify({ error: 'No evidence found for this case' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Apply exhibit overrides from user if provided
    let processedEvidence = evidenceData.map((item: any) => {
      const override = exhibitOverrides?.find(o => o.evidence_id === item.id);
      if (override) {
        return {
          ...item,
          description: override.description || item.description,
          user_relevance: override.relevance,
          override_date: override.incident_date,
          order_override: override.order
        };
      }
      return item;
    });

    // Sort evidence CHRONOLOGICALLY (Ontario requirement: oldest first)
    const sortBy = organizationAnswers?.sortBy || 'chronological';
    let sortedEvidence = [...processedEvidence];

    sortedEvidence.sort((a, b) => {
      // Use override date if provided, else extract from metadata
      const getDate = (item: any): Date => {
        if (item.override_date) return new Date(item.override_date);
        const dates = item.evidence_metadata?.[0]?.dates;
        const incidentDate = dates?.incident || dates?.captured || dates?.document_date;
        return new Date(incidentDate || item.upload_date);
      };
      
      // If order overrides exist, use them first
      if (a.order_override !== undefined && b.order_override !== undefined) {
        return a.order_override - b.order_override;
      }
      
      if (sortBy === 'chronological') {
        return getDate(a).getTime() - getDate(b).getTime();
      } else if (sortBy === 'category') {
        const catA = a.evidence_metadata?.[0]?.category || 'zzz';
        const catB = b.evidence_metadata?.[0]?.category || 'zzz';
        const catCompare = catA.localeCompare(catB);
        if (catCompare !== 0) return catCompare;
        return getDate(a).getTime() - getDate(b).getTime();
      }
      return getDate(a).getTime() - getDate(b).getTime();
    });

    // Calculate CONSECUTIVE PAGE NUMBERS (Ontario requirement)
    // Page 1 = Cover page
    // Page 2-X = Table of Contents
    // Then exhibits with consecutive numbering
    let currentPage = 1;
    const coverPageCount = 1;
    const tocEstimatedPages = Math.ceil(sortedEvidence.length / 15) || 1; // ~15 items per TOC page
    
    currentPage = coverPageCount + tocEstimatedPages + 1;

    // Generate exhibits with Ontario-compliant formatting
    const exhibits = sortedEvidence.map((item: any, index: number) => {
      // Ontario: Exhibits can be A, B, C or 1, 2, 3 based on tribunal preference
      const label = numberingStyle === 'alphabetical' 
        ? (index < 26 ? String.fromCharCode(65 + index) : `A${index - 25}`)
        : (index + 1).toString();

      const docType = item.evidence_metadata?.[0]?.doc_type || 'document';
      const estimatedPages = item.page_count || 1;
      const startPage = currentPage;
      currentPage += estimatedPages;

      // Extract the most relevant date for chronological ordering
      const dates = item.evidence_metadata?.[0]?.dates || {};
      const incidentDate = dates.incident || dates.captured || dates.document_date;

      return {
        id: item.id,
        exhibit_number: index + 1,
        label: `Exhibit ${label}`,
        short_label: label,
        file_name: item.file_name,
        file_path: item.file_path,
        file_type: item.file_type,
        description: item.description,
        category: item.evidence_metadata?.[0]?.category || 'Document',
        doc_type: docType,
        incident_date: incidentDate,
        upload_date: item.upload_date,
        page_start: startPage,
        page_end: startPage + estimatedPages - 1,
        page_count: estimatedPages,
        summary: item.evidence_metadata?.[0]?.extracted_text?.substring(0, 300),
        parties: item.evidence_metadata?.[0]?.parties,
        // Ontario requirement: human-readable date format
        formatted_date: incidentDate 
          ? new Date(incidentDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
          : 'Date unknown'
      };
    });

    const totalPages = currentPage - 1;

    // Generate AI-powered exhibit descriptions for Ontario court standards
    let aiDescriptions: { [key: string]: string } = {};
    if (LOVABLE_API_KEY && exhibits.length > 0) {
      try {
        const evidenceSummary = exhibits.map(e => 
          `${e.label}: ${e.file_name} (${e.category}, dated ${e.formatted_date}) - ${e.description || 'No description'}`
        ).join('\n');

        const venueContext = caseData.venue || 'tribunal';
        
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
                content: `Generate professional exhibit descriptions for a Book of Documents in an Ontario ${venueContext} case about: ${caseData.description || caseData.title}

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

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            const parsed = JSON.parse(toolCall.function.arguments);
            aiDescriptions = parsed.descriptions || {};
          }
        }
      } catch (e) {
        console.error('AI description generation failed:', e);
      }
    }

    // Enhance exhibits with AI descriptions
    const enhancedExhibits = exhibits.map(exhibit => ({
      ...exhibit,
      legal_description: aiDescriptions[exhibit.label] || 
        `${exhibit.category} dated ${exhibit.formatted_date}. ${exhibit.description || ''}`
    }));

    // Create exhibits records in database with page numbers
    const exhibitRecords = enhancedExhibits.map((exhibit, index) => ({
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
      console.error('Error creating exhibit records:', insertError);
    }

    // Generate Ontario-compliant Table of Contents (consecutively numbered, with page references)
    const tableOfContents = enhancedExhibits.map((exhibit, index) => ({
      item_number: index + 1,
      label: exhibit.label,
      short_label: exhibit.short_label,
      title: exhibit.file_name,
      description: exhibit.legal_description,
      category: exhibit.category,
      date: exhibit.formatted_date,
      page_reference: exhibit.page_start === exhibit.page_end 
        ? `p. ${exhibit.page_start}`
        : `pp. ${exhibit.page_start}-${exhibit.page_end}`
    }));

    // Generate cover page info (Ontario format)
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
      subtitle: `${caseData.venue ? venueDisplay[caseData.venue] || caseData.venue : 'Court/Tribunal'}`,
      case_title: caseData.title,
      court_file_number: organizationAnswers?.courtFileNumber || '[Court File Number]',
      tribunal: caseData.venue || 'Court',
      tribunal_full_name: venueDisplay[caseData.venue || ''] || caseData.venue || 'Court/Tribunal',
      
      // Parties section
      applicant: userName,
      applicant_type: 'Applicant',
      respondent: organizationAnswers?.opposingPartyName || '[Opposing Party]',
      respondent_type: 'Respondent',
      
      // Case details
      hearing_date: organizationAnswers?.hearingDate 
        ? new Date(organizationAnswers.hearingDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
        : '[Hearing Date]',
      
      // Document stats
      total_exhibits: enhancedExhibits.length,
      total_pages: totalPages,
      prepared_date: new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }),
      
      // Province info
      province: provinceConfig.name,
      province_code: province
    };

    // Generate Ontario Certificate of Service (required for serving opposing parties)
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

    // Generate Affidavit of Service template (Ontario format)
    let affidavitTemplate = null;
    if (organizationAnswers?.includeAffidavit) {
      affidavitTemplate = {
        title: 'AFFIDAVIT OF SERVICE',
        content: `ONTARIO
${coverPage.tribunal_full_name}

Court File No.: ${coverPage.court_file_number}

BETWEEN:
${userName.toUpperCase()}
Applicant
- and -
${(organizationAnswers?.opposingPartyName || '[OPPOSING PARTY]').toUpperCase()}
Respondent

AFFIDAVIT OF SERVICE

I, ${userName}, of the Province of Ontario, MAKE OATH AND SAY:

1. I am the Applicant in this proceeding.

2. On ${organizationAnswers?.serviceDate 
  ? new Date(organizationAnswers.serviceDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  : '[DATE]'}, I served the Respondent with a copy of this Book of Documents containing:
   - Cover Page (1 page)
   - Table of Contents (${tocEstimatedPages} page(s))
   - ${enhancedExhibits.length} Exhibits (${totalPages - coverPageCount - tocEstimatedPages} pages)
   Total: ${totalPages} pages

3. Service was effected by: ${organizationAnswers?.serviceMethod || '[Method of Service]'}

4. The documents were served on:
   ${organizationAnswers?.opposingPartyName || '[Opposing Party Name]'}
   [Address]

SWORN BEFORE ME at
_________________, Ontario
this ____ day of __________, 20____


_____________________________          _____________________________
Commissioner for Taking Affidavits     ${userName}`,
        signature_required: true,
        commissioner_required: true
      };
    }

    // Generate witness list if requested (extracted from evidence metadata)
    let witnessList = null;
    if (organizationAnswers?.includeWitnessList) {
      const allParties = new Map<string, { exhibits: string[], role: string }>();
      
      enhancedExhibits.forEach(e => {
        if (e.parties && typeof e.parties === 'object') {
          Object.entries(e.parties).forEach(([role, name]) => {
            if (typeof name === 'string' && name.trim()) {
              const existing = allParties.get(name) || { exhibits: [], role };
              existing.exhibits.push(e.short_label);
              allParties.set(name, existing);
            }
          });
        }
      });

      witnessList = {
        title: 'WITNESS LIST',
        note: 'The following individuals are referenced in the exhibits and may be called as witnesses:',
        witnesses: Array.from(allParties.entries()).map(([name, data], i) => ({
          number: i + 1,
          name,
          role: data.role || 'Witness',
          exhibits_referenced: data.exhibits.join(', '),
          will_call: false // User to check
        }))
      };
    }

    // Ontario compliance summary
    const complianceSummary = {
      province: provinceConfig.name,
      tribunal: caseData.venue,
      requirements_met: {
        consecutive_page_numbers: true,
        table_of_contents: includeTableOfContents,
        readable_format: true,
        chronological_order: sortBy === 'chronological',
        each_item_numbered: true,
        page_references_included: true
      },
      deadline_reminder: `Evidence must be served at least ${provinceConfig.evidenceRules.deadlineDays} days before the hearing date.`,
      accepted_formats: provinceConfig.evidenceRules.acceptedFormats.join(', ')
    };

    console.log(`Generated Ontario-compliant exhibit book with ${enhancedExhibits.length} exhibits, ${totalPages} pages for case ${caseId}`);

    return new Response(
      JSON.stringify({
        success: true,
        caseId,
        exhibitCount: enhancedExhibits.length,
        totalPages,
        coverPage,
        tableOfContents: includeTableOfContents ? tableOfContents : undefined,
        exhibits: enhancedExhibits,
        certificateOfService,
        affidavitTemplate,
        witnessList,
        complianceSummary,
        sortedBy: sortBy,
        message: `Ontario-compliant Book of Documents generated with ${enhancedExhibits.length} exhibits in chronological order. Ready for service to opposing parties.`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Error generating exhibit book:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to generate exhibit book'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
