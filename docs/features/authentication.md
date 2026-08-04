# Authentication

Firebase Authentication integration with email/password and Google OAuth for secure user management.

## Overview

ShipSafe uses Firebase Authentication to handle user authentication securely. It supports multiple authentication methods and provides both client-side and server-side utilities for managing user sessions.

**Features:**
- Email/password authentication
- Google OAuth (social login)
- Password reset flow
- Session management with cookies
- Protected routes and API endpoints
- Server-side user verification

## Setup

### 1. Configure Firebase

See [Firebase Setup Guide](./firebase-setup) for complete instructions.

**Required steps:**
1. Create Firebase project
2. Enable Authentication methods (Email/Password, Google)
3. Add Firebase config to `.env.local`
4. Configure OAuth redirect URLs

### 2. Environment Variables

Add to `.env.local`:

```bash
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Firebase Admin (Server-side)
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
```

## Authentication Methods

### Email/Password

Users can sign up and log in with email and password.

**Login Form:**
- Located at `/auth` page
- Email and password fields
- Validation and error handling
- Redirects to dashboard on success

**Signup Form:**
- Located at `/auth` page
- Email, password, and confirm password
- Password strength validation
- Creates new user account

### Google OAuth

Users can sign in with their Google account.

**Setup:**
1. Enable Google provider in Firebase Console
2. Add authorized domains
3. Configure OAuth consent screen (if needed)
4. Test sign-in flow

**User Experience:**
- Click "Sign in with Google" button
- Redirects to Google sign-in
- Returns with authentication token
- Creates account automatically if new user

### Password Reset

Users can request password reset via email.

**Flow:**
1. User clicks "Forgot password?" link
2. Enters email address
3. Receives password reset email
4. Clicks link in email
5. Sets new password

## Client-Side Usage

### useAuth Hook

Use the `useAuth` hook in client components:

```tsx
"use client";

import { useAuth } from "@/lib/firebase/client";

export default function MyComponent() {
  const { user, loading, error, login, logout, signup } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Available Methods

- `user` - Current user object (null if not authenticated)
- `loading` - Boolean indicating auth state loading
- `error` - Error message if authentication fails
- `login(email, password)` - Sign in with email/password
- `logout()` - Sign out current user
- `signup(email, password)` - Create new account
- `resetPassword(email)` - Send password reset email

## Server-Side Usage

### Get Current User

Use `getCurrentUserServer()` in API routes or server components:

```typescript
import { getCurrentUserServer } from "@/lib/firebase/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getCurrentUserServer(req);
  
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // User is authenticated
  return Response.json({ userId: user.uid });
}
```

### Require Authentication

Use `requireAuth()` to throw error if not authenticated:

```typescript
import { requireAuth } from "@/lib/firebase/auth";

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);  // Throws if not authenticated
  
  // User is guaranteed to be authenticated here
  return Response.json({ userId: user.uid });
}
```

## API Routes

### `/api/auth/login`

Handle user login with email/password.

**Request:**
```typescript
POST /api/auth/login
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  user?: { uid: string; email: string };
  error?: string;
}
```

### `/api/auth/signup`

Create new user account.

**Request:**
```typescript
POST /api/auth/signup
{
  email: string;
  password: string;
}
```

### `/api/auth/logout`

Sign out current user and clear session.

**Request:**
```typescript
POST /api/auth/logout
```

### `/api/auth/reset`

Request password reset email.

**Request:**
```typescript
POST /api/auth/reset
{
  email: string;
}
```

### `/api/auth/reset/verify`

Verify password reset token and set new password.

**Request:**
```typescript
POST /api/auth/reset/verify
{
  token: string;
  newPassword: string;
}
```

## Protected Routes

### Middleware Protection

Use Next.js middleware to protect routes automatically:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUserServer } from "@/lib/firebase/auth";

export async function middleware(req: NextRequest) {
  const user = await getCurrentUserServer(req);
  
  if (!user && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
```

See [Protected Pages Tutorial](../tutorials/protected-pages) for detailed examples.

### Component-Level Protection

Protect individual components:

```tsx
"use client";

import { useAuth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

export default function ProtectedComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

## Security Features

- **Secure token storage** - Tokens stored in httpOnly cookies
- **Server-side verification** - All auth checks happen server-side
- **Password hashing** - Handled by Firebase automatically
- **Rate limiting** - Firebase provides built-in protection
- **Email verification** - Optional email verification flow

## Best Practices

1. **Always verify server-side** - Never trust client-side auth state
2. **Use middleware** - Protect routes at the edge for better performance
3. **Handle errors gracefully** - Show user-friendly error messages
4. **Session management** - Use cookies for persistent sessions
5. **Password requirements** - Enforce strong passwords client-side

## Troubleshooting

### "Invalid credentials" error

- Verify email/password are correct
- Check Firebase Authentication is enabled
- Ensure user exists in Firebase Console

### Google OAuth not working

- Verify authorized domains in Firebase Console
- Check OAuth consent screen configuration
- Ensure redirect URLs are correct

### Session not persisting

- Check cookie settings in auth configuration
- Verify domain matches production domain
- Check browser cookie settings

## Learn More

- [Firebase Setup](./firebase-setup) - Configure Firebase
- [Authentication Tutorial](../tutorials/authentication) - Step-by-step guide
- [Protected Pages Tutorial](../tutorials/protected-pages) - Protect routes
- [API Routes Tutorial](../tutorials/api-routes) - Create authenticated APIs

