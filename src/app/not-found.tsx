/**
 * -----------------------------------------------------------------------------
 * ShipSafe 404 Not Found Page
 * -----------------------------------------------------------------------------
 * Custom 404 page for when routes are not found.
 * Uses SEO helpers for metadata.
 *
 * -----------------------------------------------------------------------------
 */

import Link from "next/link";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/templates/Header";
import Footer from "@/components/templates/Footer";
import Button from "@/components/ui/Button";
import config from "@/config";

export const metadata: Metadata = generateSEOMetadata({
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  path: "/404",
  noindex: true, // Don't index 404 pages
});

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-200 to-base-300 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-10">
            {/* Animated 404 with gradient */}
            <div className="relative mb-6">
              <h1 className="text-9xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
                404
              </h1>
              <div className="absolute inset-0 text-9xl font-black text-base-content/5 blur-sm">
                404
              </div>
            </div>
            
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full">
                <svg
                  className="w-16 h-16 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 text-base-content">
              Page Not Found
            </h2>
            <p className="text-base-content/70 mb-8 text-lg">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/">
              <Button variant="primary" className="shadow-lg hover:shadow-xl transition-shadow">
                Go Home
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" className="shadow-md hover:shadow-lg transition-shadow">
                View Docs
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-base-100/50 rounded-xl backdrop-blur-sm border border-base-300">
            <p className="text-sm text-base-content/60">
              Need help? Contact us at{" "}
              <a
                href={`mailto:${config.supportEmail}`}
                className="link link-primary font-medium"
              >
                {config.supportEmail}
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
