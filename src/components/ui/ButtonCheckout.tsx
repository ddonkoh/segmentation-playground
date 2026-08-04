"use client";

import { useState } from "react";
import Image from "next/image";
import { apiPost, handleAPIError } from "@/lib/api";
import config from "@/config";

interface ButtonCheckoutProps {
  priceId?: string;
  className?: string;
}

const ButtonCheckout = ({ priceId, className = "" }: ButtonCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const response = await apiPost<{ url: string; sessionId: string }>(
        "/api/checkout",
        {
          priceId,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
        }
      );

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (e) {
      console.error(e);
      const errorMessage = handleAPIError(e);
      alert(`Checkout failed: ${errorMessage}`);
    }

    setIsLoading(false);
  };

  // Determine if gradient classes are provided (for CTA styling)
  const hasGradient = className.includes("bg-gradient");
  
  // Base classes: use btn-primary unless gradient is provided
  // When gradient is provided, don't use btn-primary to avoid style conflicts
  const baseClasses = hasGradient 
    ? "btn gap-2" 
    : "btn btn-primary gap-2";

  return (
    <button
      className={`${baseClasses} ${className}`.trim()}
      onClick={() => handlePayment()}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <Image
          src="/logo_w.png"
          alt={`${config.appName} logo`}
          width={20}
          height={20}
          className="w-5 h-5"
        />
      )}
      Get {config?.appName}
    </button>
  );
};

export default ButtonCheckout;
