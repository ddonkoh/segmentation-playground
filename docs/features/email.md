# Email

Email functionality for transactional emails, password resets, and notifications.

## Overview

ShipSafe uses **Resend natively** for all email sending. Resend is integrated directly into the boilerplate, providing a modern, developer-friendly email API for transactional emails.

**Key Features:**
- **Native Resend integration** - Built-in email service
- **Email templates** - Pre-built templates (welcome, reset, invite)
- **Type-safe API** - Full TypeScript support
- **Email enumeration prevention** - Security best practices
- **Server-side only** - Secure email sending

## Current Implementation

### Resend Email Service

ShipSafe uses Resend natively for all email sending. The email service is located in `src/lib/email/`.

**File Structure:**

The email service is organized as follows:

**`src/lib/email/`**
- `send_email.ts` - Main email sending function
- `templates/` - Email template components
  - `welcome.tsx` - Welcome email template
  - `reset.tsx` - Password reset template
  - `invite.tsx` - Invitation email template
  - `index.ts` - Template exports

**Main File:** `src/lib/email/send_email.ts`

```typescript
import { sendEmail } from "@/lib/email/send_email";

// Send email
const result = await sendEmail({
  to: "user@example.com",
  subject: "Welcome!",
  html: "<h1>Welcome!</h1>",
  text: "Welcome!",
});
```

## Setup

### Install Resend

First, install the Resend package:

```bash
npm install resend
```

### Get Resend API Key

1. **Sign up for Resend** - Go to [resend.com](https://resend.com)
2. **Create API key** - Navigate to API Keys section
3. **Copy your API key** - It starts with `re_`

### Environment Variables

Add your Resend API key to `.env.local`:

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Domain for email links (optional, uses config.ts by default)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Note:** The `from` email address will default to `ShipSafe <no-reply@${config.domainName}>` but can be customized.

## API Integration

### Password Reset Endpoint

**Location:** `src/app/api/auth/reset/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetSchema } from "@/features/auth/schema";
import { sendPasswordResetEmail } from "@/features/auth/send-reset";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendPasswordResetSchema.parse(body);
    
    // Send password reset email
    const result = await sendPasswordResetEmail(parsed.email);
    
    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    // Error handling...
  }
}
```

## Security

### Email Enumeration Prevention

**Important:** Always return the same success message regardless of whether the email exists. This prevents attackers from discovering valid email addresses.

```typescript
// ✅ Good: Always returns same message
return {
  success: true,
  message: "If an account exists, a password reset email has been sent.",
};

// ❌ Bad: Reveals if email exists
if (!userExists) {
  return { error: "Email not found" }; // DON'T DO THIS
}
```

### Rate Limiting

Password reset endpoints should be rate-limited to prevent abuse:

```typescript
// Middleware applies rate limiting automatically
// See: src/lib/security/rate_limit.ts
```

## Using Email Templates

ShipSafe includes pre-built email templates that you can use:

### Available Templates

**Location:** `src/lib/email/templates/`

- **welcome.tsx** - Welcome email for new signups
- **reset.tsx** - Password reset email
- **invite.tsx** - User invitation email

### Using Templates

```typescript
import { sendEmailWithTemplate } from "@/lib/email/send_email";
import { welcomeEmailTemplate } from "@/lib/email/templates";

// Send welcome email
const result = await sendEmailWithTemplate(
  welcomeEmailTemplate,
  "user@example.com",
  { userName: "John", dashboardUrl: "https://yourdomain.com/dashboard" }
);
```

### Template Functions

All templates return `{ subject, html, text }`:

```typescript
// Welcome email
welcomeEmailTemplate({ userName: "John", dashboardUrl?: string })

// Password reset
resetEmailTemplate({ resetLink: string, userName?: string })

// Invitation
inviteEmailTemplate({ 
  inviterName: string, 
  inviteLink: string, 
  customMessage?: string,
  roleOrTeam?: string 
})
```

## Common Use Cases

### Welcome Email

```typescript
import { sendEmailWithTemplate } from "@/lib/email/send_email";
import { welcomeEmailTemplate } from "@/lib/email/templates";

async function sendWelcomeEmail(user: User) {
  const result = await sendEmailWithTemplate(
    welcomeEmailTemplate,
    user.email,
    {
      userName: user.displayName || "User",
      dashboardUrl: `https://${config.domainName}/dashboard`,
    }
  );

  if (!result.success) {
    console.error("Failed to send welcome email:", result.error);
  }
}
```

### Password Reset Email

```typescript
import { sendEmailWithTemplate } from "@/lib/email/send_email";
import { resetEmailTemplate } from "@/lib/email/templates";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/init";

