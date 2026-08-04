# CSRF Protection

Complete guide to Cross-Site Request Forgery (CSRF) protection in ShipSafe, explaining the concept and showcasing the double-submit cookie implementation.

## Overview

CSRF protection prevents attackers from tricking authenticated users into executing unwanted actions on your application. ShipSafe uses the **double-submit cookie pattern** for robust CSRF protection.

**Why CSRF Protection Matters:**
- Prevents unauthorized state changes
- Protects authenticated actions
- Blocks malicious form submissions
- Prevents account takeover attempts

## Concept: Cross-Site Request Forgery

### What is CSRF?

CSRF attacks exploit the fact that browsers automatically include cookies in requests. An attacker can:

1. **Trick user:** User visits attacker's website while logged into your app
2. **Forge request:** Attacker's site makes a request to your API
3. **Browser includes cookies:** Request includes user's session cookie
4. **Attack succeeds:** Your server sees valid session, executes action

### Attack Example

```html
<!-- Attacker's malicious website -->
<form action="https://yourapp.com/api/user/delete" method="POST">
  <input type="hidden" name="userId" value="victim-id">
  <!-- User visits this page, form auto-submits -->
</form>
<script>document.forms[0].submit();</script>
```

**Result:** If user is logged in, their account gets deleted!

### How Double-Submit Cookie Prevents CSRF

The double-submit cookie pattern requires:

1. **Cookie token:** Server sets CSRF token in httpOnly cookie
2. **Client token:** Same token also in readable cookie (for JavaScript)
3. **Header token:** Client sends token in `x-csrf-token` header
4. **Verification:** Server verifies header token matches cookie token

**Why This Works:**

Attacker can't read the cookie (same-origin policy) or set the header (browser restriction), so they can't forge valid CSRF tokens.

## Implementation: Double-Submit Cookie

### Code Showcase

**Location:** `src/lib/security/csrf.ts`

```typescript
/**
 * CSRF Protection - Double-submit cookie pattern
 */

import { NextRequest, NextResponse } from "next/server";

// Cookie names
const CSRF_COOKIE_HTTP = "csrf_token";          // httpOnly (server only)
const CSRF_COOKIE_JS = "csrf_token_client";     // readable (client)

// Generate cryptographically strong CSRF token
function generateToken(length = 32): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let token = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array); // Cryptographically secure random

  for (let i = 0; i < length; i++) {
    token += charset[array[i] % charset.length];
  }

  return token;
}

// Ensure CSRF cookie exists (called on GET requests for performance)
export function ensureCsrfCookie(
  req: NextRequest,
  res: NextResponse
): NextResponse {
  const existingToken = req.cookies.get(CSRF_COOKIE_HTTP)?.value;

  if (!existingToken) {
    const token = generateToken();

    // httpOnly version - server validation only
    res.cookies.set(CSRF_COOKIE_HTTP, token, {
      httpOnly: true,          // JavaScript cannot read
      sameSite: "strict",      // Only sent on same-site requests
      secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
      path: "/",
    });

    // Client-readable cookie - used by JS to set header
    res.cookies.set(CSRF_COOKIE_JS, token, {
      httpOnly: false,         // JavaScript CAN read
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return res;
}

// Validate CSRF token for mutation requests
export function csrfGuard(req: NextRequest): NextResponse | null {
  const method = req.method.toUpperCase();

  // Only protect state-changing requests
  const requiresProtection = ["POST", "PUT", "PATCH", "DELETE"].includes(
    method
  );
  if (!requiresProtection) return null; // GET requests don't need CSRF

  // Get tokens from cookie and header
  const cookieToken = req.cookies.get(CSRF_COOKIE_HTTP)?.value;
  const headerToken = req.headers.get("x-csrf-token");

  // Both tokens must exist
  if (!cookieToken || !headerToken) {
    return NextResponse.json(
      { error: "Missing CSRF token." },
      { status: 403 }
    );
  }

  // Tokens must match exactly
  if (cookieToken !== headerToken) {
    return NextResponse.json(
      { error: "Invalid CSRF token." },
      { status: 403 }
    );
  }

  // Optional: Additional origin/referrer check
  const origin = req.headers.get("origin") || "";
  const referrer = req.headers.get("referer") || "";
  const host = req.headers.get("host") || req.nextUrl.host;

  // Block cross-origin requests (additional hardening)
  if (
    origin &&
    !origin.includes(host) &&
    referrer &&
    !referrer.includes(host)
  ) {
    return NextResponse.json(
      { error: "Cross-origin requests are not allowed." },
      { status: 403 }
    );
  }

  return null; // Request is safe
}

// Client helper - get CSRF token from cookie (for JavaScript)
export function getClientCsrfToken(): string | null {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(
      new RegExp(`(^| )${CSRF_COOKIE_JS}=([^;]+)`)
    );
    return match ? match[2] : null;
  }
  return null;
}
```

