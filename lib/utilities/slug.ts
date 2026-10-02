export function slugify(text: string, separator = "-"): string {
  const mark = separator === "_" ? "_" : "-";
  const slug = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, mark)
    .replace(new RegExp(`${mark}{2,}`, "g"), mark)
    .replace(new RegExp(`^${mark}|${mark}$`, "g"), "");
  return slug.slice(0, 180);
}
