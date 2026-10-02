/// <reference lib="webworker" />

import { encodeBitmap } from "@/lib/compression/canvas-encode";
import { CompressionError, toUserMessage } from "@/lib/compression/errors";
import type { WorkerOutbound, WorkerRequest } from "@/lib/compression/protocol";

const scope = globalThis as unknown as DedicatedWorkerGlobalScope;

scope.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  let bitmap: ImageBitmap | null = null;

  try {
    const source = new Blob([request.buffer], { type: request.inputMime });
    bitmap = await createImageBitmap(source);
    const encoded = await encodeBitmap(
      bitmap,
      {
        quality: request.quality,
        outputFormat: request.outputChoice,
        outputMime: request.outputMime,
        inputMime: request.inputMime,
        sourceBuffer: request.buffer,
        resizeMode: request.resizeMode,
        resizeValue: request.resizeValue,
        maintainAspectRatio: request.maintainAspectRatio,
        maxWidth: request.maxWidth,
        maxHeight: request.maxHeight,
        targetSizeBytes: request.targetSizeBytes,
      },
      (progress) => {
        const message: WorkerOutbound = { type: "progress", id: request.id, progress };
        scope.postMessage(message);
      },
    );

    const buffer = await encoded.blob.arrayBuffer();
    const message: WorkerOutbound = {
      type: "result",
      id: request.id,
      buffer,
      mimeType: encoded.blob.type || request.outputMime,
      width: encoded.width,
      height: encoded.height,
      originalWidth: encoded.sourceWidth,
      originalHeight: encoded.sourceHeight,
      qualityUsed: encoded.qualityUsed,
      metTarget: encoded.metTarget,
      dimensionLimited: encoded.dimensionLimited,
      keptOriginal: encoded.keptOriginal,
    };
    scope.postMessage(message, [buffer]);
  } catch (error) {
    const mapped =
      error instanceof CompressionError
        ? error
        : new CompressionError("unknown", toUserMessage(error));
    const message: WorkerOutbound = {
      type: "error",
      id: request.id,
      code: mapped.code,
      message: mapped.userMessage,
    };
    scope.postMessage(message);
  } finally {
    bitmap?.close();
  }
};
