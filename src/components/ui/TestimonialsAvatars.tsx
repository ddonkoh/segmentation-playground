/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — TestimonialsAvatars.tsx
 * -----------------------------------------------------------------------------
 * 
 * Social proof component displaying user avatars and trust indicators.
 * 
 * Features:
 * - Overlapping avatar display (shows community/users)
 * - Star rating display
 * - Trust indicator text (customizable)
 * - Responsive layout (stacks on mobile, horizontal on desktop)
 * 
 * Usage:
 *   <TestimonialsAvatars priority={true} />
 * 
 * Customisation:
 * - Update `avatars` array to change user images
 * - Modify `trustText` to change the message
 * - Update `userCount` to change the number
 * - Change star rating if needed
 * - Adjust styling classes
 * 
 * This is a Client Component ("use client") because it uses:
 * - Image component with priority loading
 * - Dynamic rendering
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import Image from "next/image";

/**
 * User avatars for social proof.
 * 
 * Customisation:
 * - Replace with your own user avatars
 * - Add/remove avatars (recommended: 4-6 avatars)
 * - Use local images for better performance (import from @/public)
 */
const avatars = [
  {
    alt: "User",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3276&q=80",
  },
  {
    alt: "User",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "User",
    src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "User",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "User",
    src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3376&q=80",
  },
];

/**
 * Trust indicator configuration.
 * 
 * Customisation:
 * - Update `userCount` to match your actual user count
 * - Change `trustText` to match your brand message
 * - Update `rating` to change the star rating (e.g., 4.7, 4.5, 5.0)
 * - Examples:
 *   - "X developers trust ShipSafe"
 *   - "X teams ship securely"
 *   - "Trusted by X companies"
 */
const userCount = 36;
const trustText = "builders ship securely";

/**
 * TestimonialsAvatars component.
 * 
 * Displays overlapping user avatars with a star rating and trust indicator.
 * Used in Hero section for social proof.
 * 
 * @param priority - Whether to prioritize image loading (use true in Hero section)
 * @returns {JSX.Element} TestimonialsAvatars component
 */
const TestimonialsAvatars = ({ priority = false }: { priority?: boolean }) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-3">
      {/* Overlapping avatars */}
      {/* 
        Displays user avatars in an overlapping style to show community.
        Uses DaisyUI's avatar-group class for proper styling.
        
        Customisation:
        - Adjust `-space-x-5` to change overlap amount
        - Change `w-12 h-12` to adjust avatar size
        - Remove avatar-group class if you want different styling
      */}
      <div className="-space-x-5 avatar-group">
        {avatars.map((image, i) => (
          <div className="avatar w-12 h-12" key={i}>
            <Image
              src={image.src}
              alt={image.alt}
              priority={priority}
              width={50}
              height={50}
            />
          </div>
        ))}
      </div>

      {/* Rating and trust text */}
      {/* 
        Displays star rating (4.7/5) and trust indicator text.
        Shows 4 full stars + 1 partial star (70% filled for 4.7/5).
        
        Customisation:
        - Update `rating` constant to change the rating (e.g., 4.5, 4.8, 5.0)
        - Change star color (#fbbf24 is yellow-400)
        - Modify trust text and user count
      */}
      <div className="flex flex-col justify-center items-center md:items-start gap-1">
        <div className="flex gap-0.5 items-center">
          {/* Full stars (4 stars) */}
          {[...Array(4)].map((_, i) => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#fbbf24"
              className="w-5 h-5"
              key={i}
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
          ))}
          {/* Partial star (70% filled for 4.7/5) */}
          <div className="relative w-5 h-5">
            {/* Empty star (background) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              stroke="#fbbf24"
              strokeWidth={1}
              className="absolute inset-0 w-full h-full"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
            {/* Filled portion (70% width) */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${(4.7 - 4) * 100}%` }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#fbbf24"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <span className="text-base-content/60 mx-1">•</span>
          <span className="text-base text-base-content/80">4.7/5</span>
        </div>
        <div className="text-base text-base-content/80">
          <span className="font-semibold text-base-content">32</span> makers
          ship faster
        </div>
      </div>
    </div>
  );
};

export default TestimonialsAvatars;

