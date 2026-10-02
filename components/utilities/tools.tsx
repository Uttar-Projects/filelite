"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/utilities/CopyButton";
import { buttonClass } from "@/components/ui/Button";
import { decodeBase64, encodeBase64 } from "@/lib/utilities/base64";
import { convertCase, type CaseMode } from "@/lib/utilities/case";
import { formatHsl, hslToRgb, parseHex, rgbToHex, rgbToHsl } from "@/lib/utilities/color";
import { diffLines } from "@/lib/utilities/diff";
import { formatJson } from "@/lib/utilities/json";
import { generateLorem, type LoremMode } from "@/lib/utilities/lorem";
import { markdownToHtml } from "@/lib/utilities/markdown";
import { generatePassword } from "@/lib/utilities/password";
import { slugify } from "@/lib/utilities/slug";
import { analyzeText } from "@/lib/utilities/text-stats";
import { fromDateInput, fromUnixInput } from "@/lib/utilities/timestamp";
import { convertUnit, unitGroups, type UnitKind } from "@/lib/utilities/units";
import { decodeUrl, encodeUrl } from "@/lib/utilities/url";

const area = "min-h-48 w-full rounded-xl border border-line bg-paper p-3 font-mono text-sm";
const field = "h-11 w-full rounded-xl border border-line bg-paper px-3 text-base";

export function WordCounterTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <label className="block">
        <span className="text-sm font-semibold">Text</span>
        <textarea className={`${area} mt-2`} value={text} onChange={(event) => setText(event.target.value)} />
      </label>
      <dl className="space-y-3 rounded-2xl border border-line bg-card p-4 text-sm">
        <div><dt className="text-muted">Words</dt><dd className="text-lg font-semibold">{stats.words}</dd></div>
        <div><dt className="text-muted">Characters</dt><dd>{stats.characters}</dd></div>
        <div><dt className="text-muted">Without spaces</dt><dd>{stats.charactersNoSpaces}</dd></div>
        <div><dt className="text-muted">Sentences</dt><dd>{stats.sentences}</dd></div>
        <div><dt className="text-muted">Paragraphs</dt><dd>{stats.paragraphs}</dd></div>
        <div><dt className="text-muted">Reading time</dt><dd>{stats.readingMinutes < 1 ? `${Math.max(1, Math.round(stats.readingMinutes * 60))} sec` : `${stats.readingMinutes.toFixed(1)} min`}</dd></div>
        <div>
          <dt className="text-muted">Keyword density</dt>
          <dd className="mt-1 space-y-1">
            {stats.keywords.length === 0 ? "—" : stats.keywords.map((item) => (
              <p key={item.word}>{item.word}: {item.count} ({item.density.toFixed(1)}%)</p>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function CaseConverterTool() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<CaseMode>("title");
  const result = convertCase(text, mode);
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">
        Case
        <select className={`${field} mt-2`} value={mode} onChange={(event) => setMode(event.target.value as CaseMode)}>
          <option value="upper">UPPER CASE</option>
          <option value="lower">lower case</option>
          <option value="title">Title Case</option>
          <option value="sentence">Sentence case</option>
          <option value="camel">camelCase</option>
          <option value="pascal">PascalCase</option>
          <option value="snake">snake_case</option>
          <option value="kebab">kebab-case</option>
          <option value="constant">CONSTANT_CASE</option>
        </select>
      </label>
      <textarea className={area} value={text} onChange={(event) => setText(event.target.value)} aria-label="Source text" />
      <textarea className={area} value={result} readOnly aria-label="Converted text" />
      <CopyButton value={result} />
    </div>
  );
}

export function SlugTool() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState("-");
  const slug = slugify(text, separator);
  return (
    <div className="space-y-3">
      <textarea className={area} value={text} onChange={(event) => setText(event.target.value)} aria-label="Title" />
      <label className="block text-sm font-semibold">
        Separator
        <select className={`${field} mt-2`} value={separator} onChange={(event) => setSeparator(event.target.value)}>
          <option value="-">Hyphen</option>
          <option value="_">Underscore</option>
        </select>
      </label>
      <p className="rounded-xl border border-line bg-card px-3 py-3 font-mono text-sm">{slug || "—"}</p>
      <CopyButton value={slug} />
    </div>
  );
}

