import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://justice-bot.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { type, userId, data } = await req.json();
    
    const requestId = crypto.randomUUID();
    console.log("Email notification request received", { type, requestId });

    // Get user email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !userData.user?.email) {
      throw new Error("User not found");
    }

    const email = userData.user.email;
    let emailContent;

    switch (type) {
      case "welcome":
        emailContent = {
          subject: "Welcome to Justice-Bot - Your Legal Journey Starts Here",
          html: `
            <h1>Welcome to Justice-Bot!</h1>
            <p>Hi there,</p>
            <p>Thanks for joining Justice-Bot. We're here to help you navigate the Canadian legal system with confidence.</p>
            <h2>Here's what you can do:</h2>
            <ul>
              <li>Get instant legal triage and case assessment</li>
              <li>Access 100+ legal forms</li>
              <li>Track deadlines and court dates</li>
              <li>Build your evidence library</li>
            </ul>
            <p><a href="https://justice-bot.com/triage">Start Your Legal Journey →</a></p>
            <p>Questions? Just reply to this email.</p>
            <p>Best,<br>The Justice-Bot Team</p>
          `
        };
        break;

      case "deadline_reminder":
        emailContent = {
          subject: `⚠️ Deadline Approaching: ${data.caseName}`,
          html: `
            <h1>Deadline Reminder</h1>
            <p>Hi,</p>
            <p>This is a reminder about an upcoming deadline for your case:</p>
            <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2>${data.caseName}</h2>
              <p><strong>Deadline:</strong> ${data.deadline}</p>
              <p><strong>Days remaining:</strong> ${data.daysRemaining}</p>
              <p><strong>Action needed:</strong> ${data.action}</p>
            </div>
            <p><a href="https://justice-bot.com/dashboard">View Case Details →</a></p>
            <p>Don't miss this deadline!</p>
          `
        };
        break;

      case "upgrade_prompt":
        emailContent = {
          subject: "Unlock Full Access to Justice-Bot Premium",
          html: `
            <h1>Ready to Level Up?</h1>
            <p>Hi,</p>
            <p>You've been using Justice-Bot and we've noticed you could benefit from our Premium features:</p>
            <h2>Premium Benefits:</h2>
            <ul>
              <li>✅ Unlimited AI legal analysis</li>
              <li>✅ All forms and templates</li>
              <li>✅ Priority support</li>
              <li>✅ Deadline tracking and reminders</li>
              <li>✅ Document generation</li>
            </ul>
            <p><strong>Special Offer:</strong> Get 20% off your first year with code UPGRADE20</p>
            <p><a href="https://justice-bot.com/pricing">Upgrade Now →</a></p>
            <p>Questions? We're here to help.</p>
          `
        };
        break;

      case "referral_reward":
        emailContent = {
          subject: "🎉 You Earned Referral Credits!",
          html: `
            <h1>Congratulations!</h1>
            <p>Hi,</p>
            <p>Great news! Someone used your referral link and you've earned credits:</p>
            <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2>$${data.creditsEarned} in Credits</h2>
              <p>Total credits: $${data.totalCredits}</p>
              <p>Referrals: ${data.referralCount}</p>
            </div>
            <p>Keep sharing! For every friend who signs up, you both save money on legal help.</p>
            <p><a href="https://justice-bot.com/referrals">View Referral Dashboard →</a></p>
          `
        };
        break;

      default:
        throw new Error("Unknown email type");
    }

    const result = await resend.emails.send({
      from: "Justice-Bot <admin@justice-bot.com>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    // Log email sent
    await supabase.from('email_logs').insert({
      user_id: userId,
      email_type: type,
      sent_to: email,
      sent_at: new Date().toISOString(),
      resend_id: result.id
    });

    console.log("Email sent successfully:", result.id);

    return new Response(JSON.stringify({ success: true, emailId: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
