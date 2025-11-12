import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'deadline';
  actionUrl?: string;
  relatedCaseId?: string;
  relatedEventId?: string;
  sendEmail?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      userId,
      title,
      message,
      type = 'info',
      actionUrl,
      relatedCaseId,
      relatedEventId,
      sendEmail = false,
    }: NotificationRequest = await req.json();

    console.log('Creating notification for user:', userId);

    // Create in-app notification
    const { data: notification, error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        action_url: actionUrl,
        related_case_id: relatedCaseId,
        related_event_id: relatedEventId,
      })
      .select()
      .single();

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      throw notificationError;
    }

    console.log('Notification created successfully:', notification.id);

    // Send email if requested and user has email notifications enabled
    if (sendEmail) {
      // Check user's notification preferences
      const { data: preferences } = await supabaseClient
        .from('notification_preferences')
        .select('email_notifications')
        .eq('user_id', userId)
        .single();

      if (preferences?.email_notifications !== false) {
        // Get user's email
        const { data: { user } } = await supabaseClient.auth.admin.getUserById(userId);
        
        if (user?.email) {
          const emailHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(user.email))
            .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8));
          console.log('Email notification prepared', { emailHash, notificationType: type });
          // TODO: Integrate with Resend for email notifications
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationId: notification.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
