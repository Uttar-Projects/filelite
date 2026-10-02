"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SettingsPanel } from "@/components/compression/SettingsPanel";
import type { QueueItem } from "@/components/compression/queue";
import { ResultPanel } from "@/components/results/ResultPanel";
import { buttonClass } from "@/components/ui/Button";
import { DropZone } from "@/components/upload/DropZone";
import { QueueList } from "@/components/upload/QueueList";
import { track } from "@/lib/analytics/analytics";
import { compressImage } from "@/lib/compression/compress";
import { CompressionError, messages, toUserMessage } from "@/lib/compression/errors";
import { readImageDimensions } from "@/lib/compression/dimensions";
import { mimeFromFormat } from "@/lib/compression/formats";
import {
  resolveTargetBytes,
  settingsFromPreset,
  type CompressorPreset,
  type CompressorSettings,
} from "@/lib/compression/settings";
import { detectEncodeSupport } from "@/lib/compression/support";
import type { EncodeSupport } from "@/lib/compression/types";
import { MAX_BATCH, MAX_SOURCE_PIXELS } from "@/lib/constants";
import { createZipBlob, downloadBlob } from "@/lib/download/download";
import { buildOutputFilename, sanitizeFilename } from "@/lib/format/filename";
import { siteConfig } from "@/lib/seo/site";
import { validateImageFile } from "@/lib/validation/image-file";

function patchItem(items: QueueItem[], id: string, patch: Partial<QueueItem>): QueueItem[] {
  if (!items.some((item) => item.id === id)) {
    if (patch.previewUrl) URL.revokeObjectURL(patch.previewUrl);
    if (patch.resultUrl) URL.revokeObjectURL(patch.resultUrl);
    return items;
  }
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

function clipboardFiles(event: ClipboardEvent): File[] {
  const files = Array.from(event.clipboardData?.files ?? []);
  if (files.length > 0) return files;
  const items = Array.from(event.clipboardData?.items ?? []);
  return items
    .filter((item) => item.kind === "file")
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);
}

