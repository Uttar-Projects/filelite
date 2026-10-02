import type { CompressorPreset } from "@/lib/compression/settings";
import type { FaqItem } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";

const brand = siteConfig.name;

export type ToolPageContent = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  summary: string;
  intro: string;
  preset: CompressorPreset;
  whenToUse: string[];
  steps: string[];
  formatNotes: string;
  faqs: FaqItem[];
  related: string[];
};

export const toolPages: Record<string, ToolPageContent> = {
  "compress-image": {
    slug: "compress-image",
    path: "/compress-image",
    title: "Compress Image Online Free – JPG, PNG, and WebP",
    description:
      "Compress image online free. Reduce JPG, PNG, WebP, or AVIF file size in your browser, then download the result.",
    h1: "Compress Image Online",
    summary: "The general compressor for mixed image formats.",
    intro:
      "Use this page when you have a picture that is larger than it needs to be and you want a smaller file without installing an app. Quality, format, dimensions, and an optional size target are all in one place.",
    preset: {},
    whenToUse: [
      "A photo is too heavy for a page, a form, or a message.",
      "You have a mix of JPG and PNG files and want one workflow.",
      "You want to see the size change before you replace the original.",
    ],
    steps: [
      "Add the image by dropping it, browsing, or pasting.",
      "Leave format on Automatic or pick JPG, PNG, WebP, or AVIF.",
      "Set quality. 80% is a balanced starting point for photos.",
      "Compress, compare the preview, and download the new file.",
    ],
    formatNotes:
      "JPG is the usual choice for photographs. PNG keeps hard edges and transparency, but it does not shrink the way a lossy format does. WebP and AVIF can be smaller than JPG when the browser can encode them. GIF input is accepted as a single frame.",
    faqs: [
      {
        question: "Will compressing an image overwrite my original?",
        answer:
          `No. ${brand} creates a new file and your download is a separate copy. The original stays on your device unless you replace it yourself.`,
      },
      {
        question: "What quality should I start with?",
        answer:
          "80% is the default because photographs usually still look clean there. Drop toward 60% if the file is still too large, and keep 90% or more when you need fine detail.",
      },
      {
        question: "Can I resize while compressing?",
        answer:
          "Yes. A maximum width of 1920 pixels is enough for many web layouts and removes pixels you would never display. Fewer pixels usually means a smaller file.",
      },
    ],
    related: ["compress-jpg", "compress-png", "compress-webp", "image-resizer"],
  },
  "compress-jpg": {
    slug: "compress-jpg",
    path: "/compress-jpg",
    title: "Compress JPG Online Free – Reduce JPEG Size",
    description:
      "Compress JPG online free. Shrink JPEG photos in your browser, keep the dimensions, and download a smaller file.",
    h1: "Compress JPG Online",
    summary: "Shrink JPEG photographs with a quality control.",
    intro:
      "JPEG is already a lossy format, so a second save can still get smaller if the first export used a high quality or the photo is larger than you need. This page starts with JPG output so the result stays a JPEG.",
    preset: { outputFormat: "jpeg" },
    whenToUse: [
      "Camera or phone photos are several megabytes each.",
      "A CMS, marketplace, or form rejects the current JPEG.",
      "You need a .jpg file specifically, not a format change.",
    ],
    steps: [
      "Add a .jpg or .jpeg file. Other formats can be saved as JPG too.",
      "Move the quality slider. Each step re-encodes the photo.",
      "Compress and check edges, faces, and flat areas for artifacts.",
      "Download the JPEG if the tradeoff looks acceptable.",
    ],
    formatNotes:
      "JPEG has no transparency. If the source is a PNG with a transparent background, the empty areas are filled with white. For logos and screenshots with text, PNG or WebP is often a better output than another JPEG.",
    faqs: [
      {
        question: "Does compressing a JPG twice damage it?",
        answer:
          "Each lossy save discards a little more information. One pass at a moderate quality is usually fine. Avoid repeated saves of the same JPEG if you still have the original.",
      },
      {
        question: "Why is my JPEG barely smaller?",
        answer:
          "A file that was already exported around quality 70 has little left to remove. Resize it, or accept that the current file is already compact.",
      },
      {
        question: "What is a sensible JPEG quality for the web?",
        answer:
          "70–85% covers most photographs. Product photos with text overlays often need the higher end so letters stay sharp.",
      },
    ],
    related: ["png-to-jpg", "compress-image-to-1mb", "compress-webp", "image-resizer"],
  },
  "compress-png": {
    slug: "compress-png",
    path: "/compress-png",
    title: "Compress PNG Online Free – Smaller PNG Files",
    description:
      "Compress PNG online free. Keep lossless PNG output for graphics, screenshots, and images with transparency.",
    h1: "Compress PNG Online",
    summary: "Optimize PNG graphics without switching to a lossy photo format.",
    intro:
      "PNG compression is lossless. Re-encoding can still tidy the file, but it will not behave like a JPEG quality slider. If the PNG is actually a photograph, converting it to JPG or WebP is what makes the large drop in size.",
    preset: { outputFormat: "png" },
    whenToUse: [
      "The image has a transparent background that must survive.",
      "You are compressing a logo, icon, diagram, or screenshot.",
      "You need pixel-for-pixel output rather than a smaller photo.",
    ],
    steps: [
      "Add the PNG. The output format on this page is PNG.",
      "Resize if the pixel dimensions are larger than the display size.",
      "Compress. The quality slider does not change a PNG.",
      "If the file is still too big, switch the output to WebP or JPG.",
    ],
    formatNotes:
      "PNG supports transparency and sharp edges. It is a poor container for camera photos because those images stay large. WebP can keep transparency and still use lossy compression, which is often the practical next step.",
    faqs: [
      {
        question: "Why did the PNG not get much smaller?",
        answer:
          "The quality control is ignored for PNG. Lossless data cannot throw away detail to hit an arbitrary size. Reduce the dimensions or change the format.",
      },
      {
        question: "Will transparency be preserved?",
        answer:
          "Yes, when the output stays PNG or another format that supports alpha, such as WebP. JPG output replaces transparency with a white background.",
      },
      {
        question: "Should screenshots stay PNG?",
        answer:
          "PNG is a good default for screenshots with text and UI. If you only need a preview, WebP or JPG will be smaller and the text may still be readable.",
      },
    ],
    related: ["jpg-to-png", "png-to-jpg", "compress-webp", "image-resizer"],
  },
  "compress-webp": {
    slug: "compress-webp",
    path: "/compress-webp",
    title: "Compress WebP Online Free",
    description:
      "Compress WebP online free. Adjust quality in your browser and download a smaller WebP file.",
    h1: "Compress WebP Online",
    summary: "Re-encode WebP images for pages and apps that already use the format.",
    intro:
      "WebP can store photographs and graphics, including transparency, in less space than older formats. This page keeps WebP as the output so you can tune the quality of a file you already plan to serve as WebP.",
    preset: { outputFormat: "webp" },
    whenToUse: [
      "A WebP export from a design tool is larger than the page budget.",
      "You want lossy compression and an alpha channel in the same file.",
      "The rest of the site already uses WebP and you do not want a JPG instead.",
    ],
    steps: [
      "Add a WebP image, or another format you want to save as WebP.",
      "Confirm your browser can encode WebP. Current Chrome, Edge, Firefox, and Safari releases can.",
      "Choose a quality and compress.",
      "Download the WebP and spot-check transparent edges if the source had any.",
    ],
    formatNotes:
      "If this browser cannot encode WebP, the tool tells you instead of saving a different format under a .webp name. You can switch the output to JPG in that case. AVIF is sometimes smaller still, but support for encoding it is less consistent.",
    faqs: [
      {
        question: "Is WebP safe to use on a website?",
        answer:
          "Current versions of the major browsers display WebP. Older clients may need a JPG or PNG fallback, which this tool can also create from the same source.",
      },
      {
        question: "Why would I compress a file that is already WebP?",
        answer:
          "Exporters often use a high default quality. A second pass at 75–80% can cut the weight of a hero image without an obvious change at display size.",
      },
      {
        question: "Can WebP keep a transparent background?",
        answer:
          "Yes. Unlike JPG, WebP can store alpha. Check the fringe around the subject after a low quality setting, because lossy alpha can look muddy.",
      },
    ],
    related: ["webp-to-jpg", "compress-png", "compress-jpg", "compress-image"],
  },
  "compress-image-to-1mb": {
    slug: "compress-image-to-1mb",
    path: "/compress-image-to-1mb",
    title: "Compress Image to 1MB Online Free",
    description:
      `Compress image to 1MB online free. ${brand} lowers quality toward that size in your browser. Exact size is not guaranteed.`,
    h1: "Compress Image to 1MB",
    summary: "Aim for a file under about 1 MB for uploads and email.",
    intro:
      "A 1 MB ceiling is a common limit for forms, listings, and email. The target below is set to under 1 MB. The compressor searches quality levels and keeps the highest one that lands at or under the target when the format allows it.",
    preset: { targetPreset: "1mb", outputFormat: "jpeg" },
    whenToUse: [
      "An upload form says the image must be under 1 MB.",
      "You want a photo attachment that is unlikely to bounce.",
      "The original is a multi-megabyte JPEG or a PNG photo.",
    ],
    steps: [
      "Add the image. JPG output is selected because it can hit a size target.",
      "Leave the target on Under 1 MB, or change it if the limit is different.",
      "Compress. The tool tries qualities down to 10%.",
      "Read the actual compressed size before you download. It is approximate.",
    ],
    formatNotes:
      "Final file size may vary depending on image content and format. PNG usually cannot be forced to 1 MB by quality alone. A very large photo may also need a smaller width before it fits.",
    faqs: [
      {
        question: "Will the file be exactly 1 MB?",
        answer:
          "No. The search stops at the highest quality that is under the target, or at the smallest result it could make. Busy photos and lossless formats can miss the number.",
      },
      {
        question: "What if it is still over 1 MB?",
        answer:
          "Set a maximum width, such as 1600 or 1920 pixels, and compress again. Removing pixels is often more effective than the last few quality steps.",
      },
      {
        question: "Is 1 MB small enough for a web hero?",
        answer:
          "It is acceptable for a large photograph, but many pages do better near 200–500 KB for an image that is not full-bleed. Use the 500 KB tool if that is the budget.",
      },
    ],
    related: ["compress-image-to-500kb", "compress-jpg", "image-resizer", "png-to-jpg"],
  },
  "compress-image-to-500kb": {
    slug: "compress-image-to-500kb",
    path: "/compress-image-to-500kb",
    title: "Compress Image to 500KB Online Free",
    description:
      "Compress image to 500KB online free. Reduce quality and dimensions in your browser for stricter upload limits.",
    h1: "Compress Image to 500KB",
    summary: "A tighter size target for previews, forms, and page images.",
    intro:
      "500 KB is a stricter budget than 1 MB and is easier to reach when the image is also resized. This page selects that target up front. Treat the result as approximate, then check the reported file size.",
    preset: { targetPreset: "500kb", outputFormat: "jpeg", resizeMode: "maxWidth", resizeValue: 1920 },
    whenToUse: [
      "A form allows only a few hundred kilobytes.",
      "You are preparing a gallery of many photos and the total weight matters.",
      "The image will be shown around 1600–1920 pixels wide, not printed.",
    ],
    steps: [
      "Add the image. A 1920 pixel maximum width is already set and can be changed.",
      "Keep the target on Under 500 KB.",
      "Compress and inspect the preview at the size you will actually display.",
      "Download only if faces, text, and edges still look acceptable.",
    ],
    formatNotes:
      "Hitting 500 KB with a lossless PNG is unlikely for a photograph. JPG and WebP are the formats that can trade quality for that budget. Illustrations with flat color may already be under 500 KB as PNG.",
    faqs: [
      {
        question: "Why does 500 KB look worse than 1 MB?",
        answer:
          "The encoder has to discard more detail, especially in foliage, hair, and gradients. If the preview looks blotchy, raise the width limit or accept a larger file.",
      },
      {
        question: "Should I resize before chasing 500 KB?",
        answer:
          "Yes. A 4000 pixel photo has more samples than a typical layout needs. The maximum width on this page is a starting point, not a rule.",
      },
      {
        question: "Can I use WebP instead of JPG for the same target?",
        answer:
          "Yes. Change the output format to WebP if you are publishing on the web and the browser can encode it. The size search works the same way.",
      },
    ],
    related: ["compress-image-to-1mb", "image-resizer", "compress-webp", "compress-jpg"],
  },
  "image-resizer": {
    slug: "image-resizer",
    path: "/image-resizer",
    title: "Free Image Resizer Online – Resize JPG, PNG, WebP",
    description:
      "Free image resizer online. Change width, height, or percentage for JPG, PNG, and WebP, and keep the aspect ratio.",
    h1: "Free Image Resizer",
    summary: "Change pixel dimensions without a separate desktop editor.",
    intro:
      "Resizing removes or interpolates pixels. For the web, shrinking a photo to the size you display is often the biggest file-size win, even before you lower quality. This page opens on a maximum width of 1920 pixels, which you can replace.",
    preset: { resizeMode: "maxWidth", resizeValue: 1920, quality: 90 },
    whenToUse: [
      "A camera photo is 4000 pixels wide and the layout only needs 1600.",
      "You need a consistent maximum edge for a set of pictures.",
      "You want a percentage scale, such as half the original size.",
    ],
    steps: [
      "Add an image and check its current dimensions in the queue.",
      "Pick a resize mode: width, height, maximum edge, or percentage.",
      "Leave aspect ratio on unless you intentionally want a stretched image.",
      "Compress to apply the resize, then download. The new dimensions are shown on the result.",
    ],
    formatNotes:
      "The resizer outputs a normal image file, not a layered document. Aspect ratio stays locked for maximum width and maximum height. Custom width or height can stretch the image if you turn aspect ratio off. Output is limited to what the browser canvas can encode, including a maximum edge of 8192 pixels.",
    faqs: [
      {
        question: "Does resizing reduce file size?",
        answer:
          "Shrinking usually does, because there are fewer pixels to store. Enlarging a small image makes a bigger file and does not add real detail.",
      },
      {
        question: "What does maximum width do?",
        answer:
          "If the photo is wider than the number you enter, it is scaled down and the height follows. Smaller photos are left alone, so a batch of mixed sizes is not upscaled.",
      },
      {
        question: "Can I change only the height?",
        answer:
          "Yes. Choose custom height or maximum height. With aspect ratio on, the width is calculated from the original proportions.",
      },
    ],
    related: ["compress-image", "compress-image-to-1mb", "compress-jpg", "compress-png"],
  },
  "jpg-to-png": {
    slug: "jpg-to-png",
    path: "/jpg-to-png",
    title: "JPG to PNG Converter Online Free",
    description: "JPG to PNG converter online free. Save a JPEG as a PNG file in your browser.",
    h1: "JPG to PNG Converter",
    summary: "Make a PNG copy of a JPEG without uploading it.",
    intro:
      "Converting JPG to PNG does not restore detail that JPEG already discarded, and the PNG is often larger. It is still the right move when a tool in your workflow only accepts PNG, or you want to start a lossless edit from a JPEG.",
    preset: { outputFormat: "png", quality: 100 },
    whenToUse: [
      "A printer, cutter, or older editor asks for PNG.",
      "You want to add transparency later in another program.",
      "You need a lossless container from this point forward.",
    ],
    steps: [
      "Add the JPG. Output is set to PNG.",
      "Resize first if you do not need the full pixel dimensions.",
      "Convert. The quality slider does not apply to PNG.",
      "Download the PNG and expect a larger file than the JPEG.",
    ],
    formatNotes:
      "The PNG contains the pixels visible in the JPEG, including any compression artifacts that were already there. It will not invent a transparent background. Use PNG to JPG if your goal is a smaller photo instead.",
    faqs: [
      {
        question: "Why is the PNG bigger than the JPG?",
        answer:
          "PNG stores the image without the JPEG quality reduction. That fidelity takes more bytes. The conversion is about format compatibility, not smaller files.",
      },
      {
        question: "Will the PNG look sharper than the JPG?",
        answer:
          "No. The conversion copies the current pixels. Blurry JPEG artifacts remain visible.",
      },
      {
        question: "Can I convert several JPGs to PNG?",
        answer:
          "Yes. Add them together, leave the output on PNG, and download the batch as a ZIP when it is small enough to archive locally.",
      },
    ],
    related: ["png-to-jpg", "compress-png", "compress-jpg", "image-resizer"],
  },
  "png-to-jpg": {
    slug: "png-to-jpg",
    path: "/png-to-jpg",
    title: "PNG to JPG Converter Online Free",
    description: "PNG to JPG converter online free. Turn large PNG photos into smaller JPEG files in your browser.",
    h1: "PNG to JPG Converter",
    summary: "Export a PNG as a JPEG when you need a smaller photograph.",
    intro:
      "PNG is a common export from screenshots and design tools, but it is bulky for photographs. Saving as JPG is the direct way to cut that size. Transparent pixels are placed on white because JPEG cannot store transparency.",
    preset: { outputFormat: "jpeg", quality: 80 },
    whenToUse: [
      "A photo was saved as PNG and is many megabytes.",
      "A website, email draft, or marketplace wants a JPG.",
      "The image has no transparency you need to keep.",
    ],
    steps: [
      "Add the PNG. Output is set to JPG and quality to 80%.",
      "Lower the quality if the first result is still heavy.",
      "Check that white replaced any transparent areas in an acceptable way.",
      "Download the .jpg file.",
    ],
    formatNotes:
      "Logos, line icons, and screenshots with small text often look worse as JPG and may not shrink as much as a photo does. Keep those as PNG or try WebP. Photographs and scans are the files that benefit most.",
    faqs: [
      {
        question: "What happens to a transparent background?",
        answer:
          `JPEG has no alpha channel. ${brand} fills those pixels with white before encoding so the file is a normal photo.`,
      },
      {
        question: "Which quality should I use for a PNG photo?",
        answer:
          "Start at 80%. If the PNG was a flat graphic rather than a photo, try WebP or keep PNG instead of pushing JPEG quality down.",
      },
      {
        question: "Can I also shrink the dimensions?",
        answer:
          "Yes. Set a maximum width before you convert. A 4000 pixel PNG photo becomes much smaller at 1600 pixels wide even at a high JPEG quality.",
      },
    ],
    related: ["jpg-to-png", "compress-jpg", "compress-image-to-1mb", "compress-webp"],
  },
  "webp-to-jpg": {
    slug: "webp-to-jpg",
    path: "/webp-to-jpg",
    title: "WebP to JPG Converter Online Free",
    description: "WebP to JPG converter online free. Save a JPEG copy in your browser for tools that do not accept WebP.",
    h1: "WebP to JPG Converter",
    summary: "Create a JPEG from a WebP image for broader compatibility.",
    intro:
      "WebP is efficient on the web and awkward in some email clients, office documents, and older editors. This conversion makes a JPEG copy locally. Use it when the other party asked for JPG, not when you are trying to make the file smaller than WebP.",
    preset: { outputFormat: "jpeg", quality: 85 },
    whenToUse: [
      "Someone cannot open a .webp attachment.",
      "A slide deck, CMS, or print workflow only lists JPEG.",
      "You need a widely supported copy and can allow a slightly larger file.",
    ],
    steps: [
      "Add the WebP file. JPG output and 85% quality are selected.",
      "Adjust quality if you need the JPEG to be smaller or cleaner.",
      "Convert and look at flat backgrounds, where JPEG blocks are easiest to see.",
      "Download the .jpg file.",
    ],
    formatNotes:
      "A high-quality JPEG made from WebP is often larger than the WebP you started with. That is expected. Transparency in the WebP is flattened onto white. If you need the transparent background, convert to PNG instead.",
    faqs: [
      {
        question: "Why is the JPG larger than the WebP?",
        answer:
          "WebP is usually more efficient at the same visual quality. The JPG exists here for compatibility. Lower the quality slider if the byte size matters more than matching the WebP.",
      },
      {
        question: "Can every browser open the WebP I want to convert?",
        answer:
          "Current Chrome, Edge, Firefox, and Safari can decode WebP. If decoding fails, the page shows an error instead of a broken download.",
      },
      {
        question: "How do I keep transparency?",
        answer:
          "Do not use JPG for that file. Change the output format to PNG, which can store a transparent background.",
      },
    ],
    related: ["compress-webp", "png-to-jpg", "jpg-to-png", "compress-jpg"],
  },
};

export const toolPageList = Object.values(toolPages);
