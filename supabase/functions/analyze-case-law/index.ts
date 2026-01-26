import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
const RequestSchema = z.object({
  caseId: z.string().uuid(),
  forceRefresh: z.boolean().optional().default(false),
});

interface SimilarCase {
  title: string;
  citation: string;
  court: string;
  date: string;
  url: string;
  summary?: string;
  relevance: number;
}

interface AnalysisResult {
  meritScore: number;
  confidence: number;
  outcomePrediction: 'favorable' | 'unfavorable' | 'uncertain';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  legalBasis: string;
  similarCases: SimilarCase[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await req.json();
    const validation = RequestSchema.safeParse(requestBody);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: validation.error.issues }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { caseId, forceRefresh } = validation.data;
    const CANLII_API_KEY = Deno.env.get('CANLII_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract user ID from JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for existing recent analysis (unless force refresh)
    if (!forceRefresh) {
      const { data: existingAnalysis } = await supabase
        .from('case_law_analyses')
        .select(`
          *,
          similar_cases (*)
        `)
        .eq('case_id', caseId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingAnalysis) {
        // Return cached analysis if less than 24 hours old
        const analysisAge = Date.now() - new Date(existingAnalysis.created_at).getTime();
        if (analysisAge < 24 * 60 * 60 * 1000) {
          console.log('Returning cached analysis');
          return new Response(
            JSON.stringify({
              success: true,
              analysis: {
                meritScore: existingAnalysis.merit_score,
                confidence: existingAnalysis.confidence,
                outcomePrediction: existingAnalysis.outcome_prediction,
                strengths: existingAnalysis.strengths || [],
                weaknesses: existingAnalysis.weaknesses || [],
                recommendations: existingAnalysis.recommendations || [],
                legalBasis: existingAnalysis.legal_basis,
                similarCases: existingAnalysis.similar_cases?.map((sc: any) => ({
                  title: sc.title,
                  citation: sc.citation,
                  court: sc.court,
                  date: sc.decision_date,
                  url: sc.url,
                  summary: sc.summary,
                  relevance: sc.relevance_score,
                })) || [],
              },
              cached: true,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Check if CanLII API is configured
    if (!CANLII_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'CanLII API not configured',
          fallback: true,
          message: 'CanLII case law analysis is not available. Please contact support to enable this feature.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch case details
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError || !caseData) {
      return new Response(
        JSON.stringify({ error: 'Case not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch evidence for context
    const { data: evidence } = await supabase
      .from('evidence')
      .select('file_name, description, tags, ocr_text')
      .eq('case_id', caseId);

    // Build search query
    const searchQuery = buildSearchQuery(caseData, evidence || []);
    const jurisdictionCode = getJurisdictionCode(caseData.province);

    console.log('Searching CanLII:', { query: searchQuery.substring(0, 50), jurisdiction: jurisdictionCode });

    // Search CanLII
    const canliiResults = await searchCanLII(searchQuery, jurisdictionCode, CANLII_API_KEY);
    console.log(`Found ${canliiResults.length} CanLII cases`);

    // Use AI to analyze results (if API key available)
    let analysis: AnalysisResult;
    
    if (LOVABLE_API_KEY && canliiResults.length > 0) {
      analysis = await analyzeWithAI(caseData, evidence || [], canliiResults, LOVABLE_API_KEY);
    } else {
      // Fallback to deterministic scoring
      analysis = calculateDeterministicScore(caseData, evidence || [], canliiResults);
    }

    // Save analysis to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('case_law_analyses')
      .insert({
        case_id: caseId,
        user_id: user.id,
        merit_score: analysis.meritScore,
        confidence: analysis.confidence,
        outcome_prediction: analysis.outcomePrediction,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendations: analysis.recommendations,
        legal_basis: analysis.legalBasis,
        search_query: searchQuery,
        jurisdiction: jurisdictionCode,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving analysis:', saveError);
    }

    // Save similar cases
    if (savedAnalysis && analysis.similarCases.length > 0) {
      const similarCasesData = analysis.similarCases.slice(0, 5).map(sc => ({
        analysis_id: savedAnalysis.id,
        title: sc.title,
        citation: sc.citation,
        court: sc.court,
        decision_date: sc.date,
        url: sc.url,
        summary: sc.summary || '',
        relevance_score: sc.relevance,
      }));

      await supabase.from('similar_cases').insert(similarCasesData);
    }

    // Update case merit_score
    await supabase
      .from('cases')
      .update({ merit_score: analysis.meritScore })
      .eq('id', caseId);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        cached: false,
        canliiCasesFound: canliiResults.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-case-law:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Build search query from case data and evidence
function buildSearchQuery(caseData: any, evidence: any[]): string {
  const parts: string[] = [];

  // Add venue-specific keywords
  const venueKeywords: Record<string, string> = {
    'LTB': 'landlord tenant residential tenancy eviction maintenance',
    'HRTO': 'human rights discrimination employment harassment',
    'SMALL_CLAIMS': 'small claims damages contract breach',
    'FAMILY': 'family custody support divorce separation',
    'CRIMINAL': 'criminal offence charge',
    'LABOUR': 'employment termination wrongful dismissal',
  };
  
  if (caseData.venue && venueKeywords[caseData.venue]) {
    parts.push(venueKeywords[caseData.venue]);
  }

  // Add case description keywords
  if (caseData.description) {
    const keywords = caseData.description
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w: string) => w.length > 4)
      .slice(0, 10);
    parts.push(keywords.join(' '));
  }

  // Add evidence-derived keywords
  evidence.forEach(e => {
    if (e.tags && e.tags.length > 0) {
      parts.push(e.tags.slice(0, 3).join(' '));
    }
  });

  return parts.join(' ').substring(0, 200);
}

// Get CanLII jurisdiction code
function getJurisdictionCode(province: string): string {
  const codes: Record<string, string> = {
    'ON': 'on', 'BC': 'bc', 'AB': 'ab', 'QC': 'qc',
    'MB': 'mb', 'SK': 'sk', 'NS': 'ns', 'NB': 'nb',
    'NL': 'nl', 'PE': 'pe', 'NT': 'nt', 'NU': 'nu', 'YT': 'yt',
  };
  return codes[province?.toUpperCase()] || 'on';
}

// Search CanLII API
async function searchCanLII(query: string, jurisdiction: string, apiKey: string): Promise<SimilarCase[]> {
  try {
    const url = `https://api.canlii.org/v1/caseBrowse/${jurisdiction}/en/?api_key=${apiKey}&resultCount=10&search=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('CanLII API error:', response.status);
      return [];
    }

    const data = await response.json();
    return (data.cases || []).map((c: any, index: number) => ({
      title: c.title || 'Untitled Case',
      citation: c.citation || c.databaseId || 'N/A',
      court: c.court || 'Unknown Court',
      date: c.decisionDate || 'Unknown',
      url: c.url || `https://www.canlii.org/en/${jurisdiction}/${c.databaseId}`,
      summary: c.summary || '',
      relevance: 100 - (index * 5), // Decreasing relevance by position
    }));
  } catch (error) {
    console.error('CanLII search error:', error);
    return [];
  }
}

// AI-powered analysis
async function analyzeWithAI(
  caseData: any,
  evidence: any[],
  similarCases: SimilarCase[],
  apiKey: string
): Promise<AnalysisResult> {
  const systemPrompt = `You are a legal case analyst specializing in Canadian law. Analyze the case and similar precedents to provide:
1. Merit score (0-100) based on legal strength
2. Confidence level (0-1) in your assessment
3. Outcome prediction (favorable/unfavorable/uncertain)
4. Key strengths and weaknesses
5. Actionable recommendations

Base analysis on:
- Quality and relevance of evidence
- Applicable case law precedents
- Legal elements required for the claim type
- Jurisdiction-specific considerations

IMPORTANT: This is educational analysis, not legal advice.`;

  const prompt = `Analyze this case:

CASE TYPE: ${caseData.venue || 'General'}
PROVINCE: ${caseData.province || 'ON'}
DESCRIPTION: ${caseData.description || 'No description provided'}

EVIDENCE (${evidence.length} items):
${evidence.map((e, i) => `${i + 1}. ${e.file_name}${e.description ? ': ' + e.description : ''}`).join('\n')}

SIMILAR CANLII CASES:
${similarCases.slice(0, 5).map((c, i) => `${i + 1}. ${c.title} (${c.citation}) - ${c.court}`).join('\n')}

Provide structured JSON analysis.`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
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
            name: "provide_analysis",
            description: "Provide case law analysis results",
            parameters: {
              type: "object",
              properties: {
                meritScore: { type: "number", minimum: 0, maximum: 100 },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                outcomePrediction: { type: "string", enum: ["favorable", "unfavorable", "uncertain"] },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                legalBasis: { type: "string" }
              },
              required: ["meritScore", "confidence", "outcomePrediction", "strengths", "weaknesses", "recommendations", "legalBasis"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "provide_analysis" } }
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status);
      return calculateDeterministicScore(caseData, evidence, similarCases);
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    const aiResult = JSON.parse(toolCall.function.arguments);

    return {
      ...aiResult,
      similarCases,
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return calculateDeterministicScore(caseData, evidence, similarCases);
  }
}

// Fallback deterministic scoring
function calculateDeterministicScore(
  caseData: any,
  evidence: any[],
  similarCases: SimilarCase[]
): AnalysisResult {
  let score = 40; // Base score

  // Evidence boost (+5 per piece, max 25)
  score += Math.min(evidence.length * 5, 25);

  // Similar cases boost (+3 per case, max 15)
  score += Math.min(similarCases.length * 3, 15);

  // Description quality boost
  if (caseData.description && caseData.description.length > 200) {
    score += 10;
  }

  // Venue-specific adjustments
  if (caseData.venue === 'LTB' || caseData.venue === 'SMALL_CLAIMS') {
    score += 5; // Generally more accessible venues
  }

  score = Math.min(score, 95); // Cap at 95

  const confidence = evidence.length >= 3 ? 0.75 : 0.5;
  const outcomePrediction = score >= 65 ? 'favorable' : score >= 45 ? 'uncertain' : 'unfavorable';

  return {
    meritScore: score,
    confidence,
    outcomePrediction: outcomePrediction as any,
    strengths: evidence.length > 0 
      ? [`${evidence.length} pieces of supporting evidence uploaded`]
      : ['Case details provided'],
    weaknesses: evidence.length < 3 
      ? ['Limited documentary evidence']
      : [],
    recommendations: [
      'Review similar cases for applicable precedents',
      'Ensure all relevant documentation is uploaded',
      'Consider timeline requirements for your jurisdiction',
    ],
    legalBasis: `Analysis based on ${similarCases.length} similar cases from CanLII database.`,
    similarCases,
  };
}
