/**
 * -----------------------------------------------------------------------------
 * ShipSafe Firebase Module — auth.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Server-side authentication helpers for API routes and server components.
 *   Provides secure token verification and user retrieval using Firebase Admin SDK.
 *
 * Why this exists:
 *   API routes and protected pages need to:
 *     - Verify ID tokens from client requests
 *     - Extract user information server-side
 *     - Enforce authentication on protected endpoints
 *     - Access user claims (roles, permissions)
 *
 * Security:
 *   - All functions are server-side only (block client-side calls)
 *   - Uses Admin SDK for token verification (cannot be forged)
 *   - Returns safe error messages (no secret leakage)
 *   - Integrates with middleware pipeline (CSRF, rate limiting)
 *
 * Used by:
 *   - API routes (verifyAuth pattern)
 *   - Protected server components
 *   - Middleware (optional auth checks)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   These functions MUST only be called server-side. They use Admin SDK
 *   which has full access to Firebase. Never import in client components.
 * -----------------------------------------------------------------------------
 */

import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "./init";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Firebase auth helpers cannot be used in client-side code. " +
      "Use @/lib/firebase/client.ts for client authentication."
  );
}

// -----------------------------------------------------------------------------
// 2. Type definitions
// -----------------------------------------------------------------------------

/**
 * Decoded Firebase ID token with user information.
 * This is the verified user data returned after token validation.
 */
export interface DecodedIdToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  auth_time: number;
  iat: number;
  exp: number;
  firebase: {
    identities: Record<string, unknown>;
    sign_in_provider: string;
  };
  [key: string]: unknown; // Allow custom claims
}

/**
 * Authenticated user object returned by auth helpers.
 * Contains verified user information from the ID token.
 */
export interface AuthenticatedUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
  customClaims?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// 3. Extract ID token from request
// -----------------------------------------------------------------------------

/**
 * Extracts Firebase ID token from request headers.
 *
 * Looks for token in:
 *   1. Authorization header: "Bearer <token>"
 *   2. Cookie: "firebase_token" (alternative method)
 *
 * Returns null if no token is found.
 */
function extractIdToken(req: NextRequest): string | null {
  // Method 1: Authorization header (recommended)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Method 2: Cookie (fallback for browser requests)
  const tokenCookie = req.cookies.get("firebase_token")?.value;
  if (tokenCookie) {
    return tokenCookie;
  }

  return null;
}

// -----------------------------------------------------------------------------
// 4. Verify ID token
// -----------------------------------------------------------------------------

/**
 * verifyIdToken() — verifies a Firebase ID token and returns decoded claims.
 *
 * This function:
 *   - Validates token signature using Firebase Admin SDK
 *   - Checks token expiration
 *   - Returns decoded token with user information
 *   - Throws error if token is invalid/expired
 *
 * @param token - Firebase ID token string
 * @returns Decoded token with user information
 * @throws Error if token is invalid, expired, or revoked
 */
export async function verifyIdToken(
  token: string
): Promise<DecodedIdToken> {
  try {
    const adminAuth = getAuth(getAdminApp());
    const decodedToken = await adminAuth.verifyIdToken(token, true); // true = check revocation

    return decodedToken as DecodedIdToken;
  } catch (error) {
    // Provide safe error messages (don't leak sensitive details)
    if (error instanceof Error) {
      if (error.message.includes("expired")) {
        throw new Error("Authentication token has expired. Please sign in again.");
      }
      if (error.message.includes("revoked")) {
        throw new Error("Authentication token has been revoked. Please sign in again.");
      }
      if (error.message.includes("invalid")) {
        throw new Error("Invalid authentication token.");
      }
    }

    throw new Error("Failed to verify authentication token.");
  }
}

// -----------------------------------------------------------------------------
// 5. Get current user from request
// -----------------------------------------------------------------------------

/**
 * getCurrentUserServer() — extracts and verifies user from request.
 *
 * This is the main helper for API routes and server components.
 * It:
 *   1. Extracts ID token from request headers/cookies
 *   2. Verifies token using Admin SDK
 *   3. Returns authenticated user object
 *   4. Returns null if no token or invalid token
 *
 * @param req - Next.js request object
 * @returns Authenticated user or null if not authenticated
 */
export async function getCurrentUserServer(
  req: NextRequest
): Promise<AuthenticatedUser | null> {
  try {
    const token = extractIdToken(req);
    if (!token) {
      return null;
    }

    const decodedToken = await verifyIdToken(token);

    // Transform decoded token to AuthenticatedUser format
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      emailVerified: decodedToken.email_verified || false,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null,
      customClaims: Object.keys(decodedToken)
        .filter((key) => !["uid", "email", "email_verified", "name", "picture", "auth_time", "iat", "exp", "firebase"].includes(key))
        .reduce((acc, key) => {
          acc[key] = decodedToken[key];
          return acc;
        }, {} as Record<string, unknown>),
    };
  } catch (error) {
    // Return null on any error (invalid token, expired, etc.)
    // This allows API routes to handle "not authenticated" gracefully
    return null;
  }
}

// -----------------------------------------------------------------------------
// 6. Require authentication (for API routes)
// -----------------------------------------------------------------------------

/**
 * requireAuth() — verifies authentication and returns user, or throws error.
 *
 * This is a convenience wrapper for API routes that MUST have an authenticated user.
 * It calls getCurrentUserServer() and throws a safe error if user is not authenticated.
 *
 * Usage in API routes:
 *   ```ts
 *   export async function POST(req: Request) {
 *     const user = await requireAuth(req);
 *     // user is guaranteed to be AuthenticatedUser (not null)
 *   }
 *   ```
 *
 * @param req - Next.js request object
 * @returns Authenticated user (never null)
 * @throws Error if user is not authenticated
 */
export async function requireAuth(
  req: NextRequest
): Promise<AuthenticatedUser> {
  const user = await getCurrentUserServer(req);

  if (!user) {
    throw new Error("Unauthorized: Authentication required.");
  }

  return user;
}

// -----------------------------------------------------------------------------
// 7. Verify auth helper (for API route pattern)
// -----------------------------------------------------------------------------

/**
 * verifyAuth() — alias for getCurrentUserServer().
 *
 * This matches the pattern shown in .cursorrules and dev.rst:
 *   ```ts
 *   const token = await verifyAuth(req);
 *   if (!token) {
 *     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 *   ```
 *
 * Note: Despite the name "token", this returns the user object, not the token.
 * This matches the expected API route pattern in the codebase.
 */
export const verifyAuth = getCurrentUserServer;

