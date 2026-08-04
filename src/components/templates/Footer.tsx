/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — Footer.tsx
 * -----------------------------------------------------------------------------
 * 
 * Footer component with navigation links, legal pages, and branding.
 * 
 * Reason:
 * The footer provides site-wide navigation, legal links, and branding at the
 * bottom of every page. It helps users find important information and maintains
 * brand consistency. Essential for SEO, navigation, and legal compliance.
 * Clean, organized footer structure.
 * 
 * Features:
 * - Logo and description section
 * - Navigation links (Quick Links, Legal)
 * - "Built with ShipSafe" component (UI component with logo)
 * - Copyright notice
 * - Responsive grid layout
 * - Clean, coherent style
 * 
 * Layout:
 * Desktop:
 *   [Logo + Description + Built with] [Quick Links] [Legal]
 *   [Copyright]
 * 
 * Mobile:
 *   Stacks vertically for better mobile experience
 * 
 * Usage:
 *   <Footer />
 * 
 * Customisation:
 * - Update navigation links in `navigation` object
 * - Change description text
 * - Modify "Built with ShipSafe" component (in BuiltWithShipSafe.tsx)
 * - Update copyright notice
 * - Add/remove link sections
 * 
 * This is a Client Component ("use client") because it may use:
 * - Interactive elements
 * 
 * Styling Notes:
 * - Clean, organized layout
 * - Consistent with other sections' background
 * - Easy to customize for your brand
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import BuiltWithShipSafe from "@/components/ui/BuiltWithShipSafe";

/**
 * Navigation links configuration.
 * 
 * Customisation:
 * - Add/remove link categories
 * - Update href paths
 * - Change link labels
 */
const navigation = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "FAQ", href: "/#faq" },
    { name: "Docs", href: "/docs" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

/**
 * Footer component with navigation, legal links, and branding.
 * 
 * Displays logo, description, navigation links, legal pages, and
 * "Built with ShipSafe" attribution component.
 * 
 * @returns {JSX.Element} Footer component
 */
const Footer = () => {
  return (
    <footer className="bg-base-200 border-t border-base-content/10">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          {/* 
            Logo with "ShipSafe" text, app description, and "Built with ShipSafe" component.
            
            Customisation:
            - Update description text
            - Change logo size/positioning
            - Modify BuiltWithShipSafe component styling
          */}
          <div className="md:col-span-2">
            {/* Logo with text */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo_w.png"
                alt={`${config.appName} logo`}
                className="w-10 h-10"
                width={40}
                height={40}
              />
              <span className="font-extrabold text-xl">{config.appName}</span>
            </Link>
            
            {/* Description */}
            <p className="mt-4 text-sm text-base-content/60 max-w-md">
              {config.appDescription}
            </p>

            {/* Built with ShipSafe component */}
            {/* 
              Attribution component with logo and link.
              Uses BuiltWithShipSafe UI component.
            */}
            <div className="mt-4 inline-block">
              <BuiltWithShipSafe />
            </div>
          </div>

          {/* Quick Links */}
          {/* 
            Product/navigation links section.
            
            Customisation:
            - Update links in navigation.product array
            - Change section title
            - Add/remove links
          */}
          <div>
            <h3 className="text-base-content font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {navigation.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base-content/60 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          {/* 
            Legal links section (Privacy, Terms, etc.).
            
            Customisation:
            - Update links in navigation.legal array
            - Change section title
            - Add/remove legal pages
          */}
          <div>
            <h3 className="text-base-content font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base-content/60 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        {/* 
          Copyright notice at bottom.
          
          Customisation:
          - Update copyright text
          - Change date format
        */}
        <div className="mt-8 pt-8 border-t border-base-content/10">
          <p className="text-center text-base-content/60 text-sm">
            © {new Date().getFullYear()} {config.appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
