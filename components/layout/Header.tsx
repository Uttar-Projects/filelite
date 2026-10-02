"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/brand/Mark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { siteConfig } from "@/lib/seo/site";

export function Header() {
  const pathname = usePathname();
  const onWorkshop = pathname === "/tools";

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/tools" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
          <Mark className="size-7" />
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 sm:flex">
          <Link
            href="/tools"
            aria-current={onWorkshop ? "page" : undefined}
            className={`rounded-full px-3 py-2 text-sm font-medium ${onWorkshop ? "text-ink" : "text-muted hover:text-ink"}`}
          >
            Dashboard
          </Link>
          <Link href="/" className="rounded-full px-3 py-2 text-sm font-medium text-muted hover:text-ink">
            Compressor
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/tools#search"
            className="hidden rounded-full border border-line px-3 py-2 text-sm text-muted hover:text-ink sm:inline-flex"
          >
            Search tools
          </Link>
          <ThemeToggle compact />
        </div>
      </div>
    </header>
  );
}
