# Custom Components Tutorial

Complete guide to building reusable components following ShipSafe patterns and conventions.

## Overview

This tutorial covers creating custom components that integrate seamlessly with ShipSafe's architecture, styling, and conventions.

**What You'll Learn:**
- Component structure and organization
- TypeScript typing patterns
- DaisyUI/TailwindCSS styling
- Server vs Client Components
- Boilerplate comments and documentation

## Component Organization

### Directory Structure

Components are organized by type:

**`src/components/`**
- **`ui/`** - Reusable UI primitives (Button, Card, Input, etc.)
- **`templates/`** - Page-level components (Header, Hero, Pricing, etc.)
- **`forms/`** - Form components (LoginForm, SignupForm)
- **`layouts/`** - Layout components (ClientLayout)

**Where to Create:**
- **UI components** → `src/components/ui/YourComponent.tsx`
- **Template components** → `src/components/templates/YourComponent.tsx`
- **Form components** → `src/components/forms/YourComponent.tsx`
- **Layout components** → `src/components/layouts/YourComponent.tsx`

## Component Structure

### Standard Component Template

```tsx
/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — YourComponent.tsx
 * -----------------------------------------------------------------------------
 * 
 * Brief description of what this component does.
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * 
 * Usage:
 *   <YourComponent prop1="value" prop2={123} />
 * 
 * Customisation:
 * - List key customization points
 * - Props that can be adjusted
 * 
 * This is a Client Component ("use client") because it uses:
 * - useState/useEffect for interactivity
 * OR
 * This is a Server Component (no "use client") because it:
 * - Has no client-side interactivity
 * 
 * Styling Notes:
 * - Uses DaisyUI classes
 * - Responsive with Tailwind breakpoints
 * 
 * -----------------------------------------------------------------------------
 */

"use client"; // Remove if Server Component

import { useState } from "react";
import type { ReactNode } from "react";

export interface YourComponentProps {
  /**
   * Description of prop
   */
  prop1: string;
  
  /**
   * Optional prop
   */
  prop2?: number;
  
  /**
   * Children content
   */
  children?: ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * YourComponent description.
 */
export default function YourComponent({
  prop1,
  prop2 = 10,
  children,
  className = "",
}: YourComponentProps) {
  // Component logic here

  return (
    <div className={`base-classes ${className}`.trim()}>
      {/* Component JSX */}
    </div>
  );
}
```

## UI Component Example

### Simple Button Component

```tsx
"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  // Variant classes mapping
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "btn-ghost",
    danger: "btn-error",
  };

  // Size classes mapping
  const sizeClasses = {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  // Combine classes
  const baseClasses = "btn transition-all duration-200";
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const widthClass = fullWidth ? "w-full" : "";
  const loadingClass = loading ? "loading" : "";

  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    widthClass,
    loadingClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
```

**Key Features:**
- ✅ Extends HTML button attributes (`ButtonHTMLAttributes`)
- ✅ Variant and size props for customization
- ✅ Loading state support
- ✅ Spreads remaining props for flexibility
- ✅ Uses DaisyUI classes

## Template Component Example

### Server Component Hero

```tsx
/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — Hero.tsx
 * -----------------------------------------------------------------------------
 * 
 * Hero section component with headline, description, CTA button, and image.
 * 
 * Reason:
 * The hero section is the first thing users see when they land on your site.
 * It's the main marketing section that communicates your value proposition.
 * 
 * Features:
 * - Responsive layout (stacked on mobile, side-by-side on desktop)
 * - Clean, simple design
 * - Product demo image
 * 
 * Usage:
 *   <Hero />
 * 
 * Customisation:
 * - Update heading and description text
 * - Change button text and href
 * - Replace image with your product demo
 * 
 * This is a Server Component (no "use client") because it doesn't need
 * client-side interactivity. All content is static.
 * 
 * -----------------------------------------------------------------------------
 */

import Image from "next/image";
import Link from "next/link";
import config from "@/config";

/**
 * Hero section component.
 */
const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-8 py-12 lg:py-24">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* Left: Content */}
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-4">
            Your Amazing Product
          </h1>
          <p className="text-xl text-base-content/70 mb-8">
            Your compelling value proposition.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Get Started
          </Link>
        </div>

        {/* Right: Image */}
        <div className="flex-1">
          <Image
            src="/hero-image.png"
            alt="Product demo"
            width={600}
            height={400}
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

**Key Features:**
- ✅ Server Component (no "use client")
- ✅ Uses Next.js `Image` and `Link`
- ✅ Responsive with Tailwind classes
- ✅ Well-commented for customization

## Client vs Server Components

### When to Use "use client"

**Use Client Component when:**
- Using React hooks (`useState`, `useEffect`, `useCallback`, etc.)
- Handling user interactions (clicks, form inputs, etc.)
- Using browser APIs (localStorage, window, etc.)
- Managing client-side state

```tsx
"use client";

import { useState } from "react";

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### When to Use Server Component

**Use Server Component when:**
- Rendering static content
- Fetching data server-side
- No client-side interactivity needed
- Better performance (smaller bundle)

```tsx
// No "use client" - Server Component

import { getFirestoreInstance } from "@/lib/firebase/init";

export default async function DataComponent() {
  const firestore = getFirestoreInstance();
  const data = await firestore.collection("items").get();

  return (
    <div>
      {data.docs.map(doc => (
        <div key={doc.id}>{doc.data().name}</div>
      ))}
    </div>
  );
}
```

