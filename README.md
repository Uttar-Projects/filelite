# Filelite

Filelite is a free, browser-based file-tools site. The first tools compress, resize, and convert JPG, PNG, WebP, and AVIF images on the visitor's own device. Normal compression does not upload the image to a server.

The brand name is read from `NEXT_PUBLIC_SITE_NAME` (default `Filelite`) in `lib/seo/site.ts`. Every page, FAQ, metadata string, and download filename uses that value, so renaming the site is a one-line change plus a rebuild. Search ranking still comes from page titles, unique tool URLs, and useful content — not from the brand word itself.

The app is also the foundation for a larger file-tools site. Available tools are real pages. Planned PDF and 3D tools are labeled as planned and do not link to unfinished features.

## Tech stack

- Next.js (App Router) and React
- TypeScript
- Tailwind CSS
- Canvas encoding in a Web Worker, with a main-thread fallback
- JSZip for client-side batch downloads
- Vitest for the compression, validation, and sizing logic

Sharp is not used. Encoding stays in the browser.

## Installation

```bash
npm install
npm run generate:demo
```

`generate:demo` writes `public/images/demo-photo.png`, which powers **Try a Demo**.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The upload area is on the homepage.

## Build

```bash
npm run build
npm start
```

## Testing

```bash
npm test
npm run lint
```

Unit tests cover format detection, JPEG/PNG/WebP selection, resize and aspect ratio, invalid and empty files, the file-size limit, target-size search, and compression statistics. Pixel encoding itself uses the browser canvas, so the final check is to compress a real image in Chrome, Edge, Firefox, and Safari.

## Deployment

Build the app and host it as a standard Next.js deployment (Vercel, Netlify, or any Node host that can run `next start`).

1. Copy `.env.example` and set `NEXT_PUBLIC_SITE_URL` to the live `https` origin **before** `npm run build`. Canonical URLs, Open Graph, `robots.txt`, and `/sitemap.xml` read that value at build time.
2. Keep `NEXT_PUBLIC_ADS_ENABLED` and `NEXT_PUBLIC_ANALYTICS_ENABLED` off until a provider is wired. Empty ad slots render nothing.
3. After the first deploy, open `/robots.txt` and `/sitemap.xml` and confirm every URL uses the public host, not `localhost`.
4. Submit `https://your-domain/sitemap.xml` in Google Search Console. If Search Console asks for an HTML tag, put the token in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and rebuild.
5. `/compress` permanently redirects to `/compress-image`. `/random` is noindexed and omitted from the sitemap.

No image-processing server is required for the current tools.

## Environment variables

