import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: `Terms for using the ${siteConfig.name} free online tools, including the image compressor and browser utilities.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-4xl">Terms</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
        <p>
          {siteConfig.name} is provided as a free browser toolkit. You are responsible for the images, text, and other
          files you process and for having the rights to use them. Do not use the site to handle files you are not
          allowed to copy or transform.
        </p>
        <p>
          Compression changes files. Check the preview before you replace an original. Target sizes are approximate,
          and a browser can fail on images that are too large for its memory.
        </p>
        <p>
          The tools are provided as-is, without a warranty of fitness for a particular upload limit, print workflow, or
          archive. Planned tools listed on the site are not part of the product until a working page exists.
        </p>
      </div>
    </Container>
  );
}
