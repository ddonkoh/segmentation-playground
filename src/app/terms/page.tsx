/**
 * -----------------------------------------------------------------------------
 * ShipSafe Terms of Service Page
 * -----------------------------------------------------------------------------
 * Legal terms and conditions page.
 *
 * -----------------------------------------------------------------------------
 */

import Link from "next/link";
import type { Metadata } from "next";
import config from "@/config";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/templates/Header";
import Footer from "@/components/templates/Footer";

/**
 * 🚀 HOW TO GENERATE YOUR OWN TERMS OF SERVICE
 * ---------------------------------------------
 * ShipSafe includes our own Terms by default so the boilerplate
 * feels complete and professional out of the box.
 *
 * If you want to generate custom Terms for YOUR SaaS project
 * after cloning the boilerplate, follow these steps:
 *
 * 1. Open ChatGPT (or any LLM).
 * 2. Copy/paste the following prompt:
 *
 *    "You are an excellent lawyer.
 *
 *     Please write a simple Terms of Service for my SaaS application using
 *     the following details:
 *
 *     - Website: https://YOUR_DOMAIN
 *     - Name: YOUR_APP_NAME
 *     - Email: YOUR_SUPPORT_EMAIL
 *     - Description: A Next.js + Firebase + Stripe SaaS application
 *       that users can access after purchase.
 *     - Ownership: Users may use and modify the code for their own
 *       deployed apps but cannot resell, redistribute, or publish
 *       the source code.
 *     - Refunds: No refunds once code access is granted.
 *     - Personal Data: email + payment data
 *     - Non-personal Data: analytics + cookies
 *     - Privacy Policy URL: https://YOUR_DOMAIN/privacy-policy
 *     - Governing Law: COUNTRY
 *
 *     Format it cleanly. Do NOT explain your reasoning. Add today's date."
 *
 * 3. Replace your details.
 * 4. Paste the new text below inside the <pre> tag.
 *
 * Note: This default version is branded for ShipSafe.st.
 */

export const metadata: Metadata = generateSEOMetadata({
  title: "Terms and Conditions",
  description: `${config.appName} Terms and Conditions`,
  path: "/terms",
});

export default function TermsOfServicePage() {
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
          Terms and Conditions for {config.appName}
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
            <p className="text-base-content/80 mb-4">
              Welcome to {config.appName}!
            </p>
            <p className="text-base-content/80 mb-4">
              These Terms of Service (&quot;Terms&quot;) govern your access to the{" "}
              {config.domainName} website and the services provided by{" "}
              {config.appName}. By using our Website and services, you agree to
              these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              1. Description of {config.appName}
            </h2>
            <p className="text-base-content/80 mb-4">
              {config.appName} provides a secure, production-ready SaaS
              boilerplate built using Next.js, Firebase, Stripe, TailwindCSS,
              and modern security patterns. Users who purchase access can
              download the source code to build and deploy their own
              applications more efficiently.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              2. Ownership and Licensing
            </h2>
            <p className="text-base-content/80 mb-4">
              Purchasing a {config.appName} package grants you a non-exclusive
              license to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-base-content/80">
              <li>download the source code,</li>
              <li>modify it,</li>
              <li>and use it to build your own application.</li>
            </ul>
            <p className="text-base-content/80 mb-4">You may NOT:</p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-base-content/80">
              <li>resell the boilerplate,</li>
              <li>redistribute the source code,</li>
              <li>publish it publicly,</li>
              <li>sublicense it,</li>
              <li>or sell competing boilerplates based on this code.</li>
            </ul>
            <p className="text-base-content/80 mb-4">
              All intellectual property rights not explicitly granted remain with{" "}
              {config.appName}.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Refund Policy</h2>
            <p className="text-base-content/80 mb-4">
              Because {config.appName} includes access to digital source code,{" "}
              <strong>
                refunds cannot be provided once GitHub repository access has been
                granted
              </strong>
              , unless required by local consumer protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Personal Data</h2>
            <p className="text-base-content/80 mb-4">
              We may collect basic personal data such as:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-base-content/80">
              <li>email address,</li>
              <li>name,</li>
              <li>and payment details (processed securely via Stripe).</li>
            </ul>
            <p className="text-base-content/80 mb-4">
              For more information, see our{" "}
              <Link href="/privacy" className="link link-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Non-Personal Data</h2>
            <p className="text-base-content/80 mb-4">
              We may collect non-personal usage information including cookies,
              analytics, and diagnostics to improve product functionality and
              user experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Governing Law</h2>
            <p className="text-base-content/80 mb-4">
              These Terms are governed by the applicable laws in the user&apos;s
              local jurisdiction, unless overridden by mandatory consumer
              protection regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              7. Updates to These Terms
            </h2>
            <p className="text-base-content/80 mb-4">
              {config.appName} may update or revise these Terms as needed. If
              significant changes occur, we will notify users via email or through
              notices on our Website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
            <p className="text-base-content/80 mb-4">
              For questions or assistance, contact us at{" "}
              <a
                href={`mailto:${config.supportEmail ?? `support@${config.domainName}`}`}
                className="link link-primary"
              >
                {config.supportEmail ?? `support@${config.domainName}`}
              </a>
              .
            </p>
            <p className="text-base-content/80 mb-4">
              Thank you for choosing {config.appName}!
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}