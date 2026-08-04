/**
 * -----------------------------------------------------------------------------
 * ShipSafe Error Page
 * -----------------------------------------------------------------------------
 * Error boundary component for handling runtime errors.
 * Displays user-friendly error messages.
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">⚠️</h1>
          <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-base-content/70 mb-6">
            We encountered an unexpected error. Please try again or contact
            support if the problem persists.
          </p>
        </div>

        {error.message && (
          <div className="alert alert-error mb-6">
            <span className="text-sm">{error.message}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="btn btn-primary"
            onClick={reset}
          >
            Try Again
          </button>
          <Link href="/" className="btn btn-outline">
            Go Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-base-content/50">
          <p>
            Need help? Contact us at{" "}
            <a
              href="mailto:support@shipsafe.st"
              className="link link-primary"
            >
              support@shipsafe.st
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
