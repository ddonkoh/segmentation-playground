/**
 * -----------------------------------------------------------------------------
 * ShipSafe Stripe Module — client.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Initializes Stripe client for server-side operations.
 *   Provides access to Stripe API for checkout, billing, and webhook handling.
 *
 * Why this exists:
 *   Stripe operations require server-side secret key access:
 *     - Creating checkout sessions
 *     - Managing subscriptions
 *     - Verifying webhook signatures
 *     - Accessing customer data
 *
 * Security:
 *   - Uses secret key from environment variables (never exposed to client)
 *   - Server-side only (blocked in client bundles)
 *   - Singleton pattern prevents multiple instances
 *
 * Used by:
 *   - checkout.ts (session creation)
 *   - billing.ts (portal sessions)
 *   - webhook.ts (event verification)
 *   - API routes (protected endpoints)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Stripe secret key MUST remain server-side only. Never expose it in
 *   client bundles or API responses.
 * -----------------------------------------------------------------------------
 */

import Stripe from "stripe";
import { getEnv } from "@/lib/security/env";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Stripe client cannot be used in client-side code. " +
      "Use Stripe.js (NEXT_PUBLIC_STRIPE_PUBLIC_KEY) for client-side operations."
  );
}

// -----------------------------------------------------------------------------
// 2. Stripe client instance (singleton)
// -----------------------------------------------------------------------------

let stripeClient: Stripe | null = null;

/**
 * getStripeClient() — returns initialized Stripe client instance.
 *
 * Initializes Stripe with secret key from environment variables.
 * Uses singleton pattern to prevent multiple instances.
 *
 * Required environment variable:
 *   - STRIPE_SECRET_KEY (starts with sk_test_ or sk_live_)
 *
 * @returns Stripe client instance
 * @throws Error if STRIPE_SECRET_KEY is missing or invalid
 */
export function getStripeClient(): Stripe {
  if (stripeClient) {
    return stripeClient;
  }

  try {
    const secretKey = getEnv("STRIPE_SECRET_KEY");

    // Validate key format (basic check)
    if (!secretKey.startsWith("sk_")) {
      throw new Error(
        "Invalid Stripe secret key format. Key must start with 'sk_test_' or 'sk_live_'."
      );
    }

    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia", // Use latest stable API version
      typescript: true,
    });

    return stripeClient;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Missing required")) {
      throw error; // Re-throw getEnv errors as-is
    }

    throw new Error(
      `❌ Failed to initialize Stripe client.
      
${error instanceof Error ? error.message : String(error)}

Required environment variable:
  - STRIPE_SECRET_KEY

Check /docs/stripe-setup.md for setup instructions.
`
    );
  }
}

// -----------------------------------------------------------------------------
// 3. Default export
// -----------------------------------------------------------------------------

export default getStripeClient;

