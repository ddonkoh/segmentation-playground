# TestimonialsAvatars

Social proof component displaying overlapping user avatars, star rating, and trust indicators.

**Location:** `src/components/ui/TestimonialsAvatars.tsx`

## Overview

The TestimonialsAvatars component displays social proof through overlapping user avatars, a star rating display, and customizable trust text. It's commonly used in hero sections to show user count, ratings, and build trust. The component shows avatars in an overlapping style, a visual star rating, and descriptive text about users.

## Quick Customization

This component is highly customizable:
- **User avatars** - Update the `avatars` array with your user images
- **User count** - Change the displayed user count number
- **Trust text** - Modify the trust indicator message
- **Rating** - Adjust the star rating value (currently 4.7/5)
- **Priority loading** - Toggle image priority for faster loading

## Usage

```tsx
import TestimonialsAvatars from "@/components/ui/TestimonialsAvatars";

<TestimonialsAvatars />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `priority` | `boolean` | `false` | Prioritize image loading (use `true` in Hero section) |

## Examples

### Basic Usage

```tsx
import TestimonialsAvatars from "@/components/ui/TestimonialsAvatars";

// Standard usage
<TestimonialsAvatars />

// In Hero section (prioritize loading)
<TestimonialsAvatars priority={true} />
```

### In Hero Section

```tsx
import TestimonialsAvatars from "@/components/ui/TestimonialsAvatars";

<section className="hero">
  <h1>Welcome to Our Product</h1>
  <TestimonialsAvatars priority={true} />
</section>
```

## Setup

### 1. Update User Avatars

Edit the `avatars` array in `TestimonialsAvatars.tsx`:

```tsx
const avatars = [
  {
    alt: "User 1",
    src: "/avatars/user1.jpg", // Use local images for better performance
  },
  {
    alt: "User 2",
    src: "/avatars/user2.jpg",
  },
  // Add more avatars (recommended: 4-6 avatars)
];
```

**Tips:**
- Use local images (`/avatars/...`) for better performance
- Recommended: 4-6 avatars for optimal display
- Use square images for best results
- Optimize images before adding to public folder

### 2. Customize User Count and Text

Update the configuration constants:

```tsx
// In TestimonialsAvatars.tsx
const userCount = 150; // Your actual user count
const trustText = "developers trust our platform"; // Your trust message
```

### 3. Update Star Rating

The rating is hardcoded as 4.7/5. To change:

```tsx
// Modify the partial star width calculation
// Currently: (4.7 - 4) * 100 = 70% width
// For 4.5/5: (4.5 - 4) * 100 = 50% width
// For 5.0/5: Remove partial star, show 5 full stars
```

## Component Structure

```tsx
interface TestimonialsAvatarsProps {
  priority?: boolean; // Image loading priority
}

const TestimonialsAvatars = ({ priority = false }) => {
  // Avatar images array
  const avatars = [/* ... */];
  
  // Configuration
  const userCount = 36;
  const trustText = "builders ship securely";
  const rating = 4.7; // Star rating
  
  return (
    <div>
      {/* Overlapping avatars */}
      {/* Star rating */}
      {/* Trust text with user count */}
    </div>
  );
};
```

## Layout

**Desktop:**
```
[Avatar 1][Avatar 2][Avatar 3][Avatar 4][Avatar 5]  [⭐⭐⭐⭐⭐ 4.7/5]
                                                    [36 builders ship securely]
```

**Mobile:**
```
[Avatar 1][Avatar 2][Avatar 3][Avatar 4][Avatar 5]

[⭐⭐⭐⭐⭐ 4.7/5]
[36 builders ship securely]
```

## Styling Notes

- **Avatars:** DaisyUI `avatar` and `avatar-group` classes
- **Overlap:** Uses negative margin (`-space-x-5`) for overlapping effect
- **Star rating:** Custom SVG stars with partial fill for 4.7 rating
- **Layout:** Responsive flex layout (horizontal on desktop, vertical on mobile)
- **Colors:** Uses theme colors (`text-base-content/60`, `text-base-content/80`)

## Best Practices

1. **Real avatars** - Use actual user avatars when possible
2. **Image optimization** - Optimize avatar images for web (compressed, proper size)
3. **User count** - Keep user count accurate and updated
4. **Rating accuracy** - Only show ratings if you have real reviews
5. **Hero placement** - Use `priority={true}` when used in Hero section

## Tips

- **Hero section:** Set `priority={true}` for faster image loading
- **Avatar count:** 4-6 avatars work best (not too many, not too few)
- **Rating:** Show realistic ratings (4.5-5.0 range is common)
- **Trust text:** Keep it short and impactful
- **Local images:** Use local images from `/public` folder for better performance

## Common Customizations

### Change User Count

```tsx
// In component
const userCount = 150; // Update this number
```

### Change Trust Text

```tsx
// In component
const trustText = "teams ship faster"; // Your custom message
```

### Change Rating

```tsx
// For 4.5/5 rating, update the partial star width
style={{ width: `${(4.5 - 4) * 100}%` }} // 50% width

// For 5.0/5, remove partial star and add 5th full star
```

### Add More Avatars

```tsx
const avatars = [
  // ... existing avatars
  {
    alt: "User 6",
    src: "/avatars/user6.jpg",
  },
  // Add more...
];
```

## Learn More

- [Hero Component](../templates/hero) - Commonly uses TestimonialsAvatars
- [Testimonial Component](../templates/testimonial) - Full testimonial section
- [UI Components Overview](../overview) - All available UI components
