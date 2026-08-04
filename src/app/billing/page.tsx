/**
 * -----------------------------------------------------------------------------
 * ShipSafe Billing Page
 * -----------------------------------------------------------------------------
 * Billing management page for authenticated users.
 * Displays subscription status and billing portal access.
 *
 * Security:
 *   - Protected by middleware auth guard
 *   - Server Component by default
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Note: Metadata cannot be exported from client components
// SEO metadata should be handled via layout or server component wrapper
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ButtonGradient from "@/components/ui/ButtonGradient";
import Loader from "@/components/ui/Loader";
import { apiGet, apiPost, handleAPIError } from "@/lib/api";
import {
  formatPrice,
  formatSubscriptionStatus,
  getSubscriptionStatusColor,
  formatBillingPeriod,
  getDaysRemaining,
} from "@/lib/stripe/helpers";
import { SubscriptionStatus } from "@/models/subscription-status";

// Note: Metadata export doesn't work in client components
// In a full implementation, this could be split into server/client components

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      const userResponse = await apiGet<any>("/api/user/me").catch(() => null);
      const subscriptionResponse = await apiGet<any>("/api/billing/subscription").catch(() => null);

      if (userResponse) {
        setUser(userResponse);
      }

      if (subscriptionResponse) {
        setSubscription(subscriptionResponse);
      }
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBillingPortal = async () => {
    try {
      const response = await apiPost<{ url: string }>("/api/billing/portal", {
        returnUrl: window.location.href,
      });

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      setError(handleAPIError(err));
    }
  };

  if (loading) {
    return <Loader fullPage text="Loading billing information..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-base-content/70">
          Manage your subscription and billing information.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Subscription Status */}
      <Card
        header={<h2 className="text-xl font-bold">Subscription Status</h2>}
      >
        {subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base-content/70">Status</span>
              <Badge
                variant={
                  getSubscriptionStatusColor(
                    subscription.status
                  ).replace("badge-", "") as any
                }
              >
                {formatSubscriptionStatus(subscription.status)}
              </Badge>
            </div>

            {subscription.currentPeriodEnd && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Billing Period</span>
                  <span>
                    {formatBillingPeriod(
                      subscription.currentPeriodStart,
                      subscription.currentPeriodEnd
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Days Remaining</span>
                  <span className="font-semibold">
                    {getDaysRemaining(subscription.currentPeriodEnd)} days
                  </span>
                </div>
              </>
            )}

            {subscription.amountTotal && (
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Amount</span>
                <span className="font-semibold">
                  {formatPrice(subscription.amountTotal, subscription.currency)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-base-content/70 mb-4">
              No active subscription found.
            </p>
            <Link href="/pricing">
              <ButtonGradient>View Plans</ButtonGradient>
            </Link>
          </div>
        )}
      </Card>

      {/* Billing Portal */}
      {subscription && (
        <Card
          header={<h2 className="text-xl font-bold">Manage Billing</h2>}
        >
          <p className="text-base-content/70 mb-4">
            Update your payment method, view billing history, or cancel your
            subscription.
          </p>
          <Button
            variant="primary"
            onClick={handleBillingPortal}
            fullWidth
          >
            Open Billing Portal
          </Button>
        </Card>
      )}

      {/* Payment Method */}
      <Card
        header={<h2 className="text-xl font-bold">Payment Method</h2>}
      >
        <p className="text-base-content/70">
          Payment methods are managed through the Stripe billing portal.
        </p>
      </Card>
    </div>
  );
}

