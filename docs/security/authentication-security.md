# Authentication Security

Complete guide to authentication security in ShipSafe, explaining secure patterns and showcasing Firebase token verification implementation.

## Overview

ShipSafe uses Firebase Authentication with secure server-side token verification, custom claims for role-based access, and defense-in-depth security patterns.

**Security Principles:**
- ✅ **Server-side verification** - All tokens verified using Admin SDK
- ✅ **Token expiration** - Tokens expire automatically
- ✅ **Custom claims** - Role-based access control
- ✅ **Secure storage** - No sensitive data in client
- ✅ **Session management** - Secure session handling

## Concept: Token-Based Authentication

### How Firebase Authentication Works

1. **Client Authentication:** User signs in via Firebase Client SDK
2. **ID Token:** Firebase issues signed ID token
3. **Token Transmission:** Client sends token with requests
4. **Server Verification:** Server verifies token using Admin SDK
5. **Authorization:** Server checks roles/permissions from token

### Why Server-Side Verification Matters

**Client-side tokens can be:**
- ✅ Verified but not trusted alone
- ✅ Expired or revoked
- ✅ Tampered with (signature invalidates them)
- ❌ Used without server verification (security risk)

**Server-side verification ensures:**
- ✅ Token signature is valid
- ✅ Token hasn't expired
- ✅ Token hasn't been revoked
- ✅ User claims are authentic

## Implementation: Token Verification

### Code Showcase

**Location:** `src/lib/firebase/auth.ts`

```typescript
/**
 * Server-Side Authentication - Token verification using Firebase Admin SDK
 */

import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "./init";

// Server-side guard - prevent client-side usage
if (typeof window !== "undefined") {
  throw new Error(
    "❌ Firebase auth helpers cannot be used in client-side code. " +
      "Use @/lib/firebase/client.ts for client authentication."
  );
}

// Extract ID token from request
function extractIdToken(req: NextRequest): string | null {
  // Method 1: Authorization header (recommended)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Method 2: Cookie (fallback)
  const tokenCookie = req.cookies.get("firebase_token")?.value;
  if (tokenCookie) {
    return tokenCookie;
  }

  return null;
}

// Verify ID token using Firebase Admin SDK
export async function verifyIdToken(token: string): Promise<DecodedIdToken> {
  try {
    const adminAuth = getAuth(getAdminApp());
    
    // Verify token signature and expiration
    // true = check token revocation
    const decodedToken = await adminAuth.verifyIdToken(token, true);

    return decodedToken as DecodedIdToken;
  } catch (error) {
    // Provide safe error messages (don't leak secrets)
    if (error instanceof Error) {
      if (error.message.includes("expired")) {
        throw new Error("Authentication token has expired. Please sign in again.");
      }
      if (error.message.includes("revoked")) {
        throw new Error("Authentication token has been revoked. Please sign in again.");
      }
      if (error.message.includes("invalid")) {
        throw new Error("Invalid authentication token.");
      }
    }

    throw new Error("Failed to verify authentication token.");
  }
}

// Get authenticated user from request (main helper)
export async function getCurrentUserServer(
  req: NextRequest
): Promise<AuthenticatedUser | null> {
  try {
    // 1. Extract token from request
    const token = extractIdToken(req);
    if (!token) {
      return null; // No token provided
    }

    // 2. Verify token signature and expiration
    const decodedToken = await verifyIdToken(token);

    // 3. Transform to authenticated user object
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      emailVerified: decodedToken.email_verified || false,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null,
      customClaims: extractCustomClaims(decodedToken), // Roles, permissions
    };
  } catch (error) {
    // Return null on any error (invalid, expired, revoked)
    return null;
  }
}

// Require authentication (throws if not authenticated)
export async function requireAuth(req: NextRequest): Promise<AuthenticatedUser> {
  const user = await getCurrentUserServer(req);

  if (!user) {
    throw new Error("Unauthorized: Authentication required.");
  }

  return user;
}
```

### API Route Usage

```typescript
// src/app/api/user/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication (throws if not authenticated)
    const user = await requireAuth(req);

    // User is authenticated - proceed
    return NextResponse.json({
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        role: user.customClaims?.role,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    // Handle other errors...
  }
}
```

## Middleware Authentication Patterns

ShipSafe's middleware implements smart authentication handling that differentiates between API routes and page routes:

### API Routes: Return 401 Unauthorized

**For API routes** (`/api/*`), middleware returns `401 Unauthorized` (JSON response):

```typescript
// middleware.ts
if (isProtected && !session && path.startsWith("/api")) {
  logSecurityEvent(req, "api_auth_required");
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
```

**Why 401 for APIs?**
- ✅ API clients expect proper HTTP status codes (not redirects)
- ✅ Allows programmatic error handling
- ✅ Follows REST API conventions
- ✅ Enables proper error responses in JSON format

**Example API Response:**
```json
{
  "error": "Unauthorized"
}
```
Status: `401 Unauthorized`

### Page Routes: Redirect to Auth

**For page routes** (non-API), middleware redirects to `/auth`:

