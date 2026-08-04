"use client";

import Link from "next/link";
import Image from "next/image";
import config from "@/config";

/**
 * ShipSafe Logo Component
 * Uses custom logo files from /public
 */
const Logo = ({ 
  className = "", 
  size = "md",
  variant = "default" // "default" or "white"
}: { 
  className?: string; 
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}) => {
  const logoSize = size === "sm" ? 24 : size === "lg" ? 40 : 32;
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg";
  
  // Use white variant for dark backgrounds, default for light
  const logoSrc = variant === "white" ? "/logo_w.svg" : "/logo.svg";
  const logoAlt = `${config.appName} logo`;
  
  return (
    <Link 
      href="/" 
      className={`flex items-center gap-2 ${className}`} 
      title={`${config.appName} homepage`}
    >
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={logoSize}
        height={logoSize}
        className="shrink-0"
        priority
      />
      <span className={`font-extrabold ${textSize}`}>{config.appName}</span>
    </Link>
  );
};

export default Logo;

