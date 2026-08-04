/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — FeaturesListicle.tsx
 * -----------------------------------------------------------------------------
 * 
 * Interactive feature showcase with tabbed navigation and detailed descriptions.
 * 
 * Reason:
 * This section comes after FeaturesGrid and provides detailed information
 * about each major feature category. It uses an interactive tab system where
 * users can click on feature icons to see detailed lists of what's included.
 * This helps developers understand the value and saves them from reading
 * through all documentation upfront.
 * 
 * Features:
 * - Interactive tab navigation (click icons to switch features)
 * - Auto-rotating feature display (optional, stops when user interacts)
 * - Detailed feature lists with checkmarks
 * - Time saved indicators for each feature
 * - Smooth transitions between feature changes
 * 
 * Layout:
 * Desktop:
 *   [Header: Code snippet, Title, Description]
 *   [Feature Icons Row: Clickable icons with labels]
 *   [Feature Details: Selected feature's detailed list]
 * 
 * Mobile:
 *   [Header: Code snippet, Title, Description]
 *   [Feature Icons Grid: 4-column grid]
 *   [Feature Details: Selected feature's detailed list]
 * 
 * Usage:
 *   <FeaturesListicle />
 * 
 * Customisation:
 * - Update `features` array to change feature categories
 * - Modify code snippet (currently security-themed)
 * - Change auto-rotate interval (currently 5000ms)
 * - Update feature descriptions and time saved values
 * - Adjust icon SVGs
 * - Modify layout (grid columns, spacing, etc.)
 * 
 * This is a Client Component ("use client") because it uses:
 * - useState for selected feature state
 * - useEffect for auto-rotation logic
 * - useRef for intersection observer
 * - onClick handlers for interactivity
 * 
 * Styling Notes:
 * - Uses DaisyUI classes (bg-base-100, bg-base-200)
 * - Interactive hover states on icons
 * - Primary color for selected state
 * - Smooth transitions (duration-200, duration-100)
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Features array with icons, names, and detailed descriptions.
 * 
 * Customisation:
 * - Add/remove features (currently 5 features)
 * - Update feature names
 * - Modify feature descriptions (add/remove list items)
 * - Change time saved values
 * - Replace icon SVGs
 */
const features = [
  {
    name: "Authentication",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "Firebase Authentication with email/password",
            "Google OAuth integration",
            "Protected routes with middleware",
            "Session management & token refresh",
            "Secure password reset flow",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] inline shrink-0 opacity-80"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-primary font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-[18px] h-[18px] inline shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            Time saved: 4 hours
          </li>
        </ul>
      </>
    ),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
        />
      </svg>
    ),
  },
  {
    name: "Security",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "7-layer security stack built-in",
            "CSRF protection on all mutations",
            "Rate limiting to prevent abuse",
            "Security headers (CSP, HSTS, XSS)",
            "HTTPS enforcement",
            "Audit logging for compliance",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] inline shrink-0 opacity-80"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-primary font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-[18px] h-[18px] inline shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            Time saved: 8+ hours
          </li>
        </ul>
      </>
    ),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.42-.277-2.77-.78-4.006A11.94 11.94 0 0012 2.714z"
        />
      </svg>
    ),
  },
  {
    name: "Payments",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "Stripe Checkout integration",
            "Webhook handling for subscriptions",
            "Billing portal for customers",
            "Secure payment processing",
            "Subscription management",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] inline shrink-0 opacity-80"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-primary font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-[18px] h-[18px] inline shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            Time saved: 5 hours
          </li>
        </ul>
      </>
    ),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
      </svg>
    ),
  },
  {
    name: "Database",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "Firestore integration with Firebase Admin",
            "Type-safe data models",
            "Secure data access patterns",
            "Real-time updates support",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] inline shrink-0 opacity-80"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-primary font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-[18px] h-[18px] inline shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            Time saved: 3 hours
          </li>
        </ul>
      </>
    ),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
  {
    name: "UI Components",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "DaisyUI + TailwindCSS components",
            "Pre-built landing page templates",
            "Responsive design patterns",
            "Accessible components",
            "Dark mode support",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] inline shrink-0 opacity-80"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-primary font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-[18px] h-[18px] inline shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            Time saved: 6 hours
          </li>
        </ul>
      </>
    ),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
        />
      </svg>
    ),
  },
];

/**
 * FeaturesListicle component.
 * 
 * Interactive feature showcase with tabbed navigation. Features auto-rotate
 * every 5 seconds until the user interacts, then stops auto-rotation.
 * 
 * @returns {JSX.Element} FeaturesListicle section component
 */
