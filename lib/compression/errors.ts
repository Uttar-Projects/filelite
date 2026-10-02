export const messages = {
  unsupported: "This file format isn't supported.",
  empty: "This file is empty.",
  tooLarge: "This image is too large to process in your browser.",
  decode: "The image could not be decoded. Try another file.",
  memory:
    "Your browser ran out of memory while processing this image. Try a smaller image or process fewer files at once.",
  unsupportedBrowserFormat: "This image format isn't supported by your current browser.",
  generic: "Something went wrong while processing this image. Try another file.",
  zipTooLarge:
    "This batch is too large to zip in the browser. Download the images individually.",
  targetVariance: "Final file size may vary depending on image content and format.",
  pngQuality:
    "PNG is lossless. The quality slider applies to JPG, WebP, and AVIF.",
  pngTarget:
    "PNG is lossless, so the quality slider cannot shrink it. Choose JPG or WebP to aim for a target file size.",
  gifFlat: "Animated GIFs are flattened to the first frame.",
  heicNotice: "HEIC decoding depends on the browser. If this file fails, export it as JPG and try again.",
  targetMissed:
    "The image is still above the requested size at the lowest quality. Try resizing it or choosing JPG or WebP.",
  dimensionLimited:
    "The output dimensions were reduced so this browser could encode the image.",
  batchSkipped: "Only 20 images can be processed at once. Extra files were skipped.",
} as const;

export type CompressionErrorCode =
  | "unsupported"
  | "empty"
  | "too-large"
  | "decode"
  | "memory"
  | "unsupported-format"
  | "worker"
  | "unknown";

export class CompressionError extends Error {
  readonly code: CompressionErrorCode;
  readonly userMessage: string;

  constructor(code: CompressionErrorCode, userMessage: string) {
    super(userMessage);
    this.name = "CompressionError";
    this.code = code;
    this.userMessage = userMessage;
  }
}

export function toUserMessage(error: unknown): string {
  if (error instanceof CompressionError) return error.userMessage;

  const raw = error instanceof Error ? error.message : "";
  if (/out of memory|allocation failed|array buffer allocation/i.test(raw)) {
    return messages.memory;
  }
  if (/decode|bitmap|could not be decoded|invalid image|broken/i.test(raw)) {
    return messages.decode;
  }
  return messages.generic;
}
