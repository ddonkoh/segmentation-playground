/**
 * -----------------------------------------------------------------------------
 * ShipSafe Billing Features — webhook.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Webhook event handlers for Stripe subscription events.
 *   Syncs subscription status to Firestore and updates user custom claims.
 *
 * Why this exists:
 *   Stripe webhooks notify us of subscription changes:
 *     - New subscriptions
 *     - Subscription updates (status changes, plan changes)
 *     - Subscription cancellations
 *     - Payment successes/failures
 *
 *   We need to:
 *     - Update Firestore subscription documents
 *     - Update user custom claims (roles)
 *     - Sync Stripe customer to Firebase user
 *
 * Security:
 *   - Webhook signature verification (done in lib/stripe/webhook.ts)
 *   - Server-side only operations
 *   - Safe error handling
 *
 * Used by:
 *   - API routes (/api/webhooks/stripe)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Webhook handlers must verify signatures before processing events.
 *   This is done in lib/stripe/webhook.ts before calling these handlers.
 * -----------------------------------------------------------------------------
 */

import { extractFirebaseUid, extractCustomerId, type ParsedWebhookEvent } from "@/lib/stripe/webhook";
import {
  updateSubscriptionInFirestore,
  syncStripeCustomerToUser,
  updateUserRoleFromSubscription,
  getSubscriptionFromFirestore,
} from "./server";
import {
  SubscriptionStatus,
  type Subscription,
} from "@/models/subscription";
import { getFirestoreInstance } from "@/lib/firebase/init";
import Stripe from "stripe";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Billing webhook handlers cannot be used in client-side code. " +
      "These functions require Admin SDK and Stripe secret keys."
  );
}

// -----------------------------------------------------------------------------
// 2. Webhook Handler Result
// -----------------------------------------------------------------------------

/**
 * Result of webhook event processing.
 */
export interface WebhookHandlerResult {
  /**
   * Whether event was processed successfully
   */
  success: boolean;

  /**
   * Message describing the result
   */
  message: string;
}

// -----------------------------------------------------------------------------
// 3. Handle Checkout Session Completed
// -----------------------------------------------------------------------------

/**
 * handleCheckoutSessionCompleted() — processes checkout.session.completed event.
 *
 * This event fires when a user completes checkout.
 * We need to:
 *   1. Extract Firebase UID from session metadata
 *   2. Link Stripe customer to Firebase user
 *   3. Create subscription document in Firestore (if subscription created)
 *
 * @param event - Parsed webhook event
 * @returns Handler result
 */
export async function handleCheckoutSessionCompleted(
  event: ParsedWebhookEvent
): Promise<WebhookHandlerResult> {
  try {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract Firebase UID from metadata
    const firebaseUid = session.metadata?.firebase_uid;
    if (!firebaseUid) {
      return {
        success: false,
        message: "No Firebase UID found in checkout session metadata.",
      };
    }

    // Extract customer ID
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;
    if (!customerId) {
      return {
        success: false,
        message: "No customer ID found in checkout session.",
      };
    }

    // Link Stripe customer to Firebase user
    await syncStripeCustomerToUser(firebaseUid, customerId);

    // If subscription was created, it will be handled by customer.subscription.created event
    // But we can also check here if subscription exists
    if (session.subscription) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;

      // Subscription will be handled by subscription.created event
      // But we can update user role here if needed
      // (Better to wait for subscription.created for full subscription data)
    }

    return {
      success: true,
      message: "Checkout session processed successfully.",
    };
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error);
    return {
      success: false,
      message: "Failed to process checkout session.",
    };
  }
}

// -----------------------------------------------------------------------------
// 4. Handle Subscription Created
// -----------------------------------------------------------------------------

/**
 * handleSubscriptionCreated() — processes customer.subscription.created event.
 *
 * This event fires when a new subscription is created.
 * We need to:
 *   1. Extract Firebase UID from subscription metadata
 *   2. Create subscription document in Firestore
 *   3. Update user custom claims (role)
 *
 * @param event - Parsed webhook event
 * @returns Handler result
 */
