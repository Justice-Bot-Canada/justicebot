# Migrating from Zapier to Pipedream (Free)

This guide helps you migrate your Justice-Bot email automation from Zapier Premium to Pipedream's free tier.

## Why Migrate?

| Feature | Zapier Premium | Pipedream Free | n8n Free |
|---------|---------------|----------------|----------|
| **Cost** | $29.99/mo | $0/mo | $0/mo |
| **Webhooks** | ✅ Premium | ✅ Free | ✅ Free |
| **Supabase Integration** | Limited | ✅ Native | ✅ Native |
| **Monthly Invocations** | 750 tasks | 100K | Unlimited |
| **Deployment** | Cloud | Cloud | Self-hosted |

## Migration Steps

### Step 1: Export Zapier Workflow Logic

Document your current Zaps:

1. **Zap 1: Welcome Email**
   - Trigger: Supabase webhook (new lead)
   - Action: Send Brevo email

2. **Zap 2: Day 3 Nudge**
   - Trigger: Scheduled (daily)
   - Filter: Created 3 days ago
   - Action: Send Brevo email

3. **Zap 3: Day 7 Reminder**
   - Trigger: Scheduled (daily)
   - Filter: Created 7 days ago
   - Action: Send Brevo email

4. **Zap 4: Day 14 Final Push**
   - Trigger: Scheduled (daily)
   - Filter: Created 14 days ago
   - Action: Send Brevo email

### Step 2: Create Pipedream Account

1. Go to https://pipedream.com
2. Sign up (no credit card required)
3. Verify email

### Step 3: Connect Integrations

#### Connect Supabase:
```
Project URL: https://vkzquzjtewqhcisvhsvg.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Add Brevo API Key:
- Go to any workflow → Add Secret
- Key: `BREVO_API_KEY`
- Value: (from https://app.brevo.com/settings/keys/api)

### Step 4: Rebuild Workflows in Pipedream

#### Workflow 1: Welcome Email (Replaces Zap 1)

**Trigger**: Supabase New Row
```javascript
// Configure:
// Table: leads
// Polling: Every 15 seconds
```

**Action**: Send Email via Brevo
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
        sender: {
          name: "Justice-Bot",
          email: "hello@justice-bot.com"
        },
        to: [{
          email: lead.email,
          name: lead.name
        }],
        subject: "Welcome to Justice-Bot! 🎉",
        htmlContent: `
          <h1>Welcome, ${lead.name}!</h1>
          <p>We're here to guide you through your legal journey.</p>
          <a href="https://justice-bot.com/dashboard">Get Started</a>
        `
      }
    });
  }
})
```

#### Workflow 2-4: Scheduled Nudges (Replaces Zaps 2-4)

**Trigger**: Schedule (CRON)
```
0 10 * * *  // Every day at 10 AM
```

**Step 1**: Query Supabase
```javascript
import { axios } from "@pipedream/platform"

export default defineComponent({
  async run({steps, $}) {
    const daysAgo = 3; // Change to 7 or 14 for other workflows
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);
    
    const { data } = await axios($, {
      url: `https://vkzquzjtewqhcisvhsvg.supabase.co/rest/v1/leads`,
      headers: {
        "apikey": process.env.SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      params: {
        created_at: `eq.${targetDate.toISOString().split('T')[0]}`,
        select: "email,name"
      }
    });
    
    return data;
  }
})
```

**Step 2**: Loop & Send Emails
```javascript
import { axios } from "@pipedream/platform"

export default defineComponent({
  async run({steps, $}) {
    const leads = steps.query_leads.$return_value;
    
    for (const lead of leads) {
      await axios($, {
        method: "POST",
        url: "https://api.brevo.com/v3/smtp/email",
        headers: {
          "api-key": process.env.BREVO_API_KEY
        },
        data: {
          to: [{ email: lead.email }],
          subject: "Ready to upgrade? 📋",
          htmlContent: `
            <h2>Hi ${lead.name}!</h2>
            <p>Unlock premium features to file your case faster.</p>
            <a href="https://justice-bot.com/pricing">View Plans</a>
          `
        }
      });
    }
  }
})
```

### Step 5: Test Each Workflow

1. **Test Welcome Email**:
   - Insert a test lead in Supabase `leads` table
   - Verify Pipedream workflow triggers
   - Check email arrives

2. **Test Scheduled Workflows**:
   - Manually trigger workflow
   - Check Supabase query returns correct leads
   - Verify emails sent

### Step 6: Disable Zapier Zaps

Once Pipedream workflows are tested:

1. Go to Zapier dashboard
2. Turn OFF all Justice-Bot Zaps
3. Monitor Pipedream for 48 hours
4. Delete Zapier Zaps permanently

### Step 7: Update Documentation

Update your internal docs to reference Pipedream:
- Webhook URLs (if any)
- Workflow locations
- API keys and secrets

## Troubleshooting

### Issue: Emails not sending

**Check**:
- Brevo API key is valid
- Sender email is verified in Brevo
- Email content has valid HTML

**Fix**:
```javascript
// Add error handling
try {
  await axios($, { /* email config */ });
  console.log("✅ Email sent");
} catch (error) {
  console.error("❌ Email failed:", error.response.data);
}
```

### Issue: Supabase query returns empty

**Check**:
- Anon key has correct RLS permissions
- Query date filters are correct
- Table name matches exactly

**Fix**:
```javascript
// Add logging
console.log("Query params:", {
  created_at: targetDate.toISOString(),
  table: "leads"
});
```

### Issue: Workflow not triggering

**Check**:
- Workflow is deployed (not draft)
- Trigger polling interval (15 sec minimum)
- Supabase connection is active

## Cost Comparison

### Zapier Premium
- **Monthly**: $29.99
- **Annual**: ~$360

### Pipedream Free
- **Monthly**: $0
- **Limits**: 100K invocations/month
- **Estimated usage**: ~5K/month (well within limits)

### Annual Savings: $360 💰

## Support

If you need help:
- **Pipedream Docs**: https://pipedream.com/docs
- **Pipedream Community**: https://pipedream.com/community
- **Email**: support@justice-bot.com
