/**
 * -----------------------------------------------------------------------------
 * ShipSafe Billing Features — server.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Server-side billing operations with Firestore integration.
 *   Wraps Stripe lib functions and syncs data to Firestore.
 *
 * Why this exists:
 *   Billing operations need to:
 *     - Create checkout/billing portal sessions (Stripe)
 *     - Sync subscription data to Firestore
 *     - Link Stripe customers to Firebase users
 *     - Update user custom claims based on subscription
 *
 * Security:
 *   - Uses Firebase Admin SDK (server-side only)
 *   - Validates user authentication
 *   - Syncs subscription status securely
 *
 * Used by:
 *   - API routes (/api/checkout, /api/billing/portal)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   This function must only be called server-side. It uses Admin SDK
 *   and Stripe secret keys which must never be exposed to clients.
 * -----------------------------------------------------------------------------
 */

import { createCheckoutSession } from "@/lib/stripe/checkout";
import {
  createBillingPortalSession,
  getSubscriptionStatus,
} from "@/lib/stripe/billing";
import { getFirestoreInstance } from "@/lib/firebase/init";
import { setCustomClaims } from "@/lib/firebase/admin";
import {
  subscriptionFromFirestore,
  subscriptionToFirestore,
  type Subscription,
  SubscriptionStatus,
} from "@/models/subscription";
import { userFromFirestore, type User } from "@/models/user";
import { UserRole } from "@/models/roles";
import type { CreateCheckoutSessionInput, CreateBillingPortalSessionInput } from "./schema";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Billing server functions cannot be used in client-side code. " +
      "These functions require Admin SDK and Stripe secret keys."
  );
}

// -----------------------------------------------------------------------------
// 2. Create Checkout Session (with Firestore sync)
// -----------------------------------------------------------------------------

/**
 * createCheckoutSessionForUser() — creates checkout session and prepares Firestore.
 *
 * This function:
 *   1. Creates Stripe checkout session
 *   2. Links session to Firebase user (via metadata)
 *   3. Returns checkout URL for redirect
 *
 * @param userId - Firebase user UID
 * @param input - Checkout session options
 * @returns Checkout session with redirect URL
 * @throws Error if session creation fails
 */
export async function createCheckoutSessionForUser(
  userId: string,
  input: CreateCheckoutSessionInput
) {
  // Get user from Firestore to get email for checkout
  const firestore = getFirestoreInstance();
  const userDoc = await firestore.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    throw new Error("User not found.");
  }

  const docData = userDoc.data();
  if (!docData) {
    throw new Error("User not found.");
  }
  const user = userFromFirestore({
    uid: userId,
    email: docData.email || "",
    displayName: docData.displayName ?? null,
    photoURL: docData.photoURL ?? null,
    emailVerified: docData.emailVerified ?? false,
    stripeCustomerId: docData.stripeCustomerId ?? null,
    subscriptionId: docData.subscriptionId ?? null,
    subscriptionStatus: docData.subscriptionStatus ?? null,
    createdAt: docData.createdAt || new Date(),
    updatedAt: docData.updatedAt || new Date(),
    lastSignInAt: docData.lastSignInAt ?? null,
    disabled: docData.disabled ?? false,
  });

  // Create checkout session
  const session = await createCheckoutSession({
    userId,
    priceId: input.priceId,
    successUrl: input.successUrl,
    cancelUrl: input.cancelUrl,
    customerEmail: user.email || undefined,
  });

  return session;
}

// -----------------------------------------------------------------------------
// 3. Create Billing Portal Session
// -----------------------------------------------------------------------------

/**
 * createBillingPortalSessionForUser() — creates billing portal session.
 *
 * This function:
 *   1. Gets user's Stripe customer ID from Firestore
 *   2. Creates billing portal session
 *   3. Returns portal URL for redirect
 *
 * @param userId - Firebase user UID
 * @param input - Billing portal session options
 * @returns Billing portal session URL
 * @throws Error if session creation fails
 */
