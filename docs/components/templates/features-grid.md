# FeaturesGrid

Features showcase component displaying a grid of feature cards with icons, badges, and descriptions.

**Location:** `src/components/templates/FeaturesGrid.tsx`

## Quick Customization

This component is highly customizable:
- **Features array** - Add/remove/edit feature cards
- **Icons** - Replace SVG icons with your own (SVG, emoji, or images)
- **Colors** - Customize icon and background colors per feature
- **Badges** - Update or remove status badges
- **Grid layout** - Change column count (1-4 columns)
- **Section header** - Update title, label, and description

## Overview

The FeaturesGrid component displays a responsive grid of feature cards, each with an icon, title, description, and optional badge. Perfect for showcasing product features, capabilities, or any categorized information in an easy-to-scan format.

**Why it exists:**
- Builds trust by demonstrating value
- Visual representation of features or capabilities
- Easy to scan and understand at a glance
- Responsive grid layout adapts to all screen sizes

## Usage

```tsx
import FeaturesGrid from "@/components/templates/FeaturesGrid";

<FeaturesGrid />
```

## Features

- **Grid layout** - Responsive: 1 column mobile, 2 tablet, 3 desktop
- **Color-coded icons** - Visual categorization with background colors
- **Status badges** - Shows feature status (Default, Built-in, Active, etc.)
- **Hover effects** - Card lift, border highlight, icon scale on hover
- **Clean card design** - Professional DaisyUI styling
- **Client Component** - Uses interactive hover effects

## Layout

**Desktop (3 columns):**
```
[Feature 1] [Feature 2] [Feature 3]
[Feature 4] [Feature 5] [Feature 6]
```

**Tablet (2 columns):**
```
[Feature 1] [Feature 2]
[Feature 3] [Feature 4]
[Feature 5] [Feature 6]
```

**Mobile (1 column):**
```
[Feature 1]
[Feature 2]
[Feature 3]
...
```

## Customization

### 1. Update Features Array

Modify the `features` array in `FeaturesGrid.tsx`:

```tsx
const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {/* SVG path here */}
      </svg>
    ),
    title: "Feature Title",
    description: "Feature description text",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    badge: "Default",
  },
  // Add more features...
];
```

**Customization options:**
- **Add/remove features** - Add as many feature cards as needed
- **Update titles** - Change feature names
- **Modify descriptions** - Update feature descriptions
- **Change icons** - Replace SVG paths with your own icons, emojis, or images
- **Update colors** - Change `color` and `bgColor` for visual variety
- **Modify badges** - Change badge text or remove badges entirely (set to `null` or empty string)

### 2. Change Grid Columns

Adjust the grid layout:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Change lg:grid-cols-3 to lg:grid-cols-4 for 4 columns */}
</div>
```

**Responsive breakpoints:**
- `grid-cols-1` - Mobile (always 1 column)
- `md:grid-cols-2` - Tablet (2 columns from medium screens)
- `lg:grid-cols-3` - Desktop (3 columns from large screens)

### 3. Customize Icons

Replace SVG icons with your own:

```tsx
{
  icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
    </svg>
  ),
  // Or use an emoji:
  // icon: <span className="text-2xl">🔒</span>,
  // Or use an image:
  // icon: <Image src="/icon.png" width={24} height={24} alt="Icon" />,
}
```

### 4. Update Colors

Each feature can have unique colors:

```tsx
{
  color: "text-blue-500",        // Icon color
  bgColor: "bg-blue-50 dark:bg-blue-950", // Background color
  // Options:
  // Primary: text-primary, bg-primary/10
  // Blue: text-blue-500, bg-blue-50
  // Green: text-green-500, bg-green-50
  // Yellow: text-yellow-500, bg-yellow-50
  // Purple: text-purple-500, bg-purple-50
  // Red: text-red-500, bg-red-50
}
```

### 5. Modify Hover Effects

Change the hover animation:

```tsx
<div
  className="group relative bg-base-200 p-6 rounded-lg border border-base-content/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
>
  {/* Change hover:-translate-y-1 to hover:-translate-y-2 for more lift */}
  {/* Change hover:shadow-lg to hover:shadow-xl for bigger shadow */}
</div>
```

### 6. Update Section Header

Modify the section title and description:

```tsx
<div className="text-center mb-16">
  <p className="font-medium text-primary mb-4">Category Label</p> {/* Optional category label */}
  <h2 className="font-bold text-3xl lg:text-5xl tracking-tight mb-4">
    Your Section Heading {/* Main heading */}
  </h2>
  <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
    Describe what these features offer... {/* Supporting description */}
  </p>
</div>
```

## Component Structure

```tsx
const FeaturesGrid = () => {
  // Features array - customize this
  const features = [/* ... */];

  return (
    <section className="bg-base-100 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          {/* Title and description */}
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group relative bg-base-200 p-6 rounded-lg border border-base-content/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              {/* Icon and badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${feature.bgColor} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <span className="badge badge-sm badge-primary badge-outline">
                  {feature.badge}
                </span>
              </div>
              
              {/* Title and description */}
              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-base-content/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

## Examples

### Basic Usage

```tsx
import FeaturesGrid from "@/components/templates/FeaturesGrid";

<FeaturesGrid />
```

### Custom Feature Set

Edit the `features` array directly in the component file:

```tsx
// In FeaturesGrid.tsx
const features = [
  {
    icon: <YourCustomIcon />,
    title: "Feature Title",
    description: "Feature description",
    color: "text-primary",
    bgColor: "bg-primary/10",
    badge: "New", // Optional: set to null or "" to hide badge
  },
  // Add more features as needed...
];
```

### Different Grid Layout

Adjust the grid columns for your needs:

```tsx
// 4 columns on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// 2 columns on desktop (simpler layout)
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
```

## Styling Notes

- **Background:** `bg-base-100` (main background color)
- **Card background:** `bg-base-200` (lighter gray for cards)
- **Borders:** Subtle borders with hover highlight
- **Hover effects:** Card lifts up (`hover:-translate-y-1`) and shadow increases
- **Icon scaling:** Icons scale up on hover (`group-hover:scale-110`)
- **Color coding:** Each feature has unique icon and background colors

## Best Practices

1. **Keep it scannable** - Use clear titles and concise descriptions
2. **Visual variety** - Use different colors for each feature to create visual interest
3. **Relevant badges** - Use badges that indicate feature status (Default, Built-in, etc.)
4. **Icon consistency** - Use similar icon style (all SVG, all emoji, etc.)
5. **Mobile-first** - Ensure features are readable on mobile (1 column layout)

## Tips

- **Ideal feature count** - 6-12 features work well in a grid (2-4 rows on desktop)
- **Color palette** - Use a consistent color palette across features (blue, green, yellow, purple, red, indigo)
- **Icon size** - Keep icons at `w-6 h-6` for consistency
- **Description length** - Keep descriptions concise (1-2 lines) for easy scanning
- **Badge usage** - Use badges to indicate status (New, Popular, Included, etc.) or remove them if not needed
- **Visual consistency** - Use similar icon styles (all outlined SVG, all filled, or all emoji)

## Learn More

- [Template Components Overview](../overview) - All available template components
- [Problem Component](./problem) - Problem/agitation section component
- [FeaturesListicle Component](./features-listicle) - Interactive feature showcase component
