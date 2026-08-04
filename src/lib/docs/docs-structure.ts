/**
 * -----------------------------------------------------------------------------
 * ShipSafe Docs — Documentation Structure
 * -----------------------------------------------------------------------------
 * Client-safe documentation structure definition.
 * This file can be imported by both client and server components.
 * 
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// Documentation Structure
// -----------------------------------------------------------------------------

/**
 * Documentation structure for navigation
 */
export interface DocItem {
  title: string;
  path: string;
  children?: DocItem[];
}

/**
 * getDocsStructure() — returns the complete documentation structure.
 *
 * This matches the actual /docs folder structure.
 */
export function getDocsStructure(): DocItem[] {
  return [
    {
      title: "Get Started",
      path: "get-started",
      children: [
        { title: "Overview", path: "get-started/overview" },
        { title: "Installation", path: "get-started/installation" },
        { title: "First Steps", path: "get-started/first-steps" },
        { title: "Project Structure", path: "get-started/project-structure" },
        { title: "Configuration", path: "get-started/configuration" },
      ],
    },
    {
      title: "Tutorials",
      path: "tutorials",
      children: [
        { title: "Overview", path: "tutorials/overview" },
        { title: "Ship in 5 Minutes", path: "tutorials/ship-in-5-minutes" },
        { title: "Static Page", path: "tutorials/static-page" },
        { title: "Authentication", path: "tutorials/authentication" },
        { title: "API Routes", path: "tutorials/api-routes" },
        { title: "Protected Pages", path: "tutorials/protected-pages" },
        { title: "Stripe Subscriptions", path: "tutorials/stripe-subscriptions" },
        { title: "Custom Components", path: "tutorials/custom-components" },
        { title: "Database Queries", path: "tutorials/database-queries" },
        { title: "Real-time Listeners", path: "tutorials/realtime-listeners" },
      ],
    },
    {
      title: "Features",
      path: "features",
      children: [
        { title: "Overview", path: "features/overview" },
        { title: "Authentication", path: "features/authentication" },
        { title: "Billing", path: "features/billing" },
        { title: "Database", path: "features/database" },
        { title: "Email", path: "features/email" },
        { title: "Environment Variables", path: "features/environment-variables" },
        { title: "Firebase Setup", path: "features/firebase-setup" },
        { title: "Stripe Setup", path: "features/stripe-setup" },
        { title: "Webhooks", path: "features/webhooks" },
        { title: "Validation", path: "features/validation" },
        { title: "Real-time Sync", path: "features/realtime-sync" },
        { title: "API Routes", path: "features/api-routes" },
        { title: "Error Handling", path: "features/error-handling" },
        { title: "Security Features", path: "features/security-features" },
        { title: "SEO", path: "features/seo" },
      ],
    },
    {
      title: "Components",
      path: "components",
      children: [
        {
          title: "UI Components",
          path: "components/ui",
          children: [
            { title: "Overview", path: "components/ui/overview" },
            { title: "Button", path: "components/ui/button" },
            { title: "ButtonCheckout", path: "components/ui/button-checkout" },
            { title: "ButtonSignin", path: "components/ui/button-signin" },
            { title: "ButtonGradient", path: "components/ui/button-gradient" },
            { title: "Card", path: "components/ui/card" },
            { title: "Input", path: "components/ui/input" },
            { title: "Badge", path: "components/ui/badge" },
            { title: "Modal", path: "components/ui/modal" },
            { title: "Loader", path: "components/ui/loader" },
            { title: "Logo", path: "components/ui/logo" },
            { title: "BuiltWithShipSafe", path: "components/ui/built-with-shipsafe" },
            { title: "TestimonialsAvatars", path: "components/ui/testimonials-avatars" },
          ],
        },
        {
          title: "Template Components",
          path: "components/templates",
          children: [
            { title: "Overview", path: "components/templates/overview" },
            { title: "Header", path: "components/templates/header" },
            { title: "Hero", path: "components/templates/hero" },
            { title: "Problem", path: "components/templates/problem" },
            { title: "FeaturesGrid", path: "components/templates/features-grid" },
            { title: "FeaturesListicle", path: "components/templates/features-listicle" },
            { title: "Testimonial", path: "components/templates/testimonial" },
            { title: "Pricing", path: "components/templates/pricing" },
            { title: "FAQ", path: "components/templates/faq" },
            { title: "CTA", path: "components/templates/cta" },
            { title: "Footer", path: "components/templates/footer" },
          ],
        },
        {
          title: "Form Components",
          path: "components/forms",
          children: [
            { title: "Overview", path: "components/forms/overview" },
            { title: "LoginForm", path: "components/forms/login-form" },
            { title: "SignupForm", path: "components/forms/signup-form" },
          ],
        },
      ],
    },
    {
      title: "Security",
      path: "security",
      children: [
        { title: "Overview", path: "security/overview" },
        { title: "Middleware", path: "security/middleware" },
        { title: "API Security", path: "security/api-security" },
        { title: "Rate Limiting", path: "security/rate-limiting" },
        { title: "CSRF Protection", path: "security/csrf-protection" },
        { title: "Security Headers", path: "security/security-headers" },
        { title: "Authentication Security", path: "security/authentication-security" },
        { title: "Secure Tech Stack", path: "security/tech-stack" },
      ],
    },
    {
      title: "Deployment",
      path: "deployment",
      children: [
        { title: "Overview", path: "deployment/overview" },
        { title: "Getting Started", path: "deployment/getting-started" },
        { title: "Vercel Deployment", path: "deployment/vercel" },
        { title: "Environment Setup", path: "deployment/environment-setup" },
        { title: "Security", path: "deployment/security" },
        { title: "Monitoring", path: "deployment/monitoring" },
      ],
    },
    {
      title: "Extras",
      path: "extras",
      children: [
        { title: "Overview", path: "extras/overview" },
        { title: "Branding", path: "extras/branding" },
        { title: "Custom Themes", path: "extras/custom-themes" },
        { title: "Email Templates", path: "extras/email-templates" },
        { title: "Resources", path: "extras/resources" },
        { title: "Troubleshooting", path: "extras/troubleshooting" },
      ],
    },
  ];
}

/**
 * findDocByPath() — finds a documentation item by its path.
 *
 * @param path - Documentation path (e.g., "get-started/installation")
 * @returns DocItem or null if not found
 */
export function findDocByPath(path: string): DocItem | null {
  const structure = getDocsStructure();

  function search(items: DocItem[]): DocItem | null {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const found = search(item.children);
        if (found) return found;
      }
    }
    return null;
  }

  return search(structure);
}

