import type { CompressionResult } from "@/lib/compression/types";
import type { DetectedFormat } from "@/lib/validation/image-file";

export type QueueStatus = "preparing" | "ready" | "compressing" | "done" | "error";

export type QueueItem = {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  status: QueueStatus;
  progress: number;
  format?: DetectedFormat;
  width?: number;
  height?: number;
  previewUrl?: string;
  resultUrl?: string;
  result?: CompressionResult;
  error?: string;
  notice?: string;
};
