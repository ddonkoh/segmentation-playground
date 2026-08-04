/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — FAQ.tsx
 * -----------------------------------------------------------------------------
 * 
 * Frequently Asked Questions accordion component with two-column layout.
 * 
 * Reason:
 * The FAQ section comes near the end of the landing page (before CTA) to address
 * common questions and concerns. This reduces friction and answers objections
 * before users reach the purchase decision. Two-column layout shows more FAQs
 * at once, making it easier for users to find answers quickly.
 * 
 * Features:
 * - Simple array-based FAQ items (easy to customize)
 * - Accordion-style expandable answers
 * - Two-column layout (splits FAQs evenly)
 * - Contact section at bottom
 * - Clean, minimal design matching ShipFast aesthetic
 * - Responsive layout (stacks to single column on mobile)
 * 
 * Layout:
 * Desktop:
 *   [Title Section (centered)]
 *   [FAQ Column 1] [FAQ Column 2]
 *   [Contact Section]
 * 
 * Mobile:
 *   [Title Section]
 *   [FAQ Column 1]
 *   [FAQ Column 2]
 *   [Contact Section]
 * 
 * Usage:
 *   <FAQ />
 * 
 * Customisation:
 * - Update `faqList` array to add/remove/modify questions
 * - Change section title text
 * - Modify styling (colors, spacing, borders)
 * - Update contact email in config.ts (config.supportEmail)
 * 
 * This is a Client Component ("use client") because it uses:
 * - useState for accordion open/close state
 * - useRef for accordion height calculations
 * - onClick handlers for interactivity
 * 
 * Styling Notes:
 * - Clean, minimal design matching ShipFast
 * - Simple accordion with smooth animations
 * - Two-column grid layout for better space usage
 * - Easy to customize for your brand
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import { useRef, useState, useEffect } from "react";
import config from "@/config";

/**
 * FAQ item interface.
 * 
 * Each FAQ item has a question and an answer.
 * Answer can be a string or React element for rich content.
 */
interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

/**
 * FAQ items array.
 * 
 * Customisation:
 * - Add/remove FAQ items (will automatically split into two columns)
 * - Update question and answer text
 * - Use JSX in answers for rich formatting
 */
const faqList: FAQItem[] = [
  {
    question: "What is ShipSafe?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        ShipSafe is a security-first Next.js boilerplate with Firebase
        Authentication, Stripe billing, Firestore integration, and clean SaaS UI
        components. Everything you need to launch a secure SaaS application.
      </div>
    ),
  },
  {
    question: "How do I get started?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Simply clone the repository, install dependencies, configure your
        environment variables (Firebase, Stripe), and start building. The
        documentation covers everything you need to know.
      </div>
    ),
  },
  {
    question: "What technologies does ShipSafe use?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        ShipSafe is built with Next.js 15 (App Router), TypeScript, Firebase
        (Auth + Firestore), Stripe (Checkout + Billing Portal), TailwindCSS,
        and DaisyUI for a complete, production-ready stack.
      </div>
    ),
  },
  {
    question: "Can I customize ShipSafe?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Absolutely! ShipSafe is fully customizable. You can modify the UI,
        add features, integrate with additional services, and build your
        product exactly how you want it.
      </div>
    ),
  },
  {
    question: "Is there support available?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Yes! Reach out by email if you have questions or need help. The
        codebase is well-documented and includes detailed comments throughout.
      </div>
    ),
  },
  {
    question: "What's included in the boilerplate?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        ShipSafe includes authentication (Firebase), billing (Stripe), database
        (Firestore), security middleware (CSRF, rate limiting, headers), UI
        components (TailwindCSS + DaisyUI), and production-ready configurations.
      </div>
    ),
  },
];

/**
 * FAQ Item component for individual accordion items.
 * 
 * Handles expand/collapse state and smooth height transitions.
 * 
 * Customisation:
 * - Change accordion animation duration (duration-300)
 * - Modify border styling (border-base-content/10)
 * - Update chevron icon styling
 */
const Item = ({ item }: { item: FAQItem }) => {
  const accordion = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | string>(0);

  // Update maxHeight when isOpen changes
  useEffect(() => {
    if (isOpen && accordion.current) {
      setMaxHeight(accordion.current.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [isOpen]);

  return (
    <li>
      {/* Question button */}
      {/* 
        Clickable button to toggle answer visibility.
        
        Customisation:
        - Update padding (py-5)
        - Modify text size (text-base md:text-lg)
        - Change border styling (border-base-content/10)
      */}
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        {/* Question text */}
        {/* 
          Question text that changes color when open.
          
          Customisation:
          - Change color when open (text-primary)
          - Update font weight (font-semibold)
        */}
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item.question}
        </span>

        {/* Chevron icon */}
        {/* 
          Expand/collapse chevron icon.
          Rotates 180 degrees when open.
          
          Customisation:
          - Change icon size (w-4 h-4)
          - Modify rotation animation
          - Update icon color
        */}
        <svg
          className="flex-shrink-0 w-4 h-4 ml-auto fill-current"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      {/* Answer content */}
      {/* 
        Expandable answer content with smooth height transition.
        
        Customisation:
        - Update padding (pb-5)
        - Modify animation duration (duration-300)
        - Change opacity values
      */}
      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={{
          maxHeight: isOpen ? maxHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pb-5 leading-relaxed">{item.answer}</div>
      </div>
    </li>
  );
};

/**
 * FAQ component displays frequently asked questions in an accordion format.
 * 
 * Uses a simple array-based approach (faqList) for easy customization.
 * Splits FAQs into two columns for better space usage.
 * 
 * @returns {JSX.Element} FAQ section component
 */
const FAQ = () => {
  // Split FAQs into two columns
  // Automatically distributes FAQs evenly between columns
  const midPoint = Math.ceil(faqList.length / 2);
  const leftColumnFaqs = faqList.slice(0, midPoint);
  const rightColumnFaqs = faqList.slice(midPoint);

  return (
    <section className="bg-base-100" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto">
        {/* Section header */}
        {/* 
          Section title centered at top.
          
          Customisation:
          - Update title text
          - Add subtitle if needed
          - Modify text sizes
        */}
        <div className="flex flex-col text-center w-full mb-20">
          <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        {/* FAQ grid - two columns */}
        {/* 
          Two-column layout for FAQ items.
          Automatically splits faqList array evenly.
          
          Customisation:
          - Update gap spacing (gap-8)
          - Modify grid breakpoints (md:grid-cols-2)
          - Change column spacing
        */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column */}
          <div>
            <ul>
              {leftColumnFaqs.map((item, i) => (
                <Item key={i} item={item} />
              ))}
            </ul>
          </div>

          {/* Right column */}
          <div>
            <ul>
              {rightColumnFaqs.map((item, i) => (
                <Item key={i + midPoint} item={item} />
              ))}
            </ul>
          </div>
        </div>

        {/* Contact section */}
        {/* 
          Contact callout at bottom with support email link.
          Uses config.supportEmail for email address.
          
          Customisation:
          - Update contact text
          - Change email (update config.ts)
          - Modify styling
        */}
        <div className="mt-20 text-center">
          <p className="text-base-content/70">
            Have more questions?{" "}
            <a
              href={`mailto:${config.supportEmail}`}
              className="text-primary hover:underline"
            >
              Get in touch with our team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
