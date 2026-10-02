import { MAX_FILE_BYTES } from "@/lib/constants";
import { messages } from "@/lib/compression/errors";

export type DetectedFormat = "jpeg" | "png" | "webp" | "gif" | "avif" | "heic";

export type ValidationResult =
  | { ok: true; format: DetectedFormat }
  | { ok: false; code: "empty" | "too-large" | "unsupported"; message: string };

const JPEG = [0xff, 0xd8, 0xff];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const GIF = [0x47, 0x49, 0x46, 0x38];

function startsWith(header: Uint8Array, signature: number[]): boolean {
  if (header.length < signature.length) return false;
  return signature.every((byte, index) => header[index] === byte);
}

function ascii(header: Uint8Array, start: number, length: number): string {
  let text = "";
  const end = Math.min(header.length, start + length);
  for (let index = start; index < end; index += 1) {
    text += String.fromCharCode(header[index] ?? 0);
  }
  return text;
}

export function detectImageFormat(header: Uint8Array): DetectedFormat | null {
  if (startsWith(header, JPEG)) return "jpeg";
  if (startsWith(header, PNG)) return "png";
  if (startsWith(header, GIF) && (header[4] === 0x37 || header[4] === 0x39)) return "gif";
  if (
    header.length >= 12 &&
    ascii(header, 0, 4) === "RIFF" &&
    ascii(header, 8, 4) === "WEBP"
  ) {
    return "webp";
  }

  const brand = ascii(header, 4, 48);
  if (!brand.startsWith("ftyp")) return null;
  if (brand.includes("avif") || brand.includes("avis")) return "avif";
  if (/(heic|heix|heif|mif1|msf1)/.test(brand)) return "heic";
  return null;
}

export function inspectImageBytes(
  size: number,
  header: Uint8Array,
): ValidationResult {
  if (size <= 0) return { ok: false, code: "empty", message: messages.empty };
  if (size > MAX_FILE_BYTES) {
    return { ok: false, code: "too-large", message: messages.tooLarge };
  }

  const format = detectImageFormat(header);
  if (!format) return { ok: false, code: "unsupported", message: messages.unsupported };
  return { ok: true, format };
}

export async function validateImageFile(file: Blob): Promise<ValidationResult> {
  const header = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  return inspectImageBytes(file.size, header);
}
