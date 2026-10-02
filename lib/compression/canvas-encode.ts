import { MAX_SOURCE_PIXELS } from "@/lib/constants";
import { CompressionError, messages } from "@/lib/compression/errors";
import { mimeSupportsQuality } from "@/lib/compression/formats";
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

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  if (options.outputMime === "image/jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size.width, size.height);
  }
  context.drawImage(bitmap, 0, 0, size.width, size.height);

  const quality = Math.min(1, Math.max(0.1, options.quality / 100));
  if (
    options.targetSizeBytes &&
    options.targetSizeBytes > 0 &&
    mimeSupportsQuality(options.outputMime)
  ) {
    const searched = await searchQuality({
      minQuality: 0.1,
      maxQuality: quality,
      targetBytes: options.targetSizeBytes,
      encode: async (nextQuality) => {
        const blob = await canvasToBlob(canvas, options.outputMime, nextQuality);
        return { blob, size: blob.size };
      },
      onProgress,
    });
    return {
      blob: searched.result.blob,
      width: size.width,
      height: size.height,
      sourceWidth: bitmap.width,
      sourceHeight: bitmap.height,
      qualityUsed: searched.quality,
      metTarget: searched.metTarget,
      dimensionLimited: size.limited,
    };
  }

  const blob = await canvasToBlob(canvas, options.outputMime, quality);
  onProgress?.(100);
  return {
    blob,
    width: size.width,
    height: size.height,
    sourceWidth: bitmap.width,
    sourceHeight: bitmap.height,
    qualityUsed: quality,
    metTarget: options.targetSizeBytes ? blob.size <= options.targetSizeBytes : null,
    dimensionLimited: size.limited,
  };
}
