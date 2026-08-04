# Environment Setup

Complete guide to configuring production environment variables in ShipSafe, with security best practices and troubleshooting.

## Overview

Environment variables store sensitive configuration like API keys, database credentials, and service account secrets. ShipSafe uses a secure environment variable system with validation and safe access patterns.

**Why Environment Variables:**
- ✅ **Security** - Secrets never exposed in code
- ✅ **Flexibility** - Different values for dev/staging/production
- ✅ **Best Practice** - Industry standard for configuration
- ✅ **Validation** - ShipSafe validates required variables at runtime

## Concept: Environment Variables

### How Environment Variables Work

Environment variables are key-value pairs set in the operating system or hosting platform:

```bash
# Example
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
STRIPE_SECRET_KEY=sk_live_...
```

**Access in Code:**
```typescript
// Client-side (NEXT_PUBLIC_ prefix required)
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Server-side (no prefix needed)
const secretKey = process.env.STRIPE_SECRET_KEY;
```

### Public vs Private Variables

**Public Variables (`NEXT_PUBLIC_*`):**
- Exposed to browser/client bundles
- Safe to include in JavaScript
- Examples: Firebase client config, Stripe public key

**Private Variables (no prefix):**
- Server-side only
- Never exposed to client
- Examples: Stripe secret key, Firebase private key

**ShipSafe's Secure Access:**

```typescript
// src/lib/security/env.ts
export function getEnv(name: string, fallback?: string): string {
  const value = process.env[name];

  if (!value) {
    if (fallback !== undefined) return fallback;

    // Fail fast if required variable is missing
    throw new Error(
      `❌ Missing required environment variable: ${name}
      
This variable is required for ShipSafe to run securely.
Add it to your .env.local or environment config.

Tip: Check [Environment Variables Documentation](/docs/features/environment-variables) for setup instructions.
`
    );
  }

  return value;
}
```

## Required Variables

### Firebase Client Configuration (Public)

These are safe to expose to the browser (prefixed with `NEXT_PUBLIC_`):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**How ShipSafe Uses Them:**

```typescript
// src/lib/firebase/client.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
```

**Where to Find:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** → **General**
4. Scroll to **Your apps** section
5. Copy config values

### Firebase Admin Configuration (Private)

These are server-side secrets and must never be exposed:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

**Important:** `FIREBASE_PRIVATE_KEY` must include escaped newlines (`\n`).

**How ShipSafe Uses Them:**

```typescript
// src/lib/firebase/init.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getEnv } from "@/lib/security/env";

// ShipSafe uses getEnv() helper for secure access
const adminApp = initializeApp({
  credential: cert({
    projectId: getEnv("FIREBASE_PROJECT_ID"),
    clientEmail: getEnv("FIREBASE_CLIENT_EMAIL"),
    privateKey: getEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL || undefined,
});
```

**Where to Find:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download JSON file
6. Extract values from JSON

**Security Note:**
- Never commit service account keys to Git
- Store securely in hosting platform
- Rotate keys regularly

### Stripe Configuration

**API Keys:**

```bash
# Test Mode (Development)
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLIC_KEY=pk_test_51...

# Live Mode (Production)
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_PUBLIC_KEY=pk_live_51...
```

**Webhook Secret:**

```bash
# Local Development (from Stripe CLI)
STRIPE_WEBHOOK_SECRET=whsec_...

# Production (from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Price IDs:**

```bash
# Test Mode Price IDs
STRIPE_PRICE_STARTER=price_test_...
STRIPE_PRICE_PRO=price_test_...

# Production Price IDs
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
```

**How ShipSafe Uses Them:**

```typescript
// src/lib/stripe/client.ts
import Stripe from "stripe";
import { getEnv } from "@/lib/security/env";

export function getStripeClient(): Stripe {
  const secretKey = getEnv("STRIPE_SECRET_KEY"); // Secure access with validation
  
  // Validate key format
  if (!secretKey.startsWith("sk_")) {
    throw new Error("Invalid Stripe secret key format");
  }

  return new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia", // Use latest stable version
    typescript: true,
  });
}
```

**Where to Find:**
- **API Keys:** Stripe Dashboard → **Developers** → **API keys**
- **Webhook Secret:** Stripe Dashboard → **Developers** → **Webhooks** → Click endpoint → **Signing secret**
- **Price IDs:** Stripe Dashboard → **Products** → Click product → Copy Price ID

### Application Configuration

```bash
# Production Domain
APP_DOMAIN=yourdomain.com

# Environment
NODE_ENV=production
```

**How ShipSafe Uses Them:**

```typescript
// config.ts
const config = {
  domainName: process.env.APP_DOMAIN || "shipsafe.st",
  // ...
};

// middleware.ts (HTTPS enforcement)
const isProd = process.env.NODE_ENV === "production";
```

## Setting Variables: Hosting Platform

### Vercel

**Via Dashboard:**

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter variable name and value
5. Select environment:
   - **Production** - Live site
   - **Preview** - Pull request previews
   - **Development** - Development branches
6. Click **Save**

**Via Vercel CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variable
vercel env add STRIPE_SECRET_KEY production
```

### Other Platforms

**Railway:**
1. Go to project dashboard
2. Click **Variables** tab
3. Add variables in format: `KEY=value`

**Render:**
1. Go to service dashboard
2. Navigate to **Environment** tab
3. Add variables

**Netlify:**
1. Go to site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add variables

## Security Best Practices

### 1. Never Commit Secrets

