/**
 * Empty module replacement for subscription.ts in client bundles.
 * This prevents firebase-admin from being bundled in client code.
 */

// Re-export only the SubscriptionStatus enum for client use
export { SubscriptionStatus } from "@/models/subscription-status";

// Export empty/placeholder types for client components
export type Subscription = {
  id: string;
  status: string;
  [key: string]: unknown;
};

export type CreateSubscriptionInput = Record<string, never>;
export type UpdateSubscriptionInput = Record<string, never>;

