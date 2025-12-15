import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verify token - must match what you set in Meta Developer Console
const VERIFY_TOKEN = Deno.env.get("META_VERIFY_TOKEN") || "justicebot_verify_2024";

serve(async (req: Request) => {
  const url = new URL(req.url);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // GET request = Meta webhook verification
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    console.log('Webhook verification request:', { mode, token, challenge: challenge?.substring(0, 20) });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully');
      return new Response(challenge, { 
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    } else {
      console.error('Webhook verification failed - token mismatch');
      return new Response('Forbidden', { status: 403 });
    }
  }

  // POST request = Incoming message from Instagram
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log('Received Instagram webhook:', JSON.stringify(body, null, 2));

      // Process messaging events
      if (body.object === 'instagram') {
        for (const entry of body.entry || []) {
          for (const messagingEvent of entry.messaging || []) {
            const senderId = messagingEvent.sender?.id;
            const message = messagingEvent.message;

            if (message?.text) {
              console.log(`Message from ${senderId}: ${message.text}`);
              
              // Send auto-reply
              await sendInstagramReply(senderId, getAutoReply(message.text));
            }
          }
        }
      }

      // Must return 200 quickly to acknowledge receipt
      return new Response('EVENT_RECEIVED', { 
        status: 200,
        headers: corsHeaders
      });

    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('EVENT_RECEIVED', { status: 200, headers: corsHeaders });
    }
  }

  return new Response('Method not allowed', { status: 405 });
});

function getAutoReply(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hi! 👋 Welcome to Justice-Bot. I help Canadians with legal forms and guidance. How can I assist you today?\n\n• LTB (Landlord Tenant Board)\n• HRTO (Human Rights)\n• Small Claims Court\n• Family Law\n\nVisit justice-bot.com to get started!";
  }
  
  if (lowerMessage.includes('ltb') || lowerMessage.includes('landlord') || lowerMessage.includes('tenant') || lowerMessage.includes('eviction')) {
    return "I can help with LTB matters! 🏠\n\nCommon forms I assist with:\n• T2 - Tenant rights applications\n• T6 - Maintenance issues\n• Fighting N4 evictions\n\nVisit justice-bot.com/ltb-help to start your case!";
  }
  
  if (lowerMessage.includes('hrto') || lowerMessage.includes('human rights') || lowerMessage.includes('discrimination')) {
    return "I can help with Human Rights Tribunal matters! ⚖️\n\nI assist with discrimination claims related to:\n• Employment\n• Housing\n• Services\n\nVisit justice-bot.com/hrto-help to learn more!";
  }
  
  if (lowerMessage.includes('small claims') || lowerMessage.includes('sue') || lowerMessage.includes('money')) {
    return "Small Claims Court can help you recover up to $35,000! 💰\n\nI can guide you through:\n• Filing your claim\n• Evidence preparation\n• Court procedures\n\nVisit justice-bot.com/small-claims to get started!";
  }
  
  if (lowerMessage.includes('family') || lowerMessage.includes('custody') || lowerMessage.includes('divorce') || lowerMessage.includes('child support')) {
    return "I can help with Family Law matters! 👨‍👩‍👧\n\nI assist with:\n• Custody arrangements\n• Child/spousal support\n• Divorce procedures\n\nVisit justice-bot.com/family-journey to learn more!";
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return "Our forms are just $5.99 each! 💵\n\nWe also offer:\n• Monthly subscription: $19/month\n• Yearly subscription: $99.99/year\n• 7-day money-back guarantee\n\nVisit justice-bot.com/pricing for details!";
  }
  
  // Default response
  return "Thanks for reaching out to Justice-Bot! ⚖️\n\nI help Canadians with:\n• LTB forms (tenant rights)\n• HRTO applications\n• Small Claims Court\n• Family Law matters\n\nVisit justice-bot.com to start your case, or tell me more about your legal issue!";
}

async function sendInstagramReply(recipientId: string, messageText: string): Promise<void> {
  const accessToken = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
  
  if (!accessToken) {
    console.error('INSTAGRAM_ACCESS_TOKEN not configured');
    return;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: messageText }
        })
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Failed to send reply:', result);
    } else {
      console.log('Reply sent successfully to:', recipientId);
    }
  } catch (error) {
    console.error('Error sending Instagram reply:', error);
  }
}
