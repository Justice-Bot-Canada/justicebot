# Force Google to Refresh Cached Images

## ✅ What We Fixed

Your Open Graph image (the preview image that appears when sharing links on Google/Facebook/Twitter) has been updated:

- **Old:** `justice-bot-logo.jpeg` (outdated, showing green background)
- **New:** `og-image.jpg` (professional banner with "Justice-Bot - Free Legal Help Ontario")

The new image is **1200x630px** - the perfect size for social media sharing.

---

## 🔄 Force Google to Re-Crawl and Update Images

Google caches images for weeks or months. Here's how to force an immediate refresh:

### Method 1: URL Inspection Tool (Recommended)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property: `justice-bot.com`
3. Use the **URL Inspection Tool** (search bar at top)
4. Enter your homepage URL: `https://justice-bot.com/`
5. Click **"Request Indexing"**
6. Wait 2-7 days for Google to re-crawl

### Method 2: Test with Facebook Debugger

Facebook's debugger also forces a refresh and is faster to see results:

1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter: `https://justice-bot.com/`
3. Click **"Scrape Again"** button
4. You should immediately see the new image preview

### Method 3: Twitter Card Validator

1. Go to [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter: `https://justice-bot.com/`
3. Click **"Preview card"**
4. Should show updated image

---

## 📋 Pages Updated with New Image

All these pages now use the new professional OG image:

- ✅ Homepage (`/`)
- ✅ FAQ (`/faq`)
- ✅ Contact (`/contact`)
- ✅ Team (`/team`)
- ✅ Forms (`/forms`)
- ✅ All other pages (via `EnhancedSEO` component default)

---

## 🧪 Test Your Changes

### View Page Source
1. Go to https://justice-bot.com/
2. Right-click → "View Page Source"
3. Search for `og:image`
4. Should see: `<meta property="og:image" content="https://justice-bot.com/og-image.jpg" />`

### Use Online Tools
- [OpenGraph.xyz](https://www.opengraph.xyz/) - Preview how your link appears
- [Social Share Preview](https://socialsharepreview.com/) - See all platforms

---

## ⏱️ Timeline for Changes

| Platform | Refresh Time |
|----------|--------------|
| Facebook | Immediate (after using debugger) |
| Twitter | Immediate (after using card validator) |
| Google Search | 2-7 days (after requesting re-index) |
| LinkedIn | 3-7 days |
| WhatsApp | Immediate (clears on share) |

---

## 🚨 If Google Still Shows Old Image After 2 Weeks

### Check These:
1. **Clear your browser cache** - You might be seeing cached version
2. **Verify deployment** - Visit https://justice-bot.com/og-image.jpg directly
3. **Check robots.txt** - Make sure images aren't blocked from crawling
4. **Re-request indexing** - Do it again in Search Console

### Force Nuclear Option:
If all else fails, **rename the image file**:
1. Rename `og-image.jpg` to `og-image-v2.jpg`
2. Update all references in code
3. Re-deploy
4. Google will see it as a "new" image and fetch immediately

---

## 📊 Verify in Google Search Console

After 7 days, check if Google is using the new image:

1. Go to **URL Inspection** in Search Console
2. Test your homepage URL
3. Click **"View Tested Page"** → **Screenshot**
4. Should show the new blue/white professional image

---

## 🎨 Your New OG Image Details

- **File:** `public/og-image.jpg`
- **Dimensions:** 1200 x 630 pixels (perfect for all platforms)
- **Design:** Clean professional banner
  - Dark blue text on light gray background
  - "JusticeBot - Free Legal Help Ontario"
  - Scales of justice icon
  - No green colors
  - Modern, professional look

---

## 💡 Pro Tips

1. **Always use 1200x630px** for OG images (universal standard)
2. **Keep file size under 300KB** for fast loading
3. **Use absolute URLs** (https://justice-bot.com/og-image.jpg)
4. **Test changes** before expecting Google to update
5. **Be patient** - Google takes time, but it will update

---

## ✅ Action Items

**Do this today:**
1. Visit https://justice-bot.com/og-image.jpg - verify new image loads
2. Use Facebook Debugger to scrape and see new preview
3. Request re-indexing in Google Search Console

**Check in 7 days:**
1. Search "justice-bot.com" in Google
2. See if search result preview shows new image
3. Test sharing link on social media

---

**Questions?** The new image is deployed and ready - just needs Google to re-crawl!
