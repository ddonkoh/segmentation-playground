/**
 * -----------------------------------------------------------------------------
 * ShipSafe Security Module — audit.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   This module provides a lightweight but effective way to record suspicious
 *   activity across your application.
 *
 *   It allows tracking of events such as:
 *     ✔ Invalid API access attempts
 *     ✔ Suspicious user-agents
 *     ✔ Repeated rate-limit violations
 *     ✔ CSRF failures
 *     ✔ Unauthorized access to protected routes
 *
 * Why this exists:
 *   Security incidents often go unnoticed until it’s too late. Maintaining a
 *   simple audit log helps developers detect:
 *     - Attack patterns
 *     - Brute force attempts
 *     - Misconfigurations
 *     - Abuse from specific IPs
 *
 * Used by:
 *   - middleware.ts (global entry point)
 *   - /api routes for custom audit events
 *   - rate_limit.ts / secure_api.ts / csrf.ts
 *
 * When should YOU modify this?
 *   ✔ Add integrations (Logtail, Datadog, Supabase logging)
 *   ✔ Add custom audit event types
 *   ✔ Add webhook notifications (Slack/Discord)
 *
 * TL;DR:
 *   Centralized place to log important security events.
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Logging **does not replace** security controls — but it's essential for
 *   visibility. Never log sensitive data (passwords, OAuth tokens, secrets).
 * -----------------------------------------------------------------------------
 */

import { NextRequest } from "next/server";

// -----------------------------------------------------------------------------
// 1. Audit event structure (TypeScript)
// -----------------------------------------------------------------------------

export type AuditEvent = {
  type: string;          // "csrf_failed", "rate_limit_exceeded", etc.
  ip: string;            // client IP address
  path: string;          // request path
  method: string;        // GET/POST/etc.
  userAgent?: string;    // client user-agent
  detail?: string;       // additional text
  timestamp: number;     // Unix timestamp
};

// -----------------------------------------------------------------------------
// 2. Extract IP with same method used across ShipSafe
// -----------------------------------------------------------------------------

function getIp(req: NextRequest): string {
  // Next.js request may have ip property in local dev (not in types)
  const nextReq = req as NextRequest & { ip?: string };
  
  const headerCandidates = [
    req.headers.get("cf-connecting-ip"),
    req.headers.get("x-real-ip"),
    req.headers.get("x-forwarded-for"),
    nextReq.ip,
  ];

  const raw = headerCandidates.find((x) => typeof x === "string" && x.length);
  return raw ? raw.split(",")[0].trim() : "unknown";
}

// -----------------------------------------------------------------------------
// 3. In-memory audit log (serverless friendly)
// -----------------------------------------------------------------------------

/**
 * NOTE:
 *   - In serverless environments, logs exist per-instance.
 *   - For small SaaS apps, this is fine.
 *   - For production-level auditing, integrate a database or log service.
 */
const auditLog: AuditEvent[] = [];

/**
 * Returns the last N audit events.
 * Helpful for developers inspecting logs.
 */
export function getAuditLogs(limit = 100): AuditEvent[] {
  return auditLog.slice(-limit);
}

// -----------------------------------------------------------------------------
// 4. logSecurityEvent() — main function
// -----------------------------------------------------------------------------

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

  // Save event locally
  auditLog.push(event);

  // ---------------------------------------------------------------------------
  // DEV MODE: Print to console (super helpful during debugging)
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    console.warn("🔐 [ShipSafe Audit Event]", event);
  }

  // ---------------------------------------------------------------------------
  // PLACEHOLDER: Optional production integrations
  // ---------------------------------------------------------------------------
  // Option 1: External log service (Datadog, Logtail, Logflare)
  // await sendToLogService(event);
  //
  // Option 2: Save to your database
  // await saveAuditEventToDB(event);
  //
  // Option 3: Discord / Slack notification
  // await sendSecurityAlertWebhook(event);

  return event;
}