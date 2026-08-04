# Troubleshooting

Comprehensive troubleshooting guide for common issues in ShipSafe.

## Overview

This guide covers common issues you might encounter while developing with ShipSafe and how to resolve them. Each issue includes symptoms, causes, and step-by-step solutions.

**Quick Navigation:**
- [Build & Development Issues](#build--development-issues)
- [Authentication Issues](#authentication-issues)
- [Payment & Stripe Issues](#payment--stripe-issues)
- [Environment Variable Issues](#environment-variable-issues)
- [API Route Issues](#api-route-issues)
- [Database & Firestore Issues](#database--firestore-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)

---

## Build & Development Issues

### Build Fails with TypeScript Errors

**Symptoms:**
- `npm run build` fails
- TypeScript compilation errors
- Type errors in terminal

**Solutions:**

1. **Run linter to identify issues:**
   ```bash
   npm run lint
   ```

2. **Check TypeScript configuration:**
   - Verify `tsconfig.json` exists and is valid
- Ensure all types are imported correctly

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run build
   ```

4. **Check for missing dependencies:**
   ```bash
   npm install
   ```

5. **Verify Node.js version:**
   ```bash
   node --version  # Should be 18.x or higher
   ```

**Common Type Errors:**

- **Missing type imports:** Add `import type { ... }` for type-only imports
- **Undefined types:** Ensure all model types are defined in `src/models/`
- **Component props:** Verify prop types match component definitions

---

### Development Server Won't Start

**Symptoms:**
- `npm run dev` fails
- Port already in use error
- Server crashes on startup

**Solutions:**

1. **Check if port is in use:**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   # Or use different port
   PORT=3001 npm run dev
   ```

2. **Check for syntax errors:**
   - Review terminal for error messages
   - Check for missing imports or typos

3. **Clear cache and restart:**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Verify environment variables:**
   - Ensure `.env.local` exists
   - Check for missing required variables

---

### Hot Reload Not Working

**Symptoms:**
- Changes don't reflect in browser
- Need to manually refresh

**Solutions:**

1. **Hard refresh browser:**
   - `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

2. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C) and restart
   npm run dev
   ```

3. **Clear browser cache:**
   - Open DevTools → Application → Clear storage

4. **Check file watchers:**
   - Ensure file system supports file watching
   - On Linux, may need to increase `fs.inotify.max_user_watches`

---

## Authentication Issues

### Login/Signup Not Working

**Symptoms:**
- Login form doesn't submit
- "Invalid credentials" error
- Redirects fail

**Solutions:**

1. **Verify Firebase configuration:**
   ```bash
   # Check .env.local has all Firebase variables
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```

2. **Check Firebase Console:**
   - Go to Firebase Console → Authentication
   - Verify Email/Password provider is enabled
   - Check authorized domains include your domain

3. **Check browser console:**
   - Open DevTools → Console
   - Look for Firebase errors
   - Common: "auth/unauthorized-domain"

4. **Verify Firebase Auth is enabled:**
   - Firebase Console → Authentication → Sign-in method
   - Enable "Email/Password" provider

5. **Check API route:**
   - Verify `/api/auth/login` and `/api/auth/signup` exist
   - Check server logs for errors

**Common Errors:**

- **"auth/unauthorized-domain":** Add domain to Firebase authorized domains
- **"auth/user-not-found":** User doesn't exist (check email)
- **"auth/wrong-password":** Incorrect password
- **"auth/email-already-in-use":** Email already registered

---

### Password Reset Not Working

**Symptoms:**
- Reset email not received
- Reset link doesn't work
- "Invalid or expired link" error

**Solutions:**

1. **Check Firebase email template:**
   - Firebase Console → Authentication → Templates
   - Verify password reset template is configured
   - Check action URL is correct

2. **Verify domain in config:**
   ```typescript
   // config.ts
   domainName: "yourdomain.com"  // No https://, no trailing slash
   ```

3. **Check email service:**
   - Verify Firebase email sending is enabled
   - Check spam folder
   - Verify email address is correct

4. **Check reset link format:**
   - Should be: `https://yourdomain.com/auth/reset?oobCode=CODE`
   - Verify route exists: `src/app/auth/reset/page.tsx`

---

### Google OAuth Not Working

**Symptoms:**
- Google sign-in button doesn't work
- "popup_closed_by_user" error
- Redirect fails

**Solutions:**

1. **Enable Google provider:**
   - Firebase Console → Authentication → Sign-in method
   - Enable "Google" provider
   - Add OAuth client ID and secret

2. **Configure OAuth consent screen:**
   - Google Cloud Console → APIs & Services → OAuth consent screen
   - Add authorized domains

3. **Check authorized domains:**
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add your domain (localhost for dev)

4. **Verify OAuth credentials:**
   - Check client ID and secret in Firebase Console
   - Ensure they match Google Cloud Console

---

## Payment & Stripe Issues

### Stripe Checkout Fails

**Symptoms:**
- Checkout button doesn't work
- "Invalid price ID" error
- Redirect to Stripe fails

**Solutions:**

1. **Verify Stripe keys:**
   ```bash
   # Check .env.local
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLIC_KEY=pk_test_...
   ```

2. **Check Stripe dashboard:**
   - Stripe Dashboard → Developers → API keys
   - Verify keys are active
   - Ensure test/live keys match environment

3. **Verify price IDs:**
   ```bash
   # Check .env.local
   STRIPE_PRICE_STARTER=price_...
   STRIPE_PRICE_PRO=price_...
   ```
   - Stripe Dashboard → Products → Copy Price IDs

4. **Check API route:**
   - Verify `/api/checkout` route exists
   - Check server logs for errors
   - Ensure user is authenticated (if required)

5. **Test with Stripe test cards:**
   - Use: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

**Common Errors:**

- **"No such price":** Price ID doesn't exist or is wrong
- **"Invalid API key":** Stripe key is incorrect or inactive
- **"Authentication required":** User not logged in (check auth)

---

### Webhook Events Not Received

**Symptoms:**
- Subscription updates don't sync
- Payment confirmations missing
- Webhook events not processing

**Solutions:**

1. **Verify webhook endpoint:**
   - Stripe Dashboard → Developers → Webhooks
   - Check endpoint URL is correct
   - Ensure endpoint is accessible (not localhost in production)

2. **Check webhook secret:**
   ```bash
   # .env.local
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
   - Get from Stripe Dashboard → Webhooks → Signing secret

3. **Test webhook locally:**
   ```bash
   # Use Stripe CLI
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Check webhook route:**
   - Verify `/api/webhooks/stripe` exists
   - Check server logs for errors
   - Ensure raw body is used (not parsed JSON)

5. **Verify webhook signature:**
   - Webhook must validate signature
   - Check `stripe.webhooks.constructEvent()` is called

---

### Billing Portal Not Working

**Symptoms:**
- "Access denied" error
- Portal doesn't open
- Customer not found

**Solutions:**

1. **Check user has active subscription:**
   - Verify user has `stripeCustomerId` in Firestore
   - Check subscription status is "active"

2. **Verify Stripe customer exists:**
   - Stripe Dashboard → Customers
   - Ensure customer ID matches Firestore

3. **Check API route:**
   - Verify `/api/billing/portal` exists
   - Check authentication is working
   - Review server logs

---

## Environment Variable Issues

### Environment Variables Undefined

**Symptoms:**
- `process.env.VARIABLE` is `undefined`
- API calls fail
- Configuration errors

**Solutions:**

1. **Verify file exists:**
   ```bash
   # Must be .env.local (not .env)
   ls -la .env.local
   ```

2. **Check variable names:**
   - Must match exactly (case-sensitive)
   - No typos or extra spaces
   - Use `NEXT_PUBLIC_` prefix for client-side variables

3. **Restart dev server:**
   ```bash
   # Environment variables only load on startup
   # Stop server (Ctrl+C) and restart
   npm run dev
   ```

4. **Check variable format:**
   ```bash
   # ✅ Good
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   
   # ❌ Bad - missing quotes or newlines
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
   ```

5. **Verify in code:**
   ```typescript
   // Server-side only
   const key = process.env.STRIPE_SECRET_KEY;
   
   // Client-side (needs NEXT_PUBLIC_ prefix)
   const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
   ```

**Common Issues:**

- **Missing `NEXT_PUBLIC_` prefix:** Client-side variables need this prefix
- **Private key format:** Must include `\n` for newlines
- **File not found:** Must be `.env.local` (not `.env`)

---

### Firebase Private Key Format Error

**Symptoms:**
- "Invalid private key" error
- Firebase Admin initialization fails
- Authentication errors

**Solutions:**

1. **Check private key format:**
   ```bash
   # Must include \n for newlines
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
   ```

2. **Get new private key:**
   - Firebase Console → Project Settings → Service Accounts
   - Generate New Private Key
   - Copy entire key including headers

3. **Verify in .env.local:**
   - Key should be on single line with `\n`
   - Must be wrapped in quotes
   - No extra spaces or line breaks

---

## API Route Issues

### API Routes Return 401 Unauthorized

**Symptoms:**
- All API calls return 401
- "Authentication required" error
- User is logged in but API fails

**Solutions:**

1. **Check authentication token:**
   - Verify token is sent in request
   - Check `Authorization` header
   - Ensure token is valid (not expired)

2. **Verify middleware:**
   - Check `src/middleware.ts` exists
   - Ensure auth verification is working
   - Review middleware logs

3. **Check API route:**
   ```typescript
   // Verify auth check in route
   const token = await verifyAuth(req);
   if (!token) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }
   ```

4. **Test with Postman/Insomnia:**
   - Send request with valid token
   - Check response headers
   - Verify token format

---

### API Routes Return 500 Server Error

**Symptoms:**
- Generic server error
- No specific error message
- Route crashes

**Solutions:**

1. **Check server logs:**
   ```bash
   # Terminal where dev server is running
   # Look for error stack traces
   ```

2. **Verify error handling:**
   ```typescript
   try {
     // Your code
   } catch (error) {
     console.error("API error:", error);
     return NextResponse.json(
       { error: "Server error" },
       { status: 500 }
     );
   }
   ```

3. **Check dependencies:**
   - Verify all imports are correct
   - Ensure Firebase/Stripe clients are initialized
   - Check for missing environment variables

4. **Test individual functions:**
   - Isolate the failing code
   - Test in isolation
   - Add console.logs for debugging

---

### CORS Errors

**Symptoms:**
- "CORS policy" error in browser
- API calls blocked
- Preflight requests fail

**Solutions:**

1. **Check Next.js API routes:**
   - Next.js API routes handle CORS automatically
   - No CORS configuration needed for same-origin requests

2. **Verify request origin:**
   - Ensure requests are from same domain
   - Check `Origin` header matches domain

3. **For external API calls:**
   ```typescript
   // If calling external APIs, handle CORS
   export async function GET(req: NextRequest) {
     return NextResponse.json({ data: "..." }, {
       headers: {
         "Access-Control-Allow-Origin": "*", // Or specific domain
       },
     });
   }
   ```

---

## Database & Firestore Issues

### Firestore Queries Fail

**Symptoms:**
- "Permission denied" error
- Queries return empty
- Data not found

**Solutions:**

1. **Check Firestore rules:**
   - Firebase Console → Firestore Database → Rules
   - Verify rules allow read/write
   - Test rules in Rules Playground

2. **Verify authentication:**
   - Ensure user is authenticated
   - Check user ID matches document structure
   - Verify custom claims (if used)

3. **Check query syntax:**
   ```typescript
   // Verify query is correct
   const snapshot = await db
     .collection("users")
     .where("email", "==", email)
     .get();
   ```

4. **Check indexes:**
   - Firestore Console → Indexes
   - Create composite indexes if needed
   - Wait for index to build

---

### Real-time Listeners Not Updating

**Symptoms:**
- Data changes don't reflect in UI
- Listener doesn't trigger
- Stale data displayed

**Solutions:**

1. **Check listener setup:**
   ```typescript
   // Verify listener is properly set up
   const unsubscribe = onSnapshot(
     doc(db, "collection", "id"),
     (snapshot) => {
       // Handle update
     }
   );
   ```

2. **Verify cleanup:**
   ```typescript
   // Clean up listener on unmount
   useEffect(() => {
     const unsubscribe = setupListener();
     return () => unsubscribe();
   }, []);
   ```

3. **Check Firestore rules:**
   - Ensure rules allow read access
   - Verify user has permission

---

## Deployment Issues

### Build Fails on Vercel

**Symptoms:**
- Deployment fails
- Build errors in Vercel logs
- TypeScript errors

**Solutions:**

1. **Check build logs:**
   - Vercel Dashboard → Deployment → Build Logs
   - Look for specific error messages

2. **Verify environment variables:**
   - Vercel Dashboard → Settings → Environment Variables
   - Ensure all required variables are set
   - Check variable names match exactly

3. **Test build locally:**
   ```bash
   npm run build
   # Fix any errors before deploying
   ```

4. **Check Node.js version:**
   - Vercel Dashboard → Settings → General
   - Ensure Node.js version matches (18.x or higher)

---

### Environment Variables Not Loading in Production

**Symptoms:**
- Variables work locally but not in production
- API calls fail
- Configuration errors

**Solutions:**

1. **Verify in Vercel:**
   - Vercel Dashboard → Settings → Environment Variables
   - Ensure variables are set for "Production"
- Check variable names match exactly

2. **Redeploy after changes:**
   - Environment variables only load on build
   - Redeploy after adding/changing variables

3. **Check variable format:**
   - Private keys must include `\n` for newlines
   - Wrap in quotes if needed
   - No extra spaces

---

## Performance Issues

### Slow Page Loads

**Symptoms:**
- Pages take long to load
- Slow API responses
- Poor user experience

**Solutions:**

1. **Check bundle size:**
   ```bash
   npm run build
   # Review bundle size in output
   ```

2. **Optimize images:**
   - Use Next.js `Image` component
   - Optimize image sizes
   - Use appropriate formats (WebP)

3. **Check API performance:**
   - Review API route performance
   - Optimize database queries
   - Add caching where appropriate

4. **Use React Server Components:**
   - Prefer server components over client
   - Reduce client-side JavaScript
   - Fetch data on server

---

## Getting Help

### Debugging Steps

1. **Check browser console:**
   - Open DevTools → Console
   - Look for errors or warnings

2. **Check server logs:**
   - Terminal where dev server is running
   - Look for error messages

3. **Review relevant documentation:**
   - Check feature-specific docs
   - Review API route patterns
   - Check security documentation

4. **Test in isolation:**
   - Isolate the failing code
   - Test individual functions
   - Add console.logs for debugging

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Missing required environment variable` | Env var not set | Add to `.env.local` |
| `auth/unauthorized-domain` | Domain not authorized | Add to Firebase Console |
| `No such price` | Invalid Stripe price ID | Check price ID in Stripe Dashboard |
| `Permission denied` | Firestore rules block access | Update Firestore rules |
| `Invalid private key` | Firebase key format wrong | Fix key format with `\n` |

---

## Learn More

- [Environment Variables](../features/environment-variables) - Complete env setup
- [Firebase Setup](../features/firebase-setup) - Firebase configuration
- [Stripe Setup](../features/stripe-setup) - Stripe integration
- [API Routes](../features/api-routes) - API route patterns
- [Error Handling](../features/error-handling) - Error handling patterns

---

**Still stuck?** Check the error message carefully, review relevant documentation, and test in isolation. Most issues are configuration-related and can be resolved by verifying environment variables and service configurations.
