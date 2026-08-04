# Monitoring

Complete guide to monitoring your ShipSafe deployment, including error tracking, performance monitoring, and security event logging.

## Overview

Monitoring your production deployment is essential for maintaining reliability, performance, and security. ShipSafe includes built-in audit logging and can integrate with external monitoring services.

**What You Should Monitor:**
- ✅ **Application errors** - Track and fix bugs quickly
- ✅ **Performance metrics** - Optimize slow operations
- ✅ **Security events** - Detect attacks and abuse
- ✅ **User activity** - Understand usage patterns

## Concept: Production Monitoring

### Why Monitoring Matters

**Benefits:**
- **Early Detection** - Catch issues before users report them
- **Performance Insights** - Identify bottlenecks and optimize
- **Security Visibility** - Detect attacks and suspicious activity
- **Data-Driven Decisions** - Make informed improvements

### Monitoring Layers

1. **Application Monitoring** - Errors, exceptions, crashes
2. **Performance Monitoring** - Response times, throughput
3. **Security Monitoring** - Attack attempts, violations
4. **Infrastructure Monitoring** - Server health, resources

## Built-In Audit Logging

ShipSafe includes built-in security audit logging for tracking security events.

### Code Showcase

**Location:** `src/lib/security/audit.ts`

```typescript
/**
 * Audit Logging - Tracks security events for monitoring
 */

import { NextRequest } from "next/server";

export type AuditEvent = {
  type: string;          // "csrf_failed", "rate_limit_exceeded", etc.
  ip: string;            // client IP address
  path: string;          // request path
  method: string;        // GET/POST/etc.
  userAgent?: string;    // client user-agent
  detail?: string;       // additional context
  timestamp: number;     // Unix timestamp
};

// In-memory audit log (serverless friendly)
const auditLog: AuditEvent[] = [];

// Log security event
export function logSecurityEvent(
  req: NextRequest,
  type: string,
  detail?: string
) {
  const event: AuditEvent = {
    type,
    ip: getIp(req),
    path: req.nextUrl.pathname,
    method: req.method,
    userAgent: req.headers.get("user-agent") ?? undefined,
    detail,
    timestamp: Date.now(),
  };

  auditLog.push(event);

  // Development: Print to console
  if (process.env.NODE_ENV !== "production") {
    console.warn("🔐 [ShipSafe Audit Event]", event);
  }

  return event;
}

// Get recent audit logs
export function getAuditLogs(limit = 100): AuditEvent[] {
  return auditLog.slice(-limit);
}
```

### Automatic Security Event Logging

Security events are automatically logged in middleware:

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  // Rate limit blocked
  const rateLimitResponse = ipRateLimit(req);
  if (rateLimitResponse) {
    logSecurityEvent(req, "rate_limit_block"); // ✅ Logged
    return rateLimitResponse;
  }

  // API firewall blocked
  if (apiValidation) {
    logSecurityEvent(req, "api_security_block"); // ✅ Logged
    return apiValidation;
  }

  // CSRF failed
  if (csrfValidation) {
    logSecurityEvent(req, "csrf_failed"); // ✅ Logged
    return csrfValidation;
  }
}
```

### Accessing Audit Logs

**API Route for Audit Logs:**

```typescript
// src/app/api/admin/audit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";
import { getAuditLogs } from "@/lib/security/audit";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    // Check admin role
    const role = user.customClaims?.role;
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Get audit logs
    const logs = getAuditLogs(100); // Last 100 events

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    // Error handling...
  }
}
```

## Error Tracking

### Concept: Error Tracking

Error tracking services capture, aggregate, and notify you about application errors, making debugging faster and more effective.

**Benefits:**
- Real-time error notifications
- Error aggregation and grouping
- Stack traces and context
- Performance impact tracking

### Recommended Tools

**Sentry (Recommended):**

```bash
npm install @sentry/nextjs
```

**Setup:**

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Usage in Code:**

```typescript
// src/app/api/user/update/route.ts
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  try {
    // Your code...
  } catch (error) {
    // Log error to Sentry
    Sentry.captureException(error, {
      tags: { route: "/api/user/update" },
      extra: { userId: user?.uid },
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Other Options:**
- **LogRocket** - Session replay + error tracking
- **Rollbar** - Error tracking with context
- **Bugsnag** - Real-time error monitoring

## Performance Monitoring

### Concept: Performance Monitoring

Performance monitoring tracks metrics like response times, throughput, and resource usage to identify bottlenecks and optimize your application.

**Key Metrics:**
- Page load times
- API response times
- Database query performance
- Third-party service latency

### Vercel Analytics

**Built-in Analytics:**

Vercel provides built-in analytics for Next.js apps:

```typescript
// Enable in next.config.ts
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // Vercel Analytics automatically enabled
};

export default nextConfig;
```

**View Metrics:**
1. Go to Vercel dashboard
2. Navigate to **Analytics** tab
3. View:
   - Page views
   - Response times
   - Error rates
   - Geographic distribution

### Custom Performance Monitoring

**Track API Response Times:**

```typescript
// src/app/api/user/me/route.ts
export async function GET(req: NextRequest) {
  const startTime = Date.now();

  try {
    // Your logic...

    const duration = Date.now() - startTime;

    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow API call: /api/user/me took ${duration}ms`);
      // Or send to monitoring service
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Error handling...
  }
}
```

**Track Database Query Performance:**

```typescript
// Track Firestore query time
const startTime = Date.now();
const snapshot = await firestore.collection("users").get();
const duration = Date.now() - startTime;

