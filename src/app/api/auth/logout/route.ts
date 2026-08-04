/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/auth/logout
 * -----------------------------------------------------------------------------
 * User logout endpoint.
 * Revokes user sessions and clears authentication state.
 *
 * Security:
 *   - CSRF protection (middleware)
 *   - Authentication required (verifyAuth)
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";
import { logoutUser } from "@/features/auth/logout";

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const user = await requireAuth(req);

    // Revoke user sessions
    await logoutUser(user.uid);

    // Clear session cookie (if using cookies)
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear any auth cookies
    response.cookies.delete("session");
    response.cookies.delete("firebase_token");

    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Logout failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

