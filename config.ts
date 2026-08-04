/**
 * -----------------------------------------------------------------------------
 * ShipSafe — Global Application Configuration
 * -----------------------------------------------------------------------------
 * This file centralizes **all product-wide configuration**, making the codebase
 * predictable and easy to maintain. Nothing should be hardcoded in components.
 * 
 * Categories included:
 *  - Branding
 *  - Domain + metadata
 *  - Billing (Stripe)
 *  - UI theme (DaisyUI)
 *  - Support + contact
 *  - Email (Resend)
 *  - Authentication routing
 *
 * NOTE:
 *  - Sensitive values are NEVER stored here.
 *  - All dynamic secrets must be injected via environment variables (.env).
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// Constants (used in config object)
// -----------------------------------------------------------------------------
// CRITICAL: Use anonymous IIFE with function-scoped constants to avoid
// any top-level bindings that could conflict when next/font processes
// the module multiple times through different resolution paths.
// This prevents "Identifier 'config' has already been declared" errors
// when used as a submodule in extended boilerplates (e.g., ShipSafe-AI-SaaS).
export default (function() {
  const DOMAIN_NAME = "shipsafe.st";
  const SUPPORT_EMAIL = "support@shipsafe.st";
  
  return {
  // ---------------------------------------------------------------------------
  // BASIC APP INFORMATION
  // ---------------------------------------------------------------------------
  appName: "ShipSafe",
  appDescription:
    "A security-first Next.js boilerplate with Firebase Auth, Stripe billing, and clean SaaS UI components.",
  
  /**
   * The naked production domain.
   * REQUIRED FORMAT:
   *  ❌ no https://
   *  ❌ no trailing slash
   *  ✔️ example: "shipsafe.st"
   */
  domainName: DOMAIN_NAME,

  // ---------------------------------------------------------------------------
  // SUPPORT / CONTACT
  // ---------------------------------------------------------------------------
  /**
   * Public-facing support email.
   * Used in:
   *  - Footer components
   *  - Billing receipts (optional)
   *  - Legal pages (Privacy, TOS)
   */
  supportEmail: SUPPORT_EMAIL,

  // ---------------------------------------------------------------------------
  // EMAIL (Resend)
  // Resend is used natively for all transactional emails.
  // ---------------------------------------------------------------------------
  /**
   * Resend email configuration.
   * 
   * API key is loaded from environment variable RESEND_API_KEY.
   * From email defaults to no-reply@domainName but can be customized.
   * 
   * Used in:
   *  - Welcome emails
   *  - Password reset emails
   *  - Invitation emails
   *  - Transactional notifications
   * 
   * Setup:
   *  1. Install Resend: npm install resend
   *  2. Get API key from https://resend.com
   *  3. Add RESEND_API_KEY to .env.local
   */
  email: {
    /**
     * Default "from" email address for transactional emails.
     * Format: "Display Name <email@domain.com>"
     * 
     * Defaults to: "ShipSafe <no-reply@domainName>"
     * Can be customized per email via sendEmail() options.
     */
    get fromEmail() {
      return `ShipSafe <no-reply@${DOMAIN_NAME}>`;
    },

    /**
     * Default "from" email address for admin emails.
     * Format: "Display Name <email@domain.com>"
     * 
     * Defaults to: "ShipSafe <admin@domainName>"
     * Can be customized per email via sendEmail() options.
     */
    get fromAdmin() {
      return `ShipSafe <admin@${DOMAIN_NAME}>`;
    },
    /**
     * Reply-to email address (optional).
     * If not set, replies will go to fromEmail.
     * 
     * Defaults to supportEmail.
     */
    get replyTo() {
      return SUPPORT_EMAIL;
    },
  },

  // ---------------------------------------------------------------------------
  // BILLING (Stripe)
  // Plans are defined here → price IDs come from env variables.
  // This makes the boilerplate safe to redistribute.
  // ---------------------------------------------------------------------------
  stripe: {
    plans: [
      {
        /**
         * Stripe priceId comes from .env (one for dev + one for prod).
         * Required by:
         *  - Checkout sessions
         *  - Billing portal
         *  - Webhook lookups
         */
        priceId:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_PRICE_STARTER || ""
            : process.env.STRIPE_PRICE_STARTER || "",

        name: "Starter",
        description: "Essential tools to launch your SaaS securely.",
        price: 99,
        priceAnchor: 199, // optional crossed-out original price

        features: [
          { name: "Firebase Authentication" },
          { name: "Firestore Integration" },
          { name: "Stripe Checkout + Billing Portal" },
          { name: "DaisyUI + Tailwind UI Components" },
          { name: "Security-First Boilerplate" },
        ],
      },

      {
        /**
         * The highlighted plan. You may only have ONE plan with `isFeatured: true`.
         * Used by the Pricing component to style the plan card differently.
         */
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_PRICE_PRO || ""
            : process.env.STRIPE_PRICE_PRO || "",

        name: "AI-SaaS Starter",
        description: "Everything you need to launch your AI-powered SaaS.",
        price: 149,
        priceAnchor: 299,

        features: [
          { name: "Everything in Starter" },
          { name: "AI-SaaS Starter Toolkit" },
          { name: "Preconfigured Codebase" },
          { name: "Customisable Ready-to-Deploy Application" },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // UI / THEME SETTINGS
  // DaisyUI theme injection for Tailwind
  // ---------------------------------------------------------------------------
  colors: {
    /**
     * DaisyUI theme name.
     * Change requires matching theme added inside tailwind.config.ts.
     */
    theme: "dark",

    /**
     * Main accent color.
     * Used for:
     *  - Progress/loading bars
     *  - Browser tab theme color
     *  - Default button color (when applicable)
     * 
     * Uses the primary color from the DaisyUI theme dynamically via CSS variable.
     * You can also use a custom HEX color like: main: "#f37055"
     */
    main: "hsl(var(--p))", // Uses the primary color from the DaisyUI theme dynamically
  },

  // ---------------------------------------------------------------------------
  // AUTHENTICATION ROUTES
  // These paths are used consistently throughout the boilerplate.
  // ---------------------------------------------------------------------------
  auth: {
    /**
     * Where unauthenticated users are redirected.
     * (For protected routes, middleware, etc.)
     */
    loginUrl: "/auth",

    /**
     * Where users land after successful login.
     * Usually your dashboard or onboarding flow.
     */
    callbackUrl: "/dashboard",

    /**
     * Logout redirect path.
     */
    logoutRedirect: "/",
  },
  };
})();