Copy `.env.example` if you need to override the defaults.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_NAME` | Brand name shown across the site (default `Filelite`) |
| `NEXT_PUBLIC_SITE_URL` | Public origin for metadata and the sitemap |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional Search Console verification token |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Set to `true` only after a provider is registered |
| `NEXT_PUBLIC_ANALYTICS_DEBUG` | Logs events in the console when analytics is enabled |
| `NEXT_PUBLIC_ADS_ENABLED` | Turns ad slots on |
| `NEXT_PUBLIC_AD_SLOT_TOP` | Slot id for the top position |
| `NEXT_PUBLIC_AD_SLOT_CONTENT` | Slot id for the mid-page position |
| `NEXT_PUBLIC_AD_SLOT_BOTTOM` | Slot id for the footer position |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Address used by the contact page mailto draft |

Changing these public variables requires a rebuild.

## Architecture

```text
app/                  Routes, metadata, sitemap, robots
components/upload     Drop zone and queue
components/compression  Settings and compressor state
components/preview    Before/after slider
components/results    Statistics and downloads
components/layout     Header, footer, theme
components/seo        Landing pages, FAQ, structured data
lib/compression       Engine, resize math, target search, worker protocol
lib/validation        Magic-byte checks
lib/analytics         Provider-agnostic events
lib/tools             Available and planned tool catalog
workers/image-worker.ts
```

The homepage and each tool page render the same `Compressor` with a different preset. Tool copy lives in `lib/content/tool-pages.ts`, separate from the processing code.

## Image processing architecture

`compressImage(file, options)` is the UI-independent entry point.

1. The file is checked by size and magic bytes. `file.type` is not trusted on its own.
2. Output format is chosen from the selection, or kept close to the input in Automatic mode.
3. A worker receives the bytes, decodes them with `createImageBitmap`, draws a resized canvas, and encodes a blob.
4. If a target size is set for JPG, WebP, or AVIF, quality is searched from the slider value down to 10%. The highest quality under the target is kept. Exact size is not guaranteed.
5. PNG is lossless, so the quality slider does not shrink it.
6. If the worker cannot run, the same encoder runs on the main thread.
7. GIF input is flattened to the first frame. HEIC is attempted and, when the browser cannot decode it, the UI says so.

Returned fields include the blob, original and compressed sizes, dimensions, formats, compression ratio, and savings percentage.

Browser limits:

- Files larger than 40 MB are rejected.
- Source images above 48 megapixels are rejected.
- Output is capped at 8192 pixels on the long edge and 24 megapixels.

## SEO architecture

- Homepage title and description are set in `lib/seo/site.ts`.
- Each tool and category route has its own title, description, canonical path, and visible copy.
- Category landings (`/text-tools`, `/developer-tools`, `/image-tools`, and the others) are unique URLs, not query filters.
- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt`.
- `app/opengraph-image.tsx` and `app/twitter-image.tsx` generate the default share image.
- Visible FAQs and breadcrumbs are mirrored as FAQPage and BreadcrumbList structured data.
- The layout includes Organization and WebSite JSON-LD. Tool pages add WebApplication. The tools dashboard and category pages add ItemList.
- `/random` is disallowed in robots and marked `noindex`.

Add a tool by creating a content entry, a route under `app/`, and a catalog item. Do not copy one page and swap a keyword. The landing template only supplies the layout.

## Adding new tools

1. Add the tool to `lib/tools/catalog.ts` with `status: "available"` and an `href`, or `status: "planned"` with no link.
2. If it is a working page, add unique content to `lib/content/tool-pages.ts` or a new content module.
3. Add `app/<slug>/page.tsx` and include the path in `app/sitemap.ts` if it is not already derived from the content list.
4. Reuse `Compressor` when the tool is another image preset. Give a new tool its own engine module under `lib/` when the work is not image compression.

## Analytics

`lib/analytics/analytics.ts` exposes `track()` and `registerAnalyticsProvider()`. Events are ignored unless `NEXT_PUBLIC_ANALYTICS_ENABLED=true`. Register a provider from a client component when you choose a vendor. Do not send image bytes, file names, or other file contents.

Tracked events: `page_view`, `upload_started`, `compression_started`, `compression_completed`, `compression_failed`, `download_clicked`, `batch_download`, `format_conversion`, `target_size_used`.

## Monetization integration

`AdSlot` supports `top`, `content`, and `bottom`. It renders nothing until ads are enabled and that position has a slot id. The element is an empty `aside` with `data-ad-slot` so a provider can mount into it later. Do not place a slot beside a download button. The compressor stays usable with ads disabled, which is the default.

## Troubleshooting

- **AVIF output is unavailable.** The browser cannot encode AVIF. Choose JPG, PNG, or WebP.
- **HEIC fails.** Decoding depends on the browser. Export JPG from the device and try again.
- **The result is larger.** A PNG converted from a small JPEG, or a high-quality re-encode, can grow. The statistics show the increase instead of hiding it.
- **Target size was missed.** PNG cannot hit a size target through quality, and some photos cannot get small enough at 10% quality. Resize, or switch to JPG or WebP.
- **The browser ran out of memory.** Use a smaller image or fewer files. ZIP creation is refused for very large batches so the page can still download files one by one.
- **Demo image missing.** Run `npm run generate:demo`.
