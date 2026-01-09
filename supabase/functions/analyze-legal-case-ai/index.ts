import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Require authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { caseDetails, caseType, province, caseId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generic logging without PII - map case types to broad categories
    const caseCategory = ['ltb', 'small_claims'].includes(caseType) ? 'civil' : 
                         ['hrto', 'criminal', 'family'].includes(caseType) ? 'sensitive' : 'general';
    const requestId = crypto.randomUUID();
    console.log('Legal case analysis started', { caseCategory, province, requestId });

    // Step 0: Fetch evidence analysis if caseId provided
    let evidenceContext = null;
    if (caseId) {
      const { data: evidenceAnalysis } = await supabaseClient
        .from('evidence_analysis')
        .select('analysis_data, evidence_count')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (evidenceAnalysis) {
        evidenceContext = {
          count: evidenceAnalysis.evidence_count,
          analysis: evidenceAnalysis.analysis_data
        };
        console.log(`Found evidence analysis with ${evidenceContext.count} pieces`);
      }

      // Also fetch raw evidence descriptions
      const { data: rawEvidence } = await supabaseClient
        .from('evidence')
        .select('file_name, description, file_type, ocr_text')
        .eq('case_id', caseId);
      
      if (rawEvidence?.length) {
        evidenceContext = evidenceContext || { count: rawEvidence.length };
        evidenceContext.rawEvidence = rawEvidence.map((e: any) => ({
          name: e.file_name,
          type: e.file_type,
          description: e.description,
          ocrText: e.ocr_text?.substring(0, 500) // Truncate OCR text
        }));
      }
    }

    // Step 1: Search A2AJ for similar cases
    const a2ajSearchQuery = buildSearchQuery(caseDetails, caseType);
    const a2ajResults = await searchA2AJ(a2ajSearchQuery, caseType);
    
    // Step 2: Search CanLII for similar cases (if API key available)
    let canliiResults = null;
    const CANLII_API_KEY = Deno.env.get('CANLII_API_KEY');
    if (CANLII_API_KEY) {
      canliiResults = await searchCanLII(a2ajSearchQuery, province, CANLII_API_KEY);
    }

    // Step 3: Use AI to analyze all results and generate recommendations
    const aiAnalysis = await analyzeWithAI(
      caseDetails,
      caseType,
      province,
      a2ajResults,
      canliiResults,
      evidenceContext,
      LOVABLE_API_KEY
    );

    console.log('Analysis complete');

    return new Response(
      JSON.stringify({
        success: true,
        analysis: aiAnalysis,
        sources: {
          a2aj: a2ajResults?.results?.length || 0,
          canlii: canliiResults?.results?.length || 0,
          evidence: evidenceContext?.count || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-legal-case-ai:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function buildSearchQuery(caseDetails: any, caseType: string): string {
  // Build a search query based on case details
  const keywords = [];
  
  if (caseDetails.description) {
    keywords.push(caseDetails.description);
  }
  
  // Add case type specific keywords
  switch (caseType) {
    case 'ltb':
      keywords.push('landlord tenant', 'residential tenancies');
      break;
    case 'hrto':
      keywords.push('human rights', 'discrimination');
      break;
    case 'small_claims':
      keywords.push('small claims');
      break;
    case 'criminal':
      keywords.push('criminal');
      break;
    case 'family':
      keywords.push('family law');
      break;
  }
  
  return keywords.join(' AND ');
}

async function searchA2AJ(query: string, caseType: string) {
  try {
    const params = new URLSearchParams({
      query: query,
      search_type: 'full_text',
      doc_type: 'cases',
      size: '20',
      sort_results: 'default'
    });

    // Map case types to relevant courts
    const datasetMap: Record<string, string> = {
      'hrto': 'CHRT',
      'ltb': 'ONCA,FC',
      'small_claims': 'ONCA',
      'criminal': 'SCC,ONCA',
      'family': 'ONCA'
    };

    if (datasetMap[caseType]) {
      params.set('dataset', datasetMap[caseType]);
    }

    const url = `https://api.a2aj.ca/search?${params}`;
    console.log('Searching A2AJ:', url);
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      console.error('A2AJ API error:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('A2AJ search error:', error);
    return null;
  }
}

async function searchCanLII(query: string, province: string, apiKey: string) {
  try {
    // CanLII search - focusing on relevant jurisdictions
    const jurisdiction = province?.toLowerCase() === 'on' ? 'on' : province?.toLowerCase() || 'on';
    
    // Correct CanLII API URL format
    const url = `https://api.canlii.org/v1/caseBrowse/${jurisdiction}/en/?api_key=${apiKey}&resultCount=10&search=${encodeURIComponent(query)}`;
    console.log('Searching CanLII for:', query.substring(0, 50) + '...');
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('CanLII API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    
    // Transform to standard format
    return {
      results: (data.cases || []).map((c: any) => ({
        citation: c.citation || c.databaseId,
        title: c.title,
        date: c.decisionDate,
        court: c.court,
        url: c.url || `https://www.canlii.org/en/${jurisdiction}/${c.databaseId}`
      }))
    };
  } catch (error) {
    console.error('CanLII search error:', error);
    return null;
  }
}

async function analyzeWithAI(
  caseDetails: any,
  caseType: string,
  province: string,
  a2ajResults: any,
  canliiResults: any,
  evidenceContext: any,
  apiKey: string
) {
  const systemPrompt = `You are an expert Canadian legal analyst specializing in ${caseType} cases in ${province}. 
Your role is to analyze case law, evidence, calculate merit scores, and provide actionable legal strategies.

IMPORTANT RULES:
1. Base merit scores on actual case outcomes from the provided data AND the quality of evidence
2. Cite specific cases with citations when making recommendations
3. Provide realistic probability assessments
4. Include both strengths and weaknesses
5. Suggest concrete next steps with timelines
6. Factor in evidence strength when calculating merit score - strong evidence can add 10-20 points, weak/missing evidence can subtract 10-30 points`;

  // Build evidence section for the prompt
  let evidenceSection = 'No evidence uploaded yet.';
  if (evidenceContext) {
    if (evidenceContext.analysis) {
      evidenceSection = `EVIDENCE ANALYSIS (${evidenceContext.count} pieces):
Strengths: ${JSON.stringify(evidenceContext.analysis.strengths || [])}
Weaknesses: ${JSON.stringify(evidenceContext.analysis.weaknesses || [])}
Gaps: ${JSON.stringify(evidenceContext.analysis.gaps || [])}
Summary: ${evidenceContext.analysis.summary || 'N/A'}`;
    }
    if (evidenceContext.rawEvidence) {
      evidenceSection += `\n\nRAW EVIDENCE FILES:\n${evidenceContext.rawEvidence.map((e: any, i: number) => 
        `${i + 1}. ${e.name} (${e.type}): ${e.description || 'No description'}${e.ocrText ? '\n   OCR Preview: ' + e.ocrText.substring(0, 200) + '...' : ''}`
      ).join('\n')}`;
    }
  }

  const userPrompt = `Analyze this case and provide a comprehensive legal assessment:

CASE DETAILS:
${JSON.stringify(caseDetails, null, 2)}

${evidenceSection}

SIMILAR CASES FROM A2AJ:
${a2ajResults ? JSON.stringify(a2ajResults.results?.slice(0, 10), null, 2) : 'No A2AJ results'}

SIMILAR CASES FROM CANLII:
${canliiResults ? JSON.stringify(canliiResults.results?.slice(0, 5), null, 2) : 'No CanLII results'}

INSTRUCTIONS:
1. Calculate merit score factoring in: case law precedents, evidence quality, and legal strength
2. Reference specific CanLII cases where applicable
3. Identify evidence gaps that could weaken the case

Provide your analysis in the following JSON structure:
{
  "meritScore": <number 0-100>,
  "successProbability": "<percentage>",
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "similarCases": [
    {
      "citation": "case citation",
      "outcome": "outcome description",
      "relevance": "why this case matters"
    }
  ],
  "recommendedStrategy": {
    "primaryPath": "main legal route to take",
    "alternativePaths": ["alternative 1", "alternative 2"],
    "keySteps": [
      {
        "step": "action to take",
        "timeline": "when to do it",
        "priority": "high/medium/low"
      }
    ]
  },
  "relevantLaws": [
    {
      "law": "statute or regulation",
      "section": "specific section",
      "relevance": "how it applies"
    }
  ],
  "evidenceNeeded": ["evidence type 1", "evidence type 2", ...],
  "estimatedTimeline": "realistic timeline",
  "estimatedCost": "cost range if applicable",
  "riskFactors": ["risk 1", "risk 2", ...],
  "summary": "2-3 paragraph summary of the analysis"
}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent legal analysis
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr);
    }
    
    throw new Error('Could not parse AI response as JSON');
  } catch (error) {
    console.error('AI analysis error:', error);
    throw error;
  }
}
