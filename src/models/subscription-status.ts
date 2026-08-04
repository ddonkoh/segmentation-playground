/**
 * -----------------------------------------------------------------------------
 * ShipSafe Models — subscription-status.ts
 * -----------------------------------------------------------------------------
 * Subscription status enum (client-safe).
 * 
 * This file contains only the SubscriptionStatus enum with no server-only imports.
 * It can be safely imported by client components.
 *
 * -----------------------------------------------------------------------------
 */

/**
 * Subscription status values (from Stripe).
 * These match Stripe's subscription status enum.
 */
export enum SubscriptionStatus {
  /**
   * Subscription is active and in good standing.
   */
  ACTIVE = "active",

  /**
   * Subscription has been canceled.
   */
  CANCELED = "canceled",

  /**
   * Subscription is incomplete (payment failed).
   */
  INCOMPLETE = "incomplete",

  /**
   * Incomplete subscription has expired.
   */
  INCOMPLETE_EXPIRED = "incomplete_expired",

  /**
   * Payment is past due.
   */
  PAST_DUE = "past_due",

  /**
   * Subscription is in trial period.
   */
  TRIALING = "trialing",

  /**
   * Payment has failed and subscription is unpaid.
   */
  UNPAID = "unpaid",

  /**
   * Subscription is paused (if supported).
   */
  PAUSED = "paused",
}

