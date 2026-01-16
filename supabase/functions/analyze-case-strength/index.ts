import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema - accepts both string and object formats
const CaseStrengthSchema = z.object({
  caseDetails: z.union([
    z.string().min(1, "Case details required"),
    z.record(z.unknown())
  ]).optional(),
  evidenceList: z.union([
    z.string(),
    z.array(z.record(z.unknown()))
  ]).optional().default([]),
  jurisdiction: z.string().trim().max(100).optional().default('Ontario, Canada'),
  caseType: z.string().optional(),
  caseId: z.string().uuid().optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    
    // Validate input
    const validation = CaseStrengthSchema.safeParse(requestBody);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request data',
          details: validation.error.issues.map(i => i.message).join(', ')
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { caseDetails, evidenceList, jurisdiction, caseType, caseId } = validation.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const CANLII_API_KEY = Deno.env.get("CANLII_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Initialize Supabase client for fetching evidence
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Fetch evidence from database if caseId provided
    let evidenceFromDb: any[] = [];
    let evidenceAnalysis: any = null;
    
    if (caseId) {
      console.log('Fetching evidence for case:', caseId);
      
      // Fetch raw evidence with descriptions and OCR text
      const { data: evidence, error: evidenceError } = await supabaseClient
        .from('evidence')
        .select('file_name, description, file_type, ocr_text, tags')
        .eq('case_id', caseId);
      
      if (!evidenceError && evidence) {
        evidenceFromDb = evidence;
        console.log(`Found ${evidence.length} evidence items`);
      }

      // Fetch any existing evidence analysis
      const { data: analysis } = await supabaseClient
        .from('evidence_analysis')
        .select('analysis_data, evidence_count')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (analysis) {
        evidenceAnalysis = analysis.analysis_data;
        console.log('Found existing evidence analysis');
      }
    }

    // Search CanLII for relevant case law
    let canliiResults: any[] = [];
    if (CANLII_API_KEY && (caseDetails || caseType)) {
      const searchQuery = buildCanLIIQuery(caseDetails, caseType);
      const jurisdictionCode = getJurisdictionCode(jurisdiction);
      
      try {
        console.log('Searching CanLII for:', searchQuery.substring(0, 50));
        const canliiUrl = `https://api.canlii.org/v1/caseBrowse/${jurisdictionCode}/en/?api_key=${CANLII_API_KEY}&resultCount=5&search=${encodeURIComponent(searchQuery)}`;
        
        const canliiResponse = await fetch(canliiUrl);
        if (canliiResponse.ok) {
          const canliiData = await canliiResponse.json();
          canliiResults = (canliiData.cases || []).map((c: any) => ({
            title: c.title,
            citation: c.citation || c.databaseId,
            date: c.decisionDate,
            court: c.court
          }));
          console.log(`Found ${canliiResults.length} CanLII cases`);
        }
      } catch (err) {
        console.error('CanLII search error:', err);
      }
    }

    // Determine case type label for context with province awareness
    const caseTypeLabel = caseType ? getCaseTypeLabel(caseType, jurisdiction) : 'General Legal';

    // Build comprehensive evidence context
    const evidenceContext = buildEvidenceContext(evidenceFromDb, evidenceAnalysis, evidenceList);

    const systemPrompt = `You are a legal case strength analyzer specializing in Canadian law, specifically ${caseTypeLabel} cases.
Analyze case details, uploaded evidence, and relevant case law to provide objective probability assessments.
Base your analysis on:
1. Legal precedent from CanLII case law
2. Strength and completeness of evidence
3. Applicable laws for ${caseTypeLabel} matters in ${jurisdiction}

IMPORTANT: Factor evidence quality heavily into the score:
- Strong documentary evidence (contracts, photos, receipts, official documents): +15-25 points
- Witness statements or corroborating evidence: +10-15 points
- OCR-extracted text showing key facts: +5-10 points
- Missing critical evidence: -10-20 points
- Contradictory or weak evidence: -5-15 points

DO NOT provide legal advice, only analytical assessments.
Always include disclaimers that this is not legal advice.`;

    // Convert to string if needed
    const caseDetailsStr = typeof caseDetails === 'string' ? caseDetails : JSON.stringify(caseDetails || '');

    const prompt = `Analyze this ${caseTypeLabel} case and provide a strength assessment:

CASE TYPE: ${caseTypeLabel}
JURISDICTION: ${jurisdiction || 'Ontario, Canada'}
CASE DETAILS: ${caseDetailsStr}

UPLOADED EVIDENCE (${evidenceFromDb.length} items):
${evidenceContext}

${canliiResults.length > 0 ? `RELEVANT CANLII CASE LAW:
${canliiResults.map((c, i) => `${i + 1}. ${c.title} (${c.citation}) - ${c.court}, ${c.date}`).join('\n')}` : 'No CanLII cases found for this query.'}

${evidenceAnalysis ? `PREVIOUS EVIDENCE ANALYSIS:
Strengths: ${JSON.stringify(evidenceAnalysis.strengths || [])}
Weaknesses: ${JSON.stringify(evidenceAnalysis.weaknesses || [])}
Gaps: ${JSON.stringify(evidenceAnalysis.gaps || [])}` : ''}

Provide analysis in JSON format with:
- strengthScore (0-100): Overall case strength factoring in evidence quality and case law
- successProbability (low/medium/high): Likelihood of favorable outcome
- strengths (array): Key strengths including evidence highlights
- weaknesses (array): Potential weaknesses including evidence gaps
- recommendations (array): Steps to strengthen the case
- legalBasis (string): Applicable laws and precedents (cite CanLII cases if relevant)
- riskFactors (array): Potential risks or concerns
- estimatedTimeline (string): Typical timeline for this type of case
- evidenceScore (0-100): Separate score for evidence strength alone
- casesPrecedent (array): Relevant case citations from CanLII

Remember: This is educational analysis, not legal advice.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "analyze_case_strength",
            description: "Analyze legal case strength and provide assessment",
            parameters: {
              type: "object",
              properties: {
                strengthScore: { type: "number", minimum: 0, maximum: 100 },
                successProbability: { type: "string", enum: ["low", "medium", "high"] },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                legalBasis: { type: "string" },
                riskFactors: { type: "array", items: { type: "string" } },
                estimatedTimeline: { type: "string" },
                evidenceScore: { type: "number", minimum: 0, maximum: 100 },
                casesPrecedent: { type: "array", items: { type: "string" } }
              },
              required: ["strengthScore", "successProbability", "strengths", "weaknesses", "recommendations"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "analyze_case_strength" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    const analysis = JSON.parse(toolCall.function.arguments);

    console.log('Analysis complete. Score:', analysis.strengthScore);

    return new Response(
      JSON.stringify({ 
        analysis,
        sources: {
          evidenceCount: evidenceFromDb.length,
          canliiCases: canliiResults.length,
          hasEvidenceAnalysis: !!evidenceAnalysis
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error analyzing case strength:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Province-specific tribunal name mappings
const PROVINCE_TRIBUNALS: Record<string, Record<string, string>> = {
  'ON': {
    'HRTO': 'Human Rights Tribunal of Ontario',
    'LTB': 'Landlord and Tenant Board',
    'SMALL_CLAIMS': 'Small Claims Court',
    'FAMILY': 'Ontario Court of Justice - Family',
    'SUPERIOR': 'Superior Court of Justice',
    'CRIMINAL': 'Ontario Court of Justice - Criminal',
    'LABOUR': 'Ontario Labour Relations Board',
    'WSIB': 'Workplace Safety and Insurance Board'
  },
  'BC': {
    'RTB': 'Residential Tenancy Branch',
    'BCHRT': 'BC Human Rights Tribunal',
    'CRT': 'Civil Resolution Tribunal',
    'SMALL_CLAIMS': 'Small Claims Court',
    'FAMILY': 'Provincial Court of BC - Family',
    'SUPREME': 'Supreme Court of British Columbia',
    'CRIMINAL': 'Provincial Court of BC - Criminal',
    'LRB': 'Labour Relations Board',
    'WCB': 'WorkSafeBC'
  },
  'AB': {
    'RTDRS': 'Residential Tenancy Dispute Resolution Service',
    'AHRC': 'Alberta Human Rights Commission',
    'SMALL_CLAIMS': 'Provincial Court Civil',
    'FAMILY': 'Court of King\'s Bench - Family',
    'KINGS_BENCH': 'Court of King\'s Bench',
    'CRIMINAL': 'Provincial Court of Alberta - Criminal',
    'ALRB': 'Alberta Labour Relations Board',
    'WCB': 'Workers\' Compensation Board'
  },
  'QC': {
    'TAL': 'Tribunal administratif du logement',
    'CDPDJ': 'Commission des droits de la personne',
    'SMALL_CLAIMS': 'Small Claims Division',
    'FAMILY': 'Superior Court - Family',
    'SUPERIOR': 'Superior Court of Quebec',
    'CRIMINAL': 'Court of Quebec - Criminal',
    'TAT': 'Tribunal administratif du travail',
    'CNESST': 'CNESST'
  }
};

// Helper function to convert case type codes to readable labels with province context
function getCaseTypeLabel(caseType: string, jurisdiction?: string): string {
  const provinceCode = extractProvinceCode(jurisdiction || '');
  const provinceTribunals = PROVINCE_TRIBUNALS[provinceCode];
  
  if (provinceTribunals) {
    const tribunalName = provinceTribunals[caseType?.toUpperCase()];
    if (tribunalName) return tribunalName;
  }
  
  // Fallback to generic labels
  const genericLabels: Record<string, string> = {
    'HRTO': 'Human Rights Tribunal',
    'LTB': 'Landlord and Tenant Board',
    'RTB': 'Residential Tenancy Branch',
    'RTDRS': 'Residential Tenancy Dispute Resolution Service',
    'SMALL_CLAIMS': 'Small Claims Court',
    'FAMILY': 'Family Court',
    'SUPERIOR': 'Superior Court',
    'CRIMINAL': 'Criminal Court',
    'LABOUR': 'Labour Relations Board',
    'IMMIGRATION': 'Immigration and Refugee Board'
  };
  return genericLabels[caseType?.toUpperCase()] || caseType || 'General Legal';
}

// Extract province code from jurisdiction string
function extractProvinceCode(jurisdiction: string): string {
  const lower = jurisdiction?.toLowerCase() || '';
  if (lower.includes('ontario') || lower.includes(', on')) return 'ON';
  if (lower.includes('british columbia') || lower.includes(', bc')) return 'BC';
  if (lower.includes('alberta') || lower.includes(', ab')) return 'AB';
  if (lower.includes('quebec') || lower.includes(', qc')) return 'QC';
  if (lower.includes('manitoba') || lower.includes(', mb')) return 'MB';
  if (lower.includes('saskatchewan') || lower.includes(', sk')) return 'SK';
  return 'ON'; // Default
}

// Build search query for CanLII
function buildCanLIIQuery(caseDetails: any, caseType?: string): string {
  const keywords: string[] = [];
  
  if (typeof caseDetails === 'string' && caseDetails) {
    // Extract key legal terms from description
    keywords.push(caseDetails.substring(0, 100));
  }
  
  // Add case type specific keywords
  switch (caseType?.toUpperCase()) {
    case 'LTB':
      keywords.push('landlord tenant residential tenancies');
      break;
    case 'HRTO':
      keywords.push('human rights discrimination');
      break;
    case 'SMALL_CLAIMS':
      keywords.push('small claims');
      break;
    case 'CRIMINAL':
      keywords.push('criminal');
      break;
    case 'FAMILY':
      keywords.push('family law custody support');
      break;
    case 'LABOUR':
      keywords.push('employment labour');
      break;
  }
  
  return keywords.join(' ');
}

// Get CanLII jurisdiction code from jurisdiction string
function getJurisdictionCode(jurisdiction: string): string {
  const lower = jurisdiction?.toLowerCase() || '';
  if (lower.includes('ontario') || lower.includes('on')) return 'on';
  if (lower.includes('british columbia') || lower.includes('bc')) return 'bc';
  if (lower.includes('alberta') || lower.includes('ab')) return 'ab';
  if (lower.includes('quebec') || lower.includes('qc')) return 'qc';
  if (lower.includes('manitoba') || lower.includes('mb')) return 'mb';
  if (lower.includes('saskatchewan') || lower.includes('sk')) return 'sk';
  return 'on'; // Default to Ontario
}

// Build evidence context string from database evidence
function buildEvidenceContext(
  evidenceFromDb: any[], 
  evidenceAnalysis: any, 
  evidenceList: any
): string {
  if (evidenceFromDb.length === 0 && !evidenceList) {
    return 'No evidence uploaded yet.';
  }
  
  let context = '';
  
  // Add database evidence
  if (evidenceFromDb.length > 0) {
    context += evidenceFromDb.map((e, i) => {
      let item = `${i + 1}. ${e.file_name} (${e.file_type})`;
      if (e.description) item += `\n   Description: ${e.description}`;
      if (e.tags?.length) item += `\n   Tags: ${e.tags.join(', ')}`;
      if (e.ocr_text) item += `\n   OCR Text Preview: ${e.ocr_text.substring(0, 300)}...`;
      return item;
    }).join('\n\n');
  }
  
  // Add any manually provided evidence
  if (evidenceList && Array.isArray(evidenceList) && evidenceList.length > 0) {
    context += '\n\nAdditional Evidence:\n' + JSON.stringify(evidenceList);
  } else if (typeof evidenceList === 'string' && evidenceList) {
    context += '\n\nAdditional Evidence:\n' + evidenceList;
  }
  
  return context;
}