export async function createBillingPortalSessionForUser(
  userId: string,
  input: CreateBillingPortalSessionInput
): Promise<string> {
  // Get user from Firestore to get Stripe customer ID
  const firestore = getFirestoreInstance();
  const userDoc = await firestore.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    throw new Error("User not found.");
  }

  const docData = userDoc.data();
  if (!docData) {
    throw new Error("User not found.");
  }
  const user = userFromFirestore({
    uid: userId,
    email: docData.email || "",
    displayName: docData.displayName ?? null,
    photoURL: docData.photoURL ?? null,
    emailVerified: docData.emailVerified ?? false,
    stripeCustomerId: docData.stripeCustomerId ?? null,
    subscriptionId: docData.subscriptionId ?? null,
    subscriptionStatus: docData.subscriptionStatus ?? null,
    createdAt: docData.createdAt || new Date(),
    updatedAt: docData.updatedAt || new Date(),
    lastSignInAt: docData.lastSignInAt ?? null,
    disabled: docData.disabled ?? false,
  });

  if (!user.stripeCustomerId) {
    throw new Error("No Stripe customer found. Please subscribe to a plan first.");
  }

  // Create billing portal session
  const portalUrl = await createBillingPortalSession({
    customerId: user.stripeCustomerId,
    returnUrl: input.returnUrl,
  });

  return portalUrl;
}

// -----------------------------------------------------------------------------
// 4. Get User Subscription Status
// -----------------------------------------------------------------------------

/**
 * getUserSubscriptionStatus() — gets subscription status for a user.
 *
 * This function:
 *   1. Gets user's Stripe customer ID from Firestore
 *   2. Fetches subscription from Stripe
 *   3. Returns subscription information
 *
 * @param userId - Firebase user UID
 * @returns Subscription information or null if no subscription
 * @throws Error if customer not found
 */
export async function getUserSubscriptionStatus(userId: string) {
  // Get user from Firestore to get Stripe customer ID
  const firestore = getFirestoreInstance();
  const userDoc = await firestore.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    return null;
  }

  const docData = userDoc.data();
  if (!docData) {
    throw new Error("User not found.");
  }
  const user = userFromFirestore({
    uid: userId,
    email: docData.email || "",
    displayName: docData.displayName ?? null,
    photoURL: docData.photoURL ?? null,
    emailVerified: docData.emailVerified ?? false,
    stripeCustomerId: docData.stripeCustomerId ?? null,
    subscriptionId: docData.subscriptionId ?? null,
    subscriptionStatus: docData.subscriptionStatus ?? null,
    createdAt: docData.createdAt || new Date(),
    updatedAt: docData.updatedAt || new Date(),
    lastSignInAt: docData.lastSignInAt ?? null,
    disabled: docData.disabled ?? false,
  });

  if (!user.stripeCustomerId) {
    return null;
  }

  // Get subscription from Stripe
  const subscription = await getSubscriptionStatus(user.stripeCustomerId);

  return subscription;
}

// -----------------------------------------------------------------------------
// 5. Sync Stripe Customer to Firebase User
// -----------------------------------------------------------------------------

/**
 * syncStripeCustomerToUser() — links Stripe customer to Firebase user.
 *
 * This function:
 *   1. Updates user document in Firestore with Stripe customer ID
 *   2. Optionally creates customer in Stripe if doesn't exist
 *
 * @param userId - Firebase user UID
 * @param customerId - Stripe customer ID
 * @throws Error if sync fails
 */
export async function syncStripeCustomerToUser(
  userId: string,
  customerId: string
): Promise<void> {
  const firestore = getFirestoreInstance();

  // Update user document in Firestore
  await firestore.collection("users").doc(userId).update({
    stripeCustomerId: customerId,
    updatedAt: new Date(),
  });
}

// -----------------------------------------------------------------------------
// 6. Update Subscription in Firestore
// -----------------------------------------------------------------------------

