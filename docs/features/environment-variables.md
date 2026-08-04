# Environment Variables

Complete guide to all environment variables required by ShipSafe.

## Overview

ShipSafe uses environment variables to store sensitive configuration like API keys, database credentials, and service account secrets. All sensitive values are stored in `.env.local` (never committed to Git) and are securely injected at runtime.

**Why environment variables:**
- **Security** - Secrets never exposed in code
- **Flexibility** - Different values for dev/staging/production
- **Best practice** - Industry standard for configuration management

## Setup

### Step 1: Create Environment File

Copy the example file to create your local environment file:

```bash
cp .env.example .env.local
```

### Step 2: Fill in Required Values

Open `.env.local` and add all required variables (see sections below).

### Step 3: Verify Setup

Never commit `.env.local` to Git - it's already in `.gitignore`. Restart your development server after making changes:

```bash
npm run dev
```

## Required Variables

### Firebase Client (Public)

These variables are prefixed with `NEXT_PUBLIC_` because they're safe to expose to the browser.

```bash
# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX  # Optional: for Analytics
```

**Where to find:**
- Firebase Console → Project Settings → General → Your apps

### Firebase Admin (Server-Only)

These are server-side secrets and must never be exposed to the client.

```bash
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

**Where to find:**
- Firebase Console → Project Settings → Service Accounts → Generate New Private Key

**Important:** The `FIREBASE_PRIVATE_KEY` must include the newlines escaped as `\n` in the string.

### Stripe Configuration

Stripe API keys and price IDs for payment processing.

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_51...  # Use sk_live_... in production
STRIPE_PUBLIC_KEY=pk_test_51...  # Use pk_live_... in production
STRIPE_WEBHOOK_SECRET=whsec_...  # Different for local vs production

# Stripe Price IDs
STRIPE_PRICE_STARTER=price_1234567890abcdef
STRIPE_PRICE_PRO=price_abcdef1234567890
```

**Where to find:**
- Stripe Dashboard → Developers → API keys
- Stripe Dashboard → Products → Copy Price IDs

**Test vs Live:**
- Use `sk_test_` and `pk_test_` for development
- Use `sk_live_` and `pk_live_` for production
- Never mix test and live keys

### Application Configuration

```bash
# App Domain
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_APP_URL=https://yourdomain.com  # Production

# Node Environment
NODE_ENV=development  # or 'production'
```

## Optional Variables

### Support Email

```bash
# Support Email (used in footer, contact forms)
SUPPORT_EMAIL=support@yourdomain.com
```

Or configure in `config.ts` instead (recommended).

### Analytics (Optional)

```bash
# Google Analytics (if implemented)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Other analytics services
# ANALYTICS_ID=...
```

## Environment Variable Prefixes

### `NEXT_PUBLIC_*`

Variables prefixed with `NEXT_PUBLIC_` are:
- ✅ Safe to expose to the browser
- ✅ Included in client-side bundles
- ✅ Accessible via `process.env.NEXT_PUBLIC_*`

**Examples:** Firebase client config, public Stripe key, app URL

### Without Prefix

Variables without prefix are:
- 🔒 Server-only secrets
- 🔒 Never exposed to client
- 🔒 Only accessible in API routes and server components

**Examples:** Stripe secret key, Firebase admin private key

## Security Best Practices

### 1. Never Commit Secrets

- ✅ `.env.local` is in `.gitignore` (already configured)
- ❌ Never commit `.env.local` to Git
- ✅ Use `.env.example` as a template (without real values)

### 2. Use Different Keys per Environment

**Development:**
- Use Stripe test keys (`sk_test_`, `pk_test_`)
- Use Firebase test project

**Production:**
- Use Stripe live keys (`sk_live_`, `pk_live_`)
- Use Firebase production project
- Store secrets in hosting platform (Vercel, etc.)

### 3. Rotate Keys Regularly

- Change API keys periodically
- Revoke old keys when rotating
- Update environment variables in all environments

### 4. Store Production Secrets Securely

**Vercel:**
- Settings → Environment Variables
- Set per environment (Production, Preview, Development)

**Other platforms:**
- Use platform's secret management
- Never hardcode secrets in code

## Getting Values

### Firebase Setup

See [Firebase Setup Guide](./firebase-setup) for detailed instructions on:
- Creating Firebase project
- Getting client config
- Generating service account key

### Stripe Setup

See [Stripe Setup Guide](./stripe-setup) for detailed instructions on:
- Creating Stripe account
- Getting API keys
- Creating products and prices
- Setting up webhooks

## Troubleshooting

### Variables Not Loading

**Issue:** Environment variables not available in code

**Solutions:**
1. **Restart dev server** - Variables only load on startup
2. **Check file name** - Must be exactly `.env.local` (not `.env`)
3. **Check location** - Must be in project root (same folder as `package.json`)
4. **Verify syntax** - No spaces around `=` sign: `KEY=value` not `KEY = value`

### Client Variables Not Available

**Issue:** `NEXT_PUBLIC_*` variables not accessible in browser

**Solutions:**
1. **Check prefix** - Must start with `NEXT_PUBLIC_`
2. **Rebuild** - Run `npm run build` for production
3. **Restart server** - Variables load at build time

### Private Key Format Error

**Issue:** Firebase private key causing errors

**Solutions:**
1. **Include newlines** - Must have `\n` escaped: `"-----BEGIN...\n...\n-----END..."`
2. **Keep quotes** - Wrap entire key in quotes
3. **Copy exactly** - Don't modify the key format

### Stripe Keys Not Working

**Issue:** Stripe API calls failing

**Solutions:**
1. **Check key format** - Must start with `sk_test_` or `sk_live_`
2. **Match environments** - Don't mix test and live keys
3. **Verify key is active** - Check Stripe Dashboard

## Example `.env.local`

```bash
# ============================================
# Firebase Client (Public)
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# ============================================
# Firebase Admin (Server-Only)
# ============================================
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# ============================================
# Stripe
# ============================================
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLIC_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_1234567890abcdef
STRIPE_PRICE_PRO=price_abcdef1234567890

# ============================================
# Application
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Learn More

- [Firebase Setup](./firebase-setup) - Complete Firebase configuration guide
- [Stripe Setup](./stripe-setup) - Complete Stripe configuration guide
- [Deployment Environment Setup](../deployment/environment-setup) - Production configuration
- [Security Features](../security/overview) - Security best practices

