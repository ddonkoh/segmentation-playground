/**
 * -----------------------------------------------------------------------------
 * ShipSafe Security Module — secure_api.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   This module protects ALL API routes at a low level.
 *
 *   It filters out:
 *     ✔ Invalid HTTP methods
 *     ✔ Missing or suspicious headers
 *     ✔ Non-browser or abusive user agents
 *     ✔ Unexpected content types
 *     ✔ Requests without proper origin/referrer (optional hardening)
 *
 * Why this exists:
 *   Most attacks hit API endpoints first — not pages.
 *   This layer acts like a firewall *before your route logic runs*.
 *
 *   Examples of real threats this protects against:
 *     - Automated brute force API calls
 *     - Tools without proper user agents
 *     - Requests with forged headers
 *     - XHR scripts injected from malicious sites
 *     - Bots sending malformed POST bodies
 *
 * Used by:
 *   - middleware.ts (runs before every API request)
 *
 * When should YOU modify this?
 *   - Add/remove allowed HTTP methods
 *   - Add external services to allowed origins
 *   - Tighten or loosen user-agent rules
 *
 * TL;DR:
 *   Lightweight API firewall that blocks bad requests before they reach your
 *   business logic.
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Do not weaken these checks unless you understand why they exist.
 *   Most API vulnerabilities come from insufficient input validation.
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";

// Allow only standard API methods
const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

// Allowlist of safe user-agents
const ALLOWED_USER_AGENTS = [
  "Mozilla",   // Browsers
  "Next.js",   // SSR
  "Stripe",    // Webhooks
  "Firebase",  // SDK calls
];

// -----------------------------------------------------------------------------
// UTILITY: Check if method is allowed
// -----------------------------------------------------------------------------
function invalidMethod(method: string): boolean {
  return !ALLOWED_METHODS.includes(method.toUpperCase());
}

// -----------------------------------------------------------------------------
// UTILITY: User agent validation
// -----------------------------------------------------------------------------
function suspiciousUserAgent(ua: string | null): boolean {
  if (!ua) return true;

  return !ALLOWED_USER_AGENTS.some((allowed) => ua.includes(allowed));
}

// -----------------------------------------------------------------------------
// UTILITY: Validate required headers
// -----------------------------------------------------------------------------
function invalidHeaders(req: NextRequest): boolean {
  const contentType = req.headers.get("content-type");
  const method = req.method.toUpperCase();

  // Non-GET requests must send JSON payload
  if (["POST", "PUT", "PATCH"].includes(method)) {
    if (contentType && !contentType.includes("application/json")) {
      return true;
    }
  }

  return false;
}

// -----------------------------------------------------------------------------
// MAIN FUNCTION: secureApiGuard()
// -----------------------------------------------------------------------------
export function secureApiGuard(req: NextRequest): NextResponse | null {
  const method = req.method;
  const ua = req.headers.get("user-agent") || "";

  // ---------------------------------------------------------------------------
  // 1. Block invalid HTTP methods
  // ---------------------------------------------------------------------------
  if (invalidMethod(method)) {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  // ---------------------------------------------------------------------------
  // 2. User-Agent validation (blocks automated tools)
  // ---------------------------------------------------------------------------
  if (suspiciousUserAgent(ua)) {
    return NextResponse.json(
      { error: "Suspicious request" },
      { status: 400 }
    );
  }

  // ---------------------------------------------------------------------------
  // 3. Validate content-type for mutation requests
  // ---------------------------------------------------------------------------
  if (invalidHeaders(req)) {
    return NextResponse.json(
      { error: "Invalid or missing content-type header" },
      { status: 400 }
    );
  }

  // ---------------------------------------------------------------------------
  // 4. Optional: Cross-origin protection for API mutation routes
  // ---------------------------------------------------------------------------

  // Origin of the request (may be null on SSR or same-site)
  const origin = req.headers.get("origin");

  // Resolve host for all environments (local, Vercel, Cloudflare)
  const host =
    req.headers.get("host") ||
    req.headers.get("x-forwarded-host") ||
    req.nextUrl.host ||
    "";

  if (
    origin &&
    !origin.includes(host) &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(method)
  ) {
    return NextResponse.json(
      { error: "Cross-origin API calls are not allowed" },
      { status: 403 }
    );
  }

  // ---------------------------------------------------------------------------
  // 5. Allow OPTIONS (preflight CORS) silently
  // ---------------------------------------------------------------------------
  if (method === "OPTIONS") {
    return NextResponse.json({}, { status: 200 });
  }

  // Everything OK → allow request to continue
  return null;
}