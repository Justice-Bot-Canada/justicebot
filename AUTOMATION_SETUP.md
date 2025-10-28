# Justice-Bot Automation Setup Guide

## 🆓 **FREE AUTOMATION UPDATE**
We've switched from Zapier Premium webhooks to **Pipedream** (free) and **n8n** (free/open source) to reduce costs while maintaining full automation capabilities.

## 🔗 Supabase Edge Function URLs

Your edge functions are deployed at:

### Public Webhooks (No Auth Required)
```
PayPal Webhook:
https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/paypal-webhook

Lead Capture:
https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/submit-lead

AI Triage:
https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/ai-legal-triage
```

### Authenticated Functions (Require JWT)
```
Generate Document:
https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/generate-document

Send Brevo Email:
https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/send-brevo-email

Generate SEO Pages:
https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/generate-seo-pages
```

---

## 1️⃣ PayPal Webhook Setup

### Step 1: Configure PayPal Webhook
1. Go to: https://developer.paypal.com/dashboard/webhooks
2. Click "Add Webhook"
3. Enter Webhook URL:
   ```
   https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/paypal-webhook
   ```
4. Select events to receive:
   - ✅ `PAYMENT.CAPTURE.COMPLETED`
   - ✅ `PAYMENT.CAPTURE.DENIED`
   - ✅ `CHECKOUT.ORDER.APPROVED`

### Step 2: Include Case ID in PayPal Orders
When creating PayPal payment orders, include `custom_id`:

```javascript
const order = await paypal.orders.create({
  intent: 'CAPTURE',
  purchase_units: [{
    amount: {
      value: '59.99',
      currency_code: 'CAD'
    },
    custom_id: caseId, // ⚠️ CRITICAL: This links payment to case
  }]
});
```

### Step 3: Test Webhook
Use PayPal's webhook simulator or make a test payment.

Check logs:
```
https://supabase.com/dashboard/project/vkzquzjtewqhcisvhsvg/functions/paypal-webhook/logs
```

---

## 2️⃣ Brevo Email Setup

### Add API Key
1. Get API key: https://app.brevo.com/settings/keys/api
2. Add to Supabase:
   ```bash
   # Go to: https://supabase.com/dashboard/project/vkzquzjtewqhcisvhsvg/settings/functions
   # Add secret: BREVO_API_KEY = your_api_key_here
   ```

### Email Templates

You can use Brevo templates or send HTML directly.

**Option A: Direct HTML (No Template)**
```javascript
await supabase.functions.invoke('send-brevo-email', {
  body: {
    to: 'user@example.com',
    toName: 'John Doe',
    subject: 'Welcome to Justice-Bot',
    htmlContent: '<h1>Welcome!</h1><p>Your journey starts here.</p>'
  }
});
```

**Option B: Brevo Template**
```javascript
await supabase.functions.invoke('send-brevo-email', {
  body: {
    to: 'user@example.com',
    toName: 'John Doe',
    templateId: 1, // Your Brevo template ID
    params: {
      FIRSTNAME: 'John',
      DOWNLOAD_LINK: 'https://...'
    }
  }
});
```

---

## 3️⃣ Document Generation Setup

### How It Works
1. User pays → PayPal webhook triggers
2. Webhook marks case as paid
3. Webhook calls `generate-document` function
4. Document uploads to Supabase Storage (`docs` bucket)
5. Signed URL sent via Brevo email

### Manual Document Generation
```javascript
const { data, error } = await supabase.functions.invoke('generate-document', {
  body: {
    case_id: 'uuid-here',
    doc_type: 'T2-Application',
    user_email: 'user@example.com',
    user_name: 'John Doe',
    form_data: {
      applicantName: 'John Doe',
      address: '123 Main St',
      // ... other fields
    }
  }
});

console.log('Download URL:', data.download_url);
```

### Replace Placeholder Doc Generation
Current implementation generates text files. Replace with your actual doc generation:

```typescript
// In supabase/functions/generate-document/index.ts
// Replace the generateDocumentContent function with:
import { Document, Packer, Paragraph } from "npm:docx@8.5.0";

async function generateDocxBuffer(docType: string, formData: any): Promise<Uint8Array> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: `Document: ${docType}` }),
        // Add your document structure here
      ]
    }]
  });

  return await Packer.toBuffer(doc);
}
```

