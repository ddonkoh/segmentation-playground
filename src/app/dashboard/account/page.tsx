/**
 * -----------------------------------------------------------------------------
 * ShipSafe Account Page
 * -----------------------------------------------------------------------------
 * Account management page for authenticated users.
 * 
 * This is a boilerplate-friendly template page that you can customize
 * for your specific needs.
 * 
 * Security:
 *   - Protected by middleware auth guard
 *   - Server Component by default
 *
 * Customization:
 *   - Add profile editing forms
 *   - Add password change functionality
 *   - Add account deletion
 *   - Add preferences/settings
 * 
 * -----------------------------------------------------------------------------
 */

import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import Card from "@/components/ui/Card";

export const metadata: Metadata = generateSEOMetadata({
  title: "Account Settings",
  description: "Manage your account settings",
  path: "/dashboard/account",
});

export default async function AccountPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-base-content/70">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Profile Information */}
      <Card
        header={<h2 className="text-xl font-bold">Profile Information</h2>}
      >
        <div className="space-y-4">
          <p className="text-base-content/70">
            This is your account settings page. Customize this section to add:
          </p>
          <ul className="list-disc list-inside space-y-2 text-base-content/70">
            <li>Profile information editing (name, email, avatar)</li>
            <li>Password change functionality</li>
            <li>Account preferences and settings</li>
            <li>Notification preferences</li>
            <li>Account deletion option</li>
          </ul>
        </div>
      </Card>

      {/* Subscription Information */}
      <Card
        header={<h2 className="text-xl font-bold">Subscription</h2>}
      >
        <div className="space-y-4">
          <p className="text-base-content/70">
            View your subscription status and manage billing in the{" "}
            <a href="/dashboard/billing" className="link link-primary">
              Billing
            </a>{" "}
            section.
          </p>
        </div>
      </Card>

      {/* Security Settings */}
      <Card
        header={<h2 className="text-xl font-bold">Security</h2>}
      >
        <div className="space-y-4">
          <p className="text-base-content/70">
            Security settings can be added here:
          </p>
          <ul className="list-disc list-inside space-y-2 text-base-content/70">
            <li>Two-factor authentication</li>
            <li>Active sessions management</li>
            <li>Login history</li>
            <li>Security notifications</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