export async function handleSubscriptionCreated(
  event: ParsedWebhookEvent
): Promise<WebhookHandlerResult> {
  try {
    const subscription = event.data.object as Stripe.Subscription;

    // Extract Firebase UID from metadata
    const firebaseUid = subscription.metadata?.firebase_uid;
    if (!firebaseUid) {
      return {
        success: false,
        message: "No Firebase UID found in subscription metadata.",
      };
    }

    // Extract customer ID
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;
    if (!customerId) {
      return {
        success: false,
        message: "No customer ID found in subscription.",
      };
    }

    // Link Stripe customer to Firebase user (if not already linked)
    await syncStripeCustomerToUser(firebaseUid, customerId);

    // Create subscription document in Firestore
    const priceId = subscription.items.data[0]?.price.id || null;
    const productId =
      (subscription.items.data[0]?.price.product as string) || null;

    // Create subscription data (keep Unix timestamps as numbers)
    const subscriptionData: Subscription = {
      subscriptionId: subscription.id,
      userId: firebaseUid,
      customerId,
      priceId: priceId || "",
      productId: productId || "",
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      canceledAt: subscription.canceled_at || null,
      createdAt: subscription.created,
      updatedAt: Math.floor(Date.now() / 1000),
    };

    await updateSubscriptionInFirestore(subscriptionData);

    // Update user role based on subscription status
    await updateUserRoleFromSubscription(firebaseUid, subscriptionData.status);

    return {
      success: true,
      message: "Subscription created and synced successfully.",
    };
  } catch (error) {
    console.error("Error handling subscription.created:", error);
    return {
      success: false,
      message: "Failed to process subscription creation.",
    };
  }
}

// -----------------------------------------------------------------------------
// 5. Handle Subscription Updated
// -----------------------------------------------------------------------------

/**
 * handleSubscriptionUpdated() — processes customer.subscription.updated event.
 *
 * This event fires when a subscription is updated (status change, plan change, etc.).
 * We need to:
 *   1. Update subscription document in Firestore
 *   2. Update user custom claims (role) if status changed
 *
 * @param event - Parsed webhook event
 * @returns Handler result
 */
export async function handleSubscriptionUpdated(
  event: ParsedWebhookEvent
): Promise<WebhookHandlerResult> {
  try {
    const subscription = event.data.object as Stripe.Subscription;

    // Extract Firebase UID from metadata
    const firebaseUid = subscription.metadata?.firebase_uid;
    if (!firebaseUid) {
      return {
        success: false,
        message: "No Firebase UID found in subscription metadata.",
      };
    }

    // Extract customer ID
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;
    if (!customerId) {
      return {
        success: false,
        message: "No customer ID found in subscription.",
      };
    }

    // Update subscription document in Firestore
    const priceId = subscription.items.data[0]?.price.id || null;
    const productId =
      (subscription.items.data[0]?.price.product as string) || null;

    // Create subscription data (keep Unix timestamps as numbers)
    const subscriptionData: Subscription = {
      subscriptionId: subscription.id,
      userId: firebaseUid,
      customerId,
      priceId: priceId || "",
      productId: productId || "",
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      canceledAt: subscription.canceled_at || null,
      createdAt: subscription.created,
      updatedAt: Math.floor(Date.now() / 1000),
    };

    await updateSubscriptionInFirestore(subscriptionData);

    // Update user role based on subscription status
    await updateUserRoleFromSubscription(firebaseUid, subscriptionData.status);

    return {
      success: true,
      message: "Subscription updated and synced successfully.",
    };
  } catch (error) {
    console.error("Error handling subscription.updated:", error);
    return {
      success: false,
      message: "Failed to process subscription update.",
    };
  }
}

// -----------------------------------------------------------------------------
// 6. Handle Subscription Deleted
// -----------------------------------------------------------------------------

/**
 * handleSubscriptionDeleted() — processes customer.subscription.deleted event.
 *
 * This event fires when a subscription is canceled/deleted.
 * We need to:
 *   1. Update subscription document in Firestore (mark as canceled)
 *   2. Update user custom claims (remove premium role)
 *
 * @param event - Parsed webhook event
 * @returns Handler result
 */
