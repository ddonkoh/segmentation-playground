/**
 * -----------------------------------------------------------------------------
 * ShipSafe Dashboard Layout
 * -----------------------------------------------------------------------------
 * Protected route layout for dashboard pages.
 * Includes sidebar navigation for consistent dashboard experience.
 *
 * Security:
 *   - Auth guard handled by middleware
 *   - Server Component by default
 *
 * Structure:
 *   - Sidebar navigation (left)
 *   - Main content area (right)
 *   - Responsive layout (sidebar collapses on mobile)
 *
 * -----------------------------------------------------------------------------
 */

import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import DashboardSidebar from "@/components/templates/DashboardSidebar";

// -----------------------------------------------------------------------------
// 1. Metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = generateSEOMetadata({
  title: "Dashboard",
  description: "Your ShipSafe dashboard",
  path: "/dashboard",
});

// -----------------------------------------------------------------------------
// 2. Dashboard Layout Component
// -----------------------------------------------------------------------------

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Sidebar Navigation */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}

