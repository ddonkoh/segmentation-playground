/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/checkout
 * -----------------------------------------------------------------------------
 * Create Stripe checkout session endpoint.
 * Creates a checkout session for subscription purchase.
 *
 * Security:
 *   - CSRF protection (middleware)
 *   - Authentication optional (works for guests too)
 *   - Input validation (Zod)
 *
 * Note:
 *   - If user is authenticated, email and userId are pre-filled
 *   - If user is not authenticated, they can still checkout (Stripe collects email)
 *   - Webhooks will link the customer to user account after checkout completes
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserServer } from "@/lib/firebase/auth";
import { createCheckoutSessionSchema } from "@/features/billing/schema";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import config from "@/config";

export async function POST(req: NextRequest) {
  try {
    // Get current user (optional - returns null if not authenticated)
    const user = await getCurrentUserServer(req);

    // Parse and validate request body
    const body = await req.json();
    const parsed = createCheckoutSessionSchema.parse(body);

    // Build success and cancel URLs from request
    const origin = req.headers.get("origin") || `http://${config.domainName}`;
    const successUrl = parsed.successUrl || `${origin}/dashboard?checkout=success`;
    const cancelUrl = parsed.cancelUrl || `${origin}/pricing?checkout=cancelled`;

    // Create checkout session (userId is optional)
    // If user is authenticated, we'll attach their UID to metadata
    // If not, Stripe will collect email and we'll link via webhook later
    const session = await createCheckoutSession({
      userId: user?.uid || undefined,
      priceId: parsed.priceId,
      successUrl,
      cancelUrl,
      customerEmail: user?.email || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          url: session.url,
          sessionId: session.sessionId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      // Zod validation error
      if (error.name === "ZodError") {
        return NextResponse.json(
          { error: "Invalid request data", details: error.message },
          { status: 400 }
        );
      }

      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

