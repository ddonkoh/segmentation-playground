# Header

A responsive header with your logo (left), links (center) and a CTA (right). Links and CTA are hidden on mobile and accessible with a burger menu.

**Location:** `src/components/templates/Header.tsx`

## Quick Customization

This component is highly customizable:
- **Navigation links** - Update the `links` array
- **Logo** - Replace `/logo_w.png` with your logo
- **CTA button** - Customize or replace the button component
- **Background** - Change header background color
- **Styling** - Modify colors, spacing, and hover effects

## Description

The header is the primary navigation element that appears on every page. It provides users with quick access to key sections (Features, Pricing, Docs) and the main call-to-action. The component automatically handles mobile navigation with a slide-in menu.

## Usage

```tsx
import Header from "@/components/templates/Header";

<Header />
```

## Features

- **Responsive layout** - Desktop: logo left, links center, CTA right
- **Mobile menu** - Burger button with slide-in menu from right
- **Auto-close** - Mobile menu closes automatically on route change
- **Hover effects** - Navigation links have animated underline on hover
- **Accessible** - ARIA labels and keyboard navigation support

## Layout

### Desktop Layout

```
[Logo + App Name]  |  [Features] [Pricing] [Docs] [FAQ]  |  [Get Started]
```

### Mobile Layout

```
[Logo + App Name]  [☰ Burger Menu]
```

When burger is clicked:
- Fixed overlay menu slides in from right
- Contains all navigation links
- CTA button at bottom
- Click outside or on link to close

## Customization

### Navigation Links

Update the `links` array in the component:

```typescript
const links = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/#faq", label: "FAQ" },
];
```

**Link Types:**
- Use `/#section` for anchor links on same page
- Use `/page` for full page navigation
- Use `/docs` for documentation pages

### Logo

The header uses `/logo_w.png` from the public folder. To change:

1. Add your logo to `public/` folder
2. Update the `Image` component `src` prop:

```tsx
<Image
  src="/your-logo.png"  // Update this
  alt={`${config.appName} logo`}
  className="w-10 h-10"
  width={40}
  height={40}
/>
```

### CTA Button

By default uses `ButtonSignin` component. To customize:

1. Replace `ButtonSignin` with your own component
2. Or modify `ButtonSignin` styling via props

```tsx
// Current
const cta = <ButtonSignin extraStyle="btn-primary" />;

// Custom
const cta = (
  <Link href="/auth" className="btn btn-primary">
    Get Started
  </Link>
);
```

### Background Color

Change header background in the component:

```tsx
<header className="bg-base-200 ...">  // Change bg-base-200 to your color
```

## Code Example

```tsx
import Header from "@/components/templates/Header";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        {/* Your page content */}
      </main>
    </>
  );
}
```

## Tips

- **Keep brand name small** - Unless you're Nike or Apple, visitors don't know who you are. Keep logo/brand small and let the value proposition speak.
- **Always include Pricing link** - No matter what you sell, people will look for pricing in the header. Make it easy to find.
- **Mobile-first** - Test mobile menu thoroughly. Many users will access your site on mobile.
- **Anchor links** - Use `/#section` for smooth scrolling to sections on the same page.
- **Sticky header** - Add `sticky top-0 z-50` classes if you want header to stick while scrolling.

## Mobile Menu Behavior

- Opens on burger button click
- Slides in from right with overlay
- Closes on:
  - Clicking outside menu
  - Clicking any navigation link
  - Route change (automatic)
  - Close button click

## Examples

```tsx
// Basic usage (includes all features)
<Header />

// Already configured with:
// - Logo from /logo_w.png
// - Navigation links
// - ButtonSignin CTA
// - Mobile menu
```

## Learn More

- [ButtonSignin Component](../ui/button-signin) - CTA button used in header
- [Logo Component](../ui/logo) - Logo component details
- [Mobile Menu Tutorial](../../tutorials/custom-components)

