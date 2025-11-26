# Google Search Console Setup Guide

## ✅ What We Just Fixed

Your pages were showing duplicate titles in Google Search Console. We've now given each page unique, keyword-rich titles:

- **Homepage:** "Free Legal Help Ontario 2025 | AI Legal Assistant Canada - Justice-Bot"
- **FAQ:** "FAQ - Justice-Bot Pricing, Features & How It Works | Ontario Legal Help"
- **Contact:** "Contact Justice-Bot - Support, Partnerships & Media Inquiries"
- **Team:** "Our Team & Methodology - Built by Self-Rep Litigants | Justice-Bot"
- **Forms:** "Legal Forms Ontario - LTB, HRTO, Family & Small Claims Court | $29.99"

---

## 🚀 Next Steps in Google Search Console

### 1. Request Re-Indexing of Updated Pages

Google needs to know you've updated these pages. Here's how to force a re-crawl:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property: `justice-bot.com`
3. Use the **URL Inspection Tool** (top search bar)
4. Enter each URL one at a time:
   - `https://justice-bot.com/faq`
   - `https://justice-bot.com/contact`
   - `https://justice-bot.com/team`
   - `https://justice-bot.com/forms`
5. Click **"Request Indexing"** for each page
6. Wait 2-7 days for Google to re-crawl

### 2. Submit Updated Sitemap

Your sitemap has been updated with new dates (2025-01-26):

1. In Google Search Console, go to **Sitemaps** (left sidebar)
2. If `sitemap.xml` is already submitted, click the **X** to remove it
3. Re-submit: Enter `sitemap.xml` and click **Submit**
4. Check back in 24 hours to see if it's been processed

### 3. Verify Sitemap URL

Make sure your sitemap is accessible:
- Visit: https://justice-bot.com/sitemap.xml
- You should see XML code with all your pages
- If you see a 404 error, the file isn't deployed yet

---

## 📊 Monitoring Performance

### Track Your Keywords in Search Console

1. Go to **Performance** → **Search Results**
2. Click **+ New** → **Query** to filter by keywords:
   - "free legal help ontario"
   - "ltb forms"
   - "hrto application"
   - "small claims ontario"
   - "legal aid alternatives"

### Check Page-Specific Performance

1. Go to **Performance** → **Pages**
2. Filter by specific URLs to see:
   - Impressions (how often your page appears in search)
   - Clicks (how many people click through)
   - CTR (Click-Through Rate)
   - Average Position (where you rank)

### Monitor Coverage Issues

1. Go to **Coverage** or **Pages**
2. Look for:
   - ❌ **Errors** (fix these immediately!)
   - ⚠️ **Valid with warnings** (review and improve)
   - ✅ **Valid** (good to go!)

---

## 🔍 Expected Timeline

| Action | Timeline |
|--------|----------|
| Submit sitemap | Processed in 24-48 hours |
| Request indexing | Re-crawled in 2-7 days |
| See new titles in search | 7-14 days |
| Ranking improvements | 2-8 weeks |

**Note:** Google doesn't update instantly. Be patient!

---

## 🎯 What to Look For

### Before (What You Showed Me):
```
✅ Free Legal Help Ontario 2025 | AI Legal Assistant Canada - Justice-Bot
   https://justice-bot.com/

❌ Free Legal Help Ontario 2025 | AI Legal Assistant Canada - Justice-Bot
   https://justice-bot.com/team

❌ Free Legal Help Ontario 2025 | AI Legal Assistant Canada - Justice-Bot
   https://justice-bot.com/contact

❌ Free Legal Help Ontario 2025 | AI Legal Assistant Canada - Justice-Bot
   https://justice-bot.com/faq
```

### After (What You Should See in 7-14 Days):
```
✅ Free Legal Help Ontario 2025 | AI Legal Assistant Canada - Justice-Bot
   https://justice-bot.com/

✅ Our Team & Methodology - Built by Self-Rep Litigants | Justice-Bot
   https://justice-bot.com/team

✅ Contact Justice-Bot - Support, Partnerships & Media Inquiries
   https://justice-bot.com/contact

✅ FAQ - Justice-Bot Pricing, Features & How It Works | Ontario Legal Help
   https://justice-bot.com/faq
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Titles Still Showing as Duplicates After 2 Weeks

**Solution:**
1. Clear your browser cache
2. Check if the pages are actually updated (view page source, look for `<title>` tag)
3. Re-request indexing in GSC
4. Make sure your deployment went through (check https://justice-bot.com)

### Issue 2: "Sitemap could not be read"

**Solution:**
1. Verify sitemap URL works: https://justice-bot.com/sitemap.xml
2. Check for XML syntax errors (must be valid XML)
3. Ensure sitemap is publicly accessible (no auth required)
4. Submit again after fixing

### Issue 3: Pages Indexed But Not Ranking

**Solution:**
1. Wait longer (SEO takes time - 2-8 weeks)
2. Build backlinks (get other sites to link to you)
3. Add more content to pages (aim for 600+ words)
4. Improve page speed (use PageSpeed Insights)
5. Get social signals (share on social media)

---

## 🏆 SEO Quick Wins (Do These Next)

1. **Add Internal Links**
   - Link from homepage to FAQ, Contact, Team
   - Link between related pages
   - Use descriptive anchor text (not "click here")

2. **Optimize Images**
   - Add descriptive alt text to all images
   - Compress images (use WebP format)
   - Include keywords in alt text naturally

3. **Create Content**
   - Write 5 blog posts targeting high-volume keywords
   - Update existing pages with more detailed content
   - Add more FAQs (Google loves FAQ schema!)

4. **Get Backlinks**
   - Reach out to legal blogs
   - Submit to legal directories
   - Partner with community organizations
   - Write guest posts on legal websites

5. **Improve Page Speed**
   - Test on https://pagespeed.web.dev/
   - Target 90+ score on mobile
   - Lazy load images
   - Minify CSS/JS

---

## 📱 Mobile Optimization Check

1. Go to GSC → **Experience** → **Mobile Usability**
2. Check for mobile issues:
   - Text too small
   - Clickable elements too close
   - Content wider than screen
   - Viewport not set

Your site should be mobile-friendly already, but verify in GSC!

---

## 🎓 Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [How to Request Indexing](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Sitemap Guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

---

## 🚨 Action Items for You

**Do this today:**
1. ✅ Visit https://search.google.com/search-console
2. ✅ Verify sitemap is submitted: `sitemap.xml`
3. ✅ Request indexing for: `/faq`, `/contact`, `/team`, `/forms`

**Check back in 7 days:**
1. See if new titles appear in GSC
2. Check "Coverage" for any errors
3. Monitor "Performance" for ranking improvements

**Check back in 30 days:**
1. See if rankings improved
2. Adjust strategy based on data
3. Create new content for low-performing keywords

---

**Questions?** Let me know if you need help with any of these steps!
