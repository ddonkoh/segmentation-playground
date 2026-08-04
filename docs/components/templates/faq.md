# FAQ

A two-column FAQ accordion component that addresses common questions and reduces friction before purchase.

**Location:** `src/components/templates/FAQ.tsx`

## Quick Customization

This component is highly customizable:
- **FAQ items** - Update the `faqList` array (questions and answers)
- **Answers** - Can use plain text or React nodes (rich content)
- **Support email** - Configure in `config.ts` for contact section
- **Layout** - Two-column on desktop, single column on mobile
- **Section title** - Customize the heading text
- **Styling** - Adjust colors, spacing, and accordion design

## Description

The FAQ section comes near the end of the landing page (before CTA) to address common questions and concerns. This reduces friction and answers objections before users reach the purchase decision. The two-column layout shows more FAQs at once, making it easier for users to find answers quickly.

## Usage

```tsx
import FAQ from "@/components/templates/FAQ";

<FAQ />
```

## Features

- **Two-column layout** - Splits FAQs evenly across two columns (desktop)
- **Accordion-style** - Expandable questions with smooth animations
- **Contact section** - Callout at bottom linking to support email
- **Responsive design** - Stacks to single column on mobile
- **Interactive** - Click questions to expand/collapse answers

## Setup

### 1. Add FAQ Items

Update the `faqList` array in the component:

```typescript
const faqList: FAQItem[] = [
  {
    question: "What is included in the boilerplate?",
    answer: "ShipSafe includes authentication, billing, database setup, and all the essential features to build a secure SaaS quickly.",
  },
  {
    question: "Can I customize the components?",
    answer: "Yes! All components are fully customizable. They're built with TailwindCSS and DaisyUI for easy styling.",
  },
  {
    question: "Do I need to know TypeScript?",
    answer: "Basic TypeScript knowledge helps, but the boilerplate includes detailed comments and documentation to guide you.",
  },
];
```

### 2. Configure Support Email

Set `supportEmail` in `config.ts`:

```typescript
// config.ts
const config = {
  supportEmail: "support@yourdomain.com",
  // ...
};
```

## Customization

### FAQ Items

Each FAQ item has:
- `question` - The question text (string)
- `answer` - The answer (string or React node)

```typescript
interface FAQItem {
  question: string;
  answer: string | React.ReactNode;  // Can use JSX for rich content
}
```

**Rich Content in Answers:**

You can use JSX in answers for formatting:

```typescript
{
  question: "What payment methods do you accept?",
  answer: (
    <>
      We accept all major credit cards via Stripe. You can also use{" "}
      <a href="https://stripe.com" className="link link-primary">
        Stripe's payment methods
      </a>
      {" "}including Apple Pay and Google Pay.
    </>
  ),
}
```

### Section Title

Update the heading text:

```tsx
<h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
  Frequently Asked Questions
</h2>
```

### Contact Section

The contact section automatically uses `config.supportEmail`. To customize:

```tsx
// In FAQ.tsx, find the contact section and update:
<p className="text-lg text-base-content/70">
  Can't find your answer?{" "}
  <a
    href={`mailto:${config.supportEmail}`}
    className="link link-primary font-medium"
  >
    Contact support
  </a>
  .
</p>
```

## Layout

### Desktop Layout

```
[Title Section (centered)]
[FAQ Column 1]    [FAQ Column 2]
[Contact Section (centered)]
```

### Mobile Layout

```
[Title Section]
[FAQ Column 1]
[FAQ Column 2]
[Contact Section]
```

## Code Example

```tsx
import FAQ from "@/components/templates/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <FAQ />  {/* FAQ section before CTA */}
      <CTA />
    </>
  );
}
```

## Tips

- **Address objections** - Think about what might stop someone from buying. Address those concerns here.
- **Match each line** - If you have a "With vs Without" comparison in another section, match each line of the "With" column with a corresponding FAQ question.
- **Keep answers concise** - Users scan FAQs quickly. Keep answers short and to the point (2-3 sentences max).
- **Update regularly** - Add new FAQs based on actual customer questions you receive.
- **Use keywords** - Include relevant keywords in questions for SEO benefits.

## Best Practices

1. **Order matters** - Put most common questions first
2. **Clear questions** - Write questions as users would ask them
3. **Helpful answers** - Provide actionable, helpful answers
4. **Contact fallback** - Always include contact information for unanswered questions
5. **Regular updates** - Review and update FAQs based on customer feedback

## Common FAQ Topics

- **Pricing** - "How does pricing work?", "Can I cancel anytime?"
- **Features** - "What's included?", "Can I customize X?"
- **Technical** - "What tech stack?", "Do I need to know Y?"
- **Support** - "How do I get help?", "Do you offer support?"
- **Billing** - "What payment methods?", "When will I be charged?"

## Examples

### Basic FAQ

```typescript
const faqList: FAQItem[] = [
  {
    question: "Question 1?",
    answer: "Answer 1",
  },
  {
    question: "Question 2?",
    answer: "Answer 2",
  },
];
```

### FAQ with Rich Content

```typescript
{
  question: "Can I integrate my own API?",
  answer: (
    <>
      Yes! ShipSafe is built with Next.js API routes. See our{" "}
      <Link href="/docs/api-routes" className="link link-primary">
        API documentation
      </Link>
      {" "}for examples.
    </>
  ),
}
```

## Learn More

- [Configuration Guide](../../get-started/configuration) - Configure support email
- [Static Page Tutorial](../../tutorials/static-page) - Build complete pages

