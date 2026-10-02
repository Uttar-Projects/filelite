import { describe, expect, it } from "vitest";
import { computeOutputSize, fitInside } from "@/lib/compression/resize";

describe("resize", () => {
  it("keeps the original size", () => {
    expect(
      computeOutputSize({
        mode: "original",
        maintainAspectRatio: true,
        sourceWidth: 3840,
        sourceHeight: 2160,
      }),
    ).toEqual({ ok: true, width: 3840, height: 2160, limited: false });
  });

  it("computes height from width and keeps aspect ratio", () => {
    expect(
      computeOutputSize({
        mode: "width",
        value: 1920,
        maintainAspectRatio: true,
        sourceWidth: 3840,
        sourceHeight: 2160,
      }),
    ).toEqual({ ok: true, width: 1920, height: 1080, limited: false });
  });

  it("can set a custom width without scaling height", () => {
    expect(
      computeOutputSize({
        mode: "width",
        value: 40,
        maintainAspectRatio: false,
        sourceWidth: 100,
        sourceHeight: 50,
      }),
    ).toEqual({ ok: true, width: 40, height: 50, limited: false });
  });

  it("scales by percentage", () => {
    expect(
      computeOutputSize({
        mode: "percentage",
        value: 50,
        maintainAspectRatio: true,
        sourceWidth: 3840,
        sourceHeight: 2160,
      }),
    ).toEqual({ ok: true, width: 1920, height: 1080, limited: false });
  });

  it("does not enlarge when using a maximum width", () => {
    expect(
      computeOutputSize({
        mode: "maxWidth",
        value: 1000,
        maintainAspectRatio: true,
        sourceWidth: 800,
        sourceHeight: 600,
      }),
    ).toEqual({ ok: true, width: 800, height: 600, limited: false });
  });

  it("shrinks to a maximum width", () => {
    expect(
      computeOutputSize({
        mode: "maxWidth",
        value: 400,
        maintainAspectRatio: true,
        sourceWidth: 800,
        sourceHeight: 600,
      }),
    ).toEqual({ ok: true, width: 400, height: 300, limited: false });
  });

  it("fits inside a max width and max height box", () => {
    expect(fitInside(4000, 2000, 1000, 400)).toEqual({
      ok: true,
      width: 800,
      height: 400,
      limited: false,
    });
  });

  it("rejects a missing width and an out-of-range percentage", () => {
    expect(
      computeOutputSize({
        mode: "width",
        maintainAspectRatio: true,
        sourceWidth: 100,
        sourceHeight: 100,
      }),
    ).toMatchObject({ ok: false });
    expect(
      computeOutputSize({
        mode: "percentage",
        value: 0,
        maintainAspectRatio: true,
        sourceWidth: 100,
        sourceHeight: 100,
      }),
    ).toMatchObject({ ok: false });
  });
});
