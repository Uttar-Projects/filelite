export type ToolCategory =
  | "image"
  | "text"
  | "developer"
  | "crypto"
  | "color"
  | "data"
  | "time"
  | "pdf"
  | "3d";

export type ToolStatus = "available" | "planned";

export type CatalogTool = {
  name: string;
  category: ToolCategory;
  status: ToolStatus;
  summary: string;
  href?: string;
  group?: "compress" | "convert" | "resize" | "instrument";
};

export const categoryLabels: Record<ToolCategory, string> = {
  image: "Image",
  text: "Text",
  developer: "Developer",
  crypto: "Crypto",
  color: "Color",
  data: "Data",
  time: "Time",
  pdf: "PDF",
  "3d": "3D",
};

export const dashboardCategories: ToolCategory[] = [
  "text",
  "developer",
  "crypto",
  "color",
  "data",
  "time",
  "image",
];

export const toolCatalog: CatalogTool[] = [
  {
    name: "Word Counter",
    category: "text",
    status: "available",
    group: "instrument",
    href: "/word-counter",
    summary: "Live counts, reading time, keyword density",
  },
  {
    name: "Case Converter",
    category: "text",
    status: "available",
    group: "instrument",
    href: "/case-converter",
    summary: "UPPER, lower, Title, camelCase, snake_case, kebab",
  },
  {
    name: "Slug Generator",
    category: "text",
    status: "available",
    group: "instrument",
    href: "/slug-generator",
    summary: "URL-safe slugs from any text",
  },
  {
    name: "Lorem Ipsum",
    category: "text",
    status: "available",
    group: "instrument",
    href: "/lorem-ipsum",
    summary: "Placeholder text by paragraphs or words",
  },
  {
    name: "Text Diff",
    category: "text",
    status: "available",
    group: "instrument",
    href: "/text-diff",
    summary: "Line-by-line comparison with highlights",
  },
  {
    name: "Markdown Preview",
    category: "text",
    status: "available",
    group: "instrument",
    href: "/markdown-preview",
    summary: "Live-render Markdown to HTML",
  },
  {
    name: "JSON Formatter",
    category: "developer",
    status: "available",
    group: "instrument",
    href: "/json-formatter",
    summary: "Beautify, minify & validate JSON",
  },
  {
    name: "Base64 Encode / Decode",
    category: "developer",
    status: "available",
    group: "instrument",
    href: "/base64",
    summary: "Encode and decode Base64 strings",
  },
  {
    name: "URL Encode / Decode",
    category: "developer",
    status: "available",
    group: "instrument",
    href: "/url-encoder",
    summary: "Percent-encoding for URLs",
  },
  {
    name: "UUID Generator",
    category: "developer",
    status: "available",
    group: "instrument",
    href: "/uuid-generator",
    summary: "Batch RFC4122 v4 UUIDs",
  },
  {
    name: "Unix Timestamp",
    category: "time",
    status: "available",
    group: "instrument",
    href: "/timestamp-converter",
    summary: "Convert between Unix time and dates",
  },
  {
    name: "Password Generator",
    category: "crypto",
    status: "available",
    group: "instrument",
    href: "/password-generator",
    summary: "Strong, random, configurable passwords",
  },
  {
    name: "Hash Generator",
    category: "crypto",
    status: "available",
    group: "instrument",
    href: "/hash-generator",
    summary: "SHA-1, SHA-256, SHA-512 via Web Crypto",
  },
  {
    name: "Color Converter",
    category: "color",
    status: "available",
    group: "instrument",
    href: "/color-converter",
    summary: "HEX ↔ RGB ↔ HSL with live preview",
  },
  {
    name: "Unit Converter",
    category: "data",
    status: "available",
    group: "instrument",
    href: "/unit-converter",
    summary: "Length, weight, temperature, data",
  },
  {
    name: "Image compressor",
    category: "image",
    status: "available",
    group: "compress",
    href: "/compress-image",
    summary: "Reduce JPG, PNG, WebP, and AVIF file size in the browser.",
  },
  {
    name: "Compress JPG",
    category: "image",
    status: "available",
    group: "compress",
    href: "/compress-jpg",
    summary: "Shrink JPEG photographs with a quality control.",
  },
  {
    name: "Compress PNG",
    category: "image",
    status: "available",
    group: "compress",
    href: "/compress-png",
    summary: "Optimize PNG screenshots, logos, and graphics.",
  },
  {
    name: "Compress WebP",
    category: "image",
    status: "available",
    group: "compress",
    href: "/compress-webp",
    summary: "Re-encode WebP images for faster pages.",
  },
  {
    name: "Compress to 1 MB",
    category: "image",
    status: "available",
    group: "compress",
    href: "/compress-image-to-1mb",
    summary: "Aim for an image under about 1 MB.",
  },
  {
    name: "Compress to 500 KB",
    category: "image",
    status: "available",
    group: "compress",
    href: "/compress-image-to-500kb",
    summary: "Aim for a smaller file near 500 KB.",
  },
  {
    name: "Image resizer",
    category: "image",
    status: "available",
    group: "resize",
    href: "/image-resizer",
    summary: "Change width, height, or scale while keeping aspect ratio.",
  },
  {
    name: "JPG to PNG",
    category: "image",
    status: "available",
    group: "convert",
    href: "/jpg-to-png",
    summary: "Convert JPEG photos into PNG files.",
  },
  {
    name: "PNG to JPG",
    category: "image",
    status: "available",
    group: "convert",
    href: "/png-to-jpg",
    summary: "Turn PNG images into smaller JPEG files.",
  },
  {
    name: "WebP to JPG",
    category: "image",
    status: "available",
    group: "convert",
    href: "/webp-to-jpg",
    summary: "Export WebP images as JPEG for older tools.",
  },
  {
    name: "PDF compressor",
    category: "pdf",
    status: "planned",
    summary: "Reduce PDF file size.",
  },
  {
    name: "PDF merger",
    category: "pdf",
    status: "planned",
    summary: "Combine PDF files.",
  },
  {
    name: "STL viewer",
    category: "3d",
    status: "planned",
    summary: "Preview an STL model in the browser.",
  },
];

export function toolsByCategory(category: ToolCategory): CatalogTool[] {
  return toolCatalog.filter((tool) => tool.category === category);
}

export function availableTools(): CatalogTool[] {
  return toolCatalog.filter((tool) => tool.status === "available" && tool.href);
}

export function instrumentTools(): CatalogTool[] {
  return toolCatalog.filter((tool) => tool.group === "instrument" && tool.status === "available" && tool.href);
}

export function instrumentCount(): number {
  return instrumentTools().length;
}

export function toolByHref(href: string): CatalogTool | undefined {
  return toolCatalog.find((tool) => tool.href === href);
}
