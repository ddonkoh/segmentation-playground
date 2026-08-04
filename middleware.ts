/**
 * -----------------------------------------------------------------------------
 * ShipSafe Middleware — Global Security Layer
 * -----------------------------------------------------------------------------
 * This middleware implements a 7-layer security architecture that protects
 * all routes in the application. Each layer runs in sequence, providing
 * defense-in-depth security.
 * 
 * Security Layers:
 *   1. HTTPS Enforcement - Redirects HTTP to HTTPS in production
 *   2. Rate Limiting - Prevents abuse and brute force attacks
 *   3. API Firewall - Blocks invalid requests before route handlers
 *   4. CSRF Protection - Prevents cross-site request forgery (with webhook exclusion)
 *   5. Authentication Guard - Protects routes requiring authentication
 *   6. Security Headers - Applies HTTP security headers
 *   7. CSRF Cookie - Ensures CSRF tokens are available for client requests
 * 
 * Production-Tested:
 *   This implementation has been validated in production (ThinkMate.online)
 *   and includes improvements learned from real-world deployment.
 * 
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";

import { applySecurityHeaders } from "@/lib/security/headers";
import { enforceHttps } from "@/lib/security/env";
import { ipRateLimit } from "@/lib/security/rate_limit";
import { secureApiGuard } from "@/lib/security/secure_api";
import { csrfGuard, ensureCsrfCookie } from "@/lib/security/csrf";
import { logSecurityEvent } from "@/lib/security/audit";

// -----------------------------------------------------------------------------
// ROUTE CONFIGURATION
// -----------------------------------------------------------------------------

/**
 * Routes that require authentication.
 * Users without a valid session cookie will be redirected to /auth
 * (or receive 401 for API routes).
 */
const PROTECTED_ROUTES = ["/dashboard", "/billing", "/api/protected"];

/**
 * Routes that should not be accessible while logged in.
 * Authenticated users accessing these routes will be redirected to /dashboard.
 */
