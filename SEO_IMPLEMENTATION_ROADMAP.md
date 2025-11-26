# SEO Implementation Roadmap - Justice-Bot

## ✅ Completed (Phase 1)

### Core Infrastructure
- ✅ XML Sitemap created at `/sitemap.xml` with all major pages
- ✅ Robots.txt configured with proper crawl rules
- ✅ Canonical URLs implemented via `EnhancedSEO` component
- ✅ EnhancedSEO component with comprehensive meta tags
- ✅ Open Graph & Twitter Card support
- ✅ Structured data (Organization, Website, FAQ schemas)

### Key Pages Enhanced
- ✅ **Homepage** - Full SEO with LegalService schema, FAQ, breadcrumbs
- ✅ **Forms Page** - Enhanced with case-based filtering + SEO optimization
- ✅ **Sitemap** - Updated with current dates

### Smart Features
- ✅ **Case-Based Form Organization** - Forms now filter by user's active case types
- ✅ Shows relevant forms first, option to view all
- ✅ Reduces cognitive load, improves UX

---

## 🚀 Phase 2: Journey Pages SEO (NEXT PRIORITY)

These high-traffic pages need HowTo schema + enhanced SEO:

### High Priority Journey Pages
- [ ] `/ltb-journey` - LTB tenant applications guide
- [ ] `/hrto-journey` - Human rights tribunal process
- [ ] `/small-claims-journey` - Small claims filing steps
- [ ] `/family-journey` - Family court procedures
- [ ] `/criminal-journey` - Criminal court navigation

**Implementation for Each:**
```tsx
<EnhancedSEO
  title="[Specific Journey] Guide 2025 | Step-by-Step Ontario Legal Help"
  description="Complete guide to [journey]. Step-by-step instructions, forms needed, timelines, and AI assistance. Free tools + $19/month for full access."
  keywords="[journey] Ontario, [journey] forms, how to [action], [tribunal] guide"
  canonicalUrl="https://justice-bot.com/[journey-slug]"
  structuredData={howToSchema}
  faqData={journeyFAQs}
  breadcrumbs={breadcrumbs}
/>
```

