/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/auth/reset
 * -----------------------------------------------------------------------------
 * Send password reset email endpoint.
 * Generates password reset link and sends email.
 *
 * Security:
 *   - CSRF protection (middleware)
 *   - Rate limiting (middleware)
 *   - Input validation (Zod)
 *   - Email enumeration prevention
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetSchema } from "@/features/auth/schema";
import { sendPasswordResetEmail } from "@/features/auth/send-reset";

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const parsed = sendPasswordResetSchema.parse(body);

    // Send password reset email
    const result = await sendPasswordResetEmail(parsed.email);

    // Always return success to prevent email enumeration
    return NextResponse.json(
      {
        success: true,
        message: result.message,
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

      // Always return success to prevent email enumeration
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account exists, a password reset email has been sent.",
        },
        { status: 200 }
      );
    }

    // Always return success to prevent email enumeration
    return NextResponse.json(
      {
        success: true,
        message: "If an account exists, a password reset email has been sent.",
      },
      { status: 200 }
    );
  }
}

