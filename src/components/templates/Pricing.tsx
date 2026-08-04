/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — Pricing.tsx
 * -----------------------------------------------------------------------------
 * 
 * Pricing table component with plan cards displaying Stripe subscription plans.
 * 
 * Reason:
 * The Pricing section comes after Features/Testimonials and before FAQ/CTA. It's
 * the conversion point where visitors decide to purchase. Clear pricing with
 * feature comparisons reduces friction and helps users choose the right plan.
 * This component displays all plans from config and handles checkout seamlessly.
 * 
 * Features:
 * - Displays all plans from config.stripe.plans[]
 * - Featured plan highlighting (badge + border)
 * - Price anchor (crossed-out original price)
 * - Feature list with checkmarks
 * - Stripe checkout integration via ButtonCheckout
 * - Responsive layout (stacks on mobile, side-by-side on desktop)
 * 
 * Layout:
 * Desktop:
 *   [Plan 1] [Plan 2 (Featured)]
 * 
 * Mobile:
 *   [Plan 1]
 *   [Plan 2 (Featured)]
 * 
 * Usage:
 *   <Pricing />
 * 
 * Customisation:
 * - Update plans in config.ts (config.stripe.plans[])
 * - Modify heading text
 * - Update feature lists in config
 * - Change badge text ("POPULAR")
 * - Adjust styling (colors, spacing, borders)
 * 
 * This is a Client Component ("use client") because it uses:
 * - ButtonCheckout component (which has client-side state)
 * 
 * Styling Notes:
 * - Clean, minimal design matching ShipFast aesthetic
 * - Featured plan has border highlight and badge
 * - Price anchor shows original price crossed out
 * - Easy to customize for your brand
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import config from "@/config";
import ButtonCheckout from "@/components/ui/ButtonCheckout";

/**
 * Pricing component displays the pricing plans for your app.
 * 
 * It maps through config.stripe.plans[] and renders each plan as a card.
 * ButtonCheckout component handles the Stripe checkout redirect.
 * 
 * @returns {JSX.Element} Pricing section component
 */
const Pricing = () => {
  return (
    <section className="bg-base-200 overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        {/* Section header */}
        {/* 
          Section title and description.
          
          Customisation:
          - Update heading text
          - Change subtitle if needed
          - Adjust text sizes
        */}
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-primary mb-8">Pricing</p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
            Secure by default. Fast by design.
          </h2>
        </div>

        {/* Pricing plans */}
        {/* 
          Maps through config.stripe.plans[] and renders each plan card.
          
          Customisation:
          - Add/remove plans in config.ts
          - Mark plan as featured with isFeatured: true
          - Update plan styling
        */}
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {config.stripe.plans.map((plan, index) => (
            <div key={plan.priceId || plan.name || `plan-${index}`} className="relative w-full max-w-lg">
              {/* Featured badge */}
              {/* 
                Shows "POPULAR" badge above featured plan card.
                
                Customisation:
                - Change badge text
                - Modify badge styling
                - Remove if not needed
              */}
              {plan.isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <span className="badge text-xs text-primary-content font-semibold border-0 bg-primary">
                    POPULAR
                  </span>
                </div>
              )}

              {/* Featured plan border highlight */}
              {/* 
                Adds a border highlight around featured plan card.
                
                Customisation:
                - Change border color (bg-primary)
                - Adjust border width (-inset-[1px])
                - Remove if not needed
              */}
              {plan.isFeatured && (
                <div className="absolute -inset-[1px] rounded-[9px] bg-primary z-10"></div>
              )}

              {/* Plan card */}
              {/* 
                Individual plan card with pricing, features, and CTA button.
                
                Customisation:
                - Update padding (p-8)
                - Modify gap spacing (gap-5 lg:gap-8)
                - Change card background (bg-base-100)
              */}
              <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
                {/* Plan name and description */}
                {/* 
                  Plan title and optional description.
                  
                  Customisation:
                  - Update text sizes
                  - Modify description styling
                */}
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <p className="text-lg lg:text-xl font-bold">{plan.name}</p>
                    {plan.description && (
                      <p className="text-base-content/80 mt-2">
                        {plan.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price display */}
                {/* 
                  Shows current price, optional price anchor (crossed out),
                  and currency label.
                  
                  Customisation:
                  - Change price format
                  - Update currency label
                  - Modify price anchor styling
                */}
                <div className="flex gap-2 items-baseline">
                  {/* Price anchor (original price, crossed out) */}
                  {/* 
                    Optional: Shows original price with strikethrough.
                    Only displays if plan.priceAnchor is set.
                    
                    Customisation:
                    - Change opacity (text-base-content/80)
                    - Modify strikethrough styling
                  */}
                  {plan.priceAnchor && (
                    <div className="flex flex-col justify-end mb-[4px] text-lg">
                      <p className="relative">
                        <span className="absolute bg-base-content h-[1.5px] inset-x-0 top-[53%]"></span>
                        <span className="text-base-content/80">
                          ${plan.priceAnchor}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Current price */}
                  {/* 
                    Main price display in large, bold text.
                    
                    Customisation:
                    - Change text size (text-5xl)
                    - Update font weight
                    - Add color for featured plan if desired
                  */}
                  <p className="text-5xl tracking-tight font-extrabold">
                    ${plan.price}
                  </p>

                  {/* Currency label */}
                  {/* 
                    Currency indicator (USD).
                    
                    Customisation:
                    - Change currency text
                    - Update styling
                  */}
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-xs text-base-content/60 uppercase font-semibold">
                      USD
                    </p>
                  </div>
                </div>

                {/* Feature list */}
                {/* 
                  List of features included in this plan.
                  
                  Customisation:
                  - Update feature text in config.ts
                  - Modify checkmark icon
                  - Change spacing (space-y-2.5)
                */}
                {plan.features && (
                  <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {/* Checkmark icon */}
                        {/* 
                          Green checkmark icon for each feature.
                          
                          Customisation:
                          - Change icon style
                          - Update size (w-[18px] h-[18px])
                          - Modify color (currentColor, opacity-80)
                        */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-[18px] h-[18px] opacity-80 shrink-0"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA section */}
                {/* 
                  Checkout button and payment terms.
                  
                  Customisation:
                  - Update button text (in ButtonCheckout component)
                  - Change payment terms text
                  - Modify spacing
                */}
                <div className="space-y-2">
                  {/* Checkout button */}
                  {/* 
                    ButtonCheckout component handles Stripe checkout redirect.
                    Passes plan.priceId to create checkout session.
                    
                    This component:
                    - Calls /api/checkout with priceId
                    - Redirects to Stripe checkout
                    - Handles loading states
                  */}
                  <ButtonCheckout 
                    priceId={plan.priceId} 
                    className="btn-block bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none text-primary-content font-medium" 
                  />

                  {/* Payment terms */}
                  {/* 
                    Payment terms text below button.
                    
                    Customisation:
                    - Update text
                    - Change styling
                    - Remove if not needed
                  */}
                  <p className="flex items-center justify-center gap-2 text-sm text-center text-base-content/80 font-medium relative">
                    Pay once. Access forever.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

