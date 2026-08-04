/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/billing/portal
 * -----------------------------------------------------------------------------
 * Create Stripe billing portal session endpoint.
 * Creates a billing portal session for subscription management.
 *
 * Security:
 *   - CSRF protection (middleware)
 *   - Authentication required (verifyAuth)
 *   - Input validation (Zod)
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";
import { createBillingPortalSessionSchema } from "@/features/billing/schema";
import { createBillingPortalSessionForUser } from "@/features/billing/server";

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const user = await requireAuth(req);

    // Parse and validate request body
    const body = await req.json();
    const parsed = createBillingPortalSessionSchema.parse(body);

    // Create billing portal session
    const portalUrl = await createBillingPortalSessionForUser(user.uid, parsed);

    return NextResponse.json(
      {
        success: true,
        data: {
          url: portalUrl,
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

      if (error.message.includes("No Stripe customer")) {
        return NextResponse.json(
          { error: "No Stripe customer found. Please subscribe to a plan first." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Failed to create billing portal session" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

