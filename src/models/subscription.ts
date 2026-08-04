/**
 * -----------------------------------------------------------------------------
 * ShipSafe Models — subscription.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Subscription model definitions, Firestore converters, and validation schemas.
 *   Manages subscription data synced from Stripe webhooks.
 *
 * Why this exists:
 *   Subscription status is stored in Firestore and synced from Stripe.
 *   This file provides type-safe subscription data structures.
 *
 * Security:
 *   - Subscription data is updated via Stripe webhooks (server-side only)
 *   - Never trust client-provided subscription status
 *   - Always verify subscription status from Firestore or Stripe API
 *
 * Used by:
 *   - Features/billing (subscription management)
 *   - Webhook handlers (status updates)
 *   - API routes (subscription checks)
 *   - Server components only (NOT client components)
 *
 * IMPORTANT: This file is SERVER-ONLY and must never be imported in client code.
 * Client components should use @/models/subscription-status.ts for the enum only.
 *
 * -----------------------------------------------------------------------------
 */

import "server-only";

import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";
import { SubscriptionStatus } from "./subscription-status";

// -----------------------------------------------------------------------------
// 1. Subscription Status Enum (re-exported from subscription-status.ts)
// -----------------------------------------------------------------------------

// Re-export for convenience (server-side code can import from here)
export { SubscriptionStatus };

// -----------------------------------------------------------------------------
// 2. Subscription Interface
// -----------------------------------------------------------------------------

/**
 * Subscription data stored in Firestore.
 * This represents the subscription document structure.
 */
export interface Subscription {
  /**
   * Stripe subscription ID (primary key)
   */
  subscriptionId: string;

  /**
   * Firebase user UID (links to user)
   */
  userId: string;

  /**
   * Stripe customer ID
   */
  customerId: string;

  /**
   * Stripe price ID (links to plan)
   */
  priceId: string;

  /**
   * Stripe product ID
   */
  productId: string | null;

  /**
   * Subscription status
   */
  status: SubscriptionStatus;

  /**
   * Current billing period start (Unix timestamp)
   */
  currentPeriodStart: number;

  /**
   * Current billing period end (Unix timestamp)
   */
  currentPeriodEnd: number;

  /**
   * Whether subscription is set to cancel at period end
   */
  cancelAtPeriodEnd: boolean;

  /**
   * Timestamp when subscription was canceled (if canceled)
   */
  canceledAt: number | null;

  /**
   * Timestamp when subscription was created
   */
  createdAt: number;

  /**
   * Last update timestamp
   */
  updatedAt: number;
}

// -----------------------------------------------------------------------------
// 3. Subscription Update Input
// -----------------------------------------------------------------------------

/**
 * Input data for updating subscription (from Stripe webhook).
 */
export interface UpdateSubscriptionInput {
  status: SubscriptionStatus;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: number | null;
  priceId?: string;
  productId?: string | null;
}

// -----------------------------------------------------------------------------
// 4. Zod Schemas
// -----------------------------------------------------------------------------

/**
 * Zod schema for subscription status enum.
 */
export const subscriptionStatusSchema = z.nativeEnum(SubscriptionStatus);

/**
 * Zod schema for subscription update input.
 */
export const updateSubscriptionInputSchema = z.object({
  status: subscriptionStatusSchema,
  currentPeriodStart: z.number().int().positive(),
  currentPeriodEnd: z.number().int().positive(),
  cancelAtPeriodEnd: z.boolean().optional(),
  canceledAt: z.number().int().positive().nullable().optional(),
  priceId: z.string().min(1).optional(),
  productId: z.string().nullable().optional(),
});

// -----------------------------------------------------------------------------
// 5. Firestore Converters
// -----------------------------------------------------------------------------

/**
 * Convert Firestore document to Subscription object.
 * Handles Timestamp to number conversion for Unix timestamps.
 *
 * @param data - Firestore document data
 * @returns Subscription object
 */
export function subscriptionFromFirestore(data: {
  subscriptionId: string;
  userId: string;
  customerId: string;
  priceId: string;
  productId?: string | null;
  status: string;
  currentPeriodStart: Timestamp | number;
  currentPeriodEnd: Timestamp | number;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Timestamp | number | null;
  createdAt: Timestamp | number;
  updatedAt: Timestamp | number;
}): Subscription {
  const convertToUnix = (ts: Timestamp | number | null | undefined): number | null => {
    if (!ts) return null;
    if (typeof ts === "number") return ts;
    if (ts instanceof Timestamp) return ts.toMillis() / 1000; // Convert to Unix timestamp
    return null;
  };

  return {
    subscriptionId: data.subscriptionId,
    userId: data.userId,
    customerId: data.customerId,
    priceId: data.priceId,
    productId: data.productId ?? null,
    status: data.status as SubscriptionStatus,
    currentPeriodStart: convertToUnix(data.currentPeriodStart) ?? 0,
    currentPeriodEnd: convertToUnix(data.currentPeriodEnd) ?? 0,
    cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
    canceledAt: convertToUnix(data.canceledAt),
    createdAt: convertToUnix(data.createdAt) ?? Math.floor(Date.now() / 1000),
    updatedAt: convertToUnix(data.updatedAt) ?? Math.floor(Date.now() / 1000),
  };
}

