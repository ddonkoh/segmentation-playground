/**
 * -----------------------------------------------------------------------------
 * ShipSafe Stripe Module — webhook.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Verifies Stripe webhook signatures and parses events securely.
 *   Ensures webhook requests are authentic and from Stripe.
 *
 * Why this exists:
 *   Webhooks are critical for:
 *     - Syncing subscription status to Firestore
 *     - Updating user custom claims (roles, permissions)
 *     - Handling payment failures
 *     - Managing subscription lifecycle events
 *
 * Security:
 *   - MUST verify webhook signature (prevents spoofing)
 *   - MUST use raw request body (signature verification requires raw bytes)
 *   - Returns safe error messages
 *   - Logs suspicious activity
 *
 * Used by:
 *   - API routes (/api/webhooks/stripe)
 *   - Features/billing (webhook handlers)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Webhook signature verification is CRITICAL. Never process webhooks
 *   without verifying the signature. This prevents attackers from sending
 *   fake webhook events.
 * -----------------------------------------------------------------------------
 */

import { NextRequest } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "./client";
import { getEnv } from "@/lib/security/env";

// -----------------------------------------------------------------------------
// 1. Type definitions
// -----------------------------------------------------------------------------

/**
 * Webhook event types that ShipSafe handles.
 * Add more event types as needed for your subscription flow.
 */
export type StripeWebhookEventType =
  | "checkout.session.completed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.payment_succeeded"
  | "invoice.payment_failed"
  | "customer.updated";

/**
 * Parsed webhook event with type safety.
 */
export interface ParsedWebhookEvent {
  /**
   * Stripe event ID (unique identifier)
   */
  id: string;

  /**
   * Event type (e.g., "checkout.session.completed")
   */
  type: StripeWebhookEventType | string;

  /**
   * Timestamp when event was created
   */
  created: number;

  /**
   * Event data object (varies by event type)
   */
  data: Stripe.Event.Data;

  /**
   * Full Stripe event object (for advanced use cases)
   */
  event: Stripe.Event;
}

// -----------------------------------------------------------------------------
// 2. Get raw request body
// -----------------------------------------------------------------------------

/**
 * getRawBody() — extracts raw request body as Buffer.
 *
 * CRITICAL: Stripe signature verification requires the raw request body
 * (as bytes), not the parsed JSON. This is because the signature is
 * computed over the raw bytes.
 *
 * @param req - Next.js request object
 * @returns Raw request body as Buffer
 */
async function getRawBody(req: NextRequest): Promise<Buffer> {
  try {
    // Next.js 13+ App Router provides request body as ReadableStream
    const chunks: Uint8Array[] = [];
    const reader = req.body?.getReader();

    if (!reader) {
      throw new Error("Request body is not available.");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    // Combine chunks into single Buffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const buffer = Buffer.alloc(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }

    return buffer;
  } catch (error) {
    throw new Error(
      `Failed to read raw request body: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// -----------------------------------------------------------------------------
// 3. Verify webhook signature
// -----------------------------------------------------------------------------

/**
 * verifyWebhookSignature() — verifies Stripe webhook signature.
 *
 * This function:
 *   1. Extracts signature from request headers
 *   2. Gets webhook secret from environment
 *   3. Verifies signature using Stripe SDK
 *   4. Returns parsed event if valid
 *   5. Throws error if signature is invalid
 *
 * @param rawBody - Raw request body as Buffer
 * @param signature - Stripe signature from request header
 * @returns Parsed Stripe event
 * @throws Error if signature is invalid or missing
 */
async function verifyWebhookSignature(
  rawBody: Buffer,
  signature: string
): Promise<Stripe.Event> {
  try {
    const stripe = getStripeClient();
    const webhookSecret = getEnv("STRIPE_WEBHOOK_SECRET");

    // Verify signature and construct event
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    return event;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("No signatures found")) {
        throw new Error("Missing Stripe webhook signature.");
      }
      if (error.message.includes("No signatures found matching")) {
        throw new Error("Invalid Stripe webhook signature.");
      }
      if (error.message.includes("Timestamp tolerance")) {
        throw new Error("Webhook timestamp is too old. Possible replay attack.");
      }
    }

    throw new Error("Webhook signature verification failed.");
  }
}

// -----------------------------------------------------------------------------
// 4. Parse webhook event (main function)
// -----------------------------------------------------------------------------

/**
 * parseWebhookEvent() — verifies and parses Stripe webhook event.
 *
 * This is the main function for webhook processing. It:
 *   1. Extracts raw request body
 *   2. Gets signature from headers
 *   3. Verifies signature
 *   4. Returns parsed event with type safety
 *
 * Usage in API route:
 *   ```ts
 *   export async function POST(req: NextRequest) {
 *     try {
 *       const event = await parseWebhookEvent(req);
 *       // Process event based on event.type
 *     } catch (error) {
 *       return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
 *     }
 *   }
 *   ```
 *
 * @param req - Next.js request object
 * @returns Parsed webhook event
 * @throws Error if signature verification fails
 */
export async function parseWebhookEvent(
  req: NextRequest
): Promise<ParsedWebhookEvent> {
  try {
    // Get signature from headers
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("Missing Stripe webhook signature header.");
    }

    // Get raw request body (CRITICAL for signature verification)
    const rawBody = await getRawBody(req);

    // Verify signature and get event
    const event = await verifyWebhookSignature(rawBody, signature);

    // Return parsed event with type safety
    return {
      id: event.id,
      type: event.type as StripeWebhookEventType,
      created: event.created,
      data: event.data,
      event,
    };
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error) {
      throw new Error(`Webhook verification failed: ${error.message}`);
    }

    throw new Error("Failed to parse webhook event.");
  }
}

// -----------------------------------------------------------------------------
// 5. Helper: Extract Firebase UID from event metadata
// -----------------------------------------------------------------------------

/**
 * extractFirebaseUid() — extracts Firebase UID from webhook event metadata.
 *
 * This helper is used to link Stripe events to Firebase users.
 * The UID is attached to checkout sessions and subscriptions during creation.
 *
 * @param event - Parsed webhook event
 * @returns Firebase UID or null if not found
 */
export function extractFirebaseUid(
  event: ParsedWebhookEvent
): string | null {
  // Try to get UID from event data object metadata
  const metadata =
    (event.data.object as Stripe.Checkout.Session | Stripe.Subscription)
      ?.metadata;

  if (metadata && typeof metadata === "object" && "firebase_uid" in metadata) {
    return String(metadata.firebase_uid);
  }

  return null;
}

// -----------------------------------------------------------------------------
// 6. Helper: Get customer ID from event
// -----------------------------------------------------------------------------

/**
 * extractCustomerId() — extracts Stripe customer ID from webhook event.
 *
 * @param event - Parsed webhook event
 * @returns Stripe customer ID or null if not found
 */
export function extractCustomerId(
  event: ParsedWebhookEvent
): string | null {
  const obj = event.data.object as
    | Stripe.Checkout.Session
    | Stripe.Subscription
    | Stripe.Invoice
    | Stripe.Customer;

  if (typeof obj === "object" && obj !== null) {
    // Checkout session
    if ("customer" in obj && typeof obj.customer === "string") {
      return obj.customer;
    }

    // Subscription or Invoice
    if ("customer" in obj && typeof obj.customer === "object" && obj.customer !== null) {
      const customer = obj.customer as Stripe.Customer;
      return customer.id;
    }

    // Customer object itself
    if ("id" in obj && obj.object === "customer") {
      return obj.id;
    }
  }

  return null;
}

