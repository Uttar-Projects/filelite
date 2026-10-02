import {
  DEFAULT_QUALITY,
  MAX_QUALITY,
  MAX_TARGET_BYTES,
  MIN_QUALITY,
  MIN_TARGET_BYTES,
  TARGET_PRESETS,
  type TargetPresetId,
} from "@/lib/constants";
import type { OutputFormatChoice, ResizeMode } from "@/lib/compression/types";

export type TargetPreset = "none" | TargetPresetId | "custom";
export type TargetUnit = "KB" | "MB";

export type CompressorSettings = {
  quality: number;
  outputFormat: OutputFormatChoice;
  resizeMode: ResizeMode;
  resizeValue: number;
  maintainAspectRatio: boolean;
  targetPreset: TargetPreset;
  customTarget: number;
  customUnit: TargetUnit;
};

export type CompressorPreset = Partial<CompressorSettings>;

export const defaultSettings: CompressorSettings = {
  quality: DEFAULT_QUALITY,
  outputFormat: "auto",
  resizeMode: "original",
  resizeValue: 1920,
  maintainAspectRatio: true,
  targetPreset: "none",
  customTarget: 1,
  customUnit: "MB",
};

export function settingsFromPreset(preset?: CompressorPreset): CompressorSettings {
  return {
    ...defaultSettings,
    ...preset,
    quality: clampQuality(preset?.quality ?? defaultSettings.quality),
  };
}

export function clampQuality(quality: number): number {
  if (!Number.isFinite(quality)) return DEFAULT_QUALITY;
  return Math.min(MAX_QUALITY, Math.max(MIN_QUALITY, Math.round(quality)));
}

export function qualityToUnit(quality: number): number {
  return clampQuality(quality) / 100;
}

export function parseTargetSize(value: number, unit: TargetUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  const bytes = Math.round(value * (unit === "MB" ? 1024 * 1024 : 1024));
  if (bytes < MIN_TARGET_BYTES || bytes > MAX_TARGET_BYTES) return null;
  return bytes;
}

export function resolveTargetBytes(settings: CompressorSettings): {
  bytes?: number;
  error?: string;
} {
  if (settings.targetPreset === "none") return {};
  if (settings.targetPreset === "custom") {
    const bytes = parseTargetSize(settings.customTarget, settings.customUnit);
    if (!bytes) return { error: "Enter a target between 20 KB and 40 MB." };
    return { bytes };
  }
  return { bytes: TARGET_PRESETS[settings.targetPreset] };
}
