"use client";

import { messages } from "@/lib/compression/errors";
import {
  type CompressorSettings,
  type TargetUnit,
} from "@/lib/compression/settings";
import type { EncodeSupport, OutputFormatChoice, ResizeMode } from "@/lib/compression/types";

const fieldClass =
  "h-11 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink";

const resizeModes: { value: ResizeMode; label: string }[] = [
  { value: "original", label: "Original size" },
  { value: "width", label: "Custom width" },
  { value: "height", label: "Custom height" },
  { value: "maxWidth", label: "Maximum width" },
  { value: "maxHeight", label: "Maximum height" },
  { value: "percentage", label: "Percentage" },
];

export function SettingsPanel({
  settings,
  support,
  disabled,
  onChange,
}: {
  settings: CompressorSettings;
  support: EncodeSupport;
  disabled: boolean;
  onChange: (settings: CompressorSettings) => void;
}) {
  const showSize = settings.resizeMode !== "original";
  const showAspect = settings.resizeMode === "width" || settings.resizeMode === "height";
  const sizeLabel =
    settings.resizeMode === "percentage"
      ? "Percentage"
      : settings.resizeMode === "height" || settings.resizeMode === "maxHeight"
        ? "Height in pixels"
        : "Width in pixels";

  function setMode(resizeMode: ResizeMode) {
    onChange({
      ...settings,
      resizeMode,
      resizeValue: resizeMode === "percentage" ? 80 : 1920,
    });
  }

  return (
    <fieldset disabled={disabled} className="space-y-5 rounded-2xl border border-line bg-card p-4 shadow-card disabled:opacity-70">
      <legend className="px-1 text-sm font-semibold">Compression settings</legend>
      <div>
        <label htmlFor="quality" className="text-sm font-semibold">
          Quality: {settings.quality}%
        </label>
        <input
          id="quality"
          className="mt-2 w-full"
          type="range"
          min={10}
          max={100}
          step={1}
          value={settings.quality}
          aria-valuetext={`${settings.quality}%`}
          onChange={(event) => onChange({ ...settings, quality: Number(event.target.value) })}
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>10</span>
          <span>100</span>
        </div>
        <p className="mt-2 text-sm text-muted">{messages.pngQuality}</p>
      </div>

      <div>
        <label htmlFor="output-format" className="text-sm font-semibold">
          Output format
        </label>
        <select
          id="output-format"
          className={`${fieldClass} mt-2`}
          value={settings.outputFormat}
          onChange={(event) =>
            onChange({ ...settings, outputFormat: event.target.value as OutputFormatChoice })
          }
        >
          <option value="auto">Automatic</option>
          <option value="jpeg">JPG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
          <option value="avif">AVIF</option>
        </select>
        {!support.avif ? (
          <p className="mt-2 text-sm text-muted">
            AVIF encoding is unavailable in this browser. Choose JPG, PNG, or WebP.
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="resize-mode" className="text-sm font-semibold">
          Resize
        </label>
        <select
          id="resize-mode"
          className={`${fieldClass} mt-2`}
          value={settings.resizeMode}
          onChange={(event) => setMode(event.target.value as ResizeMode)}
        >
          {resizeModes.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
        {showSize ? (
          <div className="mt-3">
            <label htmlFor="resize-value" className="text-sm font-semibold">
              {sizeLabel}
            </label>
            <input
              id="resize-value"
              className={`${fieldClass} mt-2`}
              type="number"
              min={1}
              inputMode="numeric"
              value={settings.resizeValue}
              onChange={(event) => onChange({ ...settings, resizeValue: Number(event.target.value) })}
            />
          </div>
        ) : null}
        {showAspect ? (
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={settings.maintainAspectRatio}
              onChange={(event) => onChange({ ...settings, maintainAspectRatio: event.target.checked })}
            />
            Maintain aspect ratio
          </label>
        ) : (
          <p className="mt-2 text-sm text-muted">Maximum width, maximum height, and percentage keep the aspect ratio.</p>
        )}
      </div>

      <div>
        <label htmlFor="target-size" className="text-sm font-semibold">
          Compress to approximately
        </label>
        <select
          id="target-size"
          className={`${fieldClass} mt-2`}
          value={settings.targetPreset}
          onChange={(event) =>
            onChange({
              ...settings,
              targetPreset: event.target.value as CompressorSettings["targetPreset"],
            })
          }
        >
          <option value="none">No target size</option>
          <option value="5mb">Under 5 MB</option>
          <option value="2mb">Under 2 MB</option>
          <option value="1mb">Under 1 MB</option>
          <option value="500kb">Under 500 KB</option>
          <option value="custom">Custom</option>
        </select>
        {settings.targetPreset === "custom" ? (
          <div className="mt-3 grid grid-cols-[1fr_6rem] gap-2">
            <input
              aria-label="Custom target size"
              className={fieldClass}
              type="number"
              min={1}
              step="0.1"
              value={settings.customTarget}
              onChange={(event) => onChange({ ...settings, customTarget: Number(event.target.value) })}
            />
            <select
              aria-label="Target size unit"
              className={fieldClass}
              value={settings.customUnit}
              onChange={(event) => onChange({ ...settings, customUnit: event.target.value as TargetUnit })}
            >
              <option value="KB">KB</option>
              <option value="MB">MB</option>
            </select>
          </div>
        ) : null}
        <p className="mt-2 text-sm text-muted">{messages.targetVariance}</p>
        {settings.targetPreset !== "none" && settings.outputFormat === "png" ? (
          <p className="mt-2 text-sm text-muted">{messages.pngTarget}</p>
        ) : null}
      </div>
    </fieldset>
  );
}
