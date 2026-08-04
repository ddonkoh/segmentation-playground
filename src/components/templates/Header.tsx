/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — Header.tsx
 * -----------------------------------------------------------------------------
 * 
 * Navigation header component with logo, links, and CTA button.
 * 
 * Reason:
 * The header is the primary navigation element that appears on every page.
 * It provides users with quick access to key sections (Features, Pricing, Docs)
 * and the main call-to-action (Get Started). Essential for site navigation and
 * conversion.
 * 
 * Features:
 * - Responsive design (desktop: logo left, links center, CTA right)
 * - Mobile menu with burger button that slides in from right
 * - Auto-closes mobile menu on route change (better UX)
 * - Hover effects on navigation links (underline animation)
 * - Accessible (ARIA labels, keyboard navigation)
 * 
 * Layout:
 * Desktop:
 *   [Logo + App Name]  |  [Links: Features, Pricing, Docs, FAQ]  |  [CTA Button]
 * 
 * Mobile:
 *   [Logo + App Name]  [Burger Menu]
 *   When burger clicked: Slide-in menu from right with all links and CTA
 * 
 * Usage:
 *   <Header />
 * 
 * Customisation:
 * - Update `links` array below to change navigation items
 * - Update `cta` constant to change the call-to-action button
 * - Modify className on <header> to change background/styling
 * - Change logo by updating the Image src path
 * 
 * This is a Client Component ("use client") because it uses:
 * - useState for mobile menu open/close state
 * - useEffect for route change detection (closes menu on navigation)
 * - useSearchParams for detecting route changes
 * 
 * Styling Notes:
 * - Uses DaisyUI classes (link, link-hover, btn-primary)
 * - Background: bg-base-200 (light gray, matches ShipFast)
 * - Links have hover effect: underline animation on hover
 * - Mobile menu: fixed position, slides in from right
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import config from "@/config";

/**
 * Navigation links configuration.
 * 
 * Customize these links for your app:
 * - href: The URL path (use /#section for anchor links)
 * - label: The text displayed in the navigation
 * 
 * Example:
 *   { href: "/#pricing", label: "Pricing" }
 *   { href: "/docs", label: "Documentation" }
 */
