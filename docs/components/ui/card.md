# Card

Container component for grouping related content with consistent styling and spacing.

**Location:** `src/components/ui/Card.tsx`

## Description

A flexible card component that provides a container for related content. Cards are commonly used to display information in organized sections, such as pricing plans, feature highlights, or content blocks. The component uses DaisyUI's card classes for consistent styling and supports full customization.

## Usage

```tsx
import Card from "@/components/ui/Card";

<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Card content (required) |
| `className` | `string` | `""` | Additional CSS classes |

## Examples

### Basic Card

```tsx
<Card>
  <h2 className="text-2xl font-bold mb-4">Card Title</h2>
  <p className="text-base-content/70">
    This is the card content. You can put any content inside.
  </p>
</Card>
```

### Card with Custom Background

```tsx
<Card className="bg-base-200">
  <h2>Card with Dark Background</h2>
  <p>Content with custom background color</p>
</Card>
```

### Card with Padding

```tsx
<Card className="p-8">
  <h2>Card with Extra Padding</h2>
  <p>More spacing inside the card</p>
</Card>
```

### Card with Border

```tsx
<Card className="border-2 border-primary">
  <h2>Card with Colored Border</h2>
  <p>Card with accent border</p>
</Card>
```

### Card Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card>
    <h3>Card 1</h3>
    <p>Content 1</p>
  </Card>
  <Card>
    <h3>Card 2</h3>
    <p>Content 2</p>
  </Card>
  <Card>
    <h3>Card 3</h3>
    <p>Content 3</p>
  </Card>
</div>
```

### Interactive Card (with hover)

```tsx
<Card className="hover:shadow-lg transition-shadow cursor-pointer">
  <h2>Hover Card</h2>
  <p>This card has a hover effect</p>
</Card>
```

## Common Use Cases

### Pricing Cards

Used in the Pricing component to display subscription plans:

```tsx
<Card className="relative">
  {isFeatured && (
    <div className="badge badge-primary">POPULAR</div>
  )}
  <h3>{plan.name}</h3>
  <p className="text-3xl font-bold">${plan.price}</p>
  <ul>
    {plan.features.map((feature) => (
      <li key={feature}>{feature}</li>
    ))}
  </ul>
</Card>
```

### Feature Cards

Display feature highlights:

```tsx
<Card>
  <div className="text-4xl mb-4">🔒</div>
  <h3 className="text-xl font-bold mb-2">Security</h3>
  <p>Enterprise-grade security features built in.</p>
</Card>
```

### Content Cards

Group related information:

```tsx
<Card>
  <h3>Article Title</h3>
  <p className="text-sm text-base-content/60">Published on Jan 1, 2024</p>
  <p>Article excerpt or content...</p>
</Card>
```

## Styling

The Card component uses DaisyUI's `card` class by default. You can customize with TailwindCSS classes:

### Common Customizations

```tsx
// Dark background
<Card className="bg-base-200">...</Card>

// Light background
<Card className="bg-base-100">...</Card>

// With shadow
<Card className="shadow-lg">...</Card>

// With border
<Card className="border border-base-content/10">...</Card>

// Rounded corners
<Card className="rounded-xl">...</Card>
```

## Best Practices

1. **Semantic structure** - Use proper heading hierarchy (h2, h3) inside cards
2. **Consistent spacing** - Use Tailwind spacing utilities for padding/margins
3. **Visual hierarchy** - Make important content stand out (larger text, bold)
4. **Accessibility** - Ensure card content is readable and properly structured
5. **Responsive design** - Test cards on mobile and desktop

## Tips

- Use cards to group related content visually
- Maintain consistent card sizes in grids
- Add hover effects for interactive cards
- Use cards in pricing tables for clear plan comparisons
- Keep card content concise and scannable

## Accessibility

Cards should:
- Have proper heading structure
- Maintain sufficient color contrast
- Be keyboard navigable if interactive
- Have clear focus states

## Learn More

- [Pricing Component](../templates/pricing) - Uses cards for pricing plans
- [SecurityFeatures Component](../templates/features-grid) - Uses cards for features
- [Template Components](../templates/overview) - More card usage examples

