/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/auth/reset/verify
 * -----------------------------------------------------------------------------
 * Verify password reset code and update password endpoint.
 * Updates user password after verifying reset code.
 *
 * Security:
 *   - CSRF protection (middleware)
 *   - Rate limiting (middleware)
 *   - Input validation (Zod)
 *
 * Note: Password reset verification is typically done client-side with
 * Firebase Auth SDK's confirmPasswordReset(). This endpoint is for
 * server-side password updates if needed.
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyPasswordResetSchema } from "@/features/auth/schema";

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    verifyPasswordResetSchema.parse(body);

    // Note: Firebase Admin SDK doesn't have a direct method to verify reset codes
    // Password reset verification should be done client-side with:
    // import { confirmPasswordReset } from "firebase/auth";
    // await confirmPasswordReset(auth, parsed.oobCode, parsed.newPassword);
    //
    // This endpoint can be used for server-side password updates if needed
    // but would require the user's email or UID

    return NextResponse.json(
      {
        error:
          "Password reset verification should be done client-side with Firebase Auth SDK. Use confirmPasswordReset() from firebase/auth.",
      },
      { status: 400 }
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

      return NextResponse.json(
        { error: error.message || "Password reset failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

