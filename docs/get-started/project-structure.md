# Project Structure

Complete guide to understanding ShipSafe's codebase organization and architecture.

## Overview

ShipSafe follows a clean, domain-driven architecture that separates concerns and makes the codebase easy to navigate and extend. This guide explains the folder structure, conventions, and how different parts of the application work together.

## Directory Structure

The ShipSafe project follows a clean, organized structure:

**Root Directory:**
- `src/` - Source code
  - `app/` - Next.js App Router (pages & routes)
  - `components/` - React components
  - `features/` - Business logic modules
  - `lib/` - Utility libraries & integrations
  - `models/` - TypeScript type definitions
- `public/` - Static assets (images, fonts, etc.)
- `docs/` - Documentation
- `config.ts` - Centralized app configuration
- `tailwind.config.ts` - TailwindCSS configuration
- `next.config.ts` - Next.js configuration
- `package.json` - Dependencies

## Core Directories

### `src/app/` - Next.js App Router

The App Router is the foundation of Next.js routing. Each folder represents a route.

#### Public Routes

**`src/app/`**
- `page.tsx` - Landing page (`/`)
- `auth/page.tsx` - Authentication page (`/auth`)
- `pricing/page.tsx` - Pricing page (`/pricing`)
- `privacy/page.tsx` - Privacy policy (`/privacy`)
- `terms/page.tsx` - Terms of service (`/terms`)

#### Protected Routes

**`src/app/dashboard/`**
- `layout.tsx` - Dashboard layout (requires auth)
- `page.tsx` - Main dashboard (`/dashboard`)
- `billing/page.tsx` - Billing page (`/dashboard/billing`)
- `account/page.tsx` - Account settings (`/dashboard/account`)

#### API Routes

**`src/app/api/`**
- **`auth/`** - Authentication endpoints
  - `login/route.ts` - POST `/api/auth/login`
  - `signup/route.ts` - POST `/api/auth/signup`
  - `logout/route.ts` - POST `/api/auth/logout`
  - `reset/route.ts` - POST `/api/auth/reset`
- **`checkout/route.ts`** - POST `/api/checkout`
- **`billing/portal/route.ts`** - POST `/api/billing/portal`
- **`webhooks/stripe/route.ts`** - POST `/api/webhooks/stripe`

**Key Points:**
- Each route folder contains a `route.ts` file with HTTP method handlers
- API routes are server-side only
- Use `requireAuth()` or `getCurrentUserServer()` for authentication
- All inputs validated with Zod schemas

#### Special Files

**`src/app/`**
- `layout.tsx` - Root layout (wraps all pages)
- `globals.css` - Global styles
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page
- `favicon.ico` - Site favicon

---

### `src/components/` - React Components

Components are organized by type and purpose.

#### Template Components

**`src/components/templates/`**
- `Header.tsx` - Site header/navigation
- `Hero.tsx` - Hero section
- `Pricing.tsx` - Pricing plans
- `FAQ.tsx` - FAQ section
- `CTA.tsx` - Call-to-action section
- `Footer.tsx` - Site footer
- `Testimonial.tsx` - Testimonials carousel
- `Problem.tsx` - Problem statement
- `FeaturesGrid.tsx` - Features grid
- `FeaturesListicle.tsx` - Feature showcase

**Usage:** Page-level components used on marketing/landing pages.

**Rules:**
- Should be reusable and customizable
- Accept props for content
- No business logic (use features/ instead)
- Can be Server or Client Components

#### UI Components

**`src/components/ui/`**
- `Button.tsx` - Base button component
- `ButtonCheckout.tsx` - Stripe checkout button
- `ButtonSignin.tsx` - Sign-in link button
- `ButtonGradient.tsx` - Gradient button variant
- `Input.tsx` - Form input component
- `Card.tsx` - Card container
- `Badge.tsx` - Badge/label component
- `Modal.tsx` - Modal dialog
- `Loader.tsx` - Loading spinner
- `Logo.tsx` - Logo component
- `BuiltWithShipSafe.tsx` - Attribution badge
- `TestimonialsAvatars.tsx` - Avatar display

