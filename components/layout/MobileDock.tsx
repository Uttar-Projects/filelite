"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/random", label: "Random", accent: true },
] as const;

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick"
      className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-card/90 px-2 py-1.5 shadow-card backdrop-blur md:hidden"
    >
      {items.map((item) => {
        const current = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              "accent" in item && item.accent
                ? "bg-accent text-accent-ink"
                : current
                  ? "text-ink"
                  : "text-muted"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
