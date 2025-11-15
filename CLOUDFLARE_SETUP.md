# Cloudflare Pages Setup for Justice-Bot

## Build Configuration

In your Cloudflare Pages project settings, use these exact values:

### Build Settings
- **Framework preset:** None (or Vite)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave empty or use root)
- **Node version:** 18 or later

### Environment Variables
Make sure you have these set in Cloudflare Pages:
- `NODE_VERSION=18`

## Important Notes

1. **Monorepo Structure:** This project has both a Go backend and React frontend in the same repo
2. **Frontend is in root:** The React app is built from the project root, not from `/frontend` subdirectory
3. **Output is `/dist`:** Vite builds the production bundle to `/dist` directory

## Troubleshooting

If you see only a loading spinner:
1. Check browser console for errors (F12)
2. Verify build completed successfully in Cloudflare Pages deployment logs
3. Ensure DNS is pointing to Cloudflare Pages IP: `185.158.133.1`
4. Wait up to 5 minutes for DNS propagation after deployment
5. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Deploy Process

1. Push code to GitHub
2. Cloudflare Pages auto-detects the push
3. Runs `npm install` → `npm run build`
4. Deploys contents of `/dist` folder
5. Site should be live at your custom domain

## DNS Setup

Your DNS records should look like this:
```
Type: A
Name: @
Value: 185.158.133.1

Type: A  
Name: www
Value: 185.158.133.1

Type: CNAME
Name: @
Value: your-project.pages.dev (if using CNAME instead of A record)
```
