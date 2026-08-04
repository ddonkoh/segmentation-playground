/**
 * -----------------------------------------------------------------------------
 * ShipSafe Segmentation Features — types.ts
 * -----------------------------------------------------------------------------
 * Shared TypeScript types for classical image segmentation helpers.
 *
 * Why this exists:
 *   Keeps UI components thin by describing inputs/outputs of pure CV logic
 *   in features/segmentation (no React).
 *
 * Used by:
 *   - features/segmentation/otsu.ts
 *   - components/playground/SegmentationPlayground.tsx
 *
 * -----------------------------------------------------------------------------
 */

/**
 * Result of Otsu thresholding on an RGBA image buffer.
 */
export interface OtsuResult {
  /**
   * Optimal threshold in [0, 255] that maximizes between-class variance.
   */
  threshold: number;

  /**
   * Binary RGBA mask: each pixel is either black (0,0,0,255) or white (255,255,255,255).
   * Length is always width * height * 4.
   */
  maskRgba: Uint8ClampedArray;

  /**
   * Image width in pixels.
   */
  width: number;

  /**
   * Image height in pixels.
   */
  height: number;
}
