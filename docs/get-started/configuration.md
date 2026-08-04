# Configuration

Complete guide to configuring ShipSafe's centralized configuration system.

## Overview

ShipSafe uses a single `config.ts` file at the project root to centralize all application-wide settings. This makes the codebase predictable, maintainable, and easy to customize. All components and features reference this single source of truth.

**Key benefits:**
- **Single source of truth** - All settings in one place
- **Type-safe** - Full TypeScript support
- **Easy customization** - Change once, updates everywhere
- **No hardcoded values** - Components read from config

## Configuration File Location

The main configuration file is located at:

**`config.ts`** (project root)

This is the single source of truth for all application configuration.

## Configuration Sections

### Basic App Information

```typescript
appName: "ShipSafe",
appDescription: "A security-first Next.js boilerplate...",
domainName: "shipsafe.st",
```

**Fields:**
- `appName` - Your application name (used in SEO, emails, UI)
- `appDescription` - App description (used in SEO meta tags)
- `domainName` - Production domain (no https://, no trailing slash)

**Customization:**
```typescript
appName: "My Awesome SaaS",
appDescription: "The best SaaS platform for...",
domainName: "myawesomesaaS.com",
```

### Support & Contact

```typescript
supportEmail: "support@shipsafe.st",
```

**Fields:**
- `supportEmail` - Public support email (shown in footer, contact pages, email replies)

**Customization:**
```typescript
supportEmail: "help@myawesomesaaS.com",
```

### Email Configuration (Resend)

ShipSafe uses **Resend** for all transactional emails. Email configuration is handled via environment variables:

```typescript
email: {
  get fromEmail() {
    return `ShipSafe <no-reply@${config.domainName}>`;
  },
  get replyTo() {
    return config.supportEmail;
  },
},
```

**Environment Variables Required:**
- `RESEND_API_KEY` - Your Resend API key (get from [resend.com](https://resend.com))
- `RESEND_FROM_EMAIL` - Optional: override default from email

**Customization:**
The email configuration automatically uses your `domainName` and `supportEmail` from config. To customize:

1. **Set environment variable:**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL="Your App <noreply@yourdomain.com>"  # Optional
```

2. **Email is automatically configured** - No code changes needed!

See [Email Documentation](../features/email) for complete email setup guide.

### Billing (Stripe Plans)

```typescript
stripe: {
  plans: [
    {
      priceId: process.env.STRIPE_PRICE_STARTER || "",
      name: "Starter",
      description: "Essential tools to launch your SaaS securely.",
      price: 99,
      priceAnchor: 199, // Optional: original price
      isFeatured: false,
      features: [
        { name: "Firebase Authentication" },
        { name: "Firestore Integration" },
        // ... more features
      ],
    },
    {
      isFeatured: true, // Only one featured plan
      priceId: process.env.STRIPE_PRICE_PRO || "",
      name: "Pro",
      price: 199,
      features: [...],
    },
  ],
}
```

**Plan Fields:**
- `priceId` - Stripe Price ID from environment variables
- `name` - Plan name (displayed in pricing table)
- `description` - Plan description
- `price` - Monthly price in dollars (for display)
- `priceAnchor` - Optional original price (shows crossed out)
- `isFeatured` - Boolean to highlight this plan (only one should be true)
- `features` - Array of feature objects with `name` property

**Customization:**
```typescript
stripe: {
  plans: [
    {
      priceId: process.env.STRIPE_PRICE_BASIC || "",
      name: "Basic",
      description: "Perfect for individuals",
      price: 29,
      features: [
        { name: "10 projects" },
        { name: "Basic support" },
      ],
    },
    {
      isFeatured: true,
      priceId: process.env.STRIPE_PRICE_PREMIUM || "",
      name: "Premium",
      price: 99,
      priceAnchor: 149, // Shows "was $149, now $99"
      features: [
        { name: "Unlimited projects" },
        { name: "Priority support" },
        { name: "Advanced features" },
      ],
    },
  ],
}
```

**Note:** Price IDs come from `.env.local` to keep Stripe credentials separate.

### UI Theme Settings

```typescript
colors: {
  theme: "dark",
  main: "hsl(var(--p))", // Uses DaisyUI primary color
},
```

**Fields:**
- `theme` - DaisyUI theme name (must match theme in `tailwind.config.ts`)
- `main` - Main accent color (used for progress bars, browser tab, etc.)

**Available Themes:**
- `dark` (default)
- `light`
- `cupcake`
- `bumblebee`
- `emerald`
- `corporate`
- `synthwave`
- `retro`
- `cyberpunk`
- `valentine`
- `halloween`
- `garden`
- `forest`
- `aqua`
- `lofi`
- `pastel`
- `fantasy`
- `wireframe`
- `black`
- `luxury`
- `dracula`
- `cmyk`
- `autumn`
- `business`
- `acid`
- `lemonade`
- `night`
- `coffee`
- `winter`

**Customization:**
```typescript
colors: {
  theme: "light", // Change theme
  main: "#3b82f6", // Custom HEX color
},
```

To add custom themes, see [Custom Themes Guide](../extras/custom-themes).

### Authentication Routes

```typescript
auth: {
  loginUrl: "/auth",
  callbackUrl: "/dashboard",
  logoutRedirect: "/",
},
```

**Fields:**
- `loginUrl` - Where unauthenticated users are redirected
- `callbackUrl` - Where users land after successful login
- `logoutRedirect` - Where users go after logout

**Customization:**
```typescript
auth: {
  loginUrl: "/login", // Custom login page
  callbackUrl: "/app", // Custom dashboard route
  logoutRedirect: "/goodbye", // Custom logout page
},
```

## Complete Configuration Example

Here's a complete example configuration:

```typescript
const config = {
  // Basic Info
  appName: "My Awesome SaaS",
  appDescription: "The best SaaS platform for managing your business.",
  domainName: "myawesomesaaS.com",

  // Support
  supportEmail: "help@myawesomesaaS.com",

  // Email (Resend)
  // Email configuration is automatic - uses domainName and supportEmail
  // Set RESEND_API_KEY in .env.local

  // Billing
  stripe: {
    plans: [
      {
        priceId: process.env.STRIPE_PRICE_BASIC || "",
        name: "Basic",
        price: 29,
        features: [
          { name: "10 projects" },
          { name: "Email support" },
        ],
      },
      {
        isFeatured: true,
        priceId: process.env.STRIPE_PRICE_PRO || "",
        name: "Pro",
        price: 99,
        features: [
          { name: "Unlimited projects" },
          { name: "Priority support" },
        ],
      },
    ],
  },

  // Theme
  colors: {
    theme: "light",
    main: "#3b82f6",
  },

  // Auth
  auth: {
    loginUrl: "/auth",
    callbackUrl: "/dashboard",
    logoutRedirect: "/",
  },
};

export default config;
```

## Using Configuration in Components

### Import and Use

```tsx
import config from "@/config";

export default function MyComponent() {
  return (
    <div>
      <h1>Welcome to {config.appName}</h1>
      <p>{config.appDescription}</p>
    </div>
  );
}
```

### Accessing Plans

```tsx
import config from "@/config";

export default function PricingPage() {
  const featuredPlan = config.stripe.plans.find((plan) => plan.isFeatured);
  
  return (
    <div>
      <h2>Our Featured Plan: {featuredPlan.name}</h2>
    </div>
  );
}
```

### Using in Server Components

Configuration works in both client and server components:

```tsx
// Server Component (default)
import config from "@/config";

export default async function Page() {
  return <h1>{config.appName}</h1>;
}
```

```tsx
// Client Component
"use client";

import config from "@/config";

export default function ClientPage() {
  return <h1>{config.appName}</h1>;
}
```

## Best Practices

### 1. Never Hardcode Values

**❌ Bad:**
```tsx
<h1>Welcome to ShipSafe</h1>
```

**✅ Good:**
```tsx
<h1>Welcome to {config.appName}</h1>
```

### 2. Use Environment Variables for Secrets

**❌ Bad:**
```typescript
stripe: {
  secretKey: "sk_live_123...", // Never do this!
}
```

**✅ Good:**
```typescript
stripe: {
  plans: [
    {
      priceId: process.env.STRIPE_PRICE_STARTER || "", // From .env
    },
  ],
}
```

### 3. Keep Config Single Source

- Don't duplicate config values in components
- Always import from `@/config`
- Update config once, changes everywhere

### 4. Type Safety

Config is fully typed. TypeScript will catch errors:

```typescript
// ❌ Type error: featuredPlan doesn't exist
const bad = config.stripe.plans.find((p) => p.isFeatured2);

// ✅ Correct
const good = config.stripe.plans.find((p) => p.isFeatured);
```

## Customization Workflow

### Step 1: Update Basic Info

```typescript
appName: "Your App Name",
appDescription: "Your app description",
domainName: "yourdomain.com",
```

### Step 2: Update Support Email

```typescript
supportEmail: "support@yourdomain.com",
```

### Step 3: Configure Plans

1. Create plans in Stripe Dashboard
2. Add Price IDs to `.env.local`
3. Update `config.ts` with plan details

### Step 4: Customize Theme

1. Choose DaisyUI theme or create custom
2. Update `colors.theme` in config
3. Update `tailwind.config.ts` if needed

### Step 5: Adjust Auth Routes

Update redirect URLs if you have custom routes.

## Environment Variables

Configuration can reference environment variables for sensitive values:

```typescript
stripe: {
  plans: [
    {
      priceId: process.env.STRIPE_PRICE_STARTER || "", // From .env.local
    },
  ],
},
```

**Email Environment Variables:**
- `RESEND_API_KEY` - Required for sending emails
- `RESEND_FROM_EMAIL` - Optional: override default from address

**Note:** For required values, validate in your code or use environment variable validation. See [Environment Variables Guide](../features/environment-variables) for complete setup.

## Troubleshooting

### Config Not Updating

**Issue:** Changes to config not reflecting

**Solutions:**
1. **Restart dev server** - Config is loaded at startup
2. **Check syntax** - Ensure valid TypeScript/JavaScript
3. **Verify import** - Use `@/config` alias, not relative path

### Type Errors

**Issue:** TypeScript errors when using config

**Solutions:**
1. **Check types** - Ensure config matches expected types
2. **Restart TypeScript server** - In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
3. **Verify config export** - Must use `export default config`

## Learn More

- [Environment Variables](../features/environment-variables) - Configure secrets
- [Stripe Setup](../features/stripe-setup) - Set up Stripe plans
- [Custom Themes](../extras/custom-themes) - Customize theme
- [Project Structure](./project-structure) - Understand codebase structure
