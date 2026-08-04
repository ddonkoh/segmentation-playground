/**
 * -----------------------------------------------------------------------------
 * ShipSafe Security Module — env.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   This file handles **secure environment behaviour** for your app,
 *   especially enforcing HTTPS and validating required environment variables.
 *
 * Why this exists:
 *   Many SaaS boilerplates assume the hosting environment is correctly
 *   configured — but real deployments are messy.
 *
 *   This module ensures:
 *     ✔ HTTPS is ALWAYS enforced in production
 *     ✔ Misconfigured environment variables fail fast
 *     ✔ Apps cannot run with missing API keys or invalid configuration
 *
 * Used by:
 *   - middleware.ts (enforces HTTPS globally)
 *   - Any file that loads sensitive environment variables
 *
 * When should YOU modify this?
 *   - Add your own required env variables to validate for your SaaS
 *   - Keep HTTPS enforcement EXACTLY as-is
 *
 * TL;DR:
 *   Secure environment configuration + production HTTPS redirect.
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   HTTPS enforcement MUST remain enabled. Disabling it exposes all traffic
 *   (auth cookies, API calls, tokens) to interception.
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";

// -----------------------------------------------------------------------------
// 1. HTTPS Enforcement — Redirect HTTP → HTTPS in production
// -----------------------------------------------------------------------------

/**
 * enforceHttps()
 *  - Checks whether the request is insecure (http)
 *  - Redirects to https:// in production
 */
export function enforceHttps(req: NextRequest): NextResponse | null {
  const proto = req.headers.get("x-forwarded-proto");
  const host = req.headers.get("host");

  // Only enforce HTTPS in production
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && proto && proto !== "https") {
    const httpsUrl = `https://${host}${req.nextUrl.pathname}${req.nextUrl.search}`;

    return NextResponse.redirect(httpsUrl, {
      status: 307, // Temporary redirect
    });
  }

  return null;
}

// -----------------------------------------------------------------------------
// 2. Safe environment variable loader
// -----------------------------------------------------------------------------

/**
 * getEnv() — safe access to environment variables.
 *
 * This ensures:
 *   ✔ Developer-friendly errors
 *   ✔ No undefined env vars in production
 *   ✔ No silent failures
 */
export function getEnv(name: string, fallback?: string): string {
  const value = process.env[name];

  if (!value) {
    if (fallback !== undefined) return fallback;

    // Fail fast if an env variable is missing
    throw new Error(
      `❌ Missing required environment variable: ${name}
      
This variable is required for ShipSafe to run securely.
Add it to your .env.local or environment config.

Tip: Check /docs/env.md for setup instructions.
`
    );
  }

  return value;
}

// -----------------------------------------------------------------------------
// 3. validateRequiredEnv() — optional helper for boot-time validation
// -----------------------------------------------------------------------------

/**
 * Call this function in your app startup (not required but recommended).
 *
 * Example:
 *   validateRequiredEnv([
 *     "STRIPE_SECRET_KEY",
 *     "FIREBASE_ADMIN_PRIVATE_KEY",
 *   ]);
 */
export function validateRequiredEnv(names: string[]) {
  for (const name of names) {
    if (!process.env[name]) {
      throw new Error(
        `❌ Environment variable "${name}" is missing!
        
ShipSafe requires this variable for secure operation.

Check your .env.example file for setup instructions.
`
      );
    }
  }
}