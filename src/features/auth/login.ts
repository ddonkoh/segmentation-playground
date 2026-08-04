/**
 * -----------------------------------------------------------------------------
 * ShipSafe Auth Features — login.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Server-side login session management.
 *   Verifies ID tokens and manages user sessions.
 *
 * Why this exists:
 *   After client-side Firebase Auth login, we need to:
 *     - Verify ID token server-side
 *     - Create secure session cookie
 *     - Update user last sign-in time
 *
 * Security:
 *   - Verifies ID tokens using Firebase Admin SDK
 *   - Creates httpOnly session cookies
 *   - Updates Firestore user document
 *
 * Used by:
 *   - API routes (/api/auth/login)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   This function verifies ID tokens from client-side Firebase Auth.
 *   Actual authentication happens client-side; this manages server-side sessions.
 * -----------------------------------------------------------------------------
 */

import { verifyIdToken } from "@/lib/firebase/auth";
import { getFirestoreInstance } from "@/lib/firebase/init";
import { Timestamp } from "firebase-admin/firestore";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Auth login functions cannot be used in client-side code. " +
      "Use Firebase client SDK for client-side authentication."
  );
}

// -----------------------------------------------------------------------------
// 2. Login Result Type
// -----------------------------------------------------------------------------

/**
 * Result of login/session creation operation.
 */
export interface LoginResult {
  /**
   * Firebase user UID
   */
  uid: string;

  /**
   * User email
   */
  email: string | null;

  /**
   * Whether email is verified
   */
  emailVerified: boolean;
}

// -----------------------------------------------------------------------------
// 3. Create Session from ID Token
// -----------------------------------------------------------------------------

/**
 * createSessionFromToken() — verifies ID token and creates session.
 *
 * This function:
 *   1. Verifies ID token using Firebase Admin SDK
 *   2. Updates user last sign-in time in Firestore
 *   3. Returns user information for session creation
 *
 * Note: Session cookie creation should be done in the API route
 * using NextResponse.cookies.set() with httpOnly flag.
 *
 * @param idToken - Firebase ID token from client
 * @returns Login result with user information
 * @throws Error if token is invalid
 */
export async function createSessionFromToken(idToken: string): Promise<LoginResult> {
  try {
    // Verify ID token
    const decodedToken = await verifyIdToken(idToken);

    // Update last sign-in time in Firestore
    const firestore = getFirestoreInstance();
    await firestore.collection("users").doc(decodedToken.uid).update({
      lastSignInAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      emailVerified: decodedToken.email_verified || false,
    };
  } catch (error) {
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

    throw new Error("Failed to create session. Please try again.");
  }
}

