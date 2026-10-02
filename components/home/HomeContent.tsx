import Link from "next/link";
import { FaqList } from "@/components/seo/FaqList";
import { RelatedTools } from "@/components/seo/RelatedTools";
import { AdSlot } from "@/components/ui/AdSlot";
import { Container } from "@/components/ui/Container";
import { homeFaqs, homeSteps, whyCompress } from "@/lib/content/home";
import { siteConfig } from "@/lib/seo/site";

const formats = ["JPG", "PNG", "WebP", "AVIF", "GIF", "HEIC"];

export function HomeContent() {
  return (
    <>
      <section aria-labelledby="formats-heading" className="border-t border-line">
        <Container className="py-10">
          <h2 id="formats-heading" className="text-2xl">
            Supported formats
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {formats.map((format) => (
              <li key={format} className="rounded-full border border-line bg-card px-3 py-2 text-sm font-semibold">
                {format}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            JPG, PNG, WebP, and AVIF can be saved when this browser can encode them. GIF is read as a single frame.
            HEIC opens only if the browser can decode it.
          </p>
        </Container>
      </section>

      <section aria-labelledby="features-heading">
        <Container className="py-4 pb-12">
          <h2 id="features-heading" className="text-2xl">
            Built for everyday image work
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Fast", "Processing starts in the browser, so there is no upload wait for a normal image."],
              ["Private", "The compressor does not send your pictures to a server."],
              ["Free", "No account and no payment for local compression."],
              ["No installation", "It runs in the browser you already have."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-3xl border border-line bg-card p-5">
                <h3 className="text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="how-heading" className="border-t border-line">
        <Container className="py-12">
          <h2 id="how-heading" className="text-2xl">
            How it works
          </h2>
          <ol className="mt-5 grid gap-3 md:grid-cols-4">
            {homeSteps.map((step, index) => (
              <li key={step.title} className="rounded-3xl border border-line bg-card p-5">
                <p className="text-sm font-semibold text-accent">{index + 1}. {step.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <AdSlot position="content" />

      <section aria-labelledby="why-heading" className="border-t border-line">
        <Container className="py-12">
          <h2 id="why-heading" className="text-2xl">
            Why compress images?
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {whyCompress.map((item) => (
              <article key={item.title}>
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </article>
            ))}
          </div>
          <h3 className="mt-8 text-lg">What is an image compressor?</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            An image compressor rewrites a picture so it takes fewer bytes. Lossy compressors, such as JPEG, drop
            detail that is hard to see. Lossless compressors, such as PNG, keep every pixel and usually save less
            space. {siteConfig.name} does that rewrite on your device, then shows the old and new sizes so you can decide
            whether to keep the result.
          </p>
        </Container>
      </section>

      <section aria-labelledby="faq-heading" className="border-t border-line">
        <Container className="py-12">
          <h2 id="faq-heading" className="text-2xl">
            FAQ
          </h2>
          <div className="mt-5">
            <FaqList items={homeFaqs} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="related-heading" className="border-t border-line">
        <Container className="py-12">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-heading" className="text-2xl">
              Related tools
            </h2>
            <Link href="/tools" className="text-sm font-semibold text-accent">
              All tools
            </Link>
          </div>
          <div className="mt-5">
            <RelatedTools slugs={["compress-jpg", "compress-png", "image-resizer", "png-to-jpg"]} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="more-tools-heading" className="border-t border-line">
        <Container className="py-12">
          <h2 id="more-tools-heading" className="text-2xl">
            More free browser tools
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            The compressor is the homepage. The rest of {siteConfig.name} is a set of text, developer, and data tools
            that also stay on your device.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["/word-counter", "Word counter", "Count words, characters, and reading time."],
              ["/json-formatter", "JSON formatter", "Beautify, minify, and validate JSON."],
              ["/password-generator", "Password generator", "Create a random password locally."],
              ["/color-converter", "Color converter", "Convert HEX, RGB, and HSL."],
              ["/unit-converter", "Unit converter", "Length, weight, temperature, and file size."],
              ["/timestamp-converter", "Timestamp converter", "Unix time to local date and back."],
            ].map(([href, name, summary]) => (
              <li key={href}>
                <Link href={href} className="block h-full rounded-3xl border border-line bg-card p-5">
                  <span className="font-semibold">{name}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted">{summary}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm">
            <Link href="/tools" className="font-semibold text-accent">
              Browse every tool
            </Link>
            {" · "}
            <Link href="/text-tools" className="font-semibold text-accent">
              Text
            </Link>
            {" · "}
            <Link href="/developer-tools" className="font-semibold text-accent">
              Developer
            </Link>
            {" · "}
            <Link href="/image-tools" className="font-semibold text-accent">
              Image
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
