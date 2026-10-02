/** Browser safety limits. Images above these bounds are rejected or scaled down. */
export const MAX_FILE_BYTES = 40 * 1024 * 1024;
export const MAX_SOURCE_PIXELS = 48_000_000;
export const MAX_OUTPUT_PIXELS = 24_000_000;
export const MAX_DIMENSION = 8192;
export const MAX_BATCH = 20;
export const MAX_ZIP_FILES = 20;
export const MAX_ZIP_BYTES = 100 * 1024 * 1024;
export const MIN_TARGET_BYTES = 20 * 1024;
export const MAX_TARGET_BYTES = MAX_FILE_BYTES;
export const MIN_QUALITY = 10;
export const MAX_QUALITY = 100;
export const DEFAULT_QUALITY = 80;

export const TARGET_PRESETS = {
  "5mb": 5 * 1024 * 1024,
  "2mb": 2 * 1024 * 1024,
  "1mb": 1 * 1024 * 1024,
  "500kb": 500 * 1024,
} as const;

export type TargetPresetId = keyof typeof TARGET_PRESETS;
