# Justice-Bot Deployment Checklist

## ✅ Completed High-Impact Improvements

### SEO & Branding
- ✅ Brand disambiguation added (Footer, About page)
- ✅ robots.txt and sitemap.xml present and configured
- ✅ EnhancedSEO component with full meta tags, OG, Twitter cards
- ✅ Jurisdiction added to page titles (Ontario/Canada)
- ✅ Organization, Website, Product, FAQ schema implemented
- ✅ Breadcrumbs implemented on key pages

### Trust & Compliance
- ✅ Privacy, Terms, Liability pages created
- ✅ Legal disclaimers in footer
- ✅ AI disclaimer component created
- ✅ Disclaimer added to chatbot
- ✅ Low-income page enhanced with criteria and benefits

### Accessibility (WCAG 2.1 AA)
- ✅ Skip to content link added
- ✅ Semantic HTML (header, main, nav, footer)
- ✅ Alt text on hero and key images
- ✅ ARIA labels on interactive elements
- ✅ Landmark roles implemented
- ✅ High contrast toggle available

### Performance
- ✅ Font preload added (Inter font)
- ✅ DNS prefetch for Supabase and Stripe
- ✅ OptimizedImage component with lazy loading
- ✅ Performance monitoring enabled

### Security
- ✅ Security headers configured (HSTS, CSP, nosniff, referrer, permissions)
- ✅ CORS, COEP, COOP, CORP headers added

### Content & Structure
- ✅ Forms config centralized (src/config/forms.config.json)
- ✅ Journey pages enhanced with comprehensive info
- ✅ JourneyHeader component created
- ✅ Referrals page updated with eligibility, disclosure, standards
- ✅ 404 page enhanced

## 🔧 Manual Tasks Required

### Analytics Setup (High Priority)
1. **Add Google Analytics 4**
   - Create GA4 property at https://analytics.google.com
   - Get Measurement ID (G-XXXXXXXXXX)
   - Add to index.html:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX', {
       anonymize_ip: true,
       cookie_flags: 'SameSite=None;Secure'
     });
   </script>
   ```
   
2. **Or Add Plausible Analytics** (Privacy-friendly alternative)
   - Sign up at https://plausible.io
   - Add to index.html:
   ```html
   <script defer data-domain="justice-bot.com" src="https://plausible.io/js/script.js"></script>
   ```

3. **Verify Analytics Installation**
   - Use analytics.ts utility functions in components
   - Test event tracking in development console
   - Verify events in analytics dashboard

### Health Check Endpoint
1. **Create /healthz endpoint**
   - Railway backend should expose GET /healthz
   - Return: `{ "status": "ok", "timestamp": ISO8601 }`
   - Use for uptime monitoring

2. **Set up Uptime Monitoring**
   - Use Cloudflare Heartbeat, UptimeRobot, or similar
   - Monitor: https://api.justice-bot.com/healthz
   - Alert on failures

### Google Search Console
1. **Verify domain ownership**
   - Go to https://search.google.com/search-console
   - Add property: justice-bot.com
   - Verify via DNS TXT record or HTML file
   
2. **Submit sitemap**
   - Submit: https://justice-bot.com/sitemap.xml
   - Monitor indexing status
   - Check for crawl errors

### Content Enhancements
1. **Social Proof Section**
   - Add "As seen in" logos if available
   - Or add "Community-built in Canada" badge
   - Link to Facebook page and public updates

2. **Partner Standards**
   - Document partnership criteria
   - Add to /partners page if establishing referral network

### Form URL Monitoring (Optional but Recommended)
1. **CI/CD Check for Dead Links**
   - Add to GitHub Actions workflow:
   ```yaml
   - name: Check Court Form URLs
     run: |
       curl -f --head https://ontariocourtforms.on.ca/static/media/7a-e.pdf
       # Add checks for all URLs in forms.config.json
   ```

## 📊 Metrics to Track

### Key Performance Indicators
- Triage start rate
- Journey completion rate
- Form download rate
- Low-income application conversion
- Premium subscription conversion
- Bounce rate by page
- Time on site
- Core Web Vitals (LCP, FID, CLS)

### User Flow Tracking
- Triage → Journey → Form → Download
- Chat engagement
- Video completion rates
- Template downloads

## 🔍 Testing Checklist

### Manual Testing
- [ ] Test skip-to-content link (Tab key on load)
- [ ] Verify keyboard navigation on all forms
- [ ] Test screen reader on key pages
- [ ] Verify color contrast in dark mode
- [ ] Test mobile responsiveness
- [ ] Verify all external links open correctly
- [ ] Test form downloads from forms.config.json

### Performance Testing
- [ ] Run Lighthouse audit (target: 90+ on all metrics)
- [ ] Test page load speed on 3G
- [ ] Verify lazy loading of images
- [ ] Check bundle size

### SEO Testing
- [ ] Verify all pages have unique titles
- [ ] Check meta descriptions (150-160 chars)
- [ ] Validate structured data at https://search.google.com/test/rich-results
- [ ] Test social sharing (Twitter, LinkedIn, Facebook)
- [ ] Verify canonical URLs

## 🚀 Post-Deployment

### Week 1
- Monitor error logs
- Check analytics setup
- Verify uptime monitoring alerts
- Review user feedback

### Month 1
- Review search console for indexing issues
- Analyze top traffic sources
- Identify high-bounce pages
- Check form download rates

### Ongoing
- Update forms.config.json when court URLs change
- Monitor Core Web Vitals
- Review and respond to user feedback
- Update content for law changes

## 📝 Notes

- All changes are automatically syncing to GitHub
- Frontend deployed on Cloudflare Pages (justice-bot.com)
- Backend deployed on Railway (api.justice-bot.com)
- Environment variables managed via platform dashboards
- Security fixes to be implemented by user (separate task)