const links = [
  {
    href: "/#features",
    label: "Features",
  },
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/docs",
    label: "Docs",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

// CTA will be rendered conditionally based on auth state

/**
 * Header component with logo, navigation links, and CTA button.
 * 
 * A header with a logo on the left, links in the center (like Pricing, etc...),
 * and a CTA (like Get Started or Login) on the right.
 * 
 * The header is responsive, and on mobile, the links are hidden behind a burger button.
 * 
 * @returns {JSX.Element} Header component with navigation
 */
const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ uid: string; email: string | null; displayName?: string | null; photoURL?: string | null } | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Check auth status
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const checkAuth = async () => {
      try {
        const { getAuthInstance } = await import("@/lib/firebase/client");
        const { onAuthStateChanged } = await import("firebase/auth");
        const auth = getAuthInstance();
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
        });
      } catch (error) {
        // Firebase not configured yet - this is normal for a boilerplate
        // Only log in development to avoid console spam
        if (process.env.NODE_ENV === "development") {
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes("Firebase is not configured")) {
            console.info("ℹ️ Firebase not configured yet. See /docs/features/firebase-setup for setup instructions.");
          } else {
            console.error("Error checking auth:", error);
          }
        }
        // Don't set user state if Firebase isn't configured
        setUser(null);
      }
    };

    checkAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setShowAccountMenu(false);
      const { getAuthInstance } = await import("@/lib/firebase/client");
      const { signOut } = await import("firebase/auth");
      const auth = getAuthInstance();
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  /**
   * Close mobile menu when route changes.
   * 
   * This improves UX by automatically closing the mobile menu when the user
   * clicks on a link (which triggers a route change).
   * 
   * useEffect watches for changes in searchParams (which includes route changes)
   * and closes the menu when detected.
   */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="bg-base-200">
      <nav
        className="container flex items-center justify-between px-8 py-4 mx-auto"
        aria-label="Global"
      >
        {/* Logo and app name on large screens */}
        {/* 
          This section displays the logo image and app name on the left side.
          On mobile, this is also shown in the mobile menu.
          
          Customisation:
          - Change Image src to use your own logo file
          - Update alt text for accessibility
          - Modify className to change logo size or spacing
        */}
        <div className="flex lg:flex-1">
          <Link
            className="flex items-center gap-2 shrink-0"
            href="/"
            title={`${config.appName} homepage`}
          >
            <Image
              src="/logo_w.png"
              alt={`${config.appName} logo`}
              className="w-8"
              width={32}
              height={32}
              priority={true}
            />
            <span className="font-extrabold text-lg">{config.appName}</span>
          </Link>
        </div>

        {/* Burger button to open menu on mobile */}
        {/* 
          This button is only visible on mobile/tablet screens (lg:hidden).
          When clicked, it opens the mobile menu by setting isOpen to true.
          
          Accessibility:
          - sr-only text for screen readers
          - Proper button type and aria labels
        */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setIsOpen(true)}
            aria-label="Open main menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-base-content"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Navigation links on large screens */}
        {/* 
          These links are only visible on desktop (hidden lg:flex).
          They're centered between the logo and CTA button.
          
          Hover effect:
          - Uses DaisyUI's link link-hover classes
          - Adds underline animation on hover
          - Smooth color transition
          
          Customisation:
          - Update gap-12 to change spacing between links
          - Modify link className to change hover effects
        */}
        <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="link link-hover text-base-content/80 hover:text-primary transition-colors duration-200 relative group"
              title={link.label}
            >
              {link.label}
              {/* Underline animation on hover */}
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-150 origin-left" />
            </Link>
          ))}
        </div>

        {/* CTA button on large screens */}
        {/* 
          This is the call-to-action button (usually "Get Started" or "Login").
          Only visible on desktop (hidden lg:flex).
          Positioned on the right side of the header.
          Changes based on auth status: "Get Started" when logged out, "Account" dropdown when logged in.
        */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1">
          {!user ? (
            <Link
              href={config.auth.loginUrl}
              className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold rounded-lg group bg-gradient-to-br from-primary to-secondary"
            >
              <span className="absolute w-full h-full bg-gradient-to-br from-[#fff8] to-transparent opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300" />
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-[#fff3] animate-shimmer" />
              <span className="relative text-primary-content text-lg">
                Get Started
              </span>
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold rounded-lg group bg-gradient-to-br from-primary to-secondary"
              >
                <span className="absolute w-full h-full bg-gradient-to-br from-[#fff8] to-transparent opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300" />
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-[#fff3] animate-shimmer" />
                <span className="relative text-primary-content text-lg flex items-center">
                  Account
                  <svg 
                    className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${showAccountMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {showAccountMenu && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-base-200 border border-base-300 rounded-lg shadow-lg py-1 z-50"
                  onMouseLeave={() => setShowAccountMenu(false)}
                >
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-base-content/90 hover:bg-base-300 hover:text-primary transition-colors"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/account"
                    className="block px-4 py-2 text-base-content/90 hover:bg-base-300 hover:text-primary transition-colors"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/dashboard/billing"
                    className="block px-4 py-2 text-base-content/90 hover:bg-base-300 hover:text-primary transition-colors"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    Billing
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-base-content/90 hover:bg-base-300 hover:text-primary transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu - shows/hides based on menu state */}
      {/* 
        This is the slide-in menu that appears on mobile when the burger button is clicked.
        
        Behavior:
        - Fixed position, slides in from right
        - Full height, scrollable if content overflows
        - Closes when user clicks a link (via useEffect)
        - Can be closed by clicking the X button
        
        Styling:
        - bg-base-200 matches header background
        - sm:max-w-sm limits width on small screens
        - transform origin-right for slide-in animation
        - transition ease-in-out for smooth animation
      */}
      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className={`fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-base-200 sm:max-w-sm sm:ring-1 sm:ring-neutral/10 transform origin-right transition ease-in-out duration-300`}
        >
          {/* Logo and app name on small screens */}
          {/* 
            Same logo as desktop, but displayed in the mobile menu header.
            Includes close button (X) to close the menu.
          */}
          <div className="flex items-center justify-between">
            <Link
              className="flex items-center gap-2 shrink-0"
              href="/"
              title={`${config.appName} homepage`}
            >
              <Image
                src="/logo_w.png"
                alt={`${config.appName} logo`}
                className="w-8"
                width={32}
                height={32}
                priority={true}
              />
              <span className="font-extrabold text-lg">{config.appName}</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation links on small screens */}
          {/* 
            All navigation links displayed vertically in the mobile menu.
            Uses same links array as desktop for consistency.
            
            Styling:
            - flex flex-col for vertical layout
            - gap-y-4 for spacing between links
            - link link-hover for hover effects
          */}
          <div className="flow-root mt-6">
            <div className="py-4">
              <div className="flex flex-col gap-y-4 items-start">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className="link link-hover text-base-content/80 hover:text-primary transition-colors duration-200"
                    title={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="divider"></div>
            {/* CTA button on small screens */}
            {/* 
              Same CTA button as desktop, but displayed at the bottom of mobile menu.
              This ensures users can still access the main call-to-action on mobile.
              Changes based on auth status: "Get Started" when logged out, "Account" dropdown when logged in.
            */}
            <div className="flex flex-col">
              {!user ? (
                <Link
                  href={config.auth.loginUrl}
                  className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold rounded-lg group bg-gradient-to-br from-primary to-secondary"
                >
                  <span className="absolute w-full h-full bg-gradient-to-br from-[#fff8] to-transparent opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300" />
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-[#fff3] animate-shimmer" />
                  <span className="relative text-primary-content text-lg">
                    Get Started
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    className="btn btn-primary w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/account"
                    className="btn btn-ghost w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/dashboard/billing"
                    className="btn btn-ghost w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Billing
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="btn btn-ghost w-full text-error"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
