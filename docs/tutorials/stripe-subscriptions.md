# Stripe Subscriptions Tutorial

Complete guide to implementing Stripe subscriptions with checkout, webhooks, and billing management in ShipSafe.

## Overview

ShipSafe includes a complete Stripe integration for subscription-based SaaS products. This tutorial covers:

- **Creating checkout sessions** - One-time subscription purchases
- **Handling webhooks** - Sync subscription status automatically
- **Managing subscriptions** - Access billing portal
- **Subscription status** - Check user subscription state

## Architecture

### Flow Overview

```
User clicks "Subscribe" → Checkout Session Created → Stripe Checkout → 
Webhook Received → Firestore Updated → User Role Updated → Dashboard Access
```

**Key Components:**
1. **Checkout Button** - Client component that initiates checkout
2. **API Route** - Creates Stripe checkout session
3. **Webhook Handler** - Processes Stripe events
4. **Firestore Sync** - Stores subscription data
5. **User Role Update** - Updates custom claims based on subscription

## Setup

### 1. Configure Stripe

See [Stripe Setup Guide](../features/stripe-setup) for complete instructions.

**Required:**
- Stripe account created
- Products and prices created in Stripe Dashboard
- Webhook endpoint configured
- Environment variables set

### 2. Environment Variables

Add to `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Create Products and Prices

In Stripe Dashboard:

1. Go to **Products** → Create product
2. Set product name and description
3. Add pricing (monthly/annual)
4. Copy **Price ID** (starts with `price_...`)

Add Price IDs to `config.ts`:

```typescript
stripe: {
  plans: [
    {
      priceId: process.env.STRIPE_PRICE_STARTER || "",
      name: "Starter",
      price: 29,
      features: [...],
    },
    {
      priceId: process.env.STRIPE_PRICE_PRO || "",
      name: "Pro",
      price: 99,
      features: [...],
    },
  ],
},
```

## Creating Checkout Sessions

### Using ButtonCheckout Component

The easiest way - use the built-in component:

```tsx
import ButtonCheckout from "@/components/ui/ButtonCheckout";
import config from "@/config";

// Get featured plan (most expensive)
const featuredPlan = config.stripe.plans.find((p) => p.isFeatured) || config.stripe.plans[0];

<ButtonCheckout priceId={featuredPlan.priceId} />
```

**Location:** `src/components/ui/ButtonCheckout.tsx`

**Features:**
- ✅ Automatically handles checkout flow
- ✅ Shows loading state
- ✅ Redirects to Stripe Checkout
- ✅ Includes logo in button

### Custom Checkout Implementation

If you need custom checkout logic:

```tsx
"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

function CustomCheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await apiPost<{ url: string }>("/api/checkout", {
        priceId,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
      });

      if (response.success && response.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? "Loading..." : "Subscribe Now"}
    </button>
  );
}
```

### API Route Pattern

The checkout API route creates a Stripe session:

```typescript
// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserServer } from "@/lib/firebase/auth";
import { createCheckoutSessionForUser } from "@/features/billing/server";
import { checkoutSchema } from "@/features/billing/schema";

export async function POST(req: NextRequest) {
  try {
    // Optional: Get user (can be anonymous checkout)
    const user = await getCurrentUserServer(req);

    // Parse and validate request
    const body = await req.json();
    const data = checkoutSchema.parse(body);

    // Create checkout session
    const session = await createCheckoutSessionForUser(
      user?.uid || undefined,
      {
        priceId: data.priceId,
        successUrl: data.successUrl,
        cancelUrl: data.cancelUrl,
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        url: session.url,
        sessionId: session.id,
      },
    });
  } catch (error) {
    // Error handling...
  }
}
```

## Webhook Handling

### Webhook Events

ShipSafe handles these Stripe webhook events automatically:

- **`checkout.session.completed`** - User completed checkout
- **`customer.subscription.created`** - New subscription created
- **`customer.subscription.updated`** - Subscription updated (plan change, etc.)
- **`customer.subscription.deleted`** - Subscription canceled
- **`invoice.paid`** - Recurring payment succeeded
- **`invoice.payment_failed`** - Payment failed

**Location:** `src/app/api/webhooks/stripe/route.ts`

### Webhook Processing

The webhook handler:

1. **Verifies signature** - Ensures request is from Stripe
2. **Extracts Firebase UID** - From subscription metadata
3. **Syncs to Firestore** - Updates subscription document
4. **Updates user role** - Sets custom claims based on status

```typescript
// Automatic webhook handling - already implemented
// Located in: src/app/api/webhooks/stripe/route.ts

// Webhooks are automatically processed when configured correctly
```

### Configuring Webhooks

1. **In Stripe Dashboard:**
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`

2. **Get Webhook Secret:**
   - After creating endpoint, copy **Signing secret** (starts with `whsec_...`)
   - Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

3. **Test with Stripe CLI:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## Managing Subscriptions

### Accessing Subscription Status

#### Server-Side (API Route)

```typescript
import { getUserSubscriptionFromFirestore } from "@/features/billing/server";

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);

  // Get user's subscription
  const subscription = await getUserSubscriptionFromFirestore(user.uid);

  if (!subscription) {
    return NextResponse.json({
      success: true,
      data: { hasSubscription: false },
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      hasSubscription: true,
      subscription: {
        status: subscription.status,
        priceId: subscription.priceId,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
    },
  });
}
```

#### Client-Side (Component)

