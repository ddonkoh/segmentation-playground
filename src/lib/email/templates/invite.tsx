/**
 * -----------------------------------------------------------------------------
 * ShipSafe Email Templates — invite.tsx
 * -----------------------------------------------------------------------------
 * Invitation email template for inviting users to your app.
 *
 * Usage:
 *   import { inviteEmailTemplate } from "@/lib/email/templates/invite";
 *   await sendEmailWithTemplate(inviteEmailTemplate, "user@example.com", { 
 *     inviterName: "John", 
 *     inviteLink: "..." 
 *   });
 * -----------------------------------------------------------------------------
 */

import config from "@/config";

/**
 * Invitation email template data.
 */
export interface InviteEmailData {
  /**
   * Name of the person sending the invitation
   */
  inviterName: string;

  /**
   * Invitation link or signup link
   */
  inviteLink: string;

  /**
   * Optional: Custom message from inviter
   */
  customMessage?: string;

  /**
   * Optional: Role or team name
   */
  roleOrTeam?: string;
}

/**
 * inviteEmailTemplate() — generates invitation email content.
 *
 * @param data - Invitation email data
 * @returns Email content (subject, html, text)
 */
export function inviteEmailTemplate(
  data: InviteEmailData
): { subject: string; html: string; text: string } {
  const { inviterName, inviteLink, customMessage, roleOrTeam } = data;

  const subject = `${inviterName} invited you to ${config.appName}`;

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
            <h1 style="color: #3B82F6; margin: 0; font-size: 28px;">You're Invited!</h1>
          </div>
          
          <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            <strong>${inviterName}</strong>${roleOrTeam ? ` from ${roleOrTeam}` : ""} invited you to join ${config.appName}.
          </p>
          
          ${customMessage ? `
          <div style="background-color: #f3f4f6; border-left: 4px solid #3B82F6; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="font-size: 16px; font-style: italic; margin: 0; color: #555;">
              "${customMessage}"
            </p>
          </div>
          ` : ""}
          
          <p style="font-size: 16px; margin-bottom: 30px;">
            Click the button below to accept the invitation and get started:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${inviteLink}" style="background-color: #3B82F6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">Accept Invitation</a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${inviteLink}" style="color: #3B82F6; word-break: break-all;">${inviteLink}</a>
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br>
            <strong>The ${config.appName} Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This invitation was sent by ${inviterName}. If you weren't expecting this invitation, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
  `;

  const text = `
You're Invited!

Hello,

${inviterName}${roleOrTeam ? ` from ${roleOrTeam}` : ""} invited you to join ${config.appName}.

${customMessage ? `\n"${customMessage}"\n` : ""}

Click the link below to accept the invitation and get started:
${inviteLink}

Best regards,
The ${config.appName} Team

---
This invitation was sent by ${inviterName}. If you weren't expecting this invitation, you can safely ignore this email.
  `.trim();

  return { subject, html, text };
}

