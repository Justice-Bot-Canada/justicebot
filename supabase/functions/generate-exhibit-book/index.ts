import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExhibitBookRequest {
  caseId: string;
  includeTableOfContents?: boolean;
  numberingStyle?: 'alphabetical' | 'numerical';
  organizationAnswers?: {
    sortBy: 'chronological' | 'category' | 'importance';
    includeWitnessList: boolean;
    includeAffidavit: boolean;
    opposingPartyName?: string;
    courtFileNumber?: string;
    hearingDate?: string;
  };
}

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

    // Fetch user profile for affidavit
    const { data: profileData } = await supabase
      .from('profiles')
      .select('first_name, last_name, display_name')
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

    // Sort evidence based on user preference
    const sortBy = organizationAnswers?.sortBy || 'chronological';
    let sortedEvidence = [...evidenceData];

    if (sortBy === 'chronological') {
      sortedEvidence.sort((a, b) => {
        const dateA = a.evidence_metadata?.[0]?.dates?.incident || 
                      a.evidence_metadata?.[0]?.dates?.captured || 
                      a.upload_date;
        const dateB = b.evidence_metadata?.[0]?.dates?.incident || 
                      b.evidence_metadata?.[0]?.dates?.captured || 
                      b.upload_date;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
    } else if (sortBy === 'category') {
      sortedEvidence.sort((a, b) => {
        const catA = a.evidence_metadata?.[0]?.category || 'zzz';
        const catB = b.evidence_metadata?.[0]?.category || 'zzz';
        return catA.localeCompare(catB);
      });
    }

    // Calculate page numbers (estimate based on file type and content)
    let currentPage = 1;
    const pageEstimates: { [key: string]: number } = {
      'pdf': 1,
      'image': 1,
      'document': 2,
      'email': 1,
      'text': 1
    };

    // Generate exhibit labels with page numbers
    const exhibits = sortedEvidence.map((item: any, index: number) => {
      const label = numberingStyle === 'alphabetical' 
        ? (index < 26 ? String.fromCharCode(65 + index) : `A${index - 25}`)
        : (index + 1).toString();

      const docType = item.evidence_metadata?.[0]?.doc_type || 'document';
      const estimatedPages = item.page_count || pageEstimates[docType] || 1;
      const startPage = currentPage;
      currentPage += estimatedPages;

      const incidentDate = item.evidence_metadata?.[0]?.dates?.incident ||
                          item.evidence_metadata?.[0]?.dates?.captured;

      return {
        id: item.id,
        label: `Exhibit ${label}`,
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
        summary: item.evidence_metadata?.[0]?.extracted_text?.substring(0, 200),
        parties: item.evidence_metadata?.[0]?.parties
      };
    });

    const totalPages = currentPage - 1;

    // Generate AI-powered exhibit descriptions if API key available
    let aiDescriptions: { [key: string]: string } = {};
    if (LOVABLE_API_KEY && exhibits.length > 0) {
      try {
        const evidenceSummary = exhibits.map(e => 
          `${e.label}: ${e.file_name} (${e.category}, dated ${e.incident_date || 'unknown'})`
        ).join('\n');

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
                content: `You are a legal document assistant. Generate brief, professional descriptions for court exhibits. Each description should be 1-2 sentences explaining what the exhibit shows and its relevance. Use formal legal language.`
              },
              {
                role: "user",
                content: `Generate professional exhibit descriptions for these documents in a ${caseData.venue || 'court'} case about: ${caseData.description || caseData.title}\n\nExhibits:\n${evidenceSummary}\n\nReturn JSON object with exhibit labels as keys and descriptions as values.`
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
      legal_description: aiDescriptions[exhibit.label] || exhibit.description || `${exhibit.category} document`
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

    // Generate Table of Contents with page numbers
    const tableOfContents = enhancedExhibits.map(exhibit => ({
      label: exhibit.label,
      title: exhibit.file_name,
      description: exhibit.legal_description,
      category: exhibit.category,
      date: exhibit.incident_date || exhibit.upload_date,
      page_start: exhibit.page_start,
      page_end: exhibit.page_end
    }));

    // Generate cover page info
    const userName = profileData?.display_name || 
                    `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() ||
                    'Applicant';

    const coverPage = {
      title: `EXHIBIT BOOK`,
      case_title: caseData.title,
      court_file_number: organizationAnswers?.courtFileNumber || '[Court File Number]',
      tribunal: caseData.venue || 'Court',
      applicant: userName,
      respondent: organizationAnswers?.opposingPartyName || '[Opposing Party]',
      hearing_date: organizationAnswers?.hearingDate || '[Hearing Date]',
      total_exhibits: enhancedExhibits.length,
      total_pages: totalPages,
      prepared_date: new Date().toISOString().split('T')[0]
    };

    // Generate affidavit of service template if requested
    let affidavitTemplate = null;
    if (organizationAnswers?.includeAffidavit) {
      affidavitTemplate = {
        title: 'AFFIDAVIT OF SERVICE',
        declarant: userName,
        content: `I, ${userName}, of the ${caseData.province || 'Province'}, MAKE OATH AND SAY:

1. I am the Applicant in this proceeding and have personal knowledge of the matters set out in this affidavit.

2. On [DATE], I served a copy of this Exhibit Book containing ${enhancedExhibits.length} exhibits (${totalPages} pages) on:

   ${organizationAnswers?.opposingPartyName || '[Opposing Party Name]'}
   [Address]

3. I served these documents by: [Method of Service - e.g., personal service, registered mail, email]

4. Attached hereto and marked as Exhibit "PROOF" is proof of service.

SWORN BEFORE ME at
[City], ${caseData.province || 'Province'}
this ___ day of _________, 20___

_____________________________
Commissioner for Taking Affidavits`,
        signature_line: `_____________________________\n${userName}`
      };
    }

    // Generate witness list if requested
    let witnessList = null;
    if (organizationAnswers?.includeWitnessList) {
      // Extract parties from evidence metadata
      const allParties = new Set<string>();
      enhancedExhibits.forEach(e => {
        if (e.parties) {
          Object.values(e.parties).forEach((p: any) => {
            if (typeof p === 'string') allParties.add(p);
          });
        }
      });

      witnessList = {
        title: 'WITNESS LIST',
        witnesses: Array.from(allParties).map((name, i) => ({
          number: i + 1,
          name,
          role: 'To be determined',
          exhibits_referenced: enhancedExhibits
            .filter(e => JSON.stringify(e.parties || {}).includes(name as string))
            .map(e => e.label)
        }))
      };
    }

    console.log(`Generated exhibit book with ${enhancedExhibits.length} exhibits, ${totalPages} pages for case ${caseId}`);

    return new Response(
      JSON.stringify({
        success: true,
        caseId,
        exhibitCount: enhancedExhibits.length,
        totalPages,
        coverPage,
        tableOfContents: includeTableOfContents ? tableOfContents : undefined,
        exhibits: enhancedExhibits,
        affidavitTemplate,
        witnessList,
        sortedBy: sortBy,
        message: 'Court-ready exhibit book generated with chronological ordering and page references.'
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
