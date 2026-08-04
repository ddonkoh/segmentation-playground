/**
 * -----------------------------------------------------------------------------
 * ShipSafe Firebase Module — admin.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Admin-only utilities for user management using Firebase Admin SDK.
 *   Provides functions for creating users, setting custom claims, and
 *   reading user data with full admin privileges.
 *
 * Why this exists:
 *   Server-side operations often need to:
 *     - Create users programmatically
 *     - Set custom claims (roles, subscription status, permissions)
 *     - Read user data bypassing security rules
 *     - Update user metadata
 *
 * Security:
 *   - All functions are server-side only (block client-side calls)
 *   - Uses Admin SDK (bypasses security rules)
 *   - Should only be called from API routes or server actions
 *   - Returns safe error messages
 *
 * Used by:
 *   - API routes (user management endpoints)
 *   - Stripe webhooks (setting subscription claims)
 *   - Admin dashboard features
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   These functions have full access to Firebase. They should only be called
 *   from authenticated API routes with proper authorization checks.
 * -----------------------------------------------------------------------------
 */

import { getAuth, UserRecord, CreateRequest } from "firebase-admin/auth";
import { getAdminApp } from "./init";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Firebase admin utilities cannot be used in client-side code. " +
      "These functions require Admin SDK privileges."
  );
}

// -----------------------------------------------------------------------------
// 2. Type definitions
// -----------------------------------------------------------------------------

/**
 * Options for creating a new user.
 */
export interface CreateUserOptions {
  email: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  disabled?: boolean;
  customClaims?: Record<string, unknown>;
}

/**
 * Options for updating custom claims on a user.
 */
export interface SetCustomClaimsOptions {
  uid: string;
  claims: Record<string, unknown>;
}

/**
 * User data returned by admin functions.
 */
export interface AdminUserData {
  uid: string;
  email: string | undefined;
  emailVerified: boolean;
  displayName: string | undefined;
  photoURL: string | undefined;
  disabled: boolean;
  customClaims: Record<string, unknown> | undefined;
  metadata: {
    creationTime: string;
    lastSignInTime: string | undefined;
  };
}

// -----------------------------------------------------------------------------
// 3. Create user
// -----------------------------------------------------------------------------

/**
 * createUser() — creates a new user in Firebase Authentication.
 *
 * This function:
 *   - Creates user with email/password or email only
 *   - Sets optional display name and photo
 *   - Can set custom claims immediately
 *   - Returns user record with UID
 *
 * @param options - User creation options
 * @returns User record with UID and metadata
 * @throws Error if user creation fails (e.g., email already exists)
 */
export async function createUser(
  options: CreateUserOptions
): Promise<AdminUserData> {
  try {
    const adminAuth = getAuth(getAdminApp());

    const createRequest: CreateRequest = {
      email: options.email,
      password: options.password,
      displayName: options.displayName,
      photoURL: options.photoURL,
      emailVerified: options.emailVerified ?? false,
      disabled: options.disabled ?? false,
    };

    const userRecord = await adminAuth.createUser(createRequest);

    // Set custom claims if provided
    if (options.customClaims && Object.keys(options.customClaims).length > 0) {
      await adminAuth.setCustomUserClaims(userRecord.uid, options.customClaims);
    }

    return transformUserRecord(userRecord);
  } catch (error) {
    // Provide safe error messages
    if (error instanceof Error) {
      if (error.message.includes("email-already-exists")) {
        throw new Error("A user with this email already exists.");
      }
      if (error.message.includes("invalid-email")) {
        throw new Error("Invalid email address format.");
      }
      if (error.message.includes("weak-password")) {
        throw new Error("Password is too weak. Please use a stronger password.");
      }
    }

    throw new Error("Failed to create user.");
  }
}

// -----------------------------------------------------------------------------
// 4. Set custom claims
// -----------------------------------------------------------------------------

/**
 * setCustomClaims() — sets custom claims (roles, permissions) on a user.
 *
 * Custom claims are included in ID tokens and can be used for:
 *   - Role-based access control (admin, user, premium)
 *   - Subscription status (active, cancelled, trial)
 *   - Feature flags
 *   - Any custom user attributes
 *
 * Note: Custom claims are cached in ID tokens. Users may need to refresh
 * their token (sign out/in) to see updated claims.
 *
 * @param options - UID and claims to set
 * @throws Error if user not found or claims update fails
 */
