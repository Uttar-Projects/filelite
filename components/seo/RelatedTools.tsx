import Link from "next/link";
import { toolPages } from "@/lib/content/tool-pages";

export function RelatedTools({ slugs }: { slugs: string[] }) {
  const pages = slugs.map((slug) => toolPages[slug]).filter((page) => page !== undefined);

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {pages.map((page) => (
        <li key={page.slug}>
          <Link
            href={page.path}
            className="block h-full rounded-3xl border border-line bg-card p-5"
          >
            <span className="font-semibold">{page.h1}</span>
            <span className="mt-1 block text-sm leading-6 text-muted">{page.summary}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
