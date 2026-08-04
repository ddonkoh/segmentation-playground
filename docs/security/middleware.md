# Middleware Security Architecture

Complete guide to ShipSafe's middleware security implementation, explaining how all 7 security layers work together to protect your application.

## Overview

ShipSafe's middleware implements a **7-layer security architecture** that provides defense-in-depth protection for all routes. Each layer runs in sequence, with early exits for blocked requests, ensuring maximum security with minimal performance impact.

**Security Layers:**
1. **HTTPS Enforcement** - Redirects HTTP to HTTPS in production
2. **Rate Limiting** - Prevents abuse and brute force attacks
3. **API Firewall** - Blocks invalid requests before route handlers
4. **CSRF Protection** - Prevents cross-site request forgery (with webhook exclusion)
5. **Authentication Guard** - Protects routes requiring authentication
6. **Security Headers** - Applies HTTP security headers
7. **CSRF Cookie** - Ensures CSRF tokens are available for client requests

**Production-Tested:**
This implementation has been validated in production (ThinkMate.online) and includes improvements learned from real-world deployment.

---

## Architecture Overview

### Execution Flow

The middleware executes layers in sequence, with each layer able to block the request:

```
Request → Layer 1 (HTTPS) → Layer 2 (Rate Limit) → Layer 3 (API Firewall)
  ↓
Layer 4 (CSRF) → Layer 5 (Auth Guard) → Layer 6 (Security Headers) → Layer 7 (CSRF Cookie)
  ↓
Response
```

**Early Exit Pattern:**
If any layer blocks the request, the middleware returns immediately (no subsequent layers run). This optimizes performance and ensures blocked requests don't consume unnecessary resources.

### Location

**File:** `middleware.ts` (root of project)

**Next.js Integration:**
- Runs on every request matching the matcher pattern
- Executes before route handlers
- Can modify requests and responses
- Can redirect or block requests

---

## Layer-by-Layer Breakdown

### Layer 1: HTTPS Enforcement

**Purpose:** Ensures all traffic is encrypted in production.

**Implementation:**
```typescript
const httpsRedirect = enforceHttps(req);
if (httpsRedirect) return httpsRedirect;
```

**What It Does:**
- Checks if request is HTTP (not HTTPS)
- Only enforces in production (`NODE_ENV === "production"`)
- Redirects HTTP requests to HTTPS (307 Temporary Redirect)
- Prevents man-in-the-middle attacks

**When It Blocks:**
- HTTP requests in production environment

**Customization:**
- Modify `src/lib/security/env.ts` to change redirect behavior
- Disable only if you have a reverse proxy handling HTTPS

---

### Layer 2: IP Rate Limiting

**Purpose:** Prevents abuse, brute force attacks, and DDoS.

**Implementation:**
```typescript
const rateLimitResponse = ipRateLimit(req);
if (rateLimitResponse) {
  logSecurityEvent(req, "rate_limit_block");
  return rateLimitResponse;
}
```

**What It Does:**
- Tracks requests per IP address
- Uses token bucket algorithm
- Default: 50 requests per minute per IP
- Returns 429 Too Many Requests when limit exceeded

**When It Blocks:**
- IP exceeds rate limit threshold
- Rapid-fire requests from same IP

**Customization:**
- Modify `src/lib/security/rate_limit.ts` to adjust limits
- Configure per-route limits
- Add IP allowlist for trusted sources

**Learn More:** [Rate Limiting](./rate-limiting)

---

### Layer 3: API Firewall

**Purpose:** Blocks invalid requests before they reach route handlers.

**Implementation:**
```typescript
if (path.startsWith("/api")) {
  const apiValidation = secureApiGuard(req);
  if (apiValidation) {
    logSecurityEvent(req, "api_security_block");
    return apiValidation;
  }
}
```

