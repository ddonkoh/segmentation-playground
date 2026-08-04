/**
 * -----------------------------------------------------------------------------
 * ShipSafe Models — plan.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Subscription plan type definitions and validation schemas.
 *   Defines plan structure, pricing, and features.
 *
 * Why this exists:
 *   Plans are configured in config.ts, but this file provides:
 *     - TypeScript types for type safety
 *     - Zod schemas for validation
 *     - Plan-related utilities
 *
 * Used by:
 *   - Features/billing (plan selection, checkout)
 *   - Components (pricing display)
 *   - API routes (plan validation)
 *
 * -----------------------------------------------------------------------------
 */

import { z } from "zod";

// -----------------------------------------------------------------------------
// 1. Plan Feature
// -----------------------------------------------------------------------------

/**
 * Plan feature definition.
 */
export interface PlanFeature {
  /**
   * Feature name/description
   */
  name: string;

  /**
   * Optional feature description (longer text)
   */
  description?: string;

  /**
   * Whether this feature is included (default: true)
   */
  included?: boolean;
}

// -----------------------------------------------------------------------------
// 2. Plan Interface
// -----------------------------------------------------------------------------

/**
 * Subscription plan definition.
 * Matches the structure in config.ts.
 */
export interface Plan {
  /**
   * Stripe price ID (from environment variables)
   * Required for checkout session creation
   */
  priceId: string;

  /**
   * Plan display name
   */
  name: string;

  /**
   * Plan description
   */
  description: string;

  /**
   * Monthly price in USD (display price)
   */
  price: number;

  /**
   * Optional original/crossed-out price (for discounts)
   */
  priceAnchor?: number;

  /**
   * List of features included in this plan
   */
  features: PlanFeature[];

  /**
   * Whether this plan is featured/highlighted
   * Only one plan should be featured
   */
  isFeatured?: boolean;
}

// -----------------------------------------------------------------------------
// 3. Zod Schemas
// -----------------------------------------------------------------------------

/**
 * Zod schema for plan feature validation.
 */
export const planFeatureSchema = z.object({
  name: z.string().min(1, "Feature name is required"),
  description: z.string().optional(),
  included: z.boolean().optional().default(true),
});

/**
 * Zod schema for plan validation.
 */
export const planSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
  name: z.string().min(1, "Plan name is required"),
  description: z.string().min(1, "Plan description is required"),
  price: z.number().positive("Price must be positive"),
  priceAnchor: z.number().positive().optional(),
  features: z.array(planFeatureSchema).min(1, "Plan must have at least one feature"),
  isFeatured: z.boolean().optional().default(false),
});

// -----------------------------------------------------------------------------
// 4. Plan Utilities
// -----------------------------------------------------------------------------

/**
 * Format price for display (e.g., "$99" or "$99/month").
 *
 * @param price - Price in USD
 * @param showPeriod - Whether to append "/month"
 * @returns Formatted price string
 */
export function formatPlanPrice(price: number, showPeriod: boolean = true): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return showPeriod ? `${formatted}/month` : formatted;
}

/**
 * Calculate discount percentage (if priceAnchor is set).
 *
 * @param price - Current price
 * @param priceAnchor - Original price
 * @returns Discount percentage (0-100) or null if no discount
 */
export function calculateDiscount(
  price: number,
  priceAnchor?: number
): number | null {
  if (!priceAnchor || priceAnchor <= price) {
    return null;
  }

  const discount = ((priceAnchor - price) / priceAnchor) * 100;
  return Math.round(discount);
}

/**
 * Validate plan configuration.
 *
 * @param plan - Plan to validate
 * @returns Validation result
 */
export function validatePlan(plan: unknown): { success: boolean; error?: string } {
  try {
    planSchema.parse(plan);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", "),
      };
    }
    return { success: false, error: "Invalid plan configuration" };
  }
}

// -----------------------------------------------------------------------------
// 5. Type Exports
// -----------------------------------------------------------------------------

/**
 * Type for plan feature (inferred from schema).
 */
export type PlanFeatureType = z.infer<typeof planFeatureSchema>;

/**
 * Type for plan (inferred from schema).
 */
export type PlanType = z.infer<typeof planSchema>;

