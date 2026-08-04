/**
 * -----------------------------------------------------------------------------
 * ShipSafe Auth Features — signup.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Server-side user signup logic.
 *   Creates user in Firebase Authentication and Firestore.
 *
 * Why this exists:
 *   Signup requires server-side operations:
 *     - Create user in Firebase Auth (via Admin SDK)
 *     - Create user document in Firestore
 *     - Set initial user role (custom claims)
 *     - Initialize user data
 *
 * Security:
 *   - Uses Firebase Admin SDK (server-side only)
 *   - Validates input using Zod schemas
 *   - Sets default role (USER) for new users
 *   - Creates Firestore user document
 *
 * Used by:
 *   - API routes (/api/auth/signup)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   This function must only be called server-side. It uses Admin SDK
 *   which has full access to Firebase.
 * -----------------------------------------------------------------------------
 */

import { createUser } from "@/lib/firebase/admin";
import { getFirestoreInstance } from "@/lib/firebase/init";
import { createUserObject, userToFirestore } from "@/models/user";
import { UserRole } from "@/models/roles";
import type { SignupInput } from "./schema";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Auth signup functions cannot be used in client-side code. " +
      "Use Firebase client SDK for client-side authentication."
  );
}

// -----------------------------------------------------------------------------
// 2. Signup Result Type
// -----------------------------------------------------------------------------

/**
 * Result of user signup operation.
 */
export interface SignupResult {
  /**
   * Firebase user UID
   */
  uid: string;

  /**
   * User email
   */
  email: string;

  /**
   * Whether email is verified
   */
  emailVerified: boolean;
}

// -----------------------------------------------------------------------------
// 3. Create User Account
// -----------------------------------------------------------------------------

/**
 * signupUser() — creates a new user account.
 *
 * This function:
 *   1. Creates user in Firebase Authentication
 *   2. Sets default role (USER) via custom claims
 *   3. Creates user document in Firestore
 *   4. Returns user UID and email
 *
 * @param input - Signup input (validated with Zod)
 * @returns Signup result with user UID and email
 * @throws Error if signup fails
 */
export async function signupUser(input: SignupInput): Promise<SignupResult> {
  try {
    // 1. Create user in Firebase Authentication
    const adminUser = await createUser({
      email: input.email,
      password: input.password,
      displayName: input.displayName,
      emailVerified: false,
      disabled: false,
      customClaims: {
        role: UserRole.USER, // Default role for new users
      },
    });

    // 2. Create user document in Firestore
    const firestore = getFirestoreInstance();
    const userObject = createUserObject(adminUser.uid, adminUser.email || input.email, {
      displayName: input.displayName,
      emailVerified: false,
    });

    const userDoc = userToFirestore(userObject);
    await firestore.collection("users").doc(adminUser.uid).set(userDoc);

    // 3. Return signup result
    return {
      uid: adminUser.uid,
      email: adminUser.email || input.email,
      emailVerified: adminUser.emailVerified,
    };
  } catch (error) {
    // Provide safe error messages
    if (error instanceof Error) {
      if (error.message.includes("email-already-exists")) {
        throw new Error("An account with this email already exists.");
      }
      if (error.message.includes("invalid-email")) {
        throw new Error("Invalid email address.");
      }
      if (error.message.includes("weak-password")) {
        throw new Error("Password is too weak. Please use a stronger password.");
      }
    }

    throw new Error("Failed to create user account. Please try again.");
  }
}

