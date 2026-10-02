"use client";

import { ComparisonView } from "@/components/preview/ComparisonView";
import { buttonClass } from "@/components/ui/Button";
import { messages } from "@/lib/compression/errors";
import { formatLabel } from "@/lib/compression/formats";
import { formatBytes, formatPercent } from "@/lib/format/bytes";
import type { QueueItem } from "@/components/compression/queue";

export function ResultPanel({
  item,
  canDownloadAll,
  zipPending,
  zipError,
  onDownload,
  onDownloadAll,
}: {
  item: QueueItem;
  canDownloadAll: boolean;
  zipPending: boolean;
  zipError: string | null;
  onDownload: () => void;
  onDownloadAll: () => void;
}) {
  const result = item.result;
  const originalUrl = item.previewUrl;
  if (!result || !originalUrl || !item.resultUrl) return null;

  const reduced = result.savedBytes >= 0;

  return (
    <section aria-live="polite" className="rounded-2xl border border-line bg-card p-4 shadow-card">
      <h2 className="font-serif text-2xl">Compression complete</h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-muted">Original</dt>
          <dd className="text-base font-semibold">{formatBytes(result.originalSize)}</dd>
        </div>
        <div>
          <dt className="text-muted">Compressed</dt>
          <dd className="text-base font-semibold">{formatBytes(result.compressedSize)}</dd>
        </div>
        <div>
          <dt className="text-muted">{reduced ? "Saved" : "Larger by"}</dt>
          <dd className="text-base font-semibold">
            {formatBytes(Math.abs(result.savedBytes))} ({formatPercent(Math.abs(result.savingsPercentage))})
          </dd>
        </div>
        <div>
          <dt className="text-muted">Quality</dt>
          <dd className="text-base font-semibold">{result.keptOriginal ? "Original" : `${result.quality}%`}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-muted">
        {result.originalWidth} × {result.originalHeight} {formatLabel(result.originalFormat)} to {result.width} ×{" "}
        {result.height} {formatLabel(result.outputFormat)}
      </p>
      {result.keptOriginal ? <p className="mt-2 text-sm text-muted">{messages.keptOriginal}</p> : null}
      {result.metTarget === false ? <p className="mt-2 text-sm text-muted">{messages.targetMissed}</p> : null}
      {result.dimensionLimited ? <p className="mt-2 text-sm text-muted">{messages.dimensionLimited}</p> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={buttonClass("primary")} onClick={onDownload}>
          Download
        </button>
        {canDownloadAll ? (
          <button type="button" className={buttonClass("secondary")} onClick={onDownloadAll} disabled={zipPending}>
            {zipPending ? "Preparing ZIP..." : "Download All"}
          </button>
        ) : null}
      </div>
      {zipError ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {zipError}
        </p>
      ) : null}
      <div className="mt-5">
        <ComparisonView originalUrl={originalUrl} resultUrl={item.resultUrl} result={result} />
      </div>
    </section>
  );
}
