import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { 
      name, 
      email, 
      feedback_type, 
      rating, 
      subject, 
      message, 
      case_id,
      is_public 
    } = await req.json();

    console.log('Processing feedback submission:', { 
      email, 
      feedback_type, 
      subject: subject.substring(0, 50) + '...' 
    });

    // Validate required fields
    if (!name || !email || !feedback_type || !subject || !message) {
      throw new Error('Missing required fields');
    }

    // Get user if authenticated
    let user_id = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: userData } = await supabase.auth.getUser(token);
      user_id = userData.user?.id || null;
    }

    // Insert feedback into database
    const { data: feedback, error: insertError } = await supabase
      .from('user_feedback')
      .insert({
        user_id,
        email: email.trim().toLowerCase(),
        name: name.trim(),
        feedback_type,
        rating: rating || null,
        subject: subject.trim(),
        message: message.trim(),
        case_id: case_id || null,
        is_public: is_public || false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to save feedback: ${insertError.message}`);
    }

    console.log('Feedback saved successfully:', feedback.id);

    // Create audit log entry for payment audits if case_id is provided
    if (case_id && user_id) {
      await supabase
        .from('payment_audit')
        .insert({
          payment_id: `feedback_${feedback.id}`,
          user_id,
          event_type: 'created',
          metadata: {
            feedback_id: feedback.id,
            feedback_type,
            rating
          }
        });
    }

    // Send notification to admin if it's a complaint or bug report
    if (feedback_type === 'complaint' || feedback_type === 'bug_report') {
      console.log(`High priority feedback received: ${feedback_type} - ${subject}`);
      // Could integrate with email service here for admin notifications
    }

    return new Response(JSON.stringify({ 
      success: true,
      feedback_id: feedback.id,
      message: 'Feedback submitted successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in submit-feedback function:', error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});