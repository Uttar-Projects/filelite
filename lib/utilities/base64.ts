export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export function decodeBase64(text: string): { ok: true; text: string } | { ok: false; message: string } {
  const compact = text.replace(/\s+/g, "");
  if (!compact) return { ok: false, message: "Paste a Base64 string to decode." };
  try {
    const binary = atob(compact);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return { ok: true, text: new TextDecoder().decode(bytes) };
  } catch {
    return { ok: false, message: "That string is not valid Base64." };
  }
}
