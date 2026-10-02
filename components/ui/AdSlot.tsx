import { getAdSlotId, type AdPosition } from "@/lib/ads/slots";

export function AdSlot({ position }: { position: AdPosition }) {
  const slotId = getAdSlotId(position);
  if (!slotId) return null;

  return (
    <aside
      aria-label="Advertisement"
      data-ad-slot={position}
      data-ad-id={slotId}
      className="mx-auto w-full max-w-6xl px-4 sm:px-6"
    />
  );
}