export function LoremTool() {
  const [mode, setMode] = useState<LoremMode>("paragraphs");
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [text, setText] = useState(() => generateLorem("paragraphs", 3, true));
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-semibold">
          Mode
          <select className={`${field} mt-2`} value={mode} onChange={(event) => setMode(event.target.value as LoremMode)}>
            <option value="paragraphs">Paragraphs</option>
            <option value="words">Words</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Count
          <input className={`${field} mt-2`} type="number" min={1} max={40} value={count} onChange={(event) => setCount(Number(event.target.value))} />
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" checked={classic} onChange={(event) => setClassic(event.target.checked)} />
          Start with Lorem ipsum
        </label>
      </div>
      <button type="button" className={buttonClass("primary")} onClick={() => setText(generateLorem(mode, count, classic))}>
        Generate
      </button>
      <textarea className={area} value={text} readOnly aria-label="Generated text" />
      <CopyButton value={text} />
    </div>
  );
}

export function DiffTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const rows = useMemo(() => diffLines(left, right), [left, right]);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-semibold">Original<textarea className={`${area} mt-2`} value={left} onChange={(event) => setLeft(event.target.value)} /></label>
        <label className="text-sm font-semibold">Changed<textarea className={`${area} mt-2`} value={right} onChange={(event) => setRight(event.target.value)} /></label>
      </div>
      <ol className="overflow-x-auto rounded-2xl border border-line bg-card font-mono text-sm">
        {rows.map((row, index) => (
          <li
            key={`${row.kind}-${index}`}
            className={row.kind === "add" ? "bg-emerald-500/15" : row.kind === "remove" ? "bg-red-500/15" : ""}
          >
            <span className="inline-block w-8 px-2 text-muted">{row.kind === "add" ? "+" : row.kind === "remove" ? "−" : " "}</span>
            <span>{row.text || " "}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function MarkdownTool() {
  const [source, setSource] = useState("# Heading\n\nWrite **Markdown** here.");
  const html = useMemo(() => markdownToHtml(source), [source]);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="text-sm font-semibold">Markdown<textarea className={`${area} mt-2 min-h-80`} value={source} onChange={(event) => setSource(event.target.value)} /></label>
      <div>
        <p className="text-sm font-semibold">Preview</p>
        <div className="prose-reset mt-2 min-h-80 rounded-xl border border-line bg-card p-4 text-sm leading-6 [&_a]:text-accent [&_code]:rounded [&_code]:bg-paper [&_code]:px-1 [&_h1]:mb-3 [&_h1]:text-2xl [&_h2]:mb-2 [&_h2]:text-xl [&_li]:ml-5 [&_li]:list-disc [&_pre]:overflow-x-auto [&_pre]:bg-paper [&_pre]:p-3" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

export function JsonTool() {
  const [input, setInput] = useState('{"hello":"world"}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run(minify: boolean) {
    const result = formatJson(input, minify);
    if (result.ok) {
      setOutput(result.text);
      setError(null);
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="space-y-3">
      <textarea className={area} value={input} onChange={(event) => setInput(event.target.value)} aria-label="JSON input" />
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass("primary")} onClick={() => run(false)}>Format</button>
        <button type="button" className={buttonClass("secondary")} onClick={() => run(true)}>Minify</button>
        <CopyButton value={output} />
      </div>
      {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
      <textarea className={area} value={output} readOnly aria-label="JSON output" />
    </div>
  );
}

export function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <textarea className={area} value={input} onChange={(event) => setInput(event.target.value)} aria-label="Input" />
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass("primary")} onClick={() => { setOutput(encodeBase64(input)); setError(null); }}>Encode</button>
        <button type="button" className={buttonClass("secondary")} onClick={() => {
          const result = decodeBase64(input);
          if (result.ok) { setOutput(result.text); setError(null); } else { setError(result.message); }
        }}>Decode</button>
        <CopyButton value={output} />
      </div>
      {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
      <textarea className={area} value={output} readOnly aria-label="Output" />
    </div>
  );
}

export function UrlTool() {
  const [input, setInput] = useState("");
  const [component, setComponent] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={component} onChange={(event) => setComponent(event.target.checked)} />
        Encode as a query component
      </label>
      <textarea className={area} value={input} onChange={(event) => setInput(event.target.value)} aria-label="URL input" />
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass("primary")} onClick={() => { setOutput(encodeUrl(input, component)); setError(null); }}>Encode</button>
        <button type="button" className={buttonClass("secondary")} onClick={() => {
          const result = decodeUrl(input);
          if (result.ok) { setOutput(result.text); setError(null); } else { setError(result.message); }
        }}>Decode</button>
        <CopyButton value={output} />
      </div>
      {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
      <textarea className={area} value={output} readOnly aria-label="URL output" />
    </div>
  );
}

export function UuidTool() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState("");
  const [error, setError] = useState<string | null>(null);

  function generate() {
    if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
      setError("This browser cannot create UUIDs.");
      return;
    }
    const n = Math.min(200, Math.max(1, Math.round(count)));
    setList(Array.from({ length: n }, () => crypto.randomUUID()).join("\n"));
    setError(null);
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold">How many<input className={`${field} mt-2 max-w-32`} type="number" min={1} max={200} value={count} onChange={(event) => setCount(Number(event.target.value))} /></label>
      <button type="button" className={buttonClass("primary")} onClick={generate}>Generate</button>
      {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
      <textarea className={area} value={list} readOnly aria-label="UUIDs" />
      <CopyButton value={list} />
    </div>
  );
}

export function TimestampTool() {
  const [unix, setUnix] = useState("");
  const [date, setDate] = useState("");
  const fromUnix = fromUnixInput(unix);
  const fromDate = fromDateInput(date);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-semibold">Unix timestamp<input className={`${field} mt-2`} value={unix} onChange={(event) => setUnix(event.target.value)} inputMode="numeric" /></label>
        {"error" in fromUnix ? <p className="mt-2 text-sm text-muted">{fromUnix.error}</p> : (
          <dl className="mt-3 space-y-1 text-sm">
            <div>Seconds: {fromUnix.unixSeconds}</div>
            <div>Milliseconds: {fromUnix.unixMillis}</div>
            <div>ISO: {fromUnix.iso}</div>
            <div>UTC: {fromUnix.utc}</div>
            <div>Local: {fromUnix.local}</div>
          </dl>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold">Date and time<input className={`${field} mt-2`} type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        {"error" in fromDate ? <p className="mt-2 text-sm text-muted">{fromDate.error}</p> : (
          <dl className="mt-3 space-y-1 text-sm">
            <div>Seconds: {fromDate.unixSeconds}</div>
            <div>Milliseconds: {fromDate.unixMillis}</div>
            <div>ISO: {fromDate.iso}</div>
          </dl>
        )}
      </div>
    </div>
  );
}

