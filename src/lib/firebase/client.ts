/**
 * -----------------------------------------------------------------------------
 * ShipSafe Firebase Module — client.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Initializes Firebase Web SDK for client-side operations.
 *   Provides access to Firebase Authentication and Firestore from browser.
 *
 * Why this exists:
 *   Client-side Firebase SDK is required for:
 *     - User sign-in/sign-up (email, Google OAuth)
 *     - Client-side Firestore reads (with security rules)
 *     - Real-time listeners
 *     - Password reset flows
 *
 * Security:
 *   - Uses NEXT_PUBLIC_* env vars (safe to expose to client)
 *   - Never includes admin credentials
 *   - All mutations should go through API routes (server-side)
 *
 * Used by:
 *   - Client components (login forms, signup forms)
 *   - Client-side auth helpers
 *   - Features/auth/client.ts
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   This file is safe for client bundles. It only uses public configuration.
 *   Sensitive operations (token verification, user creation) must use Admin SDK
 *   via API routes.
 * -----------------------------------------------------------------------------
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// -----------------------------------------------------------------------------
// 1. Firebase configuration from environment variables
// -----------------------------------------------------------------------------

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// -----------------------------------------------------------------------------
// 3. Check if Firebase is configured
// -----------------------------------------------------------------------------

/**
 * Check if Firebase environment variables are set.
 * Returns true if at least the required variables are present.
 */
function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

// -----------------------------------------------------------------------------
// 4. Initialize Firebase App (singleton pattern)
// -----------------------------------------------------------------------------

let firebaseApp: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let configError: Error | null = null;

/**
 * getFirebaseApp() — returns initialized Firebase app instance.
 *
 * Initializes the app once and reuses the same instance on subsequent calls.
 * This prevents multiple Firebase app instances in the same client bundle.
 * 
 * If Firebase is not configured, throws a helpful error with setup instructions.
 */
export function getFirebaseApp(): FirebaseApp {
  // Client-side guard - check at function call time, not module load time
  if (typeof window === "undefined") {
    throw new Error(
      "❌ Firebase Client SDK cannot be used in server-side code. " +
        "Use @/lib/firebase/init.ts and @/lib/firebase/auth.ts for server operations."
    );
  }

  if (firebaseApp) {
    return firebaseApp;
  }

  // Check if Firebase is configured
  if (!isFirebaseConfigured()) {
    const error = new Error(
      `❌ Firebase is not configured yet.

This is normal for a boilerplate! You need to set up Firebase first.

📖 Setup Instructions:
1. Create a Firebase project at https://console.firebase.google.com
2. Get your Firebase config from Project Settings → General → Your apps
3. Add the following to your .env.local file:

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

📚 See the documentation:
/docs/features/firebase-setup

After adding the variables, restart your dev server (npm run dev).
`
    );
    configError = error;
    throw error;
  }

  // Check if Firebase is already initialized (e.g., by another module)
  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0];
    return firebaseApp;
  }

  try {
    // Initialize new app
    firebaseApp = initializeApp(firebaseConfig);
    return firebaseApp;
  } catch (error) {
    // If initialization fails, provide helpful error
    const initError = error instanceof Error ? error : new Error(String(error));
    const helpfulError = new Error(
      `❌ Firebase initialization failed: ${initError.message}

This usually means your Firebase configuration is incorrect.

📖 Check:
1. Verify all NEXT_PUBLIC_FIREBASE_* variables are set in .env.local
2. Restart your dev server after adding variables
3. Check Firebase Console to ensure your project is active

📚 See the documentation:
/docs/features/firebase-setup

Original error: ${initError.message}
`
    );
    configError = helpfulError;
    throw helpfulError;
  }
}

// -----------------------------------------------------------------------------
// 4. Get Auth instance
// -----------------------------------------------------------------------------

/**
 * getAuthInstance() — returns Firebase Auth instance.
 *
 * Provides access to authentication methods:
 *   - signInWithEmailAndPassword()
 *   - createUserWithEmailAndPassword()
 *   - signInWithPopup() (Google OAuth)
 *   - sendPasswordResetEmail()
 *   - onAuthStateChanged()
 * 
 * @throws Error if Firebase is not configured
 */
export function getAuthInstance(): Auth {
  if (!authInstance) {
    const app = getFirebaseApp();
    authInstance = getAuth(app);
  }

  return authInstance;
}

// -----------------------------------------------------------------------------
// 5. Get Firestore instance
// -----------------------------------------------------------------------------

/**
 * getFirestoreInstance() — returns Firestore instance.
 *
 * Provides access to Firestore from client:
 *   - collection(), doc()
 *   - getDoc(), getDocs()
 *   - onSnapshot() (real-time listeners)
 *
 * Note: Client-side Firestore operations are subject to security rules.
 * For admin operations, use server-side Firestore via @/lib/firebase/init.ts
 */
export function getFirestoreInstance(): Firestore {
  if (!firestoreInstance) {
    const app = getFirebaseApp();
    firestoreInstance = getFirestore(app);
  }

  return firestoreInstance;
}

// -----------------------------------------------------------------------------
// 6. Convenience exports (matching Firebase SDK naming)
// -----------------------------------------------------------------------------

/**
 * Direct exports for common use cases.
 * These match the Firebase SDK naming convention for familiarity.
 */
export const auth = () => getAuthInstance();
export const firestore = () => getFirestoreInstance();

// -----------------------------------------------------------------------------
// 7. Default export
// -----------------------------------------------------------------------------

export default getFirebaseApp;

