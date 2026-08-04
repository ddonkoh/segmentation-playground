# Problem

Problem/agitation section component that highlights pain points your product solves.

**Location:** `src/components/templates/Problem.tsx`

## Quick Customization

This component is highly customizable:
- **Problem statement** - Update the main heading text
- **Description** - Modify the problem elaboration
- **Steps** - Customize the `steps` array (emoji + text)
- **Arrow style** - Modify or replace the SVG arrow component
- **Background** - Change section background color
- **Styling** - Adjust spacing, colors, and layout

## Overview

The Problem section is a critical landing page component that creates emotional resonance by showing what happens when the problem isn't solved. It comes after the Hero section and before Features, serving to "agitate" the pain and make your solution more compelling.

**Why it exists:**
- Creates emotional connection by highlighting pain points
- Builds contrast between the problem and your solution
- Increases conversion by making the problem feel urgent
- Sets up the Features section to show how you solve it

## Usage

```tsx
import Problem from "@/components/templates/Problem";

<Problem />
```

## Features

- **Three-step flow diagram** - Visual progression showing problem escalation
- **Clean SVG arrow indicators** - Simple chevron arrows connecting steps
- **Emoji-based step icons** - Easy to customize and visually appealing
- **Responsive layout** - Horizontal on desktop, vertical stack on mobile
- **Server Component** - No client-side JavaScript needed (static content)

## Layout

**Desktop:**
```
[Step 1] → [Step 2] → [Step 3]
```

**Mobile:**
```
[Step 1]
  ↓
[Step 2]
  ↓
[Step 3]
```

## Customization

### 1. Update Problem Statement

Modify the heading text in `Problem.tsx`:

```tsx
<h2 className="max-w-3xl mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8">
  Your problem statement here {/* Customize this */}
</h2>
```

**Tips:**
- Keep it bold and attention-grabbing
- Focus on negative outcomes, not your solution
- Make it specific to your target audience

### 2. Update Description

Modify the description paragraph:

```tsx
<p className="max-w-xl mx-auto text-lg opacity-80 leading-relaxed mb-12 md:mb-20">
  Elaborate on why this problem matters and what the consequences are. {/* Customize */}
</p>
```

### 3. Modify Problem Flow Steps

Update the `steps` array to match your problem progression:

```tsx
const steps = [
  {
    emoji: "🔒",
    text: "First stage of the problem",
  },
  {
    emoji: "😰",
    text: "Second stage - problem escalates",
  },
  {
    emoji: "💥",
    text: "Final stage - worst outcome",
  },
];
```

**Customization options:**
- Change emojis to match your problem stages
- Update text to describe your specific problem flow
- Add/remove steps (currently 3 steps)
- Reorder steps to change the progression

### 4. Customize Arrow Style

The `Arrow` component uses a simple SVG chevron. Modify it if desired:

```tsx
const Arrow = () => {
  return (
    <svg
      className="shrink-0 w-8 h-8 text-base-content/60 max-md:rotate-90 md:mx-2"
      // ... SVG props
    >
      {/* Change SVG path here */}
    </svg>
  );
};
```

**Options:**
- Change size (`w-8 h-8` → `w-10 h-10`)
- Modify color (`text-base-content/60`)
- Adjust stroke width (`strokeWidth={2}`)
- Change rotation behavior (`max-md:rotate-90`)

### 5. Update Background Color

Change the section background:

```tsx
<section className="bg-base-200"> {/* Change bg-base-200 to your preferred color */}
  {/* ... */}
</section>
```

**Common options:**
- `bg-base-100` - Light background
- `bg-base-200` - Darker gray (default)
- `bg-primary/10` - Subtle primary color tint

## Component Structure

```tsx
const Problem = () => {
  // Steps array - customize this
  const steps = [/* ... */];

  return (
    <section className="bg-base-200">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 text-center">
        {/* Main heading */}
        <h2>{/* Problem statement */}</h2>
        
        {/* Description */}
        <p>{/* Problem elaboration */}</p>
        
        {/* Problem flow diagram */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6">
          {steps.map((step, index) => (
            <div key={index}>
              <Step emoji={step.emoji} text={step.text} />
              {index < steps.length - 1 && <Arrow />}
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
// Simply import and use - no props needed
<Problem />
```

### Custom Problem Flow

The component is designed to be customized by editing the `steps` array directly in the component file:

```tsx
// In Problem.tsx
const steps = [
  {
    emoji: "⏰",
    text: "Waste hours configuring",
  },
  {
    emoji: "🐛",
    text: "Miss critical bugs",
  },
  {
    emoji: "💸",
    text: "Lose customers and revenue",
  },
];
```

## Styling Notes

- **Background:** `bg-base-200` (light gray section for contrast)
- **Typography:** Large, bold headings with relaxed description text
- **Responsive:** Automatically stacks vertically on mobile
- **Arrows:** Rotate 90 degrees on mobile to point downward
- **Spacing:** Generous padding (`py-16 md:py-32`) for visual breathing room

## Best Practices

1. **Never mention your product** - This section should focus purely on the problem
2. **Keep it emotional** - Use strong language that creates urgency
3. **Show progression** - The steps should show how the problem escalates
4. **Match your audience** - Use language and examples your target users relate to
5. **Be specific** - Generic problems are less compelling than specific ones

## Tips

- **Test different flows** - Try different step progressions to see what resonates
- **Use relevant emojis** - Emojis should match the problem stage (e.g., 🔒 for security, ⏰ for time)
- **Keep it concise** - Three steps is usually the sweet spot (not too many, not too few)
- **Mobile-first** - Remember arrows rotate on mobile, so vertical flow works better

## Learn More

- [Hero Component](./hero) - The section that comes before Problem
- [FeaturesGrid Component](./features-grid) - The section that comes after Problem
- [Template Components Overview](../overview) - All available template components
