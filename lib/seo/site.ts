const DEFAULT_NAME = "Filelite";

function resolveSiteName(): string {
  const value = process.env.NEXT_PUBLIC_SITE_NAME?.trim();
  return value || DEFAULT_NAME;
}

function resolveSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    return new URL(value).origin;
  } catch {
    return "http://localhost:3000";
  }
}

function resolveVerification() {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  return google ? { google } : undefined;
}

const name = resolveSiteName();

/**
 * Brand settings. Change NEXT_PUBLIC_SITE_NAME (or DEFAULT_NAME) to rename the
 * whole site. Every page, FAQ, and metadata string reads from here.
 */
export const siteConfig = {
  name,
  /** Lowercase identifier for file names and storage keys. */
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "site",
  tagline: "Free online tools that run in your browser. Private, instant, no sign-up.",
  title: "Free Image Compressor – Compress JPG, PNG & WebP Online",
  description:
    "Compress JPG, PNG, WebP and other images online for free. Reduce image file size while maintaining quality. Fast, private and easy to use.",
  url: resolveSiteUrl(),
  keywords: [
    "free image compressor",
    "compress jpg online",
    "compress png",
    "webp converter",
    "word counter",
    "json formatter",
    "base64 encoder",
    "password generator",
    "unix timestamp converter",
    "color converter",
    "unit converter",
  ],
  verification: resolveVerification(),
};

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}
