/**
 * -----------------------------------------------------------------------------
 * ShipSafe Docs — Layout
 * -----------------------------------------------------------------------------
 * Layout wrapper for documentation pages with sidebar navigation.
 * 
 * -----------------------------------------------------------------------------
 */

import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsBanner from "@/components/docs/DocsBanner";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-base-200 via-base-200 to-base-300">
        <DocsSidebar />
        <main className="flex-1">
          {/* Top Banner - Link to main docs (only shown when not on /docs) */}
          <DocsBanner />
          
          <div className="max-w-6xl mx-auto px-8 py-12">{children}</div>
        </main>
      </div>
    </>
  );
}

