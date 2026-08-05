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
 *   - features/segmentation/canny.ts
 *   - features/segmentation/kmeans.ts
 *   - components/playground/SegmentationPlayground.tsx
 *
 * -----------------------------------------------------------------------------
 */

/**
 * Supported classical methods in the playground method picker.
 */
export type SegmentationMethod = "otsu" | "canny" | "kmeans";

/**
 * Shared RGBA result shape for playground rendering.
 */
export interface SegmentationImageResult {
  /**
   * Output RGBA buffer (length width * height * 4).
   */
  rgba: Uint8ClampedArray;

  /**
   * Image width in pixels.
   */
  width: number;

  /**
   * Image height in pixels.
   */
  height: number;
}

/**
 * Result of Otsu thresholding on an RGBA image buffer.
 */
export interface OtsuResult extends SegmentationImageResult {
  /**
   * Optimal threshold in [0, 255] that maximizes between-class variance.
   */
  threshold: number;

  /**
   * Binary RGBA mask (alias of rgba for backwards compatibility).
   */
  maskRgba: Uint8ClampedArray;
}

/**
 * Result of Canny edge detection.
 */
export interface CannyResult extends SegmentationImageResult {
  /**
   * Low hysteresis threshold used.
   */
  lowThreshold: number;

  /**
   * High hysteresis threshold used.
   */
  highThreshold: number;
}

/**
 * Result of k-means color quantization / segmentation.
 */
export interface KMeansResult extends SegmentationImageResult {
  /**
   * Number of clusters (k).
   */
  k: number;

  /**
   * Iterations performed until convergence or max.
   */
  iterations: number;
}
