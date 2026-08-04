/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — Problem.tsx
 * -----------------------------------------------------------------------------
 * 
 * Problem/agitation section that highlights pain points your product solves.
 * 
 * Reason:
 * The Problem section comes after the Hero and before Features. It creates
 * emotional resonance by showing what happens when the problem isn't solved.
 * This section should NEVER mention your product - it focuses on the negative
 * outcomes of not solving the problem. It "agitates" the pain to make your
 * solution more compelling.
 * 
 * Example Flow:
 * - Hero: "ShipSafe helps you build secure SaaS fast"
 * - Problem: "Most SaaS apps fail security audits..." (no mention of ShipSafe)
 * - Features: "ShipSafe has CSRF protection, rate limiting..." (your solution)
 * 
 * Features:
 * - Three-step flow diagram showing problem progression
 * - Clean SVG arrow indicators (simple chevron style)
 * - Emoji-based step icons (easy to customize)
 * - Responsive layout (stacks on mobile, horizontal on desktop)
 * 
 * Layout:
 * Desktop:
 *   [Step 1] → [Step 2] → [Step 3]
 * 
 * Mobile:
 *   [Step 1]
 *   ↓
 *   [Step 2]
 *   ↓
 *   [Step 3]
 * 
 * Usage:
 *   <Problem />
 * 
 * Customisation:
 * - Update heading to match your problem statement
 * - Update description to elaborate on the problem
 * - Modify `steps` array to change the flow (emoji, text)
 * - Change arrow style if desired (currently simple SVG chevron)
 * - Update background color (bg-base-200)
 * 
 * This is a Server Component (no "use client") because it doesn't need
 * client-side interactivity. All content is static.
 * 
 * Styling Notes:
 * - Uses DaisyUI classes
 * - Simple, clean design (matches ShipFast aesthetic)
 * - Background: bg-base-200 (light gray section)
 * - Easy to customize for your brand
 * 
 * -----------------------------------------------------------------------------
 */

/**
 * Simple SVG arrow component for connecting steps in the problem flow.
 * 
 * A clean, minimal chevron arrow that connects the problem flow steps.
 * Rotates 90 degrees on mobile to point downward.
 * 
 * Customisation:
 * - Change size (w-8 h-8, w-10 h-10, etc.)
 * - Modify color (stroke-base-content/60)
 * - Adjust stroke width (strokeWidth={2})
 * - Change rotation behavior
 */
const Arrow = () => {
  return (
    <svg
      className="shrink-0 w-8 h-8 text-base-content/60 max-md:rotate-90 md:mx-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5l7 7-7 7"
        />
    </svg>
  );
};

/**
 * Step component for each stage in the problem flow.
 * 
 * Displays an emoji icon and descriptive text for each step.
 * 
 * Customisation:
 * - Update emoji to match your problem stages
 * - Change text to describe your specific problem flow
 * - Modify styling (text-4xl for emoji, font-bold for text)
 */
const Step = ({ emoji, text }: { emoji: string; text: string }) => {
  return (
    <div className="w-full md:w-48 flex flex-col gap-2 items-center justify-center">
      <span className="text-4xl">{emoji}</span>
      <h3 className="font-bold text-center">{text}</h3>
    </div>
  );
};

/**
 * Problem/agitation section component.
 * 
 * Shows a three-step flow diagram illustrating the negative consequences
 * of not solving the problem. This creates emotional resonance and makes
 * your solution more compelling.
 * 
 * @returns {JSX.Element} Problem section component
 */
const Problem = () => {
  /**
   * Problem flow steps.
   * 
   * Customisation:
   * - Update emojis to match your problem stages
   * - Change text to describe your specific problem progression
   * - Add/remove steps (currently 3 steps)
   * - Reorder steps to change the flow
   */
  const steps = [
    {
      emoji: "🔒",
      text: "Hours configuring security",
    },
    {
      emoji: "😰",
      text: "Miss critical vulnerabilities",
    },
    {
      emoji: "💥",
      text: "Data breach or hack",
    },
  ];

  return (
    <section className="bg-base-200">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 text-center">
        {/* Main heading */}
        {/* 
          The problem statement. Should be bold and attention-grabbing.
          This should describe the negative outcome, not your solution.
          
          Customisation:
          - Update text to match your problem
          - Adjust text size (text-4xl md:text-5xl)
          - Change max-width (max-w-3xl)
        */}
        <h2 className="max-w-3xl mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8">
          Most SaaS apps fail security audits before they even launch
        </h2>

        {/* Description */}
        {/* 
          Elaborates on the problem. Should explain why it's a problem
          and what the consequences are.
          
          Customisation:
          - Update text to explain your problem in more detail
          - Adjust opacity (opacity-80) for different emphasis
          - Change max-width if needed
        */}
        <p className="max-w-xl mx-auto text-lg opacity-80 leading-relaxed mb-12 md:mb-20">
          CSRF tokens, rate limiting, security headers... There&apos;s so much to configure. One misstep and you&apos;re vulnerable.
        </p>

        {/* Problem flow diagram */}
        {/* 
          Three-step flow showing the progression of the problem.
          Uses simple arrows and emoji icons for easy customization.
          
          Customisation:
          - Update `steps` array to change the flow
          - Modify arrow component if desired
          - Change gap spacing (gap-6)
          - Adjust step width (md:w-48)
        */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-6">
              <Step emoji={step.emoji} text={step.text} />
              {/* Show arrow between steps, but not after the last one */}
              {index < steps.length - 1 && <Arrow />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;

