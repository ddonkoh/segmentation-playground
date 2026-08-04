# Billing & Payments

Comprehensive Stripe integration for one-time payments and recurring subscriptions.

## Overview

ShipSafe includes full Stripe integration for handling payments and subscriptions. The system supports both one-time payments and recurring subscriptions with automatic webhook handling, billing portal access, and subscription management.

**Features:**
- **Subscriptions** - Recurring billing (monthly, yearly) with automatic webhook handling
- **One-Time Payments** - Single purchases (products, one-off charges)
- Stripe Checkout integration (both modes)
- Customer billing portal (subscriptions only)
- Webhook event handling (subscription lifecycle events)
- Subscription status sync with Firestore

**Payment Modes:**
- **Subscriptions** (`mode: "subscription"`) - Use `createCheckoutSession()` - Requires webhook events for subscription lifecycle
- **One-Time Payments** (`mode: "payment"`) - Use `createOneTimePaymentSession()` - Only needs `checkout.session.completed` webhook

## Setup

### 1. Configure Stripe

See [Stripe Setup Guide](./stripe-setup) for complete instructions.

**Required steps:**
1. Create Stripe account
2. Get API keys (test and live)
3. Create products and prices
4. Set up webhook endpoint
5. Add environment variables

### 2. Environment Variables

Add to `.env.local`:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
```

### 3. Configure Plans

Define your pricing plans in `config.ts`:

```typescript
// config.ts
stripe: {
  plans: [
    {
      name: "Starter",
      price: 99,
      priceId: process.env.STRIPE_PRICE_STARTER,
      isFeatured: false,
      features: [
        "Feature 1",
        "Feature 2",
      ],
    },
    {
      name: "Pro",
      price: 199,
      priceId: process.env.STRIPE_PRICE_PRO,
      isFeatured: true,
      features: [
        "Everything in Starter",
        "Advanced Feature",
      ],
    },
  ],
}
```

## Checkout Flow

### Creating Checkout Sessions

Use the `ButtonCheckout` component:

```tsx
import ButtonCheckout from "@/components/ui/ButtonCheckout";

<ButtonCheckout priceId={plan.priceId} />
```

**How it works:**
1. User clicks button
2. Component calls `/api/checkout` with `priceId`
3. Server creates Stripe checkout session
4. User is redirected to Stripe's hosted checkout
5. After payment, user is redirected back to your app

### API Route: `/api/checkout`

Handles checkout session creation:

```typescript
// app/api/checkout/route.ts
export async function POST(req: NextRequest) {
  const { priceId } = await req.json();
  
  // Create checkout session
  const session = await createCheckoutSession({
    userId: user?.uid,  // Optional: prefill if logged in
    priceId,
    successUrl: `${origin}/dashboard?checkout=success`,
    cancelUrl: `${origin}/pricing?checkout=cancelled`,
  });
  
  return Response.json({ url: session.url });
}
```

## Subscription Management

### Webhook Events

Automatically handled in `/api/webhooks/stripe/route.ts`:

**Supported Events:**
- `checkout.session.completed` - Customer completed checkout
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription plan changed
- `customer.subscription.deleted` - Subscription canceled
- `invoice.paid` - Payment succeeded
- `invoice.payment_failed` - Payment failed

**Webhook Handler:**
```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  switch (event.type) {
    case "checkout.session.completed":
      // Handle successful checkout
      break;
    case "customer.subscription.updated":
      // Update subscription in Firestore
      break;
    // ... more event handlers
  }
}
```

### Billing Portal

Allow customers to manage their subscriptions:

```typescript
// app/api/billing/portal/route.ts
export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${origin}/dashboard`,
  });
  
  return Response.json({ url: session.url });
}
```

**Usage in component:**
```tsx
const handleBillingPortal = async () => {
  const res = await fetch("/api/billing/portal", {
    method: "POST",
  });
  const { url } = await res.json();
  window.location.href = url;
};
```

## Subscription Status

### Firestore Schema

Subscription data is stored in Firestore:

```typescript
// Collection: users/{userId}
{
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  subscriptionStatus: "active" | "canceled" | "past_due";
  subscriptionPlan: string;  // e.g., "pro"
  subscriptionPriceId: string;
  subscriptionCurrentPeriodEnd: Timestamp;
}
```

### Real-Time Updates

Use Firestore listeners for real-time subscription status:

```tsx
"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function useSubscription(userId: string) {
  const [subscription, setSubscription] = useState(null);
  
  useEffect(() => {
    if (!userId) return;
    
    const unsubscribe = onSnapshot(
      doc(db, "users", userId),
      (snapshot) => {
        setSubscription(snapshot.data());
      }
    );
    
    return unsubscribe;
  }, [userId]);
  
  return subscription;
}
```

## One-Time Payments

For one-off charges (not subscriptions):

```typescript
// Create one-time payment checkout
const session = await stripe.checkout.sessions.create({
  mode: "payment",  // One-time payment
  line_items: [
    {
      price: "price_one_time_product",
      quantity: 1,
    },
  ],
  success_url: `${origin}/success`,
  cancel_url: `${origin}/cancel`,
});
```

## Testing

### Test Cards

Use Stripe test cards:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires auth:** `4000 0025 0000 3155`

### Test Webhooks Locally

Use Stripe CLI:

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook secret to .env.local
# STRIPE_WEBHOOK_SECRET=whsec_...
```

## Best Practices

1. **Validate webhooks** - Always verify webhook signatures
2. **Idempotency** - Handle duplicate webhook events gracefully
3. **Error handling** - Log and handle payment failures
4. **User experience** - Provide clear success/error messages
5. **Security** - Never expose secret keys client-side

## Common Patterns

### Check Subscription Status

```typescript
import { getCurrentUserServer } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/admin";
import { doc, getDoc } from "firebase/firestore";

export async function hasActiveSubscription(userId: string) {
  const userDoc = await getDoc(doc(db, "users", userId));
  const data = userDoc.data();
  
  return data?.subscriptionStatus === "active";
}
```

### Cancel Subscription

```typescript
// Via Stripe API
await stripe.subscriptions.cancel(subscriptionId);

// Webhook will update Firestore automatically
```

## Troubleshooting

### Checkout not redirecting

- Verify Stripe keys are correct
- Check webhook endpoint is accessible
- Ensure redirect URLs are whitelisted in Stripe dashboard

### Webhooks not firing

- Verify webhook secret matches Stripe dashboard
- Check endpoint is publicly accessible
- Test with Stripe CLI locally

### Subscription not syncing

- Check webhook handler is processing events
- Verify Firestore write permissions
- Review server logs for errors

## Learn More

- [Stripe Setup](./stripe-setup) - Complete Stripe configuration
- [Stripe Subscriptions Tutorial](../tutorials/stripe-subscriptions) - Step-by-step guide
- [Webhooks](./webhooks) - Webhook handling details
- [ButtonCheckout Component](../components/ui/button-checkout) - Checkout button

