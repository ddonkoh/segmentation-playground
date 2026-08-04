/**
 * -----------------------------------------------------------------------------
 * ShipSafe Auth Features — logout.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Server-side logout logic and session cleanup.
 *   Revokes sessions and clears user authentication state.
 *
 * Why this exists:
 *   Logout requires server-side operations:
 *     - Revoke Firebase ID token (optional)
 *     - Clear session cookies
 *     - Update user session state
 *
 * Security:
 *   - Revokes ID tokens to prevent reuse
 *   - Clears all session data
 *   - Safe error handling
 *
 * Used by:
 *   - API routes (/api/auth/logout)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   This function revokes authentication tokens. Session cookie clearing
 *   should be done in the API route using NextResponse.cookies.delete().
 * -----------------------------------------------------------------------------
 */

import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/init";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Auth logout functions cannot be used in client-side code. " +
      "Use Firebase client SDK for client-side logout."
  );
}

// -----------------------------------------------------------------------------
// 2. Logout Result Type
// -----------------------------------------------------------------------------

/**
 * Result of logout operation.
 */
export interface LogoutResult {
  /**
   * Whether logout was successful
   */
  success: boolean;
}

// -----------------------------------------------------------------------------
// 3. Logout User
// -----------------------------------------------------------------------------

/**
 * logoutUser() — logs out a user and revokes their session.
 *
 * This function:
 *   1. Revokes the user's ID token (prevents reuse)
 *   2. Returns success status
 *
 * Note: Session cookie deletion should be handled in the API route.
 * This function handles server-side token revocation.
 *
 * @param uid - Firebase user UID
 * @returns Logout result
 * @throws Error if logout fails
 */
export async function logoutUser(uid: string): Promise<LogoutResult> {
  try {
    const adminAuth = getAuth(getAdminApp());

    // Revoke all refresh tokens for the user
    // This invalidates all ID tokens and forces re-authentication
    await adminAuth.revokeRefreshTokens(uid);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("user-not-found")) {
        throw new Error("User not found.");
      }
    }

    throw new Error("Failed to logout. Please try again.");
  }
}

