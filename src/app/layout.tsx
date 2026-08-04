/**
 * -----------------------------------------------------------------------------
 * ShipSafe Root Layout
 * -----------------------------------------------------------------------------
 * Root layout for the entire application.
 * Defines SSR/CSR boundaries, metadata, SEO, theme, and global setup.
 *
 * -----------------------------------------------------------------------------
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import config from "@/config";
import { generateSEOMetadata } from "@/lib/seo";

// -----------------------------------------------------------------------------
// 1. Font Configuration
// -----------------------------------------------------------------------------

const font = Inter({ subsets: ["latin"] });

// -----------------------------------------------------------------------------
// 2. Viewport Configuration
// -----------------------------------------------------------------------------

export const viewport = {
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// -----------------------------------------------------------------------------
// 3. SEO Metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = generateSEOMetadata({
  title: config.appName,
  description: config.appDescription,
  path: "/",
});

// -----------------------------------------------------------------------------
// 4. Root Layout Component
// -----------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme={config.colors.theme} className={font.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
