import { describe, expect, it } from "vitest";
import { chooseOutputMime, formatFromMime, normalizeOutputChoice } from "@/lib/compression/formats";

describe("output formats", () => {
  const support = { webp: true, avif: false };

  it("preserves JPEG, PNG, and WebP in automatic mode", () => {
    expect(chooseOutputMime("jpeg", "auto", support)).toBe("image/jpeg");
    expect(chooseOutputMime("png", "auto", support)).toBe("image/png");
    expect(chooseOutputMime("webp", "auto", support)).toBe("image/webp");
  });

  it("sends GIF and HEIC to WebP when that encoder exists", () => {
    expect(chooseOutputMime("gif", "automatic", support)).toBe("image/webp");
    expect(chooseOutputMime("heic", "auto", support)).toBe("image/webp");
  });

  it("falls back when WebP encoding is unavailable", () => {
    expect(chooseOutputMime("gif", "auto", { webp: false, avif: false })).toBe("image/jpeg");
    expect(chooseOutputMime("webp", "webp", { webp: false, avif: false })).toBeNull();
  });

  it("refuses AVIF output when the browser cannot encode it", () => {
    expect(chooseOutputMime("jpeg", "avif", support)).toBeNull();
    expect(chooseOutputMime("jpeg", "avif", { webp: true, avif: true })).toBe("image/avif");
  });

  it("normalizes JPG aliases and maps MIME types back to format ids", () => {
    expect(normalizeOutputChoice("image/jpeg")).toBe("jpeg");
    expect(normalizeOutputChoice("JPG")).toBe("jpeg");
    expect(formatFromMime("image/webp")).toBe("webp");
  });
});
