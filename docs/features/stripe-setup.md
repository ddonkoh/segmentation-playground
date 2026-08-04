# Stripe Setup

Complete guide to setting up Stripe for payments, subscriptions, and billing in ShipSafe.

## Overview

ShipSafe integrates Stripe to handle all payment processing, including one-time payments, recurring subscriptions, customer billing portal, and webhook events. This guide will walk you through the complete Stripe setup from account creation to production configuration.

**What you'll set up:**
- Stripe account and business information
- API keys (test and live)
- Products and pricing plans
- Webhook endpoints (local and production)
- Customer portal configuration
- Environment variables

## Prerequisites

- Email address for Stripe account
- Business information (for production)
- Node.js project set up
- Basic understanding of Stripe concepts

## Step 1: Create Stripe Account

### 1.1 Sign Up

1. Visit [stripe.com](https://stripe.com/)
2. Click **Sign in** or **Start now**
3. Enter your email address
4. Create a password
5. Click **Create account**

### 1.2 Complete Business Information

**For Development:**
- You can use test mode without full business details
- Test mode allows you to simulate payments

**For Production:**
1. Complete business information:
   - Business type (Individual, Company, Non-profit)
   - Business name and address
   - Tax information
   - Banking details for payouts

2. Verify your email address

3. Activate your account (may require additional verification)

**Note:** Production account activation can take a few days. Start with test mode for development.

## Step 2: Get API Keys

### 2.1 Access API Keys

1. Log into [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click **Developers** in the left sidebar
3. Click **API keys**

### 2.2 Copy Test Keys

You'll see two keys:

1. **Publishable key** (starts with `pk_test_`)
   - Safe to expose in client-side code
   - Used for Stripe.ts and checkout

2. **Secret key** (starts with `sk_test_`)
   - **Never expose** to client-side code
   - Used for server-side operations
   - Click **Reveal test key** to see it

### 2.3 Save Keys Securely

**Development:**
- Copy both keys to your `.env.local` file (see Step 6)

**Production:**
- Copy **Live keys** (switch toggle in Dashboard)
- Store in hosting platform environment variables
- Never commit to Git

**Important:** 
- Test keys start with `pk_test_` / `sk_test_`
- Live keys start with `pk_live_` / `sk_live_`
- Never mix test and live keys

## Step 3: Create Products & Prices

### 3.1 Create Your First Product

1. In Stripe Dashboard, click **Products** in the left sidebar
2. Click **Add product**

3. **Product Information:**
   - **Name**: Your plan name (e.g., "Starter Plan")
   - **Description**: Brief description (optional)
   - **Image**: Upload product image (optional)

4. **Pricing:**
   - **Price**: Enter amount (e.g., `99` for $99.00)
   - **Billing period**: 
     - **Recurring** → Monthly/Yearly subscription
     - **One time** → One-time payment
   - **Currency**: Select currency (USD, EUR, etc.)

5. Click **Save product**

6. **Copy Price ID:**
   - After saving, you'll see a **Price ID** (starts with `price_`)
   - Copy this ID - you'll need it for `config.ts`

### 3.2 Create Additional Plans

Repeat Step 3.1 for each pricing plan:
- Starter plan (e.g., $99/month)
- Pro plan (e.g., $199/month)
- Enterprise plan (optional)

**Tip:** Use descriptive names that match your `config.ts` plan names.

### 3.3 Note Price IDs

Keep track of your Price IDs:

```
Starter Plan: price_1234567890abcdef
Pro Plan: price_abcdef1234567890
Enterprise Plan: price_xyz789...
```

You'll add these to environment variables.

## Step 4: Configure Stripe Checkout

### 4.1 Branding (Optional but Recommended)

1. Go to **Settings** → **Branding**
2. Upload your logo
3. Set brand colors
4. Customize checkout appearance

This makes checkout match your brand.

### 4.2 Customer Portal

1. Go to **Settings** → **Customer Portal**
2. Click **Activate test link** or **Activate live link**
3. Configure portal settings:
   - Allow customers to update payment methods
   - Allow customers to cancel subscriptions
   - Set cancellation behavior

**Customer Portal:**
- Customers can manage subscriptions
- Update payment methods
- View invoices
- Cancel subscriptions (if enabled)

## Step 5: Set Up Webhooks

Webhooks allow Stripe to notify your app about payment events.

### 5.1 Local Development Setup

For local development, use Stripe CLI to forward webhooks:

**Install Stripe CLI:**

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:**
Download from [Stripe CLI releases](https://github.com/stripe/stripe-cli/releases)

**Linux:**
```bash
# Download and install
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_*_linux_x86_64.tar.gz
tar -xvf stripe_*_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

**Login:**
```bash
stripe login
```

This opens a browser to authorize the CLI.

**Forward Webhooks:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will:
- Display a webhook signing secret (starts with `whsec_`)
- Forward all Stripe events to your local server
- Show event logs in real-time

**Copy Webhook Secret:**
- Copy the webhook signing secret displayed
- Add to `.env.local` as `STRIPE_WEBHOOK_SECRET=whsec_...`

### 5.2 Production Webhook Setup

**Create Webhook Endpoint:**

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
4. **Description**: "ShipSafe Production Webhooks"

**Select Events:**

**Required for Subscriptions:**
- `checkout.session.completed` - Customer completed checkout (handles both subscription and one-time)
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription plan changed, status updated
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Subscription payment succeeded
- `invoice.payment_failed` - Subscription payment failed

**Optional for One-Time Payments:**
- `payment_intent.succeeded` - One-time payment succeeded (if you need separate handling)
- `payment_intent.payment_failed` - One-time payment failed (if you need separate handling)

**Note:** ShipSafe handles both subscription and one-time payments. The `checkout.session.completed` event works for both - the handler checks `session.mode` to determine payment type. For subscriptions, you need all the subscription events listed above.

**Get Signing Secret:**

1. After creating endpoint, click on it
2. Find **Signing secret** section
3. Click **Reveal** to see the secret (starts with `whsec_`)
4. Copy this secret
5. Add to production environment variables

**Test Webhook:**

1. Click **Send test webhook**
2. Select an event type
3. Verify your endpoint receives the event

## Step 6: Configure Environment Variables

### 6.1 Add Stripe Keys

Add to your `.env.local` file:

```bash
# Stripe API Keys (Test Mode for Development)
STRIPE_SECRET_KEY=sk_test_51...                    # From Step 2.2
STRIPE_PUBLIC_KEY=pk_test_51...                    # From Step 2.2

# Stripe Webhook Secret (Local Development)
STRIPE_WEBHOOK_SECRET=whsec_...                    # From Step 5.1

# Stripe Price IDs
STRIPE_PRICE_STARTER=price_1234567890abcdef        # From Step 3.3
STRIPE_PRICE_PRO=price_abcdef1234567890            # From Step 3.3
```

### 6.2 Production Variables

For production (in Vercel or your hosting platform):

```bash
# Stripe API Keys (Live Mode)
STRIPE_SECRET_KEY=sk_live_51...                    # Live secret key
STRIPE_PUBLIC_KEY=pk_live_51...                    # Live publishable key

# Stripe Webhook Secret (Production)
STRIPE_WEBHOOK_SECRET=whsec_...                    # From Step 5.2

# Stripe Price IDs (Same as test or create new live prices)
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
```

**Important:**
- Never mix test and live keys
- Use test keys for development
- Use live keys only in production
- Keep webhook secrets separate for local and production

## Step 7: Configure Plans in config.ts

### 7.1 Update Pricing Plans

Open `config.ts` and update the `stripe.plans` array:

```typescript
stripe: {
  plans: [
    {
      priceId: process.env.STRIPE_PRICE_STARTER || "",
      name: "Starter",
      description: "Perfect for getting started",
      price: 99,
      priceAnchor: 199, // Optional: original price to show crossed out
      isFeatured: false,
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
      ],
    },
    {
      priceId: process.env.STRIPE_PRICE_PRO || "",
      name: "Pro",
      description: "For power users",
      price: 199,
      isFeatured: true, // Highlights this plan
      features: [
        "Everything in Starter",
        "Advanced Feature 1",
        "Advanced Feature 2",
      ],
    },
  ],
}
```

### 7.2 Match Price IDs

Ensure `priceId` values match your Stripe Price IDs from Step 3.3.

## Step 8: Test Stripe Integration

### 8.1 Test Checkout Flow

1. Start your development server: `npm run dev`
2. Start Stripe webhook forwarding: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Visit your pricing page: `http://localhost:3000/pricing`
4. Click a checkout button
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

### 8.2 Verify Webhook Events

Check your Stripe CLI terminal to see webhook events being received.

### 8.3 Test Different Scenarios

**Test Cards:**

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`
- **Insufficient Funds**: `4000 0000 0000 9995`

**Test Payment Methods:**

- See [Stripe Test Cards](https://stripe.com/docs/testing) for more

### 8.4 Check Stripe Dashboard

1. Go to **Payments** in Stripe Dashboard
2. Verify test payments appear
3. Check customer information

## Troubleshooting

### Checkout Not Redirecting

**Issue:** Clicking checkout button doesn't work

**Solutions:**
1. **Check API keys** - Verify keys are correct in `.env.local`
2. **Restart server** - Environment variables only load on startup
3. **Check console** - Look for errors in browser console
4. **Verify price ID** - Ensure price ID exists in Stripe

### Webhooks Not Receiving Events

**Issue:** Webhook events not arriving

**Solutions:**
1. **Check CLI is running** - `stripe listen` must be active
2. **Verify endpoint URL** - Must match your API route
3. **Check webhook secret** - Must match the one from CLI
4. **Test endpoint** - Manually trigger a test webhook

### Payment Fails

**Issue:** Payments are declined

**Solutions:**
1. **Use test cards** - Only test cards work in test mode
2. **Check card details** - Verify expiry date is in future
3. **Check Stripe logs** - View payment details in Dashboard
4. **Verify API keys** - Ensure using test keys in development

### Webhook Signature Verification Fails

**Issue:** Webhook events rejected

**Solutions:**
1. **Check webhook secret** - Must match Stripe Dashboard or CLI
2. **Verify raw body** - API route must use raw body for verification
3. **Check headers** - Stripe signature header must be present
4. **Test signature** - Use Stripe CLI test events

## Production Checklist

Before going live:

- [ ] Stripe account activated and verified
- [ ] Live API keys obtained and configured
- [ ] Production webhook endpoint created
- [ ] Webhook signing secret added to production env vars
- [ ] Products and prices created in live mode
- [ ] `config.ts` updated with live price IDs
- [ ] Customer portal activated
- [ ] Branding configured (logo, colors)
- [ ] Test payments processed successfully
- [ ] Webhook events verified in production
- [ ] Error handling tested

## Best Practices

1. **Separate Accounts** - Use different Stripe accounts for test and production
2. **Test Thoroughly** - Test all payment scenarios before production
3. **Monitor Webhooks** - Set up alerts for failed webhook deliveries
4. **Handle Failures** - Implement retry logic for failed payments
5. **Secure Keys** - Never expose secret keys in client-side code
6. **Log Events** - Log all Stripe events for debugging

## Testing Checklist

Before production:

- [ ] Test successful payment
- [ ] Test declined payment
- [ ] Test subscription creation
- [ ] Test subscription cancellation
- [ ] Test payment method update
- [ ] Test webhook event handling
- [ ] Test customer portal access
- [ ] Test invoice generation

## Next Steps

Now that Stripe is set up:

1. **[Billing Features](./billing)** - Learn billing functionality
2. **[Stripe Subscriptions Tutorial](../tutorials/stripe-subscriptions)** - Build subscription flow
3. **[Webhooks](./webhooks)** - Handle webhook events
4. **[ButtonCheckout Component](../components/ui/button-checkout)** - Use checkout button

## Learn More

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Billing Features](./billing)
- [Webhooks](./webhooks)
