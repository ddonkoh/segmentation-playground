/**
 * -----------------------------------------------------------------------------
 * ShipSafe Email Templates — welcome.tsx
 * -----------------------------------------------------------------------------
 * Welcome email template for new user signups.
 *
 * Usage:
 *   import { welcomeEmailTemplate } from "@/lib/email/templates/welcome";
 *   await sendEmailWithTemplate(welcomeEmailTemplate, user.email, { userName: "John" });
 * -----------------------------------------------------------------------------
 */

import config from "@/config";

/**
 * Welcome email template data.
 */
export interface WelcomeEmailData {
  /**
   * User's name or display name
   */
  userName: string;

  /**
   * Optional: Dashboard URL
   */
  dashboardUrl?: string;
}

/**
 * welcomeEmailTemplate() — generates welcome email content.
 *
 * @param data - Welcome email data
 * @returns Email content (subject, html, text)
 */
export function welcomeEmailTemplate(
  data: WelcomeEmailData
): { subject: string; html: string; text: string } {
  const { userName, dashboardUrl } = data;
  const dashboardLink = dashboardUrl || `https://${config.domainName}/dashboard`;

  const subject = `Welcome to ${config.appName}!`;

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
            <h1 style="color: #3B82F6; margin: 0; font-size: 28px;">Welcome to ${config.appName}!</h1>
          </div>
          
          <p style="font-size: 16px; margin-bottom: 20px;">Hello ${userName},</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thanks for signing up! We're excited to have you on board.
          </p>
          
          <p style="font-size: 16px; margin-bottom: 30px;">
            Get started by exploring your dashboard and setting up your profile.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${dashboardLink}" style="background-color: #3B82F6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">Go to Dashboard</a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            If you have any questions, feel free to reach out to our support team at ${config.supportEmail}.
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Best regards,<br>
            <strong>The ${config.appName} Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This email was sent to you because you signed up for ${config.appName}.</p>
        </div>
      </body>
    </html>
  `;

  const text = `
Welcome to ${config.appName}!

Hello ${userName},

Thanks for signing up! We're excited to have you on board.

Get started by exploring your dashboard: ${dashboardLink}

If you have any questions, feel free to reach out to our support team at ${config.supportEmail}.

Best regards,
The ${config.appName} Team

---
This email was sent to you because you signed up for ${config.appName}.
  `.trim();

  return { subject, html, text };
}

