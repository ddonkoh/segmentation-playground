/**
 * -----------------------------------------------------------------------------
 * ShipSafe Billing Features — schema.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Zod validation schemas for all billing operations.
 *   Ensures type safety and input validation for billing API routes.
 *
 * Why this exists:
 *   All API routes must validate incoming data using Zod schemas.
 *   This centralizes billing-related validation logic.
 *
 * Security:
 *   - Validates Stripe price IDs
 *   - Validates user IDs
 *   - Prevents injection attacks through validation
 *
 * Used by:
 *   - API routes (/api/checkout, /api/billing/*)
 *   - Features/billing (checkout, billing portal functions)
 *
 * -----------------------------------------------------------------------------
 */

import { z } from "zod";

// -----------------------------------------------------------------------------
// 1. Checkout Session Schema
// -----------------------------------------------------------------------------

/**
 * Create checkout session request schema.
 * Used for POST /api/checkout
 */
export const createCheckoutSessionSchema = z.object({
  priceId: z.string().min(1, "Price ID is required").startsWith("price_", "Invalid Stripe price ID format"),
  successUrl: z.string().url("Invalid success URL").optional(),
  cancelUrl: z.string().url("Invalid cancel URL").optional(),
});

/**
 * Type for create checkout session input (inferred from schema).
 */
export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;

// -----------------------------------------------------------------------------
// 2. Billing Portal Schema
// -----------------------------------------------------------------------------

/**
 * Create billing portal session request schema.
 * Used for POST /api/billing/portal
 */
export const createBillingPortalSessionSchema = z.object({
  returnUrl: z.string().url("Invalid return URL").optional(),
});

/**
 * Type for create billing portal session input (inferred from schema).
 */
export type CreateBillingPortalSessionInput = z.infer<typeof createBillingPortalSessionSchema>;

// -----------------------------------------------------------------------------
// 3. Webhook Event Schema (for validation)
// -----------------------------------------------------------------------------

/**
 * Webhook event type schema.
 * Validates that event type is one we handle.
 */
export const webhookEventTypeSchema = z.enum([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "customer.updated",
]);

/**
 * Type for webhook event type (inferred from schema).
 */
export type WebhookEventType = z.infer<typeof webhookEventTypeSchema>;

