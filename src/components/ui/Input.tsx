/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — Input.tsx
 * -----------------------------------------------------------------------------
 * Input component with DaisyUI styling.
 * Supports various input types and validation states.
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input label
   */
  label?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Whether input is required
   */
  required?: boolean;
}

/**
 * Input component with DaisyUI styling.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    // Generate stable ID using React's useId hook
    const generatedId = useId();
    const inputId = id || generatedId;

    const inputClasses = [
      "input input-bordered w-full",
      "transition-all duration-200 ease-in-out",
      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
      error ? "input-error focus:ring-error/20 focus:border-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="form-control w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            <span className="label-text">
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </span>
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error || helperText
              ? `${inputId}-${error ? "error" : "helper"}`
              : undefined
          }
          {...props}
        />
        {error && (
          <label className="label" id={`${inputId}-error`}>
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        {helperText && !error && (
          <label className="label" id={`${inputId}-helper`}>
            <span className="label-text-alt text-base-content/70">
              {helperText}
            </span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