### Middleware Integration

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ... previous security layers

  // CSRF for mutation requests
  if (path.startsWith("/api")) {
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
    const isWebhook = path.startsWith("/api/webhooks/");

    // IMPORTANT: Exclude webhook routes from CSRF protection
    // Webhooks use signature verification (Stripe, etc.) instead of CSRF tokens
    if (isMutation && !isWebhook) {
      const csrfValidation = csrfGuard(req);
      if (csrfValidation) {
        logSecurityEvent(req, "csrf_failed");
        return csrfValidation; // Block request
      }
    }
  }

  // Ensure CSRF cookie exists for GET requests only (performance optimization)
  let res = NextResponse.next();
  if (req.method === "GET") {
    res = ensureCsrfCookie(req, res);
  }

  return res;
}
```

## Client-Side Usage

### Automatic Token Handling

ShipSafe's API client automatically includes CSRF tokens:

```typescript
// src/lib/api.ts
import { getClientCsrfToken } from "@/lib/security/csrf";

export async function apiPost<T>(endpoint: string, data: any) {
  // Get CSRF token from readable cookie
  const csrfToken = getClientCsrfToken();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken || "", // ✅ Automatically included
    },
    body: JSON.stringify(data),
  });

  // ... handle response
}
```

### Manual Token Usage

If making requests manually:

```typescript
"use client";

import { getClientCsrfToken } from "@/lib/security/csrf";

async function updateUser() {
  const csrfToken = getClientCsrfToken();

  const response = await fetch("/api/user/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken || "", // Include CSRF token
    },
    body: JSON.stringify({ displayName: "New Name" }),
  });

  // ... handle response
}
```

## How It Works: Step by Step

### Step 1: User Visits Page

```typescript
// User loads page
GET /dashboard

// Middleware generates CSRF token and sets cookies:
Set-Cookie: csrf_token=abc123...; HttpOnly; Secure; SameSite=Strict
Set-Cookie: csrf_token_client=abc123...; Secure; SameSite=Strict
```

### Step 2: Client Makes Request

```typescript
// JavaScript reads client cookie
const token = getClientCsrfToken(); // "abc123..."

// Request includes token in header
POST /api/user/update
Headers:
  x-csrf-token: abc123...
  Cookie: csrf_token=abc123...; csrf_token_client=abc123...
```

### Step 3: Server Validates

```typescript
// Server checks:
const cookieToken = req.cookies.get("csrf_token")?.value;  // "abc123..."
const headerToken = req.headers.get("x-csrf-token");       // "abc123..."

