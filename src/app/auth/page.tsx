/**
 * -----------------------------------------------------------------------------
 * ShipSafe Auth Page
 * -----------------------------------------------------------------------------
 * Authentication page with login and signup tabs.
 * Redirects to dashboard if already authenticated.
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Note: Metadata cannot be exported from client components
// SEO metadata should be handled via layout or server component wrapper
import Header from "@/components/templates/Header";
import Footer from "@/components/templates/Footer";
import LoginForm from "@/components/forms/LoginForm";
import SignupForm from "@/components/forms/SignupForm";
import Card from "@/components/ui/Card";
import { getAuthInstance } from "@/lib/firebase/client";
import config from "@/config";

// Note: Metadata export doesn't work in client components
// This page should ideally be split into a server component wrapper
// For now, we'll handle redirects client-side

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const auth = getAuthInstance();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        router.push(config.auth.callbackUrl);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </main>
      </>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            {/* Tabs */}
            <div className="tabs tabs-boxed mb-6">
              <button
                className={`tab flex-1 ${
                  activeTab === "login" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("login")}
              >
                Sign In
              </button>
              <button
                className={`tab flex-1 ${
                  activeTab === "signup" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </button>
            </div>

            {/* Forms */}
            {activeTab === "login" ? (
              <LoginForm
                onSuccess={() => {
                  router.push(config.auth.callbackUrl);
                }}
              />
            ) : (
              <SignupForm
                onSuccess={() => {
                  router.push(config.auth.callbackUrl);
                }}
              />
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