export async function handleSubscriptionDeleted(
  event: ParsedWebhookEvent
): Promise<WebhookHandlerResult> {
  try {
    const subscription = event.data.object as Stripe.Subscription;

    // Extract Firebase UID from metadata
    const firebaseUid = subscription.metadata?.firebase_uid;
    if (!firebaseUid) {
      return {
        success: false,
        message: "No Firebase UID found in subscription metadata.",
      };
    }

    // Update subscription document in Firestore (mark as canceled)
    const priceId = subscription.items.data[0]?.price.id || null;
    const productId =
      (subscription.items.data[0]?.price.product as string) || null;

    // Create subscription data (keep Unix timestamps as numbers)
    const subscriptionData: Subscription = {
      subscriptionId: subscription.id,
      userId: firebaseUid,
      customerId:
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id || "",
      priceId: priceId || "",
      productId: productId || "",
      status: SubscriptionStatus.CANCELED,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: false, // Already canceled
      canceledAt: subscription.canceled_at || Math.floor(Date.now() / 1000),
      createdAt: subscription.created,
      updatedAt: Math.floor(Date.now() / 1000),
    };

    await updateSubscriptionInFirestore(subscriptionData);

    // Update user role (remove premium access)
    await updateUserRoleFromSubscription(firebaseUid, SubscriptionStatus.CANCELED);

    return {
      success: true,
      message: "Subscription cancellation processed successfully.",
    };
  } catch (error) {
    console.error("Error handling subscription.deleted:", error);
    return {
      success: false,
      message: "Failed to process subscription cancellation.",
    };
  }
}

// -----------------------------------------------------------------------------
// 7. Handle Invoice Payment Succeeded
// -----------------------------------------------------------------------------

/**
 * handleInvoicePaymentSucceeded() — processes invoice.payment_succeeded event.
 *
 * This event fires when a subscription payment succeeds.
 * We can use this to:
 *   1. Update subscription status if needed
 *   2. Log payment events
 *   3. Send confirmation emails (optional)
 *
 * @param event - Parsed webhook event
 * @returns Handler result
 */
export async function handleInvoicePaymentSucceeded(
  event: ParsedWebhookEvent
): Promise<WebhookHandlerResult> {
  try {
    const invoice = event.data.object as Stripe.Invoice;

    // If invoice has a subscription, ensure it's synced
    if (invoice.subscription) {
      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription.id;

      // Subscription should already be synced, but we can verify
      // This is mainly for logging/auditing purposes
    }

    return {
      success: true,
      message: "Invoice payment processed successfully.",
    };
  } catch (error) {
    console.error("Error handling invoice.payment_succeeded:", error);
    return {
      success: false,
      message: "Failed to process invoice payment.",
    };
  }
}

// -----------------------------------------------------------------------------
// 8. Handle Invoice Payment Failed
// -----------------------------------------------------------------------------

/**
 * handleInvoicePaymentFailed() — processes invoice.payment_failed event.
 *
 * This event fires when a subscription payment fails.
 * We can use this to:
 *   1. Update subscription status (if it changes)
 *   2. Send notification emails (optional)
 *   3. Log payment failures
 *
 * @param event - Parsed webhook event
 * @returns Handler result
 */
export async function handleInvoicePaymentFailed(
  event: ParsedWebhookEvent
): Promise<WebhookHandlerResult> {
  try {
    const invoice = event.data.object as Stripe.Invoice;

    // If invoice has a subscription, the subscription status may have changed
    // Stripe will also send a subscription.updated event, so we mainly log here
    if (invoice.subscription) {
      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription.id;

      // Subscription status will be updated by subscription.updated event
      // This handler is mainly for logging/notifications
    }

    return {
      success: true,
      message: "Invoice payment failure processed successfully.",
    };
  } catch (error) {
    console.error("Error handling invoice.payment_failed:", error);
    return {
      success: false,
      message: "Failed to process invoice payment failure.",
    };
  }
}

// -----------------------------------------------------------------------------
// 9. Main Webhook Router
// -----------------------------------------------------------------------------

/**
 * handleWebhookEvent() — routes webhook events to appropriate handlers.
 *
 * This is the main entry point for webhook processing.
 * It routes events based on event type to the appropriate handler.
 *
 * @param event - Parsed webhook event
 * @returns Handler result
 */
export async function handleWebhookEvent(
  event: ParsedWebhookEvent
): Promise<WebhookHandlerResult> {
  try {
    switch (event.type) {
      case "checkout.session.completed":
        return await handleCheckoutSessionCompleted(event);

      case "customer.subscription.created":
        return await handleSubscriptionCreated(event);

      case "customer.subscription.updated":
        return await handleSubscriptionUpdated(event);

      case "customer.subscription.deleted":
        return await handleSubscriptionDeleted(event);

      case "invoice.payment_succeeded":
        return await handleInvoicePaymentSucceeded(event);

      case "invoice.payment_failed":
        return await handleInvoicePaymentFailed(event);

      default:
        return {
          success: true,
          message: `Event type ${event.type} not handled (ignored).`,
        };
    }
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return {
      success: false,
      message: "Failed to process webhook event.",
    };
  }
}

