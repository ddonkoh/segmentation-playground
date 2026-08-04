/**
 * -----------------------------------------------------------------------------
 * ShipSafe Firebase Module — init.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Initializes Firebase Admin SDK for server-side operations only.
 *   Supports both local development (service account JSON) and production
 *   (environment variables) configurations.
 *
 * Why this exists:
 *   Firebase Admin SDK is required for:
 *     - Verifying ID tokens from client
 *     - Managing users server-side
 *     - Setting custom claims (roles, permissions)
 *     - Accessing Firestore with admin privileges
 *
 * Security:
 *   - This module MUST NEVER be imported in client components
 *   - Admin SDK has full access to Firebase project
 *   - Private keys are server-only secrets
 *
 * Used by:
 *   - auth.ts (token verification)
 *   - admin.ts (user management)
 *   - API routes (protected endpoints)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Never expose admin credentials to client bundles. This file should only
 *   be imported in server-side code (API routes, server components, server actions).
 * -----------------------------------------------------------------------------
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getEnv } from "@/lib/security/env";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Firebase Admin SDK cannot be used in client-side code. " +
      "Use @/lib/firebase/client.ts for client operations."
  );
}

// -----------------------------------------------------------------------------
// 2. Initialize Firebase Admin App
// -----------------------------------------------------------------------------

let adminApp: App | null = null;
let firestore: Firestore | null = null;

/**
 * getAdminApp() — returns initialized Firebase Admin app instance.
 *
 * Supports two configuration methods:
 *   1. Environment variables (production/recommended):
 *      - FIREBASE_PROJECT_ID
 *      - FIREBASE_CLIENT_EMAIL
 *      - FIREBASE_PRIVATE_KEY (escaped newlines: \\n)
 *      - FIREBASE_DATABASE_URL (optional)
 *
 *   2. Service account JSON file (local development):
 *      - FIREBASE_SERVICE_ACCOUNT_PATH (path to JSON file)
 *
 * The function initializes the app once and reuses the same instance
 * on subsequent calls (singleton pattern for serverless environments).
 */
export function getAdminApp(): App {
  // Return existing instance if already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  // Check if already initialized in this module
  if (adminApp) {
    return adminApp;
  }

  try {
    const projectId = getEnv("FIREBASE_PROJECT_ID");
    const clientEmail = getEnv("FIREBASE_CLIENT_EMAIL");
    const privateKey = getEnv("FIREBASE_PRIVATE_KEY");

    // Handle escaped newlines in private key (common in env vars)
    // Production env vars often have \\n which need to become \n
    const normalizedPrivateKey = privateKey.replace(/\\n/g, "\n");

    // Initialize with environment variables (production-friendly)
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: normalizedPrivateKey,
      }),
      projectId,
      // Optional: database URL for Realtime Database (if used)
      databaseURL: process.env.FIREBASE_DATABASE_URL || undefined,
    });

    return adminApp;
  } catch (error) {
    // If env vars fail, try service account file (local dev fallback)
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (serviceAccountPath) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const serviceAccount = require(serviceAccountPath);

        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id,
          databaseURL: serviceAccount.databaseURL || undefined,
        });

        return adminApp;
      } catch (fileError) {
        throw new Error(
          `❌ Failed to initialize Firebase Admin SDK.
          
Error loading service account file: ${serviceAccountPath}
${fileError instanceof Error ? fileError.message : String(fileError)}

Make sure:
  1. Service account JSON file exists at the specified path
  2. File contains valid Firebase service account credentials
  3. Or use environment variables instead (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
`
        );
      }
    }

    // If both methods fail, throw helpful error
    throw new Error(
      `❌ Failed to initialize Firebase Admin SDK.
      
${error instanceof Error ? error.message : String(error)}

Required environment variables:
  - FIREBASE_PROJECT_ID
  - FIREBASE_CLIENT_EMAIL
  - FIREBASE_PRIVATE_KEY

Or set FIREBASE_SERVICE_ACCOUNT_PATH to point to a service account JSON file.

Check /docs/firebase-setup.md for setup instructions.
`
    );
  }
}

// -----------------------------------------------------------------------------
// 3. Get Firestore instance
// -----------------------------------------------------------------------------

/**
 * getFirestoreInstance() — returns initialized Firestore instance.
 *
 * Uses the admin app to access Firestore with full admin privileges.
 * This bypasses security rules and should only be used server-side.
 */
export function getFirestoreInstance(): Firestore {
  if (!firestore) {
    const app = getAdminApp();
    firestore = getFirestore(app);
  }

  return firestore;
}

// -----------------------------------------------------------------------------
// 4. Exports
// -----------------------------------------------------------------------------

export { getAdminApp as adminApp };
export { getFirestoreInstance as firestore };

