/**
 * -----------------------------------------------------------------------------
 * ShipSafe Dashboard Sidebar Component
 * -----------------------------------------------------------------------------
 * Navigation sidebar for dashboard pages.
 * 
 * Features:
 *   - Clean, minimal sidebar navigation
 *   - Active route highlighting
 *   - Mobile-responsive (collapsible)
 *   - Icons for each navigation item
 * 
 * Usage:
 *   Used in dashboard layout to provide consistent navigation
 *   across all dashboard pages (/dashboard, /dashboard/account, /dashboard/billing)
 * 
 * Customization:
 *   - Add/remove navigation items
 *   - Update icons (using Heroicons/Lucide)
 *   - Change colors to match your theme
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Navigation items configuration.
 * 
 * Add or remove items here to customize your dashboard navigation.
 * Each item should have:
 *   - href: The route path
 *   - label: Display text
 *   - icon: Icon SVG path (for outline version)
 *   - iconSolid: Icon SVG path (for solid version, used when active)
 */
const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
    iconSolid: "M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69zM12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z",
  },
  {
    href: "/dashboard/account",
    label: "Account",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
    iconSolid: "M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
    iconSolid: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
  },
];

/**
 * DashboardSidebar component.
 * 
 * Displays a sidebar navigation menu with active route highlighting.
 * On mobile, the sidebar can be hidden/shown (controlled by parent layout).
 * 
 * @returns {JSX.Element} Sidebar navigation component
 */
export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-base-200 border-r border-base-300 p-4">
      {/* Logo/Brand */}
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-content font-bold text-sm">
              S
            </span>
          </div>
          <span className="text-lg font-semibold text-base-content">
            Dashboard
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const iconPath = isActive ? item.iconSolid : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
                }
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isActive ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={isActive ? 0 : 1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={iconPath}
                />
              </svg>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Optional: User section at bottom */}
      <div className="mt-auto pt-8 border-t border-base-300">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base-content/70 hover:bg-base-300 hover:text-base-content transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>
    </aside>
  );
}

