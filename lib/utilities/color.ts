export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function parseHex(hex: string): Rgb | null {
  const value = hex.trim().replace(/^#/, "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (channel: number) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === red) h = (green - blue) / d + (green < blue ? 6 : 0);
  else if (max === green) h = (blue - red) / d + 2;
  else h = (red - green) / d + 4;
  return { h: h * 60, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  if (sat === 0) {
    const gray = Math.round(light * 255);
    return { r: gray, g: gray, b: gray };
  }
  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;
  const hk = hue / 360;
  const channel = (t: number) => {
    let tone = t;
    if (tone < 0) tone += 1;
    if (tone > 1) tone -= 1;
    if (tone < 1 / 6) return p + (q - p) * 6 * tone;
    if (tone < 1 / 2) return q;
    if (tone < 2 / 3) return p + (q - p) * (2 / 3 - tone) * 6;
    return p;
  };
  return {
    r: Math.round(channel(hk + 1 / 3) * 255),
    g: Math.round(channel(hk) * 255),
    b: Math.round(channel(hk - 1 / 3) * 255),
  };
}

export function formatHsl(hsl: Hsl): string {
  return `hsl(${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%)`;
}
