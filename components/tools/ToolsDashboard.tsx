"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Mark } from "@/components/brand/Mark";
import { siteConfig } from "@/lib/seo/site";
import {
  availableTools,
  dashboardCategories,
  instrumentCount,
  instrumentTools,
  toolsByCategory,
} from "@/lib/tools/catalog";
import { categoryById, seoCategories } from "@/lib/tools/categories";

const featuredHrefs = [
  "/word-counter",
  "/case-converter",
  "/slug-generator",
  "/lorem-ipsum",
  "/text-diff",
  "/markdown-preview",
  "/json-formatter",
  "/base64",
  "/url-encoder",
];

function matchesQuery(query: string, name: string, summary: string, href: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return `${name} ${summary} ${href}`.toLowerCase().includes(needle);
}

export function ToolsDashboard() {
  const params = useSearchParams();
  const urlQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);
  const instruments = instrumentTools();
  const allTools = availableTools();
  const count = instrumentCount();
  const results = useMemo(
    () => allTools.filter((tool) => matchesQuery(query, tool.name, tool.summary, tool.href ?? "")),
    [allTools, query],
  );
  const featured = featuredHrefs
    .map((href) => allTools.find((tool) => tool.href === href))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined);
  const exploring = dashboardCategories;
  const searching = query.trim().length > 0;

  return (
    <div>
      <section className="hero-glow border-b border-line">
        <div className="mx-auto max-w-4xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            {count} precision tools · free · no sign-up
          </p>
          <h1 className="mt-6 text-5xl leading-[0.95] sm:text-7xl">
            The workshop of <span className="text-accent">free online tools</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted">
            Fast, private, browser-based utilities for writers, developers and tinkerers. No clutter, no friction —
            just the instrumental.
          </p>
          <form
            id="search"
            className="mx-auto mt-8 max-w-xl"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="tool-search">
              Search tools
            </label>
            <div className="flex items-center gap-3 rounded-full border border-line bg-card px-5 py-3">
              <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-muted" aria-hidden>
                <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M13 13.5 17 17.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                id="tool-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${count} tools — try “json”, “password”, “color”…`}
                className="min-h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
          </form>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted">
            <li>Runs in your browser</li>
            <li>Instant results</li>
            <li>No tracking</li>
          </ul>
        </div>
      </section>

      <section aria-label="Trending tools" className="overflow-hidden border-b border-line py-4">
        <div className="mb-3 px-4 text-[11px] font-semibold tracking-[0.2em] text-muted uppercase sm:px-6">
          Trending tools
        </div>
        <div className="ticker-track flex w-max gap-6 pr-6">
          {[...instruments, ...instruments].map((tool, index) => (
            <Link
              key={`${tool.href}-${index}`}
              href={tool.href ?? "/tools"}
              className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-muted hover:text-ink"
            >
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              {tool.name}
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {searching ? (
          <section>
            <h2 className="text-2xl">Results</h2>
            <p className="mt-2 text-sm text-muted">
              {results.length} tool{results.length === 1 ? "" : "s"} matching “{query.trim()}”.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((tool) => (
                <li key={tool.href}>
                  <ToolCard name={tool.name} summary={tool.summary} href={tool.href ?? "/tools"} />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <>
            <section id="explore">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl">Explore by category</h2>
                <Link href="/" className="text-sm font-semibold text-accent hover:text-ink">
                  Image compressor
                </Link>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {exploring.map((id) => {
                  const category = categoryById(id);
                  const tools = toolsByCategory(id).filter((tool) => tool.status === "available" && tool.href);
                  if (!category) return null;
                  return (
                    <li key={id} className="rounded-3xl border border-line bg-card p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <Link href={category.path} className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                          {category.navLabel}
                        </Link>
                        <span className="text-xs text-muted">{tools.length}</span>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {tools.map((tool) => (
                          <li key={tool.href}>
                            <Link href={tool.href ?? category.path} className="text-sm hover:text-accent">
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="mt-14">
              <h2 className="text-2xl">Featured tools</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((tool) => (
                  <li key={tool.href}>
                    <ToolCard name={tool.name} summary={tool.summary} href={tool.href ?? "/tools"} />
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>

      <div className="border-y border-line bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/tools" className="flex items-center gap-2 text-sm font-semibold">
            <Mark className="size-6" />
            {siteConfig.name}
          </Link>
          <span className="text-sm text-muted">Dashboard</span>
          <span className="text-sm text-muted">{count} tools</span>
          <nav aria-label="Categories" className="flex flex-wrap gap-3 text-sm text-muted">
            {seoCategories.map((category) => (
                <Link key={category.path} href={category.path} className="hover:text-ink">
                  {category.navLabel}
                </Link>
              ))}
          </nav>
          <button
            type="button"
            className="ml-auto text-sm text-muted hover:text-ink"
            onClick={() => document.getElementById("tool-search")?.focus()}
          >
            Search tools
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolCard({ name, summary, href }: { name: string; summary: string; href: string }) {
  return (
    <Link href={href} className="block h-full rounded-3xl border border-line bg-card p-5 transition hover:border-ink/20">
      <h3 className="text-lg">{name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{summary}</p>
    </Link>
  );
}
