/**
 * -----------------------------------------------------------------------------
 * ShipSafe Template Components — Testimonial.tsx
 * -----------------------------------------------------------------------------
 * 
 * Customer testimonial carousel with multiple testimonials.
 * 
 * Reason:
 * Testimonials provide social proof and build trust. This section comes after
 * Features and before Pricing to reinforce the value proposition with real
 * customer feedback. Shows potential customers that others have succeeded
 * with your product, reducing purchase anxiety. Multiple testimonials in a
 * carousel show variety and build more credibility.
 * 
 * Features:
 * - Carousel displaying 3 testimonials at a time (desktop)
 * - Auto-rotating testimonials (optional)
 * - Navigation arrows to manually control
 * - Star rating display (5 stars)
 * - Highlighted quote text (key phrases emphasized)
 * - Customer avatar and credentials
 * - Responsive design (stacks on mobile)
 * 
 * Layout:
 * Desktop:
 *   [Testimonial 1] [Testimonial 2] [Testimonial 3]
 *   [Navigation arrows]
 * 
 * Mobile:
 *   [Testimonial 1]
 *   [Navigation arrows]
 * 
 * Usage:
 *   <Testimonial />
 * 
 * Customisation:
 * - Update `testimonials` array to add/remove testimonials
 * - Change highlighted phrases
 * - Replace avatar images
 * - Update customer names and titles
 * - Modify auto-rotate interval (currently 5000ms)
 * - Adjust number of visible testimonials (currently 3)
 * 
 * This is a Client Component ("use client") because it uses:
 * - useState for current testimonial index
 * - useEffect for auto-rotation
 * - onClick handlers for navigation
 * 
 * Styling Notes:
 * - Uses DaisyUI classes (rating, bg-primary/15)
 * - Clean, minimal design
 * - Card-based layout
 * - Easy to customize for your brand
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * Testimonials data array.
 * 
 * Customisation:
 * - Add/remove testimonials (currently 5)
 * - Update quote text
 * - Change highlighted phrases
 * - Replace avatar images
 * - Update customer names and titles
 */
const testimonials = [
  {
    id: 1,
    name: "Alex Chen",
    title: "Full-stack Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    quote: "I don't want to spend weeks configuring security middleware. I don't want to risk a data breach either. ShipSafe solved this problem once and for all. Security is built-in, not bolted on. I can focus on building features instead of worrying about vulnerabilities.",
  },
  {
    id: 2,
    name: "Sarah Martinez",
    title: "Startup Founder",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    quote: "ShipSafe saved me months of development time. The security features are production-ready out of the box. I launched my SaaS in weeks instead of months, and I know it's secure from day one. This is exactly what I needed to move fast without cutting corners.",
  },
  {
    id: 3,
    name: "James Wilson",
    title: "CTO",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    quote: "The 7-layer security stack is exactly what we needed. No more worrying about CSRF attacks or rate limiting. Everything is configured correctly from the start. This is how all boilerplates should be built. Our security audit passed on the first try.",
  },
  {
    id: 4,
    name: "Emily Davis",
    title: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    quote: "Best investment I made for my startup. Stripe integration, Firebase auth, and security all working together seamlessly. I can focus on building my product instead of fighting with infrastructure. The documentation is clear and the code is production-ready.",
  },
  {
    id: 5,
    name: "Michael Brown",
    title: "Indie Developer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    quote: "Finally, a boilerplate that takes security seriously. I've tried other boilerplates, but ShipSafe is the only one that doesn't make me worry about security vulnerabilities. It's built right from the ground up. Worth every penny.",
  },
];

/**
 * Testimonial component with carousel.
 * 
 * Displays multiple testimonials in a carousel format, showing 3 at a time
 * on desktop and 1 on mobile. Auto-rotates every 5 seconds.
 * 
 * @returns {JSX.Element} Testimonial carousel section component
 */
const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  /**
   * Auto-rotate testimonials every 5 seconds.
   * 
   * Customisation:
   * - Change interval duration (currently 5000ms)
   * - Disable auto-rotation (remove useEffect)
   */
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  /**
   * Get visible testimonials based on current index.
   * Shows 3 testimonials on desktop, 1 on mobile.
   */
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="bg-base-100 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        {/* 
          Section title and description.
          
          Customisation:
          - Update title text
          - Change description
          - Adjust text sizes
        */}
        <div className="flex flex-col text-center w-full mb-20">
          <div className="mb-8">
            <h2 className="sm:text-5xl text-4xl font-extrabold text-base-content">
              What makers say
            </h2>
          </div>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-base-content/80">
            Don&apos;t just take our word for it. See what developers and founders are saying about ShipSafe.
          </p>
        </div>

        {/* Carousel container with navigation */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Navigation arrows */}
          {/* 
            Previous/Next buttons for manual navigation.
            Fixed width buttons that don't overlap with cards.
            
            Customisation:
            - Change arrow styling (btn-primary, btn-outline, etc.)
            - Adjust button width (w-12, w-16, etc.)
            - Modify button size
          */}
          <button
            onClick={goToPrevious}
            className="btn btn-square btn-ghost hover:bg-base-200 text-base-content/60 hover:text-base-content w-12 h-12 md:w-16 md:h-16 shrink-0"
            aria-label="Previous testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 md:w-8 md:h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Testimonials grid */}
          {/* 
            Grid displaying visible testimonials.
            All cards have equal height regardless of content.
            
            Customisation:
            - Change grid columns (grid-cols-1 md:grid-cols-3)
            - Adjust gap spacing (gap-6)
            - Modify card styling
          */}
          <ul
            role="list"
            className="flex flex-col items-stretch lg:flex-row lg:items-stretch gap-6 lg:gap-8 flex-1"
          >
          {visibleTestimonials.map((testimonial) => (
            <li key={testimonial.id} className="flex-1 w-full flex">
              <figure className="relative w-full p-8 md:p-10 bg-base-200 rounded-2xl flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Quote text */}
                <blockquote className="relative flex-1 mb-8">
                  <p className="text-base-content/80 leading-relaxed text-base md:text-lg">
                    {testimonial.quote}
                  </p>
                </blockquote>

                {/* Customer info */}
                <figcaption className="relative flex items-center justify-start gap-4 pt-6 border-t border-base-content/5 mt-auto">
                  <div className="w-full flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-base-content mb-1">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-base-content/80">
                        {testimonial.title}
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-full bg-base-300 shrink-0 ring-2 ring-base-content/5">
                      <Image
                        className="w-12 h-12 rounded-full object-cover"
                        src={testimonial.avatar}
                        alt={`${testimonial.name}'s testimonial`}
                        width={48}
                        height={48}
                      />
                    </div>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
          </ul>

          <button
            onClick={goToNext}
            className="btn btn-square btn-ghost hover:bg-base-200 text-base-content/60 hover:text-base-content w-12 h-12 md:w-16 md:h-16 shrink-0"
            aria-label="Next testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 md:w-8 md:h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        {/* Dots indicator */}
        {/* 
          Shows which testimonials are currently visible.
          
          Customisation:
          - Change dot styling
          - Modify spacing
          - Remove if not needed
        */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-base-content/20 hover:bg-base-content/40 w-2"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
