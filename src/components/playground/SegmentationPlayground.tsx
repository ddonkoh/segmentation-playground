/**
 * -----------------------------------------------------------------------------
 * ShipSafe Playground Components — SegmentationPlayground.tsx
 * -----------------------------------------------------------------------------
 * Client UI for the classical segmentation playground.
 * Upload once, pick a method (Otsu / Canny / k-means), show one result panel.
 *
 * Security:
 *   - Client-side only (no API, no Admin SDK, no CSRF surface)
 *   - Image never leaves the browser
 *
 * Used by:
 *   - src/app/playground/page.tsx
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { applyCanny } from "@/features/segmentation/canny";
import { applyKMeans } from "@/features/segmentation/kmeans";
import { applyOtsu } from "@/features/segmentation/otsu";
import type { SegmentationMethod } from "@/features/segmentation/types";

interface SourceImage {
  rgba: Uint8ClampedArray;
  width: number;
  height: number;
}

const METHODS: { id: SegmentationMethod; label: string }[] = [
  { id: "otsu", label: "Otsu" },
  { id: "canny", label: "Canny" },
  { id: "kmeans", label: "k-means" },
];

/**
 * SegmentationPlayground — upload an image and preview one classical method.
 */
export default function SegmentationPlayground() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceRef = useRef<SourceImage | null>(null);

  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [method, setMethod] = useState<SegmentationMethod>("otsu");
  const [metaLabel, setMetaLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // Simple method params (display + live re-run)
  const [cannyLow, setCannyLow] = useState(50);
  const [cannyHigh, setCannyHigh] = useState(150);
  const [kMeansK, setKMeansK] = useState(4);

  const resetResult = () => {
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setMetaLabel(null);
  };

  const clearOriginal = () => {
    setOriginalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFileName(null);
    sourceRef.current = null;
  };

  const runMethod = async (
    source: SourceImage,
    selected: SegmentationMethod
  ) => {
    setError(null);
    setIsProcessing(true);
    resetResult();

    try {
      let rgba: Uint8ClampedArray;
      let label: string;

      if (selected === "otsu") {
        const result = applyOtsu(source.rgba, source.width, source.height);
        rgba = result.rgba;
        label = `Threshold: ${result.threshold}`;
      } else if (selected === "canny") {
        const result = applyCanny(source.rgba, source.width, source.height, {
          lowThreshold: cannyLow,
          highThreshold: cannyHigh,
        });
        rgba = result.rgba;
        label = `Low ${result.lowThreshold} / High ${result.highThreshold}`;
      } else {
        const result = applyKMeans(source.rgba, source.width, source.height, {
          k: kMeansK,
        });
        rgba = result.rgba;
        label = `k=${result.k} · ${result.iterations} iterations`;
      }

      const url = await rgbaToObjectUrl(rgba, source.width, source.height);
      setResultUrl(url);
      setMetaLabel(label);
    } catch (err) {
      console.error("Segmentation failed:", err);
      setError(
        err instanceof Error ? err.message : "Could not process this image."
      );
      resetResult();
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-run when method or params change (if an image is loaded)
  useEffect(() => {
    const source = sourceRef.current;
    if (!source) return;
    void runMethod(source, method);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional param-driven re-run
  }, [method, cannyLow, cannyHigh, kMeansK]);

  const processImageFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    resetResult();
    clearOriginal();

    const objectUrl = URL.createObjectURL(file);
    setOriginalUrl(objectUrl);
    setFileName(file.name);

    try {
      const image = await loadImage(objectUrl);
      const source = drawToRgba(image);
      sourceRef.current = source;
      await runMethod(source, method);
    } catch (err) {
      console.error("Image load failed:", err);
      setError(
        err instanceof Error ? err.message : "Could not process this image."
      );
      resetResult();
      clearOriginal();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPEG, WebP, etc.).");
      return;
    }

    await processImageFile(file);
  };

  const handleClear = () => {
    setError(null);
    resetResult();
    clearOriginal();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resultTitle =
    method === "otsu"
      ? "Otsu binary mask"
      : method === "canny"
        ? "Canny edges"
        : "k-means clusters";

  return (
    <div className="space-y-6">
      <div className="rounded-box border border-base-300 bg-base-200/40 p-4 md:p-6 space-y-4">
        <div>
          <p className="font-medium">1. Upload an image</p>
          <p className="text-sm text-base-content/70">
            Click the button below to upload your photo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Upload image for segmentation"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            Choose image
          </button>
          {(originalUrl || resultUrl) && (
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

      <div className="rounded-box border border-base-300 bg-base-200/40 p-4 md:p-6 space-y-4">
        <div>
          <p className="font-medium">2. Choose a method</p>
          <p className="text-sm text-base-content/70">
            View one result panel at a time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Segmentation method">
          {METHODS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={method === item.id}
              className={`btn btn-sm ${method === item.id ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setMethod(item.id)}
              disabled={isProcessing}
            >
              {item.label}
            </button>
          ))}
        </div>

        {method === "canny" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="form-control w-full">
              <span className="label-text text-sm mb-1">Low threshold: {cannyLow}</span>
              <input
                type="range"
                min={0}
                max={255}
                value={cannyLow}
                onChange={(e) => setCannyLow(Number(e.target.value))}
                className="range range-primary range-sm"
                disabled={isProcessing}
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text text-sm mb-1">High threshold: {cannyHigh}</span>
              <input
                type="range"
                min={0}
                max={255}
                value={cannyHigh}
                onChange={(e) => setCannyHigh(Number(e.target.value))}
                className="range range-primary range-sm"
                disabled={isProcessing}
              />
            </label>
          </div>
        )}

        {method === "kmeans" && (
          <label className="form-control w-full max-w-xs">
            <span className="label-text text-sm mb-1">Clusters (k): {kMeansK}</span>
            <input
              type="range"
              min={2}
              max={8}
              value={kMeansK}
              onChange={(e) => setKMeansK(Number(e.target.value))}
              className="range range-primary range-sm"
              disabled={isProcessing}
            />
          </label>
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
          Running {METHODS.find((m) => m.id === method)?.label}…
        </div>
      )}

      {!originalUrl && !isProcessing && (
        <p className="text-base-content/60">
          After upload, you will see the original on the left and the selected
          method result on the right.
        </p>
      )}

      {(originalUrl || resultUrl) && (
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
            <figcaption className="text-sm font-medium flex items-center justify-between gap-2 flex-wrap">
              <span>{resultTitle}</span>
              {metaLabel && (
                <span className="badge badge-outline">{metaLabel}</span>
              )}
            </figcaption>
            {resultUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resultUrl}
                alt={`${resultTitle} result`}
                className="w-full max-h-96 object-contain bg-base-200 rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-base-200 rounded-lg flex items-center justify-center text-sm text-base-content/50">
                {isProcessing ? "Processing…" : "No result yet"}
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
function drawToRgba(image: HTMLImageElement): SourceImage {
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
  return {
    width,
    height,
    rgba: new Uint8ClampedArray(imageData.data),
  };
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
        reject(new Error("Failed to encode result image."));
        return;
      }
      resolve(result);
    }, "image/png");
  });

  return URL.createObjectURL(blob);
}
