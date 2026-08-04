# Testimonial

A carousel component displaying customer testimonials with smooth animations and navigation controls.

**Location:** `src/components/templates/Testimonial.tsx`

## Quick Customization

This component is highly customizable:
- **Testimonials array** - Add/remove/edit customer testimonials
- **Auto-rotation** - Adjust interval (default 5 seconds) or disable
- **Visible count** - Shows 3 on desktop, 1 on mobile (configurable)
- **Card styling** - Customize colors, spacing, and hover effects
- **Navigation** - Modify arrow buttons and dot indicators
- **Section title** - Update the heading text

## Description

The Testimonial component displays customer reviews in a rotating carousel format. It shows multiple testimonials simultaneously (3 on desktop, 1 on mobile) with automatic rotation, navigation arrows, and dot indicators. Testimonials provide social proof and build trust, typically placed after Features and before Pricing sections.

## Usage

```tsx
import Testimonial from "@/components/templates/Testimonial";

<Testimonial />
```

## Features

- **Carousel display** - Shows 5 testimonials in rotation
- **Responsive layout** - 3 testimonials on desktop, 1 on mobile
- **Auto-rotation** - Automatically cycles through testimonials (pauses on hover)
- **Navigation controls** - Arrow buttons for manual navigation
- **Dot indicators** - Shows current position in carousel
- **Consistent heights** - Cards maintain equal height regardless of content length

## Setup

### Add Testimonials

Update the `testimonials` array in the component:

```typescript
const testimonials = [
  {
    id: 1,
    name: "John Doe",
    title: "Founder at Startup",
    avatar: "/avatars/john.jpg",
    quote: "ShipSafe saved us weeks of development time. The security features are exactly what we needed.",
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "CTO at TechCo",
    avatar: "/avatars/jane.jpg",
    quote: "Best boilerplate we've used. Everything just works out of the box.",
  },
  // Add more testimonials...
];
```

### Testimonial Structure

Each testimonial object should have:

- `id` - Unique identifier (number)
- `name` - Customer full name (string)
- `title` - Customer title/company (string)
- `avatar` - Path to avatar image (string)
- `quote` - Testimonial text (string)

## Customization

### Testimonials Array

Update testimonials in the component:

```typescript
const testimonials = [
  {
    id: 1,
    name: "Customer Name",
    title: "Their Title",
    avatar: "/path/to/avatar.png",
    quote: "Their testimonial text goes here. Keep it genuine and specific.",
  },
];
```

**Tips for testimonials:**
- Use real customer names and titles (with permission)
- Include specific benefits or outcomes
- Keep quotes concise (2-3 sentences)
- Add avatars for visual trust signals

### Section Title

Update the section heading:

```tsx
<h2 className="font-bold text-3xl lg:text-5xl tracking-tight mb-16">
  What makers say
</h2>
```

### Auto-Rotation Speed

Change the rotation interval:

```typescript
// In the component, find the useEffect with setInterval
useEffect(() => {
  const interval = setInterval(() => {
    // Change 5000 to your preferred interval (in milliseconds)
  }, 5000);  // 5000ms = 5 seconds
}, []);
```

### Number of Visible Testimonials

Adjust how many testimonials show:

```typescript
// For desktop (currently 3)
const getVisibleTestimonials = () => {
  // Change 3 to your preferred number
  const visibleCount = window.innerWidth >= 768 ? 3 : 1;
  // ...
};
```

## Layout

### Desktop Layout

```
[Title: "What makers say"]

[← Arrow]  [Testimonial 1]  [Testimonial 2]  [Testimonial 3]  [→ Arrow]

           [Dot] [Dot] [Dot] [Dot] [Dot]
```

### Mobile Layout

```
[Title]

[← Arrow]  [Testimonial]  [→ Arrow]

           [Dot] [Dot] [Dot] [Dot] [Dot]
```

## Code Example

```tsx
import Testimonial from "@/components/templates/Testimonial";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonial />  {/* Social proof section */}
      <Pricing />
    </>
  );
}
```

## Tips

- **Get real testimonials** - Offer your product to a few people for free in exchange for genuine testimonials. Real testimonials convert better than fake ones.
- **Be specific** - Testimonials should mention specific benefits or outcomes, not just "it's great"
- **Include details** - Add customer name, title, company, and photo for credibility
- **Update regularly** - Add new testimonials as you get them
- **Use strategically** - Place testimonials after features but before pricing to reinforce value

## Best Practices

1. **Authentic content** - Use real customer quotes (with permission)
2. **Diverse testimonials** - Include testimonials from different customer types
3. **Specific benefits** - Mention specific outcomes or features
4. **Visual trust** - Include photos and titles for credibility
5. **Regular updates** - Add new testimonials periodically

## Testimonial Examples

### Good Testimonial

```typescript
{
  id: 1,
  name: "Sarah Chen",
  title: "Founder at DesignStudio",
  avatar: "/avatars/sarah.jpg",
  quote: "ShipSafe's authentication system saved us 3 weeks of development. We launched our MVP in half the time we expected. The security features are enterprise-grade.",
}
```

**Why it's good:**
- Specific benefit (saved 3 weeks)
- Quantifiable outcome (launched in half the time)
- Mentions specific feature (authentication)
- Professional details (name, title, avatar)

### Less Effective Testimonial

```typescript
{
  quote: "Great product! Highly recommend.",
}
```

**Why it's less effective:**
- Too generic
- No specific benefits
- Missing customer details

## Positioning in Landing Page

Recommended order:
1. Header
2. Hero
3. Problem
4. Features
5. **Testimonial** ← You are here (social proof)
6. Pricing
7. FAQ
8. CTA
9. Footer

## Learn More

- [Hero Component](./hero) - Landing page hero
- [Pricing Component](./pricing) - Pricing section
- [Static Page Tutorial](../../tutorials/static-page)

