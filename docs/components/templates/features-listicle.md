# FeaturesListicle

Interactive feature showcase component with tabbed navigation and detailed descriptions.

**Location:** `src/components/templates/FeaturesListicle.tsx`

## Quick Customization

This component is highly customizable:
- **Features array** - Add/remove feature categories with detailed lists
- **Code snippet** - Update the unique code snippet at the top
- **Auto-rotation** - Adjust interval (default 5 seconds) or disable
- **Icons** - Replace SVG icons for each feature
- **Time saved** - Update hours saved for each feature category
- **Section header** - Customize heading and description

## Overview

The FeaturesListicle component provides detailed information about each major feature category using an interactive tab system. It comes after FeaturesGrid and allows users to click on feature icons to see detailed lists of what's included. Features auto-rotate every 5 seconds until the user interacts, making it engaging while also providing a way for developers to understand the value without reading through all documentation upfront.

**Why it exists:**
- Shows detailed feature lists in an interactive way
- Demonstrates value proposition with time saved indicators
- Engages users with auto-rotation
- Helps developers understand what's included
- Saves time by presenting information efficiently

## Usage

```tsx
import FeaturesListicle from "@/components/templates/FeaturesListicle";

<FeaturesListicle />
```

## Features

- **Interactive tab navigation** - Click feature icons to switch between features
- **Auto-rotating display** - Features rotate every 5 seconds (stops when user interacts)
- **Detailed feature lists** - Shows comprehensive lists with checkmarks
- **Time saved indicators** - Displays hours saved for each feature category
- **Smooth transitions** - Animated transitions between feature changes
- **Intersection observer** - Stops auto-rotation when user scrolls past section
- **Client Component** - Uses React hooks for interactivity

## Layout

**Desktop:**
```
[Header Section]
- Code snippet badge
- Main heading
- Description

[Feature Icons Row]
[Icon 1] [Icon 2] [Icon 3] [Icon 4] [Icon 5]

[Feature Details Panel]
- Selected feature name
- Detailed feature list with checkmarks
- Time saved indicator
```

**Mobile:**
```
[Header Section]
- Code snippet badge
- Main heading
- Description

[Feature Icons Grid - 4 columns]
[Icon 1] [Icon 2] [Icon 3] [Icon 4]
[Icon 5]

[Feature Details Panel]
- Selected feature name
- Detailed feature list with checkmarks
- Time saved indicator
```

## Customization

### 1. Update Features Array

Modify the `features` array in `FeaturesListicle.tsx`:

```tsx
const features = [
  {
    name: "Authentication",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "Feature item 1",
            "Feature item 2",
            "Feature item 3",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <svg>{/* Checkmark icon */}</svg>
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-primary font-medium">
            <svg>{/* Checkmark icon */}</svg>
            Time saved: 4 hours {/* Change time saved */}
          </li>
        </ul>
      </>
    ),
    svg: (
      <svg>{/* Your icon SVG */}</svg>
    ),
  },
  // Add more features...
];
```

**Customization options:**
- **Add/remove features** - Currently 5 features (Authentication, Security, Payments, Database, UI Components)
- **Update feature names** - Change the category names
- **Modify feature lists** - Add/remove list items for each feature
- **Change time saved** - Update hours saved for each feature
- **Replace icons** - Update SVG icons for each feature

### 2. Modify Code Snippet

Update the unique code snippet at the top:

```tsx
<p className="text-primary font-medium text-sm font-mono mb-3">
  const security_layers = 7; {/* Change this to match your theme */}
</p>
```

**Examples:**
- `const security_layers = 7;` (security-themed)
- `const launch_time = "Today";` (launch-themed)
- `const productivity_boost = 10x;` (productivity-themed)

### 3. Update Main Heading

Change the section heading:

```tsx
<h2 className="font-extrabold text-3xl lg:text-5xl tracking-tight mb-8">
  Your compelling headline here {/* Customize */}
</h2>
```

### 4. Update Description

Modify the description text:

```tsx
<div className="text-base-content/80 leading-relaxed mb-8 lg:text-lg">
  Your description explaining the value proposition. {/* Customize */}
</div>
```

### 5. Change Auto-Rotate Interval

