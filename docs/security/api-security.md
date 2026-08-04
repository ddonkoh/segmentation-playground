# API Security

Complete guide to API endpoint security in ShipSafe, including the API firewall, validation, and authentication patterns.

## Overview

ShipSafe's API security uses multiple layers to protect your endpoints from common attacks and abuse. The API firewall acts as the first line of defense, blocking invalid requests before they reach your route handlers.

**Security Layers:**
1. **API Firewall** - Validates request format and blocks suspicious requests
2. **Rate Limiting** - Prevents abuse and DDoS
3. **CSRF Protection** - Prevents cross-site request forgery
4. **Input Validation** - Zod schemas validate all inputs
5. **Authentication** - Firebase ID token verification

## Concept: API Firewall

**What is an API Firewall?**

An API firewall validates requests at the edge, before they reach your application logic. It acts as a gatekeeper, blocking:
- Invalid HTTP methods
- Requests from suspicious user agents
- Malformed headers
- Unauthorized access attempts

**Why It Matters:**

Most attacks target API endpoints first because they:
- Are publicly accessible
- Handle sensitive operations
- Can bypass UI validation
- Are easier to automate

**ShipSafe's Approach:**

The API firewall is lightweight, runs in middleware, and has minimal performance impact while providing strong protection.

## Implementation: API Firewall

### Code Showcase

**Location:** `src/lib/security/secure_api.ts`

```typescript
/**
 * API Firewall - Blocks invalid requests before they reach route handlers
 */

import { NextRequest, NextResponse } from "next/server";

// Allowed HTTP methods (blocks HEAD, OPTIONS, TRACE, etc.)
const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

// Safe user-agents (blocks bots and automated tools)
const ALLOWED_USER_AGENTS = [
  "Mozilla",   // Browsers (Chrome, Firefox, Safari)
  "Next.js",   // Next.js SSR requests
  "Stripe",    // Stripe webhooks
  "Firebase",  // Firebase SDK calls
];

// Validate HTTP method
function invalidMethod(method: string): boolean {
  return !ALLOWED_METHODS.includes(method.toUpperCase());
}

// Detect suspicious user agents
function suspiciousUserAgent(ua: string): boolean {
  if (!ua || ua.length === 0) return true; // Missing UA is suspicious
  
  // Check if UA contains any allowed pattern
  return !ALLOWED_USER_AGENTS.some(allowed => ua.includes(allowed));
}

// Validate headers for mutation requests
function invalidHeaders(req: NextRequest): boolean {
  const method = req.method.toUpperCase();
  
  // POST/PUT/PATCH require Content-Type header
  if (["POST", "PUT", "PATCH"].includes(method)) {
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return true; // Invalid or missing content-type
    }
  }
  
  return false;
}

// Main API firewall function
export function secureApiGuard(req: NextRequest): NextResponse | null {
  const method = req.method;
  const ua = req.headers.get("user-agent") || "";

  // 1. Block invalid HTTP methods
  if (invalidMethod(method)) {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  // 2. Block suspicious user agents
  if (suspiciousUserAgent(ua)) {
    return NextResponse.json(
      { error: "Suspicious request" },
      { status: 400 }
    );
  }

  // 3. Validate content-type for mutation requests
  if (invalidHeaders(req)) {
    return NextResponse.json(
      { error: "Invalid or missing content-type header" },
      { status: 400 }
    );
  }

  // 4. Optional: Cross-origin protection
  const origin = req.headers.get("origin");
  const host = req.headers.get("host") || req.nextUrl.host;

  if (
    origin &&
    !origin.includes(host) &&
    req.headers.get("referer") &&
    !req.headers.get("referer")?.includes(host)
  ) {
    // Cross-origin request - block if suspicious
    // Note: This can be relaxed for public APIs
  }

  return null; // Request passed firewall checks
}
```

### Middleware Integration

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ... HTTPS and rate limiting

  // 3. API Security (Firewall) - Only for API routes
  if (path.startsWith("/api")) {
    const apiValidation = secureApiGuard(req);
    if (apiValidation) {
      logSecurityEvent(req, "api_security_block");
      return apiValidation; // Block request
    }
  }

  // ... continue with other security layers
}
```

## Protected API Route Pattern

### Standard Secure Route

```typescript
// src/app/api/user/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";
import { z } from "zod";

const updateUserSchema = z.object({
  displayName: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication (API firewall already validated request format)
    const user = await requireAuth(req);

    // 2. Input validation
    const body = await req.json();
    const data = updateUserSchema.parse(body);

    // 3. Authorization (check user can update this resource)
    // ... your business logic

    // 4. Process request
    // ... update user

    return NextResponse.json({
      success: true,
      data: { message: "User updated" },
    });
  } catch (error) {
    // Error handling...
  }
}
```

### Request Flow

```
1. Client Request
   ↓