export async function setCustomClaims(
  options: SetCustomClaimsOptions
): Promise<void> {
  try {
    const adminAuth = getAuth(getAdminApp());

    // Verify user exists
    await adminAuth.getUser(options.uid);

    // Set custom claims
    await adminAuth.setCustomUserClaims(options.uid, options.claims);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("user-not-found")) {
        throw new Error(`User with UID ${options.uid} not found.`);
      }
    }

    throw new Error("Failed to set custom claims.");
  }
}

// -----------------------------------------------------------------------------
// 5. Get user by UID
// -----------------------------------------------------------------------------

/**
 * getUserByUid() — retrieves user data by UID.
 *
 * This function:
 *   - Fetches user record from Firebase Authentication
 *   - Includes custom claims
 *   - Returns full user metadata
 *   - Bypasses security rules (admin access)
 *
 * @param uid - User UID
 * @returns User data with all metadata
 * @throws Error if user not found
 */
export async function getUserByUid(uid: string): Promise<AdminUserData> {
  try {
    const adminAuth = getAuth(getAdminApp());
    const userRecord = await adminAuth.getUser(uid);

    return transformUserRecord(userRecord);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("user-not-found")) {
        throw new Error(`User with UID ${uid} not found.`);
      }
    }

    throw new Error("Failed to retrieve user data.");
  }
}

// -----------------------------------------------------------------------------
// 6. Get user by email
// -----------------------------------------------------------------------------

/**
 * getUserByEmail() — retrieves user data by email address.
 *
 * @param email - User email address
 * @returns User data with all metadata
 * @throws Error if user not found
 */
export async function getUserByEmail(
  email: string
): Promise<AdminUserData> {
  try {
    const adminAuth = getAuth(getAdminApp());
    const userRecord = await adminAuth.getUserByEmail(email);

    return transformUserRecord(userRecord);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("user-not-found")) {
        throw new Error(`User with email ${email} not found.`);
      }
    }

    throw new Error("Failed to retrieve user data.");
  }
}

// -----------------------------------------------------------------------------
// 7. Update user
// -----------------------------------------------------------------------------

/**
 * updateUser() — updates user properties.
 *
 * @param uid - User UID
 * @param updates - Properties to update
 * @returns Updated user data
 * @throws Error if user not found or update fails
 */
export async function updateUser(
  uid: string,
  updates: {
    email?: string;
    displayName?: string;
    photoURL?: string;
    emailVerified?: boolean;
    disabled?: boolean;
    password?: string;
  }
): Promise<AdminUserData> {
  try {
    const adminAuth = getAuth(getAdminApp());
    const userRecord = await adminAuth.updateUser(uid, updates);

    return transformUserRecord(userRecord);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("user-not-found")) {
        throw new Error(`User with UID ${uid} not found.`);
      }
      if (error.message.includes("email-already-exists")) {
        throw new Error("A user with this email already exists.");
      }
    }

    throw new Error("Failed to update user.");
  }
}

// -----------------------------------------------------------------------------
// 8. Delete user
// -----------------------------------------------------------------------------

/**
 * deleteUser() — permanently deletes a user from Firebase Authentication.
 *
 * Warning: This action cannot be undone. The user will be immediately
 * unable to sign in and all their data should be handled appropriately.
 *
 * @param uid - User UID to delete
 * @throws Error if user not found or deletion fails
 */
export async function deleteUser(uid: string): Promise<void> {
  try {
    const adminAuth = getAuth(getAdminApp());
    await adminAuth.deleteUser(uid);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("user-not-found")) {
        throw new Error(`User with UID ${uid} not found.`);
      }
    }

    throw new Error("Failed to delete user.");
  }
}

// -----------------------------------------------------------------------------
// 9. Helper: Transform UserRecord to AdminUserData
// -----------------------------------------------------------------------------

/**
 * Transforms Firebase UserRecord to our AdminUserData format.
 * Includes custom claims from the user record.
 */
function transformUserRecord(userRecord: UserRecord): AdminUserData {
  return {
    uid: userRecord.uid,
    email: userRecord.email,
    emailVerified: userRecord.emailVerified,
    displayName: userRecord.displayName,
    photoURL: userRecord.photoURL,
    disabled: userRecord.disabled,
    customClaims: userRecord.customClaims,
    metadata: {
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
    },
  };
}

