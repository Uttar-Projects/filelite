import { MAX_SOURCE_PIXELS } from "@/lib/constants";
import { chooseCompression } from "@/lib/compression/choose-output";
import { encodeLibwebp, encodeMozjpeg, optimisePng } from "@/lib/compression/codecs";
import { CompressionError, messages } from "@/lib/compression/errors";
import { mimeSupportsQuality, normalizeOutputChoice } from "@/lib/compression/formats";
import { computeOutputSize, fitInside } from "@/lib/compression/resize";
import { searchQuality } from "@/lib/compression/target-size";
import type { CompressOptions } from "@/lib/compression/types";

export type EncodedImage = {
  blob: Blob;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
  qualityUsed: number;
  metTarget: boolean | null;
  dimensionLimited: boolean;
  keptOriginal: boolean;
};

type DrawContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

function createCanvas(width: number, height: number): OffscreenCanvas | HTMLCanvasElement {
  if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(width, height);
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  throw new CompressionError("worker", messages.generic);
}

function getContext(canvas: OffscreenCanvas | HTMLCanvasElement): DrawContext | null {
  if ("convertToBlob" in canvas) return canvas.getContext("2d");
  return canvas.getContext("2d");
}

async function canvasToBlob(
  canvas: OffscreenCanvas | HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  try {
    const blob =
      "convertToBlob" in canvas
        ? await canvas.convertToBlob({ type, quality })
        : await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((result) => resolve(result), type, quality);
          });

    if (!blob || blob.size === 0) {
      throw new CompressionError("unsupported-format", messages.unsupportedBrowserFormat);
    }
    if (blob.type && blob.type !== type) {
      throw new CompressionError("unsupported-format", messages.unsupportedBrowserFormat);
    }
    return blob;
  } catch (error) {
    if (error instanceof CompressionError) throw error;
    throw new CompressionError("unsupported-format", messages.unsupportedBrowserFormat);
  }
}

function hasTransparency(image: ImageData): boolean {
  const pixels = image.data;
  for (let index = 3; index < pixels.length; index += 16) {
    if (pixels[index] !== 255) return true;
  }
  return false;
}

function flattenOnWhite(image: ImageData): ImageData {
  const copy = new Uint8ClampedArray(image.data);
  for (let index = 0; index < copy.length; index += 4) {
    const alpha = copy[index + 3] / 255;
    copy[index] = Math.round(copy[index] * alpha + 255 * (1 - alpha));
    copy[index + 1] = Math.round(copy[index + 1] * alpha + 255 * (1 - alpha));
    copy[index + 2] = Math.round(copy[index + 2] * alpha + 255 * (1 - alpha));
    copy[index + 3] = 255;
  }
  return new ImageData(copy, image.width, image.height);
}

function resolveSize(bitmap: ImageBitmap, options: CompressOptions) {
  if (options.resizeMode) {
    return computeOutputSize({
      mode: options.resizeMode,
      value: options.resizeValue,
      maintainAspectRatio: options.maintainAspectRatio ?? true,
      sourceWidth: bitmap.width,
      sourceHeight: bitmap.height,
    });
  }
  if (options.maxWidth || options.maxHeight) {
    return fitInside(bitmap.width, bitmap.height, options.maxWidth, options.maxHeight);
  }
  return computeOutputSize({
    mode: "original",
    maintainAspectRatio: true,
    sourceWidth: bitmap.width,
    sourceHeight: bitmap.height,
  });
}

