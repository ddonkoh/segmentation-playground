# Custom Themes

Complete guide to creating and customizing DaisyUI themes in ShipSafe.

## Overview

ShipSafe uses DaisyUI for theming, which provides a consistent design system with built-in themes and the ability to create custom themes. This guide covers how to use existing themes and create your own.

**What you'll learn:**
- Using existing DaisyUI themes
- Creating custom themes
- Theme color structure
- Applying themes to your app
- Dark/light mode support

---

## Using Existing Themes

### Available DaisyUI Themes

DaisyUI comes with many pre-built themes. Popular options include:

- `light` - Light mode theme
- `dark` - Dark mode theme
- `cupcake` - Soft pastel colors
- `corporate` - Professional blue theme
- `synthwave` - Neon retro theme
- `forest` - Green nature theme
- `luxury` - Gold and purple theme
- `dracula` - Dark purple theme
- And many more...

**See all themes:** [DaisyUI Themes Documentation](https://daisyui.com/docs/themes/)

### Change Theme in config.ts

**Current setup:**

```typescript
// config.ts
colors: {
  /**
   * DaisyUI theme name.
   * Change requires matching theme added inside tailwind.config.ts.
   */
  theme: "dark",

  /**
   * Main accent color.
   * Used for:
   *  - Progress/loading bars
   *  - Browser tab theme color
   *  - Default button color (when applicable)
   * 
   * Uses the primary color from the DaisyUI theme dynamically via CSS variable.
   * You can also use a custom HEX color like: main: "#f37055"
   */
  main: "hsl(var(--p))", // Uses the primary color from the DaisyUI theme dynamically
},
```

**To use a different theme:**

1. **Add theme to tailwind.config.ts:**
   ```typescript
   // tailwind.config.ts
   daisyui: {
     themes: ["light", "dark", "cupcake"], // Add your theme here
     styled: true,
     logs: false,
   },
   ```

2. **Update config.ts:**
   ```typescript
   // config.ts
   colors: {
     theme: "cupcake", // Change to your desired theme
     main: "hsl(var(--p))", // Uses primary color from theme
   }
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

---

## Creating Custom Themes

### Theme Color Structure

DaisyUI themes use a standard color structure:

```typescript
{
  themeName: {
    // Brand colors
    primary: "#your-primary-color",      // Main brand color
    secondary: "#your-secondary-color",   // Secondary brand color
    accent: "#your-accent-color",         // Accent/highlight color
    
    // Neutral colors
    neutral: "#your-neutral-color",       // Neutral gray
    "base-100": "#your-background",       // Main background
    "base-200": "#your-secondary-bg",     // Secondary background
    "base-300": "#your-tertiary-bg",     // Tertiary background
    
    // Status colors
    info: "#your-info-color",             // Info/blue
    success: "#your-success-color",       // Success/green
    warning: "#your-warning-color",       // Warning/yellow
    error: "#your-error-color",          // Error/red
  }
}
```

### Step-by-Step: Create Custom Theme

**1. Define your theme in tailwind.config.ts:**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config = {
  // ... other config ...
  
  plugins: [require("daisyui")],
  
  daisyui: {
    themes: [
      {
        mybrand: {
          // Brand colors
          primary: "#3B82F6",        // Blue
          secondary: "#8B5CF6",      // Purple
          accent: "#10B981",         // Green
          
          // Neutral colors
          neutral: "#1F2937",        // Dark gray
          "base-100": "#FFFFFF",      // White background
          "base-200": "#F3F4F6",     // Light gray background
          "base-300": "#E5E7EB",     // Lighter gray background
          
          // Status colors
          info: "#3B82F6",           // Blue
          success: "#10B981",         // Green
          warning: "#F59E0B",        // Orange
          error: "#EF4444",          // Red
        }
      },
      // Keep existing themes if you want
      "light",
      "dark",
    ],
    styled: true,
    logs: false,
  },
} as Config;

export default config;
```

**2. Update config.ts to use your theme:**

```typescript
// config.ts
colors: {
  theme: "mybrand", // Your custom theme name
  main: "#3B82F6",  // Or use CSS variable: "hsl(var(--p))"
}
```

**3. Restart your dev server:**

```bash
npm run dev
```

---

## Theme Color Reference

### Required Colors

These colors are used throughout DaisyUI components:

| Color | Usage | Example |
|-------|-------|---------|
| `primary` | Primary buttons, links, brand elements | `#3B82F6` |
| `secondary` | Secondary buttons, accents | `#8B5CF6` |
| `accent` | Highlights, call-to-actions | `#10B981` |
| `neutral` | Text, borders, subtle elements | `#1F2937` |
| `base-100` | Main background color | `#FFFFFF` or `#1A1A1A` |
| `base-200` | Card backgrounds, elevated surfaces | `#F3F4F6` or `#2A2A2A` |
| `base-300` | Subtle backgrounds, dividers | `#E5E7EB` or `#3A3A3A` |

### Status Colors

Used for alerts, badges, and status indicators:

| Color | Usage | Example |
|-------|-------|---------|
| `info` | Information messages | `#3B82F6` (blue) |
| `success` | Success messages, confirmations | `#10B981` (green) |
| `warning` | Warning messages | `#F59E0B` (orange) |
| `error` | Error messages, destructive actions | `#EF4444` (red) |

---

## Dark/Light Mode Support

### Option 1: Separate Themes

Create separate themes for dark and light modes:

```typescript
// tailwind.config.ts
daisyui: {
  themes: [
    {
      light: {
        primary: "#3B82F6",
        "base-100": "#FFFFFF",
        "base-200": "#F3F4F6",
        // ... light theme colors
      }
    },
    {
      dark: {
        primary: "#60A5FA",
        "base-100": "#1A1A1A",
        "base-200": "#2A2A2A",
        // ... dark theme colors
      }
    }
  ],
}
```

**Switch themes programmatically:**

```typescript
// In your component or layout
import { useEffect } from "react";

useEffect(() => {
  const html = document.documentElement;
  html.setAttribute("data-theme", "dark"); // or "light"
}, []);
```

### Option 2: Single Theme with CSS Variables

Use CSS variables for dynamic theming:

```typescript
// tailwind.config.ts
daisyui: {
  themes: [
    {
      mytheme: {
        primary: "hsl(var(--color-primary))",
        "base-100": "hsl(var(--color-bg))",
        // ... use CSS variables
      }
    }
  ],
}
```

Then define variables in your CSS:

```css
:root {
  --color-primary: 217 91% 60%;
  --color-bg: 0 0% 100%;
}

[data-theme="dark"] {
  --color-primary: 217 91% 70%;
  --color-bg: 0 0% 10%;
}
```

---

## Using Theme Colors in Components

### Tailwind Classes

DaisyUI provides utility classes for theme colors:

```tsx
// Primary color
<button className="btn btn-primary">Primary Button</button>

// Background colors
<div className="bg-base-100">Main background</div>
<div className="bg-base-200">Secondary background</div>

// Text colors
<p className="text-primary">Primary text</p>
<p className="text-secondary">Secondary text</p>

// Status colors
<div className="alert alert-success">Success message</div>
<div className="alert alert-error">Error message</div>
```

### CSS Variables

Access theme colors via CSS variables:

```css
.my-component {
  background-color: hsl(var(--p));        /* primary */
  color: hsl(var(--s));                  /* secondary */
  border-color: hsl(var(--b2));          /* base-200 */
}
```

### In JavaScript/TypeScript

```typescript
// Get computed CSS variable
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--p');
```

---

## Theme Best Practices

1. **Color contrast:**
   - Ensure sufficient contrast between text and backgrounds
   - Test with accessibility tools (WCAG AA minimum)
   - Use `base-100`, `base-200`, `base-300` for proper contrast hierarchy

2. **Consistency:**
   - Use `primary` for main brand elements
   - Use `secondary` for supporting elements
   - Use `accent` sparingly for highlights

3. **Status colors:**
   - Keep status colors semantic (green = success, red = error)
   - Ensure they're distinguishable from brand colors

4. **Dark mode:**
   - If supporting dark mode, create separate theme
   - Test all components in both themes
   - Consider user preference (system or manual toggle)

5. **Testing:**
   - Test theme with all DaisyUI components
   - Verify buttons, cards, modals, alerts
   - Check form inputs and validation states

---

## Example: Complete Custom Theme

Here's a complete example of a custom "ocean" theme:

```typescript
// tailwind.config.ts
daisyui: {
  themes: [
    {
      ocean: {
        // Brand colors - ocean blue palette
        primary: "#0EA5E9",        // Sky blue
        secondary: "#06B6D4",      // Cyan
        accent: "#14B8A6",         // Teal
        
        // Neutral colors - cool grays
        neutral: "#334155",        // Slate gray
        "base-100": "#F8FAFC",     // Very light blue-gray
        "base-200": "#E2E8F0",     // Light blue-gray
        "base-300": "#CBD5E1",     // Medium blue-gray
        
        // Status colors
        info: "#0EA5E9",           // Sky blue
        success: "#10B981",        // Green
        warning: "#F59E0B",        // Orange
        error: "#EF4444",          // Red
      }
    }
  ],
}
```

```typescript
// config.ts
colors: {
  theme: "ocean",
  main: "#0EA5E9", // Primary color
}
```

---

## Troubleshooting

### Theme not applying

**Issue:** Theme changes don't appear

**Solutions:**
1. Restart dev server after changing `tailwind.config.ts`
2. Clear browser cache
3. Verify theme name matches exactly in both files
4. Check browser console for CSS errors

### Colors not working

**Issue:** Theme colors don't appear in components

**Solutions:**
1. Ensure DaisyUI plugin is installed: `npm install daisyui`
2. Verify `daisyui` is in `plugins` array in `tailwind.config.ts`
3. Check that component uses DaisyUI classes (e.g., `btn-primary`)

### Dark mode not switching

**Issue:** Theme doesn't change when toggling dark mode

**Solutions:**
1. Ensure `data-theme` attribute is set on `<html>` element
2. Verify both light and dark themes are defined
3. Check that theme switching code runs after DOM loads

---

## Learn More

- [DaisyUI Themes Documentation](https://daisyui.com/docs/themes/) - Official theme reference
- [DaisyUI Components](https://daisyui.com/components/) - See themes in action
- [Branding Guide](./branding) - Logo and visual identity
- [Configuration Guide](../get-started/configuration) - Complete config reference
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Tailwind fundamentals

---

**Next Steps:**
1. Choose an existing theme or create your own
2. Update `tailwind.config.ts` with your theme
3. Update `config.ts` to use your theme
4. Test all components with your theme
5. Consider dark/light mode support
