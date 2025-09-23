# Justice‑Bot Frontend (Monorepo)
Static frontend that lives in `/frontend` of your existing repo. Deploy with Cloudflare Pages using the **Root Directory** setting.

## Files
- `frontend/index.html` — single‑file app (Supabase Auth + API calls)
- `frontend/config.json` — public config you can edit without touching HTML

## Fill these values
Edit `frontend/config.json`:
- `SUPABASE_URL`: your Supabase project URL
- `SUPABASE_ANON_KEY`: your anon (public) key
- `API_BASE_URL`: your Railway API + `/api` (e.g., `https://xyz.up.railway.app/api`)

## Cloudflare Pages
- Create Project → Connect to GitHub → choose this repo
- **Root Directory**: `frontend`
- Build command: *(leave blank)*
- Output directory: `/`

## Railway (backend)
- Add CORS to include your Pages domain: `CORS_ALLOWED=https://<your>.pages.dev,https://justice-bot.com`
- Do **not** expose secrets in `config.json`. Keep PayPal keys, DB URL, JWT secret on Railway only.
