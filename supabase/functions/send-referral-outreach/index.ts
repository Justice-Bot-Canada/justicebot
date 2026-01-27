import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OutreachRequest {
  organizationName: string;
  contactName: string;
  email: string;
  organizationType?: string; // clinic, legal-aid, community-org, advocate
  notes?: string;
}

const getOutreachEmailHtml = (contactName: string, organizationName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Justice-Bot Introduction</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 2px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 20px;">
    <h2 style="color: #1e3a5f; margin: 0;">Justice-Bot</h2>
    <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Practical tools for self-represented people</p>
  </div>

  <p>Hello${contactName ? ` ${contactName}` : ''},</p>

  <p>Many people are sent into legal processes without clear guidance on what applies to them, which form to file, or how to organize evidence properly. Justice-Bot was built to address that exact gap.</p>

  <p><strong>Justice-Bot helps self-represented individuals:</strong></p>
  <ul style="color: #333; padding-left: 20px;">
    <li>understand which legal process applies to their situation</li>
    <li>identify the correct form or next procedural step</li>
    <li>organize and summarize evidence</li>
    <li>generate a court-ready Book of Documents in the format tribunals expect</li>
  </ul>

  <p>People can begin without creating an account. The first step is a short triage that helps them get oriented before deadlines or filing mistakes cause harm.</p>

  <div style="background: #f8f9fa; border-left: 4px solid #1e3a5f; padding: 15px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0;"><strong>What Justice-Bot does not do:</strong></p>
    <ul style="margin: 0; padding-left: 20px; color: #555;">
      <li>It does not provide legal advice</li>
      <li>It does not replace lawyers or clinics</li>
      <li>It does not file documents on someone's behalf</li>
    </ul>
  </div>

  <p>It is designed to reduce confusion, missed deadlines, and preventable errors for people navigating the system on their own.</p>

  <p>If you'd like to share it, you can direct people here:</p>
  
  <div style="text-align: center; margin: 25px 0;">
    <a href="https://justice-bot.com/referral" style="display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Visit the Referral Page →</a>
  </div>

  <p>This allows them to get oriented quickly and decide their next step with more confidence.</p>

  <p>If you have questions about how Justice-Bot fits alongside your work, I'm happy to connect.</p>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="margin: 0;">Best regards,</p>
    <p style="margin: 5px 0 0 0;"><strong>Terri</strong></p>
    <p style="margin: 5px 0 0 0; color: #666;">Justice-Bot</p>
  </div>

  <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
    <p style="margin: 0;">This email was sent to ${organizationName ? organizationName : 'your organization'} because we believe Justice-Bot may be helpful to the people you serve.</p>
    <p style="margin: 10px 0 0 0;">
      <a href="https://justice-bot.com" style="color: #1e3a5f;">justice-bot.com</a>
    </p>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: OutreachRequest = await req.json();
    const { organizationName, contactName, email, organizationType, notes } = body;

    // Validate required fields
    if (!email || !organizationName) {
      return new Response(
        JSON.stringify({ error: "Email and organization name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);

    // Send the outreach email
    const emailResponse = await resend.emails.send({
      from: "Terri at Justice-Bot <outreach@justice-bot.com>",
      to: [email],
      subject: "A practical tool for people navigating legal processes alone",
      html: getOutreachEmailHtml(contactName, organizationName),
    });

    const messageId = 'data' in emailResponse && emailResponse.data?.id ? emailResponse.data.id : 'unknown';

    console.log("Referral outreach email sent:", { 
      organizationName, 
      organizationType,
      messageId
    });

    // Log the outreach to database for tracking
    const { error: logError } = await supabase
      .from("referral_outreach_log")
      .insert({
        organization_name: organizationName,
        contact_name: contactName,
        email_hash: await hashEmail(email),
        organization_type: organizationType || "unknown",
        notes,
        sent_at: new Date().toISOString(),
        message_id: messageId,
      });

    if (logError) {
      // Log but don't fail - email was sent
      console.warn("Failed to log outreach:", logError.message);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId,
        message: "Outreach email sent successfully" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Referral outreach error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

// Hash email for PIPEDA-compliant logging
async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").substring(0, 16);
}

serve(handler);
