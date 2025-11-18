import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const LeadSchema = z.object({
  email: z.string().trim().email().max(255),
  name: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(20).optional(),
  source: z.string().trim().max(50).optional(),
  journey: z.string().trim().max(50).optional(),
  payload: z.record(z.unknown()).optional()
});

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const turnstileSecret = Deno.env.get("CLOUDFLARE_TURNSTILE_SECRET")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const requestBody = await req.json();
    
    // Verify Turnstile token
    if (!requestBody.turnstileToken) {
      console.error('Missing Turnstile token');
      return new Response(
        JSON.stringify({ error: 'Verification required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Skip verification in test mode
    if (requestBody.turnstileToken !== 'test-token') {
      const turnstileResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: requestBody.turnstileToken,
          }),
        }
      );

      const turnstileResult = await turnstileResponse.json();
      
      if (!turnstileResult.success) {
        console.error('Turnstile verification failed:', turnstileResult);
        return new Response(
          JSON.stringify({ error: 'Verification failed' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 403 
          }
        );
      }
    } else {
      console.log('Test mode: Skipping Turnstile verification');
    }
    
    // Validate input with Zod
    const validationResult = LeadSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('Lead validation error:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input',
          details: validationResult.error.errors.map(e => e.message).join(', ')
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const { email, name, phone, source, journey, payload } = validationResult.data;
    console.log('Submitting lead from:', source || 'website');

    // Insert lead into database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        email,
        name,
        phone,
        source: source || 'website',
        journey: journey || 'general',
        payload: payload || {},
      })
      .select()
      .single();

    if (leadError) {
      console.error('Error creating lead:', leadError);
      throw leadError;
    }

    // Queue welcome email
    const { error: emailError } = await supabase
      .from('email_queue')
      .insert({
        email,
        template: 'welcome',
        vars: {
          name: name || 'there',
          journey: journey || 'general',
          lead_id: lead.id,
        },
      });

    if (emailError) {
      console.error('Error queueing welcome email:', emailError);
    }

    // Track analytics event
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'lead_captured',
        event_data: {
          source,
          journey,
          email,
        },
      });

    console.log('Lead submitted successfully:', lead.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        lead_id: lead.id,
        message: 'Lead captured successfully. Check your email!' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Submit lead error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
