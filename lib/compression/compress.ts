import { encodeBitmap, type EncodedImage } from "@/lib/compression/canvas-encode";
import { CompressionError, messages, toUserMessage } from "@/lib/compression/errors";
import { chooseOutputMime, formatFromMime, mimeFromFormat } from "@/lib/compression/formats";
import type { WorkerOutbound, WorkerRequest } from "@/lib/compression/protocol";
import { assembleCompressionResult } from "@/lib/compression/stats";
import type { CompressOptions, CompressionResult, EncodeSupport } from "@/lib/compression/types";
import { validateImageFile, type DetectedFormat } from "@/lib/validation/image-file";

const DEFAULT_SUPPORT: EncodeSupport = { webp: true, avif: false };

export type CompressHooks = {
  onProgress?: (progress: number) => void;
};

function workerRequest(
  id: string,
  buffer: ArrayBuffer,
  inputMime: string,
  outputMime: string,
  options: CompressOptions,
): WorkerRequest {
  return {
    id,
    buffer,
    inputMime,
    outputMime,
    quality: options.quality,
    resizeMode: options.resizeMode,
    resizeValue: options.resizeValue,
    maintainAspectRatio: options.maintainAspectRatio,
    maxWidth: options.maxWidth,
    maxHeight: options.maxHeight,
    targetSizeBytes: options.targetSizeBytes,
  };
}

function encodeWithWorker(
  request: WorkerRequest,
  hooks?: CompressHooks,
): Promise<EncodedImage> {
  return new Promise((resolve, reject) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL("../../workers/image-worker.ts", import.meta.url));
    } catch (error) {
      reject(new CompressionError("worker", toUserMessage(error)));
      return;
    }

    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new CompressionError("unknown", messages.generic));
    }, 90_000);

    const finish = (callback: () => void) => {
      clearTimeout(timeout);
      worker.terminate();
      callback();
    };

    worker.onmessage = (event: MessageEvent<WorkerOutbound>) => {
      const data = event.data;
      if (!data || data.id !== request.id) return;
      if (data.type === "progress") {
        hooks?.onProgress?.(data.progress);
        return;
      }
      if (data.type === "error") {
        finish(() => {
          reject(
            new CompressionError(
              (data.code as CompressionError["code"]) || "unknown",
              data.message || messages.generic,
            ),
          );
        });
        return;
      }
      const blob = new Blob([data.buffer], { type: data.mimeType });
      finish(() => {
        resolve({
          blob,
          width: data.width,
          height: data.height,
          sourceWidth: data.originalWidth,
          sourceHeight: data.originalHeight,
          qualityUsed: data.qualityUsed,
          metTarget: data.metTarget,
          dimensionLimited: data.dimensionLimited,
        });
      });
    };

    worker.onerror = () => {
      finish(() => reject(new CompressionError("worker", messages.generic)));
    };

    const transferable = request.buffer.slice(0);
    worker.postMessage({ ...request, buffer: transferable }, [transferable]);
  });
}

async function encodeOnMainThread(
  file: Blob,
  outputMime: string,
  options: CompressOptions,
  hooks?: CompressHooks,
): Promise<EncodedImage> {
  const bitmap = await createImageBitmap(file);
  try {
    return await encodeBitmap(bitmap, { ...options, outputMime }, hooks?.onProgress);
  } finally {
    bitmap.close();
  }
}

export async function compressImage(
  file: File,
  options: CompressOptions,
  hooks?: CompressHooks,
): Promise<CompressionResult> {
  const validation = await validateImageFile(file);
  if (!validation.ok) {
    throw new CompressionError(
      validation.code === "too-large" ? "too-large" : validation.code,
      validation.message,
    );
  }

  const inputFormat: DetectedFormat = validation.format;
  const support = options.encodeSupport ?? DEFAULT_SUPPORT;
  const outputMime = chooseOutputMime(inputFormat, options.outputFormat, support);
  if (!outputMime) {
    throw new CompressionError("unsupported-format", messages.unsupportedBrowserFormat);
  }

  hooks?.onProgress?.(8);
  const inputMime = mimeFromFormat(inputFormat);
  const request = workerRequest(crypto.randomUUID(), await file.arrayBuffer(), inputMime, outputMime, options);

  let encoded: EncodedImage;
  try {
    encoded = await encodeWithWorker(request, hooks);
  } catch (error) {
    const code = error instanceof CompressionError ? error.code : "worker";
    if (code === "too-large" || code === "unsupported-format" || code === "memory") throw error;
    try {
      encoded = await encodeOnMainThread(file, outputMime, options, hooks);
    } catch (fallbackError) {
      if (fallbackError instanceof CompressionError) throw fallbackError;
      const message = toUserMessage(fallbackError);
      throw new CompressionError(message === messages.memory ? "memory" : "decode", message);
    }
  }

  const outputFormat = formatFromMime(encoded.blob.type || outputMime);
  const assembled = assembleCompressionResult({
    originalSize: file.size,
    compressedSize: encoded.blob.size,
    width: encoded.width,
    height: encoded.height,
    originalWidth: encoded.sourceWidth,
    originalHeight: encoded.sourceHeight,
    originalFormat: inputFormat,
    outputFormat,
    outputMime: encoded.blob.type || outputMime,
    quality: Math.round(encoded.qualityUsed * 100),
    metTarget: encoded.metTarget,
    dimensionLimited: encoded.dimensionLimited,
  });

  return { ...assembled, blob: encoded.blob };
}