Modify how fast features rotate:

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    // ... rotation logic
  }, 5000); // Change 5000ms to your preferred interval (e.g., 3000ms for faster)
  
  return () => clearInterval(interval);
}, [featureSelected, hasClicked]);
```

**Tips:**
- `3000ms` - Faster rotation (3 seconds)
- `5000ms` - Default (5 seconds)
- `7000ms` - Slower rotation (7 seconds)
- Remove auto-rotation entirely if not desired

### 6. Customize Feature Icons

Replace SVG icons with your own:

```tsx
{
  svg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-8 h-8"
    >
      {/* Replace path with your icon */}
      <path strokeLinecap="round" strokeLinejoin="round" d="..." />
    </svg>
  ),
}
```

### 7. Update Colors and Styling

Change selected/hover states:

```tsx
<span
  className={`duration-100 ${
    featureSelected === feature.name
      ? "text-primary" // Selected color
      : "text-base-content/30 group-hover:text-base-content/50" // Unselected color
  }`}
>
  {feature.svg}
</span>
```

## Component Structure

```tsx
const FeaturesListicle = () => {
  const [featureSelected, setFeatureSelected] = useState(features[0].name);
  const [hasClicked, setHasClicked] = useState(false);

  // Auto-rotate logic
  useEffect(() => {
    // ... auto-rotation code
  }, [featureSelected, hasClicked]);

  return (
    <section className="py-24 bg-base-100" id="features">
      {/* Header section with code snippet */}
      <div>
        <p>const security_layers = 7;</p>
        <h2>Heading</h2>
        <p>Description</p>
      </div>
      
      {/* Feature icons navigation */}
      <div className="grid grid-cols-4 md:flex">
        {features.map((feature) => (
          <span onClick={() => setFeatureSelected(feature.name)}>
            {feature.svg}
            <span>{feature.name}</span>
          </span>
        ))}
      </div>
      
      {/* Feature details panel */}
      <div className="bg-base-200">
        <div>
          <h3>{featureSelected}</h3>
          {features.find(f => f.name === featureSelected)?.description}
        </div>
      </div>
    </section>
  );
};
```

## Examples

### Basic Usage

```tsx
// Simply import and use - no props needed
<FeaturesListicle />
```

### Custom Feature Set

Edit the `features` array directly in the component:

```tsx
// In FeaturesListicle.tsx
const features = [
  {
    name: "Your Feature",
    description: (
      <>
        <ul className="space-y-2">
          {["Item 1", "Item 2", "Item 3"].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <svg>{/* Checkmark */}</svg>
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-primary font-medium">
            <svg>{/* Checkmark */}</svg>
            Time saved: 5 hours
          </li>
        </ul>
      </>
    ),
    svg: <YourIcon />,
  },
  // Add more...
];
```

### Disable Auto-Rotation

Remove the auto-rotation logic if not desired:

```tsx
// Remove or comment out the useEffect hook
// useEffect(() => {
//   const interval = setInterval(() => {
//     // ...
//   }, 5000);
//   return () => clearInterval(interval);
// }, [featureSelected, hasClicked]);
```

## Styling Notes

- **Background:** `bg-base-100` (main section background)
- **Details panel:** `bg-base-200` (darker background for contrast)
- **Selected state:** `text-primary` (highlighted feature)
- **Unselected state:** `text-base-content/30` (dimmed features)
- **Hover state:** `group-hover:text-base-content/50` (brighter on hover)
- **Transitions:** Smooth duration transitions for state changes

## Best Practices

1. **Keep feature lists concise** - 4-6 items per feature category works well
2. **Use clear feature names** - Single-word categories are easier to scan (Authentication, Security, Payments)
3. **Be realistic with time saved** - Don't overpromise, but show real value
4. **Icon consistency** - Use similar style icons (all outlined, all filled, etc.)
5. **Test auto-rotation** - Ensure 5 seconds gives users enough time to read

## Tips

- **Ideal feature count** - 4-6 features work well (not too many to choose from)
- **Feature order matters** - Put most important features first
- **Time saved adds value** - Showing hours saved helps quantify the benefit
- **Checkmarks work** - The checkmark list format is easy to scan
- **Mobile layout** - 4-column grid on mobile ensures icons are large enough to tap

## Behavior Notes

### Auto-Rotation
- Features rotate every 5 seconds automatically
- Auto-rotation stops when user clicks on a feature (`hasClicked = true`)
- Auto-rotation stops when user scrolls past the section (intersection observer)
- User can manually select features at any time

### Intersection Observer
- Watches for when the section is in view
- Stops auto-rotation when section is scrolled past
- Prevents annoying auto-rotation when user isn't viewing the section

## Learn More

- [FeaturesGrid Component](./features-grid) - The grid overview that comes before FeaturesListicle
- [Testimonial Component](./testimonial) - The section that often comes after FeaturesListicle
- [Template Components Overview](../overview) - All available template components
