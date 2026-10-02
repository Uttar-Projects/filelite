const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function extensionForMime(mime: string): string {
  return EXTENSIONS[mime] ?? "jpg";
}

export function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "";
  const cleaned = base
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>:"|?*]/g, "")
    .replace(/^\.+/, "")
    .trim()
    .slice(0, 120);
  return cleaned || "image";
}

export function buildOutputFilename(originalName: string, outputMime: string): string {
  const safe = sanitizeFilename(originalName);
  const stem = (safe.replace(/\.[^.]+$/, "") || "image").slice(0, 80);
  return `${stem}-compressed.${extensionForMime(outputMime)}`;
}

export function uniqueFilename(filename: string, used: Set<string>): string {
  const safe = sanitizeFilename(filename);
  const key = safe.toLowerCase();
  if (!used.has(key)) {
    used.add(key);
    return safe;
  }

  const match = /^(.*?)(\.[^.]+)?$/.exec(safe);
  const stem = match?.[1] || "image";
  const extension = match?.[2] || "";
  let index = 2;
  let candidate = `${stem}-${index}${extension}`;
  while (used.has(candidate.toLowerCase())) {
    index += 1;
    candidate = `${stem}-${index}${extension}`;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}
