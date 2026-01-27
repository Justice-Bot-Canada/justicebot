import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { logAuditEvent, hashEmail } from "../_shared/auditLog.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getWelcomeEmailHtml = (userName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Justice-Bot</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">⚖️ Justice-Bot</h1>
              <p style="margin: 10px 0 0; color: #a3c4e8; font-size: 16px;">Your Legal Self-Representation Assistant</p>
            </td>
          </tr>
          
          <!-- Welcome Message -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1e3a5f; font-size: 24px;">Welcome${userName ? `, ${userName}` : ''}!</h2>
              <p style="margin: 0 0 20px; color: #444; font-size: 16px; line-height: 1.6;">
                Thank you for joining Justice-Bot. We're here to help you navigate the Canadian legal system with confidence.
              </p>
              
              <!-- What Justice-Bot Does -->
              <div style="background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px; color: #1e3a5f; font-size: 18px;">🤖 What Justice-Bot Can Help With:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #444; line-height: 1.8;">
                  <li><strong>Smart Legal Triage</strong> – AI-powered case assessment to identify your best legal pathway</li>
                  <li><strong>Form Generation</strong> – Access 50+ official court and tribunal forms (LTB, HRTO, Small Claims, Family Court)</li>
                  <li><strong>Evidence Organization</strong> – Upload, tag, and organize documents for your case</li>
                  <li><strong>Deadline Tracking</strong> – Never miss a filing deadline or court date</li>
                  <li><strong>Merit Scoring</strong> – Get AI-powered case strength analysis based on real case law</li>
                </ul>
              </div>
              
              <!-- Important Disclaimer -->
              <div style="background: #fff8e6; border-left: 4px solid #f5a623; border-radius: 4px; padding: 15px 20px; margin: 25px 0;">
                <h4 style="margin: 0 0 10px; color: #8a6d14; font-size: 14px;">⚠️ Important to Understand:</h4>
                <p style="margin: 0; color: #665511; font-size: 14px; line-height: 1.6;">
                  Justice-Bot is a <strong>legal technology tool</strong>, not a lawyer. We help you organize information and generate forms, but we don't provide legal advice or representation. For complex matters, consider consulting with a licensed legal professional.
                </p>
              </div>
              
              <!-- First Steps -->
              <h3 style="margin: 30px 0 15px; color: #1e3a5f; font-size: 18px;">🚀 Your First Steps:</h3>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0;">
                    <div style="display: flex; align-items: flex-start;">
                      <span style="background: #1e3a5f; color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-block; text-align: center; line-height: 28px; font-weight: bold; margin-right: 15px;">1</span>
                      <div>
                        <strong style="color: #1e3a5f;">Complete the Smart Triage</strong>
                        <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Answer a few questions to identify your legal pathway</p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <div style="display: flex; align-items: flex-start;">
                      <span style="background: #1e3a5f; color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-block; text-align: center; line-height: 28px; font-weight: bold; margin-right: 15px;">2</span>
                      <div>
                        <strong style="color: #1e3a5f;">Upload Your Evidence</strong>
                        <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Photos, documents, emails – anything that supports your case</p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <div style="display: flex; align-items: flex-start;">
                      <span style="background: #1e3a5f; color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-block; text-align: center; line-height: 28px; font-weight: bold; margin-right: 15px;">3</span>
                      <div>
                        <strong style="color: #1e3a5f;">Generate Your Forms</strong>
                        <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Get pre-filled forms ready for filing</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0 25px;">
                <a href="https://www.justice-bot.com/triage" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Start Your Legal Journey →
                </a>
              </div>
              
              <!-- Emergency Resources -->
              <div style="background: #fff0f0; border-radius: 8px; padding: 15px 20px; margin: 25px 0;">
                <h4 style="margin: 0 0 10px; color: #c53030; font-size: 14px;">🆘 Need Immediate Help?</h4>
                <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.6;">
                  If you're in an emergency situation involving safety, please contact local authorities or call 911. For urgent legal matters, consider reaching out to <a href="https://www.legalaid.on.ca" style="color: #c53030;">Legal Aid Ontario</a> or a local community legal clinic.
                </p>
              </div>
              
              <!-- Support -->
              <p style="margin: 25px 0 0; color: #666; font-size: 14px; line-height: 1.6;">
                Questions? Visit our <a href="https://www.justice-bot.com/faq" style="color: #1e3a5f;">FAQ</a> or reply to this email – we're here to help.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background: #f5f5f5; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 10px; color: #888; font-size: 12px;">
                © 2024 Justice-Bot | <a href="https://www.justice-bot.com/privacy" style="color: #888;">Privacy Policy</a> | <a href="https://www.justice-bot.com/terms" style="color: #888;">Terms of Service</a>
              </p>
              <p style="margin: 0; color: #888; font-size: 12px;">
                You're receiving this because you signed up at justice-bot.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email, name } = await req.json();
    
    if (!userId && !email) {
      throw new Error("userId or email is required");
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let userEmail = email;
    let userName = name;

    // If userId provided, fetch user details
    if (userId && !email) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError || !userData.user?.email) {
        console.error("User not found:", userId);
        throw new Error("User not found");
      }
      userEmail = userData.user.email;
      userName = userData.user.user_metadata?.first_name || userData.user.user_metadata?.display_name || '';
    }

    // If no name, try to get from profiles
    if (!userName && userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, display_name')
        .eq('user_id', userId)
        .single();
      
      userName = profile?.first_name || profile?.display_name || '';
    }

    console.log(`Sending welcome email to ${userEmail}`);

    const result = await resend.emails.send({
      from: "Justice-Bot <admin@justice-bot.com>",
      to: [userEmail],
      subject: "Welcome to Justice-Bot – Your Legal Journey Starts Here",
      html: getWelcomeEmailHtml(userName || ''),
    });

    const resendId = 'data' in result && result.data?.id ? result.data.id : 'unknown';

    console.log("Welcome email sent:", resendId);

    // SOC2 Audit Log: User signup / welcome email sent
    try {
      const auditClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );
      await logAuditEvent(auditClient, {
        action: 'auth.signup',
        resource_type: 'user',
        resource_id: userId || null,
        user_id: userId || null,
        metadata: {
          email_hash: await hashEmail(userEmail),
          welcome_email_sent: true,
          resend_id: resendId,
        }
      }, req);
    } catch (auditErr) {
      console.error("Failed to log audit event:", auditErr);
    }

    // Log the email
    try {
      await supabase.from('email_queue').insert({
        email: userEmail,
        template: 'welcome',
        status: 'sent',
        sent_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to log email:", err);
    }

    return new Response(
      JSON.stringify({ success: true, emailId: resendId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
