/**
 * -----------------------------------------------------------------------------
 * ShipSafe Email Templates — reset.tsx
 * -----------------------------------------------------------------------------
 * Password reset email template.
 *
 * Usage:
 *   import { resetEmailTemplate } from "@/lib/email/templates/reset";
 *   await sendEmailWithTemplate(resetEmailTemplate, user.email, { resetLink: "..." });
 * -----------------------------------------------------------------------------
 */

import config from "@/config";

/**
 * Password reset email template data.
 */
export interface ResetEmailData {
  /**
   * Password reset link
   */
  resetLink: string;

  /**
   * Optional: User's name
   */
  userName?: string;
}

/**
 * resetEmailTemplate() — generates password reset email content.
 *
 * @param data - Reset email data
 * @returns Email content (subject, html, text)
 */
export function resetEmailTemplate(
  data: ResetEmailData
): { subject: string; html: string; text: string } {
  const { resetLink, userName } = data;
  const greeting = userName ? `Hello ${userName},` : "Hello,";

  const subject = `Reset Your ${config.appName} Password`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; margin: 0; font-size: 28px;">Reset Your Password</h1>
          </div>
          
          <p style="font-size: 16px; margin-bottom: 20px;">${greeting}</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            You requested to reset your password for ${config.appName}.
          </p>
          
          <p style="font-size: 16px; margin-bottom: 30px;">
            Click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetLink}" style="background-color: #3B82F6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">Reset Password</a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <strong>This link will expire in 1 hour.</strong>
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetLink}" style="color: #3B82F6; word-break: break-all;">${resetLink}</a>
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br>
            <strong>The ${config.appName} Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This email was sent because a password reset was requested for your ${config.appName} account.</p>
        </div>
      </body>
    </html>
  `;

  const text = `
Reset Your ${config.appName} Password

${greeting}

You requested to reset your password for ${config.appName}.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The ${config.appName} Team

---
This email was sent because a password reset was requested for your ${config.appName} account.
  `.trim();

  return { subject, html, text };
}

