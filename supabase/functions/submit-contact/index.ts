import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  name: string;
  email: string;
  organization: string;
  phone?: string;
  inquiryType: 'media' | 'partnership' | 'government';
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get user from JWT (optional - contact form works for non-authenticated users too)
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    const contactData: ContactRequest = await req.json();

    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.organization || 
        !contactData.inquiryType || !contactData.subject || !contactData.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
      inquiryType: contactData.inquiryType,
      email: contactData.email,
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
