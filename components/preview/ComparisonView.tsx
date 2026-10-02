"use client";

import { useRef, useState } from "react";
import { formatBytes } from "@/lib/format/bytes";
import { formatLabel } from "@/lib/compression/formats";
import type { CompressionResult } from "@/lib/compression/types";

export function ComparisonView({
  originalUrl,
  resultUrl,
  result,
}: {
  originalUrl: string;
  resultUrl: string;
  result: CompressionResult;
}) {
  const [mode, setMode] = useState<"slider" | "side">("slider");
  const [position, setPosition] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX: number) {
    const bounds = frame.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return;
    const next = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((value) => Math.max(0, value - step));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((value) => Math.min(100, value + step));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  }

  return (
    <div>
      <div role="tablist" aria-label="Comparison view" className="mb-3 flex gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "slider"}
          className={`min-h-11 rounded-xl px-3 text-sm font-semibold ${mode === "slider" ? "bg-accent text-accent-ink" : "border border-line"}`}
          onClick={() => setMode("slider")}
        >
          Slider
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "side"}
          className={`min-h-11 rounded-xl px-3 text-sm font-semibold ${mode === "side" ? "bg-accent text-accent-ink" : "border border-line"}`}
          onClick={() => setMode("side")}
        >
          Side by side
        </button>
      </div>

      {mode === "slider" ? (
        <div
          ref={frame}
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison. Move left to show more of the original image and right to show more of the compressed image."
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)} percent original`}
          className="relative cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-line bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onPointerDown={(event) => {
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromClientX(event.clientX);
          }}
          onPointerMove={(event) => {
            if (!dragging.current) return;
            updateFromClientX(event.clientX);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onKeyDown={onKeyDown}
        >
          {/* Local blob previews cannot use next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resultUrl} alt="Compressed image" className="block h-auto w-full" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original image"
            className="absolute inset-0 h-full w-full object-fill"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          />
          <span className="pointer-events-none absolute top-3 left-3 rounded-md bg-card/90 px-2 py-1 text-xs font-semibold">
            Original
          </span>
          <span className="pointer-events-none absolute top-3 right-3 rounded-md bg-card/90 px-2 py-1 text-xs font-semibold">
            Compressed
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-card"
            style={{ left: `${position}%` }}
          >
            <span className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-card text-xs font-semibold shadow-card">
              ↔
            </span>
          </span>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-line bg-card">
            <figcaption className="border-b border-line px-3 py-2 text-xs font-semibold tracking-wide">
              ORIGINAL
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={originalUrl} alt="Original image" className="block h-auto w-full" />
            <p className="px-3 py-2 text-sm text-muted">
              {formatBytes(result.originalSize)}
              <span className="px-1">·</span>
              {result.originalWidth} × {result.originalHeight}
            </p>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-line bg-card">
            <figcaption className="border-b border-line px-3 py-2 text-xs font-semibold tracking-wide">
              COMPRESSED
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="Compressed image" className="block h-auto w-full" />
            <p className="px-3 py-2 text-sm text-muted">
              {formatBytes(result.compressedSize)}
              <span className="px-1">·</span>
              {result.width} × {result.height}
              <span className="px-1">·</span>
              {formatLabel(result.outputFormat)}
            </p>
          </figure>
        </div>
      )}
    </div>
  );
}
