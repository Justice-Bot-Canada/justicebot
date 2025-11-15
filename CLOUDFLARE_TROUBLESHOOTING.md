# 🚨 IMMEDIATE CLOUDFLARE FIXES

## ⚡ Quick Checklist - Do These NOW

### 1. Verify Build Settings in Cloudflare Pages
Go to: **Cloudflare Dashboard → Pages → Your Project → Settings → Build & Deployments**

✅ **Build command:** `npm run build`  
✅ **Build output directory:** `dist`  
✅ **Root directory:** `/` (or leave empty)  
✅ **Node version:** `18`

### 2. Add Environment Variables
Go to: **Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables**

Add these for **Production** environment:

```
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
NODE_VERSION=18
```

⚠️ **CRITICAL:** You must use your actual Supabase credentials! Get them from your Supabase project dashboard.

### 3. Redeploy After Adding Variables
After adding environment variables:
1. Go to **Deployments** tab
2. Click **"Retry deployment"** on the latest deployment
3. OR click **"Create deployment"** to trigger a fresh build

### 4. Check Build Logs
While deployment is running:
1. Click on the deployment
2. View **"Build log"**
3. Look for errors (red text)
4. Common errors:
   - Missing dependencies → Run `npm install` locally first
   - TypeScript errors → Check code for type issues
   - Out of memory → Increase Node memory in build settings

### 5. Test After Deployment
Once deployment succeeds:
1. Visit https://justice-bot.com (your custom domain)
2. Open browser console (F12)
3. Check for JavaScript errors
4. Look for failed network requests
5. Try navigating to different pages

## 🔍 Common Issues & Fixes

### Issue: Still Seeing Loading Spinner

**Fix:**
1. Open browser console (F12)
2. Look for errors related to:
   - Supabase connection
   - Missing environment variables
   - CORS errors
3. Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
4. Clear browser cache completely

### Issue: 404 on Page Refresh

**Fix:**
Your `public/_redirects` file already has the fix:
```
/* /index.html 200
```
If still not working:
1. Check build logs to ensure `_redirects` is copied to `dist`
2. Manually verify `_redirects` file exists in your repo's `public` folder
3. Redeploy from scratch

### Issue: Can't Connect to Supabase

**Fix:**
1. Verify environment variables are correct (no typos)
2. Check Supabase project is not paused/deleted
3. Test locally first: Add variables to `.env.local`:
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```
4. Run `npm run dev` and test if Supabase works

## 📊 View Build Status

### In Cloudflare:
1. **Deployments** tab shows:
   - ✅ Success (green) - Deployment worked
   - ❌ Failed (red) - Check build logs
   - 🟡 Building (yellow) - Wait for completion

### Build Log Should Show:
```
✓ built in 30s
✓ dist/index.html created
✓ Deployment complete
```

### If You See Errors:
```
ERROR: Cannot find module 'xyz'
→ Missing dependency, check package.json

ERROR: Type error in src/...
→ Fix TypeScript errors in code

ERROR: Build failed
→ Check full build log for specific error
```

## 🔄 Full Reset Process

If nothing works, try a complete reset:

### Step 1: Local Test
```bash
# Clean everything
rm -rf node_modules dist

# Fresh install
npm install

# Test build
npm run build

# Preview
npm run preview
```

### Step 2: If Local Works
```bash
# Push to GitHub
git add .
git commit -m "Fix Cloudflare deployment"
git push origin main
```

### Step 3: In Cloudflare
1. Go to **Settings → Build & Deployments**
2. Verify all settings match this guide
3. Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. Go to **Deployments**
5. Click **"Retry deployment"** or **"Create deployment"**

### Step 4: Wait & Watch
1. Watch build logs in real-time
2. Wait for "Deployment complete" message
3. Visit your site
4. Check browser console for errors

## 🆘 Emergency Contact

If still broken after trying everything:

1. **Share Build Logs:**
   - Copy full build log from Cloudflare
   - Look for red error messages
   - Share in Discord or support channel

2. **Share Browser Console:**
   - Open browser console (F12)
   - Take screenshot of errors
   - Include network tab (failed requests)

3. **Verify DNS:**
   ```bash
   # Run this in terminal
   nslookup justice-bot.com
   
   # Should return Cloudflare IP
   ```

## 💡 Pro Tips

1. **Always check build logs first** - Most issues are visible there
2. **Environment variables are #1 cause** - Double-check them
3. **Hard refresh after deployment** - Browser cache can cause issues
4. **Test locally before deploying** - Saves time debugging
5. **One change at a time** - Easier to identify what fixed it

---

**Your site IS working in Lovable** (verified by screenshot)  
**The issue is with Cloudflare deployment specifically**  
**Follow this checklist step-by-step** 

If you get stuck, share your:
- Build logs from Cloudflare
- Browser console errors
- Environment variables list (hide the actual keys!)