const FeaturesListicle = () => {
  const featuresEndRef = useRef<HTMLParagraphElement>(null);
  const [featureSelected, setFeatureSelected] = useState(features[0].name);
  const [hasClicked, setHasClicked] = useState(false);

  /**
   * Auto-rotate features every 5 seconds.
   * 
   * Stops auto-rotation when:
   * - User clicks on a feature (hasClicked = true)
   * - User scrolls past the section (intersection observer)
   * 
   * Customisation:
   * - Change interval duration (currently 5000ms)
   * - Modify intersection threshold (currently 0.5)
   * - Remove auto-rotation entirely (remove useEffect)
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasClicked) {
        const index = features.findIndex(
          (feature) => feature.name === featureSelected
        );
        const nextIndex = (index + 1) % features.length;
        setFeatureSelected(features[nextIndex].name);
      }
    }, 5000);

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            clearInterval(interval);
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );
      if (featuresEndRef.current) {
        observer.observe(featuresEndRef.current);
      }
    } catch (e) {
      console.error(e);
    }

    return () => clearInterval(interval);
  }, [featureSelected, hasClicked]);

  return (
    <section className="py-24 bg-base-100" id="features">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        {/* 
          Header section with code snippet, title, and description.
          
          Customisation:
          - Update code snippet (currently security-themed)
          - Change heading text
          - Modify description text
          - Adjust text sizes and spacing
        */}
        <div className="bg-base-100 max-md:px-8 max-w-3xl">
          {/* Code snippet badge */}
          {/* 
            Unique code snippet related to security theme.
            Different from ShipFast's "const launch_time = 'Today'"
            
            Customisation:
            - Change snippet text
            - Modify styling (text-primary, font-mono)
            - Remove if not needed
          */}
          <p className="text-primary font-medium text-sm font-mono mb-3">
            const security_layers = 7;
          </p>

          {/* Main heading */}
          <h2 className="font-extrabold text-3xl lg:text-5xl tracking-tight mb-8">
            Ship securely. Launch faster. Build confidently.
          </h2>

          {/* Description */}
          <div className="text-base-content/80 leading-relaxed mb-8 lg:text-lg">
            Security-first boilerplate with authentication, payments, and production-ready security layers. Spend your time building features, not configuring security middleware.
          </div>
        </div>
      </div>

      {/* Feature navigation and details */}
      <div>
        {/* Feature icons row */}
        {/* 
          Clickable feature icons that switch the displayed feature.
          
          Customisation:
          - Change grid layout (grid-cols-4 for mobile)
          - Adjust gap spacing (gap-4 md:gap-12)
          - Modify icon sizes (w-8 h-8)
          - Change hover/selected states
        */}
        <div className="grid grid-cols-4 md:flex justify-start gap-4 md:gap-12 max-md:px-8 max-w-3xl mx-auto mb-8">
          {features.map((feature) => (
            <span
              key={feature.name}
              onClick={() => {
                if (!hasClicked) setHasClicked(true);
                setFeatureSelected(feature.name);
              }}
              className={`flex flex-col items-center justify-center gap-3 select-none cursor-pointer p-2 duration-200 group`}
            >
              {/* Icon */}
              <span
                className={`duration-100 ${
                  featureSelected === feature.name
                    ? "text-primary"
                    : "text-base-content/30 group-hover:text-base-content/50"
                }`}
              >
                {feature.svg}
              </span>
              {/* Label */}
              <span
                className={`font-semibold text-sm text-center ${
                  featureSelected === feature.name
                    ? "text-primary"
                    : "text-base-content/50"
                }`}
              >
                {feature.name}
              </span>
            </span>
          ))}
        </div>

        {/* Feature details panel */}
        {/* 
          Displays the detailed description of the selected feature.
          
          Customisation:
          - Change background color (bg-base-200)
          - Adjust padding (px-12 md:px-0 py-12)
          - Modify max-width (max-w-xl)
          - Change animation (animate-opacity)
        */}
        <div className="bg-base-200">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-center md:justify-start md:items-center gap-12">
            <div
              className="text-base-content/80 leading-relaxed space-y-4 px-12 md:px-0 py-12 max-w-xl animate-opacity"
              key={featureSelected}
            >
              {/* Feature title */}
              <h3 className="font-semibold text-base-content text-lg">
                {features.find((f) => f.name === featureSelected)?.name}
              </h3>

              {/* Feature description list */}
              {features.find((f) => f.name === featureSelected)?.description}
            </div>
          </div>
        </div>
      </div>

      {/* Intersection observer target (invisible) */}
      {/* 
        Used by intersection observer to detect when user scrolls past section.
        Stops auto-rotation when this element is visible.
        
        Customisation:
        - Remove if you don't want auto-rotation stopping on scroll
      */}
      <p className="opacity-0" ref={featuresEndRef}></p>
    </section>
  );
};

export default FeaturesListicle;
