/**
 * -----------------------------------------------------------------------------
 * ShipSafe UI Components — BuiltDuringBuildSprint.tsx
 * -----------------------------------------------------------------------------
 * Attribution badge for Build Sprint #1 (kljr.website).
 * Snippet source: https://kljr.website/badges/SNIPPETS.md
 *
 * Usage:
 *   <BuiltDuringBuildSprint />
 *   <BuiltDuringBuildSprint variant="light" />
 *
 * -----------------------------------------------------------------------------
 */

export interface BuiltDuringBuildSprintProps {
  /**
   * Product slug used in the referral query string (?ref=...).
   * @default "segmentation-playground"
   */
  refSlug?: string;

  /**
   * Badge visual variant.
   * @default "dark"
   */
  variant?: "dark" | "light";

  /**
   * Prefer SVG (sharpest) over PNG.
   * @default true
   */
  svg?: boolean;
}

/**
 * BuiltDuringBuildSprint — fixed-corner-friendly Build Sprint #1 badge.
 */
export default function BuiltDuringBuildSprint({
  refSlug = "segmentation-playground",
  variant = "dark",
  svg = true,
}: BuiltDuringBuildSprintProps) {
  const isLight = variant === "light";
  const fileBase = isLight ? "build-sprint-1-light" : "build-sprint-1";
  const ext = svg ? "svg" : "png";
  const src = `https://kljr.website/badges/${fileBase}.${ext}`;

  return (
    <a
      href={`https://kljr.website/?ref=${encodeURIComponent(refSlug)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block transition-opacity hover:opacity-90"
      aria-label="Made during Build Sprint #1"
    >
      {/* External badge host; plain img matches official snippet */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Made during Build Sprint #1"
        width={153}
        height={44}
        className="h-11 w-auto"
      />
    </a>
  );
}
