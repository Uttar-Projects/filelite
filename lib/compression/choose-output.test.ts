import { describe, expect, it } from "vitest";
import { chooseCompression } from "@/lib/compression/choose-output";

describe("chooseCompression", () => {
  it("keeps the original when every new file is larger", () => {
    const choice = chooseCompression({
      originalBytes: 100_000,
      dimensionsChanged: false,
      explicitFormatChange: false,
      candidates: [
        { id: "image/jpeg", bytes: 140_000 },
        { id: "image/webp", bytes: 120_000 },
      ],
    });
    expect(choice).toEqual({ id: "original", keptOriginal: true });
  });

  it("picks the smallest file that actually saves space", () => {
    const choice = chooseCompression({
      originalBytes: 800_000,
      dimensionsChanged: false,
      explicitFormatChange: false,
      candidates: [
        { id: "image/png", bytes: 790_000 },
        { id: "image/webp", bytes: 210_000 },
        { id: "image/jpeg", bytes: 260_000 },
      ],
    });
    expect(choice).toEqual({ id: "image/webp", keptOriginal: false });
  });

  it("returns a requested format conversion even when it is larger", () => {
    const choice = chooseCompression({
      originalBytes: 80_000,
      dimensionsChanged: false,
      explicitFormatChange: true,
      candidates: [{ id: "image/png", bytes: 400_000 }],
    });
    expect(choice).toEqual({ id: "image/png", keptOriginal: false });
  });

  it("returns the resized file even when the byte size grows", () => {
    const choice = chooseCompression({
      originalBytes: 50_000,
      dimensionsChanged: true,
      explicitFormatChange: false,
      candidates: [{ id: "image/png", bytes: 70_000 }],
    });
    expect(choice).toEqual({ id: "image/png", keptOriginal: false });
  });
});
