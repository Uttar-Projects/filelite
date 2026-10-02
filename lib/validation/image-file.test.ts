import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MAX_FILE_BYTES } from "@/lib/constants";
import { inspectImageBytes, validateImageFile } from "@/lib/validation/image-file";

function header(...bytes: number[]): Uint8Array {
  return new Uint8Array(bytes);
}

function fileFrom(bytes: Uint8Array, name: string, type: string): File {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  return new File([copy], name, { type });
}

describe("image validation", () => {
  it("recognizes JPEG bytes even when the file name and MIME type disagree", async () => {
    const bytes = header(0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10);
    const file = fileFrom(bytes, "notes.txt", "text/plain");
    await expect(validateImageFile(file)).resolves.toEqual({ ok: true, format: "jpeg" });
  });

  it("trusts PNG bytes over a JPEG file name and MIME type", async () => {
    const bytes = header(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    const file = fileFrom(bytes, "photo.jpg", "image/jpeg");
    await expect(validateImageFile(file)).resolves.toEqual({ ok: true, format: "png" });
  });

  it("recognizes WebP, GIF, AVIF, and HEIC signatures", () => {
    const webp = new Uint8Array(12);
    webp.set([0x52, 0x49, 0x46, 0x46], 0);
    webp.set([0x57, 0x45, 0x42, 0x50], 8);
    expect(inspectImageBytes(12, webp)).toEqual({ ok: true, format: "webp" });

    expect(inspectImageBytes(6, header(0x47, 0x49, 0x46, 0x38, 0x39, 0x61))).toEqual({
      ok: true,
      format: "gif",
    });

    const avif = new Uint8Array(16);
    avif.set([0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70], 0);
    avif.set([0x61, 0x76, 0x69, 0x66], 8);
    expect(inspectImageBytes(16, avif)).toEqual({ ok: true, format: "avif" });

    const heic = new Uint8Array(16);
    heic.set([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], 0);
    heic.set([0x68, 0x65, 0x69, 0x63], 8);
    expect(inspectImageBytes(16, heic)).toEqual({ ok: true, format: "heic" });
  });

  it("rejects empty files", () => {
    expect(inspectImageBytes(0, new Uint8Array())).toMatchObject({ ok: false, code: "empty" });
  });

  it("rejects files that are not images", () => {
    const html = new TextEncoder().encode("<!DOCTYPE html><img>");
    expect(inspectImageBytes(html.length, html)).toMatchObject({ ok: false, code: "unsupported" });
  });

  it("accepts the bundled demo image", () => {
    const bytes = readFileSync("public/images/demo-photo.png");
    expect(inspectImageBytes(bytes.length, bytes.subarray(0, 64))).toEqual({ ok: true, format: "png" });
  });

  it("rejects very large files before decoding", () => {
    expect(inspectImageBytes(MAX_FILE_BYTES + 1, header(0xff, 0xd8, 0xff))).toMatchObject({
      ok: false,
      code: "too-large",
    });
  });
});
