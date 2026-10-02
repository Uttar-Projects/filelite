export type JsonResult =
  | { ok: true; text: string }
  | { ok: false; message: string };

export function formatJson(input: string, minify = false): JsonResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, message: "Paste JSON to format it." };
  try {
    const value = JSON.parse(trimmed) as unknown;
    return { ok: true, text: minify ? JSON.stringify(value) : JSON.stringify(value, null, 2) };
  } catch (error) {
    const raw = error instanceof Error ? error.message : "Invalid JSON.";
    return { ok: false, message: raw.replace(/^JSON\.parse:\s*/i, "") };
  }
}
