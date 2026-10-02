import { MAX_DIMENSION, MAX_OUTPUT_PIXELS } from "@/lib/constants";
import type { ResizeMode } from "@/lib/compression/types";

export type ResizeRequest = {
  mode: ResizeMode;
  value?: number;
  maintainAspectRatio: boolean;
  sourceWidth: number;
  sourceHeight: number;
};

export type ResizeSuccess = {
  ok: true;
  width: number;
  height: number;
  limited: boolean;
};

export type ResizeResult = ResizeSuccess | { ok: false; message: string };

function finite(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function limitDimensions(
  width: number,
  height: number,
  alreadyLimited = false,
): ResizeSuccess | { ok: false; message: string } {
  let nextWidth = Math.max(1, Math.round(width));
  let nextHeight = Math.max(1, Math.round(height));
  let limited = alreadyLimited;

  const longest = Math.max(nextWidth, nextHeight);
  if (longest > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / longest;
    nextWidth = Math.max(1, Math.round(nextWidth * scale));
    nextHeight = Math.max(1, Math.round(nextHeight * scale));
    limited = true;
  }

  if (nextWidth * nextHeight > MAX_OUTPUT_PIXELS) {
    const scale = Math.sqrt(MAX_OUTPUT_PIXELS / (nextWidth * nextHeight));
    nextWidth = Math.max(1, Math.round(nextWidth * scale));
    nextHeight = Math.max(1, Math.round(nextHeight * scale));
    limited = true;
  }

  if (nextWidth < 1 || nextHeight < 1) {
    return { ok: false, message: "Enter a size greater than zero." };
  }

  return { ok: true, width: nextWidth, height: nextHeight, limited };
}

export function computeOutputSize(request: ResizeRequest): ResizeResult {
  const { sourceWidth, sourceHeight, mode, maintainAspectRatio } = request;
  if (
    !Number.isFinite(sourceWidth) ||
    !Number.isFinite(sourceHeight) ||
    sourceWidth < 1 ||
    sourceHeight < 1
  ) {
    return { ok: false, message: "The image could not be decoded. Try another file." };
  }

  if (mode === "original") {
    return limitDimensions(sourceWidth, sourceHeight);
  }

  if (mode === "percentage") {
    if (!finite(request.value) || request.value < 1 || request.value > 400) {
      return { ok: false, message: "Enter a percentage between 1 and 400." };
    }
    const scale = request.value / 100;
    return limitDimensions(sourceWidth * scale, sourceHeight * scale);
  }

  if (!finite(request.value) || request.value < 1) {
    if (mode === "height" || mode === "maxHeight") {
      return { ok: false, message: "Enter a height in pixels." };
    }
    return { ok: false, message: "Enter a width in pixels." };
  }

  const value = Math.round(request.value);

  if (mode === "maxWidth") {
    if (sourceWidth <= value) return limitDimensions(sourceWidth, sourceHeight);
    const height = Math.max(1, Math.round(sourceHeight * (value / sourceWidth)));
    return limitDimensions(value, height);
  }

  if (mode === "maxHeight") {
    if (sourceHeight <= value) return limitDimensions(sourceWidth, sourceHeight);
    const width = Math.max(1, Math.round(sourceWidth * (value / sourceHeight)));
    return limitDimensions(width, value);
  }

  if (mode === "width") {
    const height = maintainAspectRatio
      ? Math.max(1, Math.round(sourceHeight * (value / sourceWidth)))
      : sourceHeight;
    return limitDimensions(value, height);
  }

  const width = maintainAspectRatio
    ? Math.max(1, Math.round(sourceWidth * (value / sourceHeight)))
    : sourceWidth;
  return limitDimensions(width, value);
}

export function fitInside(
  sourceWidth: number,
  sourceHeight: number,
  maxWidth?: number,
  maxHeight?: number,
): ResizeResult {
  let width = sourceWidth;
  let height = sourceHeight;

  if (finite(maxWidth) && maxWidth > 0 && width > maxWidth) {
    height = Math.max(1, Math.round(height * (maxWidth / width)));
    width = maxWidth;
  }
  if (finite(maxHeight) && maxHeight > 0 && height > maxHeight) {
    width = Math.max(1, Math.round(width * (maxHeight / height)));
    height = maxHeight;
  }

  return limitDimensions(width, height);
}
