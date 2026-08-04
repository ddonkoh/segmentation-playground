# Rate Limiting

Complete guide to rate limiting in ShipSafe, explaining the concept and showcasing the implementation.

## Overview

Rate limiting restricts the number of requests a client can make within a time window, preventing abuse, brute force attacks, and resource exhaustion.

**Why Rate Limiting Matters:**
- Prevents brute force attacks
- Protects against DDoS
- Ensures fair resource usage
- Prevents API abuse
- Reduces server costs

## Concept: Rate Limiting

### How It Works

Rate limiting uses a **sliding window** algorithm:

1. **Track Requests:** Count requests per IP address
2. **Time Window:** Reset counter after time window expires
3. **Enforce Limit:** Block requests exceeding the limit
4. **Reset:** Start new window after expiration

### Algorithm: Token Bucket

ShipSafe implements a simplified token bucket:
- Each IP gets a "bucket" of requests
- Requests consume tokens
- Tokens refill after window expires
- Requests denied when bucket is empty

## Implementation: Rate Limiting

### Code Showcase

**Location:** `src/lib/security/rate_limit.ts`

```typescript
/**
 * Rate Limiting - Prevents abuse with per-IP request limits
 */

import { NextRequest, NextResponse } from "next/server";

// Configuration
const MAX_REQUESTS = 50;              // Max requests per window
const WINDOW_MS = 60 * 1000;          // 1 minute window

// In-memory store (Map of IP → RateRecord)
type RateRecord = {
  count: number;        // Number of requests made
  lastReset: number;    // Timestamp of last window reset
};

const ipStore: Map<string, RateRecord> = new Map();

// Extract client IP from request headers
export function getClientIp(req: NextRequest): string {
  const headerCandidates = [
    req.headers.get("cf-connecting-ip"),  // Cloudflare
    req.headers.get("x-real-ip"),         // Nginx/Proxy
    req.headers.get("x-forwarded-for"),   // Vercel/Proxies
    (req as any).ip,                      // Next.js local dev
  ];

  const rawIp = headerCandidates.find(
    (ip) => typeof ip === "string" && ip.length > 0
  );

  // Sanitize: "123.123.123.123, another-ip" → "123.123.123.123"
  if (rawIp) {
    return rawIp.split(",")[0].trim();
  }

  return "unknown";
}

// Main rate limiting function
export function ipRateLimit(req: NextRequest): NextResponse | null {
  const ip = getClientIp(req);

  // Skip rate limiting in development (better DX)
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const now = Date.now();
  const existing = ipStore.get(ip);

  // First request from this IP - initialize
  if (!existing) {
    ipStore.set(ip, { count: 1, lastReset: now });
    return null; // Allow request
  }

  // Check if window has expired - reset counter
  if (now - existing.lastReset > WINDOW_MS) {
    ipStore.set(ip, { count: 1, lastReset: now });
    return null; // Allow request (new window)
  }

  // Increment request count
  existing.count += 1;

  // Block if exceeding limit
  if (existing.count > MAX_REQUESTS) {
    return NextResponse.json(
      {
        error: "Too many requests — please slow down.",
        retryAfterMs: WINDOW_MS,
      },
      { status: 429 } // Too Many Requests
    );
  }

  return null; // Allow request
}
```

### Middleware Integration

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  // ... HTTPS enforcement

  // 2. IP Rate Limiting
  const rateLimitResponse = ipRateLimit(req);
  if (rateLimitResponse) {
    logSecurityEvent(req, "rate_limit_block");
    return rateLimitResponse; // Block request
  }

  // ... continue with other security layers
}
```

## Rate Limiting Behavior

### Request Flow

```
Request 1: IP 1.2.3.4 → count: 1 ✅ Allowed
Request 2: IP 1.2.3.4 → count: 2 ✅ Allowed
...
Request 50: IP 1.2.3.4 → count: 50 ✅ Allowed
Request 51: IP 1.2.3.4 → count: 51 ❌ Blocked (429)

[1 minute passes]

Request 52: IP 1.2.3.4 → count: 1 ✅ Allowed (new window)
```

### Response Headers

When rate limited, response includes:

```json
{
  "error": "Too many requests — please slow down.",
  "retryAfterMs": 60000
}
```

HTTP Status: `429 Too Many Requests`

## Configuration

### Default Settings

```typescript
// Current defaults
MAX_REQUESTS = 50 requests
WINDOW_MS = 60,000 ms (1 minute)

// Result: 50 requests per minute per IP
```

### Customizing Limits

Adjust limits in `src/lib/security/rate_limit.ts`:

```typescript
// More restrictive (10 requests per minute)
const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 1000;

// More permissive (100 requests per 15 minutes)
const MAX_REQUESTS = 100;
const WINDOW_MS = 15 * 60 * 1000;
```

### Per-Endpoint Limits

For endpoint-specific limits, extend the rate limiter:

```typescript
// src/lib/security/rate_limit.ts

