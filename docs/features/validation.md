# Validation

Input validation using Zod schemas for type-safe validation and error handling.

## Overview

ShipSafe uses [Zod](https://zod.dev) for all input validation, providing type-safe validation with automatic TypeScript type inference. Zod schemas are used in API routes, forms, and anywhere user input needs to be validated.

**Key Features:**
- **Type-safe validation** - Automatic TypeScript type inference from schemas
- **API route validation** - All API routes validate incoming data
- **Form validation** - Client-side form validation
- **Error messages** - Descriptive, customizable error messages
- **Data transformation** - Automatic data normalization (trim, lowercase, etc.)

## Architecture

### Schema Organization

Schemas are organized by feature domain:

- **Auth schemas:** `src/features/auth/schema.ts`
- **Billing schemas:** `src/features/billing/schema.ts`
- **Model schemas:** `src/models/user.ts`, `src/models/subscription.ts`

### Validation Flow

```
User Input → Zod Schema → Validated Data (TypeScript typed) → Business Logic
```

## Basic Usage

### Define Schema

```typescript
import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");
```

### Validate in API Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate and parse (throws ZodError if invalid)
    const data = loginSchema.parse(body);
    
    // data is now typed as LoginInput
    // Use data.email and data.password (both validated)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    // Handle other errors...
  }
}
```

### Safe Parse (No Exception)

```typescript
import { loginSchema } from "@/features/auth/schema";

const result = loginSchema.safeParse(body);

if (!result.success) {
  // Handle validation errors
  const errors = result.error.errors;
  return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
}

// result.data is typed and validated
const { email, password } = result.data;
```

## Schema Examples

### Email Schema

```typescript
import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .toLowerCase() // Auto-converts to lowercase
  .trim(); // Auto-trims whitespace
```

### Password Schema

```typescript
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");
```

### Login Schema

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Type inference
export type LoginInput = z.infer<typeof loginSchema>;
// Type: { email: string; password: string }
```

### Signup Schema

```typescript
import { z } from "zod";

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be less than 100 characters")
    .trim()
    .optional(),
});
```

### Checkout Schema

```typescript
import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  priceId: z
    .string()
    .min(1, "Price ID is required")
    .startsWith("price_", "Invalid Stripe price ID format"),
  successUrl: z.string().url("Invalid success URL").optional(),
  cancelUrl: z.string().url("Invalid cancel URL").optional(),
});
```

## Validation in API Routes

### Standard Pattern

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { someSchema } from "@/features/domain/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const data = someSchema.parse(body);
    
    // Use validated data (type-safe)
    const result = await doSomething(data);
    
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    // Handle Zod validation errors
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
    
    // Handle other errors
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
```

### With Authentication

```typescript
import { requireAuth } from "@/lib/firebase/auth";
import { someSchema } from "@/features/domain/schema";

export async function POST(req: NextRequest) {
  try {
    // Verify authentication first
    const user = await requireAuth(req);
    
    // Then validate input
    const body = await req.json();
    const data = someSchema.parse(body);
    
    // Use validated data and user
    const result = await doSomething(user.uid, data);
    
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    // Handle errors...
  }
}
```

## Client-Side Validation

### Form Validation

```typescript
"use client";

import { useState } from "react";
import { loginSchema } from "@/features/auth/schema";
import { z } from "zod";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate client-side
    const result = loginSchema.safeParse({ email, password });
    
    if (!result.success) {
      // Set field errors
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    // Validation passed, submit to API
    // ...
  };
  
  // ...
}
```

### Real-Time Validation

```typescript
const validateField = (field: string, value: string) => {
  // Create partial schema for single field
  const fieldSchema = loginSchema.shape[field as keyof typeof loginSchema.shape];
  
  const result = fieldSchema.safeParse(value);
  
  if (!result.success) {
    setErrors({ ...errors, [field]: result.error.errors[0].message });
  } else {
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);
  }
};
```

## Type Inference

Zod automatically infers TypeScript types from schemas:

```typescript
import { loginSchema } from "@/features/auth/schema";
import { z } from "zod";

// Type inference
type LoginInput = z.infer<typeof loginSchema>;
// Result: { email: string; password: string }

// Use in function signatures
async function loginUser(input: LoginInput) {
  // input.email and input.password are typed
}
```

## Custom Validation

### Custom Refinements

```typescript
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine(
    (val) => val !== val.toLowerCase(),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (val) => val !== val.toUpperCase(),
    "Password must contain at least one lowercase letter"
  );
```

### Cross-Field Validation

```typescript
const signupSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Error appears on confirmPassword field
  });
```

### Async Validation

```typescript
const emailSchema = z
  .string()
  .email()
  .refine(
    async (email) => {
      // Check if email is already taken
      const exists = await checkEmailExists(email);
      return !exists;
    },
    { message: "Email is already registered" }
  );
```

## Data Transformation

Zod can automatically transform data:

```typescript
// Auto-convert to lowercase and trim
const emailSchema = z.string().email().toLowerCase().trim();

// Auto-convert string to number
const ageSchema = z.string().transform((val) => parseInt(val, 10));

// Auto-format phone number
const phoneSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, "")) // Remove non-digits
  .refine((val) => val.length === 10, "Invalid phone number");
```

## Error Handling

### Custom Error Messages

```typescript
const schema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  }).email("Please enter a valid email address"),
});
```

### Format Error Responses

```typescript
function formatZodError(error: z.ZodError) {
  return {
    message: "Validation failed",
    errors: error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
      code: err.code,
    })),
  };
}

// Usage
try {
  const data = schema.parse(body);
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(formatZodError(error), { status: 400 });
  }
}
```

## Best Practices

1. **Validate all inputs** - Never trust user input
2. **Use descriptive messages** - Help users understand what's wrong
3. **Transform data** - Normalize input (trim, lowercase, etc.)
4. **Reuse schemas** - Create shared schemas for common fields (email, password)
5. **Type inference** - Use `z.infer` for automatic TypeScript types
6. **Validate early** - Validate in API routes before business logic
7. **Client + server** - Validate on both client (UX) and server (security)

## Common Patterns

### Optional Fields

```typescript
const schema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(), // Optional field
  age: z.number().nullable(), // Can be null
});
```

### Enums

```typescript
const statusSchema = z.enum(["ACTIVE", "INACTIVE", "PENDING"]);

// Or from TypeScript enum
enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
const statusSchema = z.nativeEnum(Status);
```

### Arrays

```typescript
const tagsSchema = z.array(z.string()).min(1, "At least one tag required");
const idsSchema = z.array(z.string().uuid()).max(10, "Maximum 10 IDs");
```

### Nested Objects

```typescript
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
});

const userSchema = z.object({
  name: z.string(),
  address: addressSchema, // Nested schema
});
```

## Learn More

- [Zod Documentation](https://zod.dev) - Complete Zod guide
- [API Routes Tutorial](../tutorials/api-routes) - Validation in API routes
- [Authentication Features](./authentication) - Auth validation examples
- [Billing Features](./billing) - Billing validation examples