```tsx
"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

function SubscriptionStatus({ userId }: { userId: string }) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await apiGet("/api/subscription/status");
        if (response.success && response.data) {
          setSubscription(response.data.subscription);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!subscription) return <div>No active subscription</div>;

  return (
    <div>
      <p>Status: {subscription.status}</p>
      <p>Plan: {subscription.priceId}</p>
    </div>
  );
}
```

### Billing Portal

Allow users to manage their subscription (update payment method, cancel, etc.):

#### Using API Route

```tsx
"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    setLoading(true);

    try {
      const response = await apiPost<{ url: string }>("/api/billing/portal", {
        returnUrl: window.location.href,
      });

      if (response.success && response.data?.url) {
        // Redirect to Stripe billing portal
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Failed to open billing portal:", error);
      alert("Failed to open billing portal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleManageBilling}
      disabled={loading}
      className="btn btn-outline"
    >
      {loading ? "Loading..." : "Manage Billing"}
    </button>
  );
}
```

**API Route:** `src/app/api/billing/portal/route.ts`

The billing portal allows users to:
- ✅ Update payment method
- ✅ View billing history
- ✅ Cancel subscription
- ✅ Update billing information

## Subscription Status Checks

### Check if User Has Active Subscription

```typescript
import { getUserSubscriptionFromFirestore } from "@/features/billing/server";
import { SubscriptionStatus } from "@/models/subscription";

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscriptionFromFirestore(userId);

  if (!subscription) {
    return false;
  }

  return subscription.status === SubscriptionStatus.ACTIVE;
}
```

### Get Subscription Plan

```typescript
import { getUserSubscriptionFromFirestore } from "@/features/billing/server";
import config from "@/config";

export async function getUserPlan(userId: string) {
  const subscription = await getUserSubscriptionFromFirestore(userId);

  if (!subscription) {
    return null;
  }

  // Find plan in config by priceId
  const plan = config.stripe.plans.find(
    (p) => p.priceId === subscription.priceId
  );

  return plan || null;
}
```

## Example: Complete Subscription Component

```tsx
"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openingPortal, setOpeningPortal] = useState(false);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await apiGet("/api/subscription/status");
        if (response.success && response.data) {
          setSubscription(response.data.subscription);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  const handleManageBilling = async () => {
    setOpeningPortal(true);

    try {
      const response = await apiPost<{ url: string }>("/api/billing/portal", {
        returnUrl: window.location.href,
      });

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Failed to open billing portal:", error);
      alert("Failed to open billing portal. Please try again.");
    } finally {
      setOpeningPortal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <Card.Body>
          <h2 className="text-2xl font-bold mb-4">No Active Subscription</h2>
          <p className="text-base-content/70 mb-6">
            Subscribe to a plan to get started.
          </p>
          <Button>View Pricing</Button>
        </Card.Body>
      </Card>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "canceled":
      case "past_due":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Subscription</h2>
          <Badge variant={getStatusVariant(subscription.status)}>
            {subscription.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-6">
          <div>
            <span className="font-semibold">Plan:</span> {subscription.priceId}
          </div>
          <div>
            <span className="font-semibold">Next billing:</span>{" "}
            {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
          </div>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="alert alert-warning mb-4">
            Your subscription will cancel at the end of the current period.
          </div>
        )}

        <Button
          onClick={handleManageBilling}
          loading={openingPortal}
          fullWidth
        >
          Manage Billing
        </Button>
      </Card.Body>
    </Card>
  );
}
```

## Testing

### Test Mode

Use Stripe test mode for development:

1. **Test Cards:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0027 6000 3184`

2. **Test Webhooks:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. **Trigger Test Events:**
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.created
   ```

### Production Checklist

- ✅ Switch to live API keys
- ✅ Configure production webhook endpoint
- ✅ Test checkout flow end-to-end
- ✅ Verify webhook events are received
- ✅ Confirm Firestore sync works
- ✅ Test billing portal access

## Best Practices

### 1. Always Store Firebase UID in Metadata

✅ **Do:**
```typescript
metadata: {
  firebase_uid: userId, // For webhook linking
}
```

### 2. Handle Webhook Events Idempotently

✅ **Do:**
- Check if subscription already exists before creating
- Use subscription ID as document ID in Firestore
- Handle duplicate events gracefully

### 3. Verify Webhook Signatures

✅ **Do:**
- Always verify Stripe webhook signatures
- Use webhook secret from environment variables
- Reject unsigned or invalid requests

### 4. Update User Roles Based on Subscription

✅ **Do:**
- Update custom claims when subscription changes
- Grant/revoke access based on subscription status
- Handle subscription cancellations gracefully

### 5. Provide Clear User Feedback

✅ **Do:**
- Show subscription status clearly
- Provide access to billing portal
- Handle payment failures gracefully
- Send email notifications for important events

## Troubleshooting

### Checkout Session Not Created

- ✅ Check Stripe API keys are correct
- ✅ Verify price ID exists in Stripe
- ✅ Check API route authentication

### Webhook Events Not Received

- ✅ Verify webhook endpoint URL is correct
- ✅ Check webhook secret matches
- ✅ Ensure webhook events are selected in Stripe Dashboard
- ✅ Test with Stripe CLI locally

### Subscription Status Not Updating

- ✅ Check webhook handler logs
- ✅ Verify Firestore write permissions
- ✅ Check subscription metadata contains Firebase UID
- ✅ Verify webhook events are being processed

## Learn More

- [Stripe Setup Guide](../features/stripe-setup) - Complete setup instructions
- [Billing Features](../features/billing) - Billing implementation details
- [Webhook Handling](../features/webhooks) - Webhook patterns
- [Stripe Documentation](https://stripe.com/docs) - Official Stripe docs
