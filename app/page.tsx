import { Compressor } from "@/components/compression/Compressor";
import { HomeContent } from "@/components/home/HomeContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { homeFaqs } from "@/lib/content/home";
import { faqSchema, webApplicationSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={webApplicationSchema({
          name: "Free Image Compressor",
          alternateName: siteConfig.name,
          description: siteConfig.description,
          path: "/",
          applicationCategory: "MultimediaApplication",
          browserRequirements: "Requires a modern browser with canvas image encoding.",
        })}
      />
      <JsonLd data={faqSchema(homeFaqs)} />
      <section className="hero-glow border-b border-line">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            {siteConfig.name} · free · no sign-up
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[0.95] sm:text-6xl">Free Image Compressor</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
            Compress JPG, PNG, WebP and other images without installing software.
          </p>
          <p className="mt-3 text-sm font-semibold text-accent">Fast. Private. Free.</p>
          <div id="compressor" className="mt-8">
            <Compressor />
          </div>
        </Container>
      </section>
      <HomeContent />
    </>
  );
}
