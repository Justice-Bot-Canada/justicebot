import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Agent types for the multi-agent system
type AgentRole = 'researcher' | 'analyst' | 'strategist' | 'drafter';

interface AgentResult {
  agent: AgentRole;
  output: any;
  duration: number;
  tokens?: number;
}

interface OrchestratorResult {
  success: boolean;
  caseId: string;
  agents: AgentResult[];
  finalAnalysis: any;
  totalDuration: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
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

    const { caseId, caseDetails, caseType, province, agents: requestedAgents } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const runId = crypto.randomUUID();
    console.log(`[${runId}] Multi-agent analysis started for case type: ${caseType}`);

    // Determine which agents to run (default: all)
    const agentsToRun: AgentRole[] = requestedAgents || ['researcher', 'analyst', 'strategist', 'drafter'];
    const agentResults: AgentResult[] = [];

    // Fetch existing case data and evidence
    const caseContext = await gatherCaseContext(supabaseClient, caseId, caseDetails);

    // AGENT 1: Research Agent - Searches for relevant cases and laws
    if (agentsToRun.includes('researcher')) {
      const researchStart = Date.now();
      console.log(`[${runId}] Starting Research Agent...`);
      
      const researchResult = await runResearchAgent(
        caseContext,
        caseType,
        province,
        LOVABLE_API_KEY
      );
      
      agentResults.push({
        agent: 'researcher',
        output: researchResult,
        duration: Date.now() - researchStart
      });
      console.log(`[${runId}] Research Agent completed in ${Date.now() - researchStart}ms`);
    }

    // AGENT 2: Analyst Agent - Analyzes case strength and evidence
    if (agentsToRun.includes('analyst')) {
      const analystStart = Date.now();
      console.log(`[${runId}] Starting Analyst Agent...`);
      
      const researchOutput = agentResults.find(r => r.agent === 'researcher')?.output;
      const analysisResult = await runAnalystAgent(
        caseContext,
        researchOutput,
        caseType,
        province,
        LOVABLE_API_KEY
      );
      
      agentResults.push({
        agent: 'analyst',
        output: analysisResult,
        duration: Date.now() - analystStart
      });
      console.log(`[${runId}] Analyst Agent completed in ${Date.now() - analystStart}ms`);
    }

    // AGENT 3: Strategist Agent - Develops legal strategy
    if (agentsToRun.includes('strategist')) {
      const strategistStart = Date.now();
      console.log(`[${runId}] Starting Strategist Agent...`);
      
      const researchOutput = agentResults.find(r => r.agent === 'researcher')?.output;
      const analysisOutput = agentResults.find(r => r.agent === 'analyst')?.output;
      
      const strategyResult = await runStrategistAgent(
        caseContext,
        researchOutput,
        analysisOutput,
        caseType,
        province,
        LOVABLE_API_KEY
      );
      
      agentResults.push({
        agent: 'strategist',
        output: strategyResult,
        duration: Date.now() - strategistStart
      });
      console.log(`[${runId}] Strategist Agent completed in ${Date.now() - strategistStart}ms`);
    }

    // AGENT 4: Drafter Agent - Drafts initial legal documents
    if (agentsToRun.includes('drafter')) {
      const drafterStart = Date.now();
      console.log(`[${runId}] Starting Drafter Agent...`);
      
      const strategyOutput = agentResults.find(r => r.agent === 'strategist')?.output;
      
      const draftResult = await runDrafterAgent(
        caseContext,
        strategyOutput,
        caseType,
        province,
        LOVABLE_API_KEY
      );
      
      agentResults.push({
        agent: 'drafter',
        output: draftResult,
        duration: Date.now() - drafterStart
      });
      console.log(`[${runId}] Drafter Agent completed in ${Date.now() - drafterStart}ms`);
    }

    // Synthesize final analysis from all agents
    const finalAnalysis = synthesizeResults(agentResults);
    const totalDuration = Date.now() - startTime;

    // Store results in database
    if (caseId) {
      await supabaseClient.from('legal_pathways').insert({
        case_id: caseId,
        pathway_type: 'multi_agent_analysis',
        recommendation: finalAnalysis.summary,
        confidence_score: finalAnalysis.meritScore / 100,
        next_steps: finalAnalysis.nextSteps,
        relevant_laws: finalAnalysis.relevantLaws
      });
    }

    console.log(`[${runId}] Multi-agent analysis completed in ${totalDuration}ms`);

