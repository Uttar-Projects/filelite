import type { DetectedFormat } from "@/lib/validation/image-file";

export type OutputFormatChoice = "auto" | "jpeg" | "png" | "webp" | "avif";
export type OutputFormat = "jpeg" | "png" | "webp" | "avif";
export type ResizeMode =
  | "original"
  | "width"
  | "height"
  | "maxWidth"
  | "maxHeight"
  | "percentage";

export type EncodeSupport = {
  webp: boolean;
  avif: boolean;
};

export type CompressOptions = {
  quality: number;
  outputFormat: OutputFormatChoice | string;
  maxWidth?: number;
  maxHeight?: number;
  targetSizeBytes?: number;
  resizeMode?: ResizeMode;
  resizeValue?: number;
  maintainAspectRatio?: boolean;
  encodeSupport?: EncodeSupport;
  inputMime?: string;
  sourceBuffer?: ArrayBuffer;
};

export type CompressionResult = {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  originalFormat: DetectedFormat;
  outputFormat: OutputFormat;
  outputMime: string;
  compressionRatio: number;
  savingsPercentage: number;
  savedBytes: number;
  quality: number;
  metTarget: boolean | null;
  dimensionLimited: boolean;
  keptOriginal: boolean;
};