**What It Does:**
- Validates HTTP method (only GET, POST, PUT, PATCH, DELETE allowed)
- Checks user-agent (blocks suspicious agents)
- Validates content-type headers
- Optional: Cross-origin protection

**When It Blocks:**
- Invalid HTTP methods (HEAD, OPTIONS, TRACE, etc.)
- Missing or suspicious user-agents
- Malformed headers
- Cross-origin requests (if enabled)

**Customization:**
- Modify `src/lib/security/secure_api.ts` to adjust rules
- Add allowed user-agents for external services
- Configure cross-origin allowlist

**Learn More:** [API Security](./api-security)

---

### Layer 4: CSRF Protection

**Purpose:** Prevents cross-site request forgery attacks on state-changing requests.

**Implementation:**
```typescript
const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
const isWebhook = path.startsWith("/api/webhooks/");

if (isMutation && !isWebhook) {
  const csrfValidation = csrfGuard(req);
  if (csrfValidation) {
    logSecurityEvent(req, "csrf_failed");
    return csrfValidation;
  }
}
```

**What It Does:**
- Validates CSRF token for mutation requests (POST, PUT, PATCH, DELETE)
- Uses double-submit cookie pattern
- **Excludes webhook routes** (they use signature verification instead)
- Returns 403 Forbidden if token invalid

**When It Blocks:**
- Mutation requests without CSRF token
- CSRF token doesn't match cookie token
- Cross-origin requests (additional check)

**Important Exclusions:**
- **Webhook routes** (`/api/webhooks/*`) - Use signature verification (Stripe, etc.)
- **GET requests** - Don't require CSRF (idempotent)

**Customization:**
- Modify `src/lib/security/csrf.ts` to adjust validation
- Add additional exclusions if needed
- Configure token expiration

**Learn More:** [CSRF Protection](./csrf-protection)

---

### Layer 5: Authentication Guard

**Purpose:** Protects routes requiring authentication.

**Implementation:**
```typescript
const session = req.cookies.get("session")?.value;

// Identify excluded routes
const isWebhook = path.startsWith("/api/webhooks/");
const isAuthApi = path.startsWith("/api/auth/");
const isPublicApi = path.startsWith("/api/csrf") || 
                    path.startsWith("/api/security/status");

const isProtected = PROTECTED_ROUTES.some((r) => path.startsWith(r));

if (isProtected && !session && !isWebhook && !isAuthApi && !isPublicApi) {
  // API routes: Return 401
  if (path.startsWith("/api")) {
    logSecurityEvent(req, "api_auth_required");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Page routes: Redirect to auth
  url.pathname = "/auth";
  url.searchParams.set("from", path);
  logSecurityEvent(req, "auth_redirect");
  return NextResponse.redirect(url);
}
```

**What It Does:**
- Checks for valid session cookie
- Protects routes in `PROTECTED_ROUTES` array
- **API routes:** Returns 401 Unauthorized (JSON)
- **Page routes:** Redirects to `/auth` (with return URL)
- Excludes webhooks, auth APIs, and public APIs

**When It Blocks:**
- Protected route accessed without session
- Unauthenticated user tries to access `/dashboard`, `/billing`, etc.

**Exclusions:**
- **Webhook routes** (`/api/webhooks/*`) - Use signature verification
- **Auth API routes** (`/api/auth/*`) - Handle their own authentication
- **Public API routes** (`/api/csrf`, `/api/security/status`) - Intentionally public

**Customization:**
- Modify `PROTECTED_ROUTES` array to add/remove protected routes
- Change redirect destination (`/auth` → your login page)
- Adjust excluded routes if needed

**Learn More:** [Authentication Security](./authentication-security)

---

### Layer 6: Security Headers

**Purpose:** Applies HTTP security headers to all responses.

**Implementation:**
```typescript
const response = NextResponse.next();
applySecurityHeaders(response, req);
```

