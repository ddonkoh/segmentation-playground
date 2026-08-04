/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — Card.tsx
 * -----------------------------------------------------------------------------
 * Card container component with header, body, and footer sections.
 * Uses DaisyUI card classes for consistent styling.
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { ReactNode } from "react";

export interface CardProps {
  /**
   * Card header content
   */
  header?: ReactNode;

  /**
   * Card body content
   */
  children: ReactNode;

  /**
   * Card footer content
   */
  footer?: ReactNode;

  /**
   * Whether card has shadow
   */
  shadow?: boolean;

  /**
   * Whether card is bordered
   */
  bordered?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Card component with DaisyUI styling.
 */
const Card = ({
  header,
  children,
  footer,
  shadow = true,
  bordered = false,
  className = "",
}: CardProps) => {
  const shadowClass = shadow ? "shadow-lg" : "";
  const borderClass = bordered ? "border border-base-300" : "";

  const classes = ["card bg-base-100", shadowClass, borderClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {header && (
        <div className="card-header p-6 pb-0">
          <div className="card-title">{header}</div>
        </div>
      )}
      <div className="card-body p-6">{children}</div>
      {footer && <div className="card-footer p-6 pt-0">{footer}</div>}
    </div>
  );
};

export default Card;