if (duration > 500) {
  console.warn(`Slow query: users collection took ${duration}ms`);
}
```

## Security Monitoring

### What to Monitor

**Security Events:**
- Failed authentication attempts
- Rate limit violations
- CSRF token failures
- API firewall blocks
- Unauthorized access attempts

### ShipSafe's Audit Logging

Security events are automatically logged:

```typescript
// Events logged automatically:
- "rate_limit_block"     - IP exceeded rate limit
- "api_security_block"   - Request blocked by API firewall
- "csrf_failed"          - CSRF token validation failed
- "auth_failed"          - Authentication failed
- "unauthorized_access"  - Unauthorized route access
```

**Access Logs:**

```typescript
// Get recent security events
import { getAuditLogs } from "@/lib/security/audit";

const logs = getAuditLogs(100); // Last 100 events

// Filter by type
const rateLimitViolations = logs.filter(
  log => log.type === "rate_limit_block"
);

// Filter by IP
const suspiciousIPs = logs.filter(
  log => log.ip === "1.2.3.4"
);
```

### External Security Monitoring

**Integrate with Log Services:**

```typescript
// src/lib/security/audit.ts
import { sendToLogService } from "./log-service";

export function logSecurityEvent(
  req: NextRequest,
  type: string,
  detail?: string
) {
  const event: AuditEvent = {
    // ... create event
  };

  auditLog.push(event);

  // Send to external service (e.g., Datadog, Logtail)
  if (process.env.NODE_ENV === "production") {
    sendToLogService(event); // ✅ External logging
  }

  return event;
}
```

## Production Monitoring Setup

### Step 1: Error Tracking

**Sentry Setup:**

1. Create Sentry account at [sentry.io](https://sentry.io)
2. Create new project (Next.js)
3. Copy DSN
4. Add to environment variables:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
   SENTRY_DSN=https://...@sentry.io/...
   ```
5. Install and configure Sentry SDK

### Step 2: Analytics

**Vercel Analytics:**

- Automatically enabled on Vercel
- View in Vercel dashboard → Analytics

**Google Analytics (Optional):**

```typescript
// Add to layout.tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Step 3: Log Aggregation

**Options:**
- **Vercel Logs** - Built-in for Vercel deployments
- **Datadog** - Comprehensive monitoring
- **Logtail** - Real-time log aggregation
- **Papertrail** - Simple log management

**Integration Example:**

```typescript
// src/lib/monitoring/logger.ts
export function logToService(level: string, message: string, data?: any) {
  if (process.env.NODE_ENV === "production") {
    // Send to log aggregation service
    fetch("https://your-log-service.com/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      }),
    });
  }
}
```

## Monitoring Best Practices

### 1. Set Up Alerts

✅ **Do:**
- Alert on critical errors
- Alert on high error rates
- Alert on security violations
- Alert on performance degradation

**Example:**
```typescript
// Alert if error rate > 5%
if (errorRate > 0.05) {
  sendAlert("High error rate detected");
}
```

### 2. Monitor Key Metrics

**Track:**
- Error rate (errors per request)
- Response time (p50, p95, p99)
- Request rate (requests per minute)
- Security events (violations per hour)

### 3. Regular Reviews

✅ **Do:**
- Review error logs daily
- Review security logs weekly
- Analyze performance monthly
- Update monitoring based on findings

### 4. Use Dashboards

Create dashboards showing:
- Error trends
- Response time graphs
- Security event timeline
- User activity metrics

## Troubleshooting

### No Logs Appearing

**Problem:** Audit logs not showing

**Solutions:**
1. Check `NODE_ENV` is "production"
2. Verify logging is enabled
3. Check log storage location
4. Verify events are being triggered

### Too Many Logs

**Problem:** Logging overwhelming system

**Solutions:**
1. Filter unnecessary events
2. Aggregate similar events
3. Use log sampling
4. Set up log rotation

## Learn More

- [Security Overview](../security/overview) - Security architecture
- [Error Handling](../features/error-handling) - Error handling patterns
- [Middleware Security](../security/middleware) - Complete security architecture including audit logging
