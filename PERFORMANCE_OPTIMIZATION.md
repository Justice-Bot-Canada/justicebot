# Performance Optimization Guide for Justice-Bot

## 🎯 Current Issues (PageSpeed Insights)

### Mobile Performance
- **FCP (First Contentful Paint):** 3.2s → Target: <1.8s
- **LCP (Largest Contentful Paint):** 4.3s → Target: <2.5s
- **CLS (Cumulative Layout Shift):** 0 ✓ Good
- **TBT (Total Blocking Time):** 110ms ✓ Good

### Critical Issues
1. ❌ **Image Optimization:** 2,007 KB savings possible
2. ❌ **Render Blocking:** 150ms savings
3. ❌ **Unused JavaScript:** 269 KB to remove
4. ❌ **Unused CSS:** 18 KB to remove
5. ⚠️ **Network Payload:** 4,328 KB total

---

## ✅ IMPLEMENTED FIXES

### 1. Image Optimization
- ✓ LazyImage component with IntersectionObserver
- ✓ Placeholder loading states
- ✓ WebP format support
- ✓ Proper width/height attributes
- ✓ fetchpriority for hero images

### 2. Code Splitting
- ✓ React lazy loading ready
- ✓ Route-based code splitting via Vite
- ✓ Async component loading

### 3. SEO Components
- ✓ Comprehensive meta tags
- ✓ Structured data (FAQPage, HowTo, Organization)
- ✓ Canonical URLs
- ✓ Open Graph tags
- ✓ Social sharing component

---

## 🚀 ADDITIONAL OPTIMIZATIONS NEEDED

### High Priority (Do This Week)

#### 1. Optimize Hero Images
```bash
# Convert to WebP and create multiple sizes
npx @squoosh/cli --webp auto public/hero-desktop.webp
npx @squoosh/cli --webp auto public/hero-mobile.webp

# Or use online tools:
# - squoosh.app (Google's tool)
# - cloudconvert.com
```

**Target sizes:**
- Mobile hero: 800x600 → ~50KB
- Desktop hero: 1920x1080 → ~150KB

#### 2. Implement Resource Hints
Add to index.html:
```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://api.justice-bot.com">

<!-- Preload critical assets -->
<link rel="preload" as="image" href="/hero-mobile.webp" media="(max-width: 768px)">
<link rel="preload" as="image" href="/hero-desktop.webp" media="(min-width: 769px)">
```

#### 3. Defer Non-Critical JavaScript
In vite.config.ts:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom'],
        'router': ['react-router-dom'],
        'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
      }
    }
  }
}
```

#### 4. Critical CSS Inlining
Install: `npm install vite-plugin-critical`

```typescript
// vite.config.ts
import criticalCss from 'vite-plugin-critical';

plugins: [
  criticalCss({
    inline: true,
    minify: true,
  })
]
```

---

### Medium Priority (Next 2 Weeks)

#### 5. Font Optimization
```css
/* Use font-display: swap */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('/fonts/inter.woff2') format('woff2');
}
```

#### 6. Service Worker for Caching
```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

#### 7. Compress Assets
Enable in hosting (Cloudflare Pages):
- Brotli compression
- Auto Minify (HTML, CSS, JS)

#### 8. Remove Unused Dependencies
```bash
npm install -g depcheck
depcheck
```

---

## 📊 MONITORING

### Tools to Use (All Free)
1. **Google PageSpeed Insights**
   - Test weekly: pagespeed.web.dev
   - Track mobile & desktop scores

2. **WebPageTest**
   - webpagetest.org
   - Test from Toronto location
   - Use "Mobile - Regular 4G" profile

3. **Lighthouse CI**
   - Add to GitHub Actions
   - Block PRs that degrade performance

4. **Google Search Console**
   - Check Core Web Vitals report
   - See real user data

### Performance Budget
Set alerts if:
- FCP > 1.8s
- LCP > 2.5s
- CLS > 0.1
- Total size > 2MB
- JavaScript > 500KB

