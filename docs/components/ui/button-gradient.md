# ButtonGradient

Gradient button component with branded styling, perfect for primary CTAs and hero sections.

**Location:** `src/components/ui/ButtonGradient.tsx`

## Overview

The ButtonGradient component is a styled button variant with a gradient background from primary to secondary colors. It's designed for prominent call-to-action buttons, especially in hero sections and landing pages. Includes loading states, multiple sizes, and full-width option.

## Quick Customization

This component is highly customizable:
- **Sizes** - 3 size options (sm, md, lg)
- **Loading state** - Shows spinner when `loading={true}`
- **Full width** - Toggle full-width button
- **Content** - Any React content
- **Event handlers** - Standard button event props (onClick, etc.)
- **Disabled state** - Standard disabled prop

## Usage

```tsx
import ButtonGradient from "@/components/ui/ButtonGradient";

<ButtonGradient>Click me</ButtonGradient>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `disabled` | `boolean` | `false` | Disable button |
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | Required | Button content |
| `onClick` | `function` | - | Click handler |
| `...props` | `ButtonHTMLAttributes` | - | All standard button props |

## Examples

### Basic Usage

```tsx
import ButtonGradient from "@/components/ui/ButtonGradient";

<ButtonGradient>Get Started</ButtonGradient>
```

### Size Variants

```tsx
// Small button
<ButtonGradient size="sm">Small</ButtonGradient>

// Medium button (default)
<ButtonGradient size="md">Medium</ButtonGradient>

// Large button
<ButtonGradient size="lg">Large</ButtonGradient>
```

### Loading State

```tsx
import { useState } from "react";

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Do async work...
    await fetchData();
    setIsLoading(false);
  };

  return (
    <ButtonGradient loading={isLoading} onClick={handleClick}>
      Submit
    </ButtonGradient>
  );
}
```

### Full Width

```tsx
// Full width button
<ButtonGradient fullWidth>Submit Form</ButtonGradient>

// Full width with size
<ButtonGradient fullWidth size="lg">Large Full Width</ButtonGradient>
```

### Common Use Cases

```tsx
// Hero section CTA
<ButtonGradient size="lg" onClick={handleGetStarted}>
  Get Started
</ButtonGradient>

// Form submission
<ButtonGradient 
  fullWidth 
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Submit
</ButtonGradient>

// With custom styling
<ButtonGradient className="shadow-lg">
  Custom Styled
</ButtonGradient>
```

## Component Structure

```tsx
interface ButtonGradientProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}
```

## Styling Notes

- **Gradient:** `bg-gradient-to-r from-primary to-secondary`
- **Text color:** White text (`text-white`)
- **Border:** No border (`border-none`)
- **Hover:** Opacity change (`hover:opacity-90`)
- **Transition:** Smooth opacity transition
- **Loading:** DaisyUI loading spinner when `loading={true}`

## Best Practices

1. **Primary CTAs** - Use for main action buttons, especially in hero sections
2. **Loading states** - Always show loading spinner during async operations
3. **Size choice** - Use `lg` for hero sections, `md` for forms, `sm` for inline actions
4. **Full width** - Use `fullWidth` in forms and narrow containers
5. **Accessibility** - Disable button during loading to prevent double-clicks

## Tips

- **Hero sections:** Use `size="lg"` for maximum impact
- **Forms:** Use `fullWidth` with `size="md"` for submit buttons
- **Loading:** Automatically disables button when `loading={true}`
- **Gradient colors:** Uses theme primary and secondary colors from DaisyUI config
- **Custom styling:** Add classes via `className` prop for additional styling

## Comparison with Base Button

| Feature | ButtonGradient | Button |
|---------|---------------|--------|
| Gradient background | ✅ Yes | ❌ No |
| Variants | ❌ Gradient only | ✅ Multiple |
| Sizes | ✅ sm, md, lg | ✅ xs, sm, md, lg |
| Loading state | ✅ Yes | ✅ Yes |
| Full width | ✅ Yes | ✅ Yes |

**When to use ButtonGradient:**
- Primary CTAs in hero sections
- Landing page call-to-action buttons
- Important action buttons that need visual prominence

**When to use Button:**
- Regular buttons throughout the app
- When you need different variants (outline, ghost, etc.)
- When gradient styling isn't desired

## Learn More

- [Button Component](./button) - Base button with more variants
- [ButtonCheckout Component](./button-checkout) - For Stripe checkout
- [Hero Component](../templates/hero) - Commonly uses ButtonGradient
- [CTA Component](../templates/cta) - Uses gradient buttons
