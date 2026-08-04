/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — ButtonGradient.tsx
 * -----------------------------------------------------------------------------
 * Gradient button variant with branded styling.
 * Used for primary CTAs and hero sections.
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonGradientProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button size
   */
  size?: "sm" | "md" | "lg";

  /**
   * Whether button is in loading state
   */
  loading?: boolean;

  /**
   * Whether button is full width
   */
  fullWidth?: boolean;

  /**
   * Button content
   */
  children: ReactNode;
}

/**
 * Gradient button component with branded styling.
 */
const ButtonGradient = ({
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonGradientProps) => {
  const sizeClasses = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  const baseClasses =
    "btn bg-gradient-to-r from-primary to-secondary text-white border-none hover:opacity-90 transition-opacity";
  const sizeClass = sizeClasses[size];
  const widthClass = fullWidth ? "w-full" : "";
  const loadingClass = loading ? "loading" : "";

  const classes = [
    baseClasses,
    sizeClass,
    widthClass,
    loadingClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonGradient;