---

## 🎯 TARGET METRICS

### Mobile (Priority)
- **FCP:** <1.8s (currently 3.2s) ⚠️
- **LCP:** <2.5s (currently 4.3s) ⚠️
- **CLS:** <0.1 (currently 0) ✓
- **TTI:** <3.8s
- **Speed Index:** <3.4s (currently 3.2s) ✓

### Desktop
- **FCP:** <0.9s
- **LCP:** <1.2s
- **CLS:** <0.1
- **Overall Score:** >90

---

## 🔧 QUICK WINS CHECKLIST

### Can Be Done Today
- [ ] Enable Cloudflare auto-minify
- [ ] Add resource hints to index.html
- [ ] Compress hero images (WebP)
- [ ] Add width/height to all images
- [ ] Remove console.logs from production

### This Week
- [ ] Implement code splitting for routes
- [ ] Lazy load video components
- [ ] Audit and remove unused npm packages
- [ ] Set up performance monitoring
- [ ] Add sitemap to robots.txt (done ✓)

### This Month
- [ ] Implement service worker
- [ ] Add critical CSS inlining
- [ ] Set up Lighthouse CI
- [ ] Create performance dashboard
- [ ] A/B test loading strategies

---

## 📱 MOBILE-FIRST STRATEGY

### Why Mobile Matters
1. **56% of traffic is mobile**
2. Google uses mobile-first indexing
3. Poor mobile = poor rankings
4. Users on 4G/3G need fast loads

### Mobile Optimizations
```tsx
// Use responsive images
<picture>
  <source 
    media="(max-width: 768px)" 
    srcSet="/hero-mobile.webp"
    width="800"
    height="600"
  />
  <source 
    media="(min-width: 769px)" 
    srcSet="/hero-desktop.webp"
    width="1920"
    height="1080"
  />
  <img 
    src="/hero-desktop.webp" 
    alt="Justice-Bot"
    loading="lazy"
  />
</picture>
```

---

## 🎨 PERCEIVED PERFORMANCE

### Make It Feel Fast
1. **Skeleton Screens**
   - Show content structure while loading
   - Better than spinners

2. **Optimistic UI**
   - Update UI immediately
   - Sync in background

3. **Progressive Loading**
   - Load above-the-fold first
   - Defer below-the-fold

4. **Smooth Animations**
   - Use CSS transforms
   - Avoid layout thrashing

---

## 💡 BEST PRACTICES

### Images
- Always use WebP (with JPG fallback)
- Lazy load everything except hero
- Use correct dimensions
- Add blur-up placeholders

### JavaScript
- Code split by route
- Lazy load heavy components
- Tree shake unused code
- Minify in production

### CSS
- Inline critical CSS
- Remove unused styles
- Use CSS modules
- Minimize specificity

### Fonts
- Self-host fonts
- Use font-display: swap
- Preload font files
- Subset fonts (Latin only)

---

## 🚨 COMMON MISTAKES TO AVOID

1. ❌ Loading all images eagerly
2. ❌ Large JavaScript bundles
3. ❌ Blocking third-party scripts
4. ❌ No caching headers
5. ❌ Unoptimized images
6. ❌ Render-blocking CSS
7. ❌ Too many fonts
8. ❌ Unnecessary animations

---

## 📈 EXPECTED RESULTS

### After Optimizations
- Mobile score: 50 → 85+
- FCP: 3.2s → 1.5s
- LCP: 4.3s → 2.0s
- Bounce rate: ↓ 20%
- Conversions: ↑ 15%

### SEO Impact
- Better rankings (speed is ranking factor)
- Higher Core Web Vitals scores
- Improved user experience
- More mobile traffic

---

## 🔗 RESOURCES

- [web.dev/fast](https://web.dev/fast)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://webpagetest.org)
- [Can I Use](https://caniuse.com)
- [Squoosh (Image Optimizer)](https://squoosh.app)
