# Protected Pages Tutorial

Complete guide to protecting pages and routes with authentication in ShipSafe.

## Overview

ShipSafe provides multiple ways to protect pages and routes. This tutorial covers:

- **Middleware protection** - Automatic route protection
- **Server component protection** - Server-side auth checks
- **Client component protection** - Client-side auth state
- **Layout protection** - Protecting entire route groups

## How Protection Works

### Middleware-Based Protection

ShipSafe uses Next.js middleware to automatically protect routes:

**Location:** `middleware.ts`

```typescript
// Protected routes (redirects to /auth if not authenticated)
const PROTECTED_ROUTES = ["/dashboard", "/api/protected"];

// Auth pages (redirects to /dashboard if already authenticated)
const AUTH_PAGES = ["/auth", "/signin", "/signup"];
```

**How it works:**
1. Middleware checks every request
2. If route is in `PROTECTED_ROUTES` and no session → redirect to `/auth`
3. If route is in `AUTH_PAGES` and has session → redirect to `/dashboard`

## Protecting Routes

### Method 1: Middleware (Recommended)

The easiest way - just add your route to the protected list:

```typescript
// middleware.ts
const PROTECTED_ROUTES = [
  "/dashboard",
  "/billing",
  "/settings",
  "/admin", // Add your routes here
];
```

**Benefits:**
- ✅ Automatic protection
- ✅ No code needed in components
- ✅ Centralized configuration
- ✅ Works for all HTTP methods

**Example:**

```typescript
// middleware.ts
const PROTECTED_ROUTES = [
  "/dashboard",
  "/dashboard/settings", // Automatically protected
  "/admin",
];

// All routes starting with these paths are protected
// /dashboard/* → Protected
// /dashboard/settings/* → Protected
// /admin/* → Protected
```

### Method 2: Layout Protection

Protect all routes under a layout:

```tsx
// src/app/dashboard/layout.tsx
import { getCurrentUserServer } from "@/lib/firebase/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: In Next.js App Router, getting request in layout is complex
  // Middleware protection is recommended instead
  
  // For additional checks, you can verify here
  // But middleware already handles basic protection

  return (
    <div>
      {/* Layout content */}
      {children}
    </div>
  );
}
```

**Note:** Middleware already protects `/dashboard/*` routes. This is for additional checks only.

### Method 3: Page-Level Protection

Add protection directly in page components:

#### Server Component

```tsx
// src/app/protected/page.tsx
import { getCurrentUserServer } from "@/lib/firebase/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ProtectedPage() {
  // In Next.js App Router Server Components,
  // accessing request directly is limited
  // Use middleware or client-side checks instead

  // Alternative: Use API route to check auth
  // Or use client component for auth state

  return (
    <div>
      <h1>Protected Page</h1>
    </div>
  );
}
```

**Limitation:** Next.js App Router Server Components don't have direct request access. Use middleware or client components.

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
        // Not authenticated - redirect to login
        router.push("/auth");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  );
}
```

## Accessing User Data in Protected Pages

### Server Component Pattern

For Server Components, fetch user data via API:

```tsx
// Server Component
import { headers } from "next/headers";

export default async function DashboardPage() {
  // Fetch user data from API
  // (In real implementation, you'd pass auth token)
  
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Use Client Component for auth state */}
      <UserProfile />
    </div>
  );
}
```

### Client Component Pattern

```tsx
"use client";

import { useState, useEffect } from "react";
import { getAuthInstance } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { apiGet } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthInstance();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch full user data from API
          const response = await apiGet("/api/user/me");
          if (response.success && response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect via middleware
  }

  return (
    <div>
      <h1>Welcome, {user.displayName || user.email}!</h1>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

## Role-Based Access Control

### Check User Role

```tsx
"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await apiGet("/api/user/me");
        if (response.success && response.data) {
          setUser(response.data);

          // Check role
          if (response.data.role !== "admin") {
            router.push("/dashboard"); // Redirect if not admin
          }
        }
      } catch (error) {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "admin") return null;

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Admin-only content</p>
    </div>
  );
}
```

### Protected API Route with Role Check

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    // Check role from custom claims
    const role = user.customClaims?.role as string;

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Admin-only logic
    return NextResponse.json({
      success: true,
      data: { adminData: "..." },
    });
  } catch (error) {
    // Error handling...
  }
}
```

## Custom Redirect URLs

### Configure Redirects

Update `config.ts`:

```typescript
const config = {
  auth: {
    loginUrl: "/auth",
    callbackUrl: "/dashboard", // Where to redirect after login
    logoutRedirect: "/",
  },
};
```

### Custom Redirect in Component

```tsx
"use client";

