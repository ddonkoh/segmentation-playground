# First Steps

Get started with ShipSafe after installation. Learn the basics and make your first changes.

## Overview

After installing ShipSafe, this guide walks you through:
- Understanding the project structure
- Exploring the landing page
- Making your first customizations
- Configuring your app settings

## Step 1: Verify Installation

First, make sure everything is working:

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
# You should see the ShipSafe landing page
```

If you see the landing page with Header, Hero, Pricing, FAQ, and Footer sections, installation was successful! ✅

## Step 2: Explore the Landing Page

Visit `http://localhost:3000` to see your landing page. It's built with these template components:

### Landing Page Structure

```tsx
// src/app/page.tsx
import Header from "@/components/templates/Header";
import Hero from "@/components/templates/Hero";
import Problem from "@/components/templates/Problem";
import FeaturesGrid from "@/components/templates/FeaturesGrid";
import FeaturesListicle from "@/components/templates/FeaturesListicle";
import Testimonial from "@/components/templates/Testimonial";
import Pricing from "@/components/templates/Pricing";
import FAQ from "@/components/templates/FAQ";
import CTA from "@/components/templates/CTA";
import Footer from "@/components/templates/Footer";

export default function HomePage() {
  return (
    <>
      <Header />           {/* Navigation bar */}
      <Hero />             {/* Hero section with CTA */}
      <Problem />          {/* Problem statement */}
      <FeaturesGrid />     {/* Security features grid */}
      <FeaturesListicle /> {/* Feature showcase */}
      <Testimonial />      {/* Customer testimonials */}
      <Pricing />          {/* Pricing plans */}
      <FAQ />              {/* Frequently asked questions */}
      <CTA />              {/* Final call-to-action */}
      <Footer />           {/* Site footer */}
    </>
  );
}
```

**Location:** `src/app/page.tsx`

### What Each Section Does

- **Header** - Navigation with logo, links, and sign-in button
- **Hero** - Main headline, description, and primary CTA
- **Problem** - Highlights pain points your product solves
- **FeaturesGrid** - Grid of features with icons and descriptions
- **FeaturesListicle** - Interactive feature showcase
- **Testimonial** - Social proof with customer reviews
- **Pricing** - Subscription plans with Stripe integration
- **FAQ** - Answers to common questions
- **CTA** - Final conversion section
- **Footer** - Links, legal info, and branding

## Step 3: Make Your First Change

Let's customize the Hero component to make it yours:

### Update Hero Text

1. **Open the Hero component:**

```bash
src/components/templates/Hero.tsx
```

2. **Find the headline and description:**

```tsx
// Current text
<h1 className="text-5xl font-bold">
  Build Secure SaaS Products Fast
</h1>
<p className="text-xl text-base-content/70">
  A security-first boilerplate with Firebase Auth, Stripe billing, and clean UI components.
</p>
```

3. **Update with your own text:**

```tsx
<h1 className="text-5xl font-bold">
  Your Amazing Product Name
</h1>
<p className="text-xl text-base-content/70">
  Your compelling value proposition that solves customer problems.
</p>
```

4. **Save and see changes live:**

The page should automatically reload with your changes! This is Next.js hot module replacement.

### Update Hero Button

The Hero includes a checkout button. Update it:

```tsx
// In Hero.tsx, find ButtonCheckout
<ButtonCheckout priceId={featuredPlan.priceId} />
```

This button automatically uses the featured plan from `config.ts`.

## Step 4: Customize App Configuration

ShipSafe uses a central configuration file for easy customization:

### Update Basic Settings

1. **Open `config.ts` in the root directory**

2. **Update app name and description:**

```typescript
const config = {
  appName: "Your App Name",
  appDescription: "Your app description",
  domainName: "yourapp.com",
  supportEmail: "support@yourapp.com",
  // ...
};
```

3. **Customize Stripe plans:**

```typescript
stripe: {
  plans: [
    {
      priceId: process.env.STRIPE_PRICE_STARTER || "",
      name: "Starter",
      description: "Perfect for getting started",
      price: 29, // $29/month
      features: [
        { name: "Feature 1" },
        { name: "Feature 2" },
        // Add your features
      ],
    },
    // Add more plans...
  ],
},
```

See [Configuration Guide](./configuration) for all available options.

## Step 5: Explore the Dashboard

ShipSafe includes a protected dashboard:

1. **Sign up for an account:**

Visit `/auth` and create an account.

2. **Access the dashboard:**

After signup, you'll be redirected to `/dashboard`.

3. **Explore dashboard pages:**

- `/dashboard` - Main dashboard page
- `/dashboard/billing` - Subscription management
- `/dashboard/account` - Account settings

