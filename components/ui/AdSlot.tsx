"use client";

import { useEffect, useRef } from "react";
import { adsenseClient, getAdSlotId, type AdPosition } from "@/lib/ads/slots";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdSlot({ position }: { position: AdPosition }) {
  const client = adsenseClient();
  const slotId = getAdSlotId(position);
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || !slotId || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      pushed.current = false;
    }
  }, [client, slotId]);

  if (!client || !slotId) return null;

  return (
    <aside aria-label="Advertisement" className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
