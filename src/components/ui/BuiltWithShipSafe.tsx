/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — BuiltWithShipSafe.tsx
 * -----------------------------------------------------------------------------
 * 
 * Attribution badge component linking to ShipSafe.st.
 * 
 * Reason:
 * Provides a way to attribute ShipSafe boilerplate usage while linking back
 * to the main ShipSafe website. Useful for footer sections and brand recognition.
 * 
 * Features:
 * - Logo icon + "ShipSafe" text
 * - Links to ShipSafe.st
 * - Hover effects
 * - Consistent branding
 * 
 * Usage:
 *   <BuiltWithShipSafe />
 * 
 * Customisation:
 * - Update link URL (currently https://shipsafe.st)
 * - Modify styling
 * - Change text
 * 
 * -----------------------------------------------------------------------------
 */

import Link from "next/link";
import Image from "next/image";

/**
 * Built with ShipSafe attribution component.
 * 
 * Displays logo and "Built with ShipSafe" text with link.
 * 
 * @returns {JSX.Element} BuiltWithShipSafe component
 */
const BuiltWithShipSafe = () => {
  return (
    <Link
      href="https://shipsafe.st"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/70 hover:border-gray-600 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-2">
        {/* Text */}
        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
          Built with
        </span>
        
        {/* Logo icon */}
        <Image
          src="/_shipsafe-logo-w.svg"
          alt="ShipSafe logo"
          width={16}
          height={16}
          className="w-4 h-4"
        />
        
        {/* Brand name */}
        <span className="text-xs text-white group-hover:text-gray-200 transition-colors font-medium">
          ShipSafe
        </span>
      </div>
    </Link>
  );
};

export default BuiltWithShipSafe;

