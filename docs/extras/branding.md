# Branding Setup

Complete guide to customizing ShipSafe branding elements including logos, favicons, metadata images, and app identity.

## Overview

ShipSafe comes with default branding that you should replace with your own before launching. This guide covers all branding elements and how to customize them.

**What you'll customize:**
- App logo (light and dark variants)
- Favicon and app icons
- Open Graph and Twitter images
- App name and description
- Color scheme and theme

---

## Logo Customization

### App Logo Files

ShipSafe uses the `Logo` component which supports two variants:

**File locations:**
- `public/logo.svg` - Default logo (for light backgrounds)
- `public/logo_w.svg` - White logo (for dark backgrounds)

**Current implementation:**

```tsx
// src/components/ui/Logo.tsx
const Logo = ({ 
  className = "", 
  size = "md",
  variant = "default" // "default" or "white"
}: { 
  className?: string; 
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}) => {
  const logoSize = size === "sm" ? 24 : size === "lg" ? 40 : 32;
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg";
  
  // Use white variant for dark backgrounds, default for light
  const logoSrc = variant === "white" ? "/logo_w.svg" : "/logo.svg";
  const logoAlt = `${config.appName} logo`;
  
  return (
    <Link 
      href="/" 
      className={`flex items-center gap-2 ${className}`} 
      title={`${config.appName} homepage`}
    >
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={logoSize}
        height={logoSize}
        className="shrink-0"
        priority
      />
      <span className={`font-extrabold ${textSize}`}>{config.appName}</span>
    </Link>
  );
};
```

**Steps to replace:**

1. **Create your logo files:**
   - Design your logo at 512x512px or higher (SVG recommended)
   - Export two variants:
     - `logo.svg` - Your brand colors (for light backgrounds)
     - `logo_w.svg` - White/light version (for dark backgrounds)

2. **Replace files:**

   ```bash
   # Replace these files in your public/ directory
   public/logo.svg      # Default logo
   public/logo_w.svg    # White variant
   ```

3. **Recommended formats:**
   - **SVG** (preferred) - Scalable, crisp at any size
   - **PNG** - Use 512x512px minimum for high DPI displays

**Usage in components:**

The Logo component automatically uses `config.appName` for the text label. Update your app name in `config.ts`:

```typescript
appName: "Your App Name"
```

---

## Favicon and App Icons

### Favicon Setup

Next.js 15 uses the App Router's metadata API for favicons. Place files in `src/app/`:

**Required files:**
- `src/app/favicon.ico` - Traditional favicon (16x16 or 32x32)
- `src/app/icon.png` - App icon (512x512px)
- `src/app/apple-icon.png` - Apple touch icon (180x180px)

**Steps:**

