# Vercel Deployment

Deploy ShipSafe to Vercel, the recommended hosting platform for Next.js applications.

## Overview

Vercel is the optimal hosting platform for Next.js apps. It provides:
- **Zero-config deployment** - Automatic optimization for Next.js
- **Global CDN** - Fast loading times worldwide
- **HTTPS by default** - Secure connections automatically
- **Environment variables** - Easy configuration management
- **Preview deployments** - Test changes before production

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- ShipSafe code pushed to GitHub repository
- All environment variables ready

## Setup Steps

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Sign up with your GitHub account
4. Authorize Vercel to access your repositories

### Step 2: Import Your Repository

1. Click **Add New Project** in Vercel dashboard
2. Select your ShipSafe repository from GitHub
3. Click **Import**

### Step 3: Configure Project Settings

Vercel will auto-detect Next.js, but verify these settings:

**Framework Preset:**
- Select **Next.js**

**Root Directory:**
- Leave as `.` (root of repository)

**Build Command:**
- `npm run build` (default, should be auto-filled)

**Output Directory:**
- Leave default (`.next` is automatic for Next.js)

**Install Command:**
- `npm install` (default)

**Development Command:**
- `npm run dev` (default)

### Step 4: Set Environment Variables

**Critical:** Set all environment variables before deploying!

1. In project settings, go to **Settings** → **Environment Variables**
2. Add each variable from your `.env.local`:

**Firebase Variables:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

**Stripe Variables:**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
```

**App Variables:**
```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Important Notes:**
- Use **Production** environment for production deployments
- Use **Preview** environment for pull request previews
- Use **Development** environment for development branches
- Click **Save** after adding each variable

See [Environment Setup Guide](./environment-setup) for complete list.

### Step 5: Deploy

1. Click **Deploy** button
2. Wait for build to complete (usually 1-3 minutes)
3. Your app will be live at `your-project.vercel.app`

**First deployment:**
- Vercel will install dependencies
- Run build command
- Deploy to production
- Provide deployment URL

### Step 6: Configure Custom Domain

1. Go to **Settings** → **Domains**
2. Enter your domain (e.g., `yourdomain.com`)
3. Click **Add**
4. Configure DNS records as shown:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or add A record if using apex domain
5. Wait for DNS propagation (can take up to 48 hours)
6. Vercel automatically provisions SSL certificate

**DNS Configuration:**

For subdomain (www.yourdomain.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

For apex domain (yourdomain.com):
```
Type: A
Name: @
Value: 76.76.21.21
```

## Post-Deployment Configuration

### 1. Update Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain: `your-project.vercel.app`
5. Add your custom domain: `yourdomain.com`

### 2. Update Stripe Webhook URL

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Edit your webhook endpoint
4. Update URL to: `https://yourdomain.com/api/webhooks/stripe`
5. Save changes

### 3. Update config.ts Domain

Update `domainName` in `config.ts`:

```typescript
// config.ts
const config = {
  domainName: "yourdomain.com",  // Update this
  // ...
};
```

## Production Checklist

Before going live, verify:

- [ ] All environment variables set in Vercel
- [ ] Custom domain configured and working
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Firebase authorized domains updated
- [ ] Stripe webhook URL updated to production domain
- [ ] `config.ts` domain updated
- [ ] Test authentication flow
- [ ] Test checkout flow
- [ ] Test webhook delivery
- [ ] Error tracking configured (if using)
- [ ] Analytics configured (if using)

## Continuous Deployment

Vercel automatically deploys:
- **Production** - Pushes to `main` branch
- **Preview** - Pull requests and feature branches

**Workflow:**
1. Push to `main` → Production deployment
2. Create pull request → Preview deployment
3. Merge PR → Production deployment

## Environment Variables Management

### Production vs Preview

Set different variables for different environments:

1. Go to **Settings** → **Environment Variables**
2. Select environment when adding variable:
   - **Production** - Live site
   - **Preview** - Pull request previews
   - **Development** - Development branches

**Common practice:**
- Use production Stripe keys for Production environment
- Use test Stripe keys for Preview environment

## Monitoring & Logs

### View Deployment Logs

1. Go to project dashboard
2. Click on a deployment
3. View build logs and runtime logs

### Function Logs

1. Go to **Functions** tab
2. View API route logs
3. Debug errors in real-time

## Troubleshooting

### Build Fails

**Common issues:**
- Missing environment variables
- TypeScript errors
- Missing dependencies

**Solution:**
- Check build logs in Vercel dashboard
- Fix errors locally first
- Ensure all dependencies in `package.json`

### Environment Variables Not Working

**Common issues:**
- Variables not saved properly
- Wrong environment selected
- Typos in variable names

**Solution:**
- Verify variables in dashboard
- Redeploy after adding variables
- Check variable names match code exactly

### Domain Not Working

**Common issues:**
- DNS not propagated
- Incorrect DNS records
- SSL certificate not issued

**Solution:**
- Wait 24-48 hours for DNS propagation
- Verify DNS records with online tools
- Check Vercel domain settings

## Tips

- **Use preview deployments** - Test changes before merging to main
- **Monitor builds** - Set up notifications for failed deployments
- **Environment variables** - Keep production keys secure, never commit to Git
- **Domain setup** - Use Vercel's domain management for easier configuration
- **Performance** - Vercel automatically optimizes Next.js apps

## Learn More

- [Environment Setup](./environment-setup) - Complete environment variable guide
- [Security Checklist](./security) - Production security best practices
- [Vercel Documentation](https://vercel.com/docs) - Official Vercel docs
- [Next.js Deployment](https://nextjs.org/docs/deployment) - Next.js deployment guide