**HowTo Schema Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to File an LTB Application in Ontario",
  "description": "Step-by-step guide to filing a tenant application with the Landlord and Tenant Board",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Gather Required Documents",
      "text": "Collect your lease agreement, rent receipts, photos of issues, and any written communication with your landlord."
    },
    {
      "@type": "HowToStep",
      "name": "Choose the Right Form",
      "text": "Select Form T2 for maintenance issues, Form T6 for illegal rent increases, or Form T5 for harassment claims."
    },
    // ... more steps
  ]
}
```

---

## 📈 Phase 3: Content Marketing & Blog System

### Blog Infrastructure Needed
- [ ] Create `src/pages/BlogPost.tsx` - Dynamic blog post page
- [ ] Add Article schema to blog posts
- [ ] Implement blog post listing with pagination
- [ ] Add blog categories: LTB, HRTO, Family Law, Small Claims, Legal Rights

### Initial Blog Posts (SEO Keywords)
1. **"LTB T2 Form Guide 2025: Step-by-Step Filing Instructions"**
   - Target: "ltb t2 form", "tenant application guide"
2. **"How Long Does HRTO Take? Timeline & What to Expect"**
   - Target: "hrto timeline", "human rights complaint process"
3. **"Small Claims Court Costs Ontario 2025: Filing Fees & Expenses"**
   - Target: "small claims fees Ontario", "court costs"
4. **"Free Legal Aid Alternatives in Ontario: Save Thousands on Lawyers"**
   - Target: "free legal help Ontario", "legal aid alternatives"
5. **"How to Represent Yourself in Family Court Ontario"**
   - Target: "self-represent family court", "family law Ontario"

### Blog SEO Requirements
- Article schema with author, published date, modified date
- Featured images (1200x630px for social sharing)
- Related posts section
- Comment system (optional)
- Newsletter opt-in at bottom of posts

---

## 🎯 Phase 4: Technical SEO Enhancements

### Performance Optimization
- [ ] Implement lazy loading for images (already started)
- [ ] Add image optimization (WebP format)
- [ ] Minify CSS/JS bundles
- [ ] Enable Gzip/Brotli compression
- [ ] Add service worker for offline support
- [ ] **Target: 90+ PageSpeed score**

### Advanced Schema Markup
- [ ] LocalBusiness schema for service areas
- [ ] BreadcrumbList for all pages
- [ ] FAQPage for FAQ section
- [ ] VideoObject for tutorial videos
- [ ] Review/Rating schema for testimonials

### Internal Linking Strategy
- [ ] Add "Related Resources" sections to all pages
- [ ] Implement automatic internal link suggestions
- [ ] Create cornerstone content hub pages
- [ ] Add "Popular Topics" widget

---

## 🌍 Phase 5: Local SEO (Ontario Focus)

### Location-Based Landing Pages
Create city/region specific pages:
- [ ] `/toronto-ltb-help` - Toronto landlord tenant help
- [ ] `/ottawa-legal-services` - Ottawa legal services
- [ ] `/mississauga-small-claims` - Mississauga small claims
- [ ] `/hamilton-family-court` - Hamilton family court
- [ ] `/brampton-legal-help` - Brampton legal assistance

**Each page needs:**
- LocalBusiness schema with address
- City-specific FAQ
- Local court/tribunal contact info
- Google My Business integration

### Google My Business
- [ ] Create/claim GMB listing
- [ ] Add service areas (Ontario cities)
- [ ] Add business hours (24/7 online service)
- [ ] Upload photos
- [ ] Collect and respond to reviews

---

## 📊 Phase 6: Conversion & Growth Optimization

### Email Capture & Nurture
- [ ] Exit-intent popup with lead magnet
- [ ] Email sequence for new signups (5-7 emails)
- [ ] Newsletter with legal tips (weekly)
- [ ] Abandoned cart recovery for forms

### A/B Testing Framework
- [ ] Test hero CTA variations
- [ ] Test pricing page layouts
- [ ] Test form paywall messaging
- [ ] Test free vs paid positioning

### Analytics & Tracking
- [ ] Google Analytics 4 setup
- [ ] Conversion tracking (form purchases, signups)
- [ ] Heatmap tracking (Hotjar/Microsoft Clarity)
- [ ] Search Console monitoring
- [ ] Rank tracking for target keywords

---

## 🔍 Target Keywords by Priority

### Tier 1 (High Volume, High Intent)
- "free legal help Ontario" (2,400/mo)
- "legal aid alternatives Canada" (880/mo)
- "LTB forms" (1,900/mo)
- "small claims court Ontario" (3,600/mo)
- "family court forms Ontario" (720/mo)

### Tier 2 (Medium Volume, Specific)
- "how to file LTB application" (590/mo)
- "HRTO complaint process" (320/mo)
- "tenant rights Ontario" (2,900/mo)
- "wrongful dismissal Ontario" (1,600/mo)
- "how much does a lawyer cost Canada" (1,300/mo)

### Tier 3 (Long-tail, High Conversion)
- "LTB T2 form guide"
- "represent yourself family court"
- "free legal forms Ontario"
- "AI legal assistant Canada"
- "affordable lawyer alternative"

---

## 📅 Implementation Timeline

### Week 1-2: Journey Pages SEO
- Add EnhancedSEO to all 5 major journey pages
- Implement HowTo schema
- Add journey-specific FAQs
- Update sitemap

### Week 3-4: Blog System
- Build blog infrastructure
- Write and publish 5 initial posts
- Set up Article schema
- Create blog listing page

### Week 5-6: Performance & Technical SEO
- Optimize images
- Implement lazy loading
- Add remaining schema types
- Internal linking audit

### Week 7-8: Local SEO & Location Pages
- Create 5 city landing pages
- Set up Google My Business
- Add LocalBusiness schema

### Month 3+: Content Marketing & Growth
- Publish 2 blog posts per week
- Email nurture sequences
- A/B testing
- Link building outreach

---

## 🎓 SEO Best Practices Checklist

### Every New Page Must Have:
- ✅ Unique, keyword-rich title (50-60 chars)
- ✅ Compelling meta description (150-160 chars)
- ✅ Single H1 tag with primary keyword
- ✅ Semantic HTML structure (H2, H3 hierarchy)
- ✅ Canonical URL
- ✅ Open Graph tags
- ✅ Structured data (when applicable)
- ✅ Internal links to related pages
- ✅ Optimized images with alt text
- ✅ Mobile-responsive design

### Content Quality Rules:
- Minimum 600 words for blog posts
- Include LSI keywords naturally
- Answer user questions directly
- Add actionable steps/CTA
- Update regularly (show freshness)

---

## 🚨 Critical Next Steps

1. **Implement Journey Pages SEO** (Highest ROI)
   - These pages already have traffic
   - HowTo schema = rich results = higher CTR

2. **Start Blog with 5 Posts** (Build Authority)
   - Target high-volume keywords
   - Answer common user questions
   - Build topical authority

3. **Set Up Google Search Console** (Monitor Performance)
   - Submit updated sitemap
   - Monitor for indexing issues
   - Track keyword rankings

4. **Fix Any Existing Issues**
   - Run site through Google PageSpeed
   - Check mobile usability
   - Verify all schema validates

---

## 📞 Support Resources

- [Google Search Console](https://search.google.com/search-console)
- [Schema.org Documentation](https://schema.org/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

**Next Action:** Implement Phase 2 (Journey Pages SEO) for immediate traffic boost.
