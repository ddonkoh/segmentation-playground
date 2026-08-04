# Email Templates

Complete guide to customizing and creating email templates in ShipSafe.

## Overview

ShipSafe supports email functionality through Firebase Authentication (for password resets) and can be extended with custom email services. This guide covers how to customize email templates and create your own transactional emails.

**What you'll learn:**
- Customizing Firebase Auth email templates
- Creating custom email templates
- Email template best practices
- Using Resend for transactional emails
- Email template examples

---

## Firebase Auth Email Templates

### Password Reset Emails

ShipSafe uses Firebase Authentication for password reset emails. These templates can be customized in the Firebase Console.

**Current implementation:**

```typescript
// src/features/auth/send-reset.ts
export async function sendPasswordResetEmail(
  email: string
): Promise<SendPasswordResetResult> {
  try {
    const adminAuth = getAuth(getAdminApp());

    // Check if user exists first
    let userExists = false;
    try {
      await adminAuth.getUserByEmail(email);
      userExists = true;
    } catch (error) {
      // User not found - but we'll still return success (prevent email enumeration)
      userExists = false;
    }

    if (userExists) {
      // Generate password reset link with action code settings
      // This generates a link that can be used in a custom email
      // For automatic email sending, use Firebase Auth client SDK's sendPasswordResetEmail()
      const resetLink = await adminAuth.generatePasswordResetLink(email, {
        url: config.domainName
          ? `https://${config.domainName}/auth/reset?oobCode=`
          : `${process.env.NEXT_PUBLIC_APP_URL || ""}/auth/reset?oobCode=`,
        handleCodeInApp: false,
      });

      // NOTE: generatePasswordResetLink() does NOT automatically send emails.
      // For automatic email sending, you have two options:
      //
      // Option 1: Use Firebase Auth client SDK (recommended for simplicity)
      //   import { sendPasswordResetEmail } from "firebase/auth";
      //   await sendPasswordResetEmail(auth, email);
      //
      // Option 2: Send custom email with the generated link
      //   Use your email service (Resend, etc.) to send email
      //   Include the resetLink in your email template
      //
      // For ShipSafe, we use Resend for custom email sending.
    }
  } catch (error) {
    // Error handling...
  }
}
```

### Customizing Firebase Templates

**Steps:**

1. **Go to Firebase Console:**
   - Navigate to Authentication > Templates
   - Select "Password reset" template

2. **Customize template:**
   - **Subject line:** Customize email subject
   - **Body:** HTML email body with your branding
   - **Action URL:** Set redirect URL after password reset

3. **Use variables:**
   - `%LINK%` - Password reset link
   - `%EMAIL%` - User's email address
   - `%DISPLAY_NAME%` - User's display name (if available)

**Example Firebase template:**

```html
<h1>Reset Your Password</h1>
<p>Hello %DISPLAY_NAME%,</p>
<p>Click the link below to reset your password:</p>
<p><a href="%LINK%">Reset Password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this, please ignore this email.</p>
```

**Action URL format:**
```
https://yourdomain.com/auth/reset?oobCode=
```

---

## Custom Email Templates

### Setting Up Email Service

To send custom emails, ShipSafe uses **Resend** natively. Resend is already integrated and configured.

**See:** [Email Features Documentation](../features/email) for complete setup instructions.

### Template Structure

ShipSafe includes pre-built email templates in `src/lib/email/templates/`:

- `welcome.tsx` - Welcome email for new users
- `reset.tsx` - Password reset email
- `invite.tsx` - User invitation email

**Template Pattern:**

All templates follow this pattern:

```typescript
// src/lib/email/templates/example.tsx
export interface ExampleEmailData {
  userName: string;
  // ... other data fields
}

export function exampleEmailTemplate(
  data: ExampleEmailData
): { subject: string; html: string; text: string } {
  const { userName } = data;
  
  return {
    subject: `Example Email`,
    html: `<!DOCTYPE html>...`, // HTML content
    text: `Plain text version...`, // Plain text version
  };
}
```

**Available Templates:**

- `welcomeEmailTemplate(data: WelcomeEmailData)` - Welcome new users
- `resetEmailTemplate(data: ResetEmailData)` - Password reset
- `inviteEmailTemplate(data: InviteEmailData)` - User invitations

**See:** `src/lib/email/templates/` for complete template implementations.

### Using Templates

**Example: Send welcome email**

```typescript
// src/features/user/send-welcome.ts
import { sendEmailWithTemplate } from "@/lib/email/send_email";
import { welcomeEmailTemplate } from "@/lib/email/templates/welcome";
import config from "@/config";

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  await sendEmailWithTemplate(
    welcomeEmailTemplate,
    userEmail,
    {
      userName,
      appName: config.appName,
      dashboardUrl: `https://${config.domainName}/dashboard`,
    }
  );
}
```

**Example: Custom password reset**

```typescript
// src/features/auth/send-reset-custom.ts
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/init";
import { sendEmailWithTemplate } from "@/lib/email/send_email";
import { resetEmailTemplate } from "@/lib/email/templates/reset";
import config from "@/config";

