import { describe, expect, it } from "vitest";
import { buildOutputFilename, sanitizeFilename, uniqueFilename } from "@/lib/format/filename";

describe("filenames", () => {
  it("strips paths and markup from untrusted names", () => {
    expect(sanitizeFilename("../../secret.jpg")).toBe("secret.jpg");
    expect(sanitizeFilename("<img onerror=alert(1)>.jpg")).toBe("img onerror=alert(1).jpg");
    expect(sanitizeFilename("")).toBe("image");
  });

  it("builds a compressed download name for the chosen format", () => {
    expect(buildOutputFilename("photo.jpg", "image/webp")).toBe("photo-compressed.webp");
    expect(buildOutputFilename("folder\\\\trip.png", "image/jpeg")).toBe("trip-compressed.jpg");
  });

  it("avoids duplicate names inside a ZIP", () => {
    const used = new Set<string>();
    expect(uniqueFilename("photo-compressed.jpg", used)).toBe("photo-compressed.jpg");
    expect(uniqueFilename("photo-compressed.jpg", used)).toBe("photo-compressed-2.jpg");
  });
});
