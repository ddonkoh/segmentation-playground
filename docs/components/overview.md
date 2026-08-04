# Components

Complete documentation of all ShipSafe components.

## Overview

ShipSafe includes a comprehensive set of pre-built components organized into three categories: UI components (primitives), template components (page-level), and form components (inputs with validation).

**Component categories:**
- **UI Components** - Reusable primitives (buttons, cards, inputs)
- **Template Components** - Complete page sections (hero, pricing, footer)
- **Form Components** - Form inputs with validation (login, signup)

---

## UI Components

Reusable UI primitives for building interfaces.

**Location:** `src/components/ui/`

### Buttons

- **[Button](./ui/button)** - Primary button component with variants
- **[ButtonCheckout](./ui/button-checkout)** - Stripe checkout button
- **[ButtonSignin](./ui/button-signin)** - Authentication button
- **[ButtonGradient](./ui/button-gradient)** - Gradient button variant

### Form Elements

- **[Input](./ui/input)** - Form input component with validation states
- **[Card](./ui/card)** - Container component for content

### Display Components

- **[Badge](./ui/badge)** - Label/tag component
- **[Modal](./ui/modal)** - Dialog component
- **[Loader](./ui/loader)** - Loading spinner

### Branding

- **[Logo](./ui/logo)** - Logo component with variants
- **[BuiltWithShipSafe](./ui/built-with-shipsafe)** - Attribution badge

### Social Proof

- **[TestimonialsAvatars](./ui/testimonials-avatars)** - Social proof component

**See:** [UI Components Overview](./ui/overview) for complete list

---

## Template Components

Page-level components for building complete pages.

**Location:** `src/components/templates/`

### Navigation & Header

- **[Header](./templates/header)** - Navigation header with logo and links

### Landing Page Sections

- **[Hero](./templates/hero)** - Hero section with CTA
- **[Problem](./templates/problem)** - Problem showcase section
- **[FeaturesGrid](./templates/features-grid)** - Features grid layout
- **[FeaturesListicle](./templates/features-listicle)** - Interactive features list

### Social Proof

- **[Testimonial](./templates/testimonial)** - Testimonials carousel

### Pricing & Conversion

- **[Pricing](./templates/pricing)** - Pricing table with plans
- **[FAQ](./templates/faq)** - FAQ accordion
- **[CTA](./templates/cta)** - Call-to-action section

### Footer

- **[Footer](./templates/footer)** - Site footer with links

**See:** [Template Components Overview](./templates/overview) for complete list

---

## Form Components

Form components with built-in validation.

**Location:** `src/components/forms/`

- **[LoginForm](./forms/login-form)** - Email/password login form
- **[SignupForm](./forms/signup-form)** - User registration form

**See:** [Form Components Overview](./forms/overview) for complete list

---

## Component Usage Patterns

### Basic Usage

```tsx
import Button from "@/components/ui/Button";
import Hero from "@/components/templates/Hero";

export default function Page() {
  return (
    <div>
      <Hero />
      <Button>Click me</Button>
    </div>
  );
}
```

### With Props

```tsx
import Pricing from "@/components/templates/Pricing";
import config from "@/config";

export default function PricingPage() {
  return <Pricing plans={config.stripe.plans} />;
}
```

### Customization

All components are designed to be customizable:

- **Props** - Pass custom data and configuration
- **Styling** - Use Tailwind classes or DaisyUI themes
- **Composition** - Combine components to build pages

---

## Component Architecture

### Design Principles

1. **TypeScript First** - All components have TypeScript interfaces
2. **Config-Driven** - Components read from `config.ts`
3. **Responsive** - Mobile-first, works on all screen sizes
4. **Accessible** - Semantic HTML and ARIA attributes
5. **Customizable** - Easy to modify and extend

### File Structure

Components are organized into three main categories:

**`src/components/`**
- **`ui/`** - Reusable UI primitives (Button, Input, Card, Badge, Modal, etc.)
- **`templates/`** - Page-level template components (Hero, Pricing, FAQ, Footer, etc.)
- **`forms/`** - Form components with validation (Login, Signup, etc.)

### Component Pattern

```tsx
// Component structure
interface ComponentProps {
  // Props definition
}

export default function Component({ ...props }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

---

## Best Practices

1. **Use TypeScript** - Always define prop interfaces
2. **Read from Config** - Use `config.ts` for app-wide values
3. **Make Responsive** - Use Tailwind breakpoints
4. **Follow Patterns** - Use existing components as examples
5. **Keep Simple** - One component, one purpose

---

## Customization Guide

### Quick Customization

1. **Change content:** Update props or component content
2. **Change styling:** Modify Tailwind classes
3. **Change theme:** Update DaisyUI theme in `config.ts`

### Deep Customization

1. **Modify component:** Edit component file directly
2. **Create variant:** Copy component and modify
3. **Build new:** Use existing components as reference

**See:** [Custom Components Tutorial](../tutorials/custom-components)

---

## Component Reference

### By Use Case

**Landing Pages:**
- Hero, Problem, FeaturesGrid, Testimonial, Pricing, FAQ, CTA, Footer

**Authentication:**
- LoginForm, SignupForm, ButtonSignin

**Payments:**
- ButtonCheckout, Pricing

**General UI:**
- Button, Input, Card, Badge, Modal, Loader

---

## Related Documentation

- **[Tutorials](../tutorials/overview)** - Learn to use components
- **[Custom Components Tutorial](../tutorials/custom-components)** - Build your own
- **[Configuration](../get-started/configuration)** - Configure components
- **[Branding](../extras/branding)** - Customize branding

---

**Ready to use components?** Check the specific component documentation or start with [Ship in 5 Minutes Tutorial](../tutorials/ship-in-5-minutes)!
