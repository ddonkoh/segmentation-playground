/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — Loader.tsx
 * -----------------------------------------------------------------------------
 * Loading spinner component with full-page option.
 * Uses DaisyUI loading classes for consistent styling.
 *
 * -----------------------------------------------------------------------------
 */

"use client";

export interface LoaderProps {
  /**
   * Loader size
   */
  size?: "xs" | "sm" | "md" | "lg";

  /**
   * Whether loader is full page
   */
  fullPage?: boolean;

  /**
   * Loading text
   */
  text?: string;
}

/**
 * Loader component with DaisyUI styling.
 */
const Loader = ({
  size = "md",
  fullPage = false,
  text,
}: LoaderProps) => {
  const sizeClasses = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  const spinnerClasses = [
    "loading loading-spinner",
    sizeClasses[size],
  ].join(" ");

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <span className={`${spinnerClasses} text-primary`}></span>
          {text && <p className="text-base-content/70 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <span className={`${spinnerClasses} text-primary`}></span>
        {text && <p className="text-sm text-base-content/70 font-medium">{text}</p>}
      </div>
    </div>
  );
};

export default Loader;

