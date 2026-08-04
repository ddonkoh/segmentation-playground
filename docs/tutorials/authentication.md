# Authentication Tutorial

Complete guide to implementing user authentication with Firebase Authentication in ShipSafe.

## Overview

ShipSafe uses Firebase Authentication for secure user management. This tutorial covers:

- **Email/password authentication** - Traditional signup and login
- **Google OAuth** - Social login option
- **Protected routes** - Securing pages with authentication
- **Session management** - Handling user sessions
- **User data access** - Getting user information in components

## Architecture

### Authentication Flow

```
User → Client Component → Firebase Auth (Client SDK) → ID Token → API Route → Server Verification → Session
```

**Key Points:**
- **Client-side:** Firebase Client SDK handles login/signup
- **Server-side:** Firebase Admin SDK verifies tokens
- **Session:** ID tokens stored in client, verified on each request

## Setup

### 1. Configure Firebase

See [Firebase Setup Guide](../features/firebase-setup) for complete instructions.

**Required:**
- Firebase project created
- Authentication enabled (Email/Password, Google optional)
- Environment variables configured

### 2. Environment Variables

Add to `.env.local`:

```bash
# Firebase Client Config (public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Firebase Admin Config (server-only)
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
```

## Email/Password Authentication

### Signup Flow

**Step 1:** User fills out signup form
**Step 2:** Form validates input client-side
**Step 3:** API route creates user in Firebase Auth
**Step 4:** User document created in Firestore
**Step 5:** User redirected to dashboard

#### Using SignupForm Component

The `SignupForm` component handles signup:

```tsx
import SignupForm from "@/components/forms/SignupForm";

// In your auth page
<SignupForm
  onSuccess={() => {
    router.push("/dashboard");
  }}
/>
```

**Location:** `src/components/forms/SignupForm.tsx`

#### Custom Signup Implementation

If you need custom signup logic:

```tsx
"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { signupSchema } from "@/features/auth/schema";

function CustomSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const data = signupSchema.parse({ email, password, displayName: "User" });

      // Call signup API
      const response = await apiPost("/api/auth/signup", data);

      if (response.success) {
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      // Handle error
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Login Flow

**Step 1:** User enters email/password
**Step 2:** Form validates input
**Step 3:** API route verifies credentials
**Step 4:** Session created (ID token stored)
**Step 5:** User redirected to dashboard

#### Using LoginForm Component

The `LoginForm` component handles login:

```tsx
import LoginForm from "@/components/forms/LoginForm";

// In your auth page
<LoginForm
  onSuccess={() => {
    router.push("/dashboard");
  }}
/>
```

**Location:** `src/components/forms/LoginForm.tsx`

#### Custom Login Implementation

```tsx
"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

function CustomLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiPost("/api/auth/login", {
        email,
        password,
      });

      if (response.success) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Google OAuth (Optional)

### Setup

1. **Enable Google provider** in Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable Google
   - Configure OAuth consent screen

2. **Add authorized domains** in Firebase Console

3. **Create Google Sign-In button:**

```tsx
"use client";

import { getAuthInstance } from "@/lib/firebase/client";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function GoogleSignIn() {
  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuthInstance();
      const provider = new GoogleAuthProvider();

      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get ID token
      const idToken = await user.getIdToken();

      // Send to server to create session
      await apiPost("/api/auth/login", {
        idToken,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
}
```

## Protected Routes

### Middleware Protection

ShipSafe uses Next.js middleware to protect routes automatically.

**Protected routes** (defined in `middleware.ts`):
- `/dashboard/*` - All dashboard pages
- `/api/protected/*` - Protected API routes

**How it works:**
- Middleware checks for authentication
- Redirects to `/auth` if not authenticated
- Allows access if authenticated

### Creating Protected Pages

#### Server Component

```tsx
import { getCurrentUserServer } from "@/lib/firebase/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ProtectedPage() {
  // Get request headers (Next.js App Router)
  const headersList = await headers();
  
  // Create request-like object for auth check
  // Note: In a real implementation, you'd need to pass the actual request
  // For now, check authentication client-side or use middleware

  // Redirect if not authenticated
  // (Middleware handles this automatically, but you can add additional checks)

  return (
    <div>
      <h1>Protected Content</h1>
      <p>This page requires authentication.</p>
    </div>
  );
}
```

