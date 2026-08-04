# Deployment Getting Started

Complete guide to deploying ShipSafe to production, covering prerequisites, preparation, and post-deployment verification.

## Overview

This guide walks you through the complete deployment process from preparation to going live. ShipSafe is optimized for deployment on modern hosting platforms like Vercel, but works with any Next.js-compatible host.

**What You'll Learn:**
- Pre-deployment preparation
- Hosting platform selection
- Environment configuration
- Post-deployment verification
- Production checklist

## Prerequisites

### Required

- ✅ **Production-ready code** - All features tested and working
- ✅ **GitHub repository** - Code pushed to Git (for most platforms)
- ✅ **Hosting provider account** - Vercel, Netlify, Railway, etc.
- ✅ **Domain name** (optional but recommended)

### Recommended

- ✅ **Firebase production project** - Separate from development
- ✅ **Stripe production account** - Live mode configured
- ✅ **Error tracking** - Sentry or similar service
- ✅ **Analytics** - Vercel Analytics or Google Analytics

## Pre-Deployment Preparation

### Step 1: Code Review

Ensure your code is production-ready:

```bash
# Run tests (if you have them)
npm test

# Check for TypeScript errors
npm run build

# Verify no console errors
npm run dev
# Test all features in browser
```

**Checklist:**
- [ ] No TypeScript errors
- [ ] Build succeeds without warnings
- [ ] All features tested locally
- [ ] No hardcoded development values

### Step 2: Environment Variables

Prepare all environment variables:

**Local Testing:**
```bash
# Create .env.local with production values
cp .env.example .env.local
# Fill in all required variables
```

**See:** [Environment Setup Guide](./environment-setup) for complete list

### Step 3: Configuration Update

Update `config.ts` for production:

```typescript
// config.ts
const config = {
  appName: "Your App Name",
  domainName: "yourdomain.com", // ✅ Update for production
  supportEmail: "support@yourdomain.com", // ✅ Update
  // ...
};
```

### Step 4: Firebase Configuration

**Production Firebase Project:**

1. Create separate Firebase project for production
2. Enable Authentication (Email/Password, Google)
3. Create Firestore database
4. Configure authorized domains:
   - `yourdomain.com`
   - `www.yourdomain.com`
   - `*.vercel.app` (if using Vercel)

**Security Rules:**
- Update Firestore security rules for production
- Test rules with Firebase Rules Playground

### Step 5: Stripe Configuration

**Production Stripe Account:**

1. Switch to live mode in Stripe Dashboard
2. Create products and prices (copy Price IDs)
3. Configure webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`, etc.
4. Copy webhook signing secret

## Deployment Platforms

### Recommended: Vercel

**Why Vercel:**
- ✅ Optimized for Next.js
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments

**Quick Start:**
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables
4. Deploy

**See:** [Vercel Deployment Guide](./vercel) for detailed steps

### Alternative Platforms

**Netlify:**
- Good Next.js support
- Easy Git integration
- Free tier available

**Railway:**
- Simple deployment
- Good for full-stack apps
- Built-in databases

**Render:**
- Simple Git deployment
- Automatic SSL
- Free tier available

## Deployment Process

### General Steps (Any Platform)

1. **Connect Repository**
   - Link GitHub/GitLab repository
   - Select project directory

2. **Configure Build**
   - Build command: `npm run build`
   - Output directory: `.next` (automatic for Next.js)
   - Node version: 18+ or 20+

3. **Set Environment Variables**
   - Add all required variables
   - Use production values
   - Test with preview deployment first

4. **Deploy**
   - Trigger deployment
   - Wait for build to complete
   - Verify deployment URL works

### Vercel-Specific

**See:** [Vercel Deployment Guide](./vercel) for complete Vercel walkthrough

**Quick Steps:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Post-Deployment Configuration

### 1. Update Firebase Authorized Domains

After deployment, update Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your production project
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Add your deployment domain:
   - `your-project.vercel.app` (Vercel default)
   - `yourdomain.com` (custom domain)

### 2. Update Stripe Webhook URL

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Edit your webhook endpoint
4. Update URL to production:
   - `https://yourdomain.com/api/webhooks/stripe`
5. Copy new webhook signing secret
6. Update `STRIPE_WEBHOOK_SECRET` in hosting platform

### 3. Configure Custom Domain

**Vercel:**
1. Go to **Settings** → **Domains**
2. Add domain: `yourdomain.com`
3. Configure DNS as instructed:
   - CNAME: `www` → `cname.vercel-dns.com`
   - A record: `@` → `76.76.21.21` (apex domain)
4. Wait for DNS propagation (up to 48 hours)
5. SSL certificate auto-provisioned

**Other Platforms:**
- Follow platform-specific domain setup instructions
- Ensure SSL/HTTPS is enabled

