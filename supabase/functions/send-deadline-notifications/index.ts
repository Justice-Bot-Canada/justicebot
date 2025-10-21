import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current date and dates for notifications (1 day, 3 days, 7 days ahead)
    const now = new Date();
    const oneDayAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const threeDaysAhead = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Format dates to match database format
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Get events that need notifications
    const { data: events, error: eventsError } = await supabase
      .from('case_events')
      .select(`
        id,
        title,
        description,
        event_date,
        event_type,
        priority,
        location,
        case_id,
        cases (
          id,
          title,
          user_id,
          profiles (
            email,
            notification_preferences
          )
        )
      `)
      .eq('status', 'upcoming')
      .in('event_date', [
        formatDate(oneDayAhead),
        formatDate(threeDaysAhead),
        formatDate(sevenDaysAhead)
      ]);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      throw eventsError;
    }

    if (!events || events.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No events requiring notifications' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let notificationsSent = 0;
    const notifications = [];

    for (const event of events) {
      const eventDate = new Date(event.event_date);
      const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine notification timing
      let shouldNotify = false;
      if (event.priority === 'high' && [1, 3, 7].includes(daysUntil)) {
        shouldNotify = true;
      } else if (event.priority === 'medium' && [1, 3].includes(daysUntil)) {
        shouldNotify = true;
      } else if (event.priority === 'low' && daysUntil === 1) {
        shouldNotify = true;
      }

      if (!shouldNotify) continue;

      // Check if notification already sent for this timing
      const { data: existingNotif } = await supabase
        .from('notifications')
        .select('id')
        .eq('event_id', event.id)
        .eq('notification_type', `${daysUntil}d_before`)
        .single();

      if (existingNotif) continue; // Already sent

      // Create notification
      const notification = {
        user_id: event.cases.user_id,
        title: `${event.event_type === 'filing_deadline' ? '⚠️ Deadline' : '📅 Event'}: ${event.title}`,
        message: `${event.description || 'Important date'} - ${daysUntil} day${daysUntil > 1 ? 's' : ''} away`,
        type: event.event_type === 'filing_deadline' ? 'deadline' : 'reminder',
        priority: event.priority,
        related_case_id: event.case_id,
        event_id: event.id,
        notification_type: `${daysUntil}d_before`,
        metadata: {
          event_date: event.event_date,
          location: event.location,
          days_until: daysUntil
        }
      };

      const { data: created, error: createError } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (createError) {
        console.error('Error creating notification:', createError);
        continue;
      }

      notifications.push(created);
      notificationsSent++;

      console.log(`Notification created for event ${event.id} (${daysUntil} days before)`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${notificationsSent} notifications`,
        notifications
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in send-deadline-notifications:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
