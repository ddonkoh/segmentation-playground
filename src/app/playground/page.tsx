/**
 * -----------------------------------------------------------------------------
 * ShipSafe Playground Page — /playground
 * -----------------------------------------------------------------------------
 * Public classical image segmentation playground (Slice 1: Otsu only).
 *
 * Security:
 *   - Public route (not listed in middleware PROTECTED_ROUTES)
 *   - No auth required
 *   - Client-side processing only in Slice 1 (no segmentation API)
 *
 * -----------------------------------------------------------------------------
 */

import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/templates/Header";
import Footer from "@/components/templates/Footer";
import SegmentationPlayground from "@/components/playground/SegmentationPlayground";

export const metadata: Metadata = generateSEOMetadata({
  title: "Segmentation Playground",
  description:
    "Classical image segmentation playground — upload an image and preview Otsu thresholding.",
  path: "/playground",
});

export default function PlaygroundPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-base-100">
        <section className="max-w-5xl mx-auto px-4 py-10 md:py-14">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Segmentation Playground
            </h1>
            <p className="text-base-content/70 max-w-2xl">
              Slice 1: upload an image and run pure TypeScript Otsu
              thresholding. More classical methods (Canny, watershed, k-means)
              come later.
            </p>
          </div>
          <SegmentationPlayground />
        </section>
      </main>
      <Footer />
    </>
  );
}
