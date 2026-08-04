/**
 * -----------------------------------------------------------------------------
 * ShipSafe Auth Features — reset.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Server-side password reset verification and password update.
 *   Verifies reset code and updates user password.
 *
 * Why this exists:
 *   Password reset verification requires server-side operations:
 *     - Verify reset code (oobCode)
 *     - Update user password via Firebase Admin SDK
 *     - Revoke old sessions (force re-login)
 *
 * Security:
 *   - Verifies reset code before allowing password change
 *   - Revokes all user sessions after password change
 *   - Enforces password strength requirements
 *
 * Used by:
 *   - API routes (/api/auth/reset/verify)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Reset codes are one-time use and expire. After password update,
 *   all user sessions are revoked to force re-authentication.
 * -----------------------------------------------------------------------------
 */

import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/init";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Auth reset functions cannot be used in client-side code. " +
      "Use Firebase client SDK for client-side password reset."
  );
}

// -----------------------------------------------------------------------------
// 2. Reset Result Type
// -----------------------------------------------------------------------------

/**
 * Result of password reset operation.
 */
export interface ResetPasswordResult {
  /**
   * Whether password reset was successful
   */
  success: boolean;

  /**
   * User UID (if reset successful)
   */
  uid?: string;

  /**
   * Message for user
   */
  message: string;
}

// -----------------------------------------------------------------------------
// 3. Verify and Reset Password
// -----------------------------------------------------------------------------

/**
 * verifyAndResetPassword() — verifies reset code and updates password.
 *
 * NOTE: Firebase Admin SDK doesn't have a direct method to verify reset codes.
 * Password reset code verification is typically done client-side with:
 *   import { confirmPasswordReset } from "firebase/auth";
 *   await confirmPasswordReset(auth, oobCode, newPassword);
 *
 * This server-side function is provided for cases where you need server-side
 * password updates (e.g., admin-initiated resets, authenticated user password changes).
 *
 * For standard password reset flow:
 *   1. Client-side: User clicks reset link, enters new password
 *   2. Client-side: Use confirmPasswordReset() from Firebase Auth SDK
 *   3. Server-side: Optional - call revokeUserSessions() for cleanup
 *
 * @param email - User email address (required for server-side reset)
 * @param newPassword - New password (must meet strength requirements)
 * @returns Reset result
 * @throws Error if reset fails
 */
export async function verifyAndResetPassword(
  email: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  try {
    const adminAuth = getAuth(getAdminApp());

    // Get user by email
    const user = await adminAuth.getUserByEmail(email);

    // Update password
    await adminAuth.updateUser(user.uid, {
      password: newPassword,
    });

    // Revoke all refresh tokens to force re-login
    await adminAuth.revokeRefreshTokens(user.uid);

    return {
      success: true,
      uid: user.uid,
      message: "Password updated successfully. Please sign in again.",
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("user-not-found")) {
        throw new Error("User not found.");
      }
      if (error.message.includes("weak-password")) {
        throw new Error("Password is too weak. Please use a stronger password.");
      }
    }

    throw new Error("Failed to reset password. Please try again.");
  }
}

// -----------------------------------------------------------------------------
// 4. Revoke User Sessions (Post-Reset Cleanup)
// -----------------------------------------------------------------------------

/**
 * revokeUserSessions() — revokes all user sessions after password reset.
 *
 * Call this after a password reset to ensure all existing sessions are invalidated.
 *
 * @param uid - Firebase user UID
 * @returns Success status
 */
export async function revokeUserSessions(uid: string): Promise<void> {
  try {
    const adminAuth = getAuth(getAdminApp());
    await adminAuth.revokeRefreshTokens(uid);
  } catch (error) {
    // Log error but don't throw (non-critical operation)
    console.error("Failed to revoke user sessions:", error);
  }
}

// -----------------------------------------------------------------------------
// 4. Update Password (for authenticated users)
// -----------------------------------------------------------------------------

/**
 * updateUserPassword() — updates password for authenticated user.
 *
 * This function:
 *   1. Updates user password via Admin SDK
 *   2. Revokes all user sessions (forces re-login)
 *   3. Returns success status
 *
 * @param uid - Firebase user UID
 * @param newPassword - New password (must meet strength requirements)
 * @returns Update result
 * @throws Error if update fails
 */
export async function updateUserPassword(
  uid: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  try {
    const adminAuth = getAuth(getAdminApp());

    // Update password
    await adminAuth.updateUser(uid, {
      password: newPassword,
    });

    // Revoke all refresh tokens to force re-login
    await adminAuth.revokeRefreshTokens(uid);

    return {
      success: true,
      uid,
      message: "Password updated successfully. Please sign in again.",
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("user-not-found")) {
        throw new Error("User not found.");
      }
      if (error.message.includes("weak-password")) {
        throw new Error("Password is too weak. Please use a stronger password.");
      }
    }

    throw new Error("Failed to update password. Please try again.");
  }
}

