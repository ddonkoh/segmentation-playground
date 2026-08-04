/**
 * -----------------------------------------------------------------------------
 * ShipSafe Docs — Copyable Code Block Component
 * -----------------------------------------------------------------------------
 * Code block with copy-to-clipboard functionality.
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import { useState, useRef } from "react";

interface CopyableCodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function CopyableCodeBlock({
  children,
  className = "",
}: CopyableCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  // Detect if this is a shell/bash code block
  const isShell = className?.includes("language-bash") || 
                  className?.includes("language-sh") || 
                  className?.includes("language-shell") ||
                  className?.includes("language-zsh");

  const handleCopy = async () => {
    if (!codeRef.current) return;
    
    // Extract text from all code elements within the pre
    const codeElement = codeRef.current.querySelector("code");
    if (!codeElement) return;
    
    // Get all text nodes and preserve structure
    const text = codeElement.innerText || codeElement.textContent || "";
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group my-6">
      <pre
        ref={codeRef}
        className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-700/50 ${
          isShell ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : ""
        } ${className}`}
      >
        <code 
          className={`block text-sm leading-7 text-slate-100 font-mono px-6 py-5`}
          style={{
            tabSize: 2,
            whiteSpace: "pre",
            wordBreak: "normal",
            overflowWrap: "normal",
            display: "block",
            minWidth: "100%",
          }}
        >
          {children}
        </code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 btn btn-sm btn-ghost bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 border border-slate-600 shadow-lg z-10 text-slate-200 hover:text-white"
        title={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <>
            <svg
              className="w-4 h-4 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="ml-1.5 text-xs text-green-400 font-medium">Copied!</span>
          </>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