1. **Generate favicon files:**
   - Use [Favicon Generator](https://realfavicongenerator.net/)
   - Upload your logo (512x512px minimum)
   - Download all formats

2. **Place files:**

   **`src/app/`**
   - `favicon.ico` - Traditional favicon
   - `icon.png` - 512x512px app icon
   - `apple-icon.png` - 180x180px Apple touch icon

3. **Next.js automatically serves these:**
   - `/favicon.ico` - Served automatically
   - `/icon.png` - Used for PWA and app icons
   - `/apple-icon.png` - Used for iOS home screen

**Note:** Next.js 15 automatically detects and serves these files. No configuration needed.

---

## Metadata Images

### Open Graph Image

Used when sharing links on social media (Facebook, LinkedIn, etc.).

**File location:**
- `src/app/opengraph-image.png` or `opengraph-image.jpg`

**Specifications:**
- **Size:** 1200x630px (recommended)
- **Format:** PNG or JPG
- **Content:** Include your logo, app name, and tagline

**Steps:**

1. Create image at 1200x630px
2. Include your branding elements
3. Save as `src/app/opengraph-image.png`
4. Next.js automatically serves at `/opengraph-image.png`

**Example design:**
- Left side: Your logo
- Right side: App name + tagline
- Background: Brand colors or gradient

### Twitter Image

Used when sharing links on Twitter/X.

**File location:**
- `src/app/twitter-image.png` or `twitter-image.jpg`

**Specifications:**
- **Size:** 1200x675px (Twitter card size)
- **Format:** PNG or JPG
- **Aspect ratio:** 16:9

**Steps:**

1. Create image at 1200x675px
2. Include your branding
3. Save as `src/app/twitter-image.png`
4. Next.js automatically serves at `/twitter-image.png`

---

## App Name and Description

### Update in config.ts

All app metadata comes from `config.ts`:

```typescript
// config.ts
appName: "ShipSafe",
appDescription:
  "A security-first Next.js boilerplate with Firebase Auth, Stripe billing, and clean SaaS UI components.",

/**
 * The naked production domain.
 * REQUIRED FORMAT:
 *  ❌ no https://
 *  ❌ no trailing slash
 *  ✔️ example: "shipsafe.st"
 */
domainName: "shipsafe.st",
```

**Customize:**

```typescript
// config.ts
appName: "Your App Name",
appDescription: "Your compelling app description that appears in SEO and metadata.",
domainName: "yourapp.com", // No https://, no trailing slash
```

**Where it's used:**
- SEO meta tags (`<title>`, `<meta name="description">`)
- Open Graph tags
- Logo component text label
- Email templates
- Footer components

---

## Colors and Theme

### DaisyUI Theme Customization

ShipSafe uses DaisyUI themes. Customize colors in `tailwind.config.ts`:

**Current setup:**

```typescript
// tailwind.config.ts
daisyui: {
  themes: ["light", "dark"],
  styled: true,
  logs: false,
},
```

**Config reference:**

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

**Steps to customize:**

1. **Choose existing theme:**
   ```typescript
   // config.ts
   colors: {
     theme: "cupcake", // or "light", "dark", "corporate", etc.
   }
   ```

2. **Create custom theme:**

   ```typescript
   // tailwind.config.ts
   daisyui: {
     themes: [
       {
         yourtheme: {
           primary: "#your-primary-color",
           secondary: "#your-secondary-color",
           accent: "#your-accent-color",
           neutral: "#your-neutral-color",
           "base-100": "#your-background-color",
           "base-200": "#your-secondary-background",
           "base-300": "#your-tertiary-background",
           info: "#your-info-color",
           success: "#your-success-color",
           warning: "#your-warning-color",
           error: "#your-error-color",
         },
       },
     ],
   }
   ```

3. **Update config:**
   ```typescript
   // config.ts
   colors: {
     theme: "yourtheme",
     main: "#your-primary-color", // or use CSS variable: "hsl(var(--p))"
   }
   ```

**See also:** [Custom Themes Guide](./custom-themes) for detailed theme customization.

---

## Quick Customization Checklist

Use this checklist to ensure all branding is updated:

- [ ] **Logo files replaced:**
  - [ ] `public/logo.svg` (default)
  - [ ] `public/logo_w.svg` (white variant)

- [ ] **Favicon and icons:**
  - [ ] `src/app/favicon.ico`
  - [ ] `src/app/icon.png` (512x512px)
  - [ ] `src/app/apple-icon.png` (180x180px)

- [ ] **Metadata images:**
  - [ ] `src/app/opengraph-image.png` (1200x630px)
  - [ ] `src/app/twitter-image.png` (1200x675px)

- [ ] **Config updated:**
  - [ ] `appName` in `config.ts`
  - [ ] `appDescription` in `config.ts`
  - [ ] `domainName` in `config.ts`
  - [ ] Theme colors in `tailwind.config.ts` and `config.ts`

- [ ] **Test:**
  - [ ] Logo displays correctly in header
  - [ ] Favicon appears in browser tab
  - [ ] Open Graph image shows when sharing links
  - [ ] App name appears correctly throughout UI

---

## Best Practices

1. **Logo design:**
   - Keep it simple and recognizable at small sizes
   - Ensure it works on both light and dark backgrounds
   - Use SVG format for crisp rendering at any size

2. **Favicon:**
   - Design at 32x32px minimum (scales up automatically)
   - Use simple, recognizable icon (not full logo)
   - Test in browser tab to ensure readability

3. **Metadata images:**
   - Include your logo prominently
   - Use readable text (app name, tagline)
   - Ensure important content is centered (may be cropped on some platforms)

4. **Colors:**
   - Choose colors that reflect your brand
   - Ensure sufficient contrast for accessibility
   - Test theme on both light and dark modes

5. **Consistency:**
   - Use same color palette across all branding elements
   - Maintain consistent logo usage
   - Keep app name consistent everywhere

---

## Learn More

- [Configuration Guide](../get-started/configuration) - Complete config.ts reference
- [Custom Themes](./custom-themes) - Detailed theme customization
- [Logo Component](../components/ui/logo) - Logo component usage
- [DaisyUI Themes](https://daisyui.com/docs/themes/) - Available themes

---

**Next Steps:**
1. Replace logo files in `public/`
2. Generate and add favicon files
3. Create metadata images
4. Update `config.ts` with your app details
5. Customize theme colors if needed
