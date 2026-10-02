import Link from "next/link";
import { Mark } from "@/components/brand/Mark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { resourceLinks } from "@/lib/seo/navigation";
import { siteConfig } from "@/lib/seo/site";
import { instrumentTools } from "@/lib/tools/catalog";

export function Footer() {
  const tools = instrumentTools().slice().sort((left, right) => left.name.localeCompare(right.name));

  return (
    <footer className="mt-auto border-t border-line bg-paper pb-24 md:pb-0">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="flex items-center gap-2 text-lg font-semibold">
              <Mark className="size-7" />
              {siteConfig.name}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              A workshop of underrated free online tools. Everything runs in your browser — private, instant, no
              sign-up.
            </p>
          </div>
          <p className="text-sm font-medium text-muted">Open &amp; free</p>
        </div>
        <ul className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.href}>
              <Link href={tool.href ?? "/tools"} className="text-sm text-muted hover:text-ink">
                {tool.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {siteConfig.name}. All tools are free. Built for speed and privacy. No
            tracking of your data.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
            {resourceLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ink">
                {link.label}
              </Link>
            ))}
            <ThemeToggle compact />
          </div>
        </div>
      </div>
    </footer>
  );
}