**What It Does:**
- Sets Content Security Policy (CSP)
- Sets X-Frame-Options (clickjacking protection)
- Sets X-Content-Type-Options (MIME sniffing protection)
- Sets Strict-Transport-Security (HSTS)
- Sets Referrer-Policy
- Disables caching for sensitive pages

**Headers Applied:**
- `Content-Security-Policy` - XSS protection
- `X-Frame-Options: DENY` - Clickjacking protection
- `X-Content-Type-Options: nosniff` - MIME sniffing protection
- `Strict-Transport-Security` - HTTPS enforcement (production only)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cache-Control: no-store` (for sensitive pages)

**Customization:**
- Modify `src/lib/security/headers.ts` to adjust headers
- Update CSP to allow external scripts/domains
- Configure cache policies per route

**Learn More:** [Security Headers](./security-headers)

---

### Layer 7: CSRF Cookie

**Purpose:** Ensures CSRF tokens are available for client requests.

**Implementation:**
```typescript
if (req.method === "GET") {
  ensureCsrfCookie(req, response);
}
```

**What It Does:**
- Sets CSRF token cookies on GET requests only
- Creates both httpOnly and client-readable cookies
- Tokens are available for subsequent mutation requests
- Optimized to only run on GET requests (performance)

**Why GET Only:**
- CSRF tokens only needed for mutations (POST, PUT, etc.)
- Cookie is set on GET, available for subsequent POST
- Reduces unnecessary cookie operations
- Improves performance

**Customization:**
- Modify `src/lib/security/csrf.ts` to adjust cookie settings
- Change cookie expiration
- Adjust token generation

**Learn More:** [CSRF Protection](./csrf-protection)

---

## Route Configuration

### Protected Routes

Routes that require authentication:

```typescript
const PROTECTED_ROUTES = ["/dashboard", "/billing", "/api/protected"];
```

**Customization:**
Add your protected routes to this array:

```typescript
const PROTECTED_ROUTES = [
  "/dashboard",
  "/billing",
  "/settings",
  "/api/user",
  "/api/billing",
  // Add your routes here
];
```

### Auth Pages

Routes that logged-in users shouldn't access:

```typescript
const AUTH_PAGES = ["/auth", "/signin", "/signup"];
```

**Customization:**
Add your auth pages to this array:

```typescript
const AUTH_PAGES = ["/auth", "/signin", "/signup", "/login", "/register"];
```

---

## Customization Guide

### Adding Protected Routes

**Example: Protect `/settings` route**

```typescript
const PROTECTED_ROUTES = [
  "/dashboard",
  "/billing",
  "/settings", // Add this
  "/api/protected",
];
```

### Excluding Routes from CSRF

**Example: Exclude custom webhook endpoint**

```typescript
const isWebhook = path.startsWith("/api/webhooks/") || 
                  path.startsWith("/api/custom-webhook/"); // Add this
```

### Customizing Rate Limits

**Example: Different limits per route**

Modify `src/lib/security/rate_limit.ts`:

```typescript
const RATE_LIMITS = {
  "/api/auth/login": { requests: 5, window: 15 * 60 }, // 5 per 15 min
  "/api/auth/signup": { requests: 3, window: 60 * 60 }, // 3 per hour
  default: { requests: 50, window: 60 }, // 50 per minute
};
```

### Changing Auth Redirect

**Example: Redirect to custom login page**

```typescript
// Instead of /auth
url.pathname = "/login"; // Your custom login page
```

---

## Execution Order

Understanding the execution order is important for debugging and customization:

1. **HTTPS Check** - First (before any processing)
2. **Rate Limiting** - Early (prevents abuse)
3. **API Firewall** - Before CSRF (blocks invalid requests)
4. **CSRF Protection** - Before auth (validates request integrity)
5. **Auth Guard** - After CSRF (protects authenticated routes)
6. **Security Headers** - Applied to all responses
7. **CSRF Cookie** - Set on GET requests

**Why This Order Matters:**
- HTTPS and rate limiting run first (performance)
- API firewall blocks invalid requests early
- CSRF validates before auth (prevents CSRF on auth endpoints)
- Auth guard runs after CSRF (ensures request is valid)
- Headers and cookies applied last (modify response)

---

## Common Customization Scenarios

### Scenario 1: Add New Protected Route

```typescript
// In middleware.ts
const PROTECTED_ROUTES = [
  "/dashboard",
  "/billing",
  "/settings", // Add your route
  "/api/protected",
];
```

### Scenario 2: Exclude Route from Auth

```typescript
// In middleware.ts - Layer 5
const isPublicApi = path.startsWith("/api/csrf") || 
                    path.startsWith("/api/security/status") ||
                    path.startsWith("/api/public"); // Add your route
