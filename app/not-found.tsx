import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/seo/site";
import { seoCategories } from "@/lib/tools/categories";

export const metadata: Metadata = {
  title: "Page not found",
  description: `That address is not part of ${siteConfig.name}. Browse the free tools instead.`,
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <Container className="py-16">
      <h1 className="text-4xl">Page not found</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
        That address is not part of {siteConfig.name}. The compressor and the other free tools are still here.
      </p>
      <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
        <Link href="/" className="text-accent">
          Image compressor
        </Link>
        <Link href="/tools" className="text-accent">
          All tools
        </Link>
      </div>
      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {seoCategories.map((category) => (
          <li key={category.path}>
            <Link href={category.path} className="text-sm font-semibold text-accent">
              {category.h1}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