### Dashboard Features

- User authentication via Firebase
- Protected routes (requires login)
- Subscription status display
- Billing portal integration

## Step 6: Understand the Project Structure

ShipSafe follows a clean, domain-driven architecture:

**`src/`**
- **`app/`** - Next.js App Router (pages & routes)
  - `api/` - API endpoints
  - `auth/` - Authentication pages
  - `dashboard/` - Protected dashboard pages
- **`components/`** - React components
  - `ui/` - Reusable UI components
  - `templates/` - Page-level components
  - `forms/` - Form components
- **`features/`** - Business logic modules
  - `auth/` - Authentication logic
  - `billing/` - Billing logic
- **`lib/`** - Utility libraries
  - `firebase/` - Firebase integration
  - `stripe/` - Stripe integration
  - `security/` - Security utilities
- **`models/`** - TypeScript models

See [Project Structure Guide](./project-structure) for detailed explanation.

## Step 7: Set Up Firebase

To enable authentication and database features:

1. **Create Firebase project** at [Firebase Console](https://console.firebase.google.com)

2. **Enable Authentication:**

- Go to Authentication > Sign-in method
- Enable Email/Password
- Enable Google (optional)

3. **Create Firestore Database:**

- Go to Firestore Database
- Create database in production mode
- Set security rules

4. **Add environment variables:**

Add to `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
```

See [Firebase Setup Guide](../features/firebase-setup) for complete instructions.

## Step 8: Set Up Stripe

To enable payments and subscriptions:

1. **Create Stripe account** at [Stripe Dashboard](https://dashboard.stripe.com)

2. **Create products and prices:**

- Go to Products
- Create your subscription plans
- Copy Price IDs

3. **Add environment variables:**

Add to `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. **Configure webhooks:**

- Set webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Select events: `checkout.session.completed`, `customer.subscription.*`, etc.

See [Stripe Setup Guide](../features/stripe-setup) for complete instructions.

## Next Steps

### Immediate Next Steps

1. ✅ **Customize landing page** - Update Hero, Pricing, FAQ content
2. ✅ **Configure app settings** - Update `config.ts` with your branding
3. ✅ **Set up Firebase** - Enable authentication and database
4. ✅ **Set up Stripe** - Configure payments (optional initially)

### Learning Resources

- **[Project Structure](./project-structure)** - Deep dive into codebase organization
- **[Configuration Guide](./configuration)** - All config options explained
- **[Ship in 5 Minutes](../tutorials/ship-in-5-minutes)** - Build your first feature quickly
- **[Component Documentation](../components/overview)** - All available components
- **[Feature Documentation](../features/overview)** - Feature guides

### Tutorials

- **[Authentication Tutorial](../tutorials/authentication)** - Understand auth flow
- **[API Routes Tutorial](../tutorials/api-routes)** - Create custom endpoints
- **[Protected Pages Tutorial](../tutorials/protected-pages)** - Secure your pages
- **[Database Queries Tutorial](../tutorials/database-queries)** - Work with Firestore

### Advanced Topics

- **[Real-time Listeners](../tutorials/realtime-listeners)** - Live data updates
- **[Stripe Subscriptions](../tutorials/stripe-subscriptions)** - Payment flows
- **[Custom Components](../tutorials/custom-components)** - Build your own components

## Tips for Success

1. **Start small** - Customize one component at a time
2. **Test frequently** - Check changes in browser immediately
3. **Read the docs** - Component and feature docs have examples
4. **Use TypeScript** - Leverage type safety for faster development
5. **Follow patterns** - ShipSafe has consistent patterns throughout

## Common First Customizations

### Change Logo

Replace `/public/logo.png` and `/public/logo_w.png` with your logos.

### Update Colors

Modify DaisyUI theme in `tailwind.config.ts` or use CSS variables.

### Add Custom Sections

Create new template components in `src/components/templates/` following existing patterns.

### Customize Authentication

Modify auth pages in `src/app/auth/page.tsx` and forms in `src/components/forms/`.

## Getting Help

- **Documentation** - Check the docs folder for detailed guides
- **Code Comments** - ShipSafe components are well-commented
- **Examples** - Look at existing components for patterns

## Conclusion

You've successfully:
- ✅ Verified installation
- ✅ Explored the landing page
- ✅ Made your first change
- ✅ Learned the project structure
- ✅ Understood next steps

**You're ready to start building!** 🚀

Continue to [Project Structure](./project-structure) for a deeper dive, or jump to [Ship in 5 Minutes Tutorial](../tutorials/ship-in-5-minutes) to build your first feature.
