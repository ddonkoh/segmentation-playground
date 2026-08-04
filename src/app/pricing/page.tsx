/**
 * -----------------------------------------------------------------------------
 * ShipSafe Pricing Page
 * -----------------------------------------------------------------------------
 * Standalone pricing page with full pricing table.
 * Uses template components for consistent design.
 *
 * -----------------------------------------------------------------------------
 */

import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/templates/Header";
import Footer from "@/components/templates/Footer";
import Pricing from "@/components/templates/Pricing";
import FAQ from "@/components/templates/FAQ";
import CTA from "@/components/templates/CTA";
import config from "@/config";

export const metadata: Metadata = generateSEOMetadata({
  title: "Pricing",
  description: `Choose the perfect plan for your SaaS. ${config.appDescription}`,
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

