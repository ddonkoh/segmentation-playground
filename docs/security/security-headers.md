# Security Headers

Complete guide to HTTP security headers in ShipSafe, explaining each header's purpose and showcasing the implementation.

## Overview

HTTP security headers tell browsers how to handle your application's content, preventing XSS, clickjacking, content injection, and other browser-based attacks. ShipSafe sets industry-standard security headers on every response.

**Why Security Headers Matter:**
- Prevent XSS (Cross-Site Scripting)
- Block clickjacking attacks
- Enforce HTTPS connections
- Control resource loading
- Prevent MIME type confusion

## Concept: HTTP Security Headers

### How Security Headers Work

Security headers are HTTP response headers that instruct browsers to:
- **Restrict content loading** - Control what resources can be loaded
- **Enforce secure connections** - Require HTTPS
- **Prevent attacks** - Block common browser-based vulnerabilities
- **Control behavior** - Limit browser features that could be exploited

### Browser Support

Modern browsers automatically respect security headers:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Implementation: Security Headers

### Code Showcase

**Location:** `src/lib/security/headers.ts`

```typescript
/**
 * Security Headers - Industry-standard HTTP security headers
 */

import { NextRequest, NextResponse } from "next/server";

// Content Security Policy (CSP)
// Note: CSP must be a single line (no newlines allowed in HTTP headers)
// Includes OAuth domains for Google OAuth and Firebase Auth popup support
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://apis.google.com https://*.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self'; connect-src 'self' https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://oauth2.googleapis.com https://*.googleapis.com https://api.stripe.com https://accounts.google.com; frame-src https://js.stripe.com https://accounts.google.com https://*.googleapis.com https://*.firebaseapp.com; child-src https://accounts.google.com https://*.googleapis.com https://*.firebaseapp.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; manifest-src 'self'; media-src 'self'; worker-src 'self' blob:;";

export function applySecurityHeaders(res: NextResponse, req: NextRequest) {
  // ---------------------------------------------------------------------------
  // Core Security Headers
  // ---------------------------------------------------------------------------

  // 1. Content Security Policy (CSP) - Prevents XSS
  res.headers.set("Content-Security-Policy", CSP);

  // 2. Referrer Policy - Controls referrer information
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 3. X-Frame-Options - Prevents clickjacking
  res.headers.set("X-Frame-Options", "DENY");

  // 4. X-Content-Type-Options - Prevents MIME type sniffing
  res.headers.set("X-Content-Type-Options", "nosniff");

  // 5. X-XSS-Protection - Legacy (CSP is better, but harmless)
  res.headers.set("X-XSS-Protection", "0"); // Disabled because CSP is better

  // 6. X-DNS-Prefetch-Control - Disable DNS prefetching
  res.headers.set("X-DNS-Prefetch-Control", "off");

  // 7. Cross-Origin-Opener-Policy - Allow popups for OAuth
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

  // 8. Permissions Policy - Control browser features
  res.headers.set("Permissions-Policy", [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "payment=(self)",
  ].join(", "));

  // ---------------------------------------------------------------------------
  // HSTS: Strict Transport Security (Production Only)
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  // ---------------------------------------------------------------------------
  // Cache Control for Sensitive Pages
  // ---------------------------------------------------------------------------
  const path = req.nextUrl.pathname;

  const shouldDisableCache =
    path.startsWith("/auth") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/api");

  if (shouldDisableCache) {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
  }

  return res;
}
```

### Middleware Integration

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  // ... previous security layers

  // 6. Apply Security Headers
  let res = NextResponse.next();
  res = ensureCsrfCookie(req, res);
  applySecurityHeaders(res, req); // ✅ Security headers added

  return res;
}
```

## Header-by-Header Breakdown

### 1. Content-Security-Policy (CSP)

**Concept:**
CSP prevents XSS by controlling which resources the browser can load. It acts as a whitelist, blocking unauthorized scripts, styles, and other content.

**ShipSafe Implementation:**
```typescript
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; ...
```

**Directives Explained:**
- `default-src 'self'` - Only load from same origin by default
- `script-src 'self' 'unsafe-inline'` - Allow scripts from same origin and inline scripts
- `connect-src 'self' https://*.firebaseio.com` - Allow connections to Firebase and Stripe
- `frame-src https://js.stripe.com` - Allow Stripe checkout iframe

**What It Prevents:**
- XSS attacks from injected scripts
- Data exfiltration
- Unauthorized resource loading

**Customization:**

If you add external services, update CSP:

```typescript
// Example: Adding Google Analytics
const CONTENT_SECURITY_POLICY = `
  ...
  script-src 'self' 'unsafe-inline' https://www.google-analytics.com;
  connect-src 'self' https://*.firebaseio.com https://www.google-analytics.com;
`;
```

### 2. Strict-Transport-Security (HSTS)

**Concept:**
HSTS forces browsers to use HTTPS for all future requests, even if user types HTTP. Prevents man-in-the-middle attacks.

