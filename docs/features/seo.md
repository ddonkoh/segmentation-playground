# SEO

SEO optimization features and best practices for better search engine rankings.

## Overview

ShipSafe includes comprehensive SEO helpers for:
- Standard meta tags (title, description, keywords)
- Open Graph tags (Facebook, LinkedIn sharing)
- Twitter Card tags
- JSON-LD structured data (for rich results)
- Sitemap generation
- Canonical URLs

All SEO tags are prefilled with default values from `config.ts` so you don't have to add them to every page. But we recommend setting custom titles and canonical URLs for each page.

## Setup

### 1. Default SEO Tags

Open `config.ts` and add values for `appName`, `appDescription`, and `domainName`. These values will be used as default SEO tags for all pages.

The helper `/lib/seo.ts` adds all important SEO tags (with your default values) to all pages thanks to the main `/app/layout.tsx` file.

```typescript
// config.ts
const config = {
  appName: "ShipSafe",
  appDescription: "A security-first Next.js boilerplate...",
  domainName: "shipsafe.st",
};
```

### 2. Custom SEO Tags per Page

To add custom SEO tags to a page without rewriting all tags, use `generateSEOMetadata()`:

```typescript
// app/pricing/page.tsx
import { generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Pricing",
  description: "Choose the right plan for your SaaS project",
  path: "/pricing",
});

export default function PricingPage() {
  // ...
}
```

**Recommendation:** Always set `title` and `path` for each page to ensure proper canonical URLs and unique titles.

### 3. Structured Data for Rich Results

Add structured data to help Google understand your website better and get rich snippets. Use `generateJSONLD()` function:

```typescript
// app/page.tsx
import { generateJSONLD } from "@/lib/seo";

export default function Home() {
  const jsonLd = generateJSONLD({
    title: "Home",
    path: "/",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <main>
        {/* Your content */}
      </main>
    </>
  );
}
```

**Structured Data Types:**
- `WebSite` - For homepage (default)
- `SoftwareApplication` - For software products
- `Organization` - For company information
- See [Google's Structured Data Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) for more types

### 4. Generate Sitemap

Add your root URL to `siteUrl` in `next-sitemap.config.ts` (in the root folder). It will generate `sitemap.xml` and `robots.txt` files for all your pages at build time.

```typescript
// next-sitemap.config.ts
module.exports = {
  siteUrl: process.env.SITE_URL || "https://shipsafe.st",
  generateRobotsTxt: true,
};
```

## Usage Examples

### Basic Page with Default SEO

```typescript
// Uses defaults from config.ts
export default function Page() {
  return <main>Page content</main>;
}
```

### Page with Custom SEO

```typescript
import { generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Documentation",
  description: "Complete documentation for ShipSafe boilerplate",
  path: "/docs",
});

export default function DocsPage() {
  return <main>Docs content</main>;
}
```

### Page with Structured Data

```typescript
import { generateSEOMetadata, generateJSONLD } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Pricing",
  path: "/pricing",
});

export default function PricingPage() {
  const jsonLd = generateJSONLD({
    title: "Pricing",
    path: "/pricing",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <main>Pricing content</main>
    </>
  );
}
```

## SEO Tags Generated

The `generateSEOMetadata()` function creates:

### Standard Meta Tags
- `<title>` - Page title (50-60 characters recommended)
- `<meta name="description">` - Page description (150-160 characters)
- `<meta name="keywords">` - Keywords (optional)
- `<link rel="canonical">` - Canonical URL

### Open Graph Tags (Facebook, LinkedIn)
- `og:title` - Page title
- `og:description` - Page description
- `og:image` - Share image (1200x630px recommended)
- `og:url` - Page URL
- `og:type` - Content type (website, article, etc.)

### Twitter Card Tags
- `twitter:card` - Card type (summary_large_image)
- `twitter:title` - Page title
- `twitter:description` - Page description
- `twitter:image` - Share image

## Image Setup

### Open Graph Image

Add `opengraph-image.png` to the `/app` folder (or any route folder). Next.js will automatically use it.

- **Size:** 1200x630px recommended
- **Format:** PNG, JPG, or WebP
- **Location:** `app/opengraph-image.png`

### Twitter Image

Add `twitter-image.png` to the `/app` folder.

- **Size:** 1200x675px recommended
- **Format:** PNG, JPG, or WebP
- **Location:** `app/twitter-image.png`

**Note:** Next.js automatically references these images in the `<head>`. No code needed!

## Best Practices

### Title Tags
- Keep titles under 60 characters
- Include your brand name (e.g., "Pricing | ShipSafe")
- Make it descriptive and compelling
- Use pipe (`|`) separator between page title and brand

### Descriptions
- Keep descriptions between 150-160 characters
- Write compelling copy that encourages clicks
- Include key benefits or value proposition
- Avoid keyword stuffing

### Canonical URLs
- Always set `path` parameter for proper canonical URLs
- Prevents duplicate content issues
- Helps Google understand your page structure

### Structured Data
- Add structured data to key pages (homepage, product pages)
- Validate with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Update structured data when content changes

## Testing SEO

1. **Google Search Console** - Submit your sitemap and monitor indexing
2. **Rich Results Test** - Validate structured data
3. **PageSpeed Insights** - Check performance and mobile-friendliness
4. **Social Media Debuggers**:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Tips

- **Set title and path for every page** - Helps with canonical URLs and unique titles
- **Use descriptive titles** - Answer what the page is about in the title
- **Optimize images** - Use Next.js Image component and WebP format
- **Submit sitemap** - Add your sitemap to Google Search Console
- **Monitor performance** - Track page rankings and click-through rates

## Learn More

- [Static Page Tutorial](../tutorials/static-page) - Create SEO-optimized pages
- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)

