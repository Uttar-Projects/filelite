import Link from "next/link";
import { FaqList } from "@/components/seo/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/ui/AdSlot";
import { Container } from "@/components/ui/Container";
import { utilityPages } from "@/lib/content/utility-pages";
import { breadcrumbSchema, faqSchema, webApplicationSchema } from "@/lib/seo/schema";
import { categoryLabels, toolByHref } from "@/lib/tools/catalog";
import { categoryPath } from "@/lib/tools/categories";

export function UtilityLanding({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const page = utilityPages[slug];
  if (!page) return null;
  const related = page.related
    .map((item) => utilityPages[item])
    .filter((item): item is NonNullable<typeof item> => item !== undefined);
  const tool = toolByHref(page.path);
  const categoryHref = tool ? categoryPath(tool.category) : undefined;
  const categoryName = tool ? categoryLabels[tool.category] : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          ...(categoryHref && categoryName ? [{ name: categoryName, path: categoryHref }] : []),
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
            {categoryHref && categoryName ? (
              <>
                <span aria-hidden> / </span>
                <Link href={categoryHref} className="hover:text-ink">
                  {categoryName}
                </Link>
              </>
            ) : null}
            <span aria-hidden> / </span>
            <span>{page.h1}</span>
          </nav>
          <p className="mt-4 text-sm font-semibold text-accent">
            {categoryLabels[toolByHref(page.path)?.category ?? "text"]}
          </p>
          <h1 className="mt-2 max-w-3xl text-4xl sm:text-5xl">{page.h1}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{page.intro}</p>
          <p className="mt-2 text-sm font-semibold">Free. Private. Runs in your browser.</p>
          <div className="mt-8">{children}</div>
        </Container>
      </section>
      <AdSlot position="content" />
      <Container className="space-y-10 py-12">
        <section>
          <h2 className="text-2xl">When to use it</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
            {page.when.map((item) => (
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
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{page.notes}</p>
        </section>
        <section>
          <h2 className="text-2xl">FAQ</h2>
          <div className="mt-4">
            <FaqList items={page.faqs} />
          </div>
        </section>
        <section>
          <h2 className="text-2xl">Related tools</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={item.path} className="block h-full rounded-3xl border border-line bg-card p-5">
                  <span className="font-semibold">{item.h1}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