export async function encodeBitmap(
  bitmap: ImageBitmap,
  options: CompressOptions & { outputMime: string },
  onProgress?: (progress: number) => void,
): Promise<EncodedImage> {
  if (bitmap.width * bitmap.height > MAX_SOURCE_PIXELS) {
    throw new CompressionError("too-large", messages.tooLarge);
  }

  const size = resolveSize(bitmap, options);
  if (!size.ok) throw new CompressionError("unknown", size.message);

  let canvas: OffscreenCanvas | HTMLCanvasElement;
  try {
    canvas = createCanvas(size.width, size.height);
  } catch (error) {
    if (error instanceof CompressionError) throw error;
    throw new CompressionError("memory", messages.memory);
  }

  const context = getContext(canvas);
  if (!context) throw new CompressionError("decode", messages.decode);
  const drawing = context;
  const outputWidth = size.width;
  const outputHeight = size.height;

  drawing.imageSmoothingEnabled = true;
  drawing.imageSmoothingQuality = "high";
  drawing.drawImage(bitmap, 0, 0, outputWidth, outputHeight);
  const imageData = drawing.getImageData(0, 0, outputWidth, outputHeight);
  const transparent = hasTransparency(imageData);
  const jpegPixels = transparent ? flattenOnWhite(imageData) : imageData;

  const quality = Math.min(1, Math.max(0.1, options.quality / 100));
  const choice = normalizeOutputChoice(options.outputFormat);
  const inputMime = options.inputMime ?? options.outputMime;
  const explicitFormatChange = choice !== "auto" && options.outputMime !== inputMime;
  const dimensionsChanged = outputWidth !== bitmap.width || outputHeight !== bitmap.height;
  const sourceBytes = options.sourceBuffer?.byteLength;
  const allowWebp = options.encodeSupport?.webp !== false;
  const mimes = [options.outputMime];
  if (choice === "auto") {
    if (allowWebp && options.outputMime !== "image/webp") mimes.push("image/webp");
    if (!transparent && options.outputMime !== "image/jpeg") mimes.push("image/jpeg");
  }

  const encoded = new Map<string, { blob: Blob; quality: number }>();

  async function encodeMime(mime: string, nextQuality: number): Promise<Blob> {
    const percent = Math.round(nextQuality * 100);
    if (mime === "image/jpeg") {
      const bytes = await encodeMozjpeg(jpegPixels, percent);
      if (bytes) return new Blob([bytes], { type: mime });
      drawing.fillStyle = "#ffffff";
      drawing.fillRect(0, 0, outputWidth, outputHeight);
      drawing.drawImage(bitmap, 0, 0, outputWidth, outputHeight);
      const blob = await canvasToBlob(canvas, mime, nextQuality);
      drawing.clearRect(0, 0, outputWidth, outputHeight);
      drawing.drawImage(bitmap, 0, 0, outputWidth, outputHeight);
      return blob;
    }
    if (mime === "image/webp") {
      const bytes = await encodeLibwebp(imageData, percent);
      if (bytes) return new Blob([bytes], { type: mime });
    }
    if (mime === "image/png") {
      if (!dimensionsChanged && options.sourceBuffer && inputMime === "image/png") {
        const optimised = await optimisePng(options.sourceBuffer.slice(0));
        if (optimised) return new Blob([optimised], { type: mime });
      }
      const painted = await canvasToBlob(canvas, mime, nextQuality);
      const optimised = await optimisePng(await painted.arrayBuffer());
      if (optimised && optimised.byteLength < painted.size) return new Blob([optimised], { type: mime });
      return painted;
    }
    return canvasToBlob(canvas, mime, nextQuality);
  }

  async function bestBlob(mime: string, search: boolean): Promise<{ blob: Blob; quality: number }> {
    const ceiling = options.targetSizeBytes && mimeSupportsQuality(mime) ? options.targetSizeBytes : sourceBytes;
    const shouldSearch = search && mimeSupportsQuality(mime) && typeof ceiling === "number" && ceiling > 0;
    if (!shouldSearch || typeof ceiling !== "number") {
      return { blob: await encodeMime(mime, quality), quality };
    }
    const searched = await searchQuality({
      minQuality: options.targetSizeBytes ? 0.1 : Math.min(0.4, quality),
      maxQuality: quality,
      targetBytes: ceiling,
      encode: async (nextQuality) => {
        const blob = await encodeMime(mime, nextQuality);
        return { blob, size: blob.size };
      },
    });
    return { blob: searched.result.blob, quality: searched.quality };
  }

  const searchRequested = Boolean(options.targetSizeBytes) || Boolean(sourceBytes && !dimensionsChanged);
  for (const mime of mimes) {
    encoded.set(mime, await bestBlob(mime, mime === options.outputMime && searchRequested));
    onProgress?.(Math.min(95, Math.round((encoded.size / mimes.length) * 90) + 8));
  }

  const choiceResult = chooseCompression({
    originalBytes: sourceBytes ?? Number.POSITIVE_INFINITY,
    dimensionsChanged,
    explicitFormatChange,
    candidates: [...encoded.entries()].map(([id, value]) => ({ id, bytes: value.blob.size })),
  });

  if (choiceResult.keptOriginal && options.sourceBuffer && inputMime) {
    onProgress?.(100);
    return {
      blob: new Blob([options.sourceBuffer], { type: inputMime }),
      width: bitmap.width,
      height: bitmap.height,
      sourceWidth: bitmap.width,
      sourceHeight: bitmap.height,
      qualityUsed: quality,
      metTarget: options.targetSizeBytes ? options.sourceBuffer.byteLength <= options.targetSizeBytes : null,
      dimensionLimited: size.ok ? size.limited : false,
      keptOriginal: true,
    };
  }

  const selected = encoded.get(choiceResult.id) ?? encoded.get(options.outputMime);
  if (!selected) throw new CompressionError("unknown", messages.generic);
  onProgress?.(100);
  return {
    blob: selected.blob,
    width: outputWidth,
    height: outputHeight,
    sourceWidth: bitmap.width,
    sourceHeight: bitmap.height,
    qualityUsed: selected.quality,
    metTarget: options.targetSizeBytes ? selected.blob.size <= options.targetSizeBytes : null,
    dimensionLimited: size.ok ? size.limited : false,
    keptOriginal: false,
  };
}
