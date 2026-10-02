"use client";

import { formatBytes } from "@/lib/format/bytes";
import { formatLabel } from "@/lib/compression/formats";
import type { QueueItem } from "@/components/compression/queue";

function statusText(item: QueueItem): string {
  if (item.status === "preparing") return "Preparing image...";
  if (item.status === "compressing") return "Compressing";
  if (item.status === "done") return "Compression complete";
  if (item.status === "error") return "Not processed";
  return "Ready";
}

export function QueueList({
  items,
  selectedId,
  onSelect,
  onRemove,
  onDownload,
}: {
  items: QueueItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDownload: (item: QueueItem) => void;
}) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-3" aria-label="Image queue">
      {items.map((item) => {
        const dimensions =
          item.width && item.height
            ? `${item.width} × ${item.height}`
            : item.status === "preparing"
              ? "Reading size"
              : null;
        const selected = item.id === selectedId;
        return (
          <li key={item.id} className="rounded-2xl border border-line bg-card p-3 shadow-card">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-pressed={selected}
                className="flex min-w-0 flex-1 gap-3 rounded-xl text-left"
              >
                {item.previewUrl ? (
                  // User files are local blob URLs, which next/image cannot optimize.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.previewUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
                ) : (
                  <span className="grid h-16 w-16 place-items-center rounded-lg bg-paper text-xs text-muted">
                    Image
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{item.name}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {formatBytes(item.originalSize)}
                    {dimensions ? ` · ${dimensions}` : ""}
                    {item.format ? ` · ${formatLabel(item.format)}` : ""}
                  </span>
                  <span className="mt-1 block text-sm">{statusText(item)}</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="min-h-11 shrink-0 self-start rounded-lg px-2 text-sm font-semibold text-muted"
              >
                Remove
              </button>
            </div>
            {item.notice ? <p className="mt-2 text-sm text-muted">{item.notice}</p> : null}
            {item.status === "error" ? (
              <p className="mt-2 text-sm text-danger" role="alert">
                {item.error}
              </p>
            ) : null}
            {item.status === "compressing" ? (
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-paper"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={item.progress}
                aria-label={`Compression progress for ${item.name}`}
              >
                <div className="h-full bg-accent" style={{ width: `${item.progress}%` }} />
              </div>
            ) : null}
            {item.status === "done" && item.result ? (
              <button
                type="button"
                onClick={() => onDownload(item)}
                className="mt-3 min-h-11 rounded-xl px-2 text-sm font-semibold text-accent"
              >
                Download
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