```typescript
// middleware.ts
if (isProtected && !session && !path.startsWith("/api")) {
  url.pathname = "/auth";
  url.searchParams.set("from", path); // Preserve intended destination
  logSecurityEvent(req, "auth_redirect");
  return NextResponse.redirect(url);
}
```

**Why redirect for pages?**
- ✅ Better user experience (seamless redirect)
- ✅ Preserves intended destination (`?from=/dashboard`)
- ✅ Allows automatic redirect after login
- ✅ Follows web application conventions

**Example Redirect:**
```
GET /dashboard (no session)
→ Redirect to /auth?from=/dashboard
→ After login, redirect back to /dashboard
```

### Excluded Routes

Certain routes are excluded from authentication requirements:

- ✅ **Webhook routes** (`/api/webhooks/*`) - Use signature verification
- ✅ **Auth API routes** (`/api/auth/*`) - Handle their own authentication
- ✅ **Public API routes** (`/api/csrf`, `/api/security/status`) - Intentionally public

**Why exclusions?**
- Webhooks can't include session cookies (external services)
- Auth endpoints need to handle login/signup flows
- Public endpoints provide system status information

### Complete Middleware Pattern

```typescript
// middleware.ts - Authentication Guard
const session = req.cookies.get("session")?.value;

// Identify excluded routes
const isWebhook = path.startsWith("/api/webhooks/");
const isAuthApi = path.startsWith("/api/auth/");
const isPublicApi = path.startsWith("/api/csrf") || 
                    path.startsWith("/api/security/status");

// Check if route requires authentication
const isProtected = PROTECTED_ROUTES.some((r) => path.startsWith(r));

// Apply authentication guard
if (isProtected && !session && !isWebhook && !isAuthApi && !isPublicApi) {
  // API routes: Return 401
  if (path.startsWith("/api")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Page routes: Redirect to auth
  url.pathname = "/auth";
  url.searchParams.set("from", path);
  return NextResponse.redirect(url);
}
```

## Concept: Custom Claims & Role-Based Access

### What are Custom Claims?

Custom claims are additional data attached to Firebase ID tokens:
- **Roles** - User role (admin, user, premium, etc.)
- **Permissions** - Feature access flags
- **Metadata** - Additional user attributes

**Benefits:**
- ✅ Stored in token (no database lookup needed)
- ✅ Automatically verified with token
- ✅ Cannot be tampered with (signed by Firebase)

### How ShipSafe Uses Custom Claims

**Setting Custom Claims:**

```typescript
// src/lib/firebase/admin.ts
import { getAuth } from "firebase-admin/auth";

export async function setCustomClaims(
  uid: string,
  claims: Record<string, unknown>
): Promise<void> {
  const adminAuth = getAuth(getAdminApp());
  
  // Set custom claims on user
  await adminAuth.setCustomUserClaims(uid, claims);
  
  // User must refresh ID token to get updated claims
}
```

**Example: Setting User Role**

```typescript
// When user subscribes to premium plan
await setCustomClaims(userId, {
  role: "premium",
  subscriptionStatus: "active",
  planId: "plan_premium",
});
```

**Accessing Custom Claims:**

```typescript
// In API route
const user = await requireAuth(req);
const role = user.customClaims?.role; // "premium"
const subscriptionStatus = user.customClaims?.subscriptionStatus; // "active"
```

## Secure Authentication Patterns

### Pattern 1: Protected API Route

```typescript
// src/app/api/protected/route.ts
import { requireAuth } from "@/lib/firebase/auth";

export async function POST(req: NextRequest) {
  try {
    // Must be authenticated
    const user = await requireAuth(req);

    // Access user data
    const { uid, email, customClaims } = user;
    const role = customClaims?.role;

    // Check authorization
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Proceed with admin-only logic
    return NextResponse.json({ success: true });
  } catch (error) {
    // Handle auth errors
  }
}
```

### Pattern 2: Optional Authentication

```typescript
// src/app/api/public/route.ts
import { getCurrentUserServer } from "@/lib/firebase/auth";

export async function GET(req: NextRequest) {
  // Optional authentication
  const user = await getCurrentUserServer(req);

  if (user) {
    // Authenticated user - personalized content
    return NextResponse.json({
      personalized: true,
      userEmail: user.email,
    });
  }

  // Not authenticated - public content
  return NextResponse.json({
    personalized: false,
  });
}
```

### Pattern 3: Role-Based Authorization

```typescript
// src/app/api/admin/users/route.ts
export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  
  // Check role from custom claims
  const role = user.customClaims?.role;
  
  if (role !== "admin" && role !== "moderator") {
    return NextResponse.json(
      { error: "Forbidden: Insufficient permissions" },
      { status: 403 }
    );
  }

  // Authorized - proceed
  // ...
}
```

## Token Security Features

### 1. Token Expiration

Firebase ID tokens expire after 1 hour:

```typescript
// Token automatically expires
{
  exp: 1234567890,  // Expiration timestamp
  iat: 1234564290,  // Issued at
}
```

**Handling:**
- Client refreshes token automatically
- Server rejects expired tokens
- User re-authenticates if refresh fails

