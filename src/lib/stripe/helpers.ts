/**
 * -----------------------------------------------------------------------------
 * ShipSafe Stripe Utilities — helpers.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Utility functions for formatting and displaying Stripe data.
 *   Price formatting, subscription status formatting, date formatting.
 *
 * Why this exists:
 *   Stripe data needs to be formatted for display in UI components.
 *   This centralizes formatting logic for consistency.
 *
 * Security:
 *   - No sensitive data exposed
 *   - Safe formatting functions
 *
 * Used by:
 *   - Billing components
 *   - Subscription display components
 *   - Pricing pages
 *
 * -----------------------------------------------------------------------------
 */

import { SubscriptionStatus } from "@/models/subscription-status";

// -----------------------------------------------------------------------------
// 1. Price Formatting
// -----------------------------------------------------------------------------

/**
 * formatPrice() — formats a price in cents to a currency string.
 *
 * @param amountInCents - Price in cents (e.g., 9999 for $99.99)
 * @param currency - Currency code (default: "usd")
 * @returns Formatted price string (e.g., "$99.99")
 */
export function formatPrice(
  amountInCents: number,
  currency: string = "usd"
): string {
  const amount = amountInCents / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

/**
 * formatPriceFromDollars() — formats a price in dollars to a currency string.
 *
 * @param amountInDollars - Price in dollars (e.g., 99.99)
 * @param currency - Currency code (default: "usd")
 * @returns Formatted price string (e.g., "$99.99")
 */
export function formatPriceFromDollars(
  amountInDollars: number,
  currency: string = "usd"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountInDollars);
}

/**
 * centsToDollars() — converts cents to dollars.
 *
 * @param cents - Amount in cents
 * @returns Amount in dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * dollarsToCents() — converts dollars to cents.
 *
 * @param dollars - Amount in dollars
 * @returns Amount in cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

// -----------------------------------------------------------------------------
// 2. Subscription Status Formatting
// -----------------------------------------------------------------------------

/**
 * formatSubscriptionStatus() — formats subscription status for display.
 *
 * @param status - Subscription status
 * @returns Human-readable status string
 */
export function formatSubscriptionStatus(
  status: SubscriptionStatus | string
): string {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return "Active";
    case SubscriptionStatus.CANCELED:
      return "Canceled";
    case SubscriptionStatus.INCOMPLETE:
      return "Incomplete";
    case SubscriptionStatus.INCOMPLETE_EXPIRED:
      return "Incomplete (Expired)";
    case SubscriptionStatus.PAST_DUE:
      return "Past Due";
    case SubscriptionStatus.TRIALING:
      return "Trialing";
    case SubscriptionStatus.UNPAID:
      return "Unpaid";
    case SubscriptionStatus.PAUSED:
      return "Paused";
    default:
      return "Unknown";
  }
}

/**
 * getSubscriptionStatusColor() — returns color class for subscription status.
 *
 * Useful for UI components (e.g., badges, status indicators).
 *
 * @param status - Subscription status
 * @returns DaisyUI color class
 */
export function getSubscriptionStatusColor(
  status: SubscriptionStatus | string
): string {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
    case SubscriptionStatus.TRIALING:
      return "badge-success";
    case SubscriptionStatus.CANCELED:
      return "badge-neutral";
    case SubscriptionStatus.PAST_DUE:
    case SubscriptionStatus.UNPAID:
      return "badge-error";
    case SubscriptionStatus.INCOMPLETE:
    case SubscriptionStatus.INCOMPLETE_EXPIRED:
      return "badge-warning";
    case SubscriptionStatus.PAUSED:
      return "badge-info";
    default:
      return "badge-ghost";
  }
}

/**
 * isSubscriptionActive() — checks if subscription is currently active.
 *
 * @param status - Subscription status
 * @returns True if subscription is active or trialing
 */
export function isSubscriptionActive(
  status: SubscriptionStatus | string
): boolean {
  return (
    status === SubscriptionStatus.ACTIVE ||
    status === SubscriptionStatus.TRIALING
  );
}

// -----------------------------------------------------------------------------
// 3. Date Formatting
// -----------------------------------------------------------------------------

/**
 * formatBillingPeriod() — formats billing period dates.
 *
 * @param startTimestamp - Period start (Unix timestamp)
 * @param endTimestamp - Period end (Unix timestamp)
 * @returns Formatted date range string
 */
export function formatBillingPeriod(
  startTimestamp: number,
  endTimestamp: number
): string {
  const startDate = new Date(startTimestamp * 1000);
  const endDate = new Date(endTimestamp * 1000);

  const startFormatted = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const endFormatted = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * formatDate() — formats a Unix timestamp to a readable date.
 *
 * @param timestamp - Unix timestamp
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  timestamp: number,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(timestamp * 1000);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return date.toLocaleDateString("en-US", defaultOptions);
}

/**
 * formatDateTime() — formats a Unix timestamp to a readable date and time.
 *
 * @param timestamp - Unix timestamp
 * @returns Formatted date and time string
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * getDaysUntil() — calculates days until a future date.
 *
 * @param futureTimestamp - Future Unix timestamp
 * @returns Number of days until the date
 */
export function getDaysUntil(futureTimestamp: number): number {
  const now = Math.floor(Date.now() / 1000);
  const diff = futureTimestamp - now;
  return Math.ceil(diff / (60 * 60 * 24));
}

/**
 * getDaysRemaining() — calculates days remaining in a period.
 *
 * @param endTimestamp - Period end Unix timestamp
 * @returns Number of days remaining (0 if past)
 */
export function getDaysRemaining(endTimestamp: number): number {
  const days = getDaysUntil(endTimestamp);
  return Math.max(0, days);
}

// -----------------------------------------------------------------------------
// 4. Interval Formatting
// -----------------------------------------------------------------------------

/**
 * formatInterval() — formats billing interval for display.
 *
 * @param interval - Billing interval ("day", "week", "month", "year")
 * @param intervalCount - Number of intervals (default: 1)
 * @returns Formatted interval string (e.g., "Monthly", "Every 3 months")
 */
export function formatInterval(
  interval: "day" | "week" | "month" | "year" | null,
  intervalCount: number = 1
): string {
  if (!interval) {
    return "One-time";
  }

  const intervalNames: Record<string, string> = {
    day: "Daily",
    week: "Weekly",
    month: "Monthly",
    year: "Yearly",
  };

  if (intervalCount === 1) {
    return intervalNames[interval] || interval;
  }

  // Pluralize for multiple intervals
  const pluralNames: Record<string, string> = {
    day: "days",
    week: "weeks",
    month: "months",
    year: "years",
  };

  return `Every ${intervalCount} ${pluralNames[interval] || interval}`;
}