async function sendPasswordResetEmail(email: string) {
  // Generate reset link
  const adminAuth = getAuth(getAdminApp());
  const resetLink = await adminAuth.generatePasswordResetLink(email, {
    url: `https://${config.domainName}/auth/reset?oobCode=`,
    handleCodeInApp: false,
  });

  // Send email via Resend
  const result = await sendEmailWithTemplate(
    resetEmailTemplate,
    email,
    { resetLink }
  );

  return {
    success: result.success,
    message: "If an account exists, a password reset email has been sent.",
  };
}
```

### Notification Emails

```typescript
async function sendNotificationEmail(user: User, message: string) {
  await sendEmail({
    to: user.email,
    subject: "New Notification",
    html: `<p>${message}</p>`,
  });
}
```

### Subscription Updates

```typescript
async function sendSubscriptionConfirmationEmail(user: User, plan: string) {
  await sendEmail({
    to: user.email,
    subject: "Subscription Confirmed",
    html: `
      <h1>Subscription Confirmed</h1>
      <p>Your ${plan} subscription is now active.</p>
    `,
  });
}
```

## Email Service

### Resend (Native Integration)

ShipSafe uses **Resend natively** - it's already integrated and ready to use.

**Why Resend:**
- ✅ Simple, modern API
- ✅ Excellent developer experience
- ✅ Reasonable pricing (free tier available)
- ✅ Great deliverability
- ✅ Built-in analytics

**Already Set Up:**
- ✅ Resend client initialized in `src/lib/email/send_email.ts`
- ✅ Email templates ready to use
- ✅ Type-safe API with TypeScript
- ✅ Error handling built-in

### SendGrid

**Pros:**
- Enterprise features
- High deliverability
- Analytics dashboard

**Setup:**
```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
```

## Best Practices

1. **Email enumeration prevention** - Always return same message
2. **Rate limiting** - Limit email sending per user/IP
3. **Email validation** - Validate email format before sending
4. **Error handling** - Handle email service failures gracefully
5. **Templates** - Use templates for consistent branding
6. **Unsubscribe** - Include unsubscribe links for marketing emails
7. **Testing** - Use email testing services in development
8. **Logging** - Log email sends for debugging

## Testing

### Development

Use email testing services:
- **Mailtrap** - Test email server
- **MailHog** - Local email testing
- **Ethereal Email** - Temporary email addresses

### Testing Email Sends

```typescript
// In development, log emails instead of sending
if (process.env.NODE_ENV === "development") {
  console.log("Email would be sent:", { to, subject });
  return;
}

// Production: actually send email
await sendEmail({ to, subject, html });
```

## Troubleshooting

### Email Not Received

1. **Check spam folder** - Emails may be filtered
2. **Verify email service** - Check service status
3. **Check API key** - Ensure API key is valid
4. **Verify sender email** - Must be verified in email service
5. **Check logs** - Review server logs for errors

### Firebase Auth Email Issues

1. **Check Firebase Console** - Verify email template is configured
2. **Verify domain** - Ensure domain is authorized
3. **Check action URL** - Verify redirect URL is correct
4. **Review Firebase logs** - Check for email delivery issues

## Learn More

- [Firebase Auth Email Templates](https://firebase.google.com/docs/auth/custom-email-handler)
- [Authentication Features](./authentication) - Auth and password reset
- [Environment Variables](./environment-variables) - Email service configuration
