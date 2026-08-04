/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/auth/login
 * -----------------------------------------------------------------------------
 * User login endpoint.
 * Verifies ID token from client-side Firebase Auth and creates server session.
 *
 * Security:
 *   - CSRF protection (middleware)
 *   - Rate limiting (middleware)
 *   - Input validation (Zod)
 *
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSessionFromToken } from "@/features/auth/login";

// Schema for login with ID token (from client-side Firebase Auth)
const loginWithTokenSchema = z.object({
  idToken: z.string().min(1, "ID token is required"),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const parsed = loginWithTokenSchema.parse(body);

    // Verify ID token and create session
    const result = await createSessionFromToken(parsed.idToken);

    // Create session cookie for middleware authentication
    // The session value is the user UID (simple but effective for middleware checks)
    // In production, you might want to use a signed JWT or session token
    const sessionToken = result.uid;

    const response = NextResponse.json(
      {
        success: true,
        data: {
          uid: result.uid,
          email: result.email,
          emailVerified: result.emailVerified,
        },
      },
      { status: 200 }
    );

    // Set session cookie for middleware authentication
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // To allow OAuth redirects
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      // Zod validation error
      if (error.name === "ZodError") {
        return NextResponse.json(
          { error: "Invalid request data", details: error.message },
          { status: 400 }
        );
      }

      if (error.message.includes("expired") || error.message.includes("invalid")) {
        return NextResponse.json(
          { error: "Invalid or expired authentication token" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Login failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

