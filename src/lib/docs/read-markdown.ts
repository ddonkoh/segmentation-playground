/**
 * -----------------------------------------------------------------------------
 * ShipSafe Docs — Markdown File Reader (Server-Side Only)
 * -----------------------------------------------------------------------------
 * Server-side utility functions to read markdown files from the /docs folder.
 * 
 * NOTE: This file uses Node.js 'fs' module and can ONLY be imported in:
 *   - Server Components
 *   - API Routes
 *   - Server Actions
 * 
 * DO NOT import this in client components!
 * 
 * Used by:
 *   - Docs pages (server components) to render markdown content
 * 
 * -----------------------------------------------------------------------------
 */

import "server-only";

import { readFile } from "fs/promises";
import { join } from "path";

// -----------------------------------------------------------------------------
// Get Markdown Content
// -----------------------------------------------------------------------------

/**
 * readMarkdownFile() — reads a markdown file from the docs folder.
 *
 * @param path - Path relative to /docs folder (e.g., "get-started/installation.md")
 * @returns Markdown content as string
 * @throws Error if file not found
 * 
 * @example
 * ```typescript
 * const content = await readMarkdownFile("get-started/installation.md");
 * ```
 */
export async function readMarkdownFile(path: string): Promise<string> {
  try {
    const filePath = join(process.cwd(), "docs", path);
    const content = await readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    throw new Error(`Failed to read markdown file: ${path}`);
  }
}

