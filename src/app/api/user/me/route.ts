/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/user/me
 * -----------------------------------------------------------------------------
 * Get current user endpoint.
 * Returns authenticated user information.
 *
 * Security:
 *   - Authentication required (verifyAuth)
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";
import { getFirestoreInstance } from "@/lib/firebase/init";
import { userFromFirestore } from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const user = await requireAuth(req);

    // Get user document from Firestore
    const firestore = getFirestoreInstance();
    const userDoc = await firestore.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Convert Firestore document to User object
    const docData = userDoc.data();
    if (!docData) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    const userData = userFromFirestore({
      uid: user.uid,
      email: docData.email || user.email || "",
      displayName: docData.displayName ?? null,
      photoURL: docData.photoURL ?? null,
      emailVerified: docData.emailVerified ?? false,
      stripeCustomerId: docData.stripeCustomerId ?? null,
      subscriptionId: docData.subscriptionId ?? null,
      subscriptionStatus: docData.subscriptionStatus ?? null,
      createdAt: docData.createdAt || new Date(),
      updatedAt: docData.updatedAt || new Date(),
      lastSignInAt: docData.lastSignInAt ?? null,
      disabled: docData.disabled ?? false,
    });

    // Get role from custom claims (not from Firestore)
    const role = (user.customClaims?.role as string) || "user";

    // Return safe user data (no sensitive information)
    return NextResponse.json(
      {
        success: true,
        data: {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          emailVerified: userData.emailVerified,
          role,
          createdAt: userData.createdAt,
          lastSignInAt: userData.lastSignInAt,
          subscriptionId: userData.subscriptionId,
          subscriptionStatus: userData.subscriptionStatus,
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

      return NextResponse.json(
        { error: error.message || "Failed to get user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