---

## 4️⃣ Email Automation with Pipedream (FREE)

### Why Pipedream Instead of Zapier?
- ✅ **100% FREE** for reasonable usage (100K invocations/month)
- ✅ Built-in webhook endpoints (no premium required)
- ✅ Direct Supabase integration
- ✅ More flexible and developer-friendly
- ✅ Supports TypeScript/JavaScript

### Setup Pipedream Account

1. **Create Free Account**:
   - Go to https://pipedream.com
   - Sign up with email (no credit card required)

2. **Connect Supabase**:
   - In Pipedream, go to "Apps" → Search "Supabase"
   - Connect with URL: `https://vkzquzjtewqhcisvhsvg.supabase.co`
   - Add anon key from Supabase settings

3. **Add Brevo API Key**:
   - In any workflow → Add Secret
   - Name: `BREVO_API_KEY`
   - Get key from: https://app.brevo.com/settings/keys/api

### Pipedream Workflows to Create

#### Workflow 1: Welcome Email (Day 0)

**Trigger**: Supabase New Row
- Table: `leads`
- Polling: Every 15 seconds

**Action**: Send Email via Brevo API
```javascript
import { axios } from "@pipedream/platform"

export default defineComponent({
  async run({steps, $}) {
    const lead = steps.trigger.event;
    
    return await axios($, {
      method: "POST",
      url: "https://api.brevo.com/v3/smtp/email",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      },
      data: {
        sender: { name: "Justice-Bot", email: "hello@justice-bot.com" },
        to: [{ email: lead.email, name: lead.name }],
        subject: "Welcome to Justice-Bot! 🎉",
        htmlContent: `<h1>Welcome ${lead.name}!</h1>
          <p>Start your legal journey today.</p>
          <a href="https://justice-bot.com/dashboard">Go to Dashboard</a>`
      }
    });
  }
})
```

#### Workflow 2: Upgrade Nudge (Day 3)

**Trigger**: Schedule (CRON)
- Expression: `0 10 * * *` (daily at 10 AM)

