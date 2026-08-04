# Loader

Loading spinner component with multiple sizes and full-page overlay option.

**Location:** `src/components/ui/Loader.tsx`

## Overview

The Loader component displays a spinning indicator for loading states. It supports multiple sizes and can be displayed inline or as a full-page overlay. Built on DaisyUI's loading spinner classes for consistent styling.

## Quick Customization

This component is highly customizable:
- **Sizes** - 4 size options (xs, sm, md, lg)
- **Full page** - Toggle full-page overlay mode
- **Loading text** - Optional text below spinner
- **Styling** - Uses DaisyUI classes, customizable via props

## Usage

```tsx
import Loader from "@/components/ui/Loader";

<Loader />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | Loader spinner size |
| `fullPage` | `boolean` | `false` | Display as full-page overlay |
| `text` | `string` | `undefined` | Optional loading text below spinner |

## Examples

### Basic Usage

```tsx
import Loader from "@/components/ui/Loader";

// Inline loader (default)
<Loader />

// With loading text
<Loader text="Loading..." />
```

### Size Variants

```tsx
// Extra small
<Loader size="xs" />

// Small
<Loader size="sm" />

// Medium (default)
<Loader size="md" />

// Large
<Loader size="lg" />
```

### Full Page Loader

```tsx
import Loader from "@/components/ui/Loader";

// Full-page overlay with backdrop
<Loader fullPage text="Loading content..." />
```

### Common Use Cases

```tsx
// Button loading state (use size="xs" or "sm")
<button disabled>
  <Loader size="xs" />
  Processing...
</button>

// Page loading
{isLoading && <Loader fullPage text="Loading page..." />}

// Data fetching
{isLoading ? (
  <Loader text="Fetching data..." />
) : (
  <DataComponent data={data} />
)}

// Form submission
{isSubmitting && <Loader size="sm" text="Submitting..." />}
```

## Component Structure

```tsx
interface LoaderProps {
  size?: "xs" | "sm" | "md" | "lg";
  fullPage?: boolean;
  text?: string;
}
```

## Styling Notes

- **Base classes:** Uses DaisyUI `loading loading-spinner` classes
- **Sizes:** DaisyUI size classes (`loading-xs`, `loading-sm`, `loading-md`, `loading-lg`)
- **Color:** Primary color (`text-primary`) for spinner
- **Full page:** Dark backdrop with blur (`bg-base-100/80 backdrop-blur-sm`)
- **Animation:** Smooth fade-in animation for full-page mode

## Best Practices

1. **Use appropriate sizes** - `xs` or `sm` for buttons, `md` or `lg` for page sections
2. **Provide context** - Use `text` prop to explain what's loading
3. **Full page sparingly** - Only use `fullPage` for major page transitions
4. **Replace content** - Replace content area with loader, don't overlay
5. **Accessibility** - Loaders are decorative; use ARIA labels for screen readers if needed

## Tips

- **Button loading:** Use `size="xs"` or `size="sm"` inside buttons
- **Section loading:** Use `size="md"` (default) for content areas
- **Page loading:** Use `fullPage={true}` for page transitions
- **Text clarity:** Keep loading text short and descriptive
- **Color:** Spinner uses primary color by default

## Learn More

- [Button Component](./button) - Has built-in loading state
- [Card Component](./card) - Often shows loader while loading content
- [UI Components Overview](../overview) - All available UI components
