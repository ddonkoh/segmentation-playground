/**
 * -----------------------------------------------------------------------------
 * ShipSafe Segmentation Features — otsu.ts
 * -----------------------------------------------------------------------------
 * Pure TypeScript Otsu thresholding (no OpenCV, no React).
 *
 * Pipeline:
 *   1. Convert RGBA → grayscale (luminance)
 *   2. Build 256-bin histogram
 *   3. Find threshold maximizing between-class variance
 *   4. Emit a binary RGBA mask (black / white)
 *
 * Security:
 *   - Runs entirely client-side on caller-provided pixel buffers
 *   - No network I/O, no secrets, no Admin SDK
 *
 * Used by:
 *   - components/playground/SegmentationPlayground.tsx
 *
 * -----------------------------------------------------------------------------
 */

import type { OtsuResult } from "./types";

/**
 * toGrayscale() — converts RGBA pixels to 8-bit luminance values.
 *
 * Uses ITU-R BT.601 coefficients: 0.299 R + 0.587 G + 0.114 B.
 *
 * @param rgba - Source RGBA buffer (length must be width * height * 4)
 * @param width - Image width
 * @param height - Image height
 * @returns Grayscale buffer of length width * height
 * @throws Error if buffer length does not match dimensions
 */
export function toGrayscale(
  rgba: Uint8ClampedArray,
  width: number,
  height: number
): Uint8Array {
  const expected = width * height * 4;
  if (rgba.length !== expected) {
    throw new Error(
      `RGBA buffer length ${rgba.length} does not match ${width}x${height}`
    );
  }

  const gray = new Uint8Array(width * height);
  for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
    const r = rgba[p];
    const g = rgba[p + 1];
    const b = rgba[p + 2];
    gray[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  return gray;
}

/**
 * computeOtsuThreshold() — finds the Otsu threshold for a grayscale image.
 *
 * @param gray - Grayscale pixels in [0, 255]
 * @returns Threshold in [0, 255]
 */
export function computeOtsuThreshold(gray: Uint8Array): number {
  const histogram = new Array<number>(256).fill(0);
  for (let i = 0; i < gray.length; i++) {
    histogram[gray[i]]++;
  }

  const total = gray.length;
  if (total === 0) {
    return 0;
  }

  let sumAll = 0;
  for (let t = 0; t < 256; t++) {
    sumAll += t * histogram[t];
  }

  let sumBackground = 0;
  let weightBackground = 0;
  let maxVariance = -1;
  let threshold = 0;

  for (let t = 0; t < 256; t++) {
    weightBackground += histogram[t];
    if (weightBackground === 0) {
      continue;
    }

    const weightForeground = total - weightBackground;
    if (weightForeground === 0) {
      break;
    }

    sumBackground += t * histogram[t];
    const meanBackground = sumBackground / weightBackground;
    const meanForeground = (sumAll - sumBackground) / weightForeground;
    const meanDiff = meanBackground - meanForeground;
    const betweenVariance =
      weightBackground * weightForeground * meanDiff * meanDiff;

    if (betweenVariance > maxVariance) {
      maxVariance = betweenVariance;
      threshold = t;
    }
  }

  return threshold;
}

/**
 * buildBinaryMaskRgba() — builds a black/white RGBA mask from grayscale + threshold.
 *
 * Pixels with gray > threshold become white; others become black.
 *
 * @param gray - Grayscale buffer
 * @param width - Image width
 * @param height - Image height
 * @param threshold - Cutoff in [0, 255]
 * @returns RGBA binary mask
 */
export function buildBinaryMaskRgba(
  gray: Uint8Array,
  width: number,
  height: number,
  threshold: number
): Uint8ClampedArray {
  const mask = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
    const value = gray[i] > threshold ? 255 : 0;
    mask[p] = value;
    mask[p + 1] = value;
    mask[p + 2] = value;
    mask[p + 3] = 255;
  }
  return mask;
}

/**
 * applyOtsu() — full Otsu pipeline on an RGBA image buffer.
 *
 * @param rgba - Source RGBA pixels (width * height * 4)
 * @param width - Image width
 * @param height - Image height
 * @returns Threshold and binary mask
 *
 * @example
 * ```ts
 * const { threshold, maskRgba } = applyOtsu(imageData.data, imageData.width, imageData.height);
 * ```
 */
export function applyOtsu(
  rgba: Uint8ClampedArray,
  width: number,
  height: number
): OtsuResult {
  const gray = toGrayscale(rgba, width, height);
  const threshold = computeOtsuThreshold(gray);
  const maskRgba = buildBinaryMaskRgba(gray, width, height, threshold);

  return {
    threshold,
    maskRgba,
    rgba: maskRgba,
    width,
    height,
  };
}
