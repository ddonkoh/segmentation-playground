/**
 * -----------------------------------------------------------------------------
 * ShipSafe Email — send_email.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Native Resend email sending functionality.
 *   Provides a centralized email service for transactional emails.
 *
 * Why this exists:
 *   ShipSafe uses Resend natively for all email sending:
 *     - Welcome emails
 *     - Password reset emails
 *     - Invitation emails
 *     - Transactional notifications
 *
 * Security:
 *   - Server-side only (never expose in client)
 *   - API key stored in environment variables
 *   - Email enumeration prevention
 *   - Rate limiting should be applied in API routes
 *
 * Used by:
 *   - API routes (/api/auth/*)
 *   - Feature functions (auth, billing, etc.)
 *
 * -----------------------------------------------------------------------------
 * SETUP REQUIRED:
 *   1. Install Resend: npm install resend
 *   2. Get API key from https://resend.com
 *   3. Add RESEND_API_KEY to .env.local
 * -----------------------------------------------------------------------------
 */

import { Resend } from "resend";
import config from "@/config";

// -----------------------------------------------------------------------------
// 1. Server-side guard
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  throw new Error(
    "❌ Email functions cannot be used in client-side code. " +
      "Email sending must be done server-side only."
  );
}

// -----------------------------------------------------------------------------
// 2. Initialize Resend Client
// -----------------------------------------------------------------------------

/**
 * Resend client instance.
 * Initialized with API key from environment variables.
 */
const resend = new Resend(process.env.RESEND_API_KEY);

// -----------------------------------------------------------------------------
// 3. Email Types
// -----------------------------------------------------------------------------

/**
 * Email sending options.
 */
export interface SendEmailOptions {
  /**
   * Recipient email address
   */
  to: string;

  /**
   * Email subject line
   */
  subject: string;

  /**
   * HTML email content
   */
  html: string;

  /**
   * Plain text email content (optional, recommended)
   */
  text?: string;

  /**
   * From email address (optional, defaults to config)
   */
  from?: string;

  /**
   * Reply-to email address (optional)
   */
  replyTo?: string;
}

/**
 * Result of email sending operation.
 */
export interface SendEmailResult {
  /**
   * Whether email was sent successfully
   */
  success: boolean;

  /**
   * Resend email ID (if successful)
   */
  id?: string;

  /**
   * Error message (if failed)
   */
  error?: string;
}

// -----------------------------------------------------------------------------
// 4. Send Email Function
// -----------------------------------------------------------------------------

/**
 * sendEmail() — sends email using Resend.
 *
 * This function:
 *   1. Validates email options
 *   2. Sends email via Resend API
 *   3. Returns success/error result
 *
 * @param options - Email sending options
 * @returns Send email result
 * @throws Error if email sending fails
 *
 * @example
 * ```typescript
 * const result = await sendEmail({
 *   to: "user@example.com",
 *   subject: "Welcome!",
 *   html: "<h1>Welcome!</h1>",
 *   text: "Welcome!",
 * });
 * ```
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  try {
    // Validate API key
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "❌ RESEND_API_KEY is not set. Add it to your .env.local file."
      );
    }

    // Validate required fields
    if (!options.to || !options.subject || !options.html) {
      throw new Error("Missing required email fields: to, subject, or html");
    }

    // Determine from address
    const fromAddress = options.from || `ShipSafe <no-reply@${config.domainName}>`;

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    if (error) {
      console.error("Resend email error:", error);
      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// -----------------------------------------------------------------------------
// 5. Helper: Send Email with Template
// -----------------------------------------------------------------------------

/**
 * sendEmailWithTemplate() — sends email using a template function.
 *
 * This is a convenience wrapper that:
 *   1. Renders the template with provided data
 *   2. Sends the email using sendEmail()
 *
 * @param template - Template function that returns email content
 * @param to - Recipient email address
 * @param data - Data to pass to template
 * @returns Send email result
 *
 * @example
 * ```typescript
 * import { welcomeEmailTemplate } from "@/lib/email/templates/welcome";
 *
 * const result = await sendEmailWithTemplate(
 *   welcomeEmailTemplate,
 *   "user@example.com",
 *   { userName: "John" }
 * );
 * ```
 */
export async function sendEmailWithTemplate<T extends Record<string, unknown>>(
  template: (data: T) => { subject: string; html: string; text?: string },
  to: string,
  data: T,
  options?: Omit<SendEmailOptions, "to" | "subject" | "html" | "text">
): Promise<SendEmailResult> {
  try {
    // Render template
    const emailContent = template(data);

    // Send email
    return await sendEmail({
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      ...options,
    });
  } catch (error) {
    console.error("Template email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Template rendering failed",
    };
  }
}