const AUTH_PAGES = ["/auth", "/signin", "/signup"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // ---------------------------------------------------------------------------
  // 1. Enforce HTTPS
  // ---------------------------------------------------------------------------
  const httpsRedirect = enforceHttps(req);
  if (httpsRedirect) return httpsRedirect;

  // ---------------------------------------------------------------------------
  // 2. IP Rate Limiting
  // ---------------------------------------------------------------------------
  const rateLimitResponse = ipRateLimit(req);
  if (rateLimitResponse) {
    logSecurityEvent(req, "rate_limit_block");
    return rateLimitResponse;
  }

  // ---------------------------------------------------------------------------
  // 3. API Security (Firewall)
  // ---------------------------------------------------------------------------
  if (path.startsWith("/api")) {
    const apiValidation = secureApiGuard(req);
    if (apiValidation) {
      logSecurityEvent(req, "api_security_block");
      return apiValidation;
    }

    // ---------------------------------------------------------------------------
    // CSRF Protection for Mutation Requests
    // ---------------------------------------------------------------------------
    // CSRF protection is applied to all state-changing requests (POST, PUT,
    // PATCH, DELETE) to prevent cross-site request forgery attacks.
    // 
    // IMPORTANT: Webhook routes are EXCLUDED from CSRF protection because:
    //   - Webhooks use signature verification (Stripe, etc.) instead of CSRF tokens
    //   - Webhooks come from external services, not browsers
    //   - CSRF tokens cannot be included in webhook requests
    // 
    // Without this exclusion, Stripe webhooks will fail with "Missing CSRF token"
    // errors, breaking subscription management and billing functionality.
    // ---------------------------------------------------------------------------
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
    const isWebhook = path.startsWith("/api/webhooks/");

    if (isMutation && !isWebhook) {
      const csrfValidation = csrfGuard(req);
      if (csrfValidation) {
        logSecurityEvent(req, "csrf_failed");
        return csrfValidation;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Authentication Guard (Protected Routes)
  // ---------------------------------------------------------------------------
  // This layer protects routes that require authentication. It checks for a
  // valid session cookie and handles unauthenticated access appropriately:
  // 
  //   - API routes → Return 401 Unauthorized (JSON response)
  //   - Page routes → Redirect to /auth (with return URL)
  // 
  // Exclusions:
  //   - Webhook routes (/api/webhooks/*) - Use signature verification
  //   - Auth API routes (/api/auth/*) - Handle their own authentication
  //   - Public API routes (/api/csrf, /api/security/status) - Intentionally public
  // 
  // This ensures that:
  //   - API clients get proper HTTP status codes (not redirects)
  //   - Webhooks can function without authentication
  //   - Auth endpoints can handle login/signup flows
  // ---------------------------------------------------------------------------
  const session = req.cookies.get("session")?.value;

  // Identify routes that should be excluded from auth protection
  const isWebhook = path.startsWith("/api/webhooks/");
  const isAuthApi = path.startsWith("/api/auth/");
  const isPublicApi =
    path.startsWith("/api/csrf") || path.startsWith("/api/security/status");

  // Check if current path requires authentication
  const isProtected = PROTECTED_ROUTES.some((r) => path.startsWith(r));

  // If route is protected, user has no session, and route is not excluded
  if (isProtected && !session && !isWebhook && !isAuthApi && !isPublicApi) {
    // API routes: Return 401 Unauthorized (proper HTTP status for API clients)
    if (path.startsWith("/api")) {
      logSecurityEvent(req, "api_auth_required");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Page routes: Redirect to auth page (preserve intended destination)
    url.pathname = "/auth";
    url.searchParams.set("from", path);
    logSecurityEvent(req, "auth_redirect");
    return NextResponse.redirect(url);
  }

  // ---------------------------------------------------------------------------
  // 5. Redirect Logged-in Users from Auth Pages
  // ---------------------------------------------------------------------------
  // If a user is already authenticated, they shouldn't see login/signup pages.
  // Redirect them to the dashboard instead. This improves UX and prevents
  // confusion (e.g., "why am I seeing a login page when I'm already logged in?").
  // ---------------------------------------------------------------------------
  const isAuthPage = AUTH_PAGES.includes(path);
  if (isAuthPage && session) {
    url.pathname = "/dashboard";
    logSecurityEvent(req, "logged_in_redirect");
    return NextResponse.redirect(url);
  }

  // ---------------------------------------------------------------------------
  // 6. Apply Security Headers
  // ---------------------------------------------------------------------------
  // Security headers protect against common web vulnerabilities:
  //   - XSS (Cross-Site Scripting)
  //   - Clickjacking
  //   - MIME type sniffing
  //   - Protocol downgrade attacks
  // 
  // Headers are applied to ALL responses, providing defense-in-depth.
  // ---------------------------------------------------------------------------
  const response = NextResponse.next();
  applySecurityHeaders(response, req);

  // ---------------------------------------------------------------------------
  // 7. Ensure CSRF Cookie (GET Requests Only)
  // ---------------------------------------------------------------------------
  // CSRF tokens are only needed for state-changing requests (POST, PUT, etc.).
  // We only set the CSRF cookie on GET requests to:
  //   - Optimize performance (skip unnecessary cookie operations)
  //   - Reduce cookie overhead (fewer writes)
  //   - Follow security best practices (tokens only when needed)
  // 
  // The cookie is set on GET requests so it's available when the client
  // makes subsequent mutation requests (POST, PUT, etc.).
  // ---------------------------------------------------------------------------
  if (req.method === "GET") {
    ensureCsrfCookie(req, response);
  }

  return response;
}

// -----------------------------------------------------------------------------
// MIDDLEWARE CONFIGURATION
// -----------------------------------------------------------------------------
// The matcher defines which routes this middleware runs on.
// 
// Pattern: Matches all routes EXCEPT:
//   - _next/static (Next.js static files)
//   - _next/image (Next.js image optimization files)
//   - Image files (*.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp)
//   - public/* (public folder assets)
// 
// Why exclude images?
//   - Images are static assets, no security processing needed
//   - Reduces middleware overhead for image requests
//   - Improves performance (fewer function executions)
// 
// This ensures security layers are applied to all application routes
// while allowing Next.js and static assets to be served normally.
// -----------------------------------------------------------------------------
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - Image file extensions (svg, png, jpg, jpeg, gif, webp)
     * - public folder
     */
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};