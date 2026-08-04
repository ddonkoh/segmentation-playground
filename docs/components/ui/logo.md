# Logo

Logo component displaying your app logo and name with configurable size and variant.

**Location:** `src/components/ui/Logo.tsx`

## Overview

The Logo component displays your app's logo image and name together. It automatically uses logo files from the `/public` folder and supports multiple sizes and color variants (default and white). The component links to the homepage and uses the app name from `config.ts`.

## Quick Customization

This component is highly customizable:
- **Sizes** - 3 size options (sm, md, lg)
- **Variants** - Default (dark) or white variant for dark backgrounds
- **Logo files** - Replace `/logo.svg` and `/logo_w.svg` in public folder
- **App name** - Uses `config.appName` automatically
- **Styling** - Additional CSS classes for custom styling

## Usage

```tsx
import Logo from "@/components/ui/Logo";

<Logo />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Logo size |
| `variant` | `"default" \| "white"` | `"default"` | Logo color variant |
| `className` | `string` | `""` | Additional CSS classes |

## Examples

### Basic Usage

```tsx
import Logo from "@/components/ui/Logo";

// Default logo (dark variant)
<Logo />

// White logo variant (for dark backgrounds)
<Logo variant="white" />
```

### Size Variants

```tsx
// Small logo
<Logo size="sm" />

// Medium logo (default)
<Logo size="md" />

// Large logo
<Logo size="lg" />
```

### Variant Examples

```tsx
// Default variant (dark logo)
// Uses /logo.svg
<Logo variant="default" />

// White variant (light logo for dark backgrounds)
// Uses /logo_w.svg
<Logo variant="white" />
```

### Common Use Cases

```tsx
// Header logo (default, medium size)
<Logo />

// Footer logo (white variant, small size)
<Logo variant="white" size="sm" />

// Dark background (white variant)
<header className="bg-base-200">
  <Logo variant="white" />
</header>

// Light background (default variant)
<header className="bg-base-100">
  <Logo variant="default" />
</header>

// Custom styling
<Logo className="hover:opacity-80 transition-opacity" />
```

## Setup

### 1. Add Logo Files

Add your logo files to the `public/` folder:

```
public/
  logo.svg      # Default logo (for light backgrounds)
  logo_w.svg    # White logo (for dark backgrounds)
```

**File requirements:**
- SVG format recommended (scales perfectly)
- PNG format also works
- Ensure both variants match in design (just color difference)

### 2. Configure App Name

The logo uses `config.appName` automatically. Update in `config.ts`:

```typescript
// config.ts
const config = {
  appName: "Your App Name", // This appears next to the logo
  // ...
};
```

## Component Structure

```tsx
interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
  className?: string;
}
```

**Size behavior:**
- `sm`: Logo 24px, text `text-base`
- `md`: Logo 32px, text `text-lg` (default)
- `lg`: Logo 40px, text `text-xl`

**Variant behavior:**
- `default`: Uses `/logo.svg` (dark logo for light backgrounds)
- `white`: Uses `/logo_w.svg` (light logo for dark backgrounds)

## Styling Notes

- **Logo image:** Uses Next.js `Image` component for optimization
- **Text:** Uses `font-extrabold` for app name
- **Link:** Wraps logo and text in a `Link` to homepage
- **Priority:** Logo images use `priority` for faster loading
- **Responsive:** Adapts to container size

## Best Practices

1. **Match backgrounds** - Use `variant="white"` on dark backgrounds, `variant="default"` on light
2. **Consistent sizing** - Use same size across your app (typically `md`)
3. **SVG format** - Prefer SVG for crisp logos at any size
4. **Both variants** - Provide both logo variants for flexibility
5. **Homepage link** - Component links to `/` (homepage) by default

## Tips

- **Header:** Usually `size="md"` with appropriate variant for header background
- **Footer:** Often `size="sm"` with `variant="white"` for dark footers
- **Responsive:** Logo sizes adapt automatically to container
- **Custom styling:** Use `className` prop to add margins, hover effects, etc.
- **Accessibility:** Component includes proper alt text and title attributes

## Learn More

- [Header Component](../templates/header) - Uses Logo component
- [Footer Component](../templates/footer) - Uses Logo component
- [UI Components Overview](../overview) - All available UI components
