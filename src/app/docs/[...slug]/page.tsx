/**
 * -----------------------------------------------------------------------------
 * ShipSafe Docs — Dynamic Documentation Page (Catch-All Route)
 * -----------------------------------------------------------------------------
 * Renders markdown documentation files dynamically based on the slug path.
 * 
 * Uses catch-all route [...slug] to handle nested paths like:
 *   /docs/overview → docs/overview.md
 *   /docs/get-started/installation → docs/get-started/installation.md
 *   /docs/features/authentication → docs/features/authentication.md
 * 
 * -----------------------------------------------------------------------------
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { readMarkdownFile } from "@/lib/docs/read-markdown";
import { findDocByPath } from "@/lib/docs/docs-structure";
import DocsContent from "@/components/docs/DocsContent";
import config from "@/config";

interface DocsPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const doc = findDocByPath(path);

  return generateSEOMetadata({
    title: doc ? `${doc.title} - Documentation` : "Documentation",
    description: `Documentation for ${config.appName} - ${doc?.title || "Learn how to use ShipSafe"}`,
    path: `/docs/${path}`,
  });
}

export default async function DocsSlugPage({ params }: DocsPageProps) {
  const { slug } = await params;
  
  // Handle empty slug (shouldn't happen, but just in case)
  if (!slug || slug.length === 0) {
    const content = await readMarkdownFile("overview.md");
    return (
      <article className="bg-base-100 rounded-2xl shadow-xl p-8 border border-base-300">
        <DocsContent content={content} />
      </article>
    );
  }

  // Join slug array into path
  const path = slug.join("/");
  
  // Handle root overview (main docs page)
  if (path === "overview" || path === "README") {
    const content = await readMarkdownFile("overview.md");
    return (
      <article className="bg-base-100 rounded-2xl shadow-xl p-8 border border-base-300">
        <DocsContent content={content} currentPath="overview" />
      </article>
    );
  }

  // Handle other docs pages - construct file path
  // Fix: Check if path already ends with .md to avoid double extension
  const filePath = path.endsWith(".md") ? path : `${path}.md`;

  let content: string;
  try {
    content = await readMarkdownFile(filePath);
  } catch (error) {
    console.error(`Failed to load documentation: ${filePath}`, error);
    notFound();
  }

  // JSX construction moved outside try/catch to satisfy React error boundary rules
  return (
    <article className="bg-base-100 rounded-2xl shadow-xl p-8 border border-base-300">
      <DocsContent content={content} currentPath={path} />
    </article>
  );
}

