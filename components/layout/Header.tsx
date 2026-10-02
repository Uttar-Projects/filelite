"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Mark } from "@/components/brand/Mark";
import { primaryNav } from "@/lib/seo/navigation";
import { siteConfig } from "@/lib/seo/site";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper">
      <div className="flex w-full min-w-0 items-center gap-3 overflow-hidden px-4 py-2.5 sm:gap-4 sm:px-6">
        <Link href="/tools" className="flex shrink-0 items-center gap-2.5 text-[15px] font-semibold tracking-tight">
          <Mark className="size-7" />
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary" className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] sm:flex [&::-webkit-scrollbar]:hidden">
          {primaryNav.map((item) => (
            <NavLink key={item.label} href={item.href} label={item.label} pathname={pathname} />
          ))}
        </nav>
        <Suspense fallback={<SearchShell />}>
          <HeaderSearch />
        </Suspense>
      </div>
      <nav aria-label="Sections" className="flex gap-1 overflow-x-auto px-4 pb-2.5 [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
        {primaryNav.map((item) => (
          <NavLink key={item.label} href={item.href} label={item.label} pathname={pathname} />
        ))}
      </nav>
    </header>
  );
}

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const current =
    href === "/"
      ? pathname === "/" || pathname.startsWith("/compress")
      : !href.includes("#") && pathname === href;
  const compressor = href === "/";
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`shrink-0 rounded-md px-2 py-1.5 text-[13px] sm:text-sm ${
        current ? "font-semibold text-ink" : compressor ? "font-semibold text-accent hover:text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

function SearchShell() {
  return <div className="ml-auto h-9 w-40 shrink-0 rounded-lg border border-line bg-card sm:ml-0 sm:w-48 lg:w-64" />;
}

function HeaderSearch() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  return (
    <form action="/tools" className="ml-auto w-40 shrink-0 sm:ml-0 sm:w-48 lg:w-64" role="search">
      <label className="flex h-9 items-center gap-2 rounded-lg border border-line bg-card px-3">
        <span className="sr-only">Search tools</span>
        <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-muted" aria-hidden>
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13 13.5 17 17.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          key={q}
          name="q"
          defaultValue={q}
          placeholder="Search tools..."
          className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </label>
    </form>
  );
}