**ShipSafe Implementation:**
```typescript
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

**Directives:**
- `max-age=63072000` - Force HTTPS for 2 years (63,072,000 seconds)
- `includeSubDomains` - Apply to all subdomains
- `preload` - Eligible for browser HSTS preload list

**What It Prevents:**
- Protocol downgrade attacks
- Man-in-the-middle attacks
- Cookie theft via unencrypted connections

**Production Only:**
HSTS is only set in production (not in development) to avoid issues with local HTTP.

### 3. X-Frame-Options

**Concept:**
Prevents your site from being embedded in an iframe, blocking clickjacking attacks.

**ShipSafe Implementation:**
```typescript
X-Frame-Options: DENY
```

**Values:**
- `DENY` - Never allow framing (most secure)
- `SAMEORIGIN` - Allow framing from same origin
- `ALLOW-FROM uri` - Allow framing from specific URI (deprecated)

**What It Prevents:**
- Clickjacking attacks
- UI redressing
- Malicious iframe embedding

**Note:** Modern browsers also support `Content-Security-Policy: frame-ancestors`, which is more flexible.

### 4. X-Content-Type-Options

**Concept:**
Prevents browsers from MIME-type sniffing, forcing them to respect the declared Content-Type.

**ShipSafe Implementation:**
```typescript
X-Content-Type-Options: nosniff
```

**What It Prevents:**
- MIME type confusion attacks
- XSS via incorrectly interpreted content types
- Content injection

**Example Attack Prevented:**
Without this header, a browser might execute a file with `Content-Type: text/plain` as JavaScript if it looks like JavaScript.

### 5. Referrer-Policy

**Concept:**
Controls how much referrer information is sent with requests.

**ShipSafe Implementation:**
```typescript
Referrer-Policy: strict-origin-when-cross-origin
```

**Values:**
- `strict-origin-when-cross-origin` - Send full URL for same-origin, only origin for cross-origin
- `no-referrer` - Never send referrer
- `same-origin` - Only send for same-origin requests
- `origin` - Always send only origin (not full URL)

**What It Prevents:**
- Sensitive information leakage in referrer
- Privacy violations
- Unintended data exposure

### 6. Cross-Origin-Opener-Policy

**Concept:**
Controls whether a document can open popups and access cross-origin documents.

**ShipSafe Implementation:**
```typescript
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

**Why `same-origin-allow-popups`:**
- Required for Firebase Auth popup to work properly
- Allows OAuth popup windows (Google OAuth, Firebase Auth)
- Maintains security while enabling authentication flows

**Values:**
- `same-origin` - Only same-origin documents can access
- `same-origin-allow-popups` - Same-origin + popup windows (used by ShipSafe)
- `unsafe-none` - No restrictions (not recommended)

**What It Enables:**
- OAuth popup authentication flows
- Firebase Auth popup windows
- Secure cross-origin popup communication

**Note:** This header is required for Firebase Auth and Google OAuth popup flows to work correctly.

### 7. Permissions-Policy

**Concept:**
Controls which browser features and APIs can be used (formerly Feature-Policy).

**ShipSafe Implementation:**
```typescript
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self)
```

**Directives:**
- `camera=()` - Disable camera access
- `microphone=()` - Disable microphone access
- `geolocation=()` - Disable geolocation
- `payment=(self)` - Allow payment API only for same origin

**What It Prevents:**
- Unauthorized access to device features
- Privacy violations
- Unwanted permission requests

### 8. Cache-Control (Sensitive Pages)

**Concept:**
Prevents caching of sensitive pages that contain authentication or private data.

**ShipSafe Implementation:**
```typescript
// For /auth, /dashboard, /api routes
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Expires: 0
```

**What It Prevents:**
- Sensitive data cached in browser
- Authentication tokens in cache
- Stale data showing after logout

## Customization Examples

### Adding External Script (Analytics)

```typescript
// Update CSP in headers.ts
const CONTENT_SECURITY_POLICY = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  connect-src 'self' https://*.firebaseio.com https://www.google-analytics.com;
  ...
`;
```

### Allowing Specific Frame Origins

```typescript
// Allow embedding from trusted domains
const CONTENT_SECURITY_POLICY = `
  ...
  frame-ancestors 'self' https://trusted-partner.com;
`;
```

### Relaxing Permissions

```typescript
// Allow camera for video call feature
res.headers.set("Permissions-Policy", [
  "camera=(self)",  // Changed from () to (self)
  "microphone=(self)",
  ...
].join(", "));
```

## Testing Security Headers

### Browser DevTools

1. Open Network tab
2. Select a request
3. View Response Headers
4. Verify all security headers are present

### Online Tools

Test your headers with:
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

### Example Response Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self' ...
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Cross-Origin-Opener-Policy: same-origin-allow-popups
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self)
```

## Best Practices

### 1. Keep CSP Strict

✅ **Do:**
- Use 'self' as default
- Whitelist only necessary external domains
- Review CSP violations in browser console

❌ **Don't:**
- Use `*` in CSP directives
- Allow `data:` or `blob:` unnecessarily
- Ignore CSP violation reports

### 2. Test After Changes

✅ **Do:**
- Test in browser after CSP changes
- Check browser console for CSP violations
- Verify external services still work

### 3. Monitor CSP Violations

Set up CSP reporting:

```typescript
const CONTENT_SECURITY_POLICY = `
  ...
  report-uri /api/csp-report;  // Report violations
`;
```

## Troubleshooting

### External Scripts Blocked

**Problem:** External scripts/styles not loading

**Solution:** Update CSP to allow the domain:
```typescript
script-src 'self' 'unsafe-inline' https://external-service.com;
```

### Stripe Checkout Not Working

**Problem:** Stripe checkout iframe blocked

**Solution:** Ensure CSP includes Stripe:
```typescript
frame-src https://js.stripe.com;
connect-src ... https://api.stripe.com;
```

### HSTS Causing Issues

**Problem:** Can't access site after enabling HSTS

**Solution:**
- HSTS persists in browser for max-age duration
- Clear browser HSTS cache
- Use incognito mode for testing
- Reduce max-age during development

## Learn More

- [Security Overview](./overview) - Complete security architecture
- [CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HSTS Preload](https://hstspreload.org/) - Submit your site for HSTS preload