```

### Scenario 3: Custom Rate Limits

```typescript
// In src/lib/security/rate_limit.ts
export function ipRateLimit(req: NextRequest): NextResponse | null {
  const path = req.nextUrl.pathname;
  
  // Custom limit for specific route
  if (path === "/api/expensive-operation") {
    // 10 requests per hour
    return checkRateLimit(req, 10, 60 * 60);
  }
  
  // Default limit
  return checkRateLimit(req, 50, 60);
}
```

### Scenario 4: Add Custom Security Header

```typescript
// In src/lib/security/headers.ts
export function applySecurityHeaders(res: NextResponse, req: NextRequest) {
  // ... existing headers ...
  
  // Add custom header
  res.headers.set("X-Custom-Security-Header", "value");
  
  return res;
}
```

---

## Troubleshooting

### Issue: Webhook Requests Failing

**Problem:** Stripe webhooks return 403 "Missing CSRF token"

**Solution:**
Ensure webhook routes are excluded from CSRF:

```typescript
const isWebhook = path.startsWith("/api/webhooks/");
if (isMutation && !isWebhook) {
  // CSRF check
}
```

**Verify:**
- Webhook path matches exclusion pattern
- Webhook uses signature verification (not CSRF)

---

### Issue: API Routes Redirecting Instead of 401

**Problem:** API clients receive redirects instead of 401 status

**Solution:**
Ensure API routes return JSON:

```typescript
if (isProtected && !session && path.startsWith("/api")) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Verify:**
- API route path starts with `/api`
- Response is JSON, not redirect

---

### Issue: Rate Limiting Too Strict

**Problem:** Legitimate users hitting rate limits

**Solution:**
Adjust rate limits in `src/lib/security/rate_limit.ts`:

```typescript
const MAX_REQUESTS = 100; // Increase from 50
const WINDOW_MS = 60 * 1000; // 1 minute
```

**Or add IP allowlist:**
```typescript
const ALLOWED_IPS = ["1.2.3.4", "5.6.7.8"];
if (ALLOWED_IPS.includes(clientIp)) {
  return null; // Skip rate limiting
}
```

---

### Issue: CSRF Token Not Working

**Problem:** CSRF validation failing on valid requests

**Solution:**
1. **Check cookie is set:**
   - Verify `ensureCsrfCookie` is called on GET requests
   - Check browser DevTools → Application → Cookies

2. **Check header is sent:**
   - Verify `x-csrf-token` header is included
   - Check browser DevTools → Network → Headers

3. **Check token matches:**
   - Cookie token must match header token exactly
   - Both must exist

**Debug:**
```typescript
// Temporarily add logging
console.log("Cookie token:", req.cookies.get("csrf_token")?.value);
console.log("Header token:", req.headers.get("x-csrf-token"));
```

---

### Issue: Protected Route Not Protected

**Problem:** Route accessible without authentication

**Solution:**
1. **Check route is in PROTECTED_ROUTES:**
   ```typescript
   const PROTECTED_ROUTES = ["/dashboard", "/your-route"];
   ```

