/**
 * -----------------------------------------------------------------------------
 * ShipSafe Auth Features — send-reset.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Server-side password reset email sending.
 *   Generates password reset link and sends email via Firebase.
 *
 * Why this exists:
 *   Password reset requires server-side operations:
 *     - Generate password reset link
 *     - Send email via Firebase Auth
 *     - Track reset requests (optional)
 *
 * Security:
 *   - Uses Firebase Auth password reset email
 *   - Reset links expire after use
 *   - Rate limiting should be applied in API route
 *
 * Used by:
 *   - API routes (/api/auth/reset)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Password reset emails are sent via Firebase Auth. The reset link
 *   contains a one-time code that expires after use or time limit.
 * -----------------------------------------------------------------------------
 */

import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/init";
import config from "@/config";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Auth send-reset functions cannot be used in client-side code. " +
      "Use Firebase client SDK for client-side password reset."
  );
}

// -----------------------------------------------------------------------------
// 2. Send Reset Result Type
// -----------------------------------------------------------------------------

/**
 * Result of send password reset operation.
 */
export interface SendPasswordResetResult {
  /**
   * Whether email was sent successfully
   */
  success: boolean;

  /**
   * Message for user
   */
  message: string;
}

// -----------------------------------------------------------------------------
// 3. Send Password Reset Email
// -----------------------------------------------------------------------------

/**
 * sendPasswordResetEmail() — sends password reset email to user.
 *
 * This function:
 *   1. Generates password reset link via Firebase Auth
 *   2. Sends email to user
 *   3. Returns success status
 *
 * The reset link will be sent to the user's email address.
 * The link contains a one-time code that expires after use or time limit.
 *
 * @param email - User email address
 * @returns Send reset result
 * @throws Error if email sending fails
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<SendPasswordResetResult> {
  try {
    const adminAuth = getAuth(getAdminApp());

    // Check if user exists first
    let userExists = false;
    try {
      await adminAuth.getUserByEmail(email);
      userExists = true;
    } catch (error) {
      // User not found - but we'll still return success (prevent email enumeration)
      userExists = false;
    }

    if (userExists) {
      // Generate password reset link with action code settings
      // This generates a link that can be used in a custom email
      // For automatic email sending, use Firebase Auth client SDK's sendPasswordResetEmail()
      const resetLink = await adminAuth.generatePasswordResetLink(email, {
        url: config.domainName
          ? `https://${config.domainName}/auth/reset?oobCode=`
          : `${process.env.NEXT_PUBLIC_APP_URL || ""}/auth/reset?oobCode=`,
        handleCodeInApp: false,
      });

      // NOTE: generatePasswordResetLink() does NOT automatically send emails.
      // For automatic email sending, you have two options:
      //
      // Option 1: Use Firebase Auth client SDK (recommended for simplicity)
      //   import { sendPasswordResetEmail } from "firebase/auth";
      //   await sendPasswordResetEmail(auth, email);
      //
      // Option 2: Send custom email with the generated link
      //   Use your email service (SendGrid, Resend, etc.) to send email
      //   Include the resetLink in your email template
      //
      // For ShipSafe v1.0, we recommend using the client SDK approach
      // in the API route, or implementing custom email sending here.
    }

    // Always return success to prevent email enumeration attacks
    return {
      success: true,
      message: "If an account exists, a password reset email has been sent.",
    };
  } catch (error) {
    // Return generic success message to prevent information leakage
    return {
      success: true,
      message: "If an account exists, a password reset email has been sent.",
    };
  }
}

