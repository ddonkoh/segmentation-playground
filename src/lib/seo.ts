/**
 * -----------------------------------------------------------------------------
 * ShipSafe SEO Utilities — seo.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   SEO metadata helpers for Next.js pages.
 *   Generates Open Graph, Twitter Card, and standard meta tags.
 *
 * Why this exists:
 *   All pages need consistent SEO metadata.
 *   This centralizes SEO logic and uses config.ts for app metadata.
 *
 * Security:
 *   - No sensitive data in metadata
 *   - Uses config.ts for domain/app name
 *
 * Used by:
 *   - All page components (via generateMetadata or Metadata API)
 *   - Layout components
 *
 * -----------------------------------------------------------------------------
 */

import { Metadata } from "next";
import config from "@/config";

// -----------------------------------------------------------------------------
// 1. SEO Metadata Options
// -----------------------------------------------------------------------------

/**
 * Options for generating SEO metadata.
 */
export interface SEOOptions {
  /**
   * Page title (will be combined with app name)
   */
  title?: string;

  /**
   * Page description
   */
  description?: string;

  /**
   * Page path (for canonical URL)
   */
  path?: string;

  /**
   * Open Graph image URL (optional)
   */
  image?: string;

  /**
   * Whether to include robots noindex
   */
  noindex?: boolean;

  /**
   * Additional keywords (optional)
   */
  keywords?: string[];
}

// -----------------------------------------------------------------------------
// 2. Generate Canonical URL
// -----------------------------------------------------------------------------

/**
 * generateCanonicalUrl() — generates canonical URL for a page.
 *
 * @param path - Page path (e.g., "/dashboard", "/pricing")
 * @returns Full canonical URL
 */
export function generateCanonicalUrl(path: string = "/"): string {
  const baseUrl = config.domainName
    ? `https://${config.domainName}`
    : process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

// -----------------------------------------------------------------------------
// 3. Generate SEO Metadata
// -----------------------------------------------------------------------------

/**
 * generateSEOMetadata() — generates complete SEO metadata for a page.
 *
 * This function creates:
 *   - Standard meta tags (title, description)
 *   - Open Graph tags (Facebook, LinkedIn)
 *   - Twitter Card tags
 *   - Canonical URL
 *   - Robots meta
 *
 * @param options - SEO options
 * @returns Next.js Metadata object
 */
export function generateSEOMetadata(options: SEOOptions = {}): Metadata {
  const {
    title,
    description = config.appDescription,
    path = "/",
    image,
    noindex = false,
    keywords = [],
  } = options;

  // Generate full title (page title + app name)
  const fullTitle = title
    ? `${title} | ${config.appName}`
    : config.appName;

  // Generate canonical URL
  const canonicalUrl = generateCanonicalUrl(path);

  // Generate Open Graph image URL
  const ogImage = image || generateCanonicalUrl("/og-image.png");

  // Build metadata object
  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: [{ name: config.appName }],
    creator: config.appName,
    publisher: config.appName,
    icons: {
      icon: [
        { url: "/favicon/favicon.svg", type: "image/svg+xml" },
        { url: "/logo_w.png", type: "image/png" },
      ],
      apple: "/logo_w.png",
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: config.appName,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: `@${config.appName.toLowerCase().replace(/\s+/g, "")}`, // Optional: add Twitter handle to config
    },
    metadataBase: new URL(
      config.domainName
        ? `https://${config.domainName}`
        : process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000"
    ),
  };

  return metadata;
}

// -----------------------------------------------------------------------------
// 4. Generate JSON-LD Structured Data
// -----------------------------------------------------------------------------

/**
 * generateJSONLD() — generates JSON-LD structured data for SEO.
 *
 * @param options - SEO options
 * @returns JSON-LD script content
 */
export function generateJSONLD(options: SEOOptions = {}): string {
  const {
    title,
    description = config.appDescription,
    path = "/",
  } = options;

  const fullTitle = title
    ? `${title} | ${config.appName}`
    : config.appName;

  const canonicalUrl = generateCanonicalUrl(path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.appName,
    description,
    url: canonicalUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${canonicalUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return JSON.stringify(jsonLd);
}

// -----------------------------------------------------------------------------
// 5. Helper: Format Title
// -----------------------------------------------------------------------------

/**
 * formatPageTitle() — formats page title with app name.
 *
 * @param pageTitle - Page title
 * @returns Formatted title
 */
export function formatPageTitle(pageTitle?: string): string {
  return pageTitle
    ? `${pageTitle} | ${config.appName}`
    : config.appName;
}