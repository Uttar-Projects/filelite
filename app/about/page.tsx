import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: `About ${siteConfig.name} – Free Browser Tools`,
  description: `${siteConfig.name} is a free online toolkit: image compressor, word counter, JSON formatter, and more. Every working tool runs in your browser.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-4xl">About {siteConfig.name}</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
        <p>
          {siteConfig.name} is a free online toolkit. The dashboard covers text, developer, crypto, color, data, and
          time instruments, plus the image compressor. Every working tool runs in your browser.
        </p>
        <p>
          The site is structured so later tools can share the same navigation, pages, and processing boundaries.
          Planned PDF and 3D tools are listed on the tools page and are not available yet.
        </p>
        <p>
          <Link href="/tools" className="font-semibold text-accent">
            Browse the tools
          </Link>{" "}
          or start with the{" "}
          <Link href="/compress-image" className="font-semibold text-accent">
            image compressor
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
