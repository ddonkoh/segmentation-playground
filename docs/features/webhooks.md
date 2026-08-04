# Webhooks

Stripe webhook integration for handling subscription lifecycle events and syncing data to Firestore.

## Overview

ShipSafe uses Stripe webhooks to keep subscription data synchronized between Stripe and Firestore. When events occur in Stripe (subscription created, payment failed, etc.), Stripe sends webhook events to your server, which then updates Firestore and user custom claims accordingly.

**Key Features:**
- **Signature verification** - All webhooks are verified using Stripe signatures
- **Event routing** - Automatic routing to appropriate event handlers
- **Firestore sync** - Subscription data automatically synced to Firestore
- **User role updates** - Custom claims updated based on subscription status
- **Idempotent processing** - Handles duplicate events safely

## Architecture

### Webhook Flow

```
Stripe Event → Webhook → Signature Verification → Event Handler → Firestore Update
```

1. **Stripe event occurs** (e.g., subscription created)
2. **Stripe sends webhook** to `/api/webhooks/stripe`
3. **Signature verified** - Ensures request is from Stripe
4. **Event routed** - Based on event type to appropriate handler
5. **Firestore updated** - Subscription data synced
6. **User claims updated** - Role/permissions updated

## Setup

### 1. Configure Webhook Endpoint in Stripe

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. **Select events to listen for:**

   **For Subscriptions (Required):**
   - `checkout.session.completed` - Customer completed checkout (subscription or one-time)
   - `customer.subscription.created` - New subscription created
   - `customer.subscription.updated` - Subscription plan changed, status updated
   - `customer.subscription.deleted` - Subscription canceled
   - `invoice.payment_succeeded` - Subscription payment succeeded
   - `invoice.payment_failed` - Subscription payment failed

   **For One-Time Payments (Optional):**
   - `checkout.session.completed` - Also handles one-time payments (check `session.mode`)
   - `payment_intent.succeeded` - One-time payment succeeded (optional)
   - `payment_intent.payment_failed` - One-time payment failed (optional)

   **Note:** `checkout.session.completed` handles both subscription and one-time payments. The handler checks `session.mode` to determine the payment type.

5. Copy the webhook signing secret

### 2. Add Webhook Secret to Environment

Add to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Important:** Different secrets for development and production:
- **Development:** Use Stripe CLI secret (`stripe listen`)
- **Production:** Use webhook endpoint secret from Stripe Dashboard

### 3. Local Testing with Stripe CLI

Install Stripe CLI and forward webhooks:

```bash
# Install Stripe CLI (if not installed)
# macOS: brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will output a webhook secret (starts with `whsec_`). Add it to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## Webhook Events

### Required Events by Payment Type

**For Subscriptions (Recurring Billing):**
ShipSafe requires these events for full subscription lifecycle management:

| Event | Handler | Action |
|-------|---------|--------|
| `checkout.session.completed` | `handleCheckoutSessionCompleted` | Links Stripe customer to Firebase user (works for both subscription and one-time) |
| `customer.subscription.created` | `handleSubscriptionCreated` | Creates subscription in Firestore, updates user role |
| `customer.subscription.updated` | `handleSubscriptionUpdated` | Updates subscription in Firestore, updates user role |
| `customer.subscription.deleted` | `handleSubscriptionDeleted` | Marks subscription as canceled, removes premium role |
| `invoice.payment_succeeded` | `handleInvoicePaymentSucceeded` | Logs payment success (subscription already synced) |
| `invoice.payment_failed` | `handleInvoicePaymentFailed` | Logs payment failure (status updated by subscription.updated) |

**For One-Time Payments:**
Only `checkout.session.completed` is required. The handler checks `session.mode` to determine if it's a subscription or one-time payment.

**Important:** If you're using subscriptions, you **must** configure all subscription events in Stripe Dashboard. Missing events will cause subscription data to be out of sync.

### Event Flow

**Subscription Flow:**
1. User completes checkout → `checkout.session.completed`
2. Stripe creates subscription → `customer.subscription.created`
3. Payment processed → `invoice.payment_succeeded`
4. Subscription updates → `customer.subscription.updated`
5. User cancels → `customer.subscription.deleted`

**One-Time Payment Flow:**
1. User completes checkout → `checkout.session.completed` (handler checks `session.mode === "payment"`)

## Implementation

### Webhook Endpoint

**Location:** `src/app/api/webhooks/stripe/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { parseWebhookEvent } from "@/lib/stripe/webhook";
import { handleWebhookEvent } from "@/features/billing/webhook";

