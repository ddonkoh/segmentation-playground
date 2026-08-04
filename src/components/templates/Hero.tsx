/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — Hero.tsx
 * -----------------------------------------------------------------------------
 * 
 * Hero section component with headline, description, CTA button, and image.
 * 
 * Reason:
 * The hero section is the first thing users see when they land on your site.
 * It's the main marketing section that communicates your value proposition,
 * includes the primary call-to-action, and sets the tone for your product.
 * Critical for first impressions and conversions.
 * 
 * Features:
 * - Responsive layout (stacked on mobile, side-by-side on desktop)
 * - Clean, simple design (matches ShipFast aesthetic)
 * - Optional badge/award section (customize or remove)
 * - Testimonials avatars for social proof
 * - Product demo image
 * 
 * Layout:
 * Desktop:
 *   [Left: Badge, Heading, Description, Button, Testimonials] | [Right: Image]
 * 
 * Mobile:
 *   [Badge, Heading, Description, Button, Testimonials, Image] (stacked)
 * 
 * Usage:
 *   <Hero />
 * 
 * Customisation:
 * - Update heading text to match your product
 * - Update description to explain your value proposition
 * - Change button text and href
 * - Replace image with your product demo
 * - Remove or customize the badge section
 * - Update TestimonialsAvatars text/numbers
 * 
 * This is a Server Component (no "use client") because it doesn't need
 * client-side interactivity. All content is static.
 * 
 * Styling Notes:
 * - Uses DaisyUI classes (btn, btn-primary)
 * - Simple, clean design (no complex animations)
 * - Matches ShipFast's minimal aesthetic
 * - Easy to customize for your brand
 * 
 * -----------------------------------------------------------------------------
 */

import Image from "next/image";
import Link from "next/link";
import TestimonialsAvatars from "../ui/TestimonialsAvatars";
import config from "@/config";

/**
 * Hero section component.
 * 
 * A simple hero section with headline, description, CTA button, testimonials,
 * and a product demo image. Clean and minimal, perfect for a boilerplate.
 * 
 * @returns {JSX.Element} Hero section component
 */
const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-12 lg:py-24 min-h-[85vh]">
      {/* Left side: Content */}
      {/* 
        This section contains the main hero content:
        - Badge (optional - remove if not needed)
        - Heading
        - Description
        - CTA button
        - Testimonials avatars
        
        Customisation:
        - Remove the badge section if you don't need it
        - Update heading and description text
        - Change button href and text
        - Customize TestimonialsAvatars component
      */}
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        {/* Optional badge/award section */}
        {/* 
          This is an optional badge that can be used to highlight awards,
          certifications, or special features. Remove this section if not needed.
          
          Examples:
          - Product Hunt badge
          - "Security-First" badge
          - "Trusted by X companies"
          
          Customisation:
          - Update badge text and icon
          - Change styling (bg-primary/10, border-primary/20)
          - Remove entire section if not needed
        */}
        {/* Uncomment and customize if you want a badge:
        <a
          href="https://example.com"
          target="_blank"
          className="-mb-4 md:-mb-6 group"
          title="Badge link"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
            <span className="text-sm font-semibold text-primary">Your Badge Text</span>
        </div>
        </a>
        */}

        {/* Main heading */}
        {/* 
          The main hero headline. Keep it clear and value-focused.
          
          Customisation:
          - Update text to match your product
          - Adjust text size (text-4xl lg:text-6xl)
          - Add gradient text if desired (bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent)
        */}
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
          Ship your startup safely from day one
        </h1>

        {/* Description */}
        {/* 
          The hero description explains what your product does and why it matters.
          
          Customisation:
          - Update text to explain your value proposition
          - Adjust opacity (opacity-80) for different emphasis
          - Change max-width if needed
        */}
        <p className="text-lg opacity-80 leading-relaxed">
          The NextJS boilerplate with all you need to build your SaaS, AI tool,
          or any other web app. From idea to production safely.
        </p>

        {/* CTA button */}
        {/* 
          The main call-to-action button. This is what you want users to click.
          
          Customisation:
          - Update href to point to your signup/login page
          - Change button text
          - Modify styling (btn-primary, btn-wide)
          - Update icon (currently shield icon for security theme)
          - Add additional buttons if needed
        */}
          <Link 
            href={config.auth.loginUrl} 
          className="btn btn-primary btn-wide gap-2"
          >
          <Image
            src="/logo_w.png"
            alt={`${config.appName} logo`}
            width={20}
            height={20}
            className="w-5 h-5"
              />
            Get {config.appName}
          </Link>

        {/* Testimonials avatars */}
        {/* 
          Social proof component showing user avatars and ratings.
          
          Customisation:
          - Update TestimonialsAvatars component to change text/numbers
          - Modify avatars array in TestimonialsAvatars.tsx
          - Remove if not needed
        */}
        <TestimonialsAvatars priority={true} />
      </div>
      
      {/* Right side: Product demo image */}
      {/* 
        The product demo image. This should showcase your product or a relevant
        visual that represents what you're building.
        
        Customisation:
        - Replace image src with your product screenshot/demo
        - Update alt text for accessibility
        - Adjust width/height as needed
        - Remove if you don't need an image
      */}
      <div className="lg:w-full">
          <Image
            src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
          alt="Product Demo"
          className="w-full"
            priority={true}
          width={500}
          height={500}
          />
      </div>
    </section>
  );
};

export default Hero;
