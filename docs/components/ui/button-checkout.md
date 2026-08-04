# ButtonCheckout

Opens a Stripe Checkout session. Perfect for one-time payments or subscriptions.

**Location:** `src/components/ui/ButtonCheckout.tsx`

## Description

This component creates a Stripe Checkout session when clicked. It calls the `/api/checkout` endpoint with the price ID, handles loading states, and redirects users to Stripe's hosted checkout page. Works for both authenticated and unauthenticated users.

## Usage

```tsx
import ButtonCheckout from "@/components/ui/ButtonCheckout";

<ButtonCheckout priceId={plan.priceId} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `priceId` | `string` | - | Stripe price ID (required) |
| `className` | `string` | `""` | Additional CSS classes |

## Features

- **Automatic checkout session creation** - Handles Stripe session creation
- **Loading state** - Shows spinner while processing
- **Works for guests** - Authentication optional (like ShipFast)
- **Error handling** - Shows user-friendly error messages
- **Logo integration** - Includes ShipSafe logo in button

## How It Works

1. User clicks the button
2. Component calls `/api/checkout` with `priceId`
3. Server creates Stripe checkout session
4. User is redirected to Stripe's hosted checkout page
5. After payment, user is redirected back to your app

## Examples

### Basic Usage

```tsx
import ButtonCheckout from "@/components/ui/ButtonCheckout";

<ButtonCheckout priceId={plan.priceId} />
```

### In Pricing Component

```tsx
// Full-width button in pricing card
<ButtonCheckout priceId={plan.priceId} className="btn-block" />
```

### In CTA Section

```tsx
// Large button with gradient styling
<ButtonCheckout 
  priceId={featuredPlan.priceId} 
  className="btn-lg normal-case px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none text-primary-content font-medium" 
/>
```

## Authentication

By default, the button works for both authenticated and unauthenticated users:

- **Authenticated users**: Email pre-filled in checkout
- **Unauthenticated users**: Stripe collects email during checkout

To require authentication, modify `/api/checkout/route.ts` to use `requireAuth()` instead of `getCurrentUserServer()`.

## Error Handling

If checkout fails, the component:
- Logs the error to console
- Shows an alert with error message
- Button remains clickable for retry

## Tips

- Always pass a valid Stripe price ID
- Use `btn-block` for full-width buttons in pricing cards
- Use gradient styling for prominent CTAs
- Button automatically uses logo icon from `/logo_w.png`
- Test with Stripe test cards: `4242 4242 4242 4242`

## Customization

The button uses the ShipSafe logo by default. To customize:
1. Update the `Image` component in `ButtonCheckout.tsx`
2. Change button text from "Get ShipSafe" to your app name
3. Modify styling via `className` prop

## Learn More

- [Button](./button) - Base button component
- [Stripe Setup](../../features/stripe-setup) - Configure Stripe
- [Billing Features](../../features/billing) - Billing documentation
- [Stripe Subscriptions Tutorial](../../tutorials/stripe-subscriptions)

