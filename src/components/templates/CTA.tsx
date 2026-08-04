/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — CTA.tsx
 * -----------------------------------------------------------------------------
 * 
 * Call-to-action section for final conversion push.
 * 
 * Reason:
 * The CTA section is the final push before users decide to purchase. It comes
 * at the very end of the landing page (after FAQ) and provides a clear, focused
 * message to convert visitors. Gradient background and gradient text heading create
 * visual interest and make the section stand out.
 * 
 * Features:
 * - Dark background (bg-base-200) matching Footer and Pricing sections
 * - Gradient text on heading
 * - Centered heading and description
 * - Single CTA button with gradient styling linking to featured plan checkout
 * - ButtonCheckout component handles Stripe checkout
 * - Responsive design
 * 
 * Layout:
 * Desktop:
 *   [Centered Heading (gradient text)]
 *   [Centered Description]
 *   [Centered Button]
 * 
 * Mobile:
 *   Same layout, adjusted spacing
 * 
 * Usage:
 *   <CTA />
 * 
 * Customisation:
 * - Update heading text
 * - Change description text
 * - Button automatically links to featured plan (config.stripe.plans with isFeatured: true)
 * - Modify gradient colors (from-primary/20, to-secondary/20)
 * 
 * This is a Client Component ("use client") because it uses:
 * - ButtonCheckout component (which has client-side state)
 * 
 * Styling Notes:
 * - Dark background (bg-base-200) matching Footer and Pricing
 * - Gradient text on heading for visual appeal
 * - Gradient button styling for prominent CTA
 * - Clean, focused design
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import ButtonCheckout from "@/components/ui/ButtonCheckout";
import config from "@/config";

/**
 * CTA component displays final call-to-action with gradient background.
 * 
 * Gradient background with gradient text heading for visual interest.
 * Button automatically links to the featured plan (most expensive).
 * 
 * @returns {JSX.Element} CTA section component
 */
const CTA = () => {
  // Get the featured plan (most expensive one)
  const featuredPlan = config.stripe.plans.find((plan) => plan.isFeatured);
  
  // Fallback to the last plan if no featured plan found
  const planToUse = featuredPlan || config.stripe.plans[config.stripe.plans.length - 1];

  return (
    <section className="relative bg-base-200 py-16" id="cta">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center space-y-6">
          {/* Heading */}
          {/* 
            Main CTA heading with gradient text.
            
            Customisation:
            - Update text
            - Change gradient colors (from-primary to-secondary)
            - Modify text size (text-3xl md:text-4xl)
          */}
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Build secure SaaS. Launch faster.
          </h2>

          {/* Description */}
          {/* 
            Supporting description text.
            
            Customisation:
            - Update text
            - Change opacity/text color (text-base-content/70)
            - Adjust max-width (max-w-2xl)
          */}
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Don&apos;t waste time configuring security middleware or building
            authentication from scratch...
          </p>

          {/* CTA Button */}
          {/* 
            Checkout button linking to featured plan.
            ButtonCheckout component handles Stripe checkout redirect.
            Gradient button style.
            
            Customisation:
            - Button text is in ButtonCheckout component
            - Automatically uses featured plan's priceId
            - Gradient styling (bg-gradient-to-r from-primary to-secondary)
            - Button always clickable - will show error if Stripe not configured
          */}
          <div className="flex justify-center pt-4">
            <ButtonCheckout 
              priceId={planToUse?.priceId || ""} 
              className="btn-lg normal-case px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none text-primary-content font-medium" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
