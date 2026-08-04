# Error Handling

Consistent error handling patterns for API routes and client components.

## Overview

ShipSafe provides comprehensive error handling across the application, ensuring user-friendly error messages, consistent error responses, and proper error logging. Errors are handled at multiple levels: API routes, client components, and utility functions.

**Key Features:**
- **Type-safe errors** - APIError class with TypeScript support
- **User-friendly messages** - Clear, actionable error messages
- **Consistent responses** - Standard error response format
- **Error logging** - Server-side error logging for debugging
- **Graceful degradation** - Handles network and unexpected errors

## Error Types

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 400 | Bad Request | Validation errors, invalid input |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 500 | Internal Server Error | Unexpected server errors |

## API Error Handling

### Standard Error Response Format

```typescript
// Error response structure
{
  error: "User-friendly error message",
  details?: {}, // Optional details (validation errors, etc.)
}
```

### APIError Class

**Location:** `src/lib/api.ts`

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public data?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}
```

**Usage:**

```typescript
throw new APIError("User not found", 404);
throw new APIError("Validation failed", 400, { fields: ["email"] });
```

### Error Handling in API Routes

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/firebase/auth";

export async function POST(req: NextRequest) {
  try {
    // Your code here
    const user = await requireAuth(req);
    // ...
    
  } catch (error) {
    // Zod validation errors
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
    
    // Authentication errors
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" },
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

## Client-Side Error Handling

### API Client Error Handling

**Location:** `src/lib/api.ts`

The API client automatically handles errors:

```typescript
import { apiPost, handleAPIError, APIError } from "@/lib/api";

try {
  const response = await apiPost("/api/endpoint", data);
  
  if (response.success) {
    // Handle success
    console.log(response.data);
  }
} catch (error) {
  // Handle error
  const message = handleAPIError(error);
  alert(message); // or show toast notification
}
```

### handleAPIError Utility

```typescript
export function handleAPIError(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again.";
}
```

### Form Error Handling

```typescript
"use client";

import { useState } from "react";
import { apiPost, handleAPIError } from "@/lib/api";
import { z } from "zod";

function MyForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    try {
      const response = await apiPost("/api/endpoint", formData);
      
      if (response.success) {
        // Success handling
      }
    } catch (error) {
      if (error instanceof APIError) {
        // Handle API error
        if (error.statusCode === 400 && error.data?.details) {
          // Validation errors
          const fieldErrors: Record<string, string> = {};
          error.data.details.forEach((err: any) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          // General error
          setGeneralError(error.message);
        }
      } else {
        // Network or unknown error
        setGeneralError(handleAPIError(error));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {generalError && (
        <div className="alert alert-error">{generalError}</div>
      )}
      {/* Form fields with field-specific errors */}
    </form>
  );
}
```

## Error Logging

### Server-Side Logging

Always log errors server-side for debugging:

```typescript
export async function POST(req: NextRequest) {
  try {
    // Your code
  } catch (error) {
    // Log error with context
    console.error("API error:", {
      endpoint: req.url,
      method: req.method,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return user-friendly error
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
```

### Structured Logging

```typescript
function logError(context: {
  endpoint: string;
  method: string;
  userId?: string;
  error: Error;
}) {
  console.error("API Error:", {
    timestamp: new Date().toISOString(),
    endpoint: context.endpoint,
    method: context.method,
    userId: context.userId,
    error: {
      message: context.error.message,
      name: context.error.name,
      stack: context.error.stack,
    },
  });
}

// Usage
catch (error) {
  logError({
    endpoint: req.url,
    method: req.method,
    userId: user?.uid,
    error: error instanceof Error ? error : new Error(String(error)),
  });
}
```

## Best Practices

### 1. User-Friendly Messages

```typescript
// ✅ Good: Clear, actionable message
{ error: "Email is already registered. Please sign in instead." }

// ❌ Bad: Technical error
{ error: "UNIQUE constraint violation on users.email" }
```

### 2. Don't Leak Sensitive Information

```typescript
// ✅ Good: Generic error message
catch (error) {
  console.error("Database error:", error); // Log details server-side
  return NextResponse.json(
    { error: "Failed to create account. Please try again." },
    { status: 500 }
  );
}

// ❌ Bad: Exposes internal details
catch (error) {
  return NextResponse.json(
    { error: `Database connection failed: ${error.message}` },
    { status: 500 }
  );
}
```

### 3. Handle Specific Errors

```typescript
catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
  } else if (error.message.includes("Unauthorized")) {
    // Handle auth errors
  } else if (error.message.includes("not found")) {
    // Handle not found errors
  } else {
    // Handle generic errors
  }
}
```

### 4. Provide Actionable Errors

```typescript
// ✅ Good: Tells user what to do
{ 
  error: "Password must be at least 8 characters",
  details: {
    field: "password",
    suggestion: "Try adding more characters or numbers"
  }
}

// ❌ Bad: Just says it's wrong
{ error: "Invalid password" }
```

## Common Error Patterns

### Validation Errors

```typescript
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
```

### Authentication Errors

```typescript
if (error instanceof Error && error.message.includes("Unauthorized")) {
  return NextResponse.json(
    { error: "Please sign in to continue" },
    { status: 401 }
  );
}
```

### Not Found Errors

```typescript
if (!resource) {
  return NextResponse.json(
    { error: "Resource not found" },
    { status: 404 }
  );
}
```

### Rate Limit Errors

```typescript
// Middleware returns rate limit error
if (error instanceof Error && error.message.includes("rate limit")) {
  return NextResponse.json(
    { 
      error: "Too many requests. Please try again later.",
      retryAfter: 60,
    },
    { status: 429 }
  );
}
```

## Error Boundaries (React)

### Global Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-error">
          <h2>Something went wrong</h2>
          <p>Please refresh the page or contact support if the problem persists.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Network Error Handling

### Handling Network Failures

```typescript
try {
  const response = await apiPost("/api/endpoint", data);
} catch (error) {
  if (error instanceof APIError && error.statusCode === 0) {
    // Network error (statusCode 0 means network failure)
    alert("Network error. Please check your internet connection.");
  } else {
    // Other errors
    alert(handleAPIError(error));
  }
}
```

### Retry Logic

```typescript
async function apiPostWithRetry(
  url: string,
  data: unknown,
  retries = 3
): Promise<APIResponse> {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiPost(url, data);
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}
```

## Troubleshooting

### Error Not Caught

- Ensure error is thrown properly
- Check try-catch blocks are in place
- Verify error is not being swallowed

### Generic Error Messages

- Check server logs for detailed errors
- Ensure errors are logged before returning user-friendly messages
- Use error tracking service (Sentry, LogRocket, etc.)

### Validation Errors Not Showing

- Verify Zod schema is correct
- Check error handling in form component
- Ensure error response format matches client expectations

## Learn More

- [API Routes Features](./api-routes) - Error handling in API routes
- [Validation Features](./validation) - Validation error handling
- [API Client Utilities](../../lib/api.ts) - Client-side error handling