export async function sendCustomPasswordResetEmail(email: string) {
  const adminAuth = getAuth(getAdminApp());
  
  // Generate reset link
  const resetLink = await adminAuth.generatePasswordResetLink(email, {
    url: `https://${config.domainName}/auth/reset?oobCode=`,
    handleCodeInApp: false,
  });
  
  // Send custom email using template
  await sendEmailWithTemplate(
    resetEmailTemplate,
    email,
    {
      resetLink,
      appName: config.appName,
    }
  );
}
```

---

## Email Template Best Practices

### 1. Responsive Design

Emails should work on mobile devices:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  @media only screen and (max-width: 600px) {
    .container {
      width: 100% !important;
      padding: 10px !important;
    }
  }
</style>
```

### 2. Inline Styles

Many email clients don't support external stylesheets. Use inline styles:

```html
<!-- ✅ Good: Inline styles -->
<p style="color: #333; font-size: 16px;">Text</p>

<!-- ❌ Bad: External stylesheet -->
<link rel="stylesheet" href="styles.css">
```

### 3. Clear Call-to-Actions

Make buttons and links prominent:

```html
<a href="https://yourdomain.com/action" 
   style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
  Take Action
</a>
```

### 4. Plain Text Alternative

Always include a plain text version:

```typescript
{
  html: "<h1>Welcome</h1>",
  text: "Welcome\n\nThanks for signing up!", // Plain text version
}
```

### 5. Branding Consistency

Use your brand colors and logo:

```html
<div style="text-align: center;">
  <img src="https://yourdomain.com/logo.png" alt="Your App" style="max-width: 200px;">
</div>
```

### 6. Unsubscribe Links

For marketing emails, include unsubscribe:

```html
<p style="font-size: 12px; color: #666;">
  <a href="https://yourdomain.com/unsubscribe?token=TOKEN">Unsubscribe</a>
</p>
```

---

## Common Email Templates

### Welcome Email

```typescript
export function welcomeEmailTemplate(userName: string, appName: string): EmailTemplate {
  return {
    subject: `Welcome to ${appName}!`,
    html: `...`, // HTML template
    text: `...`, // Plain text
  };
}
```

### Password Reset

```typescript
export function passwordResetTemplate(resetLink: string, appName: string): EmailTemplate {
  return {
    subject: `Reset Your ${appName} Password`,
    html: `...`,
    text: `...`,
  };
}
```

### Subscription Confirmation

```typescript
export function subscriptionConfirmationTemplate(
  planName: string,
  appName: string
): EmailTemplate {
  return {
    subject: `Your ${planName} Subscription is Active`,
    html: `...`,
    text: `...`,
  };
}
```

### Payment Receipt

```typescript
export function paymentReceiptTemplate(
  amount: number,
  planName: string,
  appName: string
): EmailTemplate {
  return {
    subject: `Payment Receipt from ${appName}`,
    html: `...`,
    text: `...`,
  };
}
```

### Account Verification

```typescript
export function verificationEmailTemplate(
  verificationLink: string,
  appName: string
): EmailTemplate {
  return {
    subject: `Verify Your ${appName} Account`,
    html: `...`,
    text: `...`,
  };
}
```

---

## Testing Email Templates

### Development Testing

**Option 1: Log emails in development**

```typescript
// src/lib/email.ts
export async function sendEmail({ to, subject, html, text }: EmailParams) {
  if (process.env.NODE_ENV === "development") {
    console.log("📧 Email would be sent:");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("HTML:", html);
    console.log("Text:", text);
    return { id: "dev-email-id" };
  }
  
  // Production: actually send email
  // ...
}
```

**Option 2: Use email testing service**

- **Mailtrap** - Test email server
- **MailHog** - Local email testing
- **Ethereal Email** - Temporary email addresses

### Preview Templates

Create a preview page to test templates:

```typescript
// src/app/admin/email-preview/page.tsx (development only)
"use client";

import { welcomeEmailTemplate } from "@/lib/email/templates";

export default function EmailPreviewPage() {
  const template = welcomeEmailTemplate("John Doe", "ShipSafe");
  
  return (
    <div>
      <h1>Email Preview</h1>
      <div dangerouslySetInnerHTML={{ __html: template.html }} />
    </div>
  );
}
```

---

## Security Considerations

### 1. Email Enumeration Prevention

Always return the same message regardless of email existence:

```typescript
// ✅ Good
return {
  success: true,
  message: "If an account exists, a password reset email has been sent.",
};

// ❌ Bad - reveals if email exists
if (!userExists) {
  return { error: "Email not found" };
}
```

### 2. Rate Limiting

Limit email sending per user/IP:

```typescript
// Middleware applies rate limiting automatically
// See: src/lib/security/rate_limit.ts
```

### 3. Link Expiration

Set expiration times for sensitive links:

```typescript
// Password reset links expire after 1 hour
const resetLink = await adminAuth.generatePasswordResetLink(email, {
  url: `https://${config.domainName}/auth/reset?oobCode=`,
  handleCodeInApp: false,
});
```

---

## Learn More

- [Email Features](../features/email) - Complete email functionality guide
- [Authentication Features](../features/authentication) - Password reset implementation
- [Branding Guide](./branding) - Logo and visual identity
- [Configuration Guide](../get-started/configuration) - App configuration

---

**Next Steps:**
1. Set up Resend (see [Email Documentation](../features/email))
2. Create email template functions
3. Integrate templates into your features
4. Test emails in development
5. Customize Firebase Auth templates in Firebase Console