2. **Check route pattern:**
   ```typescript
   // This matches /dashboard and /dashboard/settings
   const isProtected = PROTECTED_ROUTES.some((r) => path.startsWith(r));
   ```

3. **Verify session cookie:**
   - Check cookie name matches (`session`)
   - Verify cookie is set on login

---

### Issue: Security Headers Not Applied

**Problem:** Headers missing in response

**Solution:**
1. **Check function is called:**
   ```typescript
   applySecurityHeaders(response, req); // Must include req parameter
   ```

2. **Verify headers function:**
   - Check `src/lib/security/headers.ts`
   - Verify headers are set correctly

3. **Check response object:**
   - Ensure `NextResponse.next()` is called before headers
   - Headers must be set on response object

---

## Performance Considerations

### Matcher Pattern

The matcher excludes static assets to improve performance:

```typescript
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**Why:**
- Images don't need security processing
- Reduces middleware executions
- Improves performance

**Customization:**
Add more exclusions if needed:

```typescript
matcher: [
  "/((?!_next|static|favicon.ico|assets|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
],
```

### Early Exit Pattern

Each layer can exit early, preventing unnecessary processing:

```typescript
// If HTTPS redirect needed, return immediately
if (httpsRedirect) return httpsRedirect;

// If rate limited, return immediately
if (rateLimitResponse) return rateLimitResponse;

// No need to continue if request is blocked
```

**Benefits:**
- Faster response times for blocked requests
- Reduced CPU usage
- Better scalability

---

## Best Practices

### 1. Don't Disable Security Layers

❌ **Don't:**
```typescript
// Don't skip security layers
if (path.startsWith("/api/public")) {
  return NextResponse.next(); // Bypasses all security!
}
```

✅ **Do:**
```typescript
// Exclude from specific layers only
const isPublicApi = path.startsWith("/api/public");
if (isProtected && !session && !isPublicApi) {
  // Still protected by other layers
}
```

### 2. Use Proper Exclusions

❌ **Don't:**
```typescript
// Too broad exclusion
if (path.includes("webhook")) {
  // Excludes /api/webhook-test too!
}
```

✅ **Do:**
```typescript
// Specific exclusion
const isWebhook = path.startsWith("/api/webhooks/");
```

### 3. Log Security Events

✅ **Do:**
```typescript
logSecurityEvent(req, "api_auth_required");
logSecurityEvent(req, "csrf_failed");
logSecurityEvent(req, "rate_limit_block");
```

**Benefits:**
- Monitor for attacks
- Debug issues
- Track security events

### 4. Test All Layers

✅ **Do:**
- Test HTTPS redirect in production
- Test rate limiting with multiple requests
- Test CSRF protection with invalid tokens
- Test auth guard with/without session
- Verify security headers in response

---

## Related Documentation

- **[Security Overview](./overview)** - Complete security architecture
- **[CSRF Protection](./csrf-protection)** - CSRF implementation details
- **[Authentication Security](./authentication-security)** - Auth patterns
- **[API Security](./api-security)** - API firewall details
- **[Rate Limiting](./rate-limiting)** - Rate limit configuration
- **[Security Headers](./security-headers)** - Header configuration

---

## Quick Reference

### Security Layers Checklist

- [ ] HTTPS enforcement enabled (production)
- [ ] Rate limiting configured
- [ ] API firewall active
- [ ] CSRF protection enabled (with webhook exclusion)
- [ ] Auth guard protecting routes
- [ ] Security headers applied
- [ ] CSRF cookie set on GET requests

### Common Customizations

- **Add protected route:** Update `PROTECTED_ROUTES` array
- **Exclude from CSRF:** Add to `isWebhook` check
- **Exclude from auth:** Add to exclusion checks
- **Adjust rate limits:** Modify `rate_limit.ts`
- **Custom headers:** Modify `headers.ts`

---

**Middleware is the foundation of ShipSafe's security.** Understanding how it works helps you customize it for your needs while maintaining security best practices.

