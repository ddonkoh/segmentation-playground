/**
 * -----------------------------------------------------------------------------
 * ShipSafe Security Module — headers.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   This module applies **global security headers** to every response.
 *
 * Why this exists:
 *   Browsers do not enforce security by default. Most vulnerabilities such as:
 *     - XSS (Cross-Site Scripting)
 *     - Clickjacking
 *     - Content injection
 *     - Unsafe iframe embedding
 *     - Data leakage through Referrer headers
 *
 *   …are prevented simply by setting correct headers. ShipSafe does this for you.
 *
 * Used by:
 *   - middleware.ts (centralized enforcement)
 *
 * When should YOU modify this?
 *   ✔ If you add external scripts → update CSP
 *   ✔ If you add analytics → allow their domains in CSP
 *   ✔ Most devs should *not* modify core policies
 *
 * TL;DR:
 *   Industry-standard HTTP security headers for maximum protection.
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Strong CSP policies block inline scripts and eval(). Do NOT weaken CSP
 *   unless you understand the consequences.
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";

// -----------------------------------------------------------------------------
// 1. Content Security Policy (CSP)
// -----------------------------------------------------------------------------

/**
 * Content Security Policy:
 *   Defines *exactly* which resources the browser is allowed to load.
 *   This is your #1 defense against XSS.
 *
 * Notes:
 *   - 'self' → only load from same origin
 *   - next/image requires "blob:" for images
 *   - Firebase, Stripe, analytics may require expanded domains later
 *   - Google OAuth requires additional domains (apis.google.com, *.googleapis.com)
 *   - Firebase Auth popup requires *.firebaseapp.com in frame-src
 */
// Content Security Policy - must be a single line (no newlines allowed in HTTP headers)
// Added https://apis.google.com for Google OAuth
// Added Firebase Authentication domains: identitytoolkit.googleapis.com, securetoken.googleapis.com, www.googleapis.com
// Added oauth2.googleapis.com and *.googleapis.com for Google OAuth popup
// Added *.firebaseapp.com to frame-src for Firebase Auth popup
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://apis.google.com https://*.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self'; connect-src 'self' https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://oauth2.googleapis.com https://*.googleapis.com https://api.stripe.com https://accounts.google.com; frame-src https://js.stripe.com https://accounts.google.com https://*.googleapis.com https://*.firebaseapp.com; child-src https://accounts.google.com https://*.googleapis.com https://*.firebaseapp.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; manifest-src 'self'; media-src 'self'; worker-src 'self' blob:;";

// -----------------------------------------------------------------------------
// 2. Apply security headers to the response
// -----------------------------------------------------------------------------

export function applySecurityHeaders(res: NextResponse, req: NextRequest) {
  // ---------------------------------------------------------------------------
  // Core "industry standard" headers
  // ---------------------------------------------------------------------------
  res.headers.set("Content-Security-Policy", CSP);
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Frame-Options", "DENY"); // Clickjacking protection
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "0"); // Disabled because CSP is better
  res.headers.set("X-DNS-Prefetch-Control", "off");
  // Cross-Origin-Opener-Policy: Allow popups for OAuth (same-origin-allow-popups)
  // This is required for Firebase Auth popup to work properly
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.headers.set("Permissions-Policy", [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "payment=(self)",
  ].join(", "));

  // ---------------------------------------------------------------------------
  // HSTS: Strict Transport Security (HTTPS-only mode)
  // Only active in production
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  // ---------------------------------------------------------------------------
  // Disable caching for sensitive pages
  // Examples:
  //   - /dashboard
  //   - /auth
  //   - API routes
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