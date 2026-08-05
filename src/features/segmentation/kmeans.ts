/**
 * -----------------------------------------------------------------------------
 * ShipSafe Segmentation Features — kmeans.ts
 * -----------------------------------------------------------------------------
 * Pure TypeScript k-means color segmentation / quantization (no OpenCV, no React).
 *
 * Pipeline:
 *   1. Sample RGB pixels (stride for large images)
 *   2. Initialize k centroids (evenly spaced samples)
 *   3. Iterate assign → update until convergence or max iterations
 *   4. Paint each pixel with its nearest centroid color
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

import type { KMeansResult } from "./types";

export interface KMeansOptions {
  /**
   * Number of color clusters (default 4, clamped to 2–8).
   */
  k?: number;

  /**
   * Maximum Lloyd iterations (default 12).
   */
  maxIterations?: number;
}

/**
 * applyKMeans() — k-means RGB quantization for classical segmentation demo.
 *
 * @param rgba - Source RGBA pixels
 * @param width - Image width
 * @param height - Image height
 * @param options - Optional k and maxIterations
 * @returns Quantized RGBA image plus k / iteration metadata
 */
export function applyKMeans(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  options: KMeansOptions = {}
): KMeansResult {
  const expected = width * height * 4;
  if (rgba.length !== expected) {
    throw new Error(
      `RGBA buffer length ${rgba.length} does not match ${width}x${height}`
    );
  }

  const k = clampInt(options.k ?? 4, 2, 8);
  const maxIterations = clampInt(options.maxIterations ?? 12, 1, 40);
  const pixelCount = width * height;

  // Subsample for centroid fitting on large images (keeps UI responsive)
  const stride = pixelCount > 200_000 ? 4 : pixelCount > 80_000 ? 2 : 1;
  const sampleIndexes: number[] = [];
  for (let i = 0; i < pixelCount; i += stride) {
    sampleIndexes.push(i);
  }

  const centroids = initCentroids(rgba, sampleIndexes, k);
  const sampleLabels = new Int16Array(sampleIndexes.length);
  let iterations = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterations = iter + 1;
    let moved = 0;

    for (let s = 0; s < sampleIndexes.length; s++) {
      const p = sampleIndexes[s] * 4;
      sampleLabels[s] = nearestCentroid(
        rgba[p],
        rgba[p + 1],
        rgba[p + 2],
        centroids
      );
    }

    const sums = new Float64Array(k * 3);
    const counts = new Uint32Array(k);

    for (let s = 0; s < sampleIndexes.length; s++) {
      const label = sampleLabels[s];
      const p = sampleIndexes[s] * 4;
      sums[label * 3] += rgba[p];
      sums[label * 3 + 1] += rgba[p + 1];
      sums[label * 3 + 2] += rgba[p + 2];
      counts[label]++;
    }

    for (let c = 0; c < k; c++) {
      if (counts[c] === 0) {
        // Re-seed empty cluster from a random sample pixel
        const fallback = sampleIndexes[(c * 97) % sampleIndexes.length] * 4;
        centroids[c * 3] = rgba[fallback];
        centroids[c * 3 + 1] = rgba[fallback + 1];
        centroids[c * 3 + 2] = rgba[fallback + 2];
        moved++;
        continue;
      }

      const nr = sums[c * 3] / counts[c];
      const ng = sums[c * 3 + 1] / counts[c];
      const nb = sums[c * 3 + 2] / counts[c];

      if (
        Math.abs(nr - centroids[c * 3]) > 0.5 ||
        Math.abs(ng - centroids[c * 3 + 1]) > 0.5 ||
        Math.abs(nb - centroids[c * 3 + 2]) > 0.5
      ) {
        moved++;
      }

      centroids[c * 3] = nr;
      centroids[c * 3 + 1] = ng;
      centroids[c * 3 + 2] = nb;
    }

    if (moved === 0) {
      break;
    }
  }

  const out = new Uint8ClampedArray(rgba.length);
  for (let i = 0, p = 0; i < pixelCount; i++, p += 4) {
    const label = nearestCentroid(rgba[p], rgba[p + 1], rgba[p + 2], centroids);
    out[p] = Math.round(centroids[label * 3]);
    out[p + 1] = Math.round(centroids[label * 3 + 1]);
    out[p + 2] = Math.round(centroids[label * 3 + 2]);
    out[p + 3] = 255;
  }

  return {
    rgba: out,
    width,
    height,
    k,
    iterations,
  };
}

function initCentroids(
  rgba: Uint8ClampedArray,
  sampleIndexes: number[],
  k: number
): Float64Array {
  const centroids = new Float64Array(k * 3);
  const step = Math.max(1, Math.floor(sampleIndexes.length / k));

  for (let c = 0; c < k; c++) {
    const idx = sampleIndexes[Math.min(c * step, sampleIndexes.length - 1)] * 4;
    centroids[c * 3] = rgba[idx];
    centroids[c * 3 + 1] = rgba[idx + 1];
    centroids[c * 3 + 2] = rgba[idx + 2];
  }

  return centroids;
}

function nearestCentroid(
  r: number,
  g: number,
  b: number,
  centroids: Float64Array
): number {
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  const k = centroids.length / 3;

  for (let c = 0; c < k; c++) {
    const dr = r - centroids[c * 3];
    const dg = g - centroids[c * 3 + 1];
    const db = b - centroids[c * 3 + 2];
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = c;
    }
  }

  return best;
}

function clampInt(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}
