"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      window.setTimeout(() => setDone(false), 1500);
    } catch {
      setDone(false);
    }
  }

  return (
    <button type="button" className={buttonClass("secondary")} onClick={() => void copy()} disabled={!value}>
      {done ? "Copied" : label}
    </button>
  );
}