export function Compressor({ preset }: { preset?: CompressorPreset }) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [settings, setSettings] = useState<CompressorSettings>(() => settingsFromPreset(preset));
  const [support, setSupport] = useState<EncodeSupport>({ webp: true, avif: false });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [demoPending, setDemoPending] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);
  const [zipPending, setZipPending] = useState(false);
  const itemsRef = useRef(items);
  const removedRef = useRef(new Set<string>());
  const runRef = useRef(0);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    let cancelled = false;
    detectEncodeSupport().then((next) => {
      if (!cancelled) setSupport(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
      }
    };
  }, []);

  const addFiles = useCallback(async (files: File[]) => {
    const room = MAX_BATCH - itemsRef.current.length;
    if (room <= 0) {
      setBanner(messages.batchSkipped);
      return;
    }
    const accepted = files.slice(0, room);
    if (accepted.length < files.length) setBanner(messages.batchSkipped);
    else setBanner(null);

    track("upload_started", { count: accepted.length });
    const prepared: QueueItem[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: sanitizeFilename(file.name || "image"),
      originalSize: file.size,
      status: "preparing",
      progress: 0,
    }));
    setItems((current) => [...current, ...prepared]);

    for (const item of prepared) {
      const validation = await validateImageFile(item.file);
      if (removedRef.current.has(item.id)) continue;
      if (!validation.ok) {
        setItems((current) =>
          patchItem(current, item.id, { status: "error", error: validation.message, progress: 0 }),
        );
        continue;
      }

      try {
        const dimensions = await readImageDimensions(item.file);
        if (removedRef.current.has(item.id)) continue;
        if (dimensions.width * dimensions.height > MAX_SOURCE_PIXELS) {
          setItems((current) => patchItem(current, item.id, { status: "error", error: messages.tooLarge }));
          continue;
        }
        const previewUrl = URL.createObjectURL(item.file);
        const notice =
          validation.format === "gif"
            ? messages.gifFlat
            : validation.format === "heic"
              ? messages.heicNotice
              : undefined;
        setItems((current) =>
          patchItem(current, item.id, {
            status: "ready",
            format: validation.format,
            width: dimensions.width,
            height: dimensions.height,
            previewUrl,
            notice,
            progress: 0,
          }),
        );
      } catch (error) {
        const message =
          validation.format === "heic" || validation.format === "avif"
            ? toUserMessage(error) === messages.memory
              ? messages.memory
              : messages.unsupportedBrowserFormat
            : toUserMessage(error);
        setItems((current) => patchItem(current, item.id, { status: "error", error: message }));
      }
    }
  }, []);

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea")) return;
      const files = clipboardFiles(event);
      if (files.length === 0) return;
      event.preventDefault();
      void addFiles(files);
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles]);

  function removeItem(id: string) {
    removedRef.current.add(id);
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item?.resultUrl) URL.revokeObjectURL(item.resultUrl);
      return current.filter((entry) => entry.id !== id);
    });
    setSelectedId((current) => (current === id ? null : current));
  }

  function downloadItem(item: QueueItem) {
    if (!item.result) return;
    const filename = buildOutputFilename(item.name, item.result.outputMime || mimeFromFormat(item.result.outputFormat));
    downloadBlob(item.result.blob, filename);
    track("download_clicked", { format: item.result.outputFormat });
  }

  async function downloadAll() {
    const done = itemsRef.current.filter((item) => item.status === "done" && item.result);
    if (done.length === 0) return;
    setZipError(null);
    setZipPending(true);
    try {
      const blob = await createZipBlob(
        done.map((item) => ({
          name: buildOutputFilename(item.name, item.result?.outputMime || "image/jpeg"),
          blob: item.result!.blob,
        })),
      );
      downloadBlob(blob, `${siteConfig.slug}-compressed.zip`);
      track("batch_download", { count: done.length });
    } catch (error) {
      setZipError(error instanceof CompressionError ? error.userMessage : messages.zipTooLarge);
    } finally {
      setZipPending(false);
    }
  }

  async function compressAll() {
    const target = resolveTargetBytes(settings);
    if (target.error) {
      setBanner(target.error);
      return;
    }
    const workable = itemsRef.current.filter(
      (item) => (item.status === "ready" || item.status === "done") && item.width && item.height && item.format,
    );
    if (workable.length === 0) {
      setBanner("Add a supported image before compressing.");
      return;
    }

    setBanner(null);
    setZipError(null);
    setBusy(true);
    const runId = ++runRef.current;
    if (target.bytes) track("target_size_used", { bytes: target.bytes });

    for (const item of workable) {
      if (runRef.current !== runId || removedRef.current.has(item.id)) continue;
      setItems((current) => patchItem(current, item.id, { status: "compressing", progress: 8, error: undefined }));
      track("compression_started", { format: item.format ?? "unknown" });
      try {
        const result = await compressImage(
          item.file,
          {
            quality: settings.quality,
            outputFormat: settings.outputFormat,
            resizeMode: settings.resizeMode,
            resizeValue: settings.resizeValue,
            maintainAspectRatio: settings.maintainAspectRatio,
            targetSizeBytes: target.bytes,
            encodeSupport: support,
          },
          {
            onProgress: (progress) => {
              setItems((current) => patchItem(current, item.id, { progress }));
            },
          },
        );
        if (runRef.current !== runId || removedRef.current.has(item.id)) continue;
        const resultUrl = URL.createObjectURL(result.blob);
        setItems((current) => {
          const previous = current.find((entry) => entry.id === item.id);
          if (previous?.resultUrl) URL.revokeObjectURL(previous.resultUrl);
          return patchItem(current, item.id, { status: "done", progress: 100, result, resultUrl, error: undefined });
        });
        setSelectedId(item.id);
        track("compression_completed", {
          format: result.outputFormat,
          quality: result.quality,
          savings: Math.round(result.savingsPercentage),
        });
        if (result.originalFormat !== result.outputFormat) {
          track("format_conversion", { from: result.originalFormat, to: result.outputFormat });
        }
      } catch (error) {
        const message = toUserMessage(error);
        setItems((current) => patchItem(current, item.id, { status: "error", error: message, progress: 0 }));
        track("compression_failed", { reason: message.slice(0, 80) });
      }
    }

    if (runRef.current === runId) setBusy(false);
  }

  async function loadDemo() {
    setDemoPending(true);
    setBanner(null);
    try {
      const response = await fetch("/images/demo-photo.png");
      if (!response.ok) throw new Error("demo missing");
      const blob = await response.blob();
      const file = new File([blob], "demo-photo.png", { type: "image/png" });
      await addFiles([file]);
    } catch {
      setBanner("The demo image could not be loaded.");
    } finally {
      setDemoPending(false);
    }
  }

  const selected =
    items.find((item) => item.id === selectedId && item.status === "done" && item.result) ??
    [...items].reverse().find((item) => item.status === "done" && item.result);
  const doneCount = items.filter((item) => item.status === "done" && item.result).length;
  const readyCount = items.filter((item) => item.status === "ready" || item.status === "done").length;

  return (
    <div className="space-y-6">
      <DropZone onFiles={(files) => void addFiles(files)} onDemo={() => void loadDemo()} demoPending={demoPending} />
      {banner ? (
        <p className="text-sm text-danger" role="alert">
          {banner}
        </p>
      ) : null}
      {items.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <SettingsPanel settings={settings} support={support} disabled={busy} onChange={setSettings} />
          <div className="space-y-4">
            <QueueList
              items={items}
              selectedId={selected?.id ?? null}
              onSelect={setSelectedId}
              onRemove={removeItem}
              onDownload={downloadItem}
            />
            <button
              type="button"
              className={buttonClass("primary")}
              onClick={() => void compressAll()}
              disabled={busy || readyCount === 0}
            >
              {busy ? "Compressing..." : readyCount > 1 ? `Compress ${readyCount} images` : "Compress image"}
            </button>
          </div>
        </div>
      ) : null}
      {selected ? (
        <ResultPanel
          item={selected}
          canDownloadAll={doneCount > 1}
          zipPending={zipPending}
          zipError={zipError}
          onDownload={() => downloadItem(selected)}
          onDownloadAll={() => void downloadAll()}
        />
      ) : null}
    </div>
  );
}
