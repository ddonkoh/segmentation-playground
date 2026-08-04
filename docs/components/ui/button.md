# Button

Reusable button component with multiple variants, sizes, and loading states.

**Location:** `src/components/ui/Button.tsx`

## Description

A flexible button component built on top of DaisyUI's button classes. Supports multiple variants, sizes, loading states, and full customization. Use this as your base button component throughout the app.

## Usage

```tsx
import Button from "@/components/ui/Button";

<Button variant="primary">Click me</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger"` | `"primary"` | Button style variant |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `disabled` | `boolean` | `false` | Disable button |
| `className` | `string` | `""` | Additional CSS classes |
| `onClick` | `function` | - | Click handler |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Button HTML type |

## Variants

- **`primary`** - Main action button (brand color)
- **`secondary`** - Secondary action button
- **`outline`** - Outlined button with border
- **`ghost`** - Subtle button with no background
- **`danger`** - Error/destructive action (red)

## Sizes

- **`xs`** - Extra small
- **`sm`** - Small
- **`md`** - Medium (default)
- **`lg`** - Large

## Examples

```tsx
// Primary button (default)
<Button variant="primary">Get Started</Button>

// Secondary button
<Button variant="secondary">Learn More</Button>

// Outline button
<Button variant="outline">Cancel</Button>

// Large button
<Button variant="primary" size="lg">Sign Up</Button>

// Loading state
<Button variant="primary" loading>Processing...</Button>

// Full width button
<Button variant="primary" fullWidth>Submit</Button>

// Disabled button
<Button variant="primary" disabled>Unavailable</Button>

// Custom styling
<Button variant="primary" className="w-full max-w-xs">
  Custom Width
</Button>
```

## Features

- **Loading state** - Automatically shows spinner when `loading={true}`
- **Hover effects** - Subtle scale animation on hover
- **Disabled state** - Properly disabled with visual feedback
- **Type-safe** - Full TypeScript support

## Tips

- Use `primary` variant for main CTAs (Sign Up, Get Started, etc.)
- Use `secondary` or `outline` for secondary actions
- Use `ghost` for subtle actions (like "Skip" or "Cancel")
- Use `loading` prop instead of manually managing loading state
- Use `fullWidth` for buttons in forms or modal footers
- Combine with DaisyUI utility classes for spacing: `className="mb-4"`

## Customization

The component uses DaisyUI button classes. To customize:
1. Modify the `variantClasses` object to change button colors
2. Add new variants by extending the `ButtonProps` interface
3. Override styles with `className` prop

## Learn More

- [ButtonCheckout](./button-checkout) - Stripe checkout button
- [ButtonSignin](./button-signin) - Authentication button
- [ButtonGradient](./button-gradient) - Gradient button variant

