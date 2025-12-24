import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { getCorsHeaders, corsHeaders } from "../_shared/cors.ts";

interface EmailSequence {
  id: string;
  name: string;
  trigger: 'signup' | 'trial_start' | 'case_created' | 'payment_complete' | 'inactive';
  emails: SequenceEmail[];
}

interface SequenceEmail {
  delayDays: number;
  subject: string;
  templateId: string;
  conditions?: EmailCondition[];
}

interface EmailCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than';
  value: any;
}

// Pre-defined email sequences for marketing automation
const EMAIL_SEQUENCES: EmailSequence[] = [
  {
    id: 'welcome_sequence',
    name: 'Welcome Series',
    trigger: 'signup',
    emails: [
      { delayDays: 0, subject: 'Welcome to Justice Bot - Your Legal Journey Starts Here', templateId: 'welcome_1' },
      { delayDays: 2, subject: 'How to Use Justice Bot for Your Case', templateId: 'welcome_2' },
      { delayDays: 5, subject: 'Success Story: How Sarah Won Her LTB Case', templateId: 'welcome_3' },
      { delayDays: 7, subject: 'Ready to Start Your Case? Here\'s 20% Off', templateId: 'welcome_offer' }
    ]
  },
  {
    id: 'case_nurture',
    name: 'Case Nurture Sequence',
    trigger: 'case_created',
    emails: [
      { delayDays: 1, subject: 'Your Case Dashboard is Ready', templateId: 'case_started' },
      { delayDays: 3, subject: 'Have You Uploaded Your Evidence?', templateId: 'evidence_reminder' },
      { delayDays: 7, subject: 'Get Your Free Case Analysis', templateId: 'analysis_offer' },
      { delayDays: 14, subject: 'Don\'t Forget Your Deadline', templateId: 'deadline_reminder' }
    ]
  },
  {
    id: 'reactivation',
    name: 'Reactivation Sequence',
    trigger: 'inactive',
    emails: [
      { delayDays: 7, subject: 'We Miss You! Here\'s What\'s New', templateId: 'reactivation_1' },
      { delayDays: 14, subject: 'Your Case Might Be At Risk - Check In', templateId: 'reactivation_2' },
      { delayDays: 21, subject: 'Last Chance: 30% Off to Resume Your Case', templateId: 'reactivation_offer' }
    ]
  },
  {
    id: 'trial_conversion',
    name: 'Trial Conversion',
    trigger: 'trial_start',
    emails: [
      { delayDays: 1, subject: 'Make the Most of Your Trial', templateId: 'trial_tips' },
      { delayDays: 5, subject: 'Your Trial is Halfway Done - See What You\'ve Accomplished', templateId: 'trial_midpoint' },
      { delayDays: 12, subject: 'Trial Ending Soon - Upgrade Now', templateId: 'trial_ending' },
      { delayDays: 13, subject: 'Last Day: Lock In Your Special Rate', templateId: 'trial_last_day' }
    ]
  }
];

