"use client";

import { useId, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.gif,.heic,.heif";

export function DropZone({
  onFiles,
  onDemo,
  demoPending,
}: {
  onFiles: (files: File[]) => void;
  onDemo: () => void;
  demoPending: boolean;
}) {
  const inputId = useId();
  const depth = useRef(0);
  const [dragging, setDragging] = useState(false);

  function takeFiles(list: FileList | null) {
    const files = Array.from(list ?? []);
    if (files.length > 0) onFiles(files);
  }

  return (
    <div>
      <div
        className={cn(
          "rounded-2xl border border-dashed bg-card shadow-card transition-colors",
          dragging ? "border-accent bg-accent/10" : "border-line",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          depth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          depth.current -= 1;
          if (depth.current <= 0) {
            depth.current = 0;
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          depth.current = 0;
          setDragging(false);
          takeFiles(event.dataTransfer.files);
        }}
      >
        <div className="flex min-h-60 flex-col items-center justify-center px-6 py-10 text-center">
          <p className="font-serif text-2xl">Drop images here</p>
          <p className="mt-2 text-sm text-muted">or</p>
          <label htmlFor={inputId} className={`${buttonClass("primary")} mt-4 cursor-pointer`}>
            Upload Images
          </label>
          <p className="mt-3 text-sm text-muted">Choose images, or paste one from the clipboard.</p>
          <input
            id={inputId}
            className="sr-only"
            type="file"
            accept={ACCEPT}
            multiple
            onChange={(event) => {
              takeFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <p className="mt-4 text-sm text-muted" aria-live="polite">
            {dragging ? "Release to add the images." : "Drag and drop images here or click to browse."}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className={buttonClass("secondary")} onClick={onDemo} disabled={demoPending}>
          {demoPending ? "Loading demo..." : "Try a Demo"}
        </button>
        <p className="text-sm text-muted">Your images are processed locally in your browser.</p>
      </div>
    </div>
  );
}