export async function POST(req: NextRequest) {
  try {
    // Parse and verify webhook event (signature verification)
    const event = await parseWebhookEvent(req);

    // Handle webhook event
    const result = await handleWebhookEvent(event);

    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message },
        { status: 200 }
      );
    } else {
      // Log error but return 200 (prevents Stripe retries)
      console.error("Webhook handling failed:", result.message);
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 200 }
      );
    }
  } catch (error) {
    // Signature verification failed - return 400
    if (error instanceof Error && error.message.includes("verification")) {
      return NextResponse.json(
        { error: "Webhook verification failed" },
        { status: 400 }
      );
    }

    // Other errors - return 200 (prevents Stripe retries)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 200 }
    );
  }
}
```

### Signature Verification

**Location:** `src/lib/stripe/webhook.ts`

The webhook handler automatically:
1. **Extracts raw body** - Required for signature verification
2. **Gets signature** - From `stripe-signature` header
3. **Verifies signature** - Using Stripe SDK and webhook secret
4. **Returns event** - Parsed and type-safe event object

**Critical:** Raw body is required. Next.js App Router handles this automatically.

### Event Handlers

**Location:** `src/features/billing/webhook.ts`

Each event type has a dedicated handler:

```typescript
// Example: Subscription created handler
export async function handleSubscriptionCreated(
  event: ParsedWebhookEvent
): Promise<WebhookHandlerResult> {
  const subscription = event.data.object as Stripe.Subscription;
  
  // Extract Firebase UID from metadata
  const firebaseUid = subscription.metadata?.firebase_uid;
  
  // Create subscription in Firestore
  await updateSubscriptionInFirestore(subscriptionData);
  
  // Update user role (premium access)
  await updateUserRoleFromSubscription(firebaseUid, status);
  
  return { success: true, message: "Subscription synced" };
}
```

## Customization

### Add New Event Handler

1. **Add event type** to `src/lib/stripe/webhook.ts`:

```typescript
export type StripeWebhookEventType =
  | "checkout.session.completed"
  | "customer.subscription.created"
  // ... existing types
  | "customer.updated"; // Add new event type
```

2. **Create handler function** in `src/features/billing/webhook.ts`:

```typescript
export async function handleCustomerUpdated(
  event: ParsedWebhookEvent
): Promise<WebhookHandlerResult> {
  const customer = event.data.object as Stripe.Customer;
  
  // Your custom logic here
  // e.g., update customer email in Firestore
  
  return { success: true, message: "Customer updated" };
}
```

3. **Add to router** in `handleWebhookEvent`:

```typescript
switch (event.type) {
  // ... existing cases
  case "customer.updated":
    return await handleCustomerUpdated(event);
}
```

### Customize Subscription Sync

Edit handlers in `src/features/billing/webhook.ts` to add custom logic:

```typescript
export async function handleSubscriptionCreated(
  event: ParsedWebhookEvent
): Promise<WebhookHandlerResult> {
  // ... existing code
  
  // Add custom logic
  await sendWelcomeEmail(firebaseUid);
  await createUserWorkspace(firebaseUid);
  
  return { success: true, message: "Subscription created" };
}
```

## Security

### Signature Verification

**Critical:** Always verify webhook signatures. The `parseWebhookEvent` function does this automatically:

```typescript
// This verifies signature automatically
const event = await parseWebhookEvent(req);
```

**Why it's important:**
- Prevents attackers from sending fake webhook events
- Ensures requests are from Stripe
- Protects against replay attacks

### Raw Body Requirement

Stripe signature verification requires the raw request body (as bytes), not parsed JSON. Next.js App Router provides this automatically, but ensure your route config allows raw body:

```typescript
// Next.js automatically handles raw body for POST requests
export async function POST(req: NextRequest) {
  // parseWebhookEvent handles raw body extraction
  const event = await parseWebhookEvent(req);
}
```

### Error Handling

Webhook handlers should:
- **Return 200** for processing errors (prevents Stripe retries)
- **Return 400** for signature verification failures
- **Log errors** for debugging
- **Be idempotent** (handle duplicate events safely)

## Testing

### Local Testing with Stripe CLI

```bash
# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed
```

### Testing Individual Events

```bash
# Test subscription created
stripe trigger customer.subscription.created

# Test payment failed
stripe trigger invoice.payment_failed

# Test subscription updated
stripe trigger customer.subscription.updated
```

### Viewing Webhook Logs

1. **Stripe Dashboard** - View webhook delivery logs
2. **Server logs** - Check console for webhook processing logs
3. **Stripe CLI** - See events in real-time: `stripe listen`

## Troubleshooting

### Webhook Not Received

1. **Check webhook endpoint** - Verify URL is correct in Stripe Dashboard
2. **Check server logs** - Look for webhook delivery attempts
3. **Test locally** - Use Stripe CLI to test webhook delivery
4. **Verify secret** - Ensure `STRIPE_WEBHOOK_SECRET` is correct

### Signature Verification Failed

1. **Check webhook secret** - Must match the secret from Stripe
2. **Verify raw body** - Next.js should handle this automatically
3. **Check headers** - Ensure `stripe-signature` header is present
4. **Test mode** - Use test mode secret, not live mode secret

### Event Not Processed

1. **Check event type** - Verify event type is in the switch statement
2. **Check handler logic** - Look for errors in handler function
3. **Check Firestore** - Verify subscription was created/updated
4. **Check user claims** - Verify user role was updated

## Best Practices

1. **Always verify signatures** - Never process webhooks without verification
2. **Idempotent handlers** - Handle duplicate events gracefully
3. **Error logging** - Log all errors for debugging
4. **Return 200 for errors** - Prevents Stripe from retrying (unless you want retries)
5. **Test thoroughly** - Use Stripe CLI to test all event types
6. **Monitor webhook logs** - Check Stripe Dashboard for delivery issues

## Learn More

- [Stripe Setup](./stripe-setup) - Complete Stripe configuration
- [Billing Features](./billing) - Billing and subscription management
- [Database Features](./database) - Firestore integration
- [Webhook Events Documentation](https://stripe.com/docs/api/events/types)