**Usage:** Reusable UI primitives used throughout the app.

**Rules:**
- Highly reusable across different contexts
- Well-typed with TypeScript interfaces
- Accessible and semantic HTML
- DaisyUI classes for styling

#### Form Components

**`src/components/forms/`**
- `LoginForm.tsx` - Login form
- `SignupForm.tsx` - Signup form

**Usage:** Form components with validation and error handling.

**Rules:**
- Client Components (use hooks for state)
- Include validation logic
- Handle loading and error states
- Integrate with API routes

#### Layout Components

**`src/components/layouts/`**
- `ClientLayout.tsx` - Client-side layout wrapper

**Usage:** Layout wrappers for client-side features.

---

### `src/features/` - Business Logic

Features contain pure business logic, no React components.

#### Authentication Feature

**`src/features/auth/`**
- `login.ts` - Login logic
- `signup.ts` - Signup logic
- `logout.ts` - Logout logic
- `reset.ts` - Password reset logic
- `send-reset.ts` - Send reset email
- `schema.ts` - Zod validation schemas

**Key Functions:**
- `signupUser()` - Create new user account
- `loginUser()` - Authenticate user
- `sendPasswordResetEmail()` - Send reset email
- Validation schemas for all auth operations

#### Billing Feature

**`src/features/billing/`**
- `server.ts` - Server-side billing operations
- `webhook.ts` - Webhook event handlers
- `schema.ts` - Zod validation schemas

**Key Functions:**
- `createCheckoutSessionForUser()` - Create Stripe checkout
- `getUserSubscriptionStatus()` - Get subscription info
- `updateSubscriptionInFirestore()` - Sync subscription
- Webhook handlers for Stripe events

**Rules:**
- No React code (`.ts` files only)
- Server-side only (uses Admin SDK)
- Import from `lib/` for utilities
- Used by API routes, not components

---

### `src/lib/` - Utility Libraries

Core utilities and third-party integrations.

#### Firebase Integration

**`src/lib/firebase/`**
- `init.ts` - Admin SDK initialization
- `client.ts` - Client SDK initialization
- `auth.ts` - Auth helpers (server-side)
- `admin.ts` - Admin utilities

**Key Functions:**
- `getFirestoreInstance()` - Get Firestore instance
- `getAuthInstance()` - Get Auth instance
- `verifyAuth()` - Verify authentication
- `requireAuth()` - Require authentication

#### Stripe Integration

**`src/lib/stripe/`**
- `client.ts` - Stripe client initialization
- `checkout.ts` - Checkout session creation
- `billing.ts` - Billing portal
- `webhook.ts` - Webhook signature verification

**Key Functions:**
- `getStripeClient()` - Get Stripe instance
- `createCheckoutSession()` - Create checkout
- `parseWebhookEvent()` - Verify webhooks

#### Security Utilities

**`src/lib/security/`**
- `env.ts` - Environment variable helpers
- `headers.ts` - Security headers
- `rate_limit.ts` - Rate limiting
- `secure_api.ts` - API firewall
- `csrf.ts` - CSRF protection
- `audit.ts` - Security audit logging

**Rules:**
- Server-side only
- Used by middleware
- Applied automatically to all routes

#### API Client

**`src/lib/`**
- `api.ts` - Client-side API helpers

**Key Functions:**
- `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()`
- Automatic CSRF token handling
- Automatic auth token handling
- Error handling utilities

---

### `src/models/` - Type Definitions

TypeScript interfaces and type definitions.

**`src/models/`**
- `user.ts` - User interface & Firestore converters
- `subscription.ts` - Subscription interface & converters
- `subscription-status.ts` - Subscription status enum
- `plan.ts` - Pricing plan interface
- `roles.ts` - User roles enum

**Key Files:**

- **`user.ts`** - User model with Firestore converters
- **`subscription.ts`** - Subscription model with converters
- **`roles.ts`** - User role definitions

**Rules:**
- No business logic
- No React code
- Type definitions only
- Firestore converters for type safety

