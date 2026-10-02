export function encodeUrl(text: string, component = true): string {
  return component ? encodeURIComponent(text) : encodeURI(text);
}

export function decodeUrl(text: string): { ok: true; text: string } | { ok: false; message: string } {
  if (!text.trim()) return { ok: false, message: "Paste an encoded URL or query string." };
  try {
    return { ok: true, text: decodeURIComponent(text.replace(/\+/g, "%20")) };
  } catch {
    return { ok: false, message: "That value is not a valid percent-encoded string." };
  }
}
