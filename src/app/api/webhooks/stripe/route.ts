/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/webhooks/stripe
 * -----------------------------------------------------------------------------
 * Stripe webhook endpoint.
 * Handles Stripe webhook events and syncs subscription data.
 *
 * Security:
 *   - Webhook signature verification (no CSRF - webhooks bypass CSRF)
 *   - Raw body required for signature verification
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";
import { parseWebhookEvent } from "@/lib/stripe/webhook";
import { handleWebhookEvent } from "@/features/billing/webhook";

export async function POST(req: NextRequest) {
  try {
    // Parse and verify webhook event
    // This function verifies the Stripe signature
    const event = await parseWebhookEvent(req);

    // Handle webhook event
    const result = await handleWebhookEvent(event);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
        },
        { status: 200 }
      );
    } else {
      // Log error but return 200 to Stripe (prevents retries)
      console.error("Webhook handling failed:", result.message);
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    // Log error for debugging
    console.error("Webhook error:", error);

    // Return 400 to Stripe if signature verification failed
    if (error instanceof Error && error.message.includes("verification")) {
      return NextResponse.json(
        { error: "Webhook verification failed" },
        { status: 400 }
      );
    }

    // Return 200 for other errors (prevents Stripe from retrying)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 200 }
    );
  }
}

