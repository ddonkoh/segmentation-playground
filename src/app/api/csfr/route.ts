/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/csrf
 * -----------------------------------------------------------------------------
 * Returns the readable CSRF token for client-side usage.
 *
 * Why this exists:
 *   - Browsers cannot access httpOnly cookies
 *   - Client JS needs a way to retrieve a CSRF token it can send as a header
 *   - This endpoint exposes only the *client-readable* version of the token
 *
 * Notes:
 *   - This endpoint does NOT generate tokens (middleware handles that)
 *   - Safe to expose — the attacker still cannot forge the httpOnly version
 * -----------------------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";

const CSRF_COOKIE_JS = "csrf_token_client";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(CSRF_COOKIE_JS)?.value || null;

  return NextResponse.json(
    { csrfToken: token },
    { status: 200 }
  );
}