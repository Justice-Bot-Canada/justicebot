import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const FeedbackSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  feedback_type: z.enum(['bug_report', 'feature_request', 'complaint', 'general', 'praise']),
  rating: z.number().int().min(1).max(5).optional(),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  case_id: z.string().uuid().optional(),
  is_public: z.boolean().optional().default(false),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const requestBody = await req.json();
    
    // Validate input with Zod
    const validationResult = FeedbackSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.errors);
      return new Response(JSON.stringify({ 
        error: 'Invalid input',
        details: validationResult.error.errors.map(e => e.message).join(', '),
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { 
      name, 
      email, 
      feedback_type, 
      rating, 
      subject, 
      message, 
      case_id,
      is_public 
    } = validationResult.data;

    console.log('Processing feedback submission:', { 
      feedback_type, 
      subject_length: subject.length
    });

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
        email: email.toLowerCase(),
        name,
        feedback_type,
        rating: rating || null,
        subject,
        message,
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