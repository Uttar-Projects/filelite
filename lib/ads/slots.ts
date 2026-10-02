export type AdPosition = "top" | "content" | "bottom";

export function adsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
}

export function adsenseClient(): string | null {
  if (!adsEnabled()) return null;
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
  return /^ca-pub-\d+$/.test(client) ? client : null;
}

export function getAdSlotId(position: AdPosition): string | null {
  if (!adsenseClient()) return null;
  const id =
    position === "top"
      ? process.env.NEXT_PUBLIC_AD_SLOT_TOP
      : position === "content"
        ? process.env.NEXT_PUBLIC_AD_SLOT_CONTENT
        : process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM;
  const trimmed = id?.trim() ?? "";
  return /^\d+$/.test(trimmed) ? trimmed : null;
}
