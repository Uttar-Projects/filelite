import type { CompressionResult, OutputFormat } from "@/lib/compression/types";
import type { DetectedFormat } from "@/lib/validation/image-file";

export function buildCompressionStats(originalSize: number, compressedSize: number): {
  savedBytes: number;
  savingsPercentage: number;
  compressionRatio: number;
} {
  const safeOriginal = Number.isFinite(originalSize) ? originalSize : 0;
  const safeCompressed = Number.isFinite(compressedSize) ? compressedSize : 0;
  const savedBytes = safeOriginal - safeCompressed;
  const savingsPercentage = safeOriginal > 0 ? (savedBytes / safeOriginal) * 100 : 0;
  const compressionRatio = safeOriginal > 0 ? safeCompressed / safeOriginal : 1;
  return { savedBytes, savingsPercentage, compressionRatio };
}

export function assembleCompressionResult(input: {
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  originalFormat: DetectedFormat;
  outputFormat: OutputFormat;
  outputMime: string;
  quality: number;
  metTarget: boolean | null;
  dimensionLimited: boolean;
}): Omit<CompressionResult, "blob"> {
  return {
    ...input,
    ...buildCompressionStats(input.originalSize, input.compressedSize),
  };
}
