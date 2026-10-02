import type { EncodeSupport } from "@/lib/compression/types";

async function canEncode(mime: string): Promise<boolean> {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;
  const context = canvas.getContext("2d");
  if (!context) return false;
  context.fillStyle = "#808080";
  context.fillRect(0, 0, 2, 2);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), mime, 0.8);
  });
  return Boolean(blob && blob.size > 0 && blob.type === mime);
}

export async function detectEncodeSupport(): Promise<EncodeSupport> {
  const [webp, avif] = await Promise.all([canEncode("image/webp"), canEncode("image/avif")]);
  return { webp, avif };
}
