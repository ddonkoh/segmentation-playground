# API Routes Tutorial

Complete guide to creating secure, type-safe API endpoints in ShipSafe.

## Overview

ShipSafe API routes follow Next.js 15 App Router conventions and include built-in security layers. This tutorial covers creating API endpoints with authentication, validation, and error handling.

**What You'll Learn:**
- Creating API routes with Next.js App Router
- Implementing authentication guards
- Validating inputs with Zod
- Handling errors consistently
- Following ShipSafe patterns

## Route Structure

### File Location

API routes are located in `src/app/api/`:

**`src/app/api/your-endpoint/`**
- `route.ts` - HTTP method handlers

### File Name

Always use `route.ts` in a folder named after your endpoint:

- ✅ `src/app/api/users/route.ts` → `/api/users`
- ✅ `src/app/api/posts/route.ts` → `/api/posts`
- ❌ `src/app/api/users.ts` → Invalid (no folder)

## Standard Route Pattern

### Basic Structure

Every API route should follow this pattern:

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

    // 3. Business logic (call feature functions)
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

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("API error:", error);
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
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    // Fetch data
    const data = await fetchUserData(user.uid);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    // Error handling...
  }
}
```

### POST Request

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";
import { z } from "zod";
import { createItemSchema } from "@/features/items/schema";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    // Parse and validate
    const body = await req.json();
    const data = createItemSchema.parse(body);

    // Create item
    const item = await createItem(user.uid, data);

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
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
    const data = updateItemSchema.parse(body);

    // Update item
    const updated = await updateItem(user.uid, data.id, data);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    // Error handling...
  }
}

export async function PATCH(req: NextRequest) {
  // Similar to PUT but for partial updates
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

    await deleteItem(user.uid, id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    // Error handling...
  }
}
```

## Authentication

### Required Authentication

Use `requireAuth()` for endpoints that require authentication:

```typescript
import { requireAuth } from "@/lib/firebase/auth";

export async function POST(req: NextRequest) {
  try {
    // Throws error if not authenticated
    const user = await requireAuth(req);

    // Use user.uid, user.email, etc.
    return NextResponse.json({
      success: true,
      data: { userId: user.uid },
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

### Optional Authentication

Use `getCurrentUserServer()` for endpoints with optional auth:

```typescript
import { getCurrentUserServer } from "@/lib/firebase/auth";

export async function GET(req: NextRequest) {
  // Returns null if not authenticated
  const user = await getCurrentUserServer(req);

  if (user) {
    // Authenticated user - personalized content
    return NextResponse.json({
      success: true,
      data: { personalized: true, user: user.email },
    });
  }

  // Not authenticated - public content
  return NextResponse.json({
    success: true,
    data: { personalized: false },
  });
}
```

## Input Validation

### Using Zod Schemas

Always validate inputs using Zod schemas from `features/`:

```typescript
import { z } from "zod";
import { createItemSchema } from "@/features/items/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate with Zod (throws ZodError if invalid)
    const data = createItemSchema.parse(body);

    // data is now typed and validated
    // Use data safely...
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
    // Handle other errors...
  }
}
```

### Creating Validation Schemas

Create schemas in `src/features/<domain>/schema.ts`:

```typescript
// src/features/items/schema.ts
import { z } from "zod";

export const createItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive("Price must be positive"),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
```

### Safe Parse (No Exception)

Use `safeParse()` if you want to handle validation without exceptions:

```typescript
const result = createItemSchema.safeParse(body);

if (!result.success) {
  return NextResponse.json(
    {
      error: "Validation failed",
      details: result.error.errors,
    },
    { status: 400 }
  );
}

// result.data is typed and validated
const { title, description, price } = result.data;
```

## Query Parameters

### Reading Query Params

```typescript
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const search = searchParams.get("search");

  // Use params...
}
```

### Validating Query Params

```typescript
import { z } from "zod";

const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
  search: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());
  
  // Validate and transform
  const validated = querySchema.parse(query);
  
  // validated.page and validated.limit are numbers
  const items = await getItems({
    page: validated.page,
    limit: validated.limit,
    search: validated.search,
  });

  return NextResponse.json({ success: true, data: items });
}
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

### Comprehensive Error Handling

