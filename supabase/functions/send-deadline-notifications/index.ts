import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CaseRecord {
  id?: string;
  title?: string;
  user_id?: string;
  profiles?: { email?: string; notification_preferences?: unknown }[];
}

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

    let notificationsSent = 0;

    // ========== Process case_deadlines table ==========
    const { data: deadlines, error: deadlinesError } = await supabase
      .from('case_deadlines')
      .select(`
        id,
        title,
        description,
        due_date,
        priority,
        user_id,
        case_id,
        reminder_sent
      `)
      .eq('completed', false)
      .eq('reminder_sent', false)
      .lte('due_date', sevenDaysAhead.toISOString())
      .gte('due_date', now.toISOString());

    if (!deadlinesError && deadlines && deadlines.length > 0) {
      console.log(`Found ${deadlines.length} deadlines to process`);

      for (const deadline of deadlines) {
        const dueDate = new Date(deadline.due_date);
        const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Determine if notification should be sent based on priority and days until
        let shouldNotify = false;
        if (deadline.priority === 'high' && [1, 3, 7].includes(daysUntil)) {
          shouldNotify = true;
        } else if (deadline.priority === 'medium' && [1, 3].includes(daysUntil)) {
          shouldNotify = true;
        } else if (deadline.priority === 'low' && daysUntil === 1) {
          shouldNotify = true;
        }

        if (shouldNotify) {
          // Send email notification via Brevo
          try {
            await supabase.functions.invoke('send-brevo-email', {
              body: {
                to: [{ email: deadline.user_id }], // Note: This should be the actual email
                subject: `⚠️ Deadline Reminder: ${deadline.title}`,
                htmlContent: `
                  <h2>Deadline Reminder</h2>
                  <p><strong>${deadline.title}</strong></p>
                  <p>${deadline.description || 'You have an upcoming deadline'}</p>
                  <p><strong>Due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}</strong></p>
                  <p>Due Date: ${dueDate.toLocaleDateString()}</p>
                  <p><a href="https://justice-bot.com/dashboard">View in Dashboard</a></p>
                `,
              },
            });

            // Mark reminder as sent
            await supabase
              .from('case_deadlines')
              .update({ reminder_sent: true })
              .eq('id', deadline.id);

            notificationsSent++;
            console.log(`Notification sent for deadline ${deadline.id} (${daysUntil} days before)`);
          } catch (error) {
            console.error(`Error sending notification for deadline ${deadline.id}:`, error);
          }
        }
      }
    }

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

    // ========== Process case_events table (existing logic) ==========
    const notifications = [];

    if (!eventsError && events && events.length > 0) {
      console.log(`Found ${events.length} events to process`);

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

        // Create notification - properly type the case data
        const caseData = Array.isArray(event.cases) ? event.cases[0] : event.cases;
        const caseRecord = caseData as CaseRecord | undefined;
        const notification = {
          user_id: caseRecord?.user_id,
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

  } catch (error: unknown) {
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
