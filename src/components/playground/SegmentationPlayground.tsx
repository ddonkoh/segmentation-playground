/**
 * -----------------------------------------------------------------------------
 * ShipSafe Playground Components — SegmentationPlayground.tsx
 * -----------------------------------------------------------------------------
 * Client UI for Slice 1 of the classical segmentation playground.
 * Handles image upload/preview and wires pure Otsu logic from features/.
 *
 * Security:
 *   - Client-side only (no API, no Admin SDK, no CSRF surface)
 *   - Image never leaves the browser in Slice 1
 *
 * Used by:
 *   - src/app/playground/page.tsx
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { ChangeEvent, useRef, useState } from "react";
import { applyOtsu } from "@/features/segmentation/otsu";

/**
 * SegmentationPlayground — upload an image and preview original + Otsu mask.
 */
export default function SegmentationPlayground() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [maskUrl, setMaskUrl] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const resetResults = () => {
    setMaskUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setThreshold(null);
  };

  const clearOriginal = () => {
    setOriginalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFileName(null);
  };

  const processImageFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    resetResults();
    clearOriginal();

    const objectUrl = URL.createObjectURL(file);
    setOriginalUrl(objectUrl);
    setFileName(file.name);

    try {
      const image = await loadImage(objectUrl);
      const { width, height, rgba } = drawToRgba(image);
      const result = applyOtsu(rgba, width, height);
      const maskBlobUrl = await rgbaToObjectUrl(
        result.maskRgba,
        result.width,
        result.height
      );

      setMaskUrl(maskBlobUrl);
      setThreshold(result.threshold);
    } catch (err) {
      console.error("Otsu processing failed:", err);
      setError(
        err instanceof Error ? err.message : "Could not process this image."
      );
      resetResults();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPEG, WebP, etc.).");
      return;
    }

    await processImageFile(file);
  };

  const handleClear = () => {
    setError(null);
    resetResults();
    clearOriginal();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-box border border-base-300 bg-base-200/40 p-4 md:p-6 space-y-4">
        <div>
          <p className="font-medium">1. Upload an image</p>
          <p className="text-sm text-base-content/70">
            Click the button below, pick a fruit (or any) photo, then Otsu runs
            automatically.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Upload image for Otsu segmentation"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            Choose image
          </button>
          {(originalUrl || maskUrl) && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClear}
              disabled={isProcessing}
            >
              Clear
            </button>
          )}
        </div>

        {fileName && (
          <p className="text-sm text-base-content/70">
            Selected: <span className="font-medium">{fileName}</span>
          </p>
        )}
      </div>

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <span className="loading loading-spinner loading-sm" />
          Running Otsu thresholding…
        </div>
      )}

      {!originalUrl && !isProcessing && (
        <p className="text-base-content/60">
          After upload you will see the original on the left and the Otsu binary
          mask on the right.
        </p>
      )}

      {(originalUrl || maskUrl) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <figure className="space-y-2">
            <figcaption className="text-sm font-medium">Original</figcaption>
            {originalUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={originalUrl}
                alt="Uploaded original"
                className="w-full max-h-96 object-contain bg-base-200 rounded-lg"
              />
            ) : null}
          </figure>

          <figure className="space-y-2">
            <figcaption className="text-sm font-medium flex items-center justify-between gap-2">
              <span>Otsu binary mask</span>
              {threshold !== null && (
                <span className="badge badge-outline">
                  Threshold: {threshold}
                </span>
              )}
            </figcaption>
            {maskUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={maskUrl}
                alt="Otsu binary segmentation mask"
                className="w-full max-h-96 object-contain bg-base-200 rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-base-200 rounded-lg flex items-center justify-center text-sm text-base-content/50">
                {isProcessing ? "Processing…" : "No mask yet"}
              </div>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}

/**
 * loadImage() — loads an object URL into an HTMLImageElement.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image."));
    img.src = src;
  });
}

/**
 * drawToRgba() — draws an image to a canvas and returns RGBA pixels.
 */
function drawToRgba(image: HTMLImageElement): {
  width: number;
  height: number;
  rgba: Uint8ClampedArray;
} {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  if (!width || !height) {
    throw new Error("Image has invalid dimensions.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  return { width, height, rgba: imageData.data };
}

/**
 * rgbaToObjectUrl() — encodes an RGBA buffer as a PNG object URL.
 */
async function rgbaToObjectUrl(
  rgba: Uint8ClampedArray,
  width: number,
  height: number
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  const imageData = new ImageData(new Uint8ClampedArray(rgba), width, height);
  ctx.putImageData(imageData, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (!result) {
        reject(new Error("Failed to encode mask image."));
        return;
      }
      resolve(result);
    }, "image/png");
  });

  return URL.createObjectURL(blob);
}
