import { describe, expect, it } from "vitest";
import { searchQuality } from "@/lib/compression/target-size";

describe("target file size", () => {
  it("keeps the highest quality that fits under the target", async () => {
    const calls: number[] = [];
    const result = await searchQuality({
      minQuality: 0.1,
      maxQuality: 0.9,
      targetBytes: 400_000,
      encode: async (quality) => {
        calls.push(quality);
        return { size: Math.round(quality * 1_000_000) };
      },
    });

    expect(result.metTarget).toBe(true);
    expect(result.result.size).toBeLessThanOrEqual(400_000);
    expect(result.quality).toBeGreaterThanOrEqual(0.35);
    expect(result.quality).toBeLessThanOrEqual(0.4);
    expect(calls[0]).toBe(0.9);
  });

  it("returns immediately when the maximum quality is already small enough", async () => {
    let calls = 0;
    const result = await searchQuality({
      minQuality: 0.1,
      maxQuality: 0.8,
      targetBytes: 1_000,
      encode: async (quality) => {
        calls += 1;
        return { size: 100, quality };
      },
    });
    expect(result.metTarget).toBe(true);
    expect(result.quality).toBe(0.8);
    expect(calls).toBe(1);
  });

  it("reports when the target cannot be reached", async () => {
    const result = await searchQuality({
      minQuality: 0.1,
      maxQuality: 0.8,
      targetBytes: 50_000,
      encode: async (quality) => ({ size: Math.round((0.5 + quality) * 1_000_000) }),
    });
    expect(result.metTarget).toBe(false);
    expect(result.quality).toBe(0.1);
    expect(result.result.size).toBeGreaterThan(50_000);
  });
});
