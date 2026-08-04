/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/billing/subscription
 * -----------------------------------------------------------------------------
 * Get user subscription status endpoint.
 * Returns current subscription information for authenticated user.
 *
 * Security:
 *   - Authentication required (requireAuth)
 *   - CSRF protection (middleware)
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";
import { getUserSubscriptionStatus } from "@/features/billing/server";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const user = await requireAuth(req);

    // Get subscription status
    const subscription = await getUserSubscriptionStatus(user.uid);

    if (!subscription) {
      return NextResponse.json(
        {
          success: true,
          data: null,
        },
        { status: 200 }
      );
    }

    // Get additional subscription details from Firestore if available
    const { getFirestoreInstance } = await import("@/lib/firebase/init");
    const firestore = getFirestoreInstance();
    
    let amountTotal: number | null = null;
    let currency: string | null = null;
    
    try {
      const subDoc = await firestore
        .collection("subscriptions")
        .doc(subscription.subscriptionId)
        .get();
      
      if (subDoc.exists && subDoc.data()) {
        const data = subDoc.data()!;
        // Get amount and currency from Firestore document
        amountTotal = data.amountTotal || null;
        currency = data.currency || null;
      }
    } catch (error) {
      // If Firestore lookup fails, continue without amount/currency
      console.warn("Failed to get subscription amount from Firestore:", error);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          subscriptionId: subscription.subscriptionId,
          customerId: subscription.customerId,
          status: subscription.status,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          priceId: subscription.priceId,
          productId: subscription.productId,
          amountTotal,
          currency,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      if (error.message.includes("not found")) {
        return NextResponse.json(
          {
            success: true,
            data: null,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Failed to get subscription status" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

