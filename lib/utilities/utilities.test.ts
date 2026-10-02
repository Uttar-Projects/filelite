import { describe, expect, it } from "vitest";
import { decodeBase64, encodeBase64 } from "@/lib/utilities/base64";
import { convertCase } from "@/lib/utilities/case";
import { parseHex, rgbToHex, rgbToHsl, hslToRgb } from "@/lib/utilities/color";
import { diffLines } from "@/lib/utilities/diff";
import { formatJson } from "@/lib/utilities/json";
import { generateLorem } from "@/lib/utilities/lorem";
import { markdownToHtml } from "@/lib/utilities/markdown";
import { generatePassword } from "@/lib/utilities/password";
import { slugify } from "@/lib/utilities/slug";
import { analyzeText } from "@/lib/utilities/text-stats";
import { convertUnit } from "@/lib/utilities/units";
import { decodeUrl, encodeUrl } from "@/lib/utilities/url";

describe("word counter", () => {
  it("counts words and keywords", () => {
    const stats = analyzeText("The cat sat on the mat. The cat sat.");
    expect(stats.words).toBe(9);
    expect(stats.sentences).toBe(2);
    expect(stats.keywords[0]?.word).toBe("cat");
  });
});

describe("case converter", () => {
  it("builds programming cases", () => {
    expect(convertCase("hello world", "camel")).toBe("helloWorld");
    expect(convertCase("hello world", "snake")).toBe("hello_world");
    expect(convertCase("hello world", "kebab")).toBe("hello-world");
    expect(convertCase("helloWorld", "snake")).toBe("hello_world");
  });
});

describe("slug", () => {
  it("strips accents and punctuation", () => {
    expect(slugify("Café résumé!")).toBe("cafe-resume");
    expect(slugify("Hello World", "_")).toBe("hello_world");
  });
});

describe("lorem", () => {
  it("starts with the classic sentence", () => {
    expect(generateLorem("paragraphs", 1, true)).toMatch(/^Lorem ipsum/);
    expect(generateLorem("words", 5, true).split(" ")).toHaveLength(5);
  });
});

describe("diff", () => {
  it("marks added and removed lines", () => {
    const rows = diffLines("keep\nold", "keep\nnew");
    expect(rows.some((row) => row.kind === "remove" && row.text === "old")).toBe(true);
    expect(rows.some((row) => row.kind === "add" && row.text === "new")).toBe(true);
  });
});

describe("markdown", () => {
  it("escapes HTML and renders a heading", () => {
    expect(markdownToHtml("# Title")).toContain("<h1>Title</h1>");
    expect(markdownToHtml("<script>alert(1)</script>")).toContain("&lt;script&gt;");
  });
});

describe("json", () => {
  it("formats and rejects invalid JSON", () => {
    expect(formatJson('{"a":1}')).toEqual({ ok: true, text: '{\n  "a": 1\n}' });
    expect(formatJson('{"a":1}', true)).toEqual({ ok: true, text: '{"a":1}' });
    expect(formatJson("{").ok).toBe(false);
  });
});

describe("base64 and url", () => {
  it("round-trips unicode text", () => {
    const encoded = encodeBase64("café");
    expect(decodeBase64(encoded)).toEqual({ ok: true, text: "café" });
    expect(decodeUrl(encodeUrl("a b"))).toEqual({ ok: true, text: "a b" });
  });
});

describe("color and units", () => {
  it("converts hex and metres", () => {
    const rgb = parseHex("#0e5c56");
    expect(rgb).toEqual({ r: 14, g: 92, b: 86 });
    expect(rgbToHex(rgb!)).toBe("#0e5c56");
    const hsl = rgbToHsl(rgb!);
    const back = hslToRgb(hsl);
    expect(Math.abs(back.r - 14)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.g - 92)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.b - 86)).toBeLessThanOrEqual(1);
    expect(convertUnit("length", 1, "m", "cm")).toBe(100);
    expect(convertUnit("temperature", 32, "f", "c")).toBe(0);
  });
});

describe("password", () => {
  it("uses only the requested charset", () => {
    const password = generatePassword(
      { length: 12, upper: false, lower: true, numbers: false, symbols: false, excludeSimilar: false },
      () => 0,
    );
    expect(password).toBe("aaaaaaaaaaaa");
  });
});
