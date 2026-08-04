/**
 * -----------------------------------------------------------------------------
 * ShipSafe Privacy Policy Page
 * -----------------------------------------------------------------------------
 * Privacy policy and data handling information.
 *
 * -----------------------------------------------------------------------------
 */

import Link from "next/link";
import type { Metadata } from "next";
import config from "@/config";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/templates/Header";
import Footer from "@/components/templates/Footer";

export const metadata: Metadata = generateSEOMetadata({
  title: "Privacy Policy",
  description: `${config.appName} Privacy Policy`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-10">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight mt-6 mb-8">
          Privacy Policy for {config.appName}
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-base-content/70 mb-4">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-base-content/80 mb-4">
              Welcome to {config.appName}. We respect your privacy and are
              committed to protecting your personal data. This privacy policy
              explains how we collect, use, and safeguard your information when
              you use our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <p className="text-base-content/80 mb-4">
              We may collect the following personal information:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-base-content/80">
              <li>Email address</li>
              <li>Name (if provided)</li>
              <li>Payment information (processed securely via Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Non-Personal Information</h3>
            <p className="text-base-content/80 mb-4">
              We may collect non-personal usage information including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-base-content/80">
              <li>Cookies and similar tracking technologies</li>
              <li>Analytics data</li>
              <li>Diagnostic information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-base-content/80 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-base-content/80">
              <li>Provide and maintain our services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send you important updates and notifications</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-base-content/80 mb-4">
              We implement industry-standard security measures to protect your
              personal information, including encryption, secure servers, and
              regular security audits. However, no method of transmission over
              the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
            <p className="text-base-content/80 mb-4">
              We use the following third-party services that may collect
              information:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-base-content/80">
              <li>
                <strong>Firebase:</strong> Authentication and database services
              </li>
              <li>
                <strong>Stripe:</strong> Payment processing
              </li>
              <li>
                <strong>Vercel:</strong> Hosting and analytics (if applicable)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-base-content/80 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-base-content/80">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
            <p className="text-base-content/80 mb-4">
              If you have questions about this privacy policy, please contact us
              at{" "}
              <a
                href={`mailto:${config.supportEmail}`}
                className="link link-primary"
              >
                {config.supportEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

