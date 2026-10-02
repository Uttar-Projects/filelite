import { CompressionError, messages, toUserMessage } from "@/lib/compression/errors";

export async function readImageDimensions(file: Blob): Promise<{ width: number; height: number }> {
  try {
    const bitmap = await createImageBitmap(file);
    try {
      return { width: bitmap.width, height: bitmap.height };
    } finally {
      bitmap.close();
    }
  } catch (error) {
    if (error instanceof CompressionError) throw error;
    const message = toUserMessage(error);
    if (message === messages.memory) throw new CompressionError("memory", message);
    throw new CompressionError("decode", messages.decode);
  }
}
