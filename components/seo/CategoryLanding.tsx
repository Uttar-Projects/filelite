import Link from "next/link";
import { FaqList } from "@/components/seo/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { breadcrumbSchema, faqSchema, itemListSchema, webApplicationSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";
import { toolsByCategory } from "@/lib/tools/catalog";
import { seoCategories } from "@/lib/tools/categories";

export function CategoryLanding({ categoryId }: { categoryId: (typeof seoCategories)[number]["id"] }) {
  const page = seoCategories.find((category) => category.id === categoryId);
  if (!page) return null;
  const tools = toolsByCategory(page.id).filter((tool) => tool.status === "available" && tool.href);
  const faqs = [
    {
      question: `Are the ${page.navLabel.toLowerCase()} tools free?`,
      answer: `Yes. ${siteConfig.name} does not charge for these browser tools and does not require an account.`,
    },
    {
      question: "Do my files or text get uploaded?",
      answer:
        "Normal use stays in your browser. Opening the website still downloads the page itself, the same way any site works.",
    },
    {
      question: "Can I use these tools on a phone?",
      answer: "Yes. The layout is built for a phone-sized screen as well as a desktop.",
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: page.h1, path: page.path },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={itemListSchema(tools.map((tool) => ({ name: tool.name, path: tool.href ?? page.path })))}
      />
      <JsonLd
        data={webApplicationSchema({
          name: page.h1,
          description: page.description,
          path: page.path,
        })}
      />
      <Container className="py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span aria-hidden> / </span>
          <Link href="/tools" className="hover:text-ink">
            Tools
          </Link>
          <span aria-hidden> / </span>
          <span>{page.h1}</span>
        </nav>
        <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">{page.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{page.intro}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {tools.map((tool) => (
            <li key={tool.href} className="flex flex-col rounded-3xl border border-line bg-card p-5">
              <h2 className="text-xl">{tool.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">{tool.summary}</p>
              <Link href={tool.href ?? "/tools"} className={`${buttonClass("primary")} mt-4 self-start`}>
                Open
              </Link>
            </li>
          ))}
        </ul>
        <section className="mt-12">
          <h2 className="text-2xl">FAQ</h2>
          <div className="mt-4">
            <FaqList items={faqs} />
          </div>
        </section>
      </Container>
    </>
  );
}
