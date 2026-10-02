import { describe, expect, it } from "vitest";
import { TARGET_PRESETS } from "@/lib/constants";
import { clampQuality, parseTargetSize, resolveTargetBytes, settingsFromPreset } from "@/lib/compression/settings";

describe("compressor settings", () => {
  it("starts at 80 percent quality", () => {
    expect(settingsFromPreset().quality).toBe(80);
    expect(clampQuality(4)).toBe(10);
    expect(clampQuality(140)).toBe(100);
  });

  it("resolves the 1 MB and 500 KB presets", () => {
    expect(resolveTargetBytes(settingsFromPreset({ targetPreset: "1mb" })).bytes).toBe(TARGET_PRESETS["1mb"]);
    expect(resolveTargetBytes(settingsFromPreset({ targetPreset: "500kb" })).bytes).toBe(500 * 1024);
  });

  it("rejects a custom target outside the safe range", () => {
    expect(parseTargetSize(1, "KB")).toBeNull();
    expect(parseTargetSize(1, "MB")).toBe(1024 * 1024);
    expect(resolveTargetBytes(settingsFromPreset({ targetPreset: "custom", customTarget: 0, customUnit: "MB" })).error).toBeTruthy();
  });
});