### 2. Token Revocation

Tokens can be revoked (e.g., after password reset):

```typescript
// Verify with revocation check
const decodedToken = await adminAuth.verifyIdToken(token, true);
// true = check if token was revoked
```

### 3. Token Signature Verification

Tokens are cryptographically signed by Firebase:

```typescript
// Signature automatically verified by Admin SDK
const decodedToken = await adminAuth.verifyIdToken(token);
// ✅ Throws error if signature invalid
```

**What This Prevents:**
- Token tampering
- Forged tokens
- Replay attacks

## Best Practices

### 1. Always Verify Server-Side

✅ **Do:**
```typescript
// Verify token on server
const user = await requireAuth(req);
```

❌ **Don't:**
```typescript
// Trust client-side auth state alone
// Always verify server-side for sensitive operations
```

### 2. Use Custom Claims for Authorization

✅ **Do:**
```typescript
const role = user.customClaims?.role;
if (role !== "admin") {
  return forbidden();
}
```

❌ **Don't:**
```typescript
// Don't trust client-provided role
const role = req.body.role; // ❌ Can be forged
```

### 3. Handle Token Errors Gracefully

✅ **Do:**
```typescript
try {
  const user = await requireAuth(req);
} catch (error) {
  if (error.message.includes("Unauthorized")) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }
}
```

### 4. Never Expose Admin SDK

✅ **Do:**
- Keep Admin SDK server-side only
- Use client SDK for client authentication
- Verify tokens server-side

❌ **Don't:**
- Import Admin SDK in client components
- Expose private keys to client
- Trust client-side auth state for authorization

## Security Flow

### Complete Authentication Flow

The authentication flow in ShipSafe follows a secure, token-based pattern:

**Client-Side (Browser):**

1. **User Signs In** - User provides credentials via Firebase Client SDK
2. **Firebase Authenticates** - Firebase validates credentials
3. **ID Token Issued** - Firebase issues a signed JWT ID token
4. **Token Stored** - Client stores token securely (memory or session storage)
5. **API Request** - Client includes token in `Authorization: Bearer <token>` header

**Server-Side (API Route):**

6. **Token Extraction** - Server extracts token from request headers
7. **Signature Verification** - Server verifies token signature using Firebase Admin SDK
8. **Expiration Check** - Server validates token hasn't expired
9. **Revocation Check** - Server checks if token has been revoked
10. **Claims Extraction** - Server extracts user ID and custom claims (roles, permissions)
11. **Authorization** - Server checks if user has required permissions
12. **Request Processed** - If authorized, request is processed; otherwise, 403 Forbidden

**Security Guarantees:**

- ✅ Token signature cannot be forged (cryptographically signed)
- ✅ Expired tokens are automatically rejected
- ✅ Revoked tokens are immediately invalid
- ✅ Custom claims are verified server-side
- ✅ No sensitive data exposed to client

### Example: Authenticated Request

```http
POST /api/user/update
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
x-csrf-token: abc123...

{
  "displayName": "New Name"
}
```

**Server Processing:**

```typescript
// 1. Extract token from Authorization header
const token = extractIdToken(request);

// 2. Verify token signature using Admin SDK
const decodedToken = await adminAuth.verifyIdToken(token, true);
// ✅ Signature valid
// ✅ Not expired
// ✅ Not revoked

// 3. Extract user information
const user = {
  uid: decodedToken.uid,
  email: decodedToken.email,
  role: decodedToken.role, // Custom claim
};

// 4. Authorize based on role/permissions
if (user.role !== "admin") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// 5. Process authorized request
// ✅ Request processed successfully
```

## Token Storage Security

### Client-Side Storage Options

**Option 1: Memory Only (Most Secure)**
```typescript
// Token stored only in memory (cleared on refresh)
let authToken: string | null = null;
```

**Option 2: Session Storage**
```typescript
// Token cleared when tab closes
sessionStorage.setItem("token", token);
```

**Option 3: Local Storage (Less Secure)**
```typescript
// Token persists across sessions
localStorage.setItem("token", token);
```

**ShipSafe Recommendation:**
- Store tokens in memory or session storage
- Avoid localStorage for sensitive tokens
- Use httpOnly cookies for session tokens (if needed)

## Troubleshooting

### Token Expired Error

**Problem:** "Authentication token has expired"

**Solution:**
- Client should refresh token automatically
- Implement token refresh logic
- Redirect to login if refresh fails

### Token Invalid Error

**Problem:** "Invalid authentication token"

**Solutions:**
1. Verify token is being sent correctly
2. Check token hasn't been tampered with
3. Ensure Admin SDK is configured correctly
4. Verify Firebase project configuration

### Custom Claims Not Updating

**Problem:** Custom claims not appearing in token

**Solutions:**
1. User must refresh ID token after claims are set
2. Call `getIdToken(true)` to force refresh
3. Wait for token refresh (claims propagate within minutes)

## Learn More

- [Authentication Features](../features/authentication) - Complete auth guide
- [Authentication Tutorial](../tutorials/authentication) - Implementation tutorial
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth) - Official docs
