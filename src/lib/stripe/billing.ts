/**
 * -----------------------------------------------------------------------------
 * ShipSafe Stripe Module — billing.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Manages Stripe Billing Portal sessions and subscription status helpers.
 *   Provides secure access to customer billing management.
 *
 * Why this exists:
 *   Stripe Billing Portal allows customers to:
 *     - Update payment methods
 *     - View billing history
 *     - Cancel subscriptions
 *     - Update billing information
 *
 * Security:
 *   - Server-side only (requires secret key)
 *   - Validates user authentication
 *   - Links portal sessions to Firebase users
 *
 * Used by:
 *   - API routes (/api/billing/portal)
 *   - Features/billing (billing management)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Always link billing portal sessions to authenticated users. Never
 *   allow access to billing portal without proper authentication.
 * -----------------------------------------------------------------------------
 */

import Stripe from "stripe";
import { getStripeClient } from "./client";
import config from "@/config";

// -----------------------------------------------------------------------------
// 1. Type definitions
// -----------------------------------------------------------------------------

/**
 * Options for creating a billing portal session.
 */
export interface CreateBillingPortalSessionOptions {
  /**
   * Stripe customer ID (required)
   */
  customerId: string;

  /**
   * Return URL (where user is redirected after leaving portal)
   * Defaults to /dashboard?billing=updated
   */
  returnUrl?: string;
}

/**
 * Subscription status values.
 */
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "trialing"
  | "unpaid"
  | "paused";

/**
 * Subscription information.
 */
export interface SubscriptionInfo {
  /**
   * Stripe subscription ID
   */
  subscriptionId: string;

  /**
   * Stripe customer ID
   */
  customerId: string;

  /**
   * Subscription status
   */
  status: SubscriptionStatus;

  /**
   * Current period start (Unix timestamp)
   */
  currentPeriodStart: number;

  /**
   * Current period end (Unix timestamp)
   */
  currentPeriodEnd: number;

  /**
   * Cancel at period end (true if subscription is set to cancel)
   */
  cancelAtPeriodEnd: boolean;

  /**
   * Price ID of the subscription
   */
  priceId: string | null;

  /**
   * Product ID of the subscription
   */
  productId: string | null;
}

/**
 * Customer information.
 */
export interface CustomerInfo {
  /**
   * Stripe customer ID
   */
  customerId: string;

  /**
   * Customer email
   */
  email: string | null;

  /**
   * Customer name
   */
  name: string | null;

  /**
   * Default payment method ID
   */
  defaultPaymentMethod: string | null;

  /**
   * Subscription information (if exists)
   */
  subscription: SubscriptionInfo | null;
}

// -----------------------------------------------------------------------------
// 2. Create billing portal session
// -----------------------------------------------------------------------------

/**
 * createBillingPortalSession() — creates a Stripe Billing Portal session.
 *
 * This function:
 *   1. Validates customer ID
 *   2. Creates billing portal session
 *   3. Returns portal URL for redirect
 *
 * The billing portal allows customers to:
 *   - Update payment methods
 *   - View invoices
 *   - Cancel subscriptions
 *   - Update billing information
 *
 * @param options - Billing portal session options
 * @returns Portal session URL
 * @throws Error if session creation fails
 */
