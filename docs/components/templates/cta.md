# CTA

Final call-to-action section that drives conversions before users leave your landing page.

**Location:** `src/components/templates/CTA.tsx`

## Quick Customization

This component is highly customizable:
- **Heading** - Update the gradient heading text
- **Description** - Modify the supporting description
- **Button** - Automatically uses featured plan from `config.ts`
- **Background** - Change section background color
- **Styling** - Adjust colors, spacing, and gradient effects

## Description

The CTA (Call-to-Action) section is placed near the end of your landing page, typically after Pricing and FAQ sections. It provides a final opportunity to convert visitors into customers. The component features a compelling headline with gradient text, supporting description, and a prominent checkout button linking to your featured plan.

## Usage

```tsx
import CTA from "@/components/templates/CTA";

<CTA />
```

## Features

- **Gradient heading** - Eye-catching gradient text for visual impact
- **Clear messaging** - Compelling copy that reinforces value proposition
- **Featured plan checkout** - Button automatically links to featured plan from `config.ts`
- **Dark background** - Matches Footer and Pricing sections for visual consistency
- **Simple design** - Clean, focused layout that doesn't distract from the CTA

## Layout

The CTA section uses a centered layout:

```
[Centered Content]
  - Gradient Heading
  - Description Text
  - Checkout Button (centered)
```

## Customization

### Heading

Update the heading text in the component:

```tsx
<h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
  Build secure SaaS. Launch faster.
</h2>
```

**Heading Tips:**
- Use action-oriented language ("Build", "Launch", "Start")
- Keep it short and punchy (under 10 words)
- Focus on the benefit or outcome

### Description

Update the description paragraph:

```tsx
<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
  Don't waste time configuring security middleware or building authentication from scratch...
</p>
```

**Description Tips:**
- Address final objections or hesitations
- Reinforce the value proposition
- Create urgency if appropriate (but don't be pushy)

### Button

The button automatically uses the featured plan from `config.ts`:

```typescript
// config.ts
stripe: {
  plans: [
    {
      isFeatured: true,  // This plan's priceId is used
      priceId: process.env.STRIPE_PRICE_PRO,
      // ...
    }
  ]
}
```

The button:
- Shows "Get ShipSafe" text (uses `config.appName`)
- Includes logo icon from `/logo_w.png`
- Links to Stripe checkout for featured plan
- Uses gradient styling for visual prominence

### Background Color

The section uses `bg-base-200` to match other sections. To change:

```tsx
<section className="relative bg-base-200 py-16" id="cta">
  // Change bg-base-200 to your preferred color
</section>
```

## Code Example

```tsx
import CTA from "@/components/templates/CTA";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />  {/* Final conversion opportunity */}
      <Footer />
    </>
  );
}
```

## Tips

- **Place at the end** - Put CTA after Pricing and FAQ sections for maximum impact
- **Single, clear action** - One button, one clear action. Don't confuse users with multiple options
- **Match featured plan** - Button should link to the plan you want most users to choose
- **Keep it simple** - Simple design works better than complex layouts for CTAs
- **Test different copy** - A/B test headlines and descriptions to find what converts best

## Best Practices

1. **Clear value proposition** - Remind users why they should act now
2. **Single CTA** - One button is better than multiple options
3. **Visual hierarchy** - Button should be the most prominent element
4. **Consistent styling** - Match the design language of your site
5. **Mobile optimization** - Ensure button is easily tappable on mobile

## Examples

### Basic Usage

```tsx
// Automatically uses featured plan
<CTA />
```

### With Custom Styling

The component uses gradient text and button styling. If you want to customize further, modify the component directly or extend it with additional props.

## Positioning in Landing Page

Recommended order:
1. Header
2. Hero
3. Problem
4. Features
5. Testimonials
6. Pricing
7. FAQ
8. **CTA** ← You are here
9. Footer

## Learn More

- [ButtonCheckout Component](../ui/button-checkout) - Checkout button details
- [Pricing Component](./pricing) - Pricing section
- [Configuration Guide](../../get-started/configuration) - Configure featured plan

