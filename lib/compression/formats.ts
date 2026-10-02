import type { EncodeSupport, OutputFormat, OutputFormatChoice } from "@/lib/compression/types";
import type { DetectedFormat } from "@/lib/validation/image-file";

const DEFAULT_SUPPORT: EncodeSupport = { webp: true, avif: false };

export function normalizeOutputChoice(value: string): OutputFormatChoice {
  const normalized = value.trim().toLowerCase();
  if (normalized === "jpg" || normalized === "jpeg" || normalized === "image/jpeg") return "jpeg";
  if (normalized === "png" || normalized === "image/png") return "png";
  if (normalized === "webp" || normalized === "image/webp") return "webp";
  if (normalized === "avif" || normalized === "image/avif") return "avif";
  return "auto";
}

export function mimeFromFormat(format: DetectedFormat | OutputFormat): string {
  switch (format) {
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "avif":
      return "image/avif";
    case "heic":
      return "image/heic";
    default:
      return "image/jpeg";
  }
}

export function formatFromMime(mime: string): OutputFormat {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/avif") return "avif";
  return "jpeg";
}

export function formatLabel(format: DetectedFormat | OutputFormat | string): string {
  switch (format) {
    case "jpeg":
    case "jpg":
      return "JPG";
    case "png":
      return "PNG";
    case "webp":
      return "WebP";
    case "avif":
      return "AVIF";
    case "gif":
      return "GIF";
    case "heic":
      return "HEIC";
    default:
      return format.toUpperCase();
  }
}

export function mimeSupportsQuality(mime: string): boolean {
  return mime === "image/jpeg" || mime === "image/webp" || mime === "image/avif";
}

export function chooseOutputMime(
  input: DetectedFormat,
  choice: OutputFormatChoice | string,
  support: EncodeSupport = DEFAULT_SUPPORT,
): string | null {
  const selected = normalizeOutputChoice(choice);
  if (selected === "jpeg") return "image/jpeg";
  if (selected === "png") return "image/png";
  if (selected === "webp") return support.webp ? "image/webp" : null;
  if (selected === "avif") return support.avif ? "image/avif" : null;

  switch (input) {
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return support.webp ? "image/webp" : "image/jpeg";
    case "avif":
      if (support.avif) return "image/avif";
      return support.webp ? "image/webp" : "image/jpeg";
    case "gif":
    case "heic":
      return support.webp ? "image/webp" : "image/jpeg";
    default:
      return "image/jpeg";
  }
}
