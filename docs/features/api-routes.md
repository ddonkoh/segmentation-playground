# API Routes

Creating secure, type-safe API endpoints with authentication, validation, and error handling.

## Overview

ShipSafe API routes follow Next.js 15 App Router conventions and include built-in security layers, input validation, and consistent error handling. All API routes are protected by middleware that enforces security best practices.

**Key Features:**
- **Type-safe** - TypeScript with Zod validation
- **Secure by default** - CSRF protection, rate limiting, API firewall
- **Consistent patterns** - Standard structure for all routes
- **Error handling** - User-friendly error messages
- **Authentication** - Firebase Auth integration

## Route Structure

All API routes are located in `src/app/api/` and follow this structure:

**`src/app/api/`**
- **`auth/`** - Authentication endpoints
  - `login/route.ts` - POST - User login
  - `signup/route.ts` - POST - User registration
  - `logout/route.ts` - POST - User logout
  - `reset/route.ts` - POST - Send password reset email
  - `reset/verify/route.ts` - POST - Verify and reset password
  - `route.ts` - General auth endpoint
- **`checkout/route.ts`** - POST - Create Stripe checkout session
- **`billing/portal/route.ts`** - POST - Create Stripe billing portal session
- **`user/me/route.ts`** - GET - Get current user data
- **`webhooks/stripe/route.ts`** - POST - Stripe webhook handler
- **`csrf/route.ts`** - GET - Get CSRF token for client
- **`security/status/route.ts`** - GET - Get security features status

## Standard Route Pattern

### Basic Structure

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/firebase/auth";
import { someSchema } from "@/features/domain/schema";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify authentication (if required)
    const user = await requireAuth(req);
    
    // 2. Parse and validate request body
    const body = await req.json();
    const data = someSchema.parse(body);
    
    // 3. Business logic
    const result = await doSomething(user.uid, data);
    
    // 4. Return success response
    return NextResponse.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    // 5. Handle errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
```

## Authentication

### Required Authentication

```typescript
import { requireAuth } from "@/lib/firebase/auth";

export async function GET(req: NextRequest) {
  try {
    // Throws error if not authenticated
    const user = await requireAuth(req);
    
    // Use user.uid, user.email, etc.
    return NextResponse.json({ data: "Protected data" });
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
```

### Optional Authentication

```typescript
import { getCurrentUserServer } from "@/lib/firebase/auth";

export async function GET(req: NextRequest) {
  // Returns null if not authenticated
  const user = await getCurrentUserServer(req);
  
  if (user) {
    // User is authenticated
    return NextResponse.json({ data: "Authenticated content" });
  }
  
  // User is not authenticated (guest access)
  return NextResponse.json({ data: "Public content" });
}
```

## Input Validation

### Using Zod Schemas

```typescript
import { z } from "zod";
import { loginSchema } from "@/features/auth/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate with Zod (throws ZodError if invalid)
    const data = loginSchema.parse(body);
    
    // data is now typed and validated
    // Use data.email, data.password
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map(e => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
  }
}
```

### Safe Parse (No Exception)

```typescript
const result = loginSchema.safeParse(body);

if (!result.success) {
  return NextResponse.json(
    { error: "Validation failed", details: result.error.errors },
    { status: 400 }
  );
}

// result.data is typed and validated
const { email, password } = result.data;
```

## Error Handling

### Standard Error Responses

```typescript
// Validation error (400)
return NextResponse.json(
  { error: "Invalid input", details: validationErrors },
  { status: 400 }
);

// Authentication error (401)
return NextResponse.json(
  { error: "Unauthorized" },
  { status: 401 }
);

// Authorization error (403)
return NextResponse.json(
  { error: "Forbidden" },
  { status: 403 }
);

// Not found (404)
return NextResponse.json(
  { error: "Resource not found" },
  { status: 404 }
);

// Server error (500)
return NextResponse.json(
  { error: "Internal server error" },
  { status: 500 }
);
```

### Error Handling Pattern

```typescript
export async function POST(req: NextRequest) {
  try {
    // Your code here
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }
      
      // Generic error
      return NextResponse.json(
        { error: error.message || "Server error" },
        { status: 500 }
      );
    }
    
    // Unknown error
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
```

## HTTP Methods

### GET Request

```typescript
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    
    // Fetch data
    const data = await fetchUserData(user.uid);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Error handling...
  }
}
```

### POST Request

```typescript
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const data = createSchema.parse(body);
    
    // Create resource
    const result = await createResource(user.uid, data);
    
    return NextResponse.json(
      { success: true, data: result },
      { status: 201 }
    );
  } catch (error) {
    // Error handling...
  }
}
```

### PUT/PATCH Request

```typescript
export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const data = updateSchema.parse(body);
    
    // Update resource
    const result = await updateResource(user.uid, data);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    // Error handling...
  }
}
```

### DELETE Request

```typescript
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }
    
    await deleteResource(user.uid, id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Error handling...
  }
}
```

## Query Parameters

### Reading Query Params

```typescript
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  
  // Validate query params
  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;
  
  // Use params...
}
```

### Validating Query Params

```typescript
import { z } from "zod";