### 4. Update config.ts Domain

Update `domainName` in your codebase:

```typescript
// config.ts
const config = {
  domainName: "yourdomain.com", // ✅ Update for production
  // ...
};
```

Commit and redeploy:

```bash
git add config.ts
git commit -m "Update domain for production"
git push
```

## Post-Deployment Verification

### Security Verification

1. **HTTPS Check:**
   ```bash
   curl -I https://yourdomain.com
   # Should show HTTPS redirect working
   ```

2. **Security Headers:**
   - Use [securityheaders.com](https://securityheaders.com/)
   - Verify all headers are present
   - Check HSTS is set

3. **Environment Variables:**
   - Verify production keys are used
   - Test that API calls work
   - Check Firebase Auth works

### Feature Verification

**Authentication:**
- [ ] Sign up flow works
- [ ] Login flow works
- [ ] Password reset works
- [ ] Google OAuth works (if enabled)

**Billing:**
- [ ] Pricing page loads
- [ ] Checkout redirects to Stripe
- [ ] Webhook receives events
- [ ] Subscription status updates

**Dashboard:**
- [ ] Protected routes require auth
- [ ] User data loads correctly
- [ ] Billing portal accessible

### Testing Checklist

```bash
# 1. Test Authentication
- Sign up new account
- Login with credentials
- Logout works

# 2. Test Checkout
- Click "Get Started" button
- Complete Stripe checkout
- Verify webhook received

# 3. Test Dashboard
- Access protected routes
- Verify subscription status
- Test billing portal

# 4. Test Error Handling
- Visit non-existent route (404)
- Test invalid API requests
- Verify error messages

# 5. Test Security
- Try accessing protected route without auth
- Verify rate limiting works
- Check security headers
```

## Production Checklist

### Pre-Deployment

- [ ] Code reviewed and tested
- [ ] Build succeeds without errors
- [ ] Environment variables prepared
- [ ] Firebase production project ready
- [ ] Stripe production account configured
- [ ] `config.ts` updated with production domain

### Deployment

- [ ] Repository connected to hosting platform
- [ ] Build configuration correct
- [ ] All environment variables set
- [ ] Deployment successful
- [ ] No build errors

### Post-Deployment

- [ ] Custom domain configured
- [ ] HTTPS/SSL working
- [ ] Firebase authorized domains updated
- [ ] Stripe webhook URL updated
- [ ] Security headers verified
- [ ] Authentication tested
- [ ] Checkout flow tested
- [ ] Webhooks receiving events

## Troubleshooting

### Build Fails

**Common Causes:**
- Missing environment variables
- TypeScript errors
- Missing dependencies

**Solutions:**
1. Check build logs in platform dashboard
2. Fix errors locally first
3. Verify all dependencies in `package.json`
4. Ensure Node version is compatible

### Authentication Not Working

**Common Causes:**
- Firebase authorized domains not updated
- Wrong Firebase project configured
- Environment variables incorrect

**Solutions:**
1. Verify authorized domains include deployment URL
2. Check Firebase config variables
3. Test locally with production Firebase project

### Payments Not Working

**Common Causes:**
- Wrong Stripe keys (test vs live)
- Webhook URL incorrect
- Price IDs don't match

**Solutions:**
1. Verify production Stripe keys are set
2. Check webhook URL matches deployment domain
3. Verify Price IDs match Stripe Dashboard

## Monitoring Setup

After deployment, set up monitoring:

1. **Error Tracking:**
   - Integrate Sentry or similar
   - Monitor API errors
   - Track client-side errors

2. **Analytics:**
   - Set up Vercel Analytics
   - Track user behavior
   - Monitor performance

3. **Logs:**
   - Review deployment logs
   - Monitor API route logs
   - Set up alerts for errors

**See:** [Monitoring Guide](./monitoring) for details

## Continuous Deployment

Most platforms support automatic deployments:

**Vercel:**
- Pushes to `main` → Production
- Pull requests → Preview deployments

**Workflow:**
1. Push to `main` branch
2. Platform automatically builds and deploys
3. Preview deployments for pull requests
4. Production deployment on merge

## Best Practices

### 1. Test Before Production

✅ **Do:**
- Test with preview deployments
- Verify all features work
- Check environment variables

### 2. Use Separate Environments

✅ **Do:**
- Separate Firebase projects (dev/prod)
- Separate Stripe accounts (test/live)
- Different environment variables per environment

### 3. Monitor Deployments

✅ **Do:**
- Set up error tracking
- Monitor build logs
- Review deployment metrics

## Learn More

- [Environment Setup](./environment-setup) - Complete environment variable guide
- [Vercel Deployment](./vercel) - Vercel-specific deployment
- [Security Checklist](./security) - Production security
- [Monitoring Guide](./monitoring) - Production monitoring
