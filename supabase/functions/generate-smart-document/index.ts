import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { logAuditEvent, createAuditClient } from "../_shared/auditLog.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentRequest {
  documentType: 'demand_letter' | 'affidavit' | 'witness_statement' | 'settlement_offer';
  tone: 'formal' | 'assertive' | 'conciliatory';
  caseContext: {
    caseType?: string;
    province?: string;
    parties?: {
      applicant?: string;
      respondent?: string;
    };
    facts?: string;
    issues?: string;
    evidence?: string[];
    desiredOutcome?: string;
  };
}

serve(async (req) => {
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

    const { documentType, tone, caseContext }: DocumentRequest = await req.json();

    console.log('Generating document:', { documentType, tone, userId: user.id });

    // Get user profile for additional context
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build tone-specific instructions
    const toneInstructions = {
      formal: 'Use formal, professional legal language. Be respectful and diplomatic. Maintain a neutral, objective tone throughout.',
      assertive: 'Use confident, direct language that firmly states your position. Be clear about rights and expectations while remaining professional.',
      conciliatory: 'Use collaborative, solution-focused language. Emphasize mutual benefit and willingness to negotiate. Maintain a constructive tone.'
    };

    // Build document templates
    const documentTemplates = {
      demand_letter: `Create a professional demand letter with the following sections:
1. Header (Date, Parties, RE: line)
2. Opening paragraph stating the purpose
3. Background/Facts section
4. Legal basis for the claim
5. Specific demands and timeline
6. Consequences if demands not met
7. Professional closing`,
      
      affidavit: `Create a sworn affidavit with the following structure:
1. Title (e.g., "Affidavit of [Name]")
2. Sworn statement introduction
3. Personal background of affiant
4. Numbered paragraphs with facts
5. Statement of truth
6. Signature line and date
7. Commissioner for taking affidavits section`,
      
      witness_statement: `Create a witness statement with:
1. Header identifying the proceeding
2. Witness identification
3. Statement of knowledge
4. Chronological account of relevant events
5. Specific observations and facts
6. Statement of truth
7. Signature and date`,
      
      settlement_offer: `Create a settlement offer with:
1. Opening paragraph
2. Summary of dispute
3. Settlement terms offered
4. Payment/performance timeline
5. Mutual release language
6. Acceptance deadline
7. Professional closing`
    };

    const systemPrompt = `You are a legal document drafting AI assistant for Justice-Bot, specializing in Canadian legal documents.

TONE: ${toneInstructions[tone]}

DOCUMENT TYPE: ${documentType.replace('_', ' ').toUpperCase()}

TEMPLATE: ${documentTemplates[documentType]}

GUIDELINES:
- Use Canadian legal terminology and spelling
- Follow ${caseContext.province || 'Ontario'} jurisdiction conventions
- Include all required legal elements
- Format professionally with proper spacing
- Use clear, precise language
- Avoid legalese when simpler terms suffice
- Include [PLACEHOLDER] tags for information that needs to be filled in
- Add helpful [NOTE: ...] comments for the user where appropriate`;

    const userPrompt = `Generate a ${documentType.replace('_', ' ')} with a ${tone} tone using this case information:

Case Type: ${caseContext.caseType || 'Not specified'}
Province: ${caseContext.province || 'Ontario'}
Applicant: ${caseContext.parties?.applicant || '[YOUR NAME]'}
Respondent: ${caseContext.parties?.respondent || '[RESPONDENT NAME]'}

FACTS:
${caseContext.facts || 'Not provided'}

KEY ISSUES:
${caseContext.issues || 'Not provided'}

EVIDENCE AVAILABLE:
${caseContext.evidence?.join('\n- ') || 'Not provided'}

DESIRED OUTCOME:
${caseContext.desiredOutcome || 'Not provided'}

Generate a complete, professional document ready for review and customization.`;

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
        temperature: 0.7,
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
    const generatedDocument = data.choices[0].message.content;

    console.log('Document generated successfully');

    // SOC2 Audit Log: Smart document generation success
    const auditClient = createAuditClient();
    await logAuditEvent(auditClient, {
      action: 'document.generated',
      resource_type: 'document',
      resource_id: null,
      user_id: user.id,
      metadata: {
        document_type: documentType,
        tone,
        case_type: caseContext.caseType,
        province: caseContext.province,
      }
    }, req);

    return new Response(
      JSON.stringify({
        success: true,
        document: generatedDocument,
        metadata: {
          documentType,
          tone,
          generatedAt: new Date().toISOString(),
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: unknown) {
    console.error('Error generating document:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
