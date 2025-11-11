import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { topic, location, formType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating SEO page for:", { topic, location, formType });

    // Generate unique slug
    const slug = `${topic}-${location}-${formType}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const prompt = `Create comprehensive, SEO-optimized content for this legal help page:

Topic: ${topic}
Location: ${location}, Ontario
Form/Process: ${formType}

Generate:
1. SEO Title (under 60 chars, include location and topic)
2. Meta Description (under 160 chars, actionable and specific)
3. H1 Headline (include main keyword naturally)
4. Comprehensive article content (1000-1500 words) covering:
   - What this legal issue is
   - Who can file in ${location}
   - Step-by-step process
   - Forms needed
   - Deadlines and timelines
   - Common mistakes to avoid
   - How Justice-Bot can help
5. FAQ section (5-7 questions)
6. Call-to-action

Format as JSON:
{
  "title": "",
  "meta_description": "",
  "h1": "",
  "content": "",
  "faq": [{"question": "", "answer": ""}],
  "cta": ""
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    // Store in database
    const { data: page, error } = await supabase
      .from('seo_pages')
      .insert({
        slug,
        title: content.title,
        meta_description: content.meta_description,
        h1: content.h1,
        content: content.content,
        faq: content.faq,
        cta: content.cta,
        topic,
        location,
        form_type: formType,
        published: true
      })
      .select()
      .single();

    if (error) throw error;

    console.log("SEO page created:", slug);

    return new Response(JSON.stringify({ success: true, page, slug }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating SEO page:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