// Tokens match ✅
if (cookieToken === headerToken) {
  // Request is valid
}
```

### Step 4: Attacker Tries CSRF

```typescript
// Attacker's site tries to make request
POST /api/user/update
Headers:
  x-csrf-token: (can't set - browser blocks)
  Cookie: (can't read - same-origin policy)

// Server checks:
const cookieToken = req.cookies.get("csrf_token")?.value;  // "abc123..."
const headerToken = req.headers.get("x-csrf-token");       // null

// Tokens don't match ❌
// Request blocked with 403 Forbidden
```

## Protected vs Unprotected Requests

### Protected Requests (Require CSRF)

These HTTP methods require CSRF tokens:

- ✅ `POST` - Creating resources
- ✅ `PUT` - Updating resources
- ✅ `PATCH` - Partial updates
- ✅ `DELETE` - Deleting resources

### Unprotected Requests (No CSRF)

These methods don't require CSRF tokens:

- ✅ `GET` - Reading data (idempotent)
- ✅ `HEAD` - Headers only (idempotent)
- ✅ `OPTIONS` - CORS preflight (idempotent)

**Why?** GET/HEAD/OPTIONS don't change server state, so CSRF isn't a risk.

### Webhook Routes (Excluded from CSRF)

**Webhook routes are excluded from CSRF protection:**

- ✅ `/api/webhooks/*` - All webhook endpoints

**Why exclude webhooks?**

1. **Signature Verification:** Webhooks (Stripe, etc.) use cryptographic signature verification instead of CSRF tokens
2. **External Services:** Webhooks come from external services, not browsers, so CSRF tokens can't be included
3. **Different Security Model:** Webhooks rely on:
   - Secret keys (webhook signing secrets)
   - Signature verification (HMAC signatures)
   - Origin validation (IP allowlists)

**Example: Stripe Webhook**

```typescript
// Stripe webhook uses signature verification
POST /api/webhooks/stripe
Headers:
  stripe-signature: t=1234567890,v1=abc123...
  (No CSRF token needed - excluded from CSRF protection)

// Server verifies signature instead
const event = stripe.webhooks.constructEvent(
  rawBody,
  signature,
  webhookSecret
);
```

**Without exclusion:** Stripe webhooks would fail with "Missing CSRF token" errors, breaking subscription management and billing functionality.

## Best Practices

### 1. Always Include CSRF Token in Mutations

✅ **Do:**
```typescript
// Use ShipSafe's API client (automatic)
await apiPost("/api/user/update", data);

// Or manually include token
headers: {
  "x-csrf-token": getClientCsrfToken(),
}
```

❌ **Don't:**
```typescript
// Missing CSRF token
fetch("/api/user/update", {
  method: "POST",
  // No x-csrf-token header ❌
});
```

### 2. Use Secure Cookie Settings

CSRF cookies use:
- ✅ `httpOnly: true` - Prevents JavaScript access to server token
- ✅ `secure: true` - HTTPS only in production
- ✅ `sameSite: "strict"` - Only sent on same-site requests

### 3. Validate on Every Mutation

CSRF protection is enforced in middleware automatically for all mutations:

```typescript
// Automatically protected
POST /api/user/update   ✅ CSRF required
PUT /api/user/1         ✅ CSRF required
DELETE /api/user/1      ✅ CSRF required
```

### 4. Handle CSRF Errors Gracefully

```typescript
try {
  await apiPost("/api/user/update", data);
} catch (error) {
  if (error.message.includes("CSRF")) {
    // Refresh page to get new CSRF token
    window.location.reload();
  }
}
```

## Troubleshooting

### CSRF Token Missing

**Problem:** "Missing CSRF token" error

**Solutions:**
1. Ensure cookie is set (check browser DevTools → Application → Cookies)
2. Verify `ensureCsrfCookie()` is called in middleware
3. Check cookie settings (secure, sameSite, path)
4. Refresh page to get new token

### CSRF Token Invalid

**Problem:** "Invalid CSRF token" error

**Solutions:**
1. Verify token in header matches token in cookie
2. Check if cookies are being cleared
3. Ensure token isn't being modified
4. Verify same-origin policy (tokens must match exactly)

### Cross-Origin Issues

**Problem:** CSRF validation fails on cross-origin requests

**Solutions:**
1. CSRF protection blocks cross-origin by design (security)
2. For public APIs, consider CORS instead of CSRF
3. Use API keys or OAuth for cross-origin access
4. Keep CSRF for same-origin requests

## Advanced: Token Rotation

For enhanced security, rotate CSRF tokens:

```typescript
// Regenerate token after each request
export function ensureCsrfCookie(req: NextRequest, res: NextResponse) {
  // Always generate new token (rotates on each request)
  const token = generateToken();
  
  res.cookies.set(CSRF_COOKIE_HTTP, token, { /* ... */ });
  res.cookies.set(CSRF_COOKIE_JS, token, { /* ... */ });
  
  return res;
}
```

**Trade-off:** More secure but requires token refresh on every request.

## Learn More

- [Security Overview](./overview) - Complete security architecture
- [API Security](./api-security) - API endpoint protection
- [Authentication Security](./authentication-security) - Auth patterns
