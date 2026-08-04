/**
 * -----------------------------------------------------------------------------
 * ShipSafe Documentation Page
 * -----------------------------------------------------------------------------
 * Main documentation landing page - shows README content.
 *
 * -----------------------------------------------------------------------------
 */

import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { readMarkdownFile } from "@/lib/docs/read-markdown";
import DocsContent from "@/components/docs/DocsContent";
import config from "@/config";

export const metadata: Metadata = generateSEOMetadata({
  title: "Documentation",
  description: `Complete documentation for ${config.appName}`,
  path: "/docs",
});

export default async function DocsPage() {
  const content = await readMarkdownFile("overview.md");

  return (
    <article>
      <DocsContent content={content} currentPath="overview" />
    </article>
  );
}