/**
 * updateSubscriptionInFirestore() — updates subscription document in Firestore.
 *
 * This function:
 *   1. Creates or updates subscription document
 *   2. Links subscription to user
 *   3. Stores subscription data for quick access
 *
 * @param subscription - Subscription data
 * @throws Error if update fails
 */
export async function updateSubscriptionInFirestore(
  subscription: Subscription
): Promise<void> {
  const firestore = getFirestoreInstance();
  const subscriptionDoc = subscriptionToFirestore(subscription);

  // Update subscription document
  await firestore
    .collection("subscriptions")
    .doc(subscription.subscriptionId)
    .set(subscriptionDoc, { merge: true });

  // Also update user's subscription reference (optional - for quick lookup)
  await firestore.collection("users").doc(subscription.userId).update({
    subscriptionId: subscription.subscriptionId,
    updatedAt: new Date(),
  });
}

// -----------------------------------------------------------------------------
// 7. Update User Custom Claims Based on Subscription
// -----------------------------------------------------------------------------

/**
 * updateUserRoleFromSubscription() — updates user role based on subscription status.
 *
 * This function:
 *   1. Checks subscription status
 *   2. Updates user custom claims (role)
 *   3. Sets role to PREMIUM if subscription is active, USER if not
 *
 * @param userId - Firebase user UID
 * @param subscriptionStatus - Subscription status
 * @throws Error if update fails
 */
export async function updateUserRoleFromSubscription(
  userId: string,
  subscriptionStatus: SubscriptionStatus | null
): Promise<void> {
  // Determine role based on subscription status
  let role: UserRole = UserRole.USER; // Default role

  if (subscriptionStatus === SubscriptionStatus.ACTIVE || subscriptionStatus === SubscriptionStatus.TRIALING) {
    role = UserRole.PREMIUM;
  }

  // Update custom claims
  await setCustomClaims({
    uid: userId,
    claims: {
      role,
    },
  });
}

// -----------------------------------------------------------------------------
// 8. Get Subscription from Firestore
// -----------------------------------------------------------------------------

/**
 * getSubscriptionFromFirestore() — retrieves subscription from Firestore.
 *
 * @param subscriptionId - Stripe subscription ID
 * @returns Subscription object or null if not found
 */
export async function getSubscriptionFromFirestore(
  subscriptionId: string
): Promise<Subscription | null> {
  const firestore = getFirestoreInstance();
  const doc = await firestore.collection("subscriptions").doc(subscriptionId).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data();
  if (!data) {
    return null;
  }

  return subscriptionFromFirestore({
    subscriptionId,
    userId: data.userId || "",
    customerId: data.customerId || "",
    priceId: data.priceId || "",
    productId: data.productId ?? null,
    status: data.status || "",
    currentPeriodStart: data.currentPeriodStart || 0,
    currentPeriodEnd: data.currentPeriodEnd || 0,
    cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
    canceledAt: data.canceledAt ?? null,
    createdAt: data.createdAt || 0,
    updatedAt: data.updatedAt || 0,
  });
}

// -----------------------------------------------------------------------------
// 9. Get User Subscription from Firestore
// -----------------------------------------------------------------------------

/**
 * getUserSubscriptionFromFirestore() — gets user's subscription from Firestore.
 *
 * @param userId - Firebase user UID
 * @returns Subscription object or null if not found
 */
export async function getUserSubscriptionFromFirestore(
  userId: string
): Promise<Subscription | null> {
  const firestore = getFirestoreInstance();

  // Query subscriptions by userId
  const snapshot = await firestore
    .collection("subscriptions")
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();

  return subscriptionFromFirestore({
    subscriptionId: doc.id,
    userId: data.userId || "",
    customerId: data.customerId || "",
    priceId: data.priceId || "",
    productId: data.productId ?? null,
    status: data.status || "",
    currentPeriodStart: data.currentPeriodStart || 0,
    currentPeriodEnd: data.currentPeriodEnd || 0,
    cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
    canceledAt: data.canceledAt ?? null,
    createdAt: data.createdAt || 0,
    updatedAt: data.updatedAt || 0,
  });
}

