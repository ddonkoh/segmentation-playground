/**
 * -----------------------------------------------------------------------------
 * ShipSafe Security Module — csrf.ts
 * -----------------------------------------------------------------------------
 * Implements CSRF protection using the "Double Submit Cookie" pattern:
 *
 *   - A secure token is stored in a **httpOnly cookie** (server-only)
 *   - The same token is also stored in a **client-readable cookie**
 *   - The client must include this token in `x-csrf-token` header
 *
 * This prevents attackers from triggering authenticated mutation requests
 * from other websites, as they cannot read or forge the CSRF token.
 *
 * Used by:
 *   - middleware.ts (for all /api mutation requests)
 *   - Any API route that modifies server state
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";

// Cookie names
const CSRF_COOKIE_HTTP = "csrf_token";          // httpOnly (server only)
const CSRF_COOKIE_JS = "csrf_token_client";     // readable (client)


// -----------------------------------------------------------------------------
// Generate a cryptographically strong CSRF token
// -----------------------------------------------------------------------------
function generateToken(length = 32): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let token = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    token += charset[array[i] % charset.length];
  }

  return token;
}


// -----------------------------------------------------------------------------
// Ensure CSRF cookies exist (called for all browser requests in middleware)
// -----------------------------------------------------------------------------
export function ensureCsrfCookie(
  req: NextRequest,
  res: NextResponse
): NextResponse {
  const existingToken = req.cookies.get(CSRF_COOKIE_HTTP)?.value;

  if (!existingToken) {
    const token = generateToken();

    // httpOnly version — server validation only
    res.cookies.set(CSRF_COOKIE_HTTP, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // Client-readable cookie — used by JS to set header
    res.cookies.set(CSRF_COOKIE_JS, token, {
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return res;
}


// -----------------------------------------------------------------------------
// Validate CSRF token for mutation requests
// -----------------------------------------------------------------------------
export function csrfGuard(req: NextRequest): NextResponse | null {
  const method = req.method.toUpperCase();

  // Only protect state-changing requests
  const requiresProtection = ["POST", "PUT", "PATCH", "DELETE"].includes(
    method
  );
  if (!requiresProtection) return null;

  const cookieToken = req.cookies.get(CSRF_COOKIE_HTTP)?.value;
  const headerToken = req.headers.get("x-csrf-token");

  // Both tokens must exist
  if (!cookieToken || !headerToken) {
    return NextResponse.json(
      { error: "Missing CSRF token." },
      { status: 403 }
    );
  }

  // Tokens must match exactly
  if (cookieToken !== headerToken) {
    return NextResponse.json(
      { error: "Invalid CSRF token." },
      { status: 403 }
    );
  }

  // Optional origin/referrer check for additional hardening
  const origin = req.headers.get("origin") || "";
  const referrer = req.headers.get("referer") || "";
  const host =
    req.headers.get("host") ||
    req.headers.get("x-forwarded-host") ||
    req.nextUrl.host ||
    "";

  if (
    origin &&
    !origin.includes(host) &&
    referrer &&
    !referrer.includes(host)
  ) {
    return NextResponse.json(
      { error: "Cross-origin requests are not allowed." },
      { status: 403 }
    );
  }

  return null; // Safe request
}


// -----------------------------------------------------------------------------
// Client helper — retrieves the readable CSRF cookie in the browser
// -----------------------------------------------------------------------------
export function getClientCsrfToken(): string | null {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(
      new RegExp(`(^| )${CSRF_COOKIE_JS}=([^;]+)`)
    );
    return match ? match[2] : null;
  }
  return null;
}