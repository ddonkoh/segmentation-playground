/**
 * -----------------------------------------------------------------------------
 * ShipSafe Docs — Top Banner Component
 * -----------------------------------------------------------------------------
 * Banner that links to main docs page, only shown when not on /docs
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DocsBanner() {
  const pathname = usePathname();
  
  // Don't show banner on the main /docs page
  if (pathname === "/docs") {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/20">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-focus transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <span className="font-semibold">Get Started</span>
          <span className="text-sm opacity-70">- Complete documentation overview</span>
        </Link>
      </div>
    </div>
  );
}

