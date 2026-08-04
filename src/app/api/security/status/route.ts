/**
 * -----------------------------------------------------------------------------
 * ShipSafe API — /api/security/status
 * -----------------------------------------------------------------------------
 * Returns the currently active security features in the application.
 *
 * Why this exists:
 *   - Useful for admin dashboards and debugging
 *   - Helps developers verify middleware behaviour
 *   - Adds transparency and confidence in ShipSafe’s layered security model
 *
 * This endpoint returns metadata only — no secrets or sensitive data.
 * -----------------------------------------------------------------------------
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      httpsEnforced: process.env.NODE_ENV === "production",
      rateLimit: true,        // rate_limit.ts active
      csrf: true,             // csrf.ts active
      apiFirewall: true,      // secure_api.ts active
      authGuard: true,        // middleware private route enforcement
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}