---

## Configuration Files

### `config.ts` - Central Configuration

Single source of truth for app configuration:

```typescript
const config = {
  appName: "ShipSafe",
  domainName: "shipsafe.st",
  stripe: {
    plans: [/* ... */],
  },
  auth: {
    loginUrl: "/auth",
    callbackUrl: "/dashboard",
  },
  // ...
};
```

**Usage:** Import in components and API routes:

```typescript
import config from "@/config";
```

### Environment Variables

Store in `.env.local` (not committed to repo):

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_PUBLIC_KEY=...
```

See [Environment Variables Guide](../features/environment-variables).

---

## Architecture Principles

### 1. Separation of Concerns

- **Components** - UI only, no business logic
- **Features** - Business logic, no UI
- **Lib** - Utilities and integrations
- **Models** - Type definitions only

### 2. Server Components by Default

- Use Server Components unless you need interactivity
- Client Components only when needed (`"use client"`)
- Fetch data in Server Components when possible

### 3. Type Safety

- All functions typed with TypeScript
- Zod schemas for runtime validation
- Type inference from schemas

### 4. Security First

- All API routes protected by middleware
- Input validation on all endpoints
- Server-side authentication checks
- No sensitive data in client components

---

## File Naming Conventions

### Components

- **PascalCase** - `Button.tsx`, `LoginForm.tsx`
- **Descriptive** - Clear what component does
- **Single responsibility** - One purpose per component

### Features

- **camelCase** - `login.ts`, `send-reset.ts`
- **Domain-based** - Grouped by feature area
- **No React** - `.ts` files only

### API Routes

- **kebab-case** - `route.ts` files in folders
- **RESTful** - Use HTTP methods correctly
- **Single endpoint** - One route.ts per endpoint

---

## Import Patterns

### Component Imports

```typescript
// Absolute imports using @ alias
import Button from "@/components/ui/Button";
import Header from "@/components/templates/Header";
```

### Feature Imports

```typescript
// From features/
import { signupUser } from "@/features/auth/signup";
import { createCheckoutSession } from "@/features/billing/server";
```

### Utility Imports

```typescript
// From lib/
import { getFirestoreInstance } from "@/lib/firebase/init";
import { apiPost } from "@/lib/api";
```

### Config Import

```typescript
import config from "@/config";
```

---

## Common Patterns

### Creating a New Component

1. Create file in appropriate folder:
   - UI component → `components/ui/`
   - Template component → `components/templates/`
   - Form component → `components/forms/`

2. Add TypeScript interface for props
3. Export component as default
4. Add to component documentation

### Creating a New API Route

1. Create folder: `app/api/your-endpoint/`
2. Create `route.ts` with handler functions
3. Add authentication if needed
4. Add input validation with Zod
5. Handle errors gracefully

### Creating a New Feature

1. Create folder: `features/your-feature/`
2. Add business logic files (`.ts` only)
3. Add Zod schemas for validation
4. Import from `lib/` for utilities
5. Use in API routes, not components

---

## Learn More

- **[First Steps](./first-steps)** - Making your first changes
- **[Configuration Guide](./configuration)** - Customizing settings
- **[Component Documentation](../components/overview)** - Component details
- **[Feature Documentation](../features/overview)** - Feature guides

---

## Tips

1. **Follow the patterns** - Existing code shows the way
2. **Keep it simple** - Don't over-engineer
3. **Type everything** - TypeScript catches errors early
4. **Read the comments** - ShipSafe code is well-commented
5. **Check the docs** - Component and feature docs have examples

---

## Summary

**Key Takeaways:**

- ✅ **`app/`** - Routes and pages (Next.js App Router)
- ✅ **`components/`** - UI components (organized by type)
- ✅ **`features/`** - Business logic (no React)
- ✅ **`lib/`** - Utilities and integrations
- ✅ **`models/`** - Type definitions

**Architecture:**
- Separation of concerns
- Server Components by default
- Type-safe throughout
- Security-first approach

You now understand the ShipSafe codebase structure! 🎉
