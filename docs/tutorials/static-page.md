# Static Page Tutorial

Create SEO-optimized static pages with ShipSafe's components and SEO utilities.

## Overview

This tutorial will teach you how to create static pages (like About, Privacy Policy, Terms of Service) that are:
- **SEO-friendly** - Proper meta tags, structured data, and semantic HTML
- **Fast loading** - Optimized images and efficient code
- **Easy to maintain** - Reusable components and consistent styling

## Prerequisites

- Basic understanding of Next.js App Router
- Familiarity with React components
- ShipSafe installed and running locally

## Creating a New Static Page

### Step 1: Create the Page File

Create a new file in the `app` directory:

```tsx
// app/about/page.tsx
import { generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Header from "@/components/templates/Header";
import Footer from "@/components/templates/Footer";

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us",
  description: "Learn more about ShipSafe and our mission to help developers build secure SaaS faster.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-base-100">
        {/* Your content here */}
      </main>
      <Footer />
    </>
  );
}
```

**File structure:**
- `app/about/page.tsx` - Creates route at `/about`
- `app/contact/page.tsx` - Creates route at `/contact`
- `app/privacy/page.tsx` - Creates route at `/privacy`

### Step 2: Add SEO Metadata

Use `generateSEOMetadata()` to add comprehensive SEO tags:

```tsx
export const metadata: Metadata = generateSEOMetadata({
  title: "About Us",  // Page title (will be "About Us | ShipSafe")
  description: "Your page description (150-160 characters recommended)",
  path: "/about",  // Canonical URL path
});
```

**What this generates:**
- `<title>` tag
- `<meta name="description">`
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Canonical URL

### Step 3: Structure Your Content

Use semantic HTML and ShipSafe components:

```tsx
export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-base-100 py-24 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Use proper heading hierarchy */}
          <h1 className="text-4xl font-bold mb-8">About ShipSafe</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg text-base-content/70 leading-relaxed">
              ShipSafe helps developers build secure SaaS applications faster...
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-lg text-base-content/70 leading-relaxed">
              Founded in 2024, ShipSafe was born from frustration...
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

## Complete Example: About Page

Here's a complete example of an About page:

```tsx
// app/about/page.tsx
import { generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/templates/Header";
import Footer from "@/components/templates/Footer";

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us",
  description: "Learn about ShipSafe's mission to help developers build secure SaaS applications faster with our Next.js boilerplate.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-base-100">
        {/* Hero Section */}
        <section className="py-24 px-8 bg-base-200">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About ShipSafe</h1>
            <p className="text-xl text-base-content/70">
              Building secure SaaS shouldn't take months
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-base-content/70 leading-relaxed">
                ShipSafe helps developers build secure, production-ready SaaS applications
                in days instead of months. We provide a battle-tested Next.js boilerplate
                with authentication, billing, and security features built in.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-base-content/70 leading-relaxed">
                After building multiple SaaS products and spending weeks on boilerplate
                code, we decided to create ShipSafe - a security-first boilerplate that
                gets you to production faster.
              </p>
            </div>

            {/* Optional: Add image */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src="/about-image.jpg"
                alt="About ShipSafe"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

## Adding Structured Data (Optional)

For better SEO, add JSON-LD structured data:

```tsx
import { generateJSONLD } from "@/lib/seo";

export default function AboutPage() {
  const jsonLd = generateJSONLD({
    title: "About Us",
    path: "/about",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Header />
      {/* Rest of content */}
    </>
  );
}
```

## Best Practices

### 1. SEO Optimization

- **Descriptive titles** - Keep under 60 characters, include brand name
- **Compelling descriptions** - 150-160 characters, include keywords naturally
- **Proper heading hierarchy** - Use h1 once, then h2, h3, etc.
- **Semantic HTML** - Use proper HTML elements (`<section>`, `<article>`, etc.)

### 2. Content Structure

- **Clear sections** - Break content into logical sections
- **Scannable content** - Use short paragraphs, bullet points, headings
- **Images** - Optimize with Next.js Image component
- **Internal links** - Link to other pages on your site

### 3. Performance

- **Optimize images** - Use Next.js `Image` component
- **Lazy load content** - Load heavy content on demand
- **Minimize JavaScript** - Keep client components minimal

## Common Page Types

### Privacy Policy

```tsx
// app/privacy/page.tsx
export const metadata: Metadata = generateSEOMetadata({
  title: "Privacy Policy",
  description: "Our privacy policy explains how we collect, use, and protect your data.",
  path: "/privacy",
});
```

### Terms of Service

```tsx
// app/terms/page.tsx
export const metadata: Metadata = generateSEOMetadata({
  title: "Terms of Service",
  description: "Read our terms of service to understand the rules for using ShipSafe.",
  path: "/terms",
});
```

### Contact Page

```tsx
// app/contact/page.tsx
export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Us",
  description: "Get in touch with the ShipSafe team. We'd love to hear from you!",
  path: "/contact",
});
```

## Tips

- **Use consistent layout** - Header and Footer on every page
- **Match site design** - Use same colors, fonts, and spacing
- **Mobile-first** - Test on mobile devices
- **Update regularly** - Keep content fresh and accurate
- **Link navigation** - Add links in Header or Footer

## Troubleshooting

### Page not showing

- Verify file is in correct location: `app/your-page/page.tsx`
- Check route matches file path
- Restart development server

### SEO tags not appearing

- Verify `generateSEOMetadata()` is exported correctly
- Check metadata is defined before component
- Use browser DevTools to inspect `<head>` tags

## Learn More

- [SEO Features](../features/seo) - Complete SEO documentation
- [Component Documentation](../components/overview) - Available components
- [Next.js Pages Documentation](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)