import { useRouter } from "next/navigation";
import config from "@/config";

function handleAuthSuccess() {
  router.push(config.auth.callbackUrl);
  // Or custom redirect
  // router.push("/custom-path");
}
```

## Protecting Multiple Routes

### Route Groups

Use Next.js route groups to protect multiple routes:

**`app/`**
- **`(protected)/`** - Route group (parentheses = no URL segment)
  - `dashboard/` - Protected dashboard routes
  - `settings/` - Protected settings routes
  - `billing/` - Protected billing routes
- **`(public)/`** - Public route group
  - `auth/` - Public authentication pages
  - `pricing/` - Public pricing page

Then protect the route group in middleware:

```typescript
// middleware.ts
const PROTECTED_ROUTES = [
  "/dashboard",
  "/settings",
  "/billing",
  // Or use pattern matching
];
```

## Best Practices

### 1. Use Middleware for Route Protection

✅ **Do:**
- Add routes to `PROTECTED_ROUTES` in middleware
- Let middleware handle redirects automatically

❌ **Don't:**
- Duplicate auth checks in every component
- Handle redirects manually in each page

### 2. Check Auth State in Client Components

✅ **Do:**
- Use `onAuthStateChanged` for real-time auth state
- Show loading state while checking
- Redirect gracefully

❌ **Don't:**
- Block rendering completely
- Flash content before redirect

### 3. Verify Server-Side for Sensitive Operations

✅ **Do:**
- Always verify auth server-side for sensitive operations
- Check roles/custom claims server-side
- Don't trust client-side auth state alone

❌ **Don't:**
- Rely only on client-side checks for security
- Trust user-provided role/permission data

## Common Patterns

### Pattern 1: Protected Dashboard

```tsx
// src/app/dashboard/page.tsx
// Automatically protected by middleware

export default function DashboardPage() {
  // Middleware already checked auth
  // Component can assume user is authenticated

  return (
    <div>
      <h1>Dashboard</h1>
      <UserContent />
    </div>
  );
}
```

### Pattern 2: Conditional Content

```tsx
"use client";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>Welcome back, {user.email}!</div>
      ) : (
        <div>Sign in to get started</div>
      )}
    </div>
  );
}
```

### Pattern 3: Admin-Only Page

```tsx
"use client";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await apiGet("/api/user/me");
        if (response.success && response.data) {
          if (response.data.role === "admin") {
            setUser(response.data);
          } else {
            router.push("/dashboard"); // Not admin
          }
        } else {
          router.push("/auth"); // Not authenticated
        }
      } catch (error) {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Admin content...</div>;
}
```

## Troubleshooting

### Redirect Loop

**Problem:** Page keeps redirecting between `/auth` and `/dashboard`

**Solution:**
- Check middleware configuration
- Verify auth state is properly set
- Check redirect URLs in `config.ts`

### Not Redirecting

**Problem:** Protected page accessible without auth

**Solution:**
- Verify route is in `PROTECTED_ROUTES` array
- Check middleware is running (check `middleware.ts` exists)
- Restart dev server after changes

### Auth State Not Updating

**Problem:** User data doesn't refresh after login/logout

**Solution:**
- Use `onAuthStateChanged` listener
- Clean up listeners in `useEffect` return
- Force page refresh if needed

## Learn More

- [Authentication Tutorial](./authentication) - Complete auth guide
- [API Routes Tutorial](./api-routes) - Creating protected endpoints
- [Security Features](../features/security-features) - Security architecture
- [Authentication Features](../features/authentication) - Auth implementation details
