/**
 * -----------------------------------------------------------------------------
 * ShipSafe Email Templates — index.ts
 * -----------------------------------------------------------------------------
 * Central export for all email templates.
 *
 * Usage:
 *   import { welcomeEmailTemplate, resetEmailTemplate, inviteEmailTemplate } from "@/lib/email/templates";
 * -----------------------------------------------------------------------------
 */

export { welcomeEmailTemplate } from "./welcome";
export { resetEmailTemplate } from "./reset";
export { inviteEmailTemplate } from "./invite";

export type { WelcomeEmailData } from "./welcome";
export type { ResetEmailData } from "./reset";
export type { InviteEmailData } from "./invite";

