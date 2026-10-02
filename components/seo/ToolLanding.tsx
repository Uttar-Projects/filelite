import Link from "next/link";
import { Compressor } from "@/components/compression/Compressor";
import { FaqList } from "@/components/seo/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedTools } from "@/components/seo/RelatedTools";
import { Container } from "@/components/ui/Container";
import type { ToolPageContent } from "@/lib/content/tool-pages";
import { breadcrumbSchema, faqSchema, webApplicationSchema } from "@/lib/seo/schema";

export function ToolLanding({ page }: { page: ToolPageContent }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Image tools", path: "/image-tools" },
          { name: page.h1, path: page.path },
        ])}
      />
      <JsonLd data={faqSchema(page.faqs)} />
      <JsonLd
        data={webApplicationSchema({
          name: page.h1,
          alternateName: page.title,
          description: page.description,
          path: page.path,
          applicationCategory: "MultimediaApplication",
          browserRequirements: "Requires a modern browser with canvas image encoding.",
        })}
      />
      <section className="border-b border-line">
        <Container className="py-10">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden> / </span>
            <Link href="/tools" className="hover:text-ink">
              Tools
            </Link>
            <span aria-hidden> / </span>
            <Link href="/image-tools" className="hover:text-ink">
              Image tools
            </Link>
            <span aria-hidden> / </span>
            <span>{page.h1}</span>
          </nav>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">{page.h1}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{page.intro}</p>
          <p className="mt-2 text-sm font-semibold">This tool is free and runs in your browser.</p>
          <div id="compressor" className="mt-8">
            <Compressor preset={page.preset} />
          </div>
        </Container>
      </section>
      <Container className="space-y-10 py-12">
        <section>
          <h2 className="text-2xl">When to use it</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
            {page.whenToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl">How it works</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
            {page.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="text-2xl">Supported formats</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{page.formatNotes}</p>
        </section>
        <section>
          <h2 className="text-2xl">FAQ</h2>
          <div className="mt-4">
            <FaqList items={page.faqs} />
          </div>
        </section>
        <section>
          <h2 className="text-2xl">Related tools</h2>
          <div className="mt-4">
            <RelatedTools slugs={page.related} />
          </div>
        </section>
      </Container>
    </>
  );
}