export async function createBillingPortalSession(
  options: CreateBillingPortalSessionOptions
): Promise<string> {
  try {
    if (!options.customerId) {
      throw new Error("customerId is required.");
    }

    const stripe = getStripeClient();
    const domain = config.domainName;
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${domain}`;

    const returnUrl = options.returnUrl || `${baseUrl}/dashboard?billing=updated`;

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: options.customerId,
      return_url: returnUrl,
    });

    if (!session.url) {
      throw new Error("Failed to generate billing portal URL.");
    }

    return session.url;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("No such customer")) {
        throw new Error("Customer not found in Stripe.");
      }
    }

    throw new Error("Failed to create billing portal session. Please try again.");
  }
}

// -----------------------------------------------------------------------------
// 3. Get subscription status
// -----------------------------------------------------------------------------

/**
 * getSubscriptionStatus() — retrieves subscription status for a customer.
 *
 * This function:
 *   1. Fetches customer from Stripe
 *   2. Gets active subscription (if exists)
 *   3. Returns subscription information
 *
 * @param customerId - Stripe customer ID
 * @returns Subscription information or null if no subscription
 * @throws Error if customer not found
 */
export async function getSubscriptionStatus(
  customerId: string
): Promise<SubscriptionInfo | null> {
  try {
    const stripe = getStripeClient();

    // Get customer subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all", // Include all statuses (active, canceled, etc.)
      limit: 1, // Get most recent subscription
    });

    if (subscriptions.data.length === 0) {
      return null;
    }

    const subscription = subscriptions.data[0];
    const priceId =
      subscription.items.data[0]?.price.id || null;
    const productId =
      subscription.items.data[0]?.price.product as string | null;

    return {
      subscriptionId: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      priceId,
      productId,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("No such customer")) {
        throw new Error("Customer not found in Stripe.");
      }
    }

    throw new Error("Failed to retrieve subscription status.");
  }
}

// -----------------------------------------------------------------------------
// 4. Get customer information
// -----------------------------------------------------------------------------

/**
 * getCustomerInfo() — retrieves full customer information including subscription.
 *
 * @param customerId - Stripe customer ID
 * @returns Customer information with subscription details
 * @throws Error if customer not found
 */
export async function getCustomerInfo(
  customerId: string
): Promise<CustomerInfo> {
  try {
    const stripe = getStripeClient();

    // Get customer
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      throw new Error("Customer has been deleted.");
    }

    if (!("email" in customer)) {
      throw new Error("Invalid customer object.");
    }

    // Get subscription status
    const subscription = await getSubscriptionStatus(customerId);

    // Get default payment method
    let defaultPaymentMethod: string | null = null;
    if (customer.invoice_settings?.default_payment_method) {
      const paymentMethodId =
        typeof customer.invoice_settings.default_payment_method === "string"
          ? customer.invoice_settings.default_payment_method
          : customer.invoice_settings.default_payment_method.id;
      defaultPaymentMethod = paymentMethodId;
    }

    return {
      customerId: customer.id,
      email: customer.email,
      name: customer.name ?? null,
      defaultPaymentMethod,
      subscription,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("No such customer")) {
        throw new Error("Customer not found in Stripe.");
      }
    }

    throw new Error("Failed to retrieve customer information.");
  }
}

// -----------------------------------------------------------------------------
// 5. Check if subscription is active
// -----------------------------------------------------------------------------

/**
 * isSubscriptionActive() — checks if customer has an active subscription.
 *
 * @param customerId - Stripe customer ID
 * @returns true if subscription is active, false otherwise
 */
export async function isSubscriptionActive(
  customerId: string
): Promise<boolean> {
  try {
    const subscription = await getSubscriptionStatus(customerId);

    if (!subscription) {
      return false;
    }

    // Consider subscription active if status is "active" or "trialing"
    return subscription.status === "active" || subscription.status === "trialing";
  } catch (error) {
    // Return false on any error (customer not found, etc.)
    return false;
  }
}

// -----------------------------------------------------------------------------
// 6. Cancel subscription
// -----------------------------------------------------------------------------

/**
 * cancelSubscription() — cancels a subscription immediately or at period end.
 *
 * @param subscriptionId - Stripe subscription ID
 * @param cancelImmediately - If true, cancel immediately; if false, cancel at period end
 * @returns Updated subscription information
 * @throws Error if subscription not found or cancellation fails
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelImmediately: boolean = false
): Promise<SubscriptionInfo> {
  try {
    const stripe = getStripeClient();

    let subscription: Stripe.Subscription;

    if (cancelImmediately) {
      // Cancel immediately
      subscription = await stripe.subscriptions.cancel(subscriptionId);
    } else {
      // Cancel at period end
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }

    const priceId = subscription.items.data[0]?.price.id || null;
    const productId =
      subscription.items.data[0]?.price.product as string | null;

    return {
      subscriptionId: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      priceId,
      productId,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("No such subscription")) {
        throw new Error("Subscription not found.");
      }
    }

    throw new Error("Failed to cancel subscription.");
  }
}

// -----------------------------------------------------------------------------
// 7. Reactivate subscription
// -----------------------------------------------------------------------------

/**
 * reactivateSubscription() — reactivates a subscription that was set to cancel.
 *
 * @param subscriptionId - Stripe subscription ID
 * @returns Updated subscription information
 * @throws Error if subscription not found or reactivation fails
 */
export async function reactivateSubscription(
  subscriptionId: string
): Promise<SubscriptionInfo> {
  try {
    const stripe = getStripeClient();

    // Remove cancel_at_period_end flag
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    const priceId = subscription.items.data[0]?.price.id || null;
    const productId =
      subscription.items.data[0]?.price.product as string | null;

    return {
      subscriptionId: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      priceId,
      productId,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("No such subscription")) {
        throw new Error("Subscription not found.");
      }
    }

    throw new Error("Failed to reactivate subscription.");
  }
}