## TypeScript Patterns

### Props Interface

```tsx
export interface ComponentProps {
  /**
   * Required string prop
   */
  title: string;

  /**
   * Optional number prop
   */
  count?: number;

  /**
   * Optional callback function
   */
  onClick?: () => void;

  /**
   * React children
   */
  children?: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

### Extending HTML Attributes

```tsx
import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  // ... other custom props
}
```

### Generic Components

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

## Styling Patterns

### DaisyUI Classes

ShipSafe uses DaisyUI for consistent styling:

```tsx
// Button variants
className="btn btn-primary"
className="btn btn-secondary"
className="btn btn-outline"

// Card components
className="card bg-base-100 shadow-xl"

// Form inputs
className="input input-bordered"

// Badges
className="badge badge-primary"
```

### Tailwind Utilities

Combine DaisyUI with Tailwind utilities:

```tsx
className="btn btn-primary w-full md:w-auto" // Full width on mobile
className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
className="input input-bordered focus:input-primary"
```

### Responsive Design

```tsx
// Mobile-first approach
className="text-sm md:text-base lg:text-lg"
className="flex flex-col md:flex-row"
className="p-4 md:p-8 lg:p-12"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

## Common Patterns

### Conditional Rendering

```tsx
{loading && <Loader />}
{error && <div className="alert alert-error">{error}</div>}
{user ? <UserProfile user={user} /> : <LoginButton />}
```

### Loading States

```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center p-8">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}
```

### Error States

```tsx
if (error) {
  return (
    <div className="alert alert-error">
      <span>{error.message}</span>
    </div>
  );
}
```

### Empty States

```tsx
if (items.length === 0) {
  return (
    <div className="text-center p-8 text-base-content/70">
      No items found.
    </div>
  );
}
```

## Best Practices

### 1. Use TypeScript Interfaces

✅ **Do:**
```tsx
export interface ComponentProps {
  title: string;
  count?: number;
}
```

❌ **Don't:**
```tsx
// Avoid any types
props: any
```

### 2. Add Boilerplate Comments

✅ **Do:**
```tsx
/**
 * Component description
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 */
```

### 3. Export Default

✅ **Do:**
```tsx
export default function MyComponent() {}
```

### 4. Use Descriptive Names

✅ **Do:**
```tsx
<UserProfileCard />
<SubscriptionStatusBadge />
```

❌ **Don't:**
```tsx
<Card1 />
<Component />
```

### 5. Keep Components Focused

✅ **Do:**
- One component = one purpose
- Keep components small and focused
- Extract reusable logic into hooks

❌ **Don't:**
- Create mega-components that do everything
- Mix concerns

### 6. Use CSS Classes, Not Inline Styles

✅ **Do:**
```tsx
<div className="text-center p-8 bg-base-200">
```

❌ **Don't:**
```tsx
<div style={{ textAlign: "center", padding: "2rem" }}>
```

## Example: Complete Card Component

```tsx
/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — Card.tsx
 * -----------------------------------------------------------------------------
 * 
 * Reusable card component with header, body, and footer sections.
 * 
 * Features:
 * - Optional header and footer
 * - Flexible content area
 * - Hover effects
 * - Responsive padding
 * 
 * Usage:
 *   <Card>
 *     <Card.Header>Title</Card.Header>
 *     <Card.Body>Content</Card.Body>
 *     <Card.Footer>Actions</Card.Footer>
 *   </Card>
 * 
 * -----------------------------------------------------------------------------
 */

import { ReactNode } from "react";

export interface CardProps {
  /**
   * Card content (can include Card.Header, Card.Body, Card.Footer)
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Enable hover shadow effect
   */
  hover?: boolean;
}

/**
 * Main Card component.
 */
function Card({ children, className = "", hover = false }: CardProps) {
  const baseClasses = "card bg-base-100 shadow-xl";
  const hoverClass = hover ? "hover:shadow-2xl transition-shadow duration-200" : "";

  return (
    <div className={`${baseClasses} ${hoverClass} ${className}`.trim()}>
      {children}
    </div>
  );
}

/**
 * Card header section.
 */
function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card-header ${className}`.trim()}>
      {children}
    </div>
  );
}

/**
 * Card body section.
 */
function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card-body ${className}`.trim()}>
      {children}
    </div>
  );
}

/**
 * Card footer section.
 */
function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card-footer ${className}`.trim()}>
      {children}
    </div>
  );
}

// Attach sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
```

**Usage:**
```tsx
<Card hover>
  <Card.Header>
    <h2 className="card-title">Card Title</h2>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here.</p>
  </Card.Body>
  <Card.Footer>
    <button className="btn btn-primary">Action</button>
  </Card.Footer>
</Card>
```

## Testing Components

### Component Structure Checklist

- ✅ TypeScript interface for props
- ✅ Boilerplate comments
- ✅ Default export
- ✅ Proper component organization (ui/templates/forms)
- ✅ Responsive design
- ✅ Error/loading/empty states
- ✅ Accessibility (ARIA labels, semantic HTML)

## Learn More

- [Component Documentation](../components/overview) - All components
- [UI Components](../components/ui/overview) - UI component examples
- [Template Components](../components/templates/overview) - Template component examples
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - Tailwind utilities
- [DaisyUI Documentation](https://daisyui.com/components/) - DaisyUI components