serve(async (req) => {
  const origin = req.headers.get("Origin");
  const responseHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: responseHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "" // Use service role for automated tasks
    );

    const { action, data } = await req.json();

    switch (action) {
      case 'trigger_sequence':
        return await triggerSequence(supabaseClient, data, responseHeaders);
      
      case 'process_scheduled':
        return await processScheduledEmails(supabaseClient, responseHeaders);
      
      case 'check_inactive':
        return await checkInactiveUsers(supabaseClient, responseHeaders);
      
      case 'generate_content':
        return await generateEmailContent(data, responseHeaders);
      
      case 'get_sequences':
        return new Response(
          JSON.stringify({ success: true, sequences: EMAIL_SEQUENCES }),
          { headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
        );
      
      case 'analytics':
        return await getAutomationAnalytics(supabaseClient, data, responseHeaders);
      
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Unknown action' }),
          { status: 400, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Marketing automation error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function triggerSequence(
  supabase: any, 
  data: { userId: string; email: string; trigger: string; metadata?: any },
  headers: Record<string, string>
) {
  const { userId, email, trigger, metadata } = data;
  
  // Find matching sequence
  const sequence = EMAIL_SEQUENCES.find(s => s.trigger === trigger);
  if (!sequence) {
    return new Response(
      JSON.stringify({ success: false, error: `No sequence found for trigger: ${trigger}` }),
      { headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }

  console.log(`Triggering sequence "${sequence.name}" for user ${userId}`);

  // Schedule all emails in the sequence
  const scheduledEmails = [];
  const now = new Date();

  for (const emailConfig of sequence.emails) {
    const sendAt = new Date(now);
    sendAt.setDate(sendAt.getDate() + emailConfig.delayDays);

    const { data: queuedEmail, error } = await supabase
      .from('email_queue')
      .insert({
        email,
        template: emailConfig.templateId,
        status: 'scheduled',
        vars: {
          userId,
          sequenceId: sequence.id,
          subject: emailConfig.subject,
          sendAt: sendAt.toISOString(),
          metadata
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error scheduling email:', error);
    } else {
      scheduledEmails.push(queuedEmail);
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      sequence: sequence.name,
      emailsScheduled: scheduledEmails.length 
    }),
    { headers: { ...headers, 'Content-Type': 'application/json' } }
  );
}

async function processScheduledEmails(supabase: any, headers: Record<string, string>) {
  const now = new Date().toISOString();
  
  // Get emails that are scheduled and due
  const { data: dueEmails, error: fetchError } = await supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'scheduled')
    .lte('vars->>sendAt', now)
    .limit(50);

  if (fetchError) {
    console.error('Error fetching scheduled emails:', fetchError);
    return new Response(
      JSON.stringify({ success: false, error: fetchError.message }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }

  if (!dueEmails?.length) {
    return new Response(
      JSON.stringify({ success: true, processed: 0, message: 'No emails due' }),
      { headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }

  console.log(`Processing ${dueEmails.length} scheduled emails`);

  let sent = 0;
  let failed = 0;

  for (const email of dueEmails) {
    try {
      // Generate personalized content using AI
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      let emailContent = null;
      
      if (LOVABLE_API_KEY) {
        emailContent = await generateEmailWithAI(
          email.template,
          email.vars?.subject,
          email.vars?.metadata,
          LOVABLE_API_KEY
        );
      }

      // Send via Brevo/Resend
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      if (RESEND_API_KEY) {
        const sendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Justice Bot <noreply@justice-bot.com>',
            to: email.email,
            subject: email.vars?.subject || 'Update from Justice Bot',
            html: emailContent?.html || getDefaultTemplate(email.template, email.vars),
          }),
        });

        if (sendResponse.ok) {
          await supabase
            .from('email_queue')
            .update({ status: 'sent', sent_at: new Date().toISOString() })
            .eq('id', email.id);
          sent++;
        } else {
          throw new Error(`Resend API error: ${sendResponse.status}`);
        }
      } else {
        // No email provider configured - mark as failed
        await supabase
          .from('email_queue')
          .update({ status: 'failed', error: 'No email provider configured' })
          .eq('id', email.id);
        failed++;
      }
    } catch (error) {
      console.error(`Error sending email ${email.id}:`, error);
      await supabase
        .from('email_queue')
        .update({ status: 'failed', error: error.message })
        .eq('id', email.id);
      failed++;
    }
  }

  return new Response(
    JSON.stringify({ success: true, processed: dueEmails.length, sent, failed }),
    { headers: { ...headers, 'Content-Type': 'application/json' } }
  );
}

async function checkInactiveUsers(supabase: any, headers: Record<string, string>) {
  // Find users who haven't logged in for 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Get users with recent activity
  const { data: activeUsers } = await supabase
    .from('analytics_events')
    .select('user_id')
    .gte('created_at', sevenDaysAgo.toISOString())
    .not('user_id', 'is', null);

  const activeUserIds = new Set(activeUsers?.map((u: any) => u.user_id) || []);

  // Get all users with profiles
  const { data: allUsers } = await supabase
    .from('profiles')
    .select('user_id, email')
    .not('email', 'is', null);

  // Find inactive users
  const inactiveUsers = (allUsers || []).filter((u: any) => !activeUserIds.has(u.user_id));

  console.log(`Found ${inactiveUsers.length} inactive users`);

  // Trigger reactivation sequence for each
  let triggered = 0;
  for (const user of inactiveUsers.slice(0, 20)) { // Limit to 20 per run
    // Check if they're already in a reactivation sequence
    const { data: existingQueue } = await supabase
      .from('email_queue')
      .select('id')
      .eq('email', user.email)
      .eq('vars->>sequenceId', 'reactivation')
      .eq('status', 'scheduled')
      .limit(1);

    if (!existingQueue?.length) {
      await triggerSequence(supabase, {
        userId: user.user_id,
        email: user.email,
        trigger: 'inactive',
        metadata: { lastActive: sevenDaysAgo.toISOString() }
      }, headers);
      triggered++;
    }
  }

  return new Response(
    JSON.stringify({ success: true, inactiveCount: inactiveUsers.length, triggered }),
    { headers: { ...headers, 'Content-Type': 'application/json' } }
  );
}

async function generateEmailContent(data: { template: string; context?: any }, headers: Record<string, string>) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    return new Response(
      JSON.stringify({ success: false, error: 'LOVABLE_API_KEY not configured' }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }

  const content = await generateEmailWithAI(
    data.template,
    null,
    data.context,
    LOVABLE_API_KEY
  );

  return new Response(
    JSON.stringify({ success: true, content }),
    { headers: { ...headers, 'Content-Type': 'application/json' } }
  );
}

async function generateEmailWithAI(template: string, subject: string | null, metadata: any, apiKey: string) {
  const systemPrompt = `You are an email copywriter for Justice Bot, a Canadian legal self-help platform.
Write engaging, helpful, and empathetic emails that encourage users to take action.
Keep emails concise, professional, and focused on helping users with their legal cases.
Use a warm but professional tone. Include clear calls to action.`;

  const userPrompt = `Generate an email for the "${template}" template.
${subject ? `Subject line: ${subject}` : ''}
${metadata ? `Context: ${JSON.stringify(metadata)}` : ''}

Return the email in this JSON format:
{
  "subject": "email subject line",
  "preheader": "preview text",
  "html": "<full HTML email content with styling>",
  "plainText": "plain text version"
}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr);
    }
    
    return { html: content, plainText: content };
  } catch (error) {
    console.error('Error generating email content:', error);
    return null;
  }
}

function getDefaultTemplate(template: string, vars: any): string {
  // Fallback templates if AI generation fails
  const templates: Record<string, string> = {
    welcome_1: `
      <h1>Welcome to Justice Bot!</h1>
      <p>Thank you for joining us. We're here to help you navigate your legal journey.</p>
      <a href="https://justice-bot.com/dashboard">Get Started</a>
    `,
    welcome_2: `
      <h1>Getting Started with Your Case</h1>
      <p>Here's how to make the most of Justice Bot...</p>
      <a href="https://justice-bot.com/triage">Start Your Case Assessment</a>
    `,
    evidence_reminder: `
      <h1>Don't Forget Your Evidence!</h1>
      <p>Strong evidence is key to a successful case. Upload your documents today.</p>
      <a href="https://justice-bot.com/evidence">Upload Evidence</a>
    `,
    reactivation_1: `
      <h1>We Miss You!</h1>
      <p>Your case is waiting. Come back and continue building your case.</p>
      <a href="https://justice-bot.com/dashboard">Resume Your Case</a>
    `
  };

  return templates[template] || `
    <h1>${vars?.subject || 'Update from Justice Bot'}</h1>
    <p>Check out what's new on your dashboard.</p>
    <a href="https://justice-bot.com/dashboard">Visit Dashboard</a>
  `;
}

async function getAutomationAnalytics(supabase: any, data: { days?: number }, headers: Record<string, string>) {
  const days = data.days || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: emailStats, error } = await supabase
    .from('email_queue')
    .select('status, template, created_at')
    .gte('created_at', startDate.toISOString());

  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }

  // Calculate metrics
  const total = emailStats?.length || 0;
  const sent = emailStats?.filter((e: any) => e.status === 'sent').length || 0;
  const failed = emailStats?.filter((e: any) => e.status === 'failed').length || 0;
  const scheduled = emailStats?.filter((e: any) => e.status === 'scheduled').length || 0;

  // Group by template
  const byTemplate: Record<string, number> = {};
  emailStats?.forEach((e: any) => {
    byTemplate[e.template] = (byTemplate[e.template] || 0) + 1;
  });

  return new Response(
    JSON.stringify({
      success: true,
      analytics: {
        period: `Last ${days} days`,
        total,
        sent,
        failed,
        scheduled,
        deliveryRate: total > 0 ? ((sent / total) * 100).toFixed(1) + '%' : '0%',
        byTemplate
      }
    }),
    { headers: { ...headers, 'Content-Type': 'application/json' } }
  );
}