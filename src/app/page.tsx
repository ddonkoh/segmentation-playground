/**
 * -----------------------------------------------------------------------------
 * ShipSafe Landing Page
 * -----------------------------------------------------------------------------
 * Homepage with hero, pricing, FAQ, and CTA sections.
 * Uses template components for consistent design.
 *
 * This is a Client Component (matches Shipfast pattern).
 * Client Components can import and render both Server and Client Components.
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import Header from "@/components/templates/Header";
import Footer from "@/components/templates/Footer";
import Hero from "@/components/templates/Hero";
import Problem from "@/components/templates/Problem";
import FeaturesGrid from "@/components/templates/FeaturesGrid";
import FeaturesListicle from "@/components/templates/FeaturesListicle";
import Testimonial from "@/components/templates/Testimonial";
import Pricing from "@/components/templates/Pricing";
import FAQ from "@/components/templates/FAQ";
import CTA from "@/components/templates/CTA";
import ClientLayout from "@/components/layouts/ClientLayout";

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <ClientLayout>
          <Hero />
          <Problem />
          <FeaturesGrid />
          <FeaturesListicle />
          <Testimonial />
          <Pricing />
          <FAQ />
          <CTA />
        </ClientLayout>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
