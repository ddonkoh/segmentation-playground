/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — FeaturesGrid.tsx
 * -----------------------------------------------------------------------------
 * 
 * Security features showcase displaying the 7-layer security stack.
 * 
 * Reason:
 * This section comes after the Problem section and showcases your solution.
 * It highlights the security features that solve the problems mentioned earlier.
 * This builds trust and demonstrates value by showing what's included in the
 * boilerplate. Perfect for security-focused SaaS products.
 * 
 * Features:
 * - Grid layout (responsive: 1 column mobile, 2 tablet, 3 desktop)
 * - Color-coded icons with badges (shows status: Default, Built-in, Active, etc.)
 * - Hover effects (card lift, border highlight, icon scale)
 * - Clean card design with DaisyUI styling
 * 
 * Layout:
 * Desktop (3 columns):
 *   [Feature 1] [Feature 2] [Feature 3]
 *   [Feature 4] [Feature 5] [Feature 6]
 * 
 * Tablet (2 columns):
 *   [Feature 1] [Feature 2]
 *   [Feature 3] [Feature 4]
 *   [Feature 5] [Feature 6]
 * 
 * Mobile (1 column):
 *   [Feature 1]
 *   [Feature 2]
 *   ...
 * 
 * Usage:
 *   <FeaturesGrid />
 * 
 * Customisation:
 * - Update `features` array to change security features
 * - Modify icons (replace SVG paths)
 * - Change colors (text-blue-500, bg-blue-50, etc.)
 * - Update badges (Default, Built-in, Active, etc.)
 * - Adjust grid columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
 * - Modify hover effects (hover:shadow-lg, hover:-translate-y-1)
 * 
 * This is a Client Component ("use client") because it uses:
 * - Interactive hover effects (though could be Server Component if simplified)
 * - Group hover states for better UX
 * 
 * Styling Notes:
 * - Uses DaisyUI classes (badge, bg-base-200, border)
 * - Color-coded icons for visual interest
 * - Hover effects for interactivity
 * - Clean, professional design
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

/**
 * FeaturesGrid component.
 * 
 * Displays a grid of security features with icons, badges, and descriptions.
 * Each feature card has hover effects and color-coded icons for visual appeal.
 * 
 * @returns {JSX.Element} FeaturesGrid section component
 */
const FeaturesGrid = () => {
  /**
   * Security features array.
   * 
   * Customisation:
   * - Add/remove features (currently 6 features)
   * - Update titles and descriptions
   * - Change icons (replace SVG paths)
   * - Modify colors (text-blue-500, bg-blue-50, etc.)
   * - Update badges (Default, Built-in, Active, etc.)
   */
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "HTTPS Enforcement",
      description: "All traffic encrypted by default. No exceptions.",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      badge: "Default",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "CSRF Protection",
      description: "Double-submit token protection on all mutations.",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
      badge: "Built-in",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Rate Limiting",
      description: "IP-based rate limiting prevents abuse and attacks.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      badge: "Active",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Security Headers",
      description: "CSP, HSTS, and XSS protection headers configured.",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      badge: "Configured",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Auth Guards",
      description: "Middleware-based route protection for sensitive pages.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      badge: "Enabled",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: "Audit Logging",
      description: "Complete security event logging for compliance.",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
      badge: "Compliant",
    },
  ];

  return (
    <section className="bg-base-100 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        {/* 
          The section title and description.
          
          Customisation:
          - Update "Security" label (font-medium text-primary)
          - Change main heading text
          - Modify description text
          - Adjust text sizes (text-3xl lg:text-5xl)
        */}
        <div className="text-center mb-16">
          <p className="font-medium text-primary mb-4">Security</p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight mb-4">
            7-Layer Security Stack
          </h2>
          <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
            Security isn&apos;t an afterthought. Every layer is built-in and enabled by default.
          </p>
        </div>

        {/* Features grid */}
        {/* 
          Grid layout displaying all security features.
          
          Customisation:
          - Change grid columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
          - Adjust gap spacing (gap-6)
          - Modify card styling (bg-base-200, rounded-lg, border)
          - Update hover effects (hover:shadow-lg, hover:-translate-y-1)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-base-200 p-6 rounded-lg border border-base-content/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Icon and badge */}
              {/* 
                Icon container with colored background and badge.
                
                Customisation:
                - Change icon size (w-6 h-6)
                - Modify icon colors (text-blue-500, bg-blue-50)
                - Update badge text and styling
                - Adjust hover scale (group-hover:scale-110)
              */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${feature.bgColor} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                {feature.badge && (
                  <span className="badge badge-sm badge-primary badge-outline">
                    {feature.badge}
                  </span>
                )}
              </div>

              {/* Feature title */}
              {/* 
                Feature title with hover color change.
                
                Customisation:
                - Update title text
                - Change text size (text-xl)
                - Modify hover color (group-hover:text-primary)
              */}
              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              {/* Feature description */}
              {/* 
                Feature description text.
                
                Customisation:
                - Update description text
                - Change text opacity (text-base-content/80)
                - Adjust line height (leading-relaxed)
              */}
              <p className="text-base-content/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;

