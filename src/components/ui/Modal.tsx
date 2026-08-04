/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — Modal.tsx
 * -----------------------------------------------------------------------------
 * Modal dialog component with DaisyUI integration.
 * Requires "use client" for interactivity.
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { ReactNode, useEffect } from "react";

export interface ModalProps {
  /**
   * Whether modal is open
   */
  isOpen: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Modal content
   */
  children: ReactNode;

  /**
   * Modal footer content
   */
  footer?: ReactNode;

  /**
   * Whether modal can be closed by clicking outside
   */
  closeOnOutsideClick?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Modal component with DaisyUI styling.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOutsideClick = true,
  className = "",
}: ModalProps) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      className={`modal ${isOpen ? "modal-open" : ""} transition-all duration-300`}
      onClick={closeOnOutsideClick ? onClose : undefined}
    >
      <div
        className={`modal-box ${className} transition-all duration-300 transform`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="font-bold text-lg mb-4">{title}</h3>
        )}
        <div>{children}</div>
        {footer && <div className="modal-action">{footer}</div>}
      </div>
      <form method="dialog" className="modal-backdrop bg-black/50 backdrop-blur-sm">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default Modal;

