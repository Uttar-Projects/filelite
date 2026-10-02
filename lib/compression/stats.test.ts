import { describe, expect, it } from "vitest";
import { assembleCompressionResult, buildCompressionStats } from "@/lib/compression/stats";

describe("compression statistics", () => {
  it("calculates a 75 percent reduction", () => {
    expect(buildCompressionStats(4_800_000, 1_200_000)).toEqual({
      savedBytes: 3_600_000,
      savingsPercentage: 75,
      compressionRatio: 0.25,
    });
  });

  it("allows a result that is larger than the original", () => {
    const stats = buildCompressionStats(1000, 1400);
    expect(stats.savedBytes).toBe(-400);
    expect(stats.savingsPercentage).toBeCloseTo(-40);
  });

  it("handles an empty original without dividing by zero", () => {
    expect(buildCompressionStats(0, 0)).toEqual({
      savedBytes: 0,
      savingsPercentage: 0,
      compressionRatio: 1,
    });
  });

  it("assembles the public result fields", () => {
    const result = assembleCompressionResult({
      originalSize: 2000,
      compressedSize: 500,
      width: 100,
      height: 50,
      originalWidth: 200,
      originalHeight: 100,
      originalFormat: "png",
      outputFormat: "jpeg",
      outputMime: "image/jpeg",
      quality: 80,
      metTarget: true,
      dimensionLimited: false,
    });
    expect(result.savingsPercentage).toBe(75);
    expect(result.outputFormat).toBe("jpeg");
    expect(result.originalFormat).toBe("png");
  });
});
