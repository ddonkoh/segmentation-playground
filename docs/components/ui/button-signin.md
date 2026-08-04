# ButtonSignin

Authentication button component that links to the login page with customizable text and styling.

**Location:** `src/components/ui/ButtonSignin.tsx`

## Overview

The ButtonSignin component is a simple link button that directs users to your authentication page. It's commonly used in headers, CTAs, and navigation areas. The button text and styling are customizable, and it automatically uses the login URL from `config.ts`.

## Quick Customization

This component is highly customizable:
- **Button text** - Customize the displayed text
- **Styling** - Add custom CSS classes via `extraStyle` prop
- **Login URL** - Configured automatically from `config.auth.loginUrl`
- **Link behavior** - Standard Next.js Link component

## Usage

```tsx
import ButtonSignin from "@/components/ui/ButtonSignin";

<ButtonSignin />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `"Get started"` | Button text content |
| `extraStyle` | `string` | `""` | Additional CSS classes |

## Examples

### Basic Usage

```tsx
import ButtonSignin from "@/components/ui/ButtonSignin";

// Default: "Get started" text
<ButtonSignin />

// Custom text
<ButtonSignin text="Sign In" />

// With primary button styling
<ButtonSignin extraStyle="btn-primary" />

// With custom styling
<ButtonSignin 
  text="Get Started" 
  extraStyle="btn-primary btn-lg" 
/>
```

### Common Use Cases

```tsx
// Header CTA
<ButtonSignin extraStyle="btn-primary" />

// Navigation link
<ButtonSignin text="Login" extraStyle="btn-ghost" />

// Hero section CTA
<ButtonSignin 
  text="Get Started" 
  extraStyle="btn-primary btn-lg" 
/>

// Footer link
<ButtonSignin text="Sign In" extraStyle="btn-link" />
```

## Setup

### Configure Login URL

The button automatically uses `config.auth.loginUrl`. Update in `config.ts`:

```typescript
// config.ts
const config = {
  auth: {
    loginUrl: "/auth", // Button links to this URL
    callbackUrl: "/dashboard",
    logoutRedirect: "/",
  },
  // ...
};
```

## Component Structure

```tsx
interface ButtonSigninProps {
  text?: string;
  extraStyle?: string;
}
```

**Default behavior:**
- Links to `config.auth.loginUrl` (typically `/auth`)
- Shows "Get started" text by default
- Uses Next.js `Link` component for client-side navigation

## Styling Notes

- **Base classes:** Uses DaisyUI `btn` class as base
- **Custom styling:** Add DaisyUI button classes via `extraStyle`
- **Common styles:** `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-lg`, etc.
- **Full control:** You can override all styling with `extraStyle`

## Best Practices

1. **Clear text** - Use action-oriented text ("Get Started", "Sign In", "Join Now")
2. **Consistent styling** - Use same button style across your app
3. **Primary CTAs** - Use `btn-primary` for main call-to-action buttons
4. **Header usage** - Often uses `btn-primary` in header navigation
5. **Accessibility** - Link includes proper href for screen readers

## Tips

- **Header button:** Usually `btn-primary` with default or custom text
- **Hero section:** Often `btn-primary btn-lg` for prominence
- **Footer:** May use `btn-link` or `btn-ghost` for subtle styling
- **Mobile:** Button adapts to container width automatically

## Learn More

- [Button Component](./button) - Base button component with more features
- [ButtonCheckout Component](./button-checkout) - For Stripe checkout buttons
- [Header Component](../templates/header) - Commonly uses ButtonSignin
- [Authentication Features](../../features/authentication) - Auth setup guide
