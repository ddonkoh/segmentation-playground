/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/auth/signup
 * -----------------------------------------------------------------------------
 * User signup endpoint.
 * Creates new user account in Firebase Auth and Firestore.
 *
 * Security:
 *   - CSRF protection (middleware)
 *   - Rate limiting (middleware)
 *   - Input validation (Zod)
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/features/auth/schema";
import { signupUser } from "@/features/auth/signup";

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const parsed = signupSchema.parse(body);

    // Create user account
    const result = await signupUser(parsed);

    return NextResponse.json(
      {
        success: true,
        data: {
          uid: result.uid,
          email: result.email,
          emailVerified: result.emailVerified,
        },
      },
      { status: 201 }
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

      // Check for specific Firebase errors
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Signup failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

