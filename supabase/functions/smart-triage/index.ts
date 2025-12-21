import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://justice-bot.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema with size limits
const TriageRequestSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description exceeds maximum length"),
  province: z.string().max(50).optional().default("ON"),
  evidenceDescriptions: z.array(z.string().max(500)).max(20).optional(),
  previousAnswers: z.record(z.string().max(1000)).optional(),
  turnstileToken: z.string().optional()
});

interface FormRecommendation {
  formCode: string;
  formTitle: string;
  confidence: number;
  reason: string;
  tribunalType: string;
  priority: 'primary' | 'secondary' | 'optional';
}

interface TriageResponse {
  venue: string;
  venueTitle: string;
  confidence: number;
  reasoning: string;
  urgentDeadlines: string[];
  recommendedForms: FormRecommendation[];
  nextSteps: string[];
  followUpQuestions?: string[];
  flags: string[];
  alternativeVenues?: { venue: string; reason: string }[];
}

// Comprehensive form catalog for AI reference
const FORM_CATALOG = {
  ltb: {
    venueTitle: "Landlord & Tenant Board",
    forms: [
      { code: "T1", title: "Tenant Application About a Rent Increase Above the Guideline", use: "rent increase above guideline" },
      { code: "T2", title: "Tenant Application About Tenant Rights", use: "harassment, illegal entry, vital services, tenant rights violations" },
      { code: "T6", title: "Tenant Application About Maintenance", use: "repairs, maintenance issues, health and safety" },
      { code: "L1", title: "Application to Evict a Tenant for Non-payment of Rent", use: "landlord evicting for unpaid rent" },
      { code: "L2", title: "Application to End a Tenancy", use: "landlord ending tenancy for other reasons" },
    ]
  },
  hrto: {
    venueTitle: "Human Rights Tribunal of Ontario",
    forms: [
      { code: "Form 1", title: "Human Rights Application", use: "discrimination complaints based on protected grounds" },
      { code: "Schedule A", title: "Details of Application", use: "detailed facts supporting discrimination claim" },
      { code: "Form 2", title: "Response", use: "responding to a human rights application" },
    ]
  },
  "small-claims": {
    venueTitle: "Small Claims Court",
    forms: [
      { code: "Form 7A", title: "Plaintiff's Claim", use: "starting a lawsuit for damages under $35,000" },
      { code: "Form 9A", title: "Defence", use: "defending against a small claims lawsuit" },
      { code: "Form 10A", title: "Defendant's Claim", use: "counterclaim against plaintiff" },
      { code: "Form 11A", title: "Affidavit of Service", use: "proving documents were served" },
    ]
  },
  family: {
    venueTitle: "Family Court",
    forms: [
      { code: "Form 8", title: "Application (General)", use: "general family law matters" },
      { code: "Form 8A", title: "Application (Divorce)", use: "starting a divorce" },
      { code: "Form 8B", title: "Application (Child, Spousal or Family Support)", use: "support claims" },
      { code: "Form 8B.1", title: "Application (Child Protection)", use: "CAS/child protection matters" },
      { code: "Form 10", title: "Answer", use: "responding to family application" },
      { code: "Form 13", title: "Financial Statement (Support Claims)", use: "income under $150k" },
      { code: "Form 13.1", title: "Financial Statement (Property & Support)", use: "property division or income over $150k" },
      { code: "Form 35.1", title: "Affidavit (Decision-Making, Parenting Time)", use: "custody and access affidavit" },
      { code: "Form 36", title: "Affidavit for Divorce", use: "sworn facts for divorce" },
    ]
  },
  criminal: {
    venueTitle: "Criminal Court",
    forms: [
      { code: "Form 5.1", title: "Undertaking Given to Peace Officer", use: "bail undertaking" },
      { code: "Form 11", title: "Recognizance (Officer in Charge)", use: "bail recognizance" },
      { code: "Form 32", title: "Recognizance", use: "general recognizance" },
    ]
  },
  labour: {
    venueTitle: "Ontario Labour Relations Board",
    forms: [
      { code: "Application Form", title: "Application for Certification", use: "union certification" },
      { code: "ULP Complaint", title: "Unfair Labour Practice Complaint", use: "employer violations" },
    ]
  },
  wsib: {
    venueTitle: "Workplace Safety and Insurance Board",
    forms: [
      { code: "Form 6", title: "Worker's Report of Injury", use: "workplace injury claim" },
      { code: "Form 7", title: "Employer's Report of Injury", use: "employer reporting injury" },
    ]
  },
  "superior-court": {
    venueTitle: "Superior Court of Justice",
    forms: [
      { code: "Form 14A", title: "Statement of Claim (General)", use: "civil lawsuit over $35,000" },
      { code: "Form 18A", title: "Statement of Defence", use: "defending civil lawsuit" },
      { code: "Form 37A", title: "Notice of Motion", use: "motions in civil proceedings" },
    ]
  },
  divisional: {
    venueTitle: "Divisional Court",
    forms: [
      { code: "Form 68A", title: "Notice of Application for Judicial Review", use: "appealing tribunal decisions" },
    ]
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    
    // Validate input with Zod schema
    const validationResult = TriageRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('Triage validation error:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input',
          details: validationResult.error.errors.map(e => e.message).join(', ')
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { description, province, evidenceDescriptions, previousAnswers, turnstileToken } = validationResult.data;

    // Verify Turnstile token if secret is configured (bot protection)
    const turnstileSecret = Deno.env.get("CLOUDFLARE_TURNSTILE_SECRET");
    if (turnstileSecret) {
      if (!turnstileToken) {
        return new Response(
          JSON.stringify({ error: "Verification required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const turnstileResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstileToken,
          }),
        }
      );

      const turnstileResult = await turnstileResponse.json();
      
      if (!turnstileResult.success) {
        console.error('Turnstile verification failed:', turnstileResult);
        return new Response(
          JSON.stringify({ error: 'Verification failed' }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log('Turnstile verification successful');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Build context about available forms
    const formContext = Object.entries(FORM_CATALOG)
      .map(([venue, data]) => `${data.venueTitle} (${venue}):\n${data.forms.map(f => `  - ${f.code}: ${f.title} - Use for: ${f.use}`).join('\n')}`)
      .join('\n\n');

    const evidenceContext = evidenceDescriptions?.length 
      ? `\n\nUser has uploaded evidence:\n${evidenceDescriptions.map((e, i) => `${i+1}. ${e}`).join('\n')}`
      : '';

    const systemPrompt = `You are an expert Canadian legal triage assistant specializing in Ontario law. Your role is to analyze a user's legal situation and recommend the most appropriate legal venue and forms.

AVAILABLE LEGAL VENUES AND FORMS:
${formContext}

IMPORTANT GUIDELINES:
1. Always consider limitation periods and filing deadlines
2. Human Rights complaints must be filed within 1 year of the incident
3. LTB applications have specific time limits depending on the issue
4. Small Claims Court is for monetary disputes under $35,000
5. Consider whether the user is a plaintiff/applicant or defendant/respondent
6. Identify if there are multiple legal issues that might require different venues
7. Flag urgent matters (eviction notices, short deadlines, safety concerns)
8. Province: ${province}

RESPONSE FORMAT (JSON):
{
  "venue": "venue_code (e.g., ltb, hrto, small-claims, family, criminal, labour, wsib, superior-court, divisional)",
  "venueTitle": "Full name of venue",
  "confidence": 0-100,
  "reasoning": "Clear explanation of why this venue is appropriate",
  "urgentDeadlines": ["Array of time-sensitive deadlines"],
  "recommendedForms": [
    {
      "formCode": "Form code",
      "formTitle": "Full title",
      "confidence": 0-100,
      "reason": "Why this form is needed",
      "tribunalType": "Tribunal type for database lookup",
      "priority": "primary|secondary|optional"
    }
  ],
  "nextSteps": ["Ordered list of recommended actions"],
  "followUpQuestions": ["Questions to clarify the situation if needed"],
  "flags": ["urgent", "safety", "deadline", "complex", etc.],
  "alternativeVenues": [{"venue": "code", "reason": "why this might also apply"}]
}`;

    const userPrompt = `Analyze this legal situation and recommend the best venue and forms:

USER'S DESCRIPTION:
${description}
${evidenceContext}

${previousAnswers ? `ADDITIONAL CONTEXT FROM USER RESPONSES:\n${JSON.stringify(previousAnswers, null, 2)}` : ''}

Provide your analysis in the specified JSON format. Be thorough but practical. Focus on actionable recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Service temporarily busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON from response (handle markdown code blocks)
    let triageResult: TriageResponse;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      triageResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse triage response");
    }

    // Validate and normalize the response
    triageResult.venue = triageResult.venue || 'small-claims';
    triageResult.confidence = Math.min(100, Math.max(0, triageResult.confidence || 70));
    triageResult.recommendedForms = triageResult.recommendedForms || [];
    triageResult.nextSteps = triageResult.nextSteps || [];
    triageResult.urgentDeadlines = triageResult.urgentDeadlines || [];
    triageResult.flags = triageResult.flags || [];

    return new Response(
      JSON.stringify(triageResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Smart triage error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Triage analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
