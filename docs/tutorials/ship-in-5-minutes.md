# Ship in 5 Minutes

Build a beautiful landing page and launch your app in 5 minutes with ShipSafe.

## Overview

This quick tutorial will help you customize ShipSafe and get your app ready to ship. You'll learn how to:

1. Customize the landing page components
2. Update copy and branding
3. Configure basic settings
4. Test locally
5. Deploy to production

**Time required:** 5-10 minutes

## Step 1: Customize Landing Page Components

ShipSafe comes with pre-built landing page components. Let's customize them.

### Update Hero Section

Open `src/components/templates/Hero.tsx` and update:

```tsx
// Find the heading and update:
<h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
  Your Amazing Product Name
</h1>

// Update the description:
<p className="text-lg opacity-80 mb-12 md:mb-16">
  Your value proposition in 1-2 sentences. Explain what you do and why it matters.
</p>
```

**Tips:**
- Keep headline under 10 words
- Focus on benefits, not features
- Make it clear what problem you solve

### Update Problem Section

Open `src/components/templates/Problem.tsx` and customize the problem steps:

```tsx
const steps = [
  { emoji: "😰", text: "Problem your users face" },
  { emoji: "😰", text: "Another pain point" },
  { emoji: "😰", text: "Final frustration" },
];
```

### Update Features Section

Open `src/components/templates/FeaturesListicle.tsx` and update the features array:

```tsx
const features = [
  {
    title: "Feature Name",
    description: "What this feature does and why it matters",
    code: "const example = 'code snippet';"
  },
  // Add more features...
];
```

### Update Pricing Section

Open `config.ts` and update the pricing plans:

```typescript
stripe: {
  plans: [
    {
      name: "Starter",
      price: 99,
      priceId: process.env.STRIPE_PRICE_STARTER,
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
      ],
    },
    // Add your plans...
  ],
}
```

**Note:** You'll need to create Stripe products first. See [Stripe Setup](../features/stripe-setup).

### Update FAQ Section

Open `src/components/templates/FAQ.tsx` and update the FAQ items:

```tsx
const faqList: FAQItem[] = [
  {
    question: "Common question 1?",
    answer: "Clear, helpful answer",
  },
  {
    question: "Common question 2?",
    answer: "Another helpful answer",
  },
];
```

## Step 2: Update Configuration

Edit `config.ts` in the root directory:

```typescript
const config = {
  appName: "Your App Name",
  appDescription: "A compelling description of your app that explains what it does and why it's valuable.",
  domainName: "yourdomain.com",
  // ... other config
};
```

**Important fields:**
- `appName` - Your app name (used in SEO, emails, etc.)
- `appDescription` - Used in SEO meta tags
- `domainName` - Your domain (for production)

## Step 3: Update Branding

### Logo

1. Add your logo to `public/logo.png` (dark logo)
2. Add your logo to `public/logo_w.png` (light/white logo)
3. The header will automatically use these

### Colors

Customize colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: "#your-primary-color",
      secondary: "#your-secondary-color",
    },
  },
}
```

Or use DaisyUI themes. See [Custom Themes](../extras/custom-themes).

## Step 4: Configure Environment Variables

Set up your `.env.local` file:

```bash
# Copy example file
cp .env.example .env.local
```

**Minimum required for local development:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

See [Environment Variables](../features/environment-variables) for complete list.

## Step 5: Test Locally

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` and:

1. ✅ Check all sections load correctly
2. ✅ Test navigation links
3. ✅ Verify buttons work
4. ✅ Check mobile responsiveness
5. ✅ Test forms (if you have auth enabled)

**Common issues:**
- Components not showing? Check browser console for errors
- Styling looks wrong? Make sure TailwindCSS is compiling
- API errors? Verify environment variables are set

## Step 6: Deploy

Once everything works locally, deploy to production:

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

See [Vercel Deployment Guide](../deployment/vercel) for detailed steps.

### Deploy to Other Platforms

- **Netlify** - See [Netlify deployment docs](https://docs.netlify.com/)
- **Railway** - See [Railway deployment docs](https://docs.railway.app/)
- **Custom server** - See [Deployment Guide](../deployment/overview)

## Quick Checklist

Before deploying, make sure you've:

- [ ] Updated all landing page components
- [ ] Configured `config.ts` with your app name and domain
- [ ] Added your logo files
- [ ] Set up environment variables
- [ ] Tested locally
- [ ] Created Stripe products (if using payments)
- [ ] Set up Firebase project (if using auth/database)

## Next Steps

Now that your landing page is ready:

1. **[Static Page Tutorial](./static-page)** - Build custom pages
2. **[Authentication Tutorial](./authentication)** - Add user authentication
3. **[API Routes Tutorial](./api-routes)** - Create API endpoints
4. **[Stripe Subscriptions Tutorial](./stripe-subscriptions)** - Set up payments
5. **[Component Documentation](../components/overview)** - Explore all components

## Tips

- **Start simple** - Get a basic version live first, then iterate
- **Test on mobile** - Many users will access from mobile devices
- **Get feedback** - Show your landing page to friends/colleagues
- **Iterate quickly** - Don't spend weeks perfecting. Ship, get feedback, improve.

## Common Questions

**Q: Do I need to customize everything?**
A: No! ShipSafe works out of the box. Customize only what you need.

**Q: Can I remove sections I don't need?**
A: Yes! Just remove the component from your page.tsx file.

**Q: How do I add new sections?**
A: See [Custom Components Tutorial](./custom-components).

## Learn More

- [Static Page Tutorial](./static-page) - Build complete pages
- [Component Documentation](../components/overview) - All available components
- [Deployment Guide](../deployment/overview) - Deploy to production

