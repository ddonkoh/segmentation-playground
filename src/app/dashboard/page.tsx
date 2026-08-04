/**
 * -----------------------------------------------------------------------------
 * ShipSafe Dashboard Page
 * -----------------------------------------------------------------------------
 * Main dashboard page for authenticated users.
 * Displays user stats and quick actions.
 *
 * Security:
 *   - Protected by middleware auth guard
 *   - Server Component by default
 *
 * -----------------------------------------------------------------------------
 */

import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export const metadata: Metadata = generateSEOMetadata({
  title: "Dashboard",
  description: "Your ShipSafe dashboard",
  path: "/dashboard",
});

export default async function DashboardPage() {
  // Note: In a full implementation, you would fetch user data server-side
  // For now, this is a placeholder that will be enhanced with actual data fetching

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard</h1>
        <p className="text-base-content/70">
          This is your private dashboard. Customize this page to display your app&apos;s content.
        </p>
      </div>

      {/* Getting Started */}
      <Card
        header={<h2 className="text-xl font-bold">Getting Started</h2>}
      >
        <div className="space-y-4">
          <p className="text-base-content/70">
            This is a boilerplate dashboard page. You can customize it to show:
          </p>
          <ul className="list-disc list-inside space-y-2 text-base-content/70">
            <li>User statistics and metrics</li>
            <li>Recent activity or data</li>
            <li>Quick actions and shortcuts</li>
            <li>Onboarding information for new users</li>
            <li>Any content specific to your SaaS application</li>
          </ul>
        </div>
      </Card>

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
          <p className="text-base-content/70 mb-4">
            Manage your profile, preferences, and account information.
          </p>
          <Link href="/dashboard/account">
            <Button variant="outline" fullWidth>
              Go to Account
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">Billing & Subscription</h3>
          <p className="text-base-content/70 mb-4">
            View subscription status and manage billing information.
          </p>
          <Link href="/dashboard/billing">
            <Button variant="outline" fullWidth>
              Go to Billing
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

