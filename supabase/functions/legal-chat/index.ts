import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const allowedOrigins = [
  'https://justice-bot.com',
  'https://www.justice-bot.com',
  'http://localhost:8080',
  'http://localhost:5173'
];

function getCorsHeaders(origin?: string | null) {
  const allowedOrigin = origin && allowedOrigins.includes(origin) 
    ? origin 
    : 'https://justice-bot.com';
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// Input validation schema
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(2000)
  })).min(1).max(50)
});

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate and parse input
    const requestBody = await req.json();
    const validation = ChatRequestSchema.safeParse(requestBody);
    
    if (!validation.success) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request data',
        details: validation.error.issues 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = validation.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

const systemPrompt = `You are Justice-Bot, a knowledgeable legal information assistant specializing in Canadian law, with an Ontario-first default.

## Your Expertise:
- **LTB (Landlord and Tenant Board)**: T2, T6, L1-L9 forms, hearings, remedies, limitation periods
- **HRTO (Human Rights Tribunal of Ontario)**: Form 1, discrimination grounds, remedies, timelines
- **Small Claims Court**: Claims under $35,000, Plaintiff's Claim, Defence, procedures
- **Family Court**: Custody, access, child support, spousal support, divorce
- **Criminal Court (Ontario)**: theft/shoplifting charges, bail/undertakings, disclosure, first appearance, diversion programs, sentencing ranges

## Response Guidelines:
1. **Be specific**: Mention actual form names/numbers, specific deadlines, and concrete steps
2. **Use structure**: Use bullet points and numbered steps for clarity
3. **Include timelines**: Always mention relevant limitation periods and deadlines
4. **Ask 2–4 clarifying questions when needed** (e.g., province, age/youth vs adult, value of items, whether police laid charges, court date)
5. **Be empathetic**: Users are often stressed - acknowledge their situation
6. **Stay accurate**: If unsure, say so rather than guess. Never invent statutes or case names.
7. **Ontario focus**: Default to Ontario procedures unless another province is specified

## Criminal topic guardrails (important):
- Provide **legal information**, not legal advice.
- For shoplifting, explain common charges like **Theft under $5,000** (Criminal Code) and what typically happens next (release/undertaking, first appearance, disclosure, diversion eligibility), but avoid telling the user exactly what to plead.
- If there is an upcoming court date or conditions, advise them to consult duty counsel / a criminal lawyer.

## Important Disclaimers (include when relevant):
- You provide legal information, not legal advice
- You are not a lawyer or law firm
- For complex matters, recommend consulting a lawyer
- For emergencies (violence, immediate eviction), direct to appropriate resources

## Formatting:
- Use **bold** for emphasis on key terms
- Use bullet points (•) for lists
- Keep paragraphs short and scannable
- Include specific next steps when possible`;

    // Filter to only include user messages (not the initial assistant message)
    const userMessages = messages.filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant');
    
    console.log("Calling AI gateway with", userMessages.length, "messages");
    
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
          ...userMessages,
        ],
        stream: true,
      }),
    });

    console.log("AI gateway response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service requires payment. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable", details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Legal chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
