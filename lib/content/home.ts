import type { FaqItem } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";

const brand = siteConfig.name;

export const homeFaqs: FaqItem[] = [
  {
    question: "How do I compress an image?",
    answer:
      "Add one or more images, choose a quality level and output format, then press Compress. When processing finishes, compare the result and download the new file. The work happens in your browser.",
  },
  {
    question: "Does image compression reduce quality?",
    answer:
      "JPG, WebP, and AVIF can use lossy compression, so a lower quality setting removes detail to save space. PNG stays lossless, which preserves pixels but often keeps the file larger. Start at 80% and lower the slider only if you need a smaller file.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "You can open JPG, PNG, WebP, AVIF, and GIF. HEIC opens only when the browser can decode it. You can save JPG, PNG, WebP, and AVIF when encoding is available. Animated GIFs are flattened to the first frame.",
  },
  {
    question: "Is the image compressor free?",
    answer:
      `Yes. ${brand} does not require an account, and the compressor does not charge for local processing.`,
  },
  {
    question: "Are my images uploaded?",
    answer:
      `Normal compression runs locally in your browser and does not send the image to a ${brand} server. The site itself is still downloaded over the network like any web page. If you later enable analytics, it records events such as compression started, not the picture.`,
  },
  {
    question: "How much can an image be compressed?",
    answer:
      "It depends on the format, dimensions, and how much detail is already in the file. A camera JPEG often shrinks further at quality 70–80. A PNG of a photo is usually much smaller after conversion to JPG or WebP. A simple logo may already be small.",
  },
  {
    question: "Can I compress multiple images?",
    answer:
      "Yes. Add a batch, use the same settings for the queue, and download each file or a ZIP. Very large batches are kept as separate downloads so the browser does not run out of memory while building the archive.",
  },
  {
    question: "Can I compress an image to 1 MB?",
    answer:
      `Choose Under 1 MB and ${brand} will lower quality until the file is near that size, without going below 10% quality. The final size can still miss the target when the image is huge or the format is lossless PNG. Resize the image or switch to JPG or WebP if you need to get closer.`,
  },
];

export const homeSteps = [
  {
    title: "Upload",
    body: "Drop images onto the page, browse for them, or paste one from the clipboard.",
  },
  {
    title: "Choose settings",
    body: "Set quality, output format, a resize rule, or an approximate target size.",
  },
  {
    title: "Compress",
    body: "The browser decodes, resizes, and encodes the image without a processing upload.",
  },
  {
    title: "Download",
    body: "Compare the before and after, then save one file or a ZIP of the batch.",
  },
];

export const whyCompress = [
  {
    title: "Website speed",
    body: "Large hero images delay the first view of a page. A smaller file with the same displayed dimensions usually loads faster.",
  },
  {
    title: "Storage",
    body: "Photo libraries, product catalogs, and design exports fill disks quickly. Compressing copies keeps originals intact while the published file stays smaller.",
  },
  {
    title: "Email attachments",
    body: "Many mail providers reject messages around 10–25 MB. A 1 MB target is a practical ceiling for a single photo attachment.",
  },
  {
    title: "Social media",
    body: "Feeds recompress uploads anyway. Starting from a reasonably sized JPEG or WebP avoids sending a 10 MB original that the network will discard.",
  },
  {
    title: "Performance",
    body: "On slow connections, image bytes are often the largest part of a page. Reducing them helps both visitors and hosting bandwidth.",
  },
];
