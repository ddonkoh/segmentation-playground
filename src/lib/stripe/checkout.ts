/**
 * -----------------------------------------------------------------------------
 * ShipSafe Stripe Module — checkout.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Creates Stripe Checkout sessions for subscription purchases.
 *   Attaches Firebase UID to session metadata for webhook processing.
 *
 * Why this exists:
 *   Stripe Checkout provides:
 *     - Secure payment collection
 *     - Automatic subscription management
 *     - Customer portal access
 *     - Webhook event generation
 *
 * Security:
 *   - Server-side only (requires secret key)
 *   - Validates user authentication
 *   - Attaches Firebase UID to metadata for secure linking
 *
 * Used by:
 *   - API routes (/api/checkout)
 *   - Features/billing (checkout flow)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Always attach Firebase UID to metadata. This ensures webhooks can
 *   securely link Stripe customers to Firebase users.
 * -----------------------------------------------------------------------------
 */

import Stripe from "stripe";
import { getStripeClient } from "./client";
import config from "@/config";

// -----------------------------------------------------------------------------
// 1. Type definitions
// -----------------------------------------------------------------------------

/**
 * Options for creating a checkout session.
 */
export interface CreateCheckoutSessionOptions {
  /**
   * Firebase user UID (optional - for linking customer to user)
   * If provided, will be attached to metadata for webhook processing.
   * If not provided, webhook can link via email after checkout.
   */
  userId?: string;

  /**
   * Stripe price ID for the subscription plan
   */
  priceId: string;

  /**
   * Success URL (where user is redirected after successful payment)
   * Defaults to /dashboard?checkout=success
   */
  successUrl?: string;

  /**
   * Cancel URL (where user is redirected if they cancel)
   * Defaults to /pricing?checkout=cancelled
   */
  cancelUrl?: string;

  /**
   * Optional: Customer email (pre-fills checkout form)
   */
  customerEmail?: string;

  /**
   * Optional: Additional metadata to attach to session
   */
  metadata?: Record<string, string>;
}

/**
 * Result of checkout session creation.
 */
export interface CheckoutSessionResult {
  /**
   * Stripe checkout session ID
   */
  sessionId: string;

  /**
   * URL to redirect user to for payment
   */
  url: string | null;
}

// -----------------------------------------------------------------------------
// 2. Create checkout session
// -----------------------------------------------------------------------------

/**
 * createCheckoutSession() — creates a Stripe Checkout session for subscription.
 *
 * This function:
 *   1. Validates input (userId, priceId)
 *   2. Creates Stripe Checkout session
 *   3. Attaches Firebase UID to metadata (critical for webhooks)
 *   4. Returns session URL for redirect
 *
 * The session metadata is used by webhooks to:
 *   - Link Stripe customer to Firebase user
 *   - Update user subscription status
 *   - Set custom claims (roles, permissions)
 *
 * @param options - Checkout session options
 * @returns Checkout session with redirect URL
 * @throws Error if session creation fails
 */
export async function createCheckoutSession(
  options: CreateCheckoutSessionOptions
): Promise<CheckoutSessionResult> {
  try {
    // Validate required fields
    if (!options.priceId) {
      throw new Error("priceId is required.");
    }

    const stripe = getStripeClient();
    const domain = config.domainName;
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${domain}`;

    // Build success and cancel URLs
    const successUrl =
      options.successUrl || `${baseUrl}/dashboard?checkout=success`;
    const cancelUrl = options.cancelUrl || `${baseUrl}/pricing?checkout=cancelled`;

    // Prepare metadata (only include userId if provided)
    const metadata: Record<string, string> = {
      ...(options.metadata || {}),
    };
    if (options.userId) {
      metadata.firebase_uid = options.userId;
    }

    // Prepare subscription metadata
    const subscriptionMetadata: Record<string, string> = {
      ...(options.metadata || {}),
    };
    if (options.userId) {
      subscriptionMetadata.firebase_uid = options.userId;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription", // Subscription-based checkout
      payment_method_types: ["card"],
      line_items: [
        {
          price: options.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: options.customerEmail,
      metadata,
      // Allow promotion codes
      allow_promotion_codes: true,
      // Enable automatic tax (if configured in Stripe)
      automatic_tax: {
        enabled: false, // Set to true if you have tax configuration
      },
      // Subscription data (for recurring billing)
      subscription_data: {
        metadata: subscriptionMetadata,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    // Provide safe error messages
    if (error instanceof Error) {
      if (error.message.includes("No such price")) {
        throw new Error("Invalid subscription plan. Please select a valid plan.");
      }
      if (error.message.includes("Invalid price")) {
        throw new Error("Invalid price ID provided.");
      }
    }

    throw new Error("Failed to create checkout session. Please try again.");
  }
}

// -----------------------------------------------------------------------------
// 3. Retrieve checkout session
// -----------------------------------------------------------------------------

/**
 * getCheckoutSession() — retrieves a checkout session by ID.
 *
 * Useful for:
 *   - Verifying session status
 *   - Getting customer information
 *   - Debugging checkout flow
 *
 * @param sessionId - Stripe checkout session ID
 * @returns Checkout session object
 * @throws Error if session not found
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return session;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("No such checkout session")) {
        throw new Error(`Checkout session ${sessionId} not found.`);
      }
    }

    throw new Error("Failed to retrieve checkout session.");
  }
}

// -----------------------------------------------------------------------------
// 4. Create one-time payment session (optional)
// -----------------------------------------------------------------------------

/**
 * createOneTimePaymentSession() — creates a checkout session for one-time payment.
 *
 * Useful for:
 *   - One-off purchases (e.g., boilerplate sales)
 *   - Non-recurring payments
 *
 * @param options - Similar to subscription options, but mode is "payment"
 * @returns Checkout session with redirect URL
 */
export async function createOneTimePaymentSession(
  options: Omit<CreateCheckoutSessionOptions, "priceId"> & {
    priceId: string;
    amount?: number; // Optional: override price amount
  }
): Promise<CheckoutSessionResult> {
  try {
    if (!options.userId || !options.priceId) {
      throw new Error("userId and priceId are required.");
    }

    const stripe = getStripeClient();
    const domain = config.domainName;
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${domain}`;

    const successUrl =
      options.successUrl || `${baseUrl}/dashboard?payment=success`;
    const cancelUrl = options.cancelUrl || `${baseUrl}/pricing?payment=cancelled`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment", // One-time payment
      payment_method_types: ["card"],
      line_items: [
        {
          price: options.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: options.customerEmail,
      metadata: {
        firebase_uid: options.userId,
        ...(options.metadata || {}),
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    throw new Error("Failed to create payment session. Please try again.");
  }
}

