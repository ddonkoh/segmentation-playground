/**
 * -----------------------------------------------------------------------------
 * ShipSafe Segmentation Features — canny.ts
 * -----------------------------------------------------------------------------
 * Pure TypeScript Canny edge detection (no OpenCV, no React).
 *
 * Pipeline:
 *   1. Grayscale
 *   2. Gaussian blur (5×5)
 *   3. Sobel gradients + magnitude / direction
 *   4. Non-maximum suppression
 *   5. Double threshold + hysteresis
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

import { toGrayscale } from "./otsu";
import type { CannyResult } from "./types";

export interface CannyOptions {
  /**
   * Low hysteresis threshold (default 50).
   */
  lowThreshold?: number;

  /**
   * High hysteresis threshold (default 150).
   */
  highThreshold?: number;
}

const GAUSSIAN_5 = [
  2, 4, 5, 4, 2, 4, 9, 12, 9, 4, 5, 12, 15, 12, 5, 4, 9, 12, 9, 4, 2, 4, 5, 4,
  2,
];
const GAUSSIAN_SUM = 159;

/**
 * applyCanny() — full Canny edge pipeline on an RGBA image buffer.
 *
 * @param rgba - Source RGBA pixels
 * @param width - Image width
 * @param height - Image height
 * @param options - Optional low/high thresholds
 * @returns Edge map as black/white RGBA plus thresholds used
 */
export function applyCanny(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  options: CannyOptions = {}
): CannyResult {
  let lowThreshold = options.lowThreshold ?? 50;
  let highThreshold = options.highThreshold ?? 150;

  if (lowThreshold > highThreshold) {
    const tmp = lowThreshold;
    lowThreshold = highThreshold;
    highThreshold = tmp;
  }

  const gray = toGrayscale(rgba, width, height);
  const blurred = convolveSeparableApprox(gray, width, height);
  const { magnitude, direction } = sobel(blurred, width, height);
  const suppressed = nonMaxSuppression(magnitude, direction, width, height);
  const edges = hysteresis(suppressed, width, height, lowThreshold, highThreshold);
  const output = edgesToRgba(edges);

  return {
    rgba: output,
    width,
    height,
    lowThreshold,
    highThreshold,
  };
}

/**
 * convolveSeparableApprox() — applies a 5×5 Gaussian via the standard kernel.
 */
function convolveSeparableApprox(
  src: Uint8Array,
  width: number,
  height: number
): Float32Array {
  const out = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let ki = 0;
      for (let ky = -2; ky <= 2; ky++) {
        const yy = clamp(y + ky, 0, height - 1);
        for (let kx = -2; kx <= 2; kx++) {
          const xx = clamp(x + kx, 0, width - 1);
          sum += src[yy * width + xx] * GAUSSIAN_5[ki++];
        }
      }
      out[y * width + x] = sum / GAUSSIAN_SUM;
    }
  }

  return out;
}

/**
 * sobel() — computes gradient magnitude and quantized direction (0–3).
 */
function sobel(
  src: Float32Array,
  width: number,
  height: number
): { magnitude: Float32Array; direction: Uint8Array } {
  const magnitude = new Float32Array(width * height);
  const direction = new Uint8Array(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const gx =
        -src[i - width - 1] +
        src[i - width + 1] -
        2 * src[i - 1] +
        2 * src[i + 1] -
        src[i + width - 1] +
        src[i + width + 1];
      const gy =
        -src[i - width - 1] -
        2 * src[i - width] -
        src[i - width + 1] +
        src[i + width - 1] +
        2 * src[i + width] +
        src[i + width + 1];

      magnitude[i] = Math.hypot(gx, gy);

      // Quantize angle into 4 directions: 0°, 45°, 90°, 135°
      let angle = (Math.atan2(gy, gx) * 180) / Math.PI;
      if (angle < 0) angle += 180;

      if (
        (angle >= 0 && angle < 22.5) ||
        (angle >= 157.5 && angle <= 180)
      ) {
        direction[i] = 0;
      } else if (angle >= 22.5 && angle < 67.5) {
        direction[i] = 1;
      } else if (angle >= 67.5 && angle < 112.5) {
        direction[i] = 2;
      } else {
        direction[i] = 3;
      }
    }
  }

  return { magnitude, direction };
}

/**
 * nonMaxSuppression() — thins edges along the gradient direction.
 */
function nonMaxSuppression(
  magnitude: Float32Array,
  direction: Uint8Array,
  width: number,
  height: number
): Float32Array {
  const out = new Float32Array(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const mag = magnitude[i];
      let n1 = 0;
      let n2 = 0;

      switch (direction[i]) {
        case 0:
          n1 = magnitude[i - 1];
          n2 = magnitude[i + 1];
          break;
        case 1:
          n1 = magnitude[i - width + 1];
          n2 = magnitude[i + width - 1];
          break;
        case 2:
          n1 = magnitude[i - width];
          n2 = magnitude[i + width];
          break;
        default:
          n1 = magnitude[i - width - 1];
          n2 = magnitude[i + width + 1];
          break;
      }

      out[i] = mag >= n1 && mag >= n2 ? mag : 0;
    }
  }

  return out;
}

/**
 * hysteresis() — keeps strong edges and weak edges connected to strong ones.
 * Output: 0 or 255.
 */
function hysteresis(
  suppressed: Float32Array,
  width: number,
  height: number,
  low: number,
  high: number
): Uint8Array {
  const strong = 255;
  const weak = 75;
  const out = new Uint8Array(width * height);

  for (let i = 0; i < suppressed.length; i++) {
    const v = suppressed[i];
    if (v >= high) out[i] = strong;
    else if (v >= low) out[i] = weak;
    else out[i] = 0;
  }

  // Propagate strong edges into connected weak neighbors (bounded passes)
  const maxPasses = 50;
  for (let pass = 0; pass < maxPasses; pass++) {
    let changed = false;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        if (out[i] !== weak) continue;

        let nearStrong = false;
        for (let dy = -1; dy <= 1 && !nearStrong; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            if (out[(y + dy) * width + (x + dx)] === strong) {
              nearStrong = true;
              break;
            }
          }
        }

        if (nearStrong) {
          out[i] = strong;
          changed = true;
        }
      }
    }
    if (!changed) break;
  }

  for (let i = 0; i < out.length; i++) {
    if (out[i] !== strong) out[i] = 0;
  }

  return out;
}

function edgesToRgba(edges: Uint8Array): Uint8ClampedArray {
  const rgba = new Uint8ClampedArray(edges.length * 4);
  for (let i = 0, p = 0; i < edges.length; i++, p += 4) {
    const v = edges[i];
    rgba[p] = v;
    rgba[p + 1] = v;
    rgba[p + 2] = v;
    rgba[p + 3] = 255;
  }
  return rgba;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
