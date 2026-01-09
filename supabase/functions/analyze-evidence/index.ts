import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { getCorsHeaders } from "../_shared/cors.ts";

interface EvidenceItem {
  id: string;
  file_name: string;
  description?: string;
  file_type: string;
  upload_date: string;
  file_url?: string;
}

interface AnalysisRequest {
  caseId: string;
  caseType?: string;
  caseDescription?: string;
}

serve(async (req) => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { caseId, caseType, caseDescription }: AnalysisRequest = await req.json();

    console.log('Analyzing evidence for case:', caseId);

    // Fetch all evidence for this case
    const { data: evidence, error: evidenceError } = await supabaseClient
      .from('evidence')
      .select('*')
      .eq('case_id', caseId)
      .order('upload_date', { ascending: true });

    if (evidenceError) throw evidenceError;

    if (!evidence || evidence.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          analysis: {
            summary: "No evidence uploaded yet. Start by uploading documents to build your case.",
            strengths: [],
            weaknesses: ["No evidence available"],
            gaps: ["All evidence types needed"],
            recommendations: ["Upload relevant documents, photos, emails, or records"],
            exhibits: []
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build evidence inventory for AI analysis
    const evidenceInventory = evidence.map((item: EvidenceItem) => ({
      fileName: item.file_name,
      type: item.file_type,
      description: item.description || 'No description',
      uploadedAt: item.upload_date
    }));

    const systemPrompt = `You are a legal evidence analyst specializing in Canadian law. Analyze uploaded evidence to identify strengths, weaknesses, gaps, and provide strategic recommendations.

ANALYSIS FRAMEWORK:
1. Document completeness and authenticity
2. Timeline consistency
3. Corroboration between pieces of evidence
4. Credibility indicators
5. Missing critical evidence
6. Strategic value for case success

OUTPUT FORMAT: JSON with these exact keys:
{
  "summary": "2-3 sentence overview of evidence quality",
  "strengths": ["specific strong points with evidence names"],
  "weaknesses": ["specific vulnerabilities or contradictions"],
  "gaps": ["critical missing evidence that should be obtained"],
  "contradictions": ["any inconsistencies between evidence pieces"],
  "timeline_issues": ["date/sequence problems if any"],
  "recommendations": ["actionable steps to strengthen case"],
  "exhibits": [
    {
      "fileName": "document.pdf",
      "exhibitLetter": "A",
      "description": "Brief description of what this proves",
      "importance": "critical|important|supporting"
    }
  ]
}`;

    const userPrompt = `Analyze this evidence for a ${caseType || 'legal'} case:

CASE CONTEXT:
${caseDescription || 'No case description provided'}

UPLOADED EVIDENCE (${evidence.length} items):
${evidenceInventory.map((e, i) => `${i + 1}. ${e.fileName} (${e.type})
   Description: ${e.description}
   Uploaded: ${new Date(e.uploadedAt).toLocaleDateString()}`).join('\n\n')}

Provide a strategic evidence analysis identifying strengths, weaknesses, gaps, and recommendations. Organize evidence into a suggested exhibit list with priority ordering.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI service payment required. Please contact support.');
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    let analysisText = data.choices[0].message.content;

    // Extract JSON from markdown code blocks if present
    if (analysisText.includes('```json')) {
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        analysisText = jsonMatch[1];
      }
    } else if (analysisText.includes('```')) {
      const jsonMatch = analysisText.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        analysisText = jsonMatch[1];
      }
    }

    const analysis = JSON.parse(analysisText);

    // Store analysis result
    const { error: insertError } = await supabaseClient
      .from('evidence_analysis')
      .insert({
        case_id: caseId,
        user_id: user.id,
        analysis_data: analysis,
        evidence_count: evidence.length,
      });

    if (insertError) {
      console.error('Error storing analysis:', insertError);
    }

    console.log('Evidence analysis complete');

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        evidenceCount: evidence.length,
        analyzedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error analyzing evidence:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
