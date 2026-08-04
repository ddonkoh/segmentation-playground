/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — Badge.tsx
 * -----------------------------------------------------------------------------
 * Badge component for status indicators and labels.
 * Uses DaisyUI badge classes for consistent styling.
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { ReactNode } from "react";

export interface BadgeProps {
  /**
   * Badge variant/color
   */
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "neutral"
    | "ghost";

  /**
   * Badge size
   */
  size?: "xs" | "sm" | "md" | "lg";

  /**
   * Whether badge is outlined
   */
  outline?: boolean;

  /**
   * Badge content
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Badge component with DaisyUI styling.
 */
const Badge = ({
  variant = "neutral",
  size = "md",
  outline = false,
  children,
  className = "",
}: BadgeProps) => {
  const variantClasses = {
    primary: "badge-primary",
    secondary: "badge-secondary",
    accent: "badge-accent",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    info: "badge-info",
    neutral: "badge-neutral",
    ghost: "badge-ghost",
  };

  const sizeClasses = {
    xs: "badge-xs",
    sm: "badge-sm",
    md: "",
    lg: "badge-lg",
  };

  const baseClasses = "badge transition-all duration-200 ease-in-out";
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const outlineClass = outline ? "badge-outline" : "";

  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    outlineClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={`${classes} hover:scale-105`}>{children}</span>;
};

export default Badge;

