export type AdPosition = "top" | "content" | "bottom";

const SLOT_ENV: Record<AdPosition, string | undefined> = {
  top: process.env.NEXT_PUBLIC_AD_SLOT_TOP,
  content: process.env.NEXT_PUBLIC_AD_SLOT_CONTENT,
  bottom: process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM,
};

export function getAdSlotId(position: AdPosition): string | null {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;
  const id = SLOT_ENV[position]?.trim();
  return id ? id : null;
}
