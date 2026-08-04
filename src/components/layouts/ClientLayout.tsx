/**
 * -----------------------------------------------------------------------------
 * ShipSafe Client Layout Component
 * -----------------------------------------------------------------------------
 * Client-side wrappers and providers.
 * Handles client-side only features like toasts, tooltips, analytics.
 *
 * Why this exists:
 *   Some features require client-side JavaScript:
 *     - Toast notifications
 *     - Tooltip providers
 *     - Analytics (if needed)
 *     - Error boundaries (client-side)
 *
 * Security:
 *   - No sensitive data in client components
 *   - Analytics only if configured
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { ReactNode } from "react";

export interface ClientLayoutProps {
  /**
   * Child components
   */
  children: ReactNode;
}

/**
 * ClientLayout component for client-side wrappers.
 * 
 * All the client wrappers are here (they can't be in server components)
 * Currently minimal - can be extended with:
 * - Toast providers (react-hot-toast, sonner, etc.)
 * - Tooltip providers
 * - Analytics providers (Plausible, Vercel Analytics, etc.)
 * - Error boundaries
 */
const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <>
      {/* Content inside app/page.tsx files */}
      {children}

      {/* Toast notifications can be added here */}
      {/* <Toaster /> */}
      
      {/* Tooltip provider can be added here */}
      {/* <Tooltip /> */}
      
      {/* Analytics can be added here */}
      {/* <Analytics /> */}
    </>
  );
};

export default ClientLayout;