**Step 1**: Query 3-day-old leads
```javascript
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

const { data } = await axios($, {
  url: `https://vkzquzjtewqhcisvhsvg.supabase.co/rest/v1/leads`,
  headers: {
    "apikey": process.env.SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`
  },
  params: {
    created_at: `eq.${threeDaysAgo.toISOString().split('T')[0]}`,
    select: "email,name"
  }
});
```

**Step 2**: Loop & Send Emails
```javascript
for (const lead of data) {
  await axios($, {
    method: "POST",
    url: "https://api.brevo.com/v3/smtp/email",
    headers: { "api-key": process.env.BREVO_API_KEY },
    data: {
      to: [{ email: lead.email }],
      subject: "Ready to upgrade? 📋",
      htmlContent: `<h2>Hi ${lead.name}!</h2>
        <p>Unlock premium features to file faster.</p>
        <a href="https://justice-bot.com/pricing">View Plans</a>`
    }
  });
}
```

#### Workflow 3: Evidence Reminder (Day 7)
Follow same pattern, query 7-day-old leads, send evidence reminder.

#### Workflow 4: Referral Ask (Day 14)
Follow same pattern, query 14-day-old leads, send referral request.

### Alternative: n8n (Self-Hosted)

For complete control, use n8n:
```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

Access at: http://localhost:5678

📄 **Full migration guide**: See `PIPEDREAM_MIGRATION.md`

---

## 5️⃣ Email Queue Processor (Scheduled)

Process queued emails automatically:

### Option A: Supabase Cron (Recommended)
Add to your database:
```sql
SELECT cron.schedule(
  'process-email-queue',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT net.http_post(
    url := 'https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/process-email-queue',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb
  );
  $$
);
```

### Option B: External Cron (Cron-Job.org, etc.)
Call this URL every 5 minutes:
```
POST https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/process-email-queue
```

---

## 6️⃣ SEO Automation

Generate 10+ pages per week using the admin dashboard:

1. Go to: https://justice-bot.com/admin-dashboard
2. Enter topic, location, form type
3. Click "Generate SEO Page"
4. Page created at: `/seo/{slug}`

### Bulk Generation (Advanced)
Create a script to generate multiple pages:

```javascript
const topics = [
  'eviction defense',
  'wrongful dismissal',
  'human rights complaint',
  'small claims filing',
];

const locations = ['Toronto', 'Ottawa', 'Mississauga'];

for (const topic of topics) {
  for (const location of locations) {
    await supabase.functions.invoke('generate-seo-pages', {
      body: { topic, location, formType: 'Application' }
    });
    await new Promise(r => setTimeout(r, 2000)); // Rate limit
  }
}
```

---

## 7️⃣ Required Secrets

Add these in Supabase Functions settings:
https://supabase.com/dashboard/project/vkzquzjtewqhcisvhsvg/settings/functions

- ✅ `PAYPAL_CLIENT_ID` (already added)
- ✅ `PAYPAL_CLIENT_SECRET` (already added)
- ✅ `PAYPAL_API_BASE` (already added)
- ✅ `LOVABLE_API_KEY` (already added)
- ⚠️ `BREVO_API_KEY` - **ADD THIS**
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (auto-added)

---

## 8️⃣ Security Checklist

- ✅ Anon key in browser only
- ✅ Service key in Edge Functions only
- ✅ RLS enabled on all tables
- ✅ `docs` bucket is private
- ✅ PayPal webhooks include case_id in custom_id
- ✅ Signed URLs expire (7 days default)
- ⚠️ TODO: Verify PayPal webhook signatures (add to webhook function)

---

## 9️⃣ Testing the Complete Flow

### Test Lead Capture
```javascript
const { data } = await supabase.functions.invoke('submit-lead', {
  body: {
    email: 'test@example.com',
    name: 'Test User',
    source: 'manual_test',
    journey: 'ltb',
    payload: { reason: 'Testing automation' }
  }
});
// Check email_queue table for welcome email
```

### Test Payment Flow
1. Create PayPal payment with custom_id = case_id
2. Complete payment
3. Check webhook logs
4. Verify case.is_paid = true
5. Check documents table for generated doc
6. Check email sent to user

### Test Document Generation
```javascript
const { data } = await supabase.functions.invoke('generate-document', {
  body: {
    case_id: 'your-case-id',
    doc_type: 'Test-Form',
    user_email: 'test@example.com',
    user_name: 'Test User'
  }
});

console.log('Download:', data.download_url);
```

---

## 🔟 Next Steps

1. ✅ Add `BREVO_API_KEY` to Supabase
2. ✅ Configure PayPal webhook URL
3. ✅ Set up 4 Zapier zaps (welcome, day 3, 7, 14)
4. ✅ Generate 10 SEO pages this week
5. ✅ Test complete payment → doc → email flow
6. ✅ Replace placeholder doc generation with real logic
7. ✅ Set up Supabase cron for email queue

---

## 📊 Monitoring

**Function Logs:**
https://supabase.com/dashboard/project/vkzquzjtewqhcisvhsvg/functions

**Email Queue Status:**
```sql
SELECT status, COUNT(*) 
FROM email_queue 
GROUP BY status;
```

**Recent Payments:**
```sql
SELECT * FROM payments 
WHERE status = 'completed' 
ORDER BY created_at DESC 
LIMIT 10;
```

**Document Generation Stats:**
```sql
SELECT 
  form_key as doc_type,
  COUNT(*) as generated,
  MAX(created_at) as last_generated
FROM documents
GROUP BY form_key
ORDER BY generated DESC;
```

---

## 🆘 Troubleshooting

**PayPal webhook not working:**
- Check webhook URL is correct
- Verify events are selected in PayPal dashboard
- Check function logs for errors
- Ensure custom_id is being sent in orders

**Emails not sending:**
- Verify BREVO_API_KEY is set
- Check email_queue table for failed entries
- Test with send-brevo-email function directly
- Check Brevo dashboard for sending limits

**Documents not generating:**
- Check case exists and is paid
- Verify docs bucket exists and has policies
- Check function logs for errors
- Test generate-document function directly

**SEO pages not appearing:**
- Check seo_pages table
- Verify slug is unique
- Check published status
- Add route to App.tsx if needed