export function PasswordTool() {
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [password, setPassword] = useState("");

  function random() {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const buffer = new Uint32Array(1);
      crypto.getRandomValues(buffer);
      return (buffer[0] ?? 0) / 2 ** 32;
    }
    return Math.random();
  }

  function generate() {
    setPassword(generatePassword({ length, upper, lower, numbers, symbols, excludeSimilar }, random));
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold">Length: {length}
        <input className="mt-2 w-full" type="range" min={8} max={64} value={length} onChange={(event) => setLength(Number(event.target.value))} />
      </label>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <label className="flex gap-2"><input type="checkbox" checked={upper} onChange={(event) => setUpper(event.target.checked)} /> Uppercase</label>
        <label className="flex gap-2"><input type="checkbox" checked={lower} onChange={(event) => setLower(event.target.checked)} /> Lowercase</label>
        <label className="flex gap-2"><input type="checkbox" checked={numbers} onChange={(event) => setNumbers(event.target.checked)} /> Numbers</label>
        <label className="flex gap-2"><input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} /> Symbols</label>
        <label className="flex gap-2 sm:col-span-2"><input type="checkbox" checked={excludeSimilar} onChange={(event) => setExcludeSimilar(event.target.checked)} /> Exclude similar characters (0 O 1 l I)</label>
      </div>
      <button type="button" className={buttonClass("primary")} onClick={generate}>Generate</button>
      <p className="break-all rounded-xl border border-line bg-card px-3 py-3 font-mono">{password || "—"}</p>
      <CopyButton value={password} />
    </div>
  );
}