```typescript
export async function POST(req: NextRequest) {
  try {
    // Your code...
  } catch (error) {
    // Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Authentication errors
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Not found errors
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Already exists errors
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { error: "Resource already exists" },
        { status: 409 }
      );
    }

    // Generic server errors
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
```

## Response Format

### Success Response

Always use this format:

```typescript
return NextResponse.json({
  success: true,
  data: {
    // Your data here
  },
});
```

### Error Response

Always use this format:

```typescript
return NextResponse.json({
  error: "Error message",
  details: {}, // Optional details
}, { status: 400 });
```

## Complete Examples

### Example 1: Get User Profile

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";
import { getFirestoreInstance } from "@/lib/firebase/init";
import { userFromFirestore } from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    // Get user from Firestore
    const firestore = getFirestoreInstance();
    const userDoc = await firestore.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userData = userFromFirestore({
      ...userDoc.data(),
      uid: user.uid,
    } as any);

    return NextResponse.json({
      success: true,
      data: {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        createdAt: userData.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
```

### Example 2: Create Item

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";
import { z } from "zod";
import { getFirestoreInstance } from "@/lib/firebase/init";
import { Timestamp } from "firebase-admin/firestore";

const createItemSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    // Parse and validate
    const body = await req.json();
    const data = createItemSchema.parse(body);

    // Create item in Firestore
    const firestore = getFirestoreInstance();
    const itemRef = await firestore.collection("items").add({
      userId: user.uid,
      title: data.title,
      description: data.description || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const itemDoc = await itemRef.get();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: itemDoc.id,
          ...itemDoc.data(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
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
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
```

### Example 3: Update Item

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth";
import { z } from "zod";
import { getFirestoreInstance } from "@/lib/firebase/init";
import { Timestamp } from "firebase-admin/firestore";

const updateItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const data = updateItemSchema.parse(body);

    // Verify ownership
    const firestore = getFirestoreInstance();
    const itemDoc = await firestore.collection("items").doc(data.id).get();

    if (!itemDoc.exists) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const itemData = itemDoc.data();
    if (itemData?.userId !== user.uid) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Update item
    await firestore.collection("items").doc(data.id).update({
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      data: { message: "Item updated successfully" },
    });
  } catch (error) {
    // Error handling...
  }
}
```

## Security Features

All API routes are automatically protected by:

1. **HTTPS Enforcement** - All traffic encrypted
2. **Rate Limiting** - Per-IP request limits
3. **API Firewall** - Blocks invalid requests
4. **CSRF Protection** - For mutation requests
5. **Security Headers** - Strong HTTP headers

These are applied automatically by middleware. No additional configuration needed.

## Best Practices

1. **Always validate input** - Use Zod schemas
2. **Handle errors gracefully** - Return user-friendly messages
3. **Use proper HTTP status codes** - 200, 201, 400, 401, 403, 404, 500
4. **Authenticate when needed** - Use `requireAuth()` for protected routes
5. **Type your responses** - Use TypeScript types
6. **Log errors server-side** - For debugging, not in response
7. **Don't leak sensitive data** - Never expose internal errors
8. **Follow consistent patterns** - Use the standard route structure

## Testing API Routes

### Local Testing

```bash
# Start dev server
npm run dev

# Test with curl
curl -X POST http://localhost:3000/api/your-endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### With Authentication

```bash
# Get auth token first (from client)
# Then include in request
curl -X GET http://localhost:3000/api/your-endpoint \
  -H "Authorization: Bearer YOUR_ID_TOKEN"
```

## Troubleshooting

### Route Not Found

- Check file is in `src/app/api/<endpoint>/route.ts`
- Verify folder name matches endpoint path
- Restart dev server after creating new routes

### Authentication Failing

- Check token is included in Authorization header
- Verify token hasn't expired
- Check Firebase Admin SDK configuration

### Validation Errors

- Check Zod schema matches request body
- Verify all required fields are provided
- Check field types match schema

## Learn More

- [Validation Features](../features/validation) - Zod validation patterns
- [Error Handling Features](../features/error-handling) - Error handling patterns
- [Security Features](../features/security-features) - Security architecture
- [Protected Pages Tutorial](./protected-pages) - Securing pages