    const result: OrchestratorResult = {
      success: true,
      caseId: caseId || 'no-case',
      agents: agentResults,
      finalAnalysis,
      totalDuration
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Multi-agent analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function gatherCaseContext(supabase: any, caseId: string | null, caseDetails: any) {
  const context: any = { details: caseDetails, evidence: [], existingAnalysis: null };
  
  if (!caseId) return context;

  // Fetch evidence
  const { data: evidence } = await supabase
    .from('evidence')
    .select('file_name, description, file_type, ocr_text, tags')
    .eq('case_id', caseId);
  
  if (evidence) {
    context.evidence = evidence.map((e: any) => ({
      name: e.file_name,
      type: e.file_type,
      description: e.description,
      tags: e.tags,
      ocrPreview: e.ocr_text?.substring(0, 300)
    }));
  }

  // Fetch existing analysis
  const { data: existingAnalysis } = await supabase
    .from('evidence_analysis')
    .select('analysis_data')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (existingAnalysis) {
    context.existingAnalysis = existingAnalysis.analysis_data;
  }

  return context;
}

async function callAI(systemPrompt: string, userPrompt: string, apiKey: string): Promise<any> {
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
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Extract JSON from response
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const jsonStr = jsonMatch[1] || jsonMatch[0];
    return JSON.parse(jsonStr);
  }
  
  return { rawResponse: content };
}

async function runResearchAgent(context: any, caseType: string, province: string, apiKey: string) {
  const systemPrompt = `You are a legal research specialist for Canadian ${caseType} cases in ${province}. 
Your role is to identify:
1. Relevant statutes and regulations
2. Key legal precedents
3. Similar case outcomes
4. Important deadlines and procedures

Always cite specific legislation and case law. Be thorough but focused.`;

  const userPrompt = `Research relevant legal resources for this case:

CASE DETAILS:
${JSON.stringify(context.details, null, 2)}

EVIDENCE AVAILABLE:
${context.evidence?.length ? context.evidence.map((e: any) => `- ${e.name}: ${e.description || 'No description'}`).join('\n') : 'No evidence uploaded'}

Return your research in this JSON format:
{
  "relevantStatutes": [
    { "name": "statute name", "sections": ["relevant sections"], "application": "how it applies" }
  ],
  "keyPrecedents": [
    { "citation": "case citation", "court": "court name", "outcome": "outcome", "relevance": "why relevant" }
  ],
  "proceduralRequirements": [
    { "step": "requirement", "deadline": "timeline if any", "source": "authority" }
  ],
  "keyIssues": ["issue 1", "issue 2"],
  "researchSummary": "brief summary of findings"
}`;

  return await callAI(systemPrompt, userPrompt, apiKey);
}

async function runAnalystAgent(context: any, researchOutput: any, caseType: string, province: string, apiKey: string) {
  const systemPrompt = `You are a legal case analyst specializing in ${caseType} cases in ${province}.
Your role is to:
1. Assess case strength objectively
2. Evaluate evidence quality and gaps
3. Identify strengths and weaknesses
4. Calculate merit scores based on precedents

Be honest and realistic in your assessments.`;

  const userPrompt = `Analyze this case based on the research provided:

CASE DETAILS:
${JSON.stringify(context.details, null, 2)}

RESEARCH FINDINGS:
${JSON.stringify(researchOutput, null, 2)}

EVIDENCE:
${context.evidence?.length ? JSON.stringify(context.evidence, null, 2) : 'No evidence uploaded'}

EXISTING ANALYSIS (if any):
${context.existingAnalysis ? JSON.stringify(context.existingAnalysis, null, 2) : 'None'}

Return your analysis in this JSON format:
{
  "meritScore": <0-100>,
  "confidence": "<high/medium/low>",
  "successProbability": "<percentage>",
  "strengths": [
    { "factor": "strength description", "impact": "high/medium/low", "evidence": "supporting evidence" }
  ],
  "weaknesses": [
    { "factor": "weakness description", "impact": "high/medium/low", "mitigation": "how to address" }
  ],
  "evidenceAssessment": {
    "quality": "<strong/adequate/weak/missing>",
    "gaps": ["gap 1", "gap 2"],
    "recommendations": ["what evidence to gather"]
  },
  "riskFactors": [
    { "risk": "risk description", "likelihood": "high/medium/low", "impact": "description" }
  ],
  "analysisSummary": "comprehensive summary"
}`;

  return await callAI(systemPrompt, userPrompt, apiKey);
}

async function runStrategistAgent(context: any, researchOutput: any, analysisOutput: any, caseType: string, province: string, apiKey: string) {
  const systemPrompt = `You are a legal strategist for ${caseType} cases in ${province}.
Your role is to:
1. Develop winning legal strategies
2. Recommend the best pathway forward
3. Provide tactical advice
4. Suggest negotiation approaches

Focus on practical, actionable strategies.`;

  const userPrompt = `Develop a legal strategy based on this analysis:

CASE DETAILS:
${JSON.stringify(context.details, null, 2)}

RESEARCH:
${JSON.stringify(researchOutput, null, 2)}

ANALYSIS:
${JSON.stringify(analysisOutput, null, 2)}

Return your strategy in this JSON format:
{
  "primaryStrategy": {
    "approach": "main strategy description",
    "rationale": "why this approach",
    "timeline": "expected timeline",
    "estimatedCost": "cost range"
  },
  "alternativeStrategies": [
    { "approach": "alternative", "pros": ["pro1"], "cons": ["con1"], "when": "when to use" }
  ],
  "actionPlan": [
    { "step": 1, "action": "what to do", "deadline": "when", "priority": "high/medium/low", "resources": "what's needed" }
  ],
  "negotiationStrategy": {
    "leverage": ["leverage points"],
    "targets": "realistic settlement targets",
    "walkAwayPoint": "when to litigate instead"
  },
  "contingencyPlans": [
    { "scenario": "if this happens", "response": "do this" }
  ],
  "strategySummary": "executive summary of strategy"
}`;

  return await callAI(systemPrompt, userPrompt, apiKey);
}

async function runDrafterAgent(context: any, strategyOutput: any, caseType: string, province: string, apiKey: string) {
  const systemPrompt = `You are a legal document drafter for ${caseType} cases in ${province}.
Your role is to:
1. Identify required forms and documents
2. Draft initial document outlines
3. Provide filing instructions
4. Suggest key arguments to include

Focus on practical document preparation guidance.`;

  const userPrompt = `Provide document preparation guidance based on this strategy:

CASE DETAILS:
${JSON.stringify(context.details, null, 2)}

STRATEGY:
${JSON.stringify(strategyOutput, null, 2)}

Return your guidance in this JSON format:
{
  "requiredDocuments": [
    { 
      "name": "document name", 
      "form": "form number if applicable",
      "deadline": "filing deadline",
      "priority": "high/medium/low",
      "description": "what this document is for"
    }
  ],
  "documentOutlines": [
    {
      "document": "document name",
      "sections": [
        { "heading": "section heading", "content": "what to include", "tips": "drafting tips" }
      ]
    }
  ],
  "keyArguments": [
    { "argument": "legal argument", "support": "how to support it", "anticipatedResponse": "what other side might say" }
  ],
  "filingInstructions": {
    "where": "where to file",
    "how": "filing method",
    "fees": "filing fees",
    "copies": "number of copies needed"
  },
  "draftingSummary": "summary of document preparation needs"
}`;

  return await callAI(systemPrompt, userPrompt, apiKey);
}

function synthesizeResults(agentResults: AgentResult[]): any {
  const research = agentResults.find(r => r.agent === 'researcher')?.output || {};
  const analysis = agentResults.find(r => r.agent === 'analyst')?.output || {};
  const strategy = agentResults.find(r => r.agent === 'strategist')?.output || {};
  const drafting = agentResults.find(r => r.agent === 'drafter')?.output || {};

  return {
    meritScore: analysis.meritScore || 50,
    successProbability: analysis.successProbability || 'Unknown',
    confidence: analysis.confidence || 'medium',
    
    // Research findings
    relevantLaws: research.relevantStatutes || [],
    precedents: research.keyPrecedents || [],
    keyIssues: research.keyIssues || [],
    
    // Analysis results
    strengths: analysis.strengths || [],
    weaknesses: analysis.weaknesses || [],
    evidenceGaps: analysis.evidenceAssessment?.gaps || [],
    riskFactors: analysis.riskFactors || [],
    
    // Strategy recommendations
    primaryStrategy: strategy.primaryStrategy || null,
    actionPlan: strategy.actionPlan || [],
    negotiationStrategy: strategy.negotiationStrategy || null,
    
    // Document preparation
    requiredDocuments: drafting.requiredDocuments || [],
    keyArguments: drafting.keyArguments || [],
    filingInstructions: drafting.filingInstructions || null,
    
    // Summaries
    summary: [
      research.researchSummary,
      analysis.analysisSummary,
      strategy.strategySummary,
      drafting.draftingSummary
    ].filter(Boolean).join('\n\n'),
    
    nextSteps: strategy.actionPlan?.slice(0, 5) || []
  };
}
