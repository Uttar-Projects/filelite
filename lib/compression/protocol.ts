import type { ResizeMode } from "@/lib/compression/types";

export type WorkerRequest = {
  id: string;
  buffer: ArrayBuffer;
  inputMime: string;
  outputMime: string;
  quality: number;
  resizeMode?: ResizeMode;
  resizeValue?: number;
  maintainAspectRatio?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  targetSizeBytes?: number;
  outputChoice: string;
};

export type WorkerOutbound =
  | { type: "progress"; id: string; progress: number }
  | {
      type: "result";
      id: string;
      buffer: ArrayBuffer;
      mimeType: string;
      width: number;
      height: number;
      originalWidth: number;
      originalHeight: number;
      qualityUsed: number;
      metTarget: boolean | null;
      dimensionLimited: boolean;
      keptOriginal: boolean;
    }
  | { type: "error"; id: string; code: string; message: string };
