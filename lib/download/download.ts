import { MAX_ZIP_BYTES, MAX_ZIP_FILES } from "@/lib/constants";
import { CompressionError, messages } from "@/lib/compression/errors";
import { uniqueFilename } from "@/lib/format/filename";

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function createZipBlob(files: { name: string; blob: Blob }[]): Promise<Blob> {
  const total = files.reduce((sum, file) => sum + file.blob.size, 0);
  if (files.length === 0) {
    throw new CompressionError("unknown", "There are no compressed images to download.");
  }
  if (files.length > MAX_ZIP_FILES || total > MAX_ZIP_BYTES) {
    throw new CompressionError("too-large", messages.zipTooLarge);
  }

  try {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    const used = new Set<string>();
    for (const file of files) {
      zip.file(uniqueFilename(file.name, used), file.blob);
    }
    return await zip.generateAsync({ type: "blob", compression: "STORE" });
  } catch (error) {
    if (error instanceof CompressionError) throw error;
    throw new CompressionError("memory", messages.zipTooLarge);
  }
}