/**
 * Convert Subscription object to Firestore document data.
 * Converts Unix timestamps to Timestamp for Firestore storage.
 *
 * @param subscription - Subscription object
 * @returns Firestore document data
 */
export function subscriptionToFirestore(subscription: Subscription): {
  subscriptionId: string;
  userId: string;
  customerId: string;
  priceId: string;
  productId: string | null;
  status: string;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  canceledAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} {
  const convertFromUnix = (unix: number | null): Timestamp | null => {
    if (!unix) return null;
    return Timestamp.fromMillis(unix * 1000);
  };

  return {
    subscriptionId: subscription.subscriptionId,
    userId: subscription.userId,
    customerId: subscription.customerId,
    priceId: subscription.priceId,
    productId: subscription.productId,
    status: subscription.status,
    currentPeriodStart: convertFromUnix(subscription.currentPeriodStart) ?? Timestamp.now(),
    currentPeriodEnd: convertFromUnix(subscription.currentPeriodEnd) ?? Timestamp.now(),
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    canceledAt: convertFromUnix(subscription.canceledAt),
    createdAt: convertFromUnix(subscription.createdAt) ?? Timestamp.now(),
    updatedAt: convertFromUnix(subscription.updatedAt) ?? Timestamp.now(),
  };
}

// -----------------------------------------------------------------------------
// 6. Subscription Utilities
// -----------------------------------------------------------------------------

/**
 * Check if subscription is active (active or trialing).
 *
 * @param subscription - Subscription object
 * @returns true if subscription is active
 */
export function isSubscriptionActive(subscription: Subscription): boolean {
  return (
    subscription.status === SubscriptionStatus.ACTIVE ||
    subscription.status === SubscriptionStatus.TRIALING
  );
}

/**
 * Check if subscription is canceled or will be canceled.
 *
 * @param subscription - Subscription object
 * @returns true if subscription is canceled or will cancel
 */
export function isSubscriptionCanceled(subscription: Subscription): boolean {
  return (
    subscription.status === SubscriptionStatus.CANCELED ||
    subscription.cancelAtPeriodEnd === true
  );
}

/**
 * Check if subscription has payment issues.
 *
 * @param subscription - Subscription object
 * @returns true if subscription has payment issues
 */
export function hasPaymentIssues(subscription: Subscription): boolean {
  return (
    subscription.status === SubscriptionStatus.PAST_DUE ||
    subscription.status === SubscriptionStatus.UNPAID ||
    subscription.status === SubscriptionStatus.INCOMPLETE ||
    subscription.status === SubscriptionStatus.INCOMPLETE_EXPIRED
  );
}

/**
 * Get days until subscription period ends.
 *
 * @param subscription - Subscription object
 * @returns Number of days until period end, or null if invalid
 */
export function getDaysUntilPeriodEnd(subscription: Subscription): number | null {
  const now = Math.floor(Date.now() / 1000);
  const daysRemaining = Math.ceil((subscription.currentPeriodEnd - now) / (60 * 60 * 24));

  if (daysRemaining < 0) return 0;
  return daysRemaining;
}

/**
 * Format subscription status for display.
 *
 * @param status - Subscription status
 * @returns Human-readable status string
 */
export function formatSubscriptionStatus(status: SubscriptionStatus): string {
  const statusMap: Record<SubscriptionStatus, string> = {
    [SubscriptionStatus.ACTIVE]: "Active",
    [SubscriptionStatus.CANCELED]: "Canceled",
    [SubscriptionStatus.INCOMPLETE]: "Incomplete",
    [SubscriptionStatus.INCOMPLETE_EXPIRED]: "Expired",
    [SubscriptionStatus.PAST_DUE]: "Past Due",
    [SubscriptionStatus.TRIALING]: "Trial",
    [SubscriptionStatus.UNPAID]: "Unpaid",
    [SubscriptionStatus.PAUSED]: "Paused",
  };

  return statusMap[status] || status;
}

// -----------------------------------------------------------------------------
// 7. Type Exports
// -----------------------------------------------------------------------------

/**
 * Type for subscription update input (inferred from schema).
 */
export type UpdateSubscriptionInputType = z.infer<typeof updateSubscriptionInputSchema>;