export function HashTool() {
  const [text, setText] = useState("");
  const [algo, setAlgo] = useState<"SHA-1" | "SHA-256" | "SHA-512">("SHA-256");
  const [hash, setHash] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!text) {
        setHash("");
        setError(null);
        return;
      }
      if (typeof crypto === "undefined" || !crypto.subtle) {
        setError("Web Crypto is not available in this browser.");
        return;
      }
      try {
        const bytes = new TextEncoder().encode(text);
        const digest = await crypto.subtle.digest(algo, bytes);
        const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
        if (!cancelled) {
          setHash(hex);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("The hash could not be created.");
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [text, algo]);

  return (
    <div className="space-y-3">
      <textarea className={area} value={text} onChange={(event) => setText(event.target.value)} aria-label="Text to hash" />
      <label className="text-sm font-semibold">Algorithm
        <select className={`${field} mt-2`} value={algo} onChange={(event) => setAlgo(event.target.value as typeof algo)}>
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </label>
      {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
      <p className="break-all rounded-xl border border-line bg-card px-3 py-3 font-mono text-sm">{hash || "—"}</p>
      <CopyButton value={hash} />
    </div>
  );
}

export function ColorTool() {
  const [hex, setHex] = useState("#0e5c56");
  const rgb = parseHex(hex) ?? { r: 14, g: 92, b: 86 };
  const hsl = rgbToHsl(rgb);

  function applyRgb(next: { r: number; g: number; b: number }) {
    setHex(rgbToHex(next));
  }

  return (
    <div className="grid gap-4 md:grid-cols-[12rem_minmax(0,1fr)]">
      <div className="h-40 rounded-2xl border border-line" style={{ background: rgbToHex(rgb) }} aria-label="Color preview" />
      <div className="space-y-3">
        <label className="text-sm font-semibold">HEX<input className={`${field} mt-2`} value={hex} onChange={(event) => setHex(event.target.value)} /></label>
        <div className="grid grid-cols-3 gap-2">
          {(["r", "g", "b"] as const).map((key) => (
            <label key={key} className="text-sm font-semibold">{key.toUpperCase()}
              <input className={`${field} mt-2`} type="number" min={0} max={255} value={rgb[key]} onChange={(event) => applyRgb({ ...rgb, [key]: Number(event.target.value) })} />
            </label>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <label className="text-sm font-semibold">H<input className={`${field} mt-2`} type="number" value={Math.round(hsl.h)} onChange={(event) => applyRgb(hslToRgb({ ...hsl, h: Number(event.target.value) }))} /></label>
          <label className="text-sm font-semibold">S<input className={`${field} mt-2`} type="number" value={Math.round(hsl.s)} onChange={(event) => applyRgb(hslToRgb({ ...hsl, s: Number(event.target.value) }))} /></label>
          <label className="text-sm font-semibold">L<input className={`${field} mt-2`} type="number" value={Math.round(hsl.l)} onChange={(event) => applyRgb(hslToRgb({ ...hsl, l: Number(event.target.value) }))} /></label>
        </div>
        <p className="text-sm text-muted">{rgbToHex(rgb)} · rgb({rgb.r} {rgb.g} {rgb.b}) · {formatHsl(hsl)}</p>
        <CopyButton value={rgbToHex(rgb)} label="Copy HEX" />
      </div>
    </div>
  );
}

export function UnitTool() {
  const [kind, setKind] = useState<UnitKind>("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [value, setValue] = useState(1);
  const units = unitGroups[kind];
  const result = convertUnit(kind, value, from, to);

  function changeKind(next: UnitKind) {
    setKind(next);
    const group = unitGroups[next];
    setFrom(group[0]?.id ?? "");
    setTo(group[1]?.id ?? group[0]?.id ?? "");
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold">Category
        <select className={`${field} mt-2`} value={kind} onChange={(event) => changeKind(event.target.value as UnitKind)}>
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="temperature">Temperature</option>
          <option value="data">Data</option>
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-semibold">Value<input className={`${field} mt-2`} type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} /></label>
        <label className="text-sm font-semibold">From
          <select className={`${field} mt-2`} value={from} onChange={(event) => setFrom(event.target.value)}>
            {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.label}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">To
          <select className={`${field} mt-2`} value={to} onChange={(event) => setTo(event.target.value)}>
            {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.label}</option>)}
          </select>
        </label>
      </div>
      <p className="text-2xl font-semibold">{result === null ? "—" : Number(result.toPrecision(6))}</p>
    </div>
  );
}
