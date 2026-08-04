/**
 * -----------------------------------------------------------------------------
 * ShipSafe Docs — Markdown Content Renderer
 * -----------------------------------------------------------------------------
 * Renders markdown content with syntax highlighting and proper styling.
 * 
 * Features:
 *   - Markdown rendering with react-markdown
 *   - Syntax highlighting for code blocks
 *   - GitHub Flavored Markdown support
 *   - Custom styling for docs
 * 
 * -----------------------------------------------------------------------------
 */

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import CopyableCodeBlock from "./CopyableCodeBlock";

interface DocsContentProps {
  content: string;
  currentPath?: string; // Current documentation path (e.g., "components/overview", "get-started/installation")
}

export default function DocsContent({ content, currentPath = "overview" }: DocsContentProps) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-base-content prose-p:text-base-content/90 prose-strong:text-base-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom styling for code blocks with copy functionality
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            
            if (!inline && match) {
              // For code blocks, wrap in CopyableCodeBlock
              // The children will be processed by rehype-highlight first
              return (
                <CopyableCodeBlock className={className}>
                  {children}
                </CopyableCodeBlock>
              );
            }
            
            // Inline code
            return (
              <code
                className="bg-gradient-to-r from-primary/20 to-primary/10 px-2 py-1.5 rounded-md text-sm font-mono border border-primary/20 text-primary-content font-medium"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Custom styling for pre blocks (fallback)
          pre: ({ children }) => {
            return <>{children}</>;
          },
          // Custom styling for headings - Skip h1 (removed from page)
          h1: ({ children }) => null, // Hide h1
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold mb-5 mt-10 text-base-content border-b-2 border-primary/30 pb-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mb-4 mt-8 text-base-content">
              {children}
            </h3>
          ),
          // Custom styling for links - colored and underlined for visibility
          // Transform relative links to include /docs/ prefix
          a: ({ href, children }) => {
            if (!href) return <>{children}</>;

            // Handle external links (http/https)
            if (href.startsWith("http")) {
              return (
                <a
                  href={href}
                  className="text-primary hover:text-primary-focus underline decoration-2 decoration-primary/60 hover:decoration-primary font-medium transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            }

            // Handle anchor links (starting with #)
            if (href.startsWith("#")) {
              return (
                <a
                  href={href}
                  className="text-primary hover:text-primary-focus underline decoration-2 decoration-primary/60 hover:decoration-primary font-medium transition-colors"
                >
                  {children}
                </a>
              );
            }

            // Transform relative links to include /docs/ prefix
            let normalizedHref = href;
            
            // Handle relative paths (./ and ../)
            if (normalizedHref.startsWith("./")) {
              // Relative to current directory
              const currentDir = currentPath.includes("/") 
                ? currentPath.substring(0, currentPath.lastIndexOf("/"))
                : "";
              const targetPath = normalizedHref.substring(2); // Remove "./"
              normalizedHref = currentDir 
                ? `/docs/${currentDir}/${targetPath}`
                : `/docs/${targetPath}`;
            } else if (normalizedHref.startsWith("../")) {
              // Relative to parent directory
              const currentDir = currentPath.includes("/") 
                ? currentPath.substring(0, currentPath.lastIndexOf("/"))
                : "";
              let targetPath = normalizedHref;
              let remainingPath = currentDir;
              
              // Navigate up directories
              while (targetPath.startsWith("../")) {
                targetPath = targetPath.substring(3);
                if (remainingPath.includes("/")) {
                  remainingPath = remainingPath.substring(0, remainingPath.lastIndexOf("/"));
                } else {
                  remainingPath = "";
                }
              }
              
              normalizedHref = remainingPath 
                ? `/docs/${remainingPath}/${targetPath}`
                : `/docs/${targetPath}`;
            } else if (!normalizedHref.startsWith("/") && !normalizedHref.startsWith("http") && !normalizedHref.startsWith("#")) {
              // Relative path without ./ or ../ (same directory)
              const currentDir = currentPath.includes("/") 
                ? currentPath.substring(0, currentPath.lastIndexOf("/"))
                : "";
              normalizedHref = currentDir 
                ? `/docs/${currentDir}/${normalizedHref}`
                : `/docs/${normalizedHref}`;
            } else if (normalizedHref.startsWith("/") && !normalizedHref.startsWith("/docs/")) {
              // Absolute path but missing /docs/ prefix
              const docsPaths = ["get-started", "tutorials", "features", "components", "security", "deployment", "extras"];
              const firstSegment = normalizedHref.split("/")[1];
              if (docsPaths.includes(firstSegment)) {
                normalizedHref = `/docs${normalizedHref}`;
              }
            }

            // Use Next.js Link for internal navigation
            return (
              <Link
                href={normalizedHref}
                className="text-primary hover:text-primary-focus underline decoration-2 decoration-primary/60 hover:decoration-primary font-medium transition-colors"
              >
                {children}
              </Link>
            );
          },
          // Custom styling for lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside space-y-3 my-6 ml-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside space-y-3 my-6 ml-6">
              {children}
            </ol>
          ),
          // Custom styling for blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary bg-gradient-to-r from-primary/10 to-transparent pl-6 py-3 italic my-6 rounded-r-lg text-base-content/90">
              {children}
            </blockquote>
          ),
          // Custom styling for tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-8 rounded-xl shadow-lg border border-base-300">
              <table className="table table-zebra w-full">{children}</table>
            </div>
          ),
          // Custom styling for paragraphs
          p: ({ children }) => (
            <p className="mb-6 leading-relaxed text-base-content/90 text-base">
              {children}
            </p>
          ),
          // Custom styling for horizontal rules
          hr: () => (
            <hr className="my-8 border-base-300" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