#### Client Component

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthInstance } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuthInstance();

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Not authenticated, redirect to login
        router.push("/auth");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>Protected content here.</p>
    </div>
  );
}
```

### Using Dashboard Layout

The dashboard layout automatically protects all routes under `/dashboard`:

```tsx
// src/app/dashboard/layout.tsx
// Already configured - just create pages under /dashboard
```

**Example:**

```tsx
// src/app/dashboard/settings/page.tsx
export default function SettingsPage() {
  // This page is automatically protected by middleware
  // No additional auth check needed

  return (
    <div>
      <h1>Settings</h1>
      <p>This page is protected.</p>
    </div>
  );
}
```

## Accessing User Data

### In Server Components

For server components, use the API route to get user data:

```tsx
// Server Component
async function getUserData() {
  // Fetch from API route
  const response = await fetch("/api/user/me", {
    headers: {
      Authorization: `Bearer ${idToken}`, // Get token from client
    },
  });

  const data = await response.json();
  return data.data;
}
```

**Note:** Server Components in Next.js App Router don't have direct request access. Use API routes or client components for auth checks.

### In Client Components

```tsx
"use client";

import { useState, useEffect } from "react";
import { getAuthInstance } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { apiGet } from "@/lib/api";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthInstance();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get full user data from API
        try {
          const response = await apiGet("/api/user/me");
          if (response.success && response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>{user.displayName || user.email}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

## Logout

### Using API Route

```tsx
"use client";

import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { getAuthInstance } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";

async function handleLogout() {
  try {
    // Sign out from Firebase (client-side)
    const auth = getAuthInstance();
    await signOut(auth);

    // Call logout API (server-side cleanup)
    await apiPost("/api/auth/logout");

    // Redirect to home
    router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
```

## Password Reset

### Request Reset

```tsx
"use client";

import { apiPost } from "@/lib/api";
import { sendPasswordResetSchema } from "@/features/auth/schema";

async function requestPasswordReset(email: string) {
  try {
    // Validate email
    const data = sendPasswordResetSchema.parse({ email });

    // Send reset request
    const response = await apiPost("/api/auth/reset", data);

    if (response.success) {
      alert("Password reset email sent!");
    }
  } catch (error) {
    console.error("Password reset failed:", error);
  }
}
```

### Verify Reset Code

```tsx
"use client";

import { apiPost } from "@/lib/api";
import { verifyPasswordResetSchema } from "@/features/auth/schema";

async function resetPassword(oobCode: string, newPassword: string) {
  try {
    // Validate input
    const data = verifyPasswordResetSchema.parse({
      oobCode,
      newPassword,
    });

    // Verify and reset password
    const response = await apiPost("/api/auth/reset/verify", data);

    if (response.success) {
      alert("Password reset successful! Please sign in.");
      router.push("/auth");
    }
  } catch (error) {
    console.error("Password reset verification failed:", error);
  }
}
```

## API Routes

### Protected API Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication (throws if not authenticated)
    const user = await requireAuth(req);

    // User is authenticated, proceed with logic
    return NextResponse.json({
      success: true,
      data: {
        message: `Hello, ${user.email}!`,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
```

### Optional Authentication

```typescript
import { getCurrentUserServer } from "@/lib/firebase/auth";

export async function GET(req: NextRequest) {
  // Get user (returns null if not authenticated)
  const user = await getCurrentUserServer(req);

  if (user) {
    // User is authenticated - show personalized content
    return NextResponse.json({
      success: true,
      data: { personalized: true, user: user.email },
    });
  }

  // User is not authenticated - show public content
  return NextResponse.json({
    success: true,
    data: { personalized: false },
  });
}
```

## Best Practices

### 1. Always Validate Input

Use Zod schemas for all inputs:

```typescript
import { loginSchema } from "@/features/auth/schema";

const data = loginSchema.parse(req.body);
```

### 2. Handle Errors Gracefully

```typescript
try {
  // Auth operation
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("auth/invalid-email")) {
      return { error: "Invalid email address" };
    }
    // Handle other Firebase errors
  }
}
```

### 3. Check Authentication State

Always check if user is authenticated before showing protected content:

```tsx
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });
  return () => unsubscribe();
}, []);
```

### 4. Protect Sensitive Operations

Always verify authentication server-side:

```typescript
// ✅ Good: Verify on server
const user = await requireAuth(req);

// ❌ Bad: Trust client-side auth state only
// Always verify server-side for sensitive operations
```

## Troubleshooting

### "Unauthorized" Error

- Check if user is authenticated (token present)
- Verify token hasn't expired
- Check Firebase Admin SDK configuration

### Redirect Loop

- Verify middleware configuration
- Check auth state in client components
- Ensure redirect URLs are correct

### Token Expired

- Tokens expire after 1 hour
- Implement token refresh logic
- Handle expired tokens gracefully

## Learn More

- [Authentication Features](../features/authentication) - Complete auth guide
- [Firebase Setup](../features/firebase-setup) - Firebase configuration
- [Protected Pages Tutorial](./protected-pages) - Securing routes
- [API Routes Tutorial](./api-routes) - Creating authenticated endpoints
