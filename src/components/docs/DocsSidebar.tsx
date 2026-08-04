/**
 * -----------------------------------------------------------------------------
 * ShipSafe Docs — Sidebar Navigation Component
 * -----------------------------------------------------------------------------
 * Collapsible sidebar navigation for documentation.
 * 
 * Features:
 *   - Collapsible sections
 *   - Active page highlighting
 *   - Responsive design
 *   - Smooth scrolling
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { DocItem } from "@/lib/docs/docs-structure";
import { getDocsStructure } from "@/lib/docs/docs-structure";
import config from "@/config";

interface DocsSidebarProps {
  currentPath?: string;
}

export default function DocsSidebar({ currentPath }: DocsSidebarProps) {
  const pathname = usePathname();
  const activePath = currentPath || pathname.replace("/docs/", "") || "overview";
  // All sections collapsed by default - users can expand as needed
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set()
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const structure = getDocsStructure();

  // Auto-open all parent sections containing the current page, close others
  useEffect(() => {
    if (!activePath || activePath === "overview") {
      // Overview page - close all sections
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenSections(new Set());
      return;
    }

    // Find all parent sections (both top-level and nested) that contain the active path
    const findParentSections = (path: string, items: DocItem[], currentParents: string[] = []): string[] => {
      for (const item of items) {
        if (item.children) {
          // Check if this section contains the path
          const isMatch = path === item.path || path.startsWith(`${item.path}/`);
          
          if (isMatch) {
            // This section contains the path - add it to parents
            const newParents = [...currentParents, item.path];
            
            // Recursively check children to find nested sections
            const childResult = findParentSections(path, item.children, newParents);
            
            // If children found a match, return that result (includes this section + nested)
            // Otherwise, if this section itself is the match, return just this section
            if (childResult.length > newParents.length) {
              return childResult; // Found in children - return full path
            } else if (path === item.path) {
              return newParents; // This section is the match
            } else {
              return newParents; // Path starts with this section's path
            }
          }
        } else {
          // Leaf node - check if it matches exactly
          if (path === item.path) {
            return currentParents; // Return all parent sections leading to this leaf
          }
        }
      }
      return []; // No match found in this branch
    };

    const parentSections = findParentSections(activePath, structure);
    if (parentSections.length > 0) {
      // Open all parent sections (both top-level and nested)
      setOpenSections(new Set(parentSections));
    } else {
      // No parent section found - close all
      setOpenSections(new Set());
    }
  }, [activePath, structure]);

  const toggleSection = (path: string) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(path)) {
      newOpen.delete(path);
    } else {
      newOpen.add(path);
    }
    setOpenSections(newOpen);
  };

  const isActive = (itemPath: string): boolean => {
    return activePath === itemPath || activePath.startsWith(`${itemPath}/`);
  };

  // Icon mapping for sections
  const getSectionIcon = (path: string) => {
    const icons: Record<string, React.ReactElement> = {
      "get-started": (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      "tutorials": (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      "features": (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      "components": (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      "security": (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      "deployment": (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      "extras": (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    };
    return icons[path] || (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const renderItem = (item: DocItem, level: number = 0): React.ReactElement => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections.has(item.path);
    const active = isActive(item.path);
    const indent = level * 16;

    if (hasChildren) {
      const icon = getSectionIcon(item.path);
      return (
        <div key={item.path} className="mb-1">
          <button
            onClick={() => toggleSection(item.path)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between gap-3 shadow-sm ${
              active
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-content font-semibold shadow-lg"
                : "hover:bg-base-300/50 text-base-content hover:shadow-md"
            }`}
            style={{ paddingLeft: `${12 + indent}px` }}
          >
            <div className="flex items-center gap-3">
              <span className={active ? "text-primary-content" : "text-primary/70"}>
                {icon}
              </span>
              <span>{item.title}</span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="mt-2 ml-4 space-y-1 border-l-2 border-base-300 pl-4">
              {item.children!.map((child) => renderItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        href={`/docs/${item.path}`}
        className={`block px-4 py-2.5 rounded-lg transition-all duration-200 ${
          active
            ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-semibold border-l-4 border-primary shadow-sm"
            : "hover:bg-base-300/30 text-base-content/80 hover:text-base-content"
        }`}
        style={{ paddingLeft: `${12 + indent}px` }}
      >
        {item.title}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="p-6 bg-gradient-to-b from-base-100 to-base-200 min-h-screen">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-base-300">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image 
            src="/logo_w.png" 
            alt={config.appName} 
            width={32} 
            height={32}
            className="shrink-0"
          />
          <span className="font-extrabold text-lg text-white">
            {config.appName}
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden btn btn-sm btn-circle btn-ghost"
        >
          ✕
        </button>
      </div>
      <nav className="space-y-2">
        {structure.map((section) => renderItem(section))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-50 btn btn-circle btn-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-gradient-to-b from-base-100 via-base-100 to-base-200 border-r border-base-300 h-screen overflow-y-auto sticky top-0 shadow-lg">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-base-100 border-r border-base-300 z-50 overflow-y-auto">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

