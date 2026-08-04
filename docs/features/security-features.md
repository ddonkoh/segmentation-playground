# Security Features

Overview of ShipSafe's comprehensive 7-layer security architecture.

## Overview

ShipSafe implements a multi-layered security architecture designed to protect your application from common threats and vulnerabilities. All security features are enabled by default and work together to provide defense-in-depth.

**Security Layers:**
1. **HTTPS Enforcement** - All traffic encrypted in production
2. **Rate Limiting** - Prevents abuse and brute force attacks
3. **API Firewall** - Blocks invalid requests before they reach your code
4. **CSRF Protection** - Prevents cross-site request forgery
5. **Security Headers** - Strong HTTP security headers
6. **Audit Logging** - Security event tracking
7. **Authentication Middleware** - Protected route verification

## Security Architecture

### Layer 1: HTTPS Enforcement

**Purpose:** Encrypts all traffic between client and server.

**Implementation:**
- Automatically redirects HTTP to HTTPS in production
- Enforces secure connections
- Prevents man-in-the-middle attacks

**Location:** `src/lib/security/env.ts`

```typescript
// Middleware automatically enforces HTTPS
if (process.env.NODE_ENV === "production") {
  // Redirect HTTP to HTTPS
}
```

### Layer 2: Rate Limiting

**Purpose:** Prevents abuse, brute force attacks, and DDoS.

**Implementation:**
- Per-IP rate limiting
- Per-endpoint rate limiting
- Sliding window algorithm
- Configurable limits

**Location:** `src/lib/security/rate_limit.ts`

**Default Limits:**
- Auth endpoints: 10 requests per 15 minutes per IP
- API endpoints: 100 requests per 15 minutes per IP
- Webhooks: 1000 requests per hour per IP

**Customization:**

```typescript
// In rate_limit.ts
const RATE_LIMITS = {
  "/api/auth/login": { requests: 5, window: 15 * 60 }, // 5 per 15 min
  "/api/auth/signup": { requests: 3, window: 60 * 60 }, // 3 per hour
};
```

### Layer 3: API Firewall

**Purpose:** Blocks invalid requests before they reach your route handlers.

**Checks:**
- Valid HTTP methods only (GET, POST, PUT, PATCH, DELETE)
- Valid user agents (blocks bots and automated tools)
- Valid content-type headers
- Origin/referrer validation (optional)

**Location:** `src/lib/security/secure_api.ts`

**Allowed User Agents:**
- Browser user agents (Mozilla, Chrome, Safari, etc.)
- Next.js SSR user agent
- Stripe webhook user agent
- Firebase SDK user agent

**Blocked:**
- Empty or missing user agents
- Suspicious user agents
- Invalid HTTP methods (HEAD, OPTIONS, TRACE, etc.)

### Layer 4: CSRF Protection

**Purpose:** Prevents cross-site request forgery attacks.

**Implementation:**
- Double-submit cookie pattern
- CSRF token validation
- Automatic token generation and validation

**How it works:**
1. Server generates CSRF token and sets cookie
2. Client includes token in request header
3. Server validates token matches cookie

**Usage:**

```typescript
// Client automatically includes CSRF token
const response = await apiPost("/api/endpoint", data);

// Server validates automatically via middleware
```

### Layer 5: Security Headers

**Purpose:** Sets strong HTTP security headers.

**Headers:**
- `Strict-Transport-Security` - Enforces HTTPS
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` - XSS protection (optional)

**Implementation:**

```typescript
// Middleware automatically sets headers
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  // ... more headers
  
  return response;
}
```

### Layer 6: Audit Logging

**Purpose:** Tracks security events for monitoring and debugging.

**Logged Events:**
- Failed authentication attempts
- Rate limit violations
- Security header violations
- Suspicious requests

**Location:** `src/lib/security/audit.ts`

**Usage:**

```typescript
import { logSecurityEvent } from "@/lib/security/audit";

logSecurityEvent(req, "RATE_LIMIT_EXCEEDED", "Too many requests from IP");
logSecurityEvent(req, "AUTH_FAILED", "Invalid credentials");
```

### Layer 7: Authentication Middleware

**Purpose:** Verifies authentication for protected routes.

**Implementation:**
- Firebase ID token verification
- Custom claims validation
- Role-based access control

**Usage:**

```typescript
// In API routes
import { requireAuth } from "@/lib/firebase/auth";

