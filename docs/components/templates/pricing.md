# Pricing

A pricing table displaying your Stripe subscription plans with clear feature comparisons and checkout buttons.

**Location:** `src/components/templates/Pricing.tsx`

## Quick Customization

This component is highly customizable:
- **Plans** - Configure all plans in `config.ts` (automatically displays all)
- **Featured plan** - Mark any plan as featured (gets badge + border highlight)
- **Price anchor** - Add original price to show savings
- **Features** - Update feature lists per plan
- **Section header** - Customize title and description
- **Styling** - Adjust colors, spacing, and card design

## Description

The Pricing section is the conversion point where visitors decide to purchase. This component displays all your Stripe subscription plans from `config.ts` with feature comparisons, highlighted featured plan, and integrated checkout buttons. Clear pricing reduces friction and helps users choose the right plan.

## Usage

```tsx
import Pricing from "@/components/templates/Pricing";

<Pricing />
```

## Features

- **Automatic plan display** - Loads all plans from `config.stripe.plans[]`
- **Featured plan highlighting** - Badge and border highlight for recommended plan
- **Price anchor** - Shows original price crossed out (if `priceAnchor` is set)
- **Feature lists** - Checkmarks for included features
- **Stripe checkout** - Integrated ButtonCheckout components
- **Responsive layout** - Side-by-side on desktop, stacked on mobile

## Setup

### 1. Configure Plans in config.ts

Add your Stripe plans to `config.ts`:

```typescript
// config.ts
stripe: {
  plans: [
    {
      name: "Starter",
      price: 99,
      priceAnchor: 199,  // Optional: original price to show crossed out
      priceId: process.env.STRIPE_PRICE_STARTER,
      isFeatured: false,
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
      ],
    },
    {
      name: "Pro",
      price: 199,
      priceId: process.env.STRIPE_PRICE_PRO,
      isFeatured: true,  // This plan will be highlighted
      features: [
        "Everything in Starter",
        "Advanced Feature 1",
        "Advanced Feature 2",
        "Priority Support",
      ],
    },
  ],
}
```

### 2. Get Stripe Price IDs

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Create products and prices
3. Copy the Price IDs (starts with `price_`)
4. Add them to your `.env.local`:

```bash
STRIPE_PRICE_STARTER=price_xxxxxxxxxxxxx
STRIPE_PRICE_PRO=price_yyyyyyyyyyyyy
```

## Customization

### Plans Configuration

Update plans in `config.ts`. Each plan should have:

- `name` - Plan name (e.g., "Starter", "Pro")
- `price` - Monthly price in dollars (for display)
- `priceId` - Stripe Price ID (required)
- `isFeatured` - Boolean to highlight this plan
- `features` - Array of feature strings
- `priceAnchor` - Optional original price to show crossed out

### Featured Plan

Mark a plan as featured with `isFeatured: true`:

```typescript
{
  name: "Pro",
  price: 199,
  priceId: process.env.STRIPE_PRICE_PRO,
  isFeatured: true,  // Gets badge and border highlight
  features: [...]
}
```

The featured plan will:
- Show a "POPULAR" badge at the top
- Have a primary-colored border
- Stand out visually from other plans

### Section Heading

Update the heading text in the component:

```tsx
<h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
  Your Pricing Headline
</h2>
```

### Features List

Each plan can have a features array:

```typescript
features: [
  "Feature 1",
  "Feature 2",
  "Feature 3 with description",
]
```

Features are displayed with checkmark icons (✓).

### Price Anchor

Show original price crossed out to highlight savings:

```typescript
{
  name: "Starter",
  price: 99,
  priceAnchor: 199,  // Shows "$199" crossed out, "$99" normal
  priceId: process.env.STRIPE_PRICE_STARTER,
}
```

## Layout

### Desktop Layout

```
[Plan 1 Card]    [Plan 2 Card (Featured)]
```

### Mobile Layout

```
[Plan 1 Card]
[Plan 2 Card (Featured)]
```

## Code Example

```tsx
import Pricing from "@/components/templates/Pricing";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Pricing />  {/* Pricing section */}
      <FAQ />
      <CTA />
    </>
  );
}
```

## Tips

- **Always have a featured plan** - Users are more likely to pick the highlighted option. Make it the plan you want most people to buy.
- **Limit to 2-3 plans** - Too many options creates decision paralysis. 2-3 plans is the sweet spot.
- **Feature comparison** - Make it easy to compare plans. Use similar feature names across plans for easy scanning.
- **Clear pricing** - Don't hide fees or surprise users. Be transparent about what's included.
- **Test different prices** - Experiment with pricing to find what converts best. Start higher, you can always lower it.
- **Social proof** - Consider adding testimonials near pricing to reinforce value.

## Best Practices

1. **Featured plan placement** - Put featured plan in the middle (if 3 plans) or right (if 2 plans)
2. **Price clarity** - Show monthly/yearly clearly. Include "per month" or "per year" text
3. **Feature highlights** - Use the featured plan to highlight your best value proposition
4. **CTA buttons** - All plans should have clear "Get Started" or "Choose Plan" buttons
5. **Mobile optimization** - Test pricing on mobile - many users will view here

## Examples

### Two Plans

```typescript
// config.ts
stripe: {
  plans: [
    {
      name: "Starter",
      price: 99,
      priceId: process.env.STRIPE_PRICE_STARTER,
      features: ["Feature 1", "Feature 2"],
    },
    {
      name: "Pro",
      price: 199,
      priceId: process.env.STRIPE_PRICE_PRO,
      isFeatured: true,
      features: ["Everything in Starter", "Advanced Feature"],
    },
  ],
}
```

### With Price Anchor

```typescript
{
  name: "Starter",
  price: 99,
  priceAnchor: 199,  // Shows savings
  priceId: process.env.STRIPE_PRICE_STARTER,
  features: [...]
}
```

## Learn More

- [ButtonCheckout Component](../ui/button-checkout) - Checkout button details
- [Stripe Setup](../../features/stripe-setup) - Configure Stripe
- [Billing Features](../../features/billing) - Billing documentation
- [Stripe Subscriptions Tutorial](../../tutorials/stripe-subscriptions)

