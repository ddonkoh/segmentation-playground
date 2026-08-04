# Footer

Site footer component with navigation links, legal information, and branding.

**Location:** `src/components/templates/Footer.tsx`

## Quick Customization

This component is highly customizable:
- **Navigation links** - Update product and legal link arrays
- **Logo** - Uses `/logo_w.png` (automatically configured)
- **Description** - Uses `config.appDescription` (automatically configured)
- **Copyright** - Automatically uses current year and app name
- **"Built with ShipSafe" badge** - Can be removed if not needed
- **Grid layout** - 4 columns on desktop (configurable)

## Description

The footer appears at the bottom of every page and provides quick access to important links, legal information, and brand attribution. It includes navigation links organized by category, legal links (Privacy Policy, Terms), copyright notice, and the "Built with ShipSafe" attribution badge.

## Usage

```tsx
import Footer from "@/components/templates/Footer";

<Footer />
```

## Features

- **Logo and description** - Brand identity and app description
- **Quick links** - Organized navigation by category (Product, Legal)
- **Legal links** - Privacy Policy, Terms of Service
- **"Built with ShipSafe" badge** - Attribution component
- **Copyright notice** - Year and app name
- **Responsive grid** - 4-column layout on desktop, stacked on mobile

## Layout

### Desktop Layout (4 columns)

```
[Logo + Description]  [Product Links]  [Legal Links]  [Copyright + Badge]
    (spans 2 cols)       (1 col)         (1 col)          (1 col)
```

### Mobile Layout

```
[Logo + Description]
[Product Links]
[Legal Links]
[Copyright + Badge]
```

## Customization

### Navigation Links

Update the `navigation` object in the component:

```typescript
const navigation = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Documentation", href: "/docs" },
    { name: "FAQ", href: "/#faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};
```

**Link Types:**
- Use `/#section` for anchor links on same page
- Use `/page` for full page navigation
- Use external URLs for external links

### Logo and Description

The footer automatically uses:
- Logo from `/logo_w.png` (light logo for dark background)
- Description from `config.appDescription`

To customize:

```tsx
// Logo
<Image
  src="/logo_w.png"  // Update path if needed
  alt={`${config.appName} logo`}
  width={40}
  height={40}
/>

// Description
<p className="text-base-content/60">
  {config.appDescription}  // Uses config value
</p>
```

### "Built with ShipSafe" Badge

The badge is a separate component (`BuiltWithShipSafe`) that links to ShipSafe.st. To customize:

1. Edit `BuiltWithShipSafe.tsx` component
2. Or remove it from Footer if not needed

### Copyright Notice

Update the copyright year if needed:

```tsx
<p className="text-base-content/60">
  © {new Date().getFullYear()} {config.appName}. All rights reserved.
</p>
```

### Background Color

The footer uses `bg-base-200` (dark background). To change:

```tsx
<footer className="bg-base-200 border-t border-base-content/10">
  // Change bg-base-200 to your preferred color
</footer>
```

## Code Example

```tsx
import Footer from "@/components/templates/Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />  {/* Footer at bottom of every page */}
    </>
  );
}
```

## Tips

- **Organize links logically** - Group related links together (Product, Legal, etc.)
- **Include essential links** - Privacy Policy and Terms are required for legal compliance
- **Keep it simple** - Don't overcrowd the footer with too many links
- **Match site design** - Footer should match your site's overall design language
- **Mobile-friendly** - Test footer on mobile to ensure links are easily tappable

## Best Practices

1. **Legal compliance** - Always include Privacy Policy and Terms links
2. **Organized structure** - Group links by category for easy navigation
3. **Consistent branding** - Logo and description should match header
4. **Accessibility** - Use semantic HTML and proper link labels
5. **Responsive design** - Stack columns on mobile for better UX

## Footer Sections

### Product Links
Common links to include:
- Features
- Pricing
- Documentation
- FAQ
- Blog (if applicable)

### Legal Links
Required links:
- Privacy Policy (`/privacy`)
- Terms of Service (`/terms`)

### Attribution
- "Built with ShipSafe" badge (optional but appreciated!)

## Examples

### Basic Usage

```tsx
// Footer includes all default links
<Footer />
```

### Custom Navigation

```typescript
// Update navigation object in Footer.tsx
const navigation = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    // Add your links...
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};
```

## Learn More

- [BuiltWithShipSafe Component](../ui/built-with-shipsafe) - Attribution badge
- [Header Component](./header) - Top navigation
- [Configuration Guide](../../get-started/configuration) - Configure app description