2. HTTPS Enforcement ✅
   ↓
3. Rate Limiting ✅
   ↓
4. API Firewall ✅ (checks method, UA, headers)
   ↓
5. CSRF Protection ✅ (for mutations)
   ↓
6. Route Handler
   ↓
7. Authentication ✅
   ↓
8. Input Validation ✅
   ↓
9. Business Logic
   ↓
10. Response
```

## What Gets Blocked

### Blocked Requests

The API firewall blocks:

1. **Invalid HTTP Methods:**
   ```
   HEAD /api/user/me      ❌ Blocked (405)
   OPTIONS /api/user/me   ❌ Blocked (405)
   TRACE /api/user/me     ❌ Blocked (405)
   ```

2. **Suspicious User Agents:**
   ```
   User-Agent: ""                    ❌ Blocked (missing UA)
   User-Agent: "curl/7.68.0"         ❌ Blocked (automated tool)
   User-Agent: "python-requests"     ❌ Blocked (script)
   ```

3. **Malformed Headers:**
   ```
   POST /api/user/update
   (no Content-Type header)          ❌ Blocked (400)
   
   POST /api/user/update
   Content-Type: text/plain          ❌ Blocked (invalid type)
   ```

### Allowed Requests

The API firewall allows:

1. **Valid Browser Requests:**
   ```
   GET /api/user/me
   User-Agent: Mozilla/5.0...        ✅ Allowed
   ```

2. **Valid API Calls:**
   ```
   POST /api/user/update
   Content-Type: application/json
   User-Agent: Mozilla/5.0...        ✅ Allowed
   ```

3. **Webhook Requests:**
   ```
   POST /api/webhooks/stripe
   User-Agent: Stripe/1.0...         ✅ Allowed
   ```

## Customization

### Adding Allowed User Agents

If you need to allow additional user agents:

```typescript
// src/lib/security/secure_api.ts
const ALLOWED_USER_AGENTS = [
  "Mozilla",
  "Next.js",
  "Stripe",
  "Firebase",
  "YourService", // Add custom service
];
```

### Relaxing Cross-Origin Checks

For public APIs that accept cross-origin requests:

```typescript
// src/lib/security/secure_api.ts
export function secureApiGuard(req: NextRequest): NextResponse | null {
  // ... existing checks

  // Optional: Allow specific origins for public APIs
  const allowedOrigins = [
    "https://yourdomain.com",
    "https://app.yourdomain.com",
  ];

  const origin = req.headers.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    // Allow this origin
    return null;
  }

  // ... rest of validation
}
```

### Per-Endpoint Rules

You can customize firewall behavior per endpoint:

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Webhook endpoints need different rules
  if (path.startsWith("/api/webhooks")) {
    // Webhooks may come from external services
    // Apply different validation
  } else if (path.startsWith("/api")) {
    // Standard API firewall
    const apiValidation = secureApiGuard(req);
    if (apiValidation) return apiValidation;
  }
}
```

## Best Practices

### 1. Keep Firewall Rules Strict

✅ **Do:**
- Block suspicious user agents
- Validate all headers
- Enforce content-type requirements

❌ **Don't:**
- Relax security for convenience
- Allow requests without user agents
- Skip header validation

### 2. Monitor Blocked Requests

Review audit logs to understand attack patterns:

```typescript
// Audit events logged automatically
logSecurityEvent(req, "api_security_block");
```

### 3. Customize for Your Needs

Adjust firewall rules based on:
- Your API's requirements
- External services you integrate with
- Specific attack patterns you see

## Troubleshooting

### Request Blocked Unexpectedly

**Problem:** Valid request is blocked

**Solutions:**
1. Check user agent is included in ALLOWED_USER_AGENTS
2. Verify Content-Type header is `application/json` for mutations
3. Ensure HTTP method is in ALLOWED_METHODS
4. Review audit logs for specific reason

### Webhook Requests Blocked

**Problem:** Stripe/webhook requests are blocked

**Solutions:**
1. Ensure webhook user agent is in ALLOWED_USER_AGENTS
2. Add webhook-specific exception in middleware
3. Verify webhook endpoint path matches your configuration

## Learn More

- [Security Overview](./overview) - Complete security architecture
- [Rate Limiting](./rate-limiting) - Rate limiting details
- [CSRF Protection](./csrf-protection) - CSRF implementation
- [API Routes Tutorial](../tutorials/api-routes) - Creating secure APIs
