import { describe, expect, it } from "vitest";
import { formatBytes, formatPercent } from "@/lib/format/bytes";

describe("byte formatting", () => {
  it("formats common file sizes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(500 * 1024)).toBe("500 KB");
    expect(formatBytes(Math.round(4.8 * 1024 * 1024))).toBe("4.8 MB");
  });

  it("rounds percentages", () => {
    expect(formatPercent(75.2)).toBe("75%");
    expect(formatPercent(Number.NaN)).toBe("0%");
  });
});