export async function GET(req: NextRequest) {
  const user = await requireAuth(req); // Throws if not authenticated
  // Protected code here
}
```

## Security Features by Route Type

### Public Routes

**Protection:**
- HTTPS enforcement
- Rate limiting
- API firewall
- Security headers

**No protection:**
- Authentication (public access)
- CSRF (read-only operations)

### Protected Routes

**Protection:**
- All public protections
- Authentication required
- CSRF protection
- Role-based access control

**Example:**

```typescript
export async function POST(req: NextRequest) {
  // All security layers applied automatically
  const user = await requireAuth(req); // Layer 7
  // ... your code
}
```

### Webhook Routes

**Protection:**
- Signature verification (Stripe, etc.)
- Rate limiting
- API firewall
- HTTPS enforcement

**No protection:**
- CSRF (webhooks don't use cookies)
- Authentication (uses signature instead)

## Input Validation

### Zod Schema Validation

All inputs are validated using Zod schemas:

```typescript
import { z } from "zod";
import { loginSchema } from "@/features/auth/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = loginSchema.parse(body); // Validates and sanitizes
}
```

**Security Benefits:**
- Type safety
- Input sanitization
- Injection attack prevention
- Data normalization

## Environment Security

### Secure Environment Variable Access

**Location:** `src/lib/security/env.ts`

**Features:**
- Validates required environment variables
- Provides helpful error messages
- Prevents accidental exposure

```typescript
import { getEnv } from "@/lib/security/env";

// Throws if not set
const apiKey = getEnv("STRIPE_SECRET_KEY");

// With fallback
const apiKey = getEnv("STRIPE_SECRET_KEY", "fallback-value");
```

### Environment Variable Validation

```typescript
// Validates on app startup
function validateEnvironment() {
  const required = [
    "FIREBASE_PROJECT_ID",
    "STRIPE_SECRET_KEY",
    // ... more
  ];
  
  required.forEach(key => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}
```

## Security Best Practices

### 1. Never Trust Client Input

```typescript
// ✅ Good: Validate all inputs
const data = schema.parse(req.body);

// ❌ Bad: Trust client data
const email = req.body.email; // Don't do this
```

### 2. Use Parameterized Queries

```typescript
// ✅ Good: Firestore handles this automatically
await firestore.collection("users").doc(userId).get();

// ❌ Bad: SQL injection (not applicable to Firestore, but good practice)
```

### 3. Sanitize Output

```typescript
// ✅ Good: Escape user input
<div>{escapeHtml(user.displayName)}</div>

// React automatically escapes, but be careful with dangerouslySetInnerHTML
```

### 4. Use HTTPS Everywhere

```typescript
// ✅ Good: Always use HTTPS in production
const url = `https://${config.domainName}/api/endpoint`;
```

### 5. Log Security Events

```typescript
// ✅ Good: Log suspicious activity
logSecurityEvent(req, "SUSPICIOUS_REQUEST", "Invalid user agent");
```

## Security Monitoring

### Audit Log Review

```typescript
import { getAuditLogs } from "@/lib/security/audit";

// Get recent security events
const logs = getAuditLogs(100);

// Filter for specific events
const failedLogins = logs.filter(log => log.type === "AUTH_FAILED");
```

### Rate Limit Monitoring

Monitor rate limit violations to detect abuse:

```typescript
const rateLimitLogs = getAuditLogs(1000).filter(
  log => log.type === "RATE_LIMIT_EXCEEDED"
);
```

## Common Security Threats

### 1. Brute Force Attacks

**Protection:** Rate limiting on auth endpoints

```typescript
// Limits login attempts to 5 per 15 minutes
RATE_LIMITS["/api/auth/login"] = {
  requests: 5,
  window: 15 * 60,
};
```

### 2. SQL Injection

**Protection:** Not applicable (Firestore uses NoSQL), but good practices still apply

### 3. XSS Attacks

**Protection:** 
- React automatically escapes
- Content Security Policy headers
- Input validation

### 4. CSRF Attacks

**Protection:** Double-submit cookie pattern

### 5. DDoS Attacks

**Protection:**
- Rate limiting
- API firewall
- CDN (Vercel/Cloudflare)

## Security Checklist

- ✅ HTTPS enforced in production
- ✅ Rate limiting enabled
- ✅ API firewall active
- ✅ CSRF protection enabled
- ✅ Security headers set
- ✅ Audit logging configured
- ✅ Input validation on all endpoints
- ✅ Authentication on protected routes
- ✅ Environment variables secure
- ✅ Error messages don't leak sensitive info

## Troubleshooting

### Rate Limit False Positives

If legitimate users hit rate limits:
- Increase limits for specific endpoints
- Adjust window size
- Whitelist trusted IPs

### CSRF Token Issues

If CSRF validation fails:
- Check cookies are enabled
- Verify token is sent in header
- Check domain/subdomain settings

### Security Headers Blocking Content

If security headers block legitimate content:
- Adjust Content-Security-Policy
- Review X-Frame-Options settings
- Check CORS configuration

## Learn More

- [Security Overview](../security/overview) - Detailed security documentation
- [API Security](../security/api-security) - API route security
- [Rate Limiting](../security/rate-limiting) - Rate limit configuration
- [CSRF Protection](../security/csrf-protection) - CSRF implementation
- [Security Headers](../security/security-headers) - HTTP headers configuration
