# Railway Deployment Guide for Justice-Bot

## Prerequisites
- Railway account ([railway.app](https://railway.app))
- GitHub repository connected to Railway

## Deployment Steps

### 1. Create New Project on Railway
1. Go to Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your Justice-Bot repository

### 2. Configure Environment Variables

In Railway dashboard, add these environment variables:

#### Required - Supabase
```
SUPABASE_URL=https://vkzquzjtewqhcisvhsvg.supabase.co
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key
```

#### Required - PayPal
```
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_ENV=sandbox
```
*(Set PAYPAL_ENV=live for production)*

#### Optional - Server
```
PORT=8080
STATIC_DIR=/app/public
```
*(These have defaults, only override if needed)*

### 3. Deploy
Railway will automatically:
- Detect the Dockerfile
- Build the multi-stage image
- Deploy the application
- Assign a public URL

### 4. Post-Deployment

1. **Test Health Endpoint**
   - Visit `https://your-app.railway.app/health`
   - Should return "ok"

2. **Update Supabase Settings**
   - Add your Railway URL to Supabase allowed redirect URLs
   - Update CORS settings if needed

3. **Update Frontend Config**
   - Update `frontend/config.json` if deploying separately
   - Ensure API_BASE_URL points to correct backend

## Environment Variable Details

### Where to Find Supabase Secrets

1. **SUPABASE_JWT_SECRET**
   - Dashboard → Settings → API → JWT Secret

2. **SUPABASE_SERVICE_ROLE**
   - Dashboard → Settings → API → service_role key (secret)

### PayPal Configuration

- **Sandbox**: Use for testing
  - Get credentials from [developer.paypal.com](https://developer.paypal.com)
- **Live**: Use for production
  - Get credentials from [paypal.com](https://www.paypal.com/businessmanage/credentials/apiAccess)

## Monitoring

Railway provides:
- Automatic health checks via `/health` endpoint
- Logs in the deployment view
- Metrics and usage statistics

## Troubleshooting

### Build Fails
- Check Dockerfile syntax
- Ensure go.mod is committed
- Review build logs in Railway

### Runtime Errors
- Verify all environment variables are set
- Check application logs in Railway
- Test health endpoint

### Static Files Not Loading
- Ensure frontend files are in `./frontend` directory
- Verify STATIC_DIR environment variable
- Check Dockerfile COPY commands

## Custom Domain

1. Go to your Railway service
2. Click "Settings"
3. Scroll to "Domains"
4. Add your custom domain
5. Update DNS records as instructed

## Scaling

Railway automatically scales based on:
- CPU usage
- Memory usage
- Request volume

Configure scaling limits in service settings.

## Support

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
