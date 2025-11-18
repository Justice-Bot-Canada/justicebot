import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  organization: z.string().trim().min(1).max(200),
  phone: z.string().trim().max(20).optional(),
  inquiryType: z.enum(['media', 'partnership', 'government']),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const turnstileSecret = Deno.env.get('CLOUDFLARE_TURNSTILE_SECRET')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

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

    // Get user from JWT (optional - contact form works for non-authenticated users too)
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }
    
    // Validate input with Zod
    const validationResult = ContactSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input',
          details: validationResult.error.errors.map(e => e.message).join(', ')
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const contactData = validationResult.data;

    // Create support ticket with contact inquiry
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        name: contactData.name,
        email: contactData.email,
        subject: `${contactData.inquiryType.toUpperCase()}: ${contactData.subject}`,
        status: 'open',
        priority: contactData.inquiryType === 'media' ? 'high' : 'medium',
      })
      .select()
      .single();

    if (ticketError) {
      console.error('Error creating ticket:', ticketError);
      return new Response(
        JSON.stringify({ error: 'Failed to create support ticket' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create initial message with contact details
    const messageContent = `
Organization: ${contactData.organization}
${contactData.phone ? `Phone: ${contactData.phone}\n` : ''}
Inquiry Type: ${contactData.inquiryType}

Message:
${contactData.message}
    `.trim();

    const { error: messageError } = await supabase
      .from('support_messages')
      .insert({
        ticket_id: ticket.id,
        sender_type: 'user',
        sender_name: contactData.name,
        message: messageContent,
      });

    if (messageError) {
      console.error('Error creating message:', messageError);
      // Don't fail the request if message creation fails
    }

    console.log('Contact form submitted successfully:', {
      ticketId: ticket.id,
      inquiryType: contactData.inquiryType
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        ticketId: ticket.id,
        message: 'Your inquiry has been submitted successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in submit-contact function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
