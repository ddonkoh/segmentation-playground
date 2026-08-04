# Hero

A beautiful hero section with a title, supporting headline, CTA button, social proof, and image.

**Location:** `src/components/templates/Hero.tsx`

## Quick Customization

This component is highly customizable:
- **Headline** - Update the main heading text
- **Description** - Modify the supporting description
- **CTA button** - Automatically uses featured plan from `config.ts`
- **Image** - Replace `/hero-image.png` with your product image
- **Social proof** - Customize testimonials avatars
- **Styling** - Adjust colors, spacing, and layout

## Description

The hero section is the first thing users see when landing on your site. It's your main marketing section that communicates your value proposition, includes the primary call-to-action, and sets the tone for your product. Critical for first impressions and conversions.

## Usage

```tsx
import Hero from "@/components/templates/Hero";

<Hero />
```

## Features

- **Responsive layout** - Stacks on mobile, side-by-side on desktop
- **Clean design** - Simple, minimal aesthetic matching ShipFast
- **Social proof** - TestimonialsAvatars component shows trust signals
- **Product image** - Demo image on right side (desktop)
- **CTA button** - Checkout button with logo icon

## Layout

### Desktop Layout

```
[Left Column]                    [Right Column]
- Heading                        - Product Image
- Description
- CTA Button
- Testimonials Avatars
```

### Mobile Layout

```
[Stacked vertically]
- Heading
- Description
- CTA Button
- Testimonials Avatars
- Product Image
```

## Customization

### Headline

Update the headline text in the component:

```tsx
<h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
  Your Amazing Headline
</h1>
```

**Headline Tips:**
- Keep it under 10 words
- Answer: "Why should a random visitor stay on your site for more than 10 seconds?"
- Focus on the benefit, not the feature

### Description

Update the description paragraph:

```tsx
<p className="text-lg opacity-80 mb-12 md:mb-16">
  Your description should explain how you deliver what you promise in the title.
</p>
```

**Description Tips:**
- Explain the "how" after the headline's "what"
- Keep it concise (2-3 sentences)
- Focus on benefits to the user

### CTA Button

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
- Shows "Get ShipSafe" text
- Includes logo icon from `/logo_w.png`
- Links to Stripe checkout for featured plan

### Image

Replace the product demo image:

```tsx
<Image
  src="/your-image.png"  // Update this
  alt="Your product demo"
  // ...
/>
```

**Image Tips:**
- Use product screenshot or demo
- Should be easy to understand what your product does
- Optimize with Next.js Image component
- Recommended size: 1200x800px or similar

### Social Proof

The `TestimonialsAvatars` component shows:
- User avatars
- Star rating (4.7/5)
- Trust text ("36 builders ship securely")

Customize in the `TestimonialsAvatars` component.

## Code Example

```tsx
import Hero from "@/components/templates/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Other sections */}
      </main>
    </>
  );
}
```

## Tips

- **Headline clarity** - Your `<h1>` should answer: "Why should a random visitor stay on your site for more than 10 seconds?" Keep it under 10 words.
- **Write about the pain** - Focus on the problem you're solving or the pleasure you're providing, not just features.
- **Supporting headline** - The description should explain *how* you deliver what you promise in the title.
- **CTA verb** - Your CTA button should start with a verb (Get, Discover, Learn, Start, etc.).
- **Social proof** - Offer your product to a few people for free in exchange for genuine testimonials. Social proof = trust = more conversions.
- **Image as thumbnail** - The image should be like a YouTube thumbnail. Users should understand what your product does just by looking at it.
- **Follow with Problem** - The `<Problem />` section should follow this Hero section to continue the narrative flow.

## Best Practices

1. **Test different headlines** - A/B test your headline copy to see what converts best
2. **Keep it above the fold** - Most important content visible without scrolling
3. **Clear value proposition** - Users should immediately understand what you offer
4. **Strong CTA** - Make the button prominent and action-oriented
5. **Social proof placement** - Right below the CTA reinforces trust

## Examples

```tsx
// Basic usage (already includes everything)
<Hero />

// Component automatically includes:
// - Headline from component
// - Description from component
// - CTA button (links to featured plan)
// - TestimonialsAvatars
// - Product image
```

## Learn More

- [ButtonCheckout Component](../ui/button-checkout) - CTA button used
- [TestimonialsAvatars Component](../ui/testimonials-avatars) - Social proof
- [Problem Component](./problem) - Follow-up section
- [Ship in 5 Minutes Tutorial](../../tutorials/ship-in-5-minutes)