const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Convert URLSearchParams to object
  const query = Object.fromEntries(searchParams.entries());
  const validated = querySchema.parse(query);
  
  // validated.page and validated.limit are numbers
}
```

## Security Features

### Built-in Security

All API routes are automatically protected by:

1. **CSRF Protection** - Middleware validates CSRF tokens
2. **Rate Limiting** - Prevents abuse with per-IP limits
3. **API Firewall** - Blocks invalid methods, suspicious user agents
4. **Input Validation** - All inputs validated with Zod
5. **Authentication** - Firebase Auth verification

### Security Middleware

**Location:** `src/middleware.ts`

Security is applied automatically to all `/api/*` routes.

## Response Format

### Success Response

```typescript
return NextResponse.json({
  success: true,
  data: {
    // Your data here
  },
});
```

### Error Response

```typescript
return NextResponse.json({
  error: "Error message",
  details: {}, // Optional details
}, { status: 400 });
```

## Best Practices

1. **Always validate input** - Use Zod schemas for all inputs
2. **Handle errors gracefully** - Return user-friendly error messages
3. **Use proper HTTP status codes** - 200, 201, 400, 401, 403, 404, 500
4. **Authenticate when needed** - Use `requireAuth` for protected routes
5. **Type your responses** - Use TypeScript types for response data
6. **Log errors** - Log errors server-side for debugging
7. **Don't leak sensitive data** - Never expose internal errors to clients
8. **Use consistent patterns** - Follow the standard route structure

## Example: Complete Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/firebase/auth";
import { getFirestoreInstance } from "@/lib/firebase/init";

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  photoURL: z.string().url().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    // 1. Authenticate
    const user = await requireAuth(req);
    
    // 2. Validate input
    const body = await req.json();
    const data = updateProfileSchema.parse(body);
    
    // 3. Business logic
    const firestore = getFirestoreInstance();
    await firestore.collection("users").doc(user.uid).update({
      ...data,
      updatedAt: new Date(),
    });
    
    // 4. Return success
    return NextResponse.json({
      success: true,
      data: { message: "Profile updated" },
    });
    
  } catch (error) {
    // 5. Handle errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
```

## Available API Routes

### Authentication Routes

- **POST `/api/auth/login`** - User login with email/password
- **POST `/api/auth/signup`** - User registration
- **POST `/api/auth/logout`** - User logout (revokes sessions)
- **POST `/api/auth/reset`** - Send password reset email
- **POST `/api/auth/reset/verify`** - Verify reset code and update password

### Billing Routes

- **POST `/api/checkout`** - Create Stripe checkout session
- **POST `/api/billing/portal`** - Create Stripe billing portal session

### User Routes

- **GET `/api/user/me`** - Get current authenticated user data

### Webhook Routes

- **POST `/api/webhooks/stripe`** - Handle Stripe webhook events

### Utility Routes

- **GET `/api/csrf`** - Get CSRF token for client-side requests
- **GET `/api/security/status`** - Get security features status (for debugging)

## Learn More

- [Validation Features](./validation) - Zod validation patterns
- [Error Handling Features](./error-handling) - Error handling patterns
- [Security Features](./security-features) - Security architecture
- [API Routes Tutorial](../tutorials/api-routes) - Step-by-step guide
- [Authentication Features](./authentication) - Auth implementation
- [Billing Features](./billing) - Stripe integration
