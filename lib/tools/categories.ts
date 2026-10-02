import type { ToolCategory } from "@/lib/tools/catalog";

export const seoCategories: {
  id: ToolCategory;
  path: string;
  navLabel: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
}[] = [
  {
    id: "text",
    path: "/text-tools",
    navLabel: "Text",
    title: "Free Text Tools Online",
    description:
      "Free text tools in your browser: word counter, case converter, slug generator, Markdown preview, and text diff. No sign-up.",
    h1: "Free Text Tools Online",
    intro:
      "Edit and measure text without sending it to a server. These pages count words, change case, build URL slugs, compare drafts, and preview Markdown.",
  },
  {
    id: "developer",
    path: "/developer-tools",
    navLabel: "Developer",
    title: "Free Developer Tools Online",
    description:
      "Free developer tools in your browser: JSON formatter, Base64, URL encoder, and UUID generator. Private and instant.",
    h1: "Free Developer Tools Online",
    intro:
      "Format JSON, encode strings, and mint test IDs locally. Use these when you need a quick utility and do not want to paste data into a random site.",
  },
  {
    id: "crypto",
    path: "/crypto-tools",
    navLabel: "Crypto",
    title: "Free Password and Hash Tools",
    description:
      "Generate passwords and SHA hashes in your browser. Nothing is stored. Free, private, no account.",
    h1: "Free Password Generator and Hash Tools",
    intro:
      "Create random passwords and SHA-1, SHA-256, or SHA-512 digests on your device. These tools are for convenience, not for storing secrets long-term.",
  },
  {
    id: "color",
    path: "/color-tools",
    navLabel: "Color",
    title: "Free Color Converter Online",
    description: "Convert HEX, RGB, and HSL colors with a live preview. Free, in your browser.",
    h1: "Free Color Converter Online",
    intro: "Move a color between HEX, RGB, and HSL when a design token and a stylesheet disagree.",
  },
  {
    id: "data",
    path: "/unit-converter-tools",
    navLabel: "Data",
    title: "Free Unit Converter Online",
    description: "Convert length, weight, temperature, and file size units in your browser.",
    h1: "Free Unit Converter Online",
    intro: "Switch metric and imperial units, or bytes and megabytes, without a spreadsheet.",
  },
  {
    id: "time",
    path: "/timestamp-tools",
    navLabel: "Time",
    title: "Free Unix Timestamp Converter",
    description: "Convert Unix timestamps to dates and back, in seconds or milliseconds.",
    h1: "Free Unix Timestamp Converter",
    intro: "Read a Unix timestamp as local time and UTC, or turn a date into seconds since 1970.",
  },
  {
    id: "image",
    path: "/image-tools",
    navLabel: "Image",
    title: "Free Image Tools Online",
    description:
      "Compress, resize, and convert JPG, PNG, and WebP images in your browser. Free and private.",
    h1: "Free Image Tools Online",
    intro:
      "Shrink photos, change dimensions, and convert formats without uploading the file to a processing server.",
  },
];

export function categoryById(id: ToolCategory) {
  return seoCategories.find((category) => category.id === id);
}

export function categoryPath(id: ToolCategory): string | undefined {
  return categoryById(id)?.path;
}
