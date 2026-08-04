/**
 * -----------------------------------------------------------------------------
 * ShipSafe Security Module — rate_limit.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   This module implements a small but effective IP-based rate limiter using
 *   a token-bucket strategy.
 *
 *   It protects your API from:
 *     ✔ Brute force attempts
 *     ✔ Rapid-fire POST/PUT/PATCH spam
 *     ✔ Scripted scanning or probing
 *     ✔ Abusive clients hitting endpoints too fast
 *
 * Why this exists:
 *   Any public API is vulnerable to abuse. Rate limiting ensures that
 *   one user cannot overload your server or brute force authentication.
 *
 * Used by:
 *   - middleware.ts (global enforcement)
 *
 * TL;DR:
 *   Each IP gets a limited number of requests per minute.
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Production SaaS should ALWAYS enforce rate limiting.
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";

// -----------------------------------------------------------------------------
// CONFIGURABLE RATE LIMIT SETTINGS
// -----------------------------------------------------------------------------

/**
 * Maximum number of requests allowed per IP during the window.
 */
const MAX_REQUESTS = 50;

/**
 * Window size in milliseconds.
 *  - 60,000 ms = 1 minute
 */
const WINDOW_MS = 60 * 1000;

/**
 * In-memory store mapping IP → state.
 *
 * NOTE:
 *   In serverless (e.g., Vercel), each function instance maintains its own
 *   memory. For small SaaS projects this is perfectly acceptable.
 */
type RateRecord = {
  count: number;
  lastReset: number;
};

const ipStore: Map<string, RateRecord> = new Map();

// -----------------------------------------------------------------------------
// Extract request IP with full TypeScript safety
// -----------------------------------------------------------------------------

/**
 * Extract an IP address from multiple potential header sources.
 *
 * Why?
 *   Different hosts expose the client IP in different places:
 *     - Local dev → req.ip
 *     - Vercel → x-forwarded-for
 *     - Cloudflare → cf-connecting-ip
 *     - Nginx/Proxy → x-real-ip
 */
export function getClientIp(req: NextRequest): string {
  // Next.js request may have ip property in local dev (not in types)
  const nextReq = req as NextRequest & { ip?: string };
  
  const headerCandidates = [
    req.headers.get("cf-connecting-ip"), // Cloudflare
    req.headers.get("x-real-ip"),        // Nginx/Proxy
    req.headers.get("x-forwarded-for"),  // Vercel/Proxies
    nextReq.ip,                          // Next.js local dev (not typed)
  ];

  const rawIp = headerCandidates.find((ip) => typeof ip === "string" && ip.length > 0);

  // Sanitize output — strip extra stuff like "123.123.123.123, another-ip"
  if (rawIp) {
    return rawIp.split(",")[0].trim();
  }

  return "unknown";
}

// -----------------------------------------------------------------------------
// MAIN RATE LIMITER FUNCTION
// -----------------------------------------------------------------------------

export function ipRateLimit(req: NextRequest): NextResponse | null {
  const ip = getClientIp(req);

  // No rate limiting in development (helps DX)
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const now = Date.now();
  const existing = ipStore.get(ip);

  if (!existing) {
    // First request from this IP
    ipStore.set(ip, { count: 1, lastReset: now });
    return null;
  }

  // Reset the window if expired
  if (now - existing.lastReset > WINDOW_MS) {
    ipStore.set(ip, { count: 1, lastReset: now });
    return null;
  }

  // Increase count
  existing.count += 1;

  // Deny if exceeding limit
  if (existing.count > MAX_REQUESTS) {
    return NextResponse.json(
      {
        error: "Too many requests — please slow down.",
        retryAfterMs: WINDOW_MS,
      },
      { status: 429 }
    );
  }

  return null;
}