✅ **Do:**
- Add `.env.local` to `.gitignore`
- Use `.env.example` for documentation
- Store secrets in hosting platform

❌ **Don't:**
- Commit `.env.local` to Git
- Share secrets in code
- Store secrets in public repositories

### 2. Use Different Keys for Environments

✅ **Do:**
```bash
# Development
STRIPE_SECRET_KEY=sk_test_...

# Production
STRIPE_SECRET_KEY=sk_live_...
```

❌ **Don't:**
```bash
# Never use production keys in development
STRIPE_SECRET_KEY=sk_live_... # ❌ In .env.local
```

### 3. Rotate Keys Regularly

- ✅ Rotate keys every 90 days
- ✅ Revoke old keys after rotation
- ✅ Update keys in all environments
- ✅ Test after rotation

### 4. Validate Required Variables

ShipSafe validates environment variables:

```typescript
// src/lib/security/env.ts
export function getEnv(name: string, fallback?: string): string {
  const value = process.env[name];

  if (!value && fallback === undefined) {
    throw new Error(
      `❌ Missing required environment variable: ${name}`
    );
  }

  return value || fallback;
}
```

**Usage:**
```typescript
// Safe access with validation
const secretKey = getEnv("STRIPE_SECRET_KEY");
// ✅ Throws error if missing
```

## Formatting Special Values

### Firebase Private Key

The `FIREBASE_PRIVATE_KEY` must include escaped newlines:

```bash
# ❌ Wrong - Single line
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY----- MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC... -----END PRIVATE KEY-----"

# ✅ Correct - Escaped newlines
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Vercel:**
When adding in Vercel dashboard, paste the entire key including newlines - Vercel handles escaping automatically.

**Manual Formatting:**
```bash
# Extract from service account JSON
# Replace actual newlines with \n
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Multi-line Values

For multi-line values, use quotes:

```bash
# ✅ Quoted value
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ✅ Quoted value with spaces
APP_NAME="My Awesome App"
```

## Environment Variable Validation

### Boot-Time Validation

ShipSafe validates required variables when the app starts:

```typescript
// src/lib/security/env.ts
export function validateRequiredEnv(names: string[]) {
  for (const name of names) {
    if (!process.env[name]) {
      throw new Error(
        `❌ Environment variable "${name}" is missing!
        
ShipSafe requires this variable for secure operation.

Check your .env.example file for setup instructions.
`
      );
    }
  }
}
```

**Usage:**
```typescript
// Validate critical variables on startup
validateRequiredEnv([
  "STRIPE_SECRET_KEY",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
]);
```

### Runtime Validation

Access variables safely:

```typescript
// ✅ Safe: Use getEnv() helper
import { getEnv } from "@/lib/security/env";

const secretKey = getEnv("STRIPE_SECRET_KEY"); // Throws if missing

// ✅ Safe: Provide fallback
const apiKey = getEnv("API_KEY", "default-value");

// ❌ Unsafe: Direct access
const secretKey = process.env.STRIPE_SECRET_KEY; // Could be undefined
```

## Complete Variable Checklist

### Firebase Client (Public)

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

### Firebase Admin (Private)

- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `FIREBASE_PRIVATE_KEY` (with escaped newlines)
- [ ] `FIREBASE_DATABASE_URL`

### Stripe

- [ ] `STRIPE_SECRET_KEY` (test or live)
- [ ] `STRIPE_PUBLIC_KEY` (test or live)
- [ ] `STRIPE_WEBHOOK_SECRET` (per environment)
- [ ] `STRIPE_PRICE_STARTER`
- [ ] `STRIPE_PRICE_PRO`

### Application

- [ ] `APP_DOMAIN`
- [ ] `NODE_ENV`

### Optional

- [ ] `SENTRY_DSN` (for error tracking)
- [ ] Other service keys

## Troubleshooting

### Variable Not Found

**Problem:** `Missing required environment variable: STRIPE_SECRET_KEY`

**Solutions:**
1. Check variable name matches exactly (case-sensitive)
2. Verify variable is set in hosting platform
3. Redeploy after adding variables
4. Check environment (Production vs Preview)

### Private Key Format Error

**Problem:** Firebase Admin initialization fails

**Solutions:**
1. Ensure `FIREBASE_PRIVATE_KEY` includes `\n` for newlines
2. Check key is wrapped in quotes
3. Verify full key is present (including BEGIN/END markers)
4. Test locally with `.env.local` first

### Different Values in Preview vs Production

**Problem:** Preview deployments use wrong keys

**Solutions:**
1. Set variables for each environment separately in Vercel
2. Use test keys for Preview environment
3. Use production keys only for Production environment

### Variable Not Updating

**Problem:** Changes to variables not reflected

**Solutions:**
1. Redeploy after changing variables
2. Clear build cache
3. Verify variable is saved in platform dashboard
4. Check for typos in variable names

## Production Checklist

Before deploying to production:

- [ ] All environment variables set in hosting platform
- [ ] Production keys used (not test keys)
- [ ] `NODE_ENV=production` set
- [ ] `APP_DOMAIN` matches your domain
- [ ] Firebase authorized domains updated
- [ ] Stripe webhook URL updated
- [ ] Variables validated (no missing values)
- [ ] Private keys properly formatted

## Learn More

- [Environment Variables Features](../features/environment-variables) - Complete variable guide
- [Firebase Setup](../features/firebase-setup) - Firebase configuration
- [Stripe Setup](../features/stripe-setup) - Stripe configuration
- [Vercel Deployment](./vercel) - Vercel-specific setup
