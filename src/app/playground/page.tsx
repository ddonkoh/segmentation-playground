/**
 * -----------------------------------------------------------------------------
 * ShipSafe Playground Page — /playground
 * -----------------------------------------------------------------------------
 * Public classical image segmentation playground (Otsu, Canny, k-means).
 * This is the primary demo surface for the deployed app (root `/` redirects here).
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
import SegmentationPlayground from "@/components/playground/SegmentationPlayground";
import BuiltDuringBuildSprint from "@/components/ui/BuiltDuringBuildSprint";

export const metadata: Metadata = generateSEOMetadata({
  title: "Segmentation Playground",
  description:
    "Classical image segmentation playground — upload an image and compare Otsu, Canny, and k-means.",
  path: "/playground",
});

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-base-100 pb-20">
      <section className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Segmentation Playground
          </h1>
          <p className="text-base-content/70 max-w-2xl">
            Upload an image and run classical image segmentation methods on it: Choose between Otsu,
            Canny, or k-means and view the results one at a time.
          </p>
        </div>
        <SegmentationPlayground />
      </section>

      <div className="fixed bottom-4 right-4 z-50">
        <BuiltDuringBuildSprint refSlug="segmentation-playground" />
      </div>
    </main>
  );
}