const ENDPOINT_LIMITS: Record<string, { max: number; window: number }> = {
  "/api/auth/login": { max: 5, window: 15 * 60 * 1000 },      // 5 per 15 min
  "/api/auth/signup": { max: 3, window: 60 * 60 * 1000 },     // 3 per hour
  "/api/user/update": { max: 10, window: 60 * 1000 },         // 10 per minute
};

export function ipRateLimit(req: NextRequest): NextResponse | null {
  const path = req.nextUrl.pathname;
  const endpointLimit = ENDPOINT_LIMITS[path];

  if (endpointLimit) {
    // Use endpoint-specific limit
    const { max: MAX_REQUESTS, window: WINDOW_MS } = endpointLimit;
    // ... apply limit
  } else {
    // Use default limit
    // ... apply default
  }
}
```

## Best Practices

### 1. Set Appropriate Limits

✅ **Do:**
- Balance security and usability
- More restrictive for auth endpoints
- More permissive for public endpoints
- Monitor and adjust based on usage

❌ **Don't:**
- Set limits too low (blocks legitimate users)
- Set limits too high (allows abuse)
- Ignore rate limit violations

### 2. Provide Clear Error Messages

✅ **Do:**
```typescript
return NextResponse.json(
  {
    error: "Too many requests — please slow down.",
    retryAfterMs: WINDOW_MS,  // Helpful: when to retry
  },
  { status: 429 }
);
```

❌ **Don't:**
```typescript
return NextResponse.json(
  { error: "Error" },  // Not helpful
  { status: 429 }
);
```

### 3. Log Rate Limit Violations

Rate limit blocks are automatically logged:

```typescript
// middleware.ts
if (rateLimitResponse) {
  logSecurityEvent(req, "rate_limit_block"); // ✅ Logged
  return rateLimitResponse;
}
```

### 4. Consider Different Limits for Different Endpoints

- **Auth endpoints:** 5-10 requests per 15 minutes
- **Public endpoints:** 100 requests per minute
- **Webhooks:** 1000 requests per hour
- **Dashboard APIs:** 50 requests per minute

## Serverless Considerations

### In-Memory Storage

The current implementation uses in-memory storage:

```typescript
const ipStore: Map<string, RateRecord> = new Map();
```

**Limitations in Serverless:**
- Each function instance has its own memory
- Rate limits reset when function restarts
- Not shared across instances

**This is acceptable for:**
- Small to medium SaaS applications
- Development environments
- Early-stage products

### Production Scaling

For production at scale, consider:

1. **Redis/Upstash:**
   ```typescript
   import { Redis } from "@upstash/redis";
   const redis = new Redis({ url: "...", token: "..." });
   
   // Store rate limit in Redis (shared across instances)
   await redis.set(`rate_limit:${ip}`, count, { ex: WINDOW_SECONDS });
   ```

2. **Database:**
   ```typescript
   // Store rate limits in Firestore
   const doc = await firestore.collection("rate_limits").doc(ip).get();
   ```

3. **Edge Functions:**
   - Use edge-optimized rate limiting
   - Leverage Cloudflare/Vercel edge storage

## Example: Rate Limited Request

### Client Request

```bash
# Make 51 requests quickly
for i in {1..51}; do
  curl http://localhost:3000/api/user/me
done
```

### Server Response (Request 51)

```json
{
  "error": "Too many requests — please slow down.",
  "retryAfterMs": 60000
}
```

HTTP Status: `429 Too Many Requests`

### Audit Log

```typescript
{
  type: "rate_limit_block",
  ip: "1.2.3.4",
  path: "/api/user/me",
  method: "GET",
  timestamp: 1234567890
}
```

## Troubleshooting

### Legitimate Users Getting Blocked

**Problem:** Real users hit rate limits

**Solutions:**
1. Increase `MAX_REQUESTS` if too restrictive
2. Increase `WINDOW_MS` to allow more requests
3. Implement user-based rate limiting (not just IP-based)
4. Add exception for authenticated users

### Rate Limits Not Working

**Problem:** Requests not being rate limited

**Solutions:**
1. Check `NODE_ENV === "production"` (disabled in dev)
2. Verify middleware is running
3. Check IP extraction is working
4. Review audit logs

### Too Many False Positives

**Problem:** Legitimate traffic being blocked

**Solutions:**
1. Review rate limit thresholds
2. Adjust limits based on actual usage patterns
3. Implement sliding window instead of fixed window
4. Add whitelist for trusted IPs

## Learn More

- [Security Overview](./overview) - Complete security architecture
- [API Security](./api-security) - API endpoint protection
- [Audit Logging](./overview.md#layer-6-audit-logging) - Security event tracking
