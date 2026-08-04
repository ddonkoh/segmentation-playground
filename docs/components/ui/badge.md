# Badge

Badge component for status indicators and labels with customizable variants, sizes, and styles.

**Location:** `src/components/ui/Badge.tsx`

## Overview

The Badge component is a flexible label component for displaying status indicators, tags, or labels. It supports multiple color variants, sizes, and outline styles, all built on DaisyUI's badge classes for consistent styling across your application.

## Quick Customization

This component is highly customizable:
- **Variants** - 9 color variants (primary, secondary, accent, success, warning, error, info, neutral, ghost)
- **Sizes** - 4 size options (xs, sm, md, lg)
- **Outline style** - Toggle outlined vs filled badges
- **Content** - Any text or React content
- **Styling** - Additional CSS classes for custom styling

## Usage

```tsx
import Badge from "@/components/ui/Badge";

<Badge variant="success">Active</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "accent" \| "success" \| "warning" \| "error" \| "info" \| "neutral" \| "ghost"` | `"neutral"` | Badge color variant |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | Badge size |
| `outline` | `boolean` | `false` | Whether badge is outlined |
| `children` | `ReactNode` | Required | Badge content |
| `className` | `string` | `""` | Additional CSS classes |

## Variants

### Color Variants

```tsx
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="neutral">Neutral</Badge>
<Badge variant="ghost">Ghost</Badge>
```

### Size Variants

```tsx
<Badge size="xs">Extra Small</Badge>
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### Outline Style

```tsx
<Badge variant="primary" outline>Outlined</Badge>
<Badge variant="primary">Filled</Badge>
```

## Examples

### Basic Usage

```tsx
import Badge from "@/components/ui/Badge";

// Simple badge
<Badge>Default</Badge>

// Status indicator
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
```

### Size Examples

```tsx
// Different sizes
<Badge size="xs" variant="info">XS</Badge>
<Badge size="sm" variant="info">Small</Badge>
<Badge size="md" variant="info">Medium</Badge>
<Badge size="lg" variant="info">Large</Badge>
```

### Outline Badges

```tsx
// Outlined badges (subtle)
<Badge variant="primary" outline>Outlined Primary</Badge>
<Badge variant="success" outline>Outlined Success</Badge>
<Badge variant="warning" outline>Outlined Warning</Badge>
```

### Custom Styling

```tsx
// With custom classes
<Badge 
  variant="primary" 
  className="font-bold uppercase tracking-wide"
>
  Custom Style
</Badge>

// With spacing
<Badge variant="info" className="ml-2">With Margin</Badge>
```

### Common Use Cases

```tsx
// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending Review</Badge>
<Badge variant="error">Inactive</Badge>

// Category tags
<Badge variant="primary" outline>Category</Badge>
<Badge variant="secondary" outline>Tag</Badge>

// Count badges
<Badge variant="error" size="sm">5</Badge>
<Badge variant="info" size="lg">99+</Badge>

// Feature flags
<Badge variant="success" size="xs">New</Badge>
<Badge variant="warning" size="xs">Beta</Badge>
```

## Component Structure

```tsx
interface BadgeProps {
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "info" | "neutral" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  outline?: boolean;
  children: ReactNode;
  className?: string;
}
```

## Styling Notes

- **Base classes:** Uses DaisyUI `badge` class
- **Variants:** DaisyUI variant classes (`badge-primary`, `badge-success`, etc.)
- **Sizes:** DaisyUI size classes (`badge-xs`, `badge-sm`, `badge-lg`)
- **Outline:** DaisyUI `badge-outline` class when `outline={true}`
- **Hover effect:** Includes `hover:scale-105` for subtle interaction
- **Transitions:** Smooth transitions for all state changes

## Best Practices

1. **Use semantic variants** - Match variant to meaning (success for success states, error for errors)
2. **Keep content short** - Badges work best with 1-3 words
3. **Consistent sizing** - Use `sm` or `md` for most cases, `xs` for tight spaces, `lg` for emphasis
4. **Accessibility** - Badges are decorative; add ARIA labels if they convey important information
5. **Color contrast** - Ensure text is readable against badge background

## Tips

- **Status indicators:** Use `success`, `warning`, `error` for status badges
- **Subtle badges:** Use `outline` prop for less prominent badges
- **Tight spaces:** Use `size="xs"` when space is limited
- **Prominence:** Use larger sizes (`lg`) for important badges
- **Customization:** Combine `className` prop with variants for unique styling

## Learn More

- [Card Component](./card) - Often used with badges for status indicators
- [Button Component](./button) - Can include badges for notifications
- [UI Components Overview](../overview) - All available